vm = require "vm"
eff = require "eff"

makeArgString = ( n ) ->
  return "" if n is 0
  args = []
  for num in [0..n - 1]
    args.push String.fromCharCode num % 26 + 97
  args.join ", "

makeWrapperCode = ( n ) ->
  args = makeArgString n
  "var wrap#{ String(n).toUpperCase() } = function (fn) { return function (#{ args }) { return fn.apply(this, arguments); }; };"

codeToEval = ""
for i in [0..10]
  codeToEval += makeWrapperCode( i )

codeToEval += "var funcProto = Function.prototype;"
codeToEval += "var FuncCtor = Function;"

ctx = vm.createContext()
vm.runInContext( codeToEval, ctx )
funcProto = ctx.funcProto
FuncCtor = ctx.FuncCtor

wrappers = ( ctx["wrap#{ i }"] for i in [0..10] )

isOtherFunc = ( fn ) ->
  typeof fn is "function" and fn instanceof FuncCtor

isRegFunc = ( fn ) ->
  typeof fn is "function" and fn instanceof Function


wrap = ( fn ) ->
  unless wrappers[fn.length]
    throw new RangeError "That function takes too many damn arguments"
  wrappers[fn.length] fn

wrapToLength = ( len, fn ) ->
  unless wrappers[len]
    throw new RangeError "That length isn't gonna work"
  wrappers[len] fn

waterhouse = ( fn ) ->
  wrapped = wrap( fn )
  wrapToLength fn.length, ->
    ret = wrapped.apply this, arguments
    if isRegFunc( ret ) then wrap( ret ) else ret

waterhouse.extend = ( methods ) ->
  for key, val of methods
    do ( key, val ) ->
      funcProto[key] = if isRegFunc( val ) then wrap( val ) else val
  return

waterhouse.funcProto = funcProto
waterhouse.FuncCtor = FuncCtor

for key, val of eff
  do ( key, val ) ->
    funcProto[key] = ->
      args = new Array arguments.length + 1
      args[0] = this
      args[i + 1] = arg for arg, i in arguments
      val.apply null, args

console.log Object.keys wrappers


module.exports = waterhouse

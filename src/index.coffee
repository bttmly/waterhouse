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
code = vm.createScript( codeToEval )
code.runInContext( ctx )
proto = ctx.funcProto

wrappers = {}
for i in [0..10]
  wrappers[i] = ctx["wrap#{ i }"]

wrap = ( fn ) ->
  unless wrappers[fn.length]
    throw new RangeError "That function takes too many damn arguments"
  wrappers[fn.length] fn

wrapLen = ( len, fn ) ->
  unless wrappers[len]
    throw new RangeError "That length isn't gonna work"
  wrappers[len] fn

waterhouse = ( fn ) ->
  wrapped = wrap( fn )
  wrapLen fn.length, ->
    ret = wrapped.apply this, arguments
    if typeof ret is "function" and not ret instanceof FuncCtor
      wrap ret
    ret

waterhouse.extend = ( methods ) ->
  for key, val of methods
    do ( key, val ) ->
      proto[key] = val

module.exports = waterhouse

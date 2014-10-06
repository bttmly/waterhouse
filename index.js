var vm = require( 'vm' );
var eff = require( 'eff' );

var wrappers = {};

var range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

var effNoop = eff( function() {} );

var extend = function ( target, source ) {
  Object.keys( source ).forEach( function ( key ) {
    target[key] = source[key];
  });
  return target;
};

var makeArgString = function ( n ) {
  if ( n === 0 ) {
    return "";
  }
  var args = [];
  var i = -1;
  while ( ++i < n - 1 ) {
    args.push( String.fromCharCode( i % 26 + 97 ) );
  }
  return args.join( ', ' );
};

var makeWrapperCode = function ( n ) {
  var args = makeArgString( n );
  return [
    'var wrap',
    String( n ).toUpperCase(),
    '= function (fn) { return function (',
    args,
    ') { return fn.apply(this, arguments); }; };'
  ].join( '' );
};

var code = 'var funcProto = Function.prototype, FuncCtor = Function;';
range.forEach( function ( i ) {
  code += makeWrapperCode( i );
});

var context = vm.createContext();
vm.runInContext( code, context );
var funcProto = context.funcProto;
var FuncCtor = context.FuncCtor;

var isOtheFunc = function ( fn ) {
  return ( typeof fn === "function" ) && ( fn instanceof FuncCtor );
};

var isRegFunc = function ( fn ) {
  return ( typeof fn === "function" ) && ( fn instanceof Function );
};

var wrap = function ( fn ) {
  if ( !wrappers[fn.length] ) {
    console.log(fn.length);
    throw new RangeError( "Function takes too many arguments." );
  }
  return wrappers[fn.length]( fn );
};

var wrapToLength = function ( len, fn ) {
  if ( !wrappers[len] ) {
    throw new RangeError( "Invalid wrapping length." );
  }
  return wrappers[len]( fn );
};

range.forEach( function ( i ) {
  wrappers[i] = context["wrap" + i];
});

Object.keys( effNoop ).forEach( function ( key ) {
  funcProto[key] = wrap( effNoop[key] );
});

var waterhouse = module.exports = function ( fn ) {
  var wrapped = wrap( fn );
  return wrapToLength( fn.length, function () {
    var ret = wrapped.apply( this, arguments );
    return isRegFunc( ret ) ? wrap( ret ) : ret;
  });
};

extend( waterhouse, {
  FuncCtor: FuncCtor,
  funcProto: funcProto,
  extend: function ( source ) {
    return extend( funcProto, source );
  }
});

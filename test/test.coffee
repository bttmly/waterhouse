expect = require( "chai" ).expect

w = require ".."

fnWithClosure = do ->
  x = 5
  -> x

describe "wrapping function", ->
  it "should work", ->
    wrapped = w( fnWithClosure )
    expect(wrapped).to.be.a "function"
    expect(wrapped).to.not.be.instanceof Function


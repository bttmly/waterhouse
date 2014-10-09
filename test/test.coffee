expect = require( "chai" ).expect

w = require ".."

fnWithClosure = do ->
  x = 5
  -> x

addTwo = ( a, b ) ->
  a + b

addThree = ( a, b, c ) ->
  console.log arguments
  a + b + c

addAll = ( a, b, c, d, e, f ) ->
  s = 0
  s += n for n in arguments
  s

isWaterhouse = ( fn ) ->
  if typeof fn isnt "function"
    return false
  if fn instanceof Function
    return false
  if fn instanceof w.FuncCtor
    return true
  false

describe "wrapping function", ->
  it "should work", ->
    wrapped = w( fnWithClosure )
    expect(wrapped()).to.equal 5

  it "should create wrapped functions", ->
    wrapped = w( fnWithClosure )
    expect(isWaterhouse(wrapped)).to.equal true

describe "methods", ->

  describe "curry", ->
    xit "should curry the function", ->
      wrapAdd = w( addThree )
      cur = wrapAdd.curry()
      cur_1 = cur(1)
      cur_1_2 = cur(1)(2)
      cur_1_2_3 = cur(1)(2)(3)
      expect(isWaterhouse(cur)).to.equal true
      expect(isWaterhouse(cur_1)).to.equal true
      expect(isWaterhouse(cur_1_2)).to.equal true
      expect(cur_1_2_3).to.equal 6

  describe "partial", ->
    xit "should partially apply the function", ->
      par_1 = w( addThree ).partial 1
      expect(isWaterhouse(par_1)).to.equal true
      expect(par_1(2, 3)).to.equal 6

      par_1_2 = w( addThree ).partial 1, 2
      expect(isWaterhouse(par_1_2)).to.equal true
      expect(par_1_2(3)).to.equal 6

      par_1_2_3 = w( addThree ).partial 1, 2, 3
      expect(isWaterhouse(par_1_2_3)).to.equal true
      expect(par_1_2_3()).to.equal 6

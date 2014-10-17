var expect = require("chai").expect;
require("chai").should();

var w = require("..");

var fnWithClosure = (function() {
  var x;
  x = 5;
  return function() {
    return x;
  };
})();

var addTwo = function (a, b) {
  return a + b;
};

var addThree = function (a, b, c) {
  return a + b + c;
};

var addAll = function (a, b, c, d, e, f) {
  var sum = 0;
  var i = -1;
  while (++i < arguments.length) {
    sum += arguments[i];
  }
  return sum;
};

var isWaterhouse = function (fn) {
  if (typeof fn !== "function") {
    return false;
  }
  if (fn instanceof Function) {
    return false;
  }
  if (fn instanceof w.FuncCtor) {
    return true;
  }
  return false;
};

var curryTest = function ( curried ) {
  it("should curry the function", function () {
    cur = curried;
    cur_1 = cur(1);
    cur_1_2 = cur(1)(2);
    cur_1_2_3 = cur(1)(2)(3);
    isWaterhouse(cur).should.equal(true);
    isWaterhouse(cur_1).should.equal(true);
    isWaterhouse(cur_1_2).should.equal(true);
    expect(cur_1_2_3).to.equal(6);
  });
};

var partialTest = function (partialedAddThree) {
  it("should partially apply the function", function () {
    par_1 = partialedAddThree;
    isWaterhouse(par_1).should.to.equal(true);
    par_1(2, 3).should.to.equal(6);
    par_1_2 = w(addThree).partial(1, 2);
    isWaterhouse(par_1_2).should.to.equal(true);
    par_1_2(3).should.to.equal(6);
    par_1_2_3 = w(addThree).partial(1, 2, 3);
    isWaterhouse(par_1_2_3).should.to.equal(true);
    par_1_2_3().should.to.equal(6);
  });
};

var flipTest = function (flippedAddThree) {
  it("should flip the first two arguments of the function", function () {
    isWaterhouse(flippedAddThree).should.equal(true);
    flippedAddThree("a", "b", "c").should.equal("bac");
  });
};

var unaryTest = function (unariedAddTwo) {
  it("should create a function that takes one argument", function () {
    isWaterhouse(unariedAddTwo).should.equal(true);
    unariedAddTwo("a", "b").should.equal("aundefined");
  });
};

var binaryTest = function (binariedAddThree) {
  it("should create a function that takes two arguments", function () {
    isWaterhouse(binariedAddThree).should.equal(true);
    binariedAddThree("a", "b", "c").should.equal("abundefined");
  });
};

var demethodizeTest = function (demethodizedMap) {
  it("should demethodize a function", function () {
    // var map = w([].map).demethodize();
    var timesTwo = function (e) { return e * 2; };
    isWaterhouse(demethodizedMap).should.equal(true);
    isWaterhouse(demethodizedMap.partial([1, 2, 3])).should.equal(true);
    demethodizedMap.partial([1, 2, 3])(timesTwo).should.deep.equal([2, 4, 6]);
    isWaterhouse(demethodizedMap.flip().partial()).should.equal(true);
    demethodizedMap.flip().partial(timesTwo)([1, 2, 3]).should.deep.equal([2, 4, 6]);
  });
}

describe("wrapping function", function () {

  it("should return a function(like) object", function () {
    var wrapped;
    wrapped = w(fnWithClosure);
    Object.prototype.toString.call(wrapped).should.equal("[object Function]");
    (typeof wrapped).should.equal("function");
  });

  it("should not be an instance of regular Function", function () {
    var wrapped;
    wrapped = w(fnWithClosure);
    (wrapped instanceof Function).should.equal(false);
    isWaterhouse(wrapped).should.equal(true);
  });

  it("should preserve function's original scope", function () {
    var wrapped;
    wrapped = w(fnWithClosure);
    expect(wrapped()).to.equal(5);
  });


});


describe("static methods", function () {
  describe(".curry()", function () {
    curryTest(w.curry(addThree));
  });
  describe(".partial()", function () {
    partialTest(w.partial(addThree, 1));
  });
  describe(".flip()", function () {
    flipTest(w.flip(addThree));
  });
  describe(".unary()", function () {
    unaryTest(w.unary(addTwo));
  });
  describe(".binary()", function () {
    binaryTest(w.binary(addThree));
  });
  describe(".demethodize()", function () {
    demethodizeTest(w.demethodize([].map));
  });
});

describe("prototype methods", function () {

  describe("Waterhouse::curry", function () {
    curryTest(w(addThree).curry());
  });

  describe("Waterhouse::partial", function () {
    partialTest(w.partial(addThree, 1));
  });

  describe("Waterhouse::flip", function () {
    flipTest(w(addThree).flip());
  });

  describe("Waterhouse::unary", function () {
    unaryTest(w(addTwo).unary());
  });

  describe("Waterhouse::binary", function () {
    binaryTest(w(addThree).binary());
  });

  describe("Waterhouse::demethodize", function () {
    demethodizeTest(w([].map).demethodize());
  });



});
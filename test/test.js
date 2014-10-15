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

describe("wrapping function", function () {

  it("should preserve function's original scope", function () {
    var wrapped;
    wrapped = w(fnWithClosure);
    expect(wrapped()).to.equal(5);
  });

  it("should create wrapped functions", function () {
    var wrapped;
    wrapped = w(fnWithClosure);
    isWaterhouse(wrapped).should.equal(true);
  });

});


describe("static methods", function () {
  describe("curry", function () {
    curryTest(w.curry(addThree));
  });

});

describe("prototype methods", function () {

  describe("curry", function () {
    curryTest(w(addThree).curry());
  });

  describe("partial", function () {
    it("should partially apply the function", function () {
      var par_1, par_1_2, par_1_2_3;
      par_1 = w(addThree).partial(1);
      isWaterhouse(par_1).should.to.equal(true);
      par_1(2, 3).should.to.equal(6);
      par_1_2 = w(addThree).partial(1, 2);
      isWaterhouse(par_1_2).should.to.equal(true);
      par_1_2(3).should.to.equal(6);
      par_1_2_3 = w(addThree).partial(1, 2, 3);
      isWaterhouse(par_1_2_3).should.to.equal(true);
      par_1_2_3().should.to.equal(6);
    });
  });

  describe("flip", function () {
    it("should flip the first two arguments of the function", function () {
      var wrapAdd;
      wrapAdd = w(addThree);
      expect(isWaterhouse(wrapAdd.flip())).to.equal(true);
      expect(wrapAdd.flip()("a", "b", "c")).to.equal("bac");
    });
  });

  describe("unary", function () {
    it("should create a function that takes one argument", function () {
      var wrapAdd2 = w(addTwo);
      isWaterhouse(wrapAdd2.unary()).should.equal(true);
      wrapAdd2.unary()("a", "b").should.equal("aundefined");
    });
  });

  describe("binary", function () {
    it("should create a function that takes two arguments", function () {
      var wrapAdd3 = w(addThree);
      isWaterhouse(wrapAdd3.binary()).should.equal(true);
      wrapAdd3.binary()("a", "b", "c").should.equal("abundefined");
    });
  });

  describe("demethodize", function () {
    it("should demethodize a function", function () {
      var map = w([].map).demethodize();
      var timesTwo = function (e) { return e * 2; };
      isWaterhouse(map).should.equal(true);
      isWaterhouse(map.partial([1, 2, 3])).should.equal(true);
      map.partial([1, 2, 3])(timesTwo).should.deep.equal([2, 4, 6]);
      isWaterhouse(map.flip().partial()).should.equal(true);
      map.flip().partial(timesTwo)([1, 2, 3]).should.deep.equal([2, 4, 6]);
    });
  });

});
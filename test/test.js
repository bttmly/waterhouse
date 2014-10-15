var expect = require("chai").expect;

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

describe("wrapping function", function () {

  it("should preserve function's original scope", function () {
    var wrapped;
    wrapped = w(fnWithClosure);
    expect(wrapped()).to.equal(5);
  });

  it("should create wrapped functions", function () {
    var wrapped;
    wrapped = w(fnWithClosure);
    expect(isWaterhouse(wrapped)).to.equal(true);
  });

});

describe("methods", function () {

  describe("curry", function () {
    xit("should curry the function", function () {
      var cur, cur_1, cur_1_2, cur_1_2_3, wrapAdd;
      wrapAdd = w(addThree);
      cur = wrapAdd.curry();
      cur_1 = cur(1);
      cur_1_2 = cur(1)(2);
      cur_1_2_3 = cur(1)(2)(3);
      expect(isWaterhouse(cur)).to.equal(true);
      expect(isWaterhouse(cur_1)).to.equal(true);
      expect(isWaterhouse(cur_1_2)).to.equal(true);
      expect(cur_1_2_3).to.equal(6);
    });
  });

  describe("partial", function () {
    xit("should partially apply the function", function () {
      var par_1, par_1_2, par_1_2_3;
      par_1 = w(addThree).partial(1);
      expect(isWaterhouse(par_1)).to.equal(true);
      expect(par_1(2, 3)).to.equal(6);
      par_1_2 = w(addThree).partial(1, 2);
      expect(isWaterhouse(par_1_2)).to.equal(true);
      expect(par_1_2(3)).to.equal(6);
      par_1_2_3 = w(addThree).partial(1, 2, 3);
      expect(isWaterhouse(par_1_2_3)).to.equal(true);
      expect(par_1_2_3()).to.equal(6);
    });
  });

});
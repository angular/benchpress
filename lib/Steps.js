function Steps() {
  this._steps = [];
};

Steps.prototype.all = function () {
  return this._steps;
};

Steps.prototype.add = function (step) {
  this._steps.push(step);
};

module.exports = Steps;

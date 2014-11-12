function RunState() {
  this.defaults = {
    iterations: 0,
    numSamples: 20
  };
  this.iterations = 0;
  this.numSamples = 20;
  this.recentResult = {};
};

RunState.prototype.setIterations = function(i) {
  this.iterations = i;
};

RunState.prototype.resetIterations = function() {
  this.iterations = this.defaults.iterations;
  this.numSamples = this.defaults.numSamples;
}

module.exports = RunState;

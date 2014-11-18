function RunState() {
  this.defaults = {
    iterations: 20,
    numSamples: 5
  };
  this.iterations = 20;
  this.numSamples = 15;
  this.recentResult = {};
};

RunState.prototype.setIterations = function(i) {
  this.iterations = i;
};

RunState.prototype.resetIterations = function() {
  this.iterations = this.defaults.iterations;
  this.numSamples = this.defaults.numSamples;
};

RunState.prototype.setDefault = function(defaults) {
  ['iterations','numSamples'].forEach(function(prop) {
    var propVal = parseInt(defaults[prop],10);
    if (typeof propVal === 'number' && !isNaN(propVal)) {
      this[prop] = propVal;
      this.defaults[prop] = propVal;
    }
    else if (typeof defaults[prop] !== 'undefined') {
      throw new Error(prop + ' must be of type number, got: ' + typeof defaults[prop]);
    }
  }.bind(this));
};

module.exports = RunState;

function RunState() {
  this.defaults = {
    iterations: 25,
    numSamples: 20
  };
  this.iterations = 25;
  this.numSamples = 20;
  this.recentResult = {};
};

RunState.prototype.setIterations = function(i) {
  this.iterations = i;
};

RunState.prototype.resetIterations = function() {
  this.iterations = this.defaults.iterations;
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

var di = require('di');
var RunState = require('./RunState');

function Aggregator (runState) {
  this._runState = runState;
  this.timesPerAction = {};
}

Aggregator.prototype.trimSamples = function(times) {
  var delta = times.length - this._runState.numSamples;
  if (delta > 0) {
    return times.slice(delta);
  }
  return times;
};

di.annotate(Aggregator, new di.Inject(RunState));
module.exports = Aggregator;

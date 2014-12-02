var di = require('di');
var Measure = require('./Measure');
var RunState = require('./RunState');

function Aggregator (measure, runState) {
  this._measure = measure;
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

Aggregator.prototype.getTimesPerAction = function(name) {
  if (this.timesPerAction[name]) return this.timesPerAction[name];
  var tpa = this.timesPerAction[name] = {
    name: name,
    nextEntry: 0
  };

  _.each(this._measure.characteristics, function(c) {
    tpa[c] = {
      recent: undefined,
      history: [],
      avg: {},
      min: Number.MAX_VALUE,
      max: Number.MIN_VALUE
    };
  });
  return tpa;
};

Aggregator.prototype.updateTimes = function(tpa, index, reference, recentTime) {
  var curTpa = tpa[reference];
  curTpa.recent = recentTime;
  curTpa.history[index] = recentTime;
  curTpa.history = this.trimSamples(curTpa.history);
  curTpa.min = Math.min(curTpa.min, recentTime);
  curTpa.max = Math.max(curTpa.max, recentTime);
};

di.annotate(Aggregator, new di.Inject(Measure, RunState));
module.exports = Aggregator;

var di = require('di');
var Measure = require('./Measure');
var RunState = require('./RunState');
var Statistics = require('./Statistics');
var Steps = require('./Steps');

function Aggregator (measure, runState, statistics, steps) {
  this._measure = measure;
  this._runState = runState;
  this._statistics = statistics;
  this._steps = steps.all();
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

Aggregator.prototype.calcStats = function() {
  var stats = {};
  var self = this;
  this._steps.forEach(function(bs) {
    var recentResult = self._runState.recentResult[bs.name],
        tpa = self.getTimesPerAction(bs.name);
    tpa.description = bs.description;
    _.each(self._measure.characteristics, function(c) {
      self.updateTimes(tpa, tpa.nextEntry, c, recentResult[c]);
      var mean = self._statistics.getMean(tpa[c].history);
      var stdDev = self._statistics.calculateStandardDeviation(tpa[c].history, mean);
      tpa[c].avg = {
        mean: mean,
        stdDev: stdDev,
        coefficientOfVariation: self._statistics.calculateCoefficientOfVariation(stdDev, mean)
      };
    });

    // Start over samples when hits the max set by numSamples
    tpa.nextEntry++;
    tpa.nextEntry %= self._runState.numSamples;
    stats[bs.name] = tpa;
  });
  return stats;
};

di.annotate(Aggregator, new di.Inject(Measure, RunState, Statistics, Steps));
module.exports = Aggregator;

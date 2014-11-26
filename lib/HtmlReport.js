var di = require('di');
var Document = require('./Document');
var Measure = require('./Measure');
var RunState = require('./RunState');
var Statistics = require('./Statistics');
var Steps = require('./Steps');

function Report(doc, measure, runState, statistics, steps) {
  this._doc = doc;
  this._measure = measure;
  this._runState = runState;
  this._statistics = statistics;
  this.timesPerAction = {};
  this._steps = steps.all();
}

Report.prototype.generatePartial = function(model) {
  return this._doc.infoTemplate(model);
};

Report.prototype.getTimesPerAction = function(name) {
  var tpa = this.timesPerAction[name];
  if (!tpa) {
    tpa = this.timesPerAction[name] = {
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
  }
  return tpa;
};

Report.prototype.rightSizeTimes = function(times) {
  var delta = times.length - this._runState.numSamples;
  if (delta > 0) {
    return times.slice(delta);
  }

  return times;
};

Report.prototype.updateTimes = function(tpa, index, reference, recentTime) {
  var curTpa = tpa[reference];
  curTpa.recent = recentTime;
  curTpa.history[index] = recentTime;
  curTpa.history = this.rightSizeTimes(curTpa.history);
  curTpa.min = Math.min(curTpa.min, recentTime);
  curTpa.max = Math.max(curTpa.max, recentTime);
};

Report.prototype.calcStats = function() {
  var report = '';
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

    tpa.nextEntry++;
    tpa.nextEntry %= self._runState.numSamples;

    report += self.generatePartial(tpa);
  });
  return report;
};

di.annotate(Report, new di.Inject(Document, Measure, RunState, Statistics, Steps));
module.exports = Report;

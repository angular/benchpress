var di = require('di');
var Aggregator = require('./Aggregator');
var Document = require('./Document');
var Measure = require('./Measure');
var RunState = require('./RunState');
var Statistics = require('./Statistics');
var Steps = require('./Steps');

function Report(aggregator, doc, measure, runState, statistics, steps) {
  this._aggregator = aggregator;
  this._doc = doc;
  this._measure = measure;
  this._runState = runState;
  this._statistics = statistics;
  this._steps = steps.all();
}

Report.prototype.generatePartial = function(model) {
  return this._doc.infoTemplate(model);
};

Report.prototype.calcStats = function() {
  var report = '';
  var self = this;
  this._steps.forEach(function(bs) {
    var recentResult = self._runState.recentResult[bs.name],
        tpa = self._aggregator.getTimesPerAction(bs.name);
    tpa.description = bs.description;
    _.each(self._measure.characteristics, function(c) {
      self._aggregator.updateTimes(tpa, tpa.nextEntry, c, recentResult[c]);
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

di.annotate(Report, new di.Inject(Aggregator, Document, Measure, RunState, Statistics, Steps));
module.exports = Report;

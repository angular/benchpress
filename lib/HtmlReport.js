var di = require('di');
var Aggregator = require('./Aggregator');
var Document = require('./Document');
var Measure = require('./Measure');
var RunState = require('./RunState');
var Statistics = require('./Statistics');
var Steps = require('./Steps');
var _ = require('underscore');

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

Report.prototype.getMarkup = function(stats) {
  var report = '';
  Object.keys(stats).forEach(function(key) {
    report += this.generatePartial(stats[key]);
  }.bind(this));
  return report;
};

di.annotate(Report, new di.Inject(Aggregator, Document, Measure, RunState, Statistics, Steps));
module.exports = Report;


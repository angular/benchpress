var di = require('di');
var ClientScripts = require('./ClientScripts');
var Document = require('./Document');
var Globals = require('./Globals');
var Measure = require('./Measure');
var Report = require('./HtmlReport');
var AutoRunner = require('./AutoRunner');
var Statistics = require('./Statistics');
var Steps = require('./Steps');
var Variables = require('./Variables');

//Benchpress Facade
function AutoBenchPress (doc, globals, measure, report, runner, scripts, statistics, steps, variables) {
  doc.setAutoRun(true);
  // Left benchmarkSteps on global for backwards-compatibility
  //Deprecated
  window.benchmarkSteps = this.steps = steps.all();
  this._scripts = scripts;
  this.runner = runner;

  //Deprecated
  this.scripts = scripts.all();
  this.doc = doc;
  this.variables = variables;

  //Legacy Support
  this.Document = doc;
  this.Measure = measure;
  this.Runner = runner;
  this.Report = report;
  this.Statistics = statistics;
  if (globals._window) globals._window.addEventListener('DOMContentLoaded', function(e) {
    doc.onDOMContentLoaded.call(doc);
    runner.bootstrap();
  }.bind(this));
}

di.annotate(AutoBenchPress, new di.Inject(Document, Globals, Measure, Report, AutoRunner, ClientScripts, Statistics, Steps, Variables))

var injector = new di.Injector([]);
window.bp = injector.get(AutoBenchPress);

module.exports = AutoBenchPress;

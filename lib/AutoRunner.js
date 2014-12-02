var di = require('di');
var Aggregator = require('./Aggregator');
var Globals = require('./Globals');
var Logger = require('./Logger');
var Runner = require('./Runner');
var RunState = require('./RunState');
var Rx = require('rx');
var Steps = require('./Steps');
var Utils = require('./Utils');

function AutoRunner(aggregator,globals,logger,runner,runState,steps,utils){
  this._aggregator = aggregator;
  this._globals = globals;
  this._logger = logger;
  this._runner = runner;
  this._runState = runState;
  this._utils = utils;
  this._steps = steps;
}

AutoRunner.prototype.bootstrap = function() {
  var parsed = this._utils.parseSearch(this._globals._window.location.search)
  this._runState.setDefault(parsed);
  if (parsed['__bpAutoClose__'] === 'true') {
    this._runState.headless = true;
  }
};

AutoRunner.prototype.ready = function () {
  this._globals._window.setTimeout(function() {
    this.runBenchmark(this._runState);
  }.bind(this));
};

AutoRunner.prototype.runBenchmark = function(config) {
  this.runAllTests().subscribe(function(update) {
    this._logger.write(update);
  }.bind(this), null, function() {
    if (this._runState.headless === true) {
      var benchpressComplete = new Event('benchpressComplete');
      benchpressComplete.result = this.stats;
      this._globals._window.dispatchEvent(benchpressComplete);
      this._globals._window.close();
    }
  }.bind(this));
};

AutoRunner.prototype.runAllTests = function (iterations) {
  this.subject = this.subject || new Rx.Subject();
  iterations = typeof iterations === 'number' ? iterations : this._runState.iterations;
  if (iterations--) {
    this._steps.all().forEach(function(bs) {
      var testResults = this._runner.runTimedTest(bs);
      this._runState.recentResult[bs.name] = testResults;
      this.subject.onNext({step: bs.name, results: testResults})
    }.bind(this));
    this.stats = this._aggregator.calcStats();
    window.requestAnimationFrame(function() {
      this.runAllTests(iterations);
    }.bind(this));
  }
  else {
    this.stats = this._aggregator.calcStats();
    this.subject.onCompleted();
    this.subject.dispose();
    delete this.subject;
  }
  return this.subject;
};

di.annotate(AutoRunner, new di.Inject(Aggregator,Globals,Logger,Runner,RunState,Steps,Utils));
module.exports = AutoRunner;

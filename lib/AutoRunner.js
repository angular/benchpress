var di = require('di');
var Globals = require('./Globals');
var Logger = require('./Logger');
var Runner = require('./Runner');
var RunState = require('./RunState');
var Rx = require('rx');
var Steps = require('./Steps');
var Utils = require('./Utils');

function AutoRunner(globals,logger,runner,runState,steps,utils){
  this._globals = globals;
  this._logger = logger;
  this._runner = runner;
  this._runState = runState;
  this._utils = utils;
  this._steps = steps;
}

AutoRunner.prototype.bootstrap = function() {
  this._runState.setDefault(this._utils.parseSearch(this._globals._window.location.search));
};

AutoRunner.prototype.ready = function () {
  this._globals._window.setTimeout(function() {
    this.runBenchmark(this._runState);
  }.bind(this));
};

AutoRunner.prototype.runBenchmark = function(config) {
  this.runAllTests().subscribe(function(update) {
    this._logger.write(update);
  }.bind(this));
};

AutoRunner.prototype.runAllTests = function (iterations) {
  this.subject = this.subject || new Rx.Subject();
  iterations = typeof iterations === 'number'? iterations : this._runState.iterations;
  if (iterations--) {
    this._steps.all().forEach(function(bs) {
      var testResults = this._runner.runTimedTest(bs);
      this._runState.recentResult[bs.name] = testResults;
      this.subject.onNext({step: bs.name, results: testResults})
    }.bind(this));
    window.requestAnimationFrame(function() {
      this.runAllTests(iterations);
    }.bind(this));
  }
  else {
    this.subject.dispose();
    delete this.subject;
  }
  return this.subject;
};

di.annotate(AutoRunner, new di.Inject(Globals,Logger,Runner,RunState,Steps,Utils));
module.exports = AutoRunner;

var di = require('di');
var Aggregator = require('./Aggregator');
var Document = require('./Document');
var Globals = require('./Globals');
var Measure = require('./Measure');
var Report = require('./HtmlReport');
var RunState = require('./RunState');
var Steps = require('./Steps');
var Rx = require('rx');

function Runner (aggregator, doc, globals, measure, report, runState, steps) {
  this._aggregator = aggregator;
  this._doc = doc;
  this._globals = globals;
  this._measure = measure;
  this._steps = steps;
  this._runState = runState;
  this._report = report;
  this.reportMarkup = '';
}

Runner.prototype.bootstrap = function() {
  this._btnSubscription = this._doc.observeBtns().subscribe(this.onBtnClick.bind(this));
};

Runner.prototype.ready = function () {
  //No-op. API symmetry to AutoRunner
};

Runner.prototype.onBtnClick = function(e) {
  switch (e && e.target && e.target.textContent) {
    case 'Loop':
      this.loopBenchmark();
      break;
    case 'Once':
      this.onceBenchmark();
      break;
    case 'Loop 25x':
      this.twentyFiveBenchmark();
      break;
    case 'Profile':
      this.profile();
      break;
    case 'Pause':
      this._runState.setIterations(0);
      this._doc.loopBtn.innerText = 'Loop';
      break;
    default:
      throw new Error('Could not find handler');
  }
};

Runner.prototype.loopBenchmark = function (notify) {
  this._runState.setIterations(-1);
  notify && notify({status: 'done', runType: 'loop'})
  this._doc.loopBtn.innerText = 'Pause';
  this.runAllTests();
};

Runner.prototype.onceBenchmark = function() {
  this._runState.setIterations(1);
  this._doc.onceBtn.innerText = '...';
  this.runAllTests(function() {
    this._doc.onceBtn.innerText = 'Once';
  }.bind(this));
};

Runner.prototype.twentyFiveBenchmark = function() {
  var twentyFiveBtn = this._doc.twentyFiveBtn;
  this._runState.setIterations(25);
  twentyFiveBtn.innerText = 'Looping...';
  this.runAllTests(function() {
    twentyFiveBtn.innerText = 'Loop 25x';
  }, 5);
};

Runner.prototype.runAllTests = function (done) {
  var self = this;
  if (this._runState.iterations--) {
    this._steps.all().forEach(function(bs) {
      var testResults = self.runTimedTest(bs);
      self._runState.recentResult[bs.name] = testResults;
    });
    var stats = this._aggregator.calcStats();
    this.reportMarkup = this._report.getMarkup(stats);
    this._doc.writeReport(this.reportMarkup);
    window.requestAnimationFrame(function() {
      self.runAllTests(done);
    });
  }
  else {
    this._doc.writeReport(this.reportMarkup);
    this._runState.resetIterations();
    done && done();
  }
};


Runner.prototype.profile = function() {
  console.profile();
  this.onceBenchmark();
  console.profileEnd();
};


Runner.prototype.runTimedTest = function (bs) {
  var startTime,
      endTime,
      startGCTime,
      endGCTime,
      retainedMemory,
      garbage,
      beforeHeap,
      afterHeap,
      finalHeap;
  if (typeof this._globals._window.gc === 'function') {
    this._globals._window.gc();
  }

  if (window.performance && window.performance.memory) {
    beforeHeap = performance.memory.usedJSHeapSize;
  }

  startTime = this._measure.numMilliseconds();
  bs.fn();
  endTime = this._measure.numMilliseconds() - startTime;

  if (window.performance && window.performance.memory) {
    afterHeap = performance.memory.usedJSHeapSize;
  }

  startGCTime = this._measure.numMilliseconds();
  if (typeof window.gc === 'function') {
    window.gc();
  }
  endGCTime = this._measure.numMilliseconds() - startGCTime;

  if (window.performance && window.performance.memory) {
    finalHeap = performance.memory.usedJSHeapSize;
    garbage = Math.abs(finalHeap - afterHeap);
    retainedMemory = finalHeap - beforeHeap;
  }
  return {
    testTime: endTime,
    gcTime: endGCTime || 0,
    beforeHeap: beforeHeap || 0,
    garbageCount: garbage || 0,
    retainedCount: retainedMemory || 0
  };
};

di.annotate(Runner, new di.Inject(Aggregator, Document, Globals, Measure, Report, RunState, Steps));
module.exports = Runner;

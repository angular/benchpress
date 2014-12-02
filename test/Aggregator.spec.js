var di = require('di');
var testing = require('../node_modules/di/dist/cjs/testing');
var Aggregator = require('../lib/Aggregator');
var Globals = require('../lib/Globals');
var MockGlobals = require('./MockGlobals');
var RunState = require('../lib/RunState');
var Steps = require('../lib/Steps');

describe('Aggregator', function() {
  var runState, aggregator;

  beforeEach(testing.inject(Aggregator, RunState, function(a,rs){
    aggregator = a;
    runState = rs;
  }));

  describe('.trimSamples()', function() {
    it('should remove the left side of the input if longer than numSamples', function() {
      runState.numSamples = 3;
      expect(aggregator.trimSamples([0,1,2,3,4,5,6])).toEqual([4,5,6]);
    });


    it('should return the whole list if shorter than or equal to numSamples', function() {
      runState.numSamples = 7;
      expect(aggregator.trimSamples([0,1,2,3,4,5,6])).toEqual([0,1,2,3,4,5,6]);
      expect(aggregator.trimSamples([0,1,2,3,4,5])).toEqual([0,1,2,3,4,5]);
    });
  });


  describe('.getTimesPerAction()', function() {
    it('should return the time for the action if already set', function() {
      aggregator.timesPerAction['foo'] = {name: 'foo'};
      expect(aggregator.getTimesPerAction('foo').name).toBe('foo');
    });
  });


  describe('.calcStats()', function() {
    var runState, steps;
    beforeEach(testing.inject(RunState, Steps, function(rs,s) {
      steps = s;
      runState = rs;
      steps.add({
        fn: function() {},
        name: 'fakeStep'
      });

      runState.numSamples = 5;
      runState.iterations = 5;
      runState.recentResult = {
        fakeStep: {
          testTime: 5,
          gcTime: 2,
          recentGarbagePerStep: 200,
          recentRetainedMemoryPerStep: 100
        }
      };

      aggregator.timesPerAction = {
        fakeStep: {
          testTime: {
            history: [3,7]
          },
          garbageCount: {
            history: [50,50]
          },
          retainedCount: {
            history: [25,25]
          },
          gcTime: {
            recent: 3,
            history: [1,3]
          },
          nextEntry: 2
        },
      };
    }));


    it('should return a stats object', function() {
      expect(typeof aggregator.calcStats().fakeStep).toBe('object');
      expect(Object.keys(aggregator.calcStats())).toEqual(['fakeStep']);
    });

    it('should set the most recent time for each step to the next entry', function() {
      aggregator.calcStats();
      expect(aggregator.timesPerAction.fakeStep.testTime.history[2]).toBe(5);
      runState.recentResult.fakeStep.testTime = 25;
      aggregator.calcStats();
      expect(aggregator.timesPerAction.fakeStep.testTime.history[3]).toBe(25);
    });
  });
});

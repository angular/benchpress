var di = require('di');
var testing = require('../node_modules/di/dist/cjs/testing');
var Aggregator = require('../lib/Aggregator');
var Globals = require('../lib/Globals');
var MockGlobals = require('./MockGlobals');
var RunState = require('../lib/RunState');

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
});

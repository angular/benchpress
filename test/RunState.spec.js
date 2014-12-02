var di = require('di');
var testing = require('../node_modules/di/dist/cjs/testing');
var Globals = require('../lib/Globals');
var MockGlobals = require('./MockGlobals');
var RunState = require('../lib/RunState');
var Utils = require('../lib/Utils');

describe('RunState', function() {
  var runState, report, globals, utils;

  beforeEach(function() {
    testing.use(MockGlobals).as(Globals);
    testing.inject(RunState, Globals, Utils, function(r,g,u) {
      runState = r;
      globals = g;
      utils = u;
    });
  });


  it('should set default properties', function() {
    expect(runState.iterations).toBe(25);
    expect(runState.numSamples).toBe(20);
    expect(runState.recentResult).toEqual({});
  });


  describe('.setIterations()', function() {
    it('should set provided arguments to runState object', function() {
      runState.setIterations(15);
      expect(runState.iterations).toBe(15);
    });
  });


  describe('.resetIterations()', function() {
    it('should set runState object to defaults', function() {
      runState.iterations = 99;
      runState.resetIterations();
      expect(runState.iterations).toBe(25);
    });
  });


  describe('.setDefaults()', function() {
    beforeEach(function() {
      globals._window.location.search = '?iterations=10&numSamples=5';
    });


    it('should override defaults with defaults specified in params', function() {
      var queryParams = utils.parseSearch(globals._window.location.search);
      runState.setDefault(queryParams);
      expect(runState.numSamples).toBe(5);
      expect(runState.defaults.numSamples).toBe(5);
      expect(runState.iterations).toBe(10);
      expect(runState.defaults.iterations).toBe(10);
    });


    it('should throw if provided non number values', function() {
      var queryParams = utils.parseSearch('iterations=foo');
      expect(function() {
        runState.setDefault(queryParams)
      }).toThrow('iterations must be of type number, got: string');

      queryParams = utils.parseSearch('numSamples=bar');
      expect(function() {
        runState.setDefault(queryParams)
      }).toThrow('numSamples must be of type number, got: string');
    });
  });
});

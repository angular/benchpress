describe('runStateService', function() {
  var runState;

  beforeEach(function() {
    module('bpdRunStateService');
    inject(function(_runState_) {
      runState = _runState_;
    });
  });


  it('should set default properties', function() {
    expect(runState.iterations).toBe(25);
    expect(runState.numSamples).toBe(20);
    expect(runState.recentResult).toEqual({});
  });


  describe('.setIterations()', function() {
    it('should set provided arguments to runState object', function() {
      runState.iterations = 15;
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
    it('should override defaults with defaults specified in params', function() {
      runState.defaults = {iterations: 10, numSamples: 5};
      expect(runState.numSamples).toBe(5);
      expect(runState.defaults.numSamples).toBe(5);
      expect(runState.iterations).toBe(10);
      expect(runState.defaults.iterations).toBe(10);
    });


    it('should throw if provided non number values', function() {
      expect(function() {
        runState.defaults = {iterations:'foo'};
      }).toThrow('iterations must be of type number, got: string');

      expect(function() {
        runState.defaults = {numSamples: 'bar'};
      }).toThrow('numSamples must be of type number, got: string');
    });
  });
});

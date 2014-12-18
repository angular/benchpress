describe('runStateServiceService', function() {
  var runStateService;

  beforeEach(function() {
    module('bpdRunStateService');
    inject(function(_runStateService_) {
      runStateService = _runStateService_;
    });
  });


  it('should set default properties', function() {
    expect(runStateService.iterations).toBe(25);
    expect(runStateService.numSamples).toBe(20);
    expect(runStateService.recentResult).toEqual({});
  });


  describe('.setIterations()', function() {
    it('should set provided arguments to runStateService object', function() {
      runStateService.iterations = 15;
      expect(runStateService.iterations).toBe(15);
    });
  });


  describe('.resetIterations()', function() {
    it('should set runStateService object to defaults', function() {
      runStateService.iterations = 99;
      runStateService.resetIterations();
      expect(runStateService.iterations).toBe(25);
    });
  });


  describe('.setDefaults()', function() {
    it('should override defaults with defaults specified in params', function() {
      runStateService.defaults = {iterations: 10, numSamples: 5};
      expect(runStateService.numSamples).toBe(5);
      expect(runStateService.defaults.numSamples).toBe(5);
      expect(runStateService.iterations).toBe(10);
      expect(runStateService.defaults.iterations).toBe(10);
    });


    it('should throw if provided non number values', function() {
      expect(function() {
        runStateService.defaults = {iterations:'foo'};
      }).toThrow('iterations must be of type number, got: string');

      expect(function() {
        runStateService.defaults = {numSamples: 'bar'};
      }).toThrow('numSamples must be of type number, got: string');
    });
  });
});

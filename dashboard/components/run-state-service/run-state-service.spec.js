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


  describe('.resetDefaults()', function() {
    it('should set runState values to defaults', function() {
      runState.iterations = 99;
      runState.numSamples = 98;
      expect(runState.iterations).toBe(99);
      expect(runState.numSamples).toBe(98);
      runState.resetDefaults();
      expect(runState.iterations).toBe(25);
      expect(runState.numSamples).toBe(20);
    });
  });


  describe('.defaultIterations', function() {
    it('should override defaults if set directly', function() {
      runState.defaultIterations = 10;
      expect(runState.iterations).toBe(10);
      expect(runState.defaultIterations).toBe(10);
    });


    it('should throw if provided non number values', function() {
      expect(function() {
        runState.defaultIterations = 'foo';
      }).toThrow('iterations must be of type number, got: string');
    });
  });


  describe('.defaultNumSamples', function() {
    it('should override defaults if set directly', function() {
      runState.defaultNumSamples = 10;
      expect(runState.numSamples).toBe(10);
      expect(runState.defaultNumSamples).toBe(10);
    });


    it('should throw if provided non number values', function() {
      expect(function() {
        runState.defaultNumSamples = 'bar';
      }).toThrow('numSamples must be of type number, got: string');
    });
  });


  describe('.context', function() {
    describe('getter', function() {
      it('should return IFRAME by default', function() {
        expect(runState.context).toBe(runContexts.IFRAME);
      });


      it('should return correct value after being set', function() {
        expect(runState.context).toBe(runContexts.IFRAME);
        runState.context = runContexts.WINDOW;
        expect(runState.context).toBe(runContexts.WINDOW);
        runState.context = runContexts.IFRAME;
        expect(runState.context).toBe(runContexts.IFRAME);
      });
    });


    describe('setter', function() {
      it('should set the value', function() {
        expect(runState.context).toBe(runContexts.IFRAME);
        runState.context = runContexts.WINDOW;
        expect(runState.context).toBe(runContexts.WINDOW);
        expect(runState._context).toBe(runContexts.WINDOW);
      });


      it('should throw if value other than acceptable enumerable is given', function() {
        expect(function(){
          runState.context = 3;
        }).toThrow(new Error('3 is not a valid running context enumerable value'));
      });
    });
  });

  describe('.running', function() {
    describe('getter', function() {
      it('should return false by default', function() {
        expect(runState.running).toBe(false);
      });


      it('should return correct value after being set', function() {
        expect(runState.running).toBe(false);
        runState.running = true;
        expect(runState.running).toBe(true);
        runState.running = false;
        expect(runState.running).toBe(false);
      });
    });


    describe('setter', function() {
      it('should set the value', function() {
        expect(runState.running).toBe(false);
        runState.running = true;
        expect(runState.running).toBe(true);
        expect(runState._running).toBe(true);
      });


      it('should throw if value other than boolean is given', function() {
        expect(function(){
          runState.running = 'yep';
        }).toThrow(new Error('"running" must be a boolean value'));
      });
    });
  });
});

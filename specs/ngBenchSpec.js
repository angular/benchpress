describe('ngBench', function() {

  describe('benchmark', function() {
    var suiteSpy;

    var callOrder;
    function order(str) { callOrder.push(str); }

    beforeEach(function() {
      callOrder = [];
      spyOn(window, 'it').andCallFake(function(a,b) {
        b();
      });
      window.angulars = [window.angular];

      suiteSpy = {
        add: jasmine.createSpy().andCallFake(function() {
          order('add');
          return suiteSpy;
        }),
        on: jasmine.createSpy().andCallFake(function() {
          order('on');
          return suiteSpy;
        }),
        run: jasmine.createSpy().andCallFake(function() {
          order('run');
          return suiteSpy;
        })
      };

      spyOn(Benchmark, 'Suite').andCallFake(function() {
        order('cons');
        return suiteSpy;
      });
    });

    it('should create a new Benchmark.Suite and run the suite', function() {

      benchmark('nothing at all', {
        setup: function(bench) {
          return bench;
        },
        bench: function() {

        },
        assert: function(setup, bench) {

        }
      });
      expect(callOrder.join(',')).toEqual('cons,add,on,on,run');

    });

    // Missing assert should produce a nice error message.
    // Missing setup should produce a nice error message.
    // Missing bench should produce a nice error message.
  });
});

describe('ngBench', function() {

  describe('benchmark', function() {
    var suiteSpy, injector;

    var callOrderList;
    function order(str) { callOrderList.push(str); }
    callOrder = {
      all: function() { return callOrderList.join(','); },
      only: function(onlys) {
        var onlysMap = {};
        onlys.forEach(function(x) { onlysMap[x] = true; });
        return callOrderList.filter(function(x) { return onlysMap[x]; }).join(',');
      }
    };

    beforeEach(inject(function($injector) {
      injector = $injector;

      callOrderList = [];
      spyOn(window, 'it').andCallFake(function(name, fn) { fn(); });
      spyOn(window, 'waitsFor');
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
    }));

    it('should create a new Benchmark.Suite and run the suite', inject(function($rootScope) {

      benchmark('nothing at all', {
        injector: injector,
        setup: function(bench) {
          return bench;
        },
        bench: function() {

        },
        assert: function(setup, bench) {

        }
      });
      $rootScope.$apply();
      expect(callOrder.all()).toEqual('cons,add,on,on,run');

    }));

    it('should call assert and setup before running the benchmark', inject(function ($rootScope) {
      benchmark('nothing at all', {
        injector: injector,
        setup: function(bench) {
          order('setup');
          return bench;
        },
        bench: function() {
          order('bench');

        },
        assert: function(setup, bench) {
          order('assert');
        }
      });

      $rootScope.$apply();
      // Notice bench is not called.  It would be called from run
      expect(callOrder.only(['run', 'setup', 'bench', 'assert']))
          .toEqual('assert,setup,run');
    }));

    it('should support deferred setup', inject(function($rootScope) {
      var resolve;
      benchmark('nothing at all', {
        injector: injector,
        setup: function(bench, $q) {
          order('setup');
          var deferred = $q.defer();
          resolve = function() {
            deferred.resolve(bench);
          };
          return deferred.promise;
        },
        bench: function() {
          order('bench');

        },
        assert: function(setup, bench) {
          order('assert');
          console.log('assert called');
        }
      });
      var interesting = ['run', 'setup', 'bench', 'assert'];
      expect(callOrder.only(interesting)).toEqual('assert,setup');

      resolve();
      $rootScope.$apply();
      expect(callOrder.only(interesting)).toEqual('assert,setup,run');
    }));

    // Missing assert should produce a nice error message.
    // Missing setup should produce a nice error message.
    // Missing bench should produce a nice error message.
  });
});

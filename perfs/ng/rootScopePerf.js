describe('$rootScope', function() {

  describe('$apply', function() {

    benchmark('should benchmark empty $apply on single scope', {
      setup: function($injector, angular, $rootScope, bench) {
        return function() {
          bench($rootScope);
        }
      },

      bench: function($rootScope) {
        $rootScope.$apply();
      },

      assert: function(setup, $injector, angular, bench) {
        var spy = jasmine.createSpy('$apply');
        var test = $injector.invoke(setup, null, {
          $rootScope: {$apply: spy},
          angular: angular,
          bench: bench
        });
        test();
        expect(spy.callCount).toBe(1);
      }

    });
  });
});

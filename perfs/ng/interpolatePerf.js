'use strict';

describe('$interpolate', function() {

  describe('runtime', function() {

    benchmark('simple interpolation', {

      setup: function(angular, $rootScope, bench, $interpolate) {
        $rootScope.name = 'Tom';
        var interpolationFn = $interpolate('Hello {{name}}');

        return function() {
          return bench(interpolationFn, $rootScope);
        }
      },

      bench: function(interpolationFn, scope) {
        return interpolationFn(scope);
      },

      assert: function(setup, $injector, angular, $rootScope, bench) {
        var test = $injector.invoke(setup, null, {
          angular: angular,
          bench: bench
        });

        expect(test()).toBe('Hello Tom');
        expect(test()).toBe('Hello Tom');
      }
    });


    benchmark('simple dynamic interpolation', {

      setup: function(angular, $rootScope, bench, $interpolate) {
        $rootScope.counter = 0;
        var interpolationFn = $interpolate('Count: {{counter}};');

        return function() {
          return bench(interpolationFn, $rootScope);
        }
      },

      bench: function(interpolationFn, scope) {
        scope.counter++;
        return interpolationFn(scope);
      },

      assert: function(setup, $injector, angular, $rootScope, bench) {
        var test = $injector.invoke(setup, null, {
          angular: angular,
          bench: bench
        });

        expect(test()).toBe('Count: 1;');
        expect(test()).toBe('Count: 2;');
        expect(test()).toBe('Count: 3;');
      }
    });


    benchmark('double interpolation', {

      setup: function(angular, $rootScope, bench, $interpolate) {
        $rootScope.name = 'Tom';
        $rootScope.greeting = 'Hi';
        var interpolationFn = $interpolate('{{greeting}} {{name}}!');

        return function() {
          return bench(interpolationFn, $rootScope);
        }
      },

      bench: function(interpolationFn, scope) {
        return interpolationFn(scope);
      },

      assert: function(setup, $injector, angular, $rootScope, bench) {
        var test = $injector.invoke(setup, null, {
          angular: angular,
          bench: bench
        });

        expect(test()).toBe('Hi Tom!');
        expect(test()).toBe('Hi Tom!');
      }
    });
  });
});

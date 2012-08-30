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



function benchmark(name, options) {

  iit(name, function() {
    dump(name, options.bench)
    var actualTest = options.bench;
    var actualSetup = options.setup;
    var assert = options.assert;

    var globalSetup = function(angular) {
      return angular.injector(['ng']);
    }

    var suite = new Benchmark.Suite;

    for (var version in angulars) {
      var angular = angulars[version],
          injector, test, rootElement;

      rootElement = angular.element(document.createElement('div'));
      document.body.appendChild(rootElement[0]);

      //TODO(i) remove
      window.angular = angular;

      injector = globalSetup(angular);
      injector.invoke(assert, null, {setup: actualSetup, bench: actualTest, angular: angular, rootElement: rootElement});

      rootElement.remove();
      rootElement = angular.element(document.createElement('div'));
      document.body.appendChild(rootElement[0]);

      test = injector.invoke(actualSetup, null, {bench: actualTest, angular: angular, rootElement: rootElement});

      //TODO(i) remove
      window.angular = null;

      suite.add({
        name: version,
        //defer: true,
        fn: function(deferred) {
          test();
          //deferred.resolve(); //TODO(i): we don't measure the rendering phase
        },
        onStart: function(event) {
          var bench = event.target;
          dump('start[' + bench.name + ']: ');
        },
        onComplete: function(event) {
          var bench = event.target;
          rootElement.remove();
          dump('done[' + bench.name + ']: ' + Math.round(bench.hz) + ' ops/sec (\u00B1' +
                        bench.stats.rme.toFixed(2) + '%)');
        }
      });
    }

    // add suite listeners
    suite.on('start', function() {
      dump('------- ' + name + ' -------------');
    }).on('complete', function() {
      dump('------- ' + name + ' -------------');
      //dump('Fastest is ' + this.filter('fastest').pluck('name'));
      this.forEach(function(bench) {
        dump(pad(bench.name, 9) + ': ' + Math.round(bench.hz) + ' ops/sec (\u00B1' +
            bench.stats.rme.toFixed(2) + '%)');
      });
      dump('----------------------------------\n');
    })

    // run async
    .run();

    waitsFor(function() {
      return !suite.running;
    }, '', Number.MAX_VALUE);
  });

  function pad(string, length) {
    return string + Array(length - string.length).join(' ');
  }
}

describe('$rootScope', function() {

  describe('$apply', function() {

    it('should benchmark empty $apply on single scope', function() {

      var suite = new Benchmark.Suite;


      var actualTest = function($rootScope) {

        $rootScope.$apply();
      };

      var globalSetup = function(angular) {
        return angular.injector(['ng']);
      }

      var actualSetup = function($injector, angular, $rootScope, test) {
        return function() {
          test($rootScope);
        }
      };

      var assert = function(setup, $injector, angular) {
        var spy = jasmine.createSpy('$apply');
        var test = $injector.invoke(setup, null, {
          $rootScope: {$apply: spy},
          angular: angular,
          test: actualTest
        });
        test();
        expect(spy.callCount).toBe(1);
      }


      for (var version in angulars) {
        var angular = angulars[version],
            injector, test;

        injector = globalSetup(angular);
        injector.invoke(assert, null, {setup: actualSetup, test: actualTest, angular: angular});
        test = injector.invoke(actualSetup, null, {test: actualTest, angular: angular});

        suite.add({
          name: version,
          defer: false,
          fn: function() {
            test();
          },
          onStart: function(event) {
            var bench = event.target;
            dump('start[' + bench.name + ']: ');
          },
          onComplete: function(event) {
            var bench = event.target;
            dump('done[' + bench.name + ']: ' + Math.round(bench.hz) + ' ops/sec (\u00B1' +
                          bench.stats.rme.toFixed(2) + '%)');
          }
        });
      }

      // add listeners
      suite.on('start', function() {
        dump('------- empty $apply -------------');
      }).on('complete', function() {
        dump('------- empty $apply -------------');
        //dump('Fastest is ' + this.filter('fastest').pluck('name'));
        this.forEach(function(bench) {
          dump(pad(bench.name, 9) + ': ' + Math.round(bench.hz) + ' ops/sec (\u00B1' +
              bench.stats.rme.toFixed(2) + '%)');
        });
        dump('----------------------------------\n');
      })

      // run sync
      .run({ 'async': false });
    });
  });


  function pad(string, length) {
    return string + Array(length - string.length).join(' ');
  }
});

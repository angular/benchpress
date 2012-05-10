describe('$compile', function() {

  describe('binding', function() {

    it('should benchmark single binding that always changes', function() {


      var suite = new Benchmark.Suite;


      var actualTest = function($rootScope) {
        $rootScope.counter++;
        $rootScope.$apply();
      };

      var globalSetup = function(angular) {
        return angular.injector(['ng']);
      }

      var actualSetup = function($injector, angular, $rootScope, test, $compile, rootElement) {
        rootElement.append('<div>{{counter}}</div>');
        $rootScope.counter = 0;
        $compile(rootElement)($rootScope);
        $rootScope.$apply();

        return function() {
          test($rootScope);
        }
      };

      var assert = function(setup, $injector, angular, rootElement, $rootScope) {
        var test = $injector.invoke(setup, null, {
          angular: angular,
          test: actualTest,
          rootElement: rootElement
        });

        expect(rootElement.text()).toBe('0');
        expect($rootScope.counter).toBe(0);

        test();

        expect(rootElement.text()).toBe('1');
        expect($rootScope.counter).toBe(1);

        test();

        expect(rootElement.text()).toBe('2');
        expect($rootScope.counter).toBe(2);
      }


      for (var version in angulars) {
        var angular = angulars[version],
            injector, test, rootElement;

        rootElement = angular.element(document.createElement('div'));
        document.body.appendChild(rootElement[0]);

        //TODO(i) remove
        window.angular = angular;

        injector = globalSetup(angular);
        injector.invoke(assert, null, {setup: actualSetup, test: actualTest, angular: angular, rootElement: rootElement});
        test = injector.invoke(actualSetup, null, {test: actualTest, angular: angular, rootElement: rootElement});

        //TODO(i) remove
        window.angular = null;

        suite.add({
          name: version + ': simple binding',
          defer: true,
          fn: function(deferred) {
            test();
            deferred.resolve(); //TODO(i): we don't measure the rendering phase
          },
          onStart: function(event) {
            var bench = event.target;
            dump('start: ' + bench.name);
          },
          onComplete: function(event) {
            var bench = event.target;
            rootElement.remove();
            dump('done: ' + bench.name + '; ' + Math.round(bench.hz) + ' ops/sec (\u00B1' +
                          bench.stats.rme.toFixed(2) + '%)');
          }
        });
      }

      // add suite listeners
      suite.on('complete', function() {
        dump('Fastest is ' + this.filter('fastest').pluck('name'));
        this.forEach(function(bench) {
          dump(bench.name + ': ' + Math.round(bench.hz) + ' ops/sec (\u00B1' +
              bench.stats.rme.toFixed(2) + '%)');
        });
        console.log('done!', this);
      })

      // run async
      .run();

      waitsFor(function() {
        return !suite.running;
      }, '', Number.MAX_VALUE);
    });
  });


});

function benchmark(name, options) {

  it(name, function() {
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
        defer: true,
        fn: function(deferred) {
          test();
          deferred.resolve(); //TODO(i): we don't measure the rendering phase
        },
        onStart: function(event) {
          var bench = event.target;
          dump('start[' + bench.name + ']: ');
        },
        onComplete: function(event) {
          var bench = event.target;
          rootElement.remove();
          dump(bench.stats);
          dump(bench.stats.sample.length);
          dump('done[' + bench.name + ']: ' + Math.round(bench.hz) + ' ops/sec (\u00B1' +
              bench.stats.rme.toFixed(2) + '%)');
        }
      });
    }

    var jout = {};
    // add suite listeners
    suite.on('start', function() {
      dump('------- ' + name + ' -------------');
    }).on('complete', function() {
          dump('------- ' + name + ' -------------');
          //dump('Fastest is ' + this.filter('fastest').pluck('name'));
          jout[name] = [];
          this.forEach(function(bench) {
            jout[name].push(bench);
            dump(pad(bench.name, 9) + ': ' + Math.round(bench.hz) + ' ops/sec (\u00B1' +
                bench.stats.rme.toFixed(2) + '%)');
          });
          dump('----------------------------------');
        })

      // run async
        .run();

    waitsFor(function() {
      if (!suite.running) {
        dump('XXX: ' + JSON.stringify(jout));
      }
      return !suite.running;
    }, '', Number.MAX_VALUE);
  });

  function pad(string, length) {
    return string + Array(length - string.length).join(' ');
  }
}

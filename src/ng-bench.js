function benchmark(name, options) {

  it(name, function() {
    console.log(name, options.bench)
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
        defer: false,
        delay: 0,
        fn: function(deferred) {
          test();
//          setTimeout(function() {
//            deferred.resolve(); //TODO(i): we don't measure the rendering phase
//
//          }, 0);
        },
        onStart: function(event) {
          var bench = event.target;
          console.log('start[' + bench.name + ']: ');
        },
        onComplete: function(event) {
          var bench = event.target;
          rootElement.remove();
          console.log(bench.stats);
          console.log(bench.stats.sample.length);
          console.log('done[' + bench.name + ']: ' + Math.round(bench.hz) + ' ops/sec (\u00B1' +
              bench.stats.rme.toFixed(2) + '%)');
        }
      });
    }

    var jout = {};
    // add suite listeners
    suite.on('start', function() {
      console.log('------- ' + name + ' -------------');
    }).on('complete', function() {
          console.log('------- ' + name + ' -------------');
          //console.log('Fastest is ' + this.filter('fastest').pluck('name'));
          jout[name] = [];
          this.forEach(function(bench) {
            jout[name].push(bench);
          });
          console.log('----------------------------------');
        })

      // run async
        .run();

    waitsFor(function() {
      if (!suite.running) {
        console.log('XXX: ' + JSON.stringify(jout));
      }
      return !suite.running;
    }, '', Number.MAX_VALUE);
  });

  function pad(string, length) {
    return string + Array(length - string.length).join(' ');
  }
}

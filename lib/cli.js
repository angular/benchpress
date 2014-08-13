var fs = require('fs'),
    path = require('path'),
    benchpressBase = path.resolve(module.filename, '../../'),
    rimraf = require('rimraf'),
    buildPath = path.resolve('benchpress-build'),
    benchmarksPath = path.resolve('benchmarks'),
    underscorePath = path.resolve(benchpressBase, 'node_modules/underscore/underscore-min.js'),
    bootstrapPath = path.resolve(benchpressBase, 'node_modules/bootStrap/dist/css/bootstrap.min.css'),
    bpPath = path.resolve(benchpressBase, 'lib/bp.js'),
    libPath = path.resolve(benchpressBase, 'lib'),
    httpServer = require('http-server');

exports.launchChrome = function launchChrome() {
  if (process.platform == 'linux') {
    require('child_process').exec('google-chrome -incognito --js-flags="--expose-gc"', function(err) {
      if (err) console.error('An error occurred trying to launch Chrome: ', err);
    });
  }
  else if (process.platform === 'darwin') {
    require('child_process').exec('/Applications/Google\\ Chrome\\ Canary.app/Contents/MacOS/Google\\ Chrome\\ Canary --enable-memory-info --enable-precise-memory-info --enable-memory-benchmarking --js-flags="--expose-gc" -incognito', function(err) {
      if (err) console.error('An error occurred trying to launch Chrome: ', err);
    });
  }
  else {
    console.log('Cannot launch chrome for your platform: ', process.platform);
  }
};

exports.run = function run() {
  var port = 3339;
  var host = 'localhost';
  var server = httpServer.createServer();
  server.listen(port, host, function() {
    console.log('Starting up http-server, serving '
      + server.root
      + ' on port: '
      + port.toString());
    console.log('Hit CTRL-C to stop the server');
  });
};

exports.build = function build() {
  //Start fresh
  rimraf(buildPath, buildIt);

  function buildIt (err) {
    var template, benchmarks;
    if (err) throw err;
    fs.mkdirSync(buildPath);

    //Get benchmark html template
    template = fs.readFileSync(path.resolve(libPath, 'template.html'));
    benchmarks = fs.readdirSync(benchmarksPath);
    benchmarks.forEach(function(benchmark) {
      var benchmarkPath, dependencies, main, scriptTags = '';

      benchmarkPath = path.resolve(benchmarksPath, benchmark);
      //Ignore any non-directories in the benchmark folder
      if (!fs.lstatSync(benchmarkPath).isDirectory()) return;

      fs.mkdirSync(path.resolve(buildPath, benchmark));

      var config = new Config();
      require(path.resolve(benchmarkPath, 'bp.conf.js'))(config);

      dependencies = fs.readdirSync(benchmarkPath);
      dependencies.forEach(function(dependency) {
        var dependencyPath = path.resolve('benchmarks', benchmark, dependency);
        if (dependency === 'main.html') {
          //This is the main benchmark template
          main = fs.readFileSync(dependencyPath).toString();
          main = template.toString().replace('%%PLACEHOLDER%%', main);
        }
        else {
          fs.createReadStream(dependencyPath).pipe(fs.createWriteStream(path.resolve(buildPath, benchmark, dependency)));
        }
      });
      fs.createReadStream(underscorePath).pipe(fs.createWriteStream(path.resolve(buildPath, benchmark, 'underscore-min.js')));
      fs.createReadStream(bpPath).pipe(fs.createWriteStream(path.resolve(buildPath, benchmark, 'bp.js')));
      fs.createReadStream(bootstrapPath).pipe(fs.createWriteStream(path.resolve(buildPath, benchmark, 'bootstrap.min.css')));
      main = main.replace('%%SCRIPTS%%', JSON.stringify(config.scripts));

      fs.writeFileSync(path.resolve(buildPath, benchmark, 'index.html'), main);
    });
  }

  function Config() {
  }

  Config.prototype.set = function (obj) {
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        this[k] = obj[k];
      }
    }
  }
};

switch (process.argv[2]) {
  case 'build':
    exports.build();
    break;
  case 'run':
    exports.run();
    break;
  case 'launch_chrome':
    exports.launchChrome();
    break;
  default:
    console.log('Unknown command: ', process.argv[2]);
    console.log('Acceptable commands are "build", "run", "launch_chrome"');
    console.log('benchpress version ', require('../package.json').version);
}

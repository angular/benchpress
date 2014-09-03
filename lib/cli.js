var fs = require('fs'),
    path = require('path'),
    benchpressBase = path.resolve(module.filename, '../../'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp'),
    defaultBuildPath = path.resolve('benchpress-build'),
    defaultBenchmarksPath = path.resolve('benchmarks'),
    underscorePath = path.resolve(benchpressBase, 'node_modules/underscore/underscore-min.js'),
    bootstrapPath = path.resolve(benchpressBase, 'node_modules/bootstrap/dist/css/bootstrap.min.css'),
    bpPath = path.resolve(benchpressBase, 'lib/bp.js'),
    libPath = path.resolve(benchpressBase, 'lib'),
    minimist = require('minimist'),
    express = require('express');

exports.launchChrome = function launchChrome(done) {
  if (process.platform == 'linux') {
    require('child_process').exec('google-chrome -incognito --js-flags="--expose-gc"', function(err) {
      if (err) console.error('An error occurred trying to launch Chrome: ', err);
      done && done();
    });
  }
  else if (process.platform === 'darwin') {
    require('child_process').exec('/Applications/Google\\ Chrome\\ Canary.app/Contents/MacOS/Google\\ Chrome\\ Canary --enable-memory-info --enable-precise-memory-info --enable-memory-benchmarking --js-flags="--expose-gc" -incognito', function(err) {
      if (err) console.error('An error occurred trying to launch Chrome: ', err);
      done && done();
    });
  }
  else {
    console.log('Cannot launch chrome for your platform: ', process.platform);
    done && done();
  }
};

exports.run = function run(options) {
  var port = 3339;
  express().
    get('/', function(req, res) {
      res.redirect(options.buildPath || path.relative('./', defaultBuildPath));
    }).
    use(express.static(path.resolve('./'))).
    listen(port);
};

exports.build = function build(options, done) {
  options = options || {};
  var buildPath = options.buildPath || defaultBuildPath,
      benchmarksPath = options.benchmarksPath || defaultBenchmarksPath;

  //Start fresh
  rimraf(buildPath, buildIt);

  function buildIt (err) {
    var template, benchmarks;
    if (err) throw err;
    mkdirp.sync(buildPath);

    //Get benchmark html template
    fs.readFile(path.resolve(libPath, 'template.html'), function(err, template) {
      if (err) {
        switch (err.errno) {
          case 34:
            throw new Error('Could not find template.html in module');
            break;
          default:
            throw err;
        }
      }
      benchmarks = fs.readdirSync(benchmarksPath);
      benchmarks.forEach(function(benchmark) {
        var dependencies, main, config,
            benchmarkPath = path.resolve(benchmarksPath, benchmark),
            scriptTags = '',
            writtenFiles = 0;


        //Ignore any non-directories in the benchmark folder
        if (!fs.lstatSync(benchmarkPath).isDirectory()) return;

        fs.mkdirSync(path.resolve(buildPath, benchmark));

        config = new Config();
        require(path.resolve(benchmarkPath, 'bp.conf.js'))(config);

        dependencies = fs.readdirSync(benchmarkPath);

        dependencies.forEach(function(dependency) {
          var dependencyPath = path.resolve(benchmarkPath, dependency);
          if (dependency === 'main.html') {
            //This is the main benchmark template
            main = fs.readFileSync(dependencyPath).toString();
            main = template.toString().replace('%%PLACEHOLDER%%', main);
          }
          else {
            fs.createReadStream(dependencyPath).pipe(fs.createWriteStream(path.resolve(buildPath, benchmark, dependency)));
          }
        });

        main = main.replace('%%SCRIPTS%%', JSON.stringify(config.scripts));
        fs.writeFileSync(path.resolve(buildPath, benchmark, 'index.html'), main);
        createBenchmarkListingPage(buildPath, benchmarks);

        fs.createReadStream(underscorePath).
            pipe(fs.createWriteStream(path.resolve(buildPath, benchmark, 'underscore-min.js'))).
            on('close', isDone);
        fs.createReadStream(bpPath).
            pipe(fs.createWriteStream(path.resolve(buildPath, benchmark, 'bp.js'))).
            on('close', isDone);
        fs.createReadStream(bootstrapPath).
            pipe(fs.createWriteStream(path.resolve(buildPath, benchmark, 'bootstrap.min.css'))).
            on('close', isDone);

        function isDone() {
          writtenFiles++;
          if (writtenFiles === 3) done && done();
        }
      });
    });

  }

  function Config() {}

  Config.prototype.set = function (obj) {
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        this[k] = obj[k];
      }
    }
  }
};

exports.exec = function() {
  var args = minimist(process.argv.slice(2));
  switch (process.argv[2]) {
    case 'build':
      exports.build({
        buildPath: args['build-path'],
        benchmarksPath: args['benchmark-path']
      });
      break;
    case 'run':
      exports.run({
        buildPath: args['build-path']
      });
      break;
    case 'launch_chrome':
      exports.launchChrome();
      break;
    default:
      console.log('Unknown command: ', process.argv[2]);
      console.log('Acceptable commands are "build", "run", "launch_chrome"');
      console.log('benchpress version ', require('../package.json').version);
  }
};

function createBenchmarkListingPage (buildPath, directoryList) {
  var directoryMarkup = [
        '<html>',
          '<head>',
            '<title>Available Benchmarks</title>',
          '</head>',
          '<body>',
            '<h1>Available Benchmarks</h1>',
            '<ul>',
              '%%CONTENT%%',
            '</ul>',
          '</body>',
        '</html>'].join('\n'),
      liMarkup = '<li><a href="%%BENCHMARK%%">%%BENCHMARK%%</a></li>'
      content = '';
  directoryList.forEach(function(benchmark) {
    content += liMarkup.replace(/%%BENCHMARK%%/g, benchmark);
  });
  directoryMarkup = directoryMarkup.replace('%%CONTENT%%', content);
  fs.writeFileSync(path.resolve(buildPath, 'index.html'), directoryMarkup);
}

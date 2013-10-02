module.exports = function (grunt) {
  var q = require('q'),
      path = require('path'),
      exec = require('child_process').exec,
      createClone = require('./tasks/createClone')(grunt),
      checkoutSHA = require('./tasks/checkoutSha')(grunt);

  grunt.registerTask('compareShas', 'Run tests against two SHAs', function (sha1, sha2) {
    console.log('args', process.argv);
    var GIT_DIR = 'angular.js';
    var BUILD_DIR = 'builds';
    var DEFAULT_REPO = 'https://github.com/angular/angular.js';
    var done = this.async();

    if (grunt.file.isDir(BUILD_DIR)) {
      grunt.file.delete(BUILD_DIR);
    }

    grunt.file.mkdir(BUILD_DIR);
    stepThrough(sha1);

    function stepThrough (sha) {
      createClone(DEFAULT_REPO, sha)
      .then(checkoutSHA)
      .then(packageBuild)
      .then(copyBuild)
      .then(generateKarma)
      .then(repeat);
    }

    //Step 3: Package the build
    //Step 4: Copy the build into a temporary directory
    //Step 5: Generate a karma config for testing this sha
    //Repeat process for 2nd sha
    //Should this run the tests?
    //Should this help set up remotes?

    function packageBuild (sha) {
      var deferred = q.defer();

      grunt.log.writeln('Step 3: Package build');

      process.nextTick(function () {
        //Important if it's a fresh clone. 
        //Otherwise the package process would
        //Automatically npm install
        grunt.log.writeln('Installing npm dependencies...');
        grunt.util.spawn({
          cmd: 'npm',
          args: ['install'],
          opts: {cwd: path.resolve(GIT_DIR)}
        }, 
        function () {
          grunt.log.writeln('Running grunt package...');
          grunt.util.spawn({
            cmd: 'grunt',
            args: ['package'],
            opts: {cwd: path.resolve(GIT_DIR)}
          },
          function () {
            deferred.resolve(sha);
          });
        });
      });

      return deferred.promise;
    }

    function copyBuild (sha) {
      var deferred = q.defer();
      grunt.log.writeln('Step 4: Copy the build to a new directory.');

      process.nextTick(function () {
        grunt.file.mkdir(BUILD_DIR + '/sha-' + sha);
        grunt.file.copy(path.resolve(GIT_DIR, 'build', 'angular.js'), path.resolve(BUILD_DIR, 'sha-' + sha, 'angular.js'));
        grunt.file.copy(path.resolve(GIT_DIR, 'build', 'angular.min.js'), path.resolve(BUILD_DIR, 'sha-' + sha, 'angular.min.js'));
        deferred.resolve(sha);
      });
      
      return deferred.promise;
    }

    function generateKarma (sha) {
      var deferred = q.defer();
      var configFile = sha === sha1 ? 'configA.json' : 'configB.json';

      process.nextTick(function () {
        var version = grunt.file.readJSON(path.resolve(GIT_DIR, 'build', 'version.json'));

        grunt.file.write(path.resolve('builds', 'sha-' + sha, 'angular-capture.js'),
          [
            'var angulars = angulars || {};',
            'angulars["' + version.full + '"] = angular;',
            'angular = null'
          ].join('\n'));

        var config = {
          angular: path.resolve('builds', 'sha-' + sha, 'angular.min.js'),
          capture: path.resolve('builds', 'sha-' + sha, 'angular-capture.js')
        };

        grunt.file.write(path.resolve(configFile), JSON.stringify(config));
        deferred.resolve(sha);
      });

      return deferred.promise;
    }

    function repeat (sha) {
      if (sha === sha1 && sha2) {
        stepThrough(sha2);
       }
      else {
        done();
      }
    }
  });

  grunt.registerTask('benchmark', 'Run the benchmarks and generate a report',
    function() {
      var done = this.async();

      process.nextTick(function () {
        exec('echo "var results =" >report/sampleTimes.js &&' +
            ' node node_modules/karma/bin/karma run |' +
            ' grep XXX: | sed -e "s/^.*XXX:[^{]*{\\(.*\\)}\'.*$/{\\1}/" >> report/sampleTimes.js', function() {
          done();
        });
      });
    });
}

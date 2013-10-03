module.exports = function (grunt) {
  var q = require('q'),
      path = require('path'),
      exec = require('child_process').exec,
      createClone = require('./tasks/createClone')(grunt),
      checkoutSHA = require('./tasks/checkoutSha')(grunt),
      packageBuild = require('./tasks/packageBuild')(grunt),
      copyBuild = require('./tasks/copyBuild')(grunt),
      generateKarma = require('./tasks/generateKarma')(grunt);

  grunt.registerTask('compareShas', 'Run tests against two SHAs', function (sha1, sha2) {
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
      createClone({repo: DEFAULT_REPO, sha: sha})
        .then(checkoutSHA)
        .then(packageBuild)
        .then(copyBuild)
        .then(function (options) {
          var deferred = q.defer();

          process.nextTick(function () {
            options.configFile = options.sha === sha1 ? 'configA.json' : 'configB.json';
            deferred.resolve(options);
          });

          return deferred.promise;
        })
        .then(generateKarma)
        .then(repeat);
    }

    function repeat (options) {
      if (options.sha === sha1 && sha2) {
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

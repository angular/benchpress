module.exports = function (grunt) {
  grunt.registerTask(
    'generateKarma',
    'generate the configuration for karma',
    generateKarma);

  return generateKarma;

  function generateKarma (options, arg2) {
    var repo, sha,
        q = require('q'),
        path = require('path'),
        deferred = q.defer(),
        GIT_DIR = 'angular.js',
        done = this.async ? this.async() : null;

    if (typeof options === 'string') {
      repo = options;
      sha = arg2;
    }
    else {
      if (!options) {
        grunt.log.error('generateKarma called with no options');
        return false;
      }
      repo = options.repo;
      sha = options.sha;
    }

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

      grunt.file.write(path.resolve(options.configFile), JSON.stringify(config));
      deferred.resolve(options);
      done && done();
    });

    return deferred.promise;
  }
}; 

module.exports = function (grunt) {
  grunt.registerTask(
    'copyBuild',
    'copy the project build into the builds/ directory to be tested',
    copyBuild);

  return copyBuild;

  function copyBuild (options, arg2) {
    var repo, sha,
        q = require('q'),
        path = require('path'),
        deferred = q.defer(),
        GIT_DIR = 'angular.js',
        BUILD_DIR = 'builds',
        done = this.async ? this.async() : null;

    if (typeof options === 'string') {
      repo = options;
      sha = arg2;
    }
    else {
      repo = options.repo;
      sha = options.sha;
    }

    process.nextTick(function () {
      grunt.file.mkdir(path.resolve(BUILD_DIR, 'sha-' + sha));
      grunt.file.copy(path.resolve(GIT_DIR, 'build', 'angular.js'), path.resolve(BUILD_DIR, 'sha-' + sha, 'angular.js'));
      grunt.file.copy(path.resolve(GIT_DIR, 'build', 'angular.min.js'), path.resolve(BUILD_DIR, 'sha-' + sha, 'angular.min.js'));
      deferred.resolve(options);
      done && done();
    });
    
    return deferred.promise;
  }
};

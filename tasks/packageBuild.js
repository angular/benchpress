module.exports = function (grunt) {
  grunt.registerTask(
    'packageBuild',
    'Package a build for testing',
    packageBuild);

	return packageBuild;

  function packageBuild (options, arg2) {
    var repo, sha,
        q = require('q'),
        deferred = q.defer(),
        GIT_DIR = 'angular.js',
        done = this.async ? this.async() : null,
        path = require('path');

    if (typeof options === 'string') {
      repo = options;
      sha = arg2;
    }
    else {
      repo = options.repo;
      sha = options.sha;
    }

    process.nextTick(function () {
      //Important if it's a fresh clone. 
      //Otherwise the package process would
      //Automatically npm install
      grunt.log.writeln('Installing npm dependencies...');

      grunt.util.spawn({
        cmd: 'npm',
        args: ['install'],
        opts: {
          cwd: path.resolve(GIT_DIR)
        }
      }, 
      function () {
        grunt.log.writeln('Running grunt package...');

        grunt.util.spawn({
          cmd: 'grunt',
          args: ['package'],
          opts: {
            cwd: path.resolve(GIT_DIR)
          }
        },
        function () {
          deferred.resolve(options);
          done && done();
        });
      });
    });

    return deferred.promise;
  }
}
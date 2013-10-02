module.exports = function (grunt) {
  grunt.registerTask(
    'packageBuild',
    'Package a build for testing',
    packageBuild);

	return packageBuild;

  function packageBuild (repo, sha) {
    var q = require('q'),
        deferred = q.defer(),
        GIT_DIR = 'angular.js',
        done = !sha ? this.async() : null,
        path = require('path');

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
          deferred.resolve(repo, sha);
          done && done();
        });
      });
    });

    return deferred.promise;
  }
}
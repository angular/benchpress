module.exports = function (grunt) {
  grunt.registerTask('createClone', 
    'Create a clone of a repository if one does not exist', 
    createClone);

  return createClone;

  function createClone (repo, sha) {
    var q = require('q'),
        GIT_FOLDER = 'angular.js',
        // If this is a one-off task, we'll use done
        done = !sha ? this.async() : null,
        // Otherwise we'll resolve the promise
        deferred = q.defer();

    process.nextTick(function () {
      if (!grunt.file.isDir(GIT_FOLDER)) {
        grunt.log.writeln('Creating clone of angular.js repo');

        grunt.util.spawn({
          cmd: 'git',
          args: ['clone', repo]
        },
        function () {
          deferred.resolve(repo, sha);
          done && done();
        });
      }
      else {
        grunt.log.writeln('angular.js repo already exists. (this is a good thing)');

        deferred.resolve(repo, sha);
        done && done();
      }
    });

    return deferred.promise;
  }  
}

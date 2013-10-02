module.exports = function (grunt) {
  grunt.registerTask(
    'checkoutSHA',
    'git checkout a particular SHA in the repo',
    checkoutSHA);

  return checkoutSHA;

  function checkoutSHA (repo, sha) {
    var GIT_DIR   = 'angular.js',
        q = require('q'),
        path = require('path'),
        deferred  = q.defer(),
        remote = 'origin',
        repoPath  = path.resolve(GIT_DIR),
        done = !sha ? this.async() : null;

    process.nextTick(function () {
      grunt.log.writeln('Fetching remote...');

      grunt.util.spawn({
          cmd: 'git',
          args: ['fetch', remote],
          opts: {cwd: repoPath}
        },
        function () {
          grunt.log.writeln('Checking out SHA', sha);

          grunt.util.spawn({
            cmd: 'git',
            args: ['checkout', sha],
            opts: {cwd: repoPath}
          },
          function (err, result, code) {
            grunt.log.writeln('Done checkout: ', err, result, code);

            deferred.resolve(repo, sha);
            done && done();
          });
        });
    });

    return deferred.promise;
  }
}

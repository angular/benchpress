module.exports = function (grunt) {
  var q = require('q'),
      path = require('path');

  grunt.registerTask('compareShas', 'Run tests against two SHAs', function (sha1, sha2) {
    var done = this.async();

    stepThrough(sha1);

    function stepThrough (sha) {
      checkForClone(sha)
      .then(checkoutSHA)
      .then(packageBuild)
      //        .then(copyBuild)
      //        .then(generateKarma)
      //        .then(repeat);
    }

    function checkForClone (sha) {
      var deferred = q.defer();
      grunt.log.writeln('Step 1: Check to see if a private copy of the repo exists');

      process.nextTick(function () {
        if (!grunt.file.isDir('angular.js')) {
          grunt.log.writeln('Creating clone of angular.js repo');
          grunt.util.spawn({
            cmd: 'git',
            args: ['clone', 'https://github.com/angular/angular.js']
          },
          function () {
            deferred.resolve(sha);
          });
        }
        else {
          grunt.log.writeln('angular.js repo already exists. (this is a good thing)');
          deferred.resolve(sha);
        }
      });

      return deferred.promise;
    }

    //Step 3: Package the build
    //Step 4: Copy the build into a temporary directory
    //Step 5: Generate a karma config for testing this sha
    //Repeat process for 2nd sha
    //Should this run the tests?
    //Should this help set up remotes?

    function checkoutSHA (sha) {
      var remote, fullSHA,
          deferred = q.defer(),
          repoPath = path.resolve('angular.js');

      if (sha.indexOf('/') !== -1) {
        remote = sha.split('/')[0];
        fullSHA = sha.split('/')[1];
      }
      else {
        fullSHA = sha;
        remote = 'origin';
      }

      grunt.log.writeln('Step 2: Preparing to checkout sha', sha, 'to build a copy');

      process.nextTick(function () {
        grunt.log.writeln('Fetching remote...');
        grunt.util.spawn({cmd: 'cd', args: ['angular.js']}, function () {
          grunt.log.writeln('directory', process.cwd());
          grunt.util.spawn({
            cmd: 'git',
            args: ['fetch', remote]
          },
          function () {
            grunt.log.writeln('Checking out SHA', fullSHA);
            grunt.util.spawn({
              cmd: 'git',
              args: ['checkout', fullSHA],
                opts: {cwd: repoPath}
            },
            function (err, result, code) {
              grunt.log.writeln('Done checkout out', err, result, code);
              grunt.util.spawn({cmd: 'cd', args: ['../']}, function () {
                deferred.resolve(sha);
              });
            });
          });
        });
      });

      return deferred.promise;
    }

    function packageBuild (sha) {
      grunt.log.writeln('package build');
      done();
    }

    function copyBuild (sha) {

    }

    function generateKarma (sha) {
    }

    function repeat (sha) {
      if (sha === sha1) {
        stepThrough(sha2);
       }
      else {
        done();
      }
    }
  });
}

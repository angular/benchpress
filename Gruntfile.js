module.exports = function (grunt) {
  var q = require('q');

  grunt.registerTask('compareShas', 'Run tests against two SHAs', function (sha1, sha2) {
    console.log('comparing', sha1, sha2);
    var done = this.async();

    stepThrough(sha1);

    function stepThrough (sha) {
      checkForClone(sha)
        .then(checkoutSHA)
//        .then(packageBuild)
//        .then(copyBuild)
//        .then(generateKarma)
//        .then(repeat);
    }

    //Step 1: Check to see if a private copy of the repo exists
   function checkForClone (sha) {
     grunt.log.writeln('checkForClone');
      var deferred = q.defer();

      process.nextTick(function () {
        grunt.log.writeln('nextTick');
        if (!grunt.file.isDir('angular.js')) {
          grunt.log.writeln('Creating clone of angular.js repo');
          grunt.util.spawn({
            cmd: 'git',
            args: ['clone', 'https://github.com/angular/angular.js']
          }, function () {
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

    //Step 2: Check out sha in private copy


    //Step 3: Package the build
    //Step 4: Copy the build into a temporary directory
    //Step 5: Generate a karma config for testing this sha
    //Repeat process for 2nd sha
    //Should this run the tests?
    //

    function checkoutSHA (sha) {
//      grunt.util.spawn({}, packageBuild);
      grunt.log.writeln('checkout sha ', sha);
      done();
    }

    function packageBuild (sha) {

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

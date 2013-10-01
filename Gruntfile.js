module.exports = function (grunt) {
  grunt.registerTask('compareShas', 'Run tests against two SHAs', function (sha1, sha2) {
    console.log('comparing', sha1, sha2);
    //Step 1: Check to see if a private copy of the repo exists, and clone one
    //if not
    //Step 2: Check out sha in private copy
    //Step 3: Package the build
    //Step 4: Copy the build into a temporary directory
    //Step 5: Generate a karma config for testing this sha
    //Repeat process for 2nd sha
    //Should this run the tests?
  });
}

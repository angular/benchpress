var cli = require('../lib/cli');

module.exports = function (grunt) {
  grunt.registerTask('bp_launch_chrome', 'launch chrome canary in incognito with flags',
      function() {
        cli.launchChrome(this.async());
      });
};

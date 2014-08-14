var cli = require('../lib/cli');

module.exports = function (grunt) {
  grunt.registerTask('bp_run', 'run a server from cwd', function() {
    cli.run(this.async());
  });
};
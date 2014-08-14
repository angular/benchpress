var cli = require('../lib/cli');

module.exports = function (grunt) {
  grunt.registerTask('bp_build', 'build benchmarks for project', function() {
    cli.build(this.options(), this.async());
  });
};
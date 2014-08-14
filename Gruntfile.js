var cli = require('./lib/cli');

/**
 * This file is only for testing and demonstration of the included grunt tasks.
 */

module.exports = function (grunt) {
  grunt.initConfig({
    bp_build: {
      options: {
        buildPath: 'build/benchmarks',
        benchmarksPath: 'grunt-benchmarks'
      }
    }
  });

  grunt.loadTasks('./tasks');
};

module.exports = function(config) {
  var configA = require('./configA.json'),
      configB = require('./configB.json');

  config.set({
    basePath: '.',
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    // all tests must be 'included', but all other libraries must be 'served' and
    // optionally 'watched' only.
    files: [
      'lib/angular.js',
      'lib/angular-mocks.js',
      'lodash.js',
      'benchmark.js',
      'src/ng-bench.js',
      'specs/*.js'
    ],

    autoWatch: false,

    plugins: ['karma-chrome-launcher', 'karma-jasmine'],

    browsers: ['Chrome'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 5000,
  });
};

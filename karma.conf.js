module.exports = function(config) {
  config.set({
    //logLevel: config.LOG_DEBUG,
    basePath: '.',
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    // all tests must be 'included', but all other libraries must be 'served' and
    // optionally 'watched' only.
    files: [
      'lodash.js',
      'benchmark.js',
      'src/ng-bench.js',
      //'../build/angular.js',
      //'capture/capture-latest.js',
      'builds/angular-1.0.0rc8.js',
      'capture/capture-1.0.0rc8.js',
      //'builds/angular-1.0.0rc1.js',
      //'capture/capture-1.0.0rc1.js',
    
      'specs/*.js', // test ngBench before any tests are run!
    
      'perfs/ng/*.js'
    ],

    autoWatch: false,

    plugins: ['karma-chrome-launcher', 'karma-jasmine'],

    browsers: ['Chrome'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 5000,
  });
};

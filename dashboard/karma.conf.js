module.exports = function(config) {
  config.plugins.push('karma-ng-html2js-preprocessor');
  config.set({
    preprocessors: {
      'components/**/*.html': 'ng-html2js'
    },
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'test/mock-api.js',
      'app.js',
      'components/iframe-runner-directive/iframe-runner.js',
      'components/**/*',
      'benchmark/**.js',
      '*.js'
    ],
    exclude: ['karma.conf.js'],
    browsers: ['Chrome']
  });
};

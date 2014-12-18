module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app.js',
      'components/**/*',
      '*.js'
    ],
    exclude: ['karma.conf.js'],
    browsers: ['Chrome']
  });
};

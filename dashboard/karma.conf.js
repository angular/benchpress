module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'libs/angular.js',
      'libs/*.js',
      'app.js',
      'components/**/*',
      '*.js'
    ],
    exclude: ['karma.conf.js'],
    browsers: ['Chrome']
  });
};

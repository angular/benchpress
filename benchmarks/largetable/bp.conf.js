module.exports = function(config) {
  config.set({
    scripts: [{
      id: 'jquery',
      src: 'jquery-noop.js'
    },
    {
      id: 'angular',
      src: 'angular.js'
    },
    {
      src: 'app.js',
    }]
  });
};

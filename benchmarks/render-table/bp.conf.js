module.exports = function(config) {
  config.set({
    scripts: [
      {
        id: 'tableRender',
        src: 'table-render.js'
      }
    ],
    modules: [{
      id: 'myModule',
      src: 'myModule.es6'
    }]
  })
};

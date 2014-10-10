var expressMock = module.exports = function () {
  function App () {
  }

  App.get = function() {
    expressMock.get.apply(App, arguments);
    return App;
  };

  App.use = function() {
    expressMock.use.apply(App, arguments);
    return App;
  };

  return App;
}

expressMock.static = function(path) {
  return function(staticFn) {
  };
};

expressMock.get = function (path, handler) {
  expressMock.handlers['get'][path] = handler;
  return expressMock;
};

expressMock.use = function (fn) {

};

expressMock.handlers = {
  get: {}
};

expressMock._handle = function (method, path, args) {
  var handler;
  if (handler = expressMock.handlers[method][path]) {
    handler.apply(null, args);
  }
}

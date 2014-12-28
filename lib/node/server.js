var express = require('express'),
    path = require('path'),
    http = require('http');

exports.run = function run(options) {
  options = options || {};
  var port = options.port || 3339;
  var app = express().
    get('/', function(req, res) {
      res.redirect(options.buildPath);
    }).
    use(express.static(path.resolve('./')));
  console.log('Benchpress server listening at port %s', port);
  return app.listen(port);
};

var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    api = require('./api');

exports.run = function run(options) {
  options = options || {};
  var port = options.port || 3339;

  var app = express().
    get('/auto-bp.js', function(req, res, next) {
      fs.createReadStream(path.resolve('dist','auto-bp.js')).pipe(res);
    }).
    get('/bp.js', function(req, res, next) {
      fs.createReadStream(path.resolve('dist','bp.js')).pipe(res);
    }).
    use('/api', api).
    use(express.static(path.resolve('./dashboard'))).
    //TODO: make configurable
    use('/benchmarks/',express.static(path.resolve('./benchmarks')));

  console.log('listening at ', port);
  return http.createServer(app).listen(port);
};

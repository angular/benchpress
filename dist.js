#!/usr/local/bin/node

var browserify = require('browserify');
var fs = require('fs');
var path = require('path');

['auto-bp.js','bp.js'].forEach(function(dest) {
  var bpOut = '';
  browserify(path.resolve('./lib/', dest), {baseDir: './lib/'}).bundle().on('data', function(chunk) {
    bpOut += chunk.toString();
  }).on('end', function() {
    bpOut = bpOut.replace(/\$traceurRuntime/g, '$diTraceurRuntime');
    bpOut = bpOut.replace(/System/g, 'DITraceurSystem');
    fs.writeFileSync(path.resolve('dist/', dest), bpOut);
  });
});

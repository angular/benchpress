var express = require('express');
var fs = require('fs');
var router = express.Router();
var minimist = require('minimist');

router.get('/', function(req, res, next) {
  res.status(404);
  next();
});

router.get('/benchmarks', function(req, res, next) {
  var args = minimist(process.argv.slice(2));
  var path = args['benchmarks-path'] || 'benchmarks';

  fs.readdir(path, function(err, folders){
    if (err) next(err);
    res.json({
      benchmarks: folders.map(function(item) {
        return {name: item};
      })
    });
    next();
  });
});

module.exports = router;

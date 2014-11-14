var di = require('di');
var testing = require('../node_modules/di/dist/cjs/testing');
var AutoRunner = require('../lib/AutoRunner');
var Globals = require('../lib/Globals');
var MockGlobals = require('./MockGlobals');
var RunState = require('../lib/RunState');
var Utils = require('../lib/Utils');

describe('AutoRunner', function() {
  var globals, autoRunner, utils;
  beforeEach(function() {
    testing.use(MockGlobals).as(Globals);
    testing.inject(AutoRunner, Globals, RunState, Utils, function(a,g,rs,u){
      globals = g;
      autoRunner = a;
      runState = rs;
      utils = u;
    });
  });

  describe('.bootstrap', function() {
    it('should call runState.setDefault with query params', function() {
      var spy = spyOn(runState, 'setDefault');
      globals._window.location.search = '?numSamples=50&iterations=100';
      autoRunner.bootstrap();
      expect(spy).toHaveBeenCalledWith({
        numSamples: '50',
        iterations: '100'
      });
    });
  });


  describe('.ready()', function() {

  });
});
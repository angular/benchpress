var di = require('di');
var Globals = require('./Globals');
var RunState = require('./RunState');
var Utils = require('./Utils');
function AutoRunner(globals,runState,utils){
  this._globals = globals;
  this._runState = runState;
  this._utils = utils;
}

AutoRunner.prototype.bootstrap = function() {
  this._runState.setDefault(this._utils.parseSearch(this._globals._window.location.search));
};

AutoRunner.prototype.ready = function () {

};

di.annotate(AutoRunner, new di.Inject(Globals,RunState,Utils));
module.exports = AutoRunner;

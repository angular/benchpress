var di = require('di');
var Utils = require('./Utils');
var Globals = require('./Globals');

function Variables(utils, globals) {
  this.variables = [];
  this._utils = utils;
  this._globals = globals;
}

Variables.prototype._setPendingFromSearch = function() {
  if (this._pending === undefined) {
    this._pending = this._utils.
        parseSearch(this._globals._window.location.search).variable;
  }
};

Variables.prototype._autoSelectPending = function() {
  if (this._pending !== null && this._pending !== undefined) {
    return this.select(this._pending);
    var reduced =  this.variables.reduce(function(prev, curr) {
      prev[curr.value] = curr;
      return prev;
    }, {});
    this.selected = reduced[this._pending];
  }
};

Variables.prototype.add = function (variable) {
  this._setPendingFromSearch();
  this.variables.push(variable);
  this._autoSelectPending();
};

Variables.prototype.addMany = function (varArr) {
  this._setPendingFromSearch();
  this.variables.push.apply(this.variables, varArr);
  this._autoSelectPending();
};

Variables.prototype.select = function (val) {
  this.selected = this.variables.reduce(function(prev, curr) {
    prev[curr.value] = curr;
    return prev;
  }, {})[val];
  if (this.selected !== undefined) this._pending = null;
};

di.annotate(Variables, new di.Inject(Utils, Globals))
module.exports = Variables;

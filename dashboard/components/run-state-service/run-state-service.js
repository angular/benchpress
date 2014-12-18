(function(){

angular.module('bpdRunStateService', ['bpdRunContextsService']).
  service('runState', ['runContexts', RunStateService]);

function RunStateService(runContexts) {
  this._defaultIterations = 25;
  this._defaultNumSamples = 20;
  this._running = false;
  this.recentResult = {};
  this._context = runContexts.IFRAME;
  this._runContexts = runContexts;
}

RunStateService.prototype = {
  get defaults () {
    return this._defaults;
  },
  set defaults (defaults) {
    ['iterations','numSamples'].forEach(function(prop) {
      var propVal = parseInt(defaults[prop],10);
      if (typeof propVal === 'number' && !isNaN(propVal)) {
        this[prop] = propVal;
        this._defaults[prop] = propVal;
      }
      else if (typeof defaults[prop] !== 'undefined') {
        throw new Error(prop + ' must be of type number, got: ' + typeof defaults[prop]);
      }
    }.bind(this));
  },
  get defaultIterations() {
    return this._defaultIterations;
  },
  set defaultIterations(value) {
    if (typeof value !== 'number') throw new Error('iterations must be of type number, got: '+typeof value);
    this._defaultIterations = value;
  },
  get defaultNumSamples() {
    return this._defaultNumSamples;
  },
  set defaultNumSamples(value) {
    if (typeof value !== 'number') throw new Error('numSamples must be of type number, got: '+typeof value);
    this._defaultNumSamples = value;
  },
  get iterations() {
    return this._iterations || this.defaultIterations;
  },
  set iterations(value) {
    if (typeof value !== 'number') throw new Error('iterations value must be a number');
    this._iterations = value;
  },
  get numSamples () {
    return this._numSamples || this.defaultNumSamples;
  },
  set numSamples (value) {
    if (typeof value !== 'number') throw new Error('numSamples value must be a number');
    if (value < 0) throw new Error('must collect at least one sample');
    this._numSamples = value;
  },
  get running () {
    return this._running;
  },
  set running (value) {
    if (typeof value !== 'boolean') throw new Error('"running" must be a boolean value');
    this._running = value;
  },
  get context() {
    return this._context;
  },
  set context(value) {
    var valid = false;
    for (var item in this._runContexts) {
      if (this._runContexts.hasOwnProperty(item) && this._runContexts[item] === value) {
        valid = true;
        break;
      }
    }
    if (!valid) throw new Error(value+' is not a valid running context enumerable value');
    this._context = value;
  },
  resetDefaults: function () {
    this.iterations = this.defaultIterations;
    this.numSamples = this.defaultNumSamples;
  }
}

}());

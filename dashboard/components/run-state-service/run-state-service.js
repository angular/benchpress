angular.module('bpdRunStateService', []).
  value('runStateService', {
    _defaults: {
      iterations: 25,
      numSamples: 20
    },
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
    get iterations() {
      return this._iterations || this.defaults.iterations;
    },
    set iterations(value) {
      if (typeof value !== 'number') throw new Error('iterations value must be a number');
      this._iterations = value;
    },
    get numSamples () {
      return this._numSamples || this.defaults.numSamples;
    },
    set numSamples (value) {
      if (typeof value !== 'number') throw new Error('numSamples value must be a number');
      if (value < 0) throw new Error('must collect at least one sample');
      this._numSamples = value;
    },
    resetIterations: function () {
      this.iterations = this.defaults.iterations;
    },
    recentResult: {}
  });

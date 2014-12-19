angular.module('bpdIframeRunnerDirective').
  controller('IframeRunnerController',
      ['$scope', 'benchmarksService', 'runState',
      function($scope, benchmarksService, runState) {

    this.frameSrc = function () {
      var selected = benchmarksService.selected();
      if (!selected || typeof selected.name !== 'string') return;
      //TODO: support adding scripts and variables
      return [
        '/benchmarks/',
        selected.name,
        '/main.html',
        this.allOrNothing('numSamples', [runState.numSamples], true),
        this.allOrNothing('iterations', [runState.iterations]),
        this.allOrNothing('__bpAutoClose__', [true])
        ].join('');
    };

    this.allOrNothing = function (name, values, first) {
      var retValue = '';
      //undefined values or empty arrays
      if (Array.isArray(values) && values.length > 0) {
        values.forEach(function(val) {
          if (['string', 'boolean', 'number'].indexOf(typeof val) > -1) {
            retValue += (first?'?':'&')+name+'='+val;
            first = false;
          }
        });
      }
      return retValue;
    };
  }]);

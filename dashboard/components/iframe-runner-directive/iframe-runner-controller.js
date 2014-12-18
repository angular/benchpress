angular.module('bpdIframeRunnerDirective').
  controller('IframeRunnerController',
      ['$scope', 'benchmarksService', 'runState',
      function($scope, benchmarksService, runState) {

    this.frameSrc = function () {
      //TODO: real benchmark name
      //TODO: support adding scripts and variables
      return [
        '/benchmarks/largetable/main.html',
        this.allOrNothing('numSamples', [runState.numSamples], true),
        this.allOrNothing('iterations', [runState.iterations]),
        ].join('');
    };

    this.allOrNothing = function (name, values, first) {
      var retValue = '';
      //undefined values or empty arrays
      if (Array.isArray(values) && values.length > 0) {
        values.forEach(function(val) {
          if (typeof val === 'string' || typeof val === 'number') {
            retValue += (first?'?':'&')+name+'='+val;
            first = false;
          }
        });
      }
      return retValue;
    };
  }]);

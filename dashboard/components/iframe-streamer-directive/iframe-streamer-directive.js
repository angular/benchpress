(function(){

angular.module('bpdIframeStreamerDirective', ['bpdRunStateService', 'bpdStatsService']).
  directive('bpdIframeStreamer', ['$interval', function($interval) {
    return {
      restrict: 'A',
      controller: 'IframeStreamerController',
      link: function(scope, el, attrs, ctrl) {
        var timeout = 100;
        var elapsed = 0;

        // We have to wait for the window to be attached because it happens after the iframe is
        // added to the document
        scope.waitForContentWindow = $interval(function() {
          elapsed+= 5;
          if (el[0].contentWindow) {
            el[0].contentWindow.addEventListener('benchpressComplete', ctrl.onComplete);
            el[0].contentWindow.addEventListener('benchpressProgress', ctrl.onProgress);
            return;
          }
          if (elapsed >= timeout) {
            throw new Error('Timed out waiting for iframe.contentWindow to be defined');
          }
        }, 5, timeout / 5, false);

        el.on('$destroy', function() {
          $interval.cancel(scope.waitForContentWindow);
        });
      }
    }
  }]).
  controller('IframeStreamerController', ['$rootScope', 'runState', 'stats', function($rootScope, runState, stats) {
    this.onComplete = function(evt) {
      runState.running = false;
      stats.current = evt.result;
      $rootScope.$digest();
    };

    this.onProgress = function(evt) {
      stats.current = evt.result;
      console.log(stats.current);
      $rootScope.$digest();
    }
  }]);
}());

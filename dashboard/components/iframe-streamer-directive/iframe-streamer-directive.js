angular.module('bpdIframeStreamerDirective', ['bpdRunStateService']).
  directive('bpdIframeStreamer', ['$interval', '$rootScope', 'runState', function($interval, $rootScope, runState) {
    return {
      restrict: 'A',
      link: function(scope, el, attrs) {
        var timeout = 1000;
        var elapsed = 0;
        var waitForContentWindow = $interval(function() {
          elapsed+= 50;
          if (el[0].contentWindow) {
            el[0].contentWindow.addEventListener('benchpressComplete', function() {
              runState.running = false;
              $rootScope.$digest();
            });
            $interval.cancel(waitForContentWindow);
            return;
          }
          if (elapsed >= timeout) {
            $interval.cancel(waitForContentWindow);
            throw new Error('Timed out waiting for iframe.contentWindow to be defined');
          }
        }, 50);
      }
    }
  }]);

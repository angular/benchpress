angular.module('bpdIframeRunnerDirective').
  directive('bpdIframeRunner', ['runContexts', 'runState', '$templateCache', function(runContexts, runState, $templateCache) {
    return {
      restrict: 'E',
      link: function(scope) {
        scope.runContexts = runContexts;
        scope.runState = runState;
      },
      controller: 'IframeRunnerController',
      controllerAs: 'iframeCtrl',
      templateUrl: 'components/iframe-runner-directive/iframe-runner-directive.html'
    }
  }]);

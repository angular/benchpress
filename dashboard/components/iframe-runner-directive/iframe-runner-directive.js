angular.module('bpdIframeRunnerDirective', []).
  directive('bpdIframeRunner', ['runContexts', function(runContexts) {
    return {
      restrict: 'E',
      link: function(scope) {
        scope.runContexts = runContexts;
      },
      template: '<div ng-if="runningBenchmark && runContext == runContexts.IFRAME"><iframe></iframe></div>'
    }
  }]);
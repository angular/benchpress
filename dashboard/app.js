angular.module('benchpressDashboard', [
    'bpdBenchmarksService',
    'bpdIframeRunnerDirective',
    'bpdIframeStreamerDirective',
    'bpdRunContextsService',
    'bpdRunStateService',
    'bpdStatsService',
    'bpdTableReportDirective',
    'bpdScriptsService',
    'ngRoute'
  ]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'home.html',
        controller: 'HomeController'
      }).
      when('/benchmark/:name', {
        templateUrl: 'benchmark/benchmark.html',
        controller: 'BenchmarkController',
        controllerAs: 'ctrl'
      }).
      otherwise({redirectTo: '/'});
  }]);

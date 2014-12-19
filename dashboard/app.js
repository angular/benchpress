angular.module('benchpressDashboard', [
    'bpdBenchmarksService',
    'bpdIframeRunnerDirective',
    'bpdRunContextsService',
    'bpdRunStateService',
    'bpdIframeStreamerDirective',
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

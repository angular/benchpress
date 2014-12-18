angular.module('benchpressDashboard', ['ngRoute','bpdBenchmarksService']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'home.html',
        controller: 'HomeController'
      }).
      when('/benchmark/:name', {
        templateUrl: 'benchmark/benchmark.html',
        controller: 'BenchmarkController'
      }).
      otherwise({redirectTo: '/'});
  }]);

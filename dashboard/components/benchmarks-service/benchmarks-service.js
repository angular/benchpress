angular.module('bpdBenchmarksService', []).
  service('benchmarksService', ['$http', function($http) {
    this.get = function() {
      return $http.get('/api/benchmarks');
    };
  }]);

angular.module('bpdBenchmarksService', []).
  service('benchmarksService', ['$http', function($http) {
    var selectedName, benchmarksCache;

    this.get = function() {
      return $http.get('/api/benchmarks').then(function(res) {
        benchmarksCache = res.data;
        return res;
      });
    };

    this.select = function (name) {
      selectedName = name;
    };

    // By calculating at get-time, the object is guaranteed to be latest cached
    // version of benchmark
    this.selected = function () {
      if (!benchmarksCache || !benchmarksCache.benchmarks) return;
      var benchmarks = benchmarksCache.benchmarks;

      for (i in benchmarks) {
        if (benchmarks[i] && benchmarks[i].name === selectedName) {
          return benchmarks[i];
        }
      }
    }
  }]);

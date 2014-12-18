angular.module('bpdBenchmarksService', []).
  service('benchmarksService', ['$http', function($http) {
    var selectedName;

    this.get = function(options) {
      if (options && options.cacheOk && this._benchmarksCache) {
        return this._benchmarksCache;
      }
      return $http.get('/api/benchmarks').then(function(res) {
        this._benchmarksCache = res.data;
        return this._benchmarksCache;
      }.bind(this));
    };

    this.select = function (name) {
      selectedName = name;
    };

    // By calculating at get-time, the object is guaranteed to be latest cached
    // version of benchmark
    this.selected = function () {
      if (!this._benchmarksCache || !this._benchmarksCache.benchmarks) return;
      var benchmarks = this._benchmarksCache.benchmarks;

      for (i in benchmarks) {
        if (benchmarks[i] && benchmarks[i].name === selectedName) {
          return benchmarks[i];
        }
      }
    }
  }]);

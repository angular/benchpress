angular.module('bpdScriptsService', []).
  service('scripts', ['$http', function($http) {
    var selectedName;

    this.get = function(options) {
      if (options && options.cacheOk && this._scriptsCache) {
        return this._scriptsCache;
      }
      return $http.get('/benchmarks/largetable/scripts.json').then(function(res) {
        this._scriptsCache = res.data;
        return this._scriptsCache;
      }.bind(this));
    };
  }]);

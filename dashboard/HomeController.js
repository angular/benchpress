angular.module('benchpressDashboard').
  controller('HomeController', ['$scope', 'benchmarksService', function($scope, benchmarksService){
    benchmarksService.get().then(function(data){
      $scope.benchmarks = data.benchmarks;
    }, function(res) {
      $scope.responseError = {
        code: res.status,
        body: res.data
      }
    });
  }]);
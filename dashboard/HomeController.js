angular.module('benchpressDashboard').
  controller('HomeController', ['$scope', 'benchmarksService', function($scope, benchmarksService){
    benchmarksService.get().then(function(res){
      $scope.benchmarks = res.data.benchmarks;
    }, function(res) {
      $scope.responseError = {
        code: res.status,
        body: res.data
      }
    });
  }]);
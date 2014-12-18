angular.module('benchpressDashboard').
  controller('BenchmarkController', ['$routeParams', '$scope', function($routeParams, $scope){
    $scope.benchmarkName = $routeParams.name;
    $scope.selectedTab = 'Controls';
    $scope.tabs = [
      'Controls',
      'Scripts',
      'Tips'
    ];
  }]);
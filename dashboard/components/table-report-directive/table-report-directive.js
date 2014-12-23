angular.module('bpdTableReportDirective', ['bpdStatsService']).
  directive('bpdTableReport', ['stats', function(stats) {
    return {
      restrict: 'E',
      scope: {},
      controller: ['$scope', function($scope) {
        $scope.stats = stats;
        //TODO: move measurements to service
        $scope.measurements = ['testTime','gcTime','garbageCount','retainedCount'];
      }],
      templateUrl: 'components/table-report-directive/table-report-directive.html'
    };
  }]);

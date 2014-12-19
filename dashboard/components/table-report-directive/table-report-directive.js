angular.module('bpdTableReportDirective', ['bpdStatsService']).
  directive('bpdTableReport', ['stats', function(stats) {
    return {
      restrict: 'E',
      controller: ['$scope', function($scope) {
        $scope.stats = stats;
      }],
      templateUrl: 'components/table-report-directive/table-report-directive.html'
    };
  }]);

angular.module('benchpressDashboard').
  controller('BenchmarkController', [
      '$routeParams', '$scope', 'runContexts', 'runState', 'benchmarksService', 'stats', 'scripts',
      function($routeParams, $scope, runContexts, runState, benchmarksService, stats, scripts) {
    $scope.runContexts = runContexts;
    $scope.runState = runState;
    $scope.stats = stats;
    $scope.benchmarkName = $routeParams.name;
    $scope.selectedTab = 'Controls';
    $scope.tabs = [
      'Controls',
      'Scripts',
      'Tips'
    ];

    $scope.runBtns = [{
      label: 'Loop',
      value: -1
    },{
      label: 'Once',
      value: 1
    },{
      label: 'Loop 25x',
      value: 25
    },{
      //TODO: make profile work
      label: 'Profile',
      value: 'profile'
    }];

    benchmarksService.get({cacheOk: true}).then(function() {
      benchmarksService.select($routeParams.name);
    });

    scripts.get().then(function(data) {
      $scope.overrideScripts = data.scripts;
    });

    //TODO: support profiling
    this.runBenchmark = function(val) {
      runState.iterations = val;
      runState.running = true;
    };
  }]);
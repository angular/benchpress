angular.module('benchpressDashboard').
  controller('BenchmarkController', [
      '$routeParams', '$scope', 'runContexts', 'runState', 'benchmarksService', 'stats',
      function($routeParams, $scope, runContexts, runState, benchmarksService, stats) {
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

    //TODO: get from a service
    $scope.steps = [{
      name: 'create',
      description: 'Create the view',
    },{
      name: 'apply',
      description: 'apply the scope'
    },{
      name: 'destroy',
      description: 'destroy scope and view'
    }];

    //TODO: get from service
    $scope.measurements = ['testTime', 'gcTime', 'garbageCount', 'retainedCount'];


    benchmarksService.get({cacheOk: true}).then(function() {
      benchmarksService.select($routeParams.name);
    });

    //TODO: get this from a service
    $scope.overrideScripts = [{
      id: 'angular',
      currentPath: '/angular.js'
    }];

    this.runBenchmark = function(val) {
      runState.iterations = val;
      runState.running = true;
      switch(runState.context) {
        case runContexts.IFRAME:
          break;
        case runContexts.WINDOW:

          break;
      }
      //TODO: implement and test
    };
  }]);
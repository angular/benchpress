angular.module('benchpressDashboard').
  controller('BenchmarkController', ['$routeParams', '$scope', 'runContexts', 'runState', function($routeParams, $scope, runContexts, runState){
    $scope.runContext = runContexts.IFRAME;
    $scope.runState = runState;
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

    //TODO: get from service
    $scope.stats = {
      'create': {
        testTime: {
          avg: {
            mean: 50.54321,
            coefficientOfVariation: 0.04,
            stdDev: 5.654321
          },
          min: 5,
          max: 15
        },
        gcTime: {
          avg: {
            mean: 50.54321,
            coefficientOfVariation: 0.04,
            stdDev: 5.654321
          }
        },
        garbageCount: {
          avg: {
            mean: 50.54321,
            coefficientOfVariation: 0.04,
            stdDev: 5.654321
          }
        },
        retainedCount: {
          avg: {
            mean: 50.54321,
            coefficientOfVariation: 0.04,
            stdDev: 5.654321
          }
        }
      }
    }

    //TODO: get this from a service
    $scope.overrideScripts = [{
      id: 'angular',
      currentPath: '/angular.js'
    }];

    this.runBenchmark = function(val) {
      $scope.runningBenchmark = true;
      switch($scope.runContext) {
        case runContexts.IFRAME:
          //TODO: whatever setup needs to happen
          break;
        case runContexts.WINDOW:

          break;
      }
      //TODO: implement and test
    };
  }]);
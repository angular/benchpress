angular.module('benchpressDashboard').
  controller('BenchmarkController', ['$routeParams', '$scope', 'runStateService', function($routeParams, $scope, runStateService){
    $scope.benchmarkName = $routeParams.name;
    $scope.selectedTab = 'Controls';
    $scope.tabs = [
      'Controls',
      'Scripts',
      'Tips'
    ];
    //TODO: get this value from service
    $scope.sampleRange = 20;
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

    $scope.$watch('sampleRange', function(newVal) {
      runStateService.numSamples = newVal;
    });

    this.runBenchmark = function(val) {
      //TODO: implement and test
    };
  }]);
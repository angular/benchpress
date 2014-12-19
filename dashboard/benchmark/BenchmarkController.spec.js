describe('BenchmarkController', function() {
  var $controller, $rootScope, $httpBackend, mockAPI, benchmarksService;

  beforeEach(function(){
    module(
        'ngRoute',
        'benchpressDashboard',
        'bpdRunStateService',
        'bpdRunContextsService',
        'bpdMockAPI',
        'bpdBenchmarksService',
        'bpdScriptsService');
    inject(function(_$controller_, _$rootScope_, $routeParams, _mockAPI_, _benchmarksService_, _$httpBackend_) {
      $controller = _$controller_;
      $routeParams.name = 'foo-benchmark';
      $rootScope = _$rootScope_;
      mockAPI = _mockAPI_;
      benchmarksService = _benchmarksService_;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/benchmarks').respond(mockAPI['/api/benchmarks']);
      $httpBackend.whenGET('/benchmarks/largetable/scripts.json').respond(mockAPI['/benchmarks/largetable/scripts.json']);
    });
  });

  function controllerFactory(scope) {
    return $controller('BenchmarkController', {
      $scope: scope
    });
  }

  it('should set the benchmark name to the scope', function() {
    var scope = $rootScope.$new();
    controllerFactory(scope);
    expect(scope.benchmarkName).toBe('foo-benchmark');
  });

  it('should select controls tab by default', function() {
    var scope = $rootScope.$new();
    controllerFactory(scope);
    expect(scope.selectedTab).toBe('Controls');
  });


  it('should set the selected benchmark to the benchmarksService', function() {
    var scope = $rootScope.$new();
    var controller = $controller('BenchmarkController', {
      $scope: scope,
      $routeParams: {name: mockAPI['/api/benchmarks'].benchmarks[0].name}
    });
    $httpBackend.flush();
    expect(benchmarksService.selected()).toEqual(mockAPI['/api/benchmarks'].benchmarks[0]);
  });


  it('should set scripts to scope.overrideScripts', function() {
    var scope = $rootScope.$new();
    var controller = $controller('BenchmarkController', {
      $scope: scope
    });
    $httpBackend.flush();
    expect(scope.overrideScripts).toEqual(mockAPI['/benchmarks/largetable/scripts.json'].scripts);
  });
});

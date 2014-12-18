describe('BenchmarkController', function() {
  var $controller, $rootScope;

  beforeEach(function(){
    module('ngRoute', 'benchpressDashboard');
    inject(function(_$controller_, _$rootScope_, $routeParams) {
      $controller = _$controller_;
      $routeParams.name = 'foo-benchmark';
      $rootScope = _$rootScope_;
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
    expect(scope.selectedTab).toBe('controls');
  });
});

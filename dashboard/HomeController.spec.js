describe('HomeController', function() {
  var benchmarksService;
  var $controller;
  var mockAPI

  beforeEach(function(){
    module('benchpressDashboard', 'bpdBenchmarksService', 'bpdMockAPI');
    inject(function(_benchmarksService_, _mockAPI_, _$controller_) {
      benchmarksService = _benchmarksService_;
      spyOn(benchmarksService, 'get').andCallThrough();
      $controller = _$controller_;
      mockAPI = _mockAPI_;
    });
  });

  function controllerFactory(scope) {
    return $controller('HomeController', {
      $scope: scope
    });
  }

  it('should load the available benchmarks from the server', inject(function($httpBackend, $rootScope) {
    var scope = $rootScope.$new();
    $httpBackend.whenGET('/api/benchmarks').respond(mockAPI['/api/benchmarks']);
    var controller = controllerFactory(scope);
    scope.$digest();
    expect(benchmarksService.get).toHaveBeenCalled();
    $httpBackend.flush();
    expect(scope.benchmarks).toEqual(mockAPI['/api/benchmarks'].benchmarks);
  }));


  it('should add an error object to the scope if the request fails', inject(function($httpBackend, $rootScope) {
    var scope = $rootScope.$new();
    $httpBackend.whenGET('/api/benchmarks').respond(400, 'Request failed');
    var controller = controllerFactory(scope);
    scope.$digest();
    $httpBackend.flush();
    expect(scope.responseError.code).toBe(400);
    expect(scope.responseError.body).toBe('Request failed');
  }));
});

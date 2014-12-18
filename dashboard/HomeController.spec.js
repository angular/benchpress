describe('HomeController', function() {
  var benchmarksService;
  var $controller;
  var mockAPIs = {
    '/api/benchmarks': {benchmarks:[{name: 'largetable'},{name:'render-table'}]}
  };

  beforeEach(function(){
    module('benchpressDashboard', 'bpdBenchmarksService');
    inject(function(_benchmarksService_, _$controller_) {
      benchmarksService = _benchmarksService_;
      spyOn(benchmarksService, 'get').andCallThrough();
      $controller = _$controller_;
    });
  });

  function controllerFactory(scope) {
    return $controller('HomeController', {
      $scope: scope
    });
  }

  it('should load the available benchmarks from the server', inject(function($httpBackend, $rootScope) {
    var scope = $rootScope.$new();
    $httpBackend.whenGET('/api/benchmarks').respond(mockAPIs['/api/benchmarks']);
    var controller = controllerFactory(scope);
    scope.$digest();
    expect(benchmarksService.get).toHaveBeenCalled();
    $httpBackend.flush();
    expect(scope.benchmarks).toEqual(mockAPIs['/api/benchmarks'].benchmarks);
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

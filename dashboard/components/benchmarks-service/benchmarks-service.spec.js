describe('benchmarksService', function() {
  var benchmarksService, $httpBackend, mockAPI, $rootScope;

  beforeEach(function(){
    module('bpdBenchmarksService', 'bpdMockAPI');
    inject(function(_$httpBackend_, _$rootScope_, _benchmarksService_, _mockAPI_) {
      benchmarksService = _benchmarksService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      mockAPI = _mockAPI_;
    });
  });

  afterEach(function() {
    $rootScope.$digest();
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  describe('.get()', function() {
    it('should fetch benchmarks from the server', function() {
      var results;
      $httpBackend.whenGET('/api/benchmarks').respond(mockAPI['/api/benchmarks']);
      benchmarksService.get().then(function(val) {
        results = val;
      });
      $httpBackend.flush();
      expect(results).toEqual(mockAPI['/api/benchmarks']);
    });


    it('should return request fresh data from the server on each call', function() {
      $httpBackend.whenGET('/api/benchmarks').respond(200);
      benchmarksService.get();
      $httpBackend.flush();
      benchmarksService.get();
      $httpBackend.flush();
    });


    it('should return cached value if specified in options object', inject(function($http) {
      $httpBackend.whenGET('/api/benchmarks').respond(mockAPI['/api/benchmarks']);
      benchmarksService.get();
      $httpBackend.flush();
      benchmarksService.get({cacheOk: true});
    }));
  });


  describe('select', function() {
    it('should allow setting the current benchmark', function() {
      expect(benchmarksService.selected()).toBeUndefined();
      $httpBackend.whenGET('/api/benchmarks').respond(mockAPI['/api/benchmarks']);
      benchmarksService.get();
      $httpBackend.flush();
      benchmarksService.select(mockAPI['/api/benchmarks'].benchmarks[0].name);
      expect(benchmarksService.selected()).toEqual(mockAPI['/api/benchmarks'].benchmarks[0]);
    });


    it('should not complain if benchmarks have not yet been fetched', function() {
      expect(benchmarksService.selected()).toBeUndefined();
    });
  });
});

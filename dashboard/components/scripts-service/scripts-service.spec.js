describe('bpdScriptsService', function() {
  var scripts, $httpBackend, $rootScope, mockAPI;

  beforeEach(function(){
    module('bpdScriptsService', 'bpdMockAPI');
    inject(function(_$httpBackend_, _$rootScope_, _scripts_, _mockAPI_) {
      scripts = _scripts_;
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
      $httpBackend.whenGET('/benchmarks/largetable/scripts.json').
        respond(mockAPI['/benchmarks/largetable/scripts.json']);
      scripts.get().then(function(val) {
        results = val;
      });
      $httpBackend.flush();
      expect(results).toEqual(mockAPI['/benchmarks/largetable/scripts.json']);
    });


    it('should return request fresh data from the server on each call', function() {
      $httpBackend.whenGET('/benchmarks/largetable/scripts.json').respond(200);
      scripts.get();
      $httpBackend.flush();
      scripts.get();
      $httpBackend.flush();
    });


    it('should return cached value if specified in options object', inject(function($http) {
      $httpBackend.whenGET('/benchmarks/largetable/scripts.json').
        respond(mockAPI['/benchmarks/largetable/scripts.json']);
      scripts.get();
      $httpBackend.flush();
      scripts.get({cacheOk: true});
    }));
  });
});

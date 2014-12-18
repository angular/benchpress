describe('benchmarksService', function() {
  var benchmarksService;

  beforeEach(function(){
    module('bpdBenchmarksService');
    inject(function(_benchmarksService_) {
      benchmarksService = _benchmarksService_;
    });
  });

  it('should exist', inject(function(benchmarksService) {
    expect(benchmarksService).toBeDefined();
  }));


  it('should fetch benchmarks from the server', inject(function($httpBackend) {
    var results;
    var response = {benchmarks: [{name: 'largetable'},{name:'render-table'}]};
    $httpBackend.whenGET('/api/benchmarks').respond(response);
    benchmarksService.get().then(function(val) {
      results = val;
    });
    $httpBackend.flush();
    expect(results.data).toEqual(response);
  }));


  it('should not cache benchmarks', inject(function($httpBackend) {
    $httpBackend.whenGET('/api/benchmarks').respond(200);
    benchmarksService.get();
    $httpBackend.flush();
    benchmarksService.get();
    $httpBackend.flush();
  }));
});

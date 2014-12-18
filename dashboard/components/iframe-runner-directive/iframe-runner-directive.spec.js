describe('iframeRunnerDirective', function() {
  var $compile, $rootScope;

  beforeEach(function(){
    module('bpdIframeRunnerDirective', 'bpdRunContextsService');
    inject(function(_$compile_, _$rootScope_){
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    });
  });

  it('should render an iframe if scope.runningBenchmark is true and runContext is iframe', function() {
    var scope = $rootScope.$new();
    scope.runContext = 2;
    scope.runningBenchmark = true;
    var compiled = $compile('<bpd-iframe-runner></bpd-iframe-runner>')(scope);
    scope.$digest();
    expect(compiled.html()).toContain('<iframe');
  });
});

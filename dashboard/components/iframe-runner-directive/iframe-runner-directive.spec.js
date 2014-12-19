describe('iframeRunnerDirective', function() {
  var $compile, $rootScope, benchmarksService, runState;

  beforeEach(function(){
    module(
        'bpdIframeRunnerDirective',
        'components/iframe-runner-directive/iframe-runner-directive.html');
    inject(function(_$compile_, _$rootScope_, _benchmarksService_, _runContexts_, _runState_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      runContexts = _runContexts_;
      runState = _runState_;
      benchmarksService = _benchmarksService_;
    });
  });

  it('should render an iframe if runState.running is true and runState.context is IFRAME', function() {
    var scope = $rootScope.$new();
    runState.running = true;
    var compiled = $compile('<bpd-iframe-runner></bpd-iframe-runner>')(scope);
    scope.$digest();
    expect(compiled.html()).toContain('<iframe');
  });

  it('should not render the iframe if runState.context is not IFRAME', function() {
    var scope = $rootScope.$new();
    runState.running = true;
    runState.context = runContexts.WINDOW;
    var compiled = $compile('<bpd-iframe-runner></bpd-iframe-runner>')(scope);
    scope.$digest();
    expect(compiled.html()).not.toContain('<iframe');
  });

  it('should not render the iframe if runState.running is false', function() {
    var scope = $rootScope.$new();
    runState.running = false;
    runState.context = runContexts.IFRAME;
    var compiled = $compile('<bpd-iframe-runner></bpd-iframe-runner>')(scope);
    scope.$digest();
    expect(compiled.html()).not.toContain('<iframe');
  });


  describe('controller', function() {
    var controller, scope;

    beforeEach(inject(function($controller) {
      scope = $rootScope.$new();
      controller = $controller('IframeRunnerController', {
        $scope: scope
      });
    }));

    describe('.frameSrc()', function() {
      it('should return the correct url with all parameters added to query string', function() {
        benchmarksService._benchmarksCache = {benchmarks: [{name: 'largetable'}]};
        benchmarksService.select('largetable');
        runState.iterations = 30;
        runState.numSamples = 29;
        expect(controller.frameSrc()).toBe('/benchmarks/largetable/main.html?numSamples=29&iterations=30&__bpAutoClose__=true');
      });
    });


    describe('.allOrNothing()', function() {
      it('should return &key=val if value is string', function(){
        expect(controller.allOrNothing('foo',['bar'])).toBe('&foo=bar');
      });


      it('should return empty string if value in values is undefined or null', function() {
        expect(controller.allOrNothing('foo', [undefined])).toBe('');
        expect(controller.allOrNothing('foo', [null])).toBe('');
        expect(controller.allOrNothing('foo', [undefined, 'baz'])).toBe('&foo=baz');
      });


      it('should return empty string if values is empty array', function() {
        expect(controller.allOrNothing('foo', [])).toBe('');
      });


      it('should return key=val1&key=val2 for array', function() {
        expect(controller.allOrNothing('foo', ['bar','baz'])).toBe('&foo=bar&foo=baz');
      });
    });
  });
});

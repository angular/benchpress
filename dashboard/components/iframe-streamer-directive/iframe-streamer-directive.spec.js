describe('bpdIframeStreamer', function() {
  var playground, mockIframe, runState, scope, stats, $compile, $interval;

  beforeEach(function() {
    module('bpdIframeStreamerDirective', 'bpdRunStateService');

    inject(function(_$rootScope_, _$compile_, _$interval_, _runState_, _stats_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $interval = _$interval_;
      runState = _runState_;
      stats = _stats_;
      scope = $rootScope.$new();
      playground = document.createElement('div');
      document.body.appendChild(playground);
    });
  });

  afterEach(function() {
    document.body.removeChild(playground);
  });

  function compileElement(options) {
    element = $compile('<iframe src="about:blank" bpd-iframe-streamer></iframe>')(scope);
    scope.$digest();
    if (!options || !options.doNotAdd) playground.appendChild(element[0]);
  }


  it('should set runState.running to false when done the complete event from the iframe content window', function() {
    runState.running = true;
    compileElement();
    $interval.flush(50);
    element[0].contentWindow.dispatchEvent(new Event('benchpressComplete'));
    expect(runState.running).toBe(false);
  });


  it('should set runState.running to false when done the complete event from the iframe content window', function() {
    runState.running = true;
    compileElement();
    $interval.flush(50);
    element[0].contentWindow.dispatchEvent(new Event('benchpressComplete'));
    expect(runState.running).toBe(false);
  });


  it('should complain if it cannot find the contentWindow within 100ms', function() {
    compileElement({doNotAdd:true});
    expect(function() {
      $interval.flush(100)
    }).toThrow(new Error('Timed out waiting for iframe.contentWindow to be defined'));
  });


  it('should cancel the timer when element is destroyed', function() {
    compileElement();
    var timer = scope.waitForContentWindow;
    expect(timer.value).toBeUndefined();
    element.remove();
    scope.$digest();
    expect(timer.$$state.value).toBe('canceled');
  });


  it('should add the stats to the stats service when done', function() {
    compileElement();
    $interval.flush(50);
    var evt = new Event('benchpressComplete');
    evt.result = {};
    element[0].contentWindow.dispatchEvent(evt);
    expect(stats.current).toEqual(evt.result);
  });
});

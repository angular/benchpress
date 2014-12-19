describe('bpdIframeStreamer', function() {
  var mockIframe, runState, scope, $compile, $interval;

  beforeEach(function() {
    module('bpdIframeStreamerDirective', 'bpdRunStateService');
    inject(function(_$rootScope_, _$compile_, _$interval_, _runState_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $interval = _$interval_;
      runState = _runState_;
      scope = $rootScope.$new();
    });
  });


  it('should set runState.running to false when done the complete event from the iframe content window', function() {
    runState.running = true;
    var element = $compile('<iframe src="about:blank" bpd-iframe-streamer></iframe>')(scope);
    scope.$digest();
    document.body.appendChild(element[0]);
    $interval.flush(50);
    element[0].contentWindow.dispatchEvent(new Event('benchpressComplete'));
    expect(runState.running).toBe(false);
  });


  it('should complain if it cannot find the contentWindow within 1000ms', function() {
    var element = $compile('<iframe src="about:blank" bpd-iframe-streamer></iframe>')(scope);
    scope.$digest();
    expect(function() {
      $interval.flush(1000)
    }).toThrow(new Error('Timed out waiting for iframe.contentWindow to be defined'));
  });

});

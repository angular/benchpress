var rewire = require('rewire');
var expressMock = require('./expressMock');
var httpMock = require('./httpMock');

describe('server', function() {
  var server, listenSpy, getSpy, useSpy, staticSpy;

  beforeEach(function() {
    listenSpy = spyOn(httpMock, 'listen');
    getSpy = spyOn(expressMock, 'get');
    useSpy = spyOn(expressMock, 'use');
    staticSpy = spyOn(expressMock, 'static');
    server = rewire('./server');
    server.__set__('express', expressMock);
    server.__set__('http', httpMock);
  });


  it('should have a run method', function() {
    expect(typeof server.run).toBe('function');
  });


  it('should open at port 3339 by default', function() {
    server.run();
    expect(listenSpy).toHaveBeenCalledWith(3339);
  });


  it('should open at specified port if added to options', function() {
    server.run({port: 9000});
    expect(listenSpy).toHaveBeenCalledWith(9000);
  });


  it('should redirect GET / to specified buildPath', function() {
    var redirectSpy = jasmine.createSpy('redirect');
    getSpy.andCallThrough();
    server.run({buildPath: 'foo/bar'});
    expect(getSpy.calls[0].args[0]).toBe('/');

    expressMock._handle('get', '/', [null, {redirect: redirectSpy}])
    expect(redirectSpy).toHaveBeenCalledWith('foo/bar');
  });


  it('should call use with expressMock.static(./)', function() {
    var cwd = process.cwd();
    staticSpy.andCallThrough();
    server.run();
    expect(staticSpy).toHaveBeenCalledWith(cwd);
    expect(useSpy.calls[0].args[0].toString()).toContain('(staticFn)');
  });


  it('should open a websocket connection', function() {

  });
});

function MockGlobals () {
  this._window = {
    addEventListener: jasmine.createSpy('addEventListener'),
    dispatchEvent: jasmine.createSpy('dispatchEvent'),
    location: {
      search: '?variable=bindOnce&angular=foo&bar=baz'
    }
  }
}

module.exports = MockGlobals;
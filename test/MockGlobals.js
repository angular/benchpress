function MockGlobals () {
  this._window = {
    addEventListener: jasmine.createSpy('addEventListener'),
    location: {
      search: '?variable=bindOnce&angular=foo&bar=baz'
    }
  }
}

module.exports = MockGlobals;
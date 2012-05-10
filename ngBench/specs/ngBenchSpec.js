describe('ngBench', function() {

  it('should load all angulars and store them in `angulars` map', function() {
    for (version in angulars) {
      if (version === 'latest') {
        expect(angulars[version].version.full).toBeDefined();
      } else {
        expect(angulars[version].version.full).toBe(version);
      }
    }
  });


  it('should not leave any angular behind', function() {
    // if we left one behind, tests could accidentally use it.
    expect(angular).toBe(null);
  });
});

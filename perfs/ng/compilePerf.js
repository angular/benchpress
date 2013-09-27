describe('$compile', function() {

  describe('binding', function() {

    benchmark('single binding that always changes', {

      setup: function($injector, angular, $rootScope, bench, $compile, rootElement) {
        rootElement.append('<div>{{counter}}</div>');
        $rootScope.counter = 0;
        $compile(rootElement)($rootScope);
        $rootScope.$apply();

        return function() {
          bench($rootScope);
        }
      },

      bench: function($rootScope) {
        $rootScope.counter++;
        $rootScope.$apply();
      },

      assert: function(setup, $injector, angular, rootElement, $rootScope, bench) {
        var test = $injector.invoke(setup, null, {
          angular: angular,
          bench: bench,
          rootElement: rootElement
        });

        expect(rootElement.text()).toBe('0');
        expect($rootScope.counter).toBe(0);

        test();

        expect(rootElement.text()).toBe('1');
        expect($rootScope.counter).toBe(1);

        test();

        expect(rootElement.text()).toBe('2');
        expect($rootScope.counter).toBe(2);
      }
    });
  });
});

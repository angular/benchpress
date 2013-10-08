describe('$rootScope', function() {

  ddescribe('$apply', function() {

    //var num = 0;
    /*
    benchmark('should benchmark empty $apply on single scope', {
      setup: function($injector, angular, $rootScope, bench) {
        return function() {
          //console.log('bench ' + num++);

          bench($rootScope);
        }
      },

      bench: function($rootScope) {
        $rootScope.$apply();
      },

      assert: function(setup, $injector, angular, bench) {
        var spy = jasmine.createSpy('$apply');
        var test = $injector.invoke(setup, null, {
          $rootScope: {$apply: spy},
          angular: angular,
          bench: bench
        });
        test();
        expect(spy.callCount).toBe(1);
      }

    });*/


    var num = 0;
    benchmark('ideal should benchmark an $apply that triggers 100 watches', {
      setup: function($injector, angular, $rootScope, bench) {
        num = 0;
        for (var i = 0; i < 100; i++) {
          (function(i) {
            $rootScope.xs = [];
          })(i);
        }
        $rootScope.$watchCollection('xs', function() {
          var sum = 0;
          $rootScope.xs.forEach(function(x) {
            sum += x;
          });
          $rootScope.sum = sum;
          console.log(sum);
        });

        return function() {
          //console.log('bench ' + num++);

          bench($rootScope);
        }
      },

      bench: function($rootScope) {
        $rootScope.a = num++;
        for (var i = 0; i < 100; i++) {
          $rootScope.xs[i] = $rootScope.a;
        }
        var sum = 0;
        $rootScope.xs.forEach(function(x) {
          sum += x;
        });
        $rootScope.sum = sum;
        console.log(sum);
      },

      assert: function(setup, $injector, $rootScope, angular, bench) {
        var spy = jasmine.createSpy('$apply');
        var test = $injector.invoke(setup, null, {
          $rootScope: $rootScope,
          angular: angular,
          bench: bench
        });
        num = 10;
        test();
        expect($rootScope.sum).toEqual(1000);
        num = 20;
        test();
        expect($rootScope.sum).toEqual(2000);
      }
    });

    /*
    var num = 0;
    benchmark('should benchmark an $apply that triggers 100 watches', {
      setup: function($injector, angular, $rootScope, bench) {
        num = 0;
        for (var i = 0; i < 100; i++) {
          (function(i) {
            $rootScope.xs = [];
            $rootScope.$watch('a', function(newValue) {
              $rootScope.xs[i] = newValue;
            });
          })(i);
        }
        $rootScope.$watchCollection('xs', function() {
          var sum = 0;
          $rootScope.xs.forEach(function(x) {
            sum += x;
          });
          $rootScope.sum = sum;
          console.log(sum);
        });

        return function() {
          //console.log('bench ' + num++);

          bench($rootScope);
        }
      },

      bench: function($rootScope) {
        $rootScope.$apply('a = ' + num++);
      },

      assert: function(setup, $injector, $rootScope, angular, bench) {
        var spy = jasmine.createSpy('$apply');
        var test = $injector.invoke(setup, null, {
          $rootScope: $rootScope,
          angular: angular,
          bench: bench
        });
        num = 10;
        test();
        expect($rootScope.sum).toEqual(1000);
        num = 20;
        test();
        expect($rootScope.sum).toEqual(2000);

      }

    });
    */
  });
});

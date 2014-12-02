describe('bp', function() {
  var di = require('di');
  var testing = require('../node_modules/di/dist/cjs/testing');
  var mockStep = {
    fn: function() {},
    name: 'fakeStep'
  };

  var Aggregator = require('../lib/Aggregator');
  var Document = require('../lib/Document');
  var Globals = require('../lib/Globals');
  var MockGlobals = require('./MockGlobals');
  var Report = require('../lib/HtmlReport');
  var Runner = require('../lib/Runner');
  var ClientScripts = require('../lib/ClientScripts');
  var RunState = require('../lib/RunState');
  var Statistics = require('../lib/Statistics');
  var Steps = require('../lib/Steps');
  var Utils = require('../lib/Utils');
  var Variables = require('../lib/Variables.js');

  describe('.variables', function() {
    var var1, var2, variables;

    beforeEach(function() {
      testing.use(MockGlobals).as(Globals);
      testing.inject(Variables, function(vars) {
        variables = vars;
      });

      var1 = {value: 'bindOnce', label: 'bind once'};
      var2 = {value: 'baseline', label: 'baseline'};
    });


    it('should set pending selected variable from the query params', function() {
      expect(variables.selected).toBeUndefined();
      variables.addMany([var1, var2]);
      expect(variables.selected).toBe(var1);
    });


    it('should delete pending selected after selected has been set', function() {
      variables.variables = [{value: 'bindOnce'}];
      variables.pending = 'bindOnce';
      variables.select('bindOnce');
      expect(variables._pending).toBe(null);
    });

    describe('.add()', function() {
      it('should add the variable to the variables array', function() {
        variables.add(var1);
        expect(variables.variables[0]).toBe(var1);
      });
    });


    describe('.addMany()', function() {
      it('should add all variables to the variables array', function() {
        expect(variables.variables.length).toBe(0);

        var arr = [var1, var2];

        variables.addMany(arr);

        expect(variables.variables.length).toBe(2);
        expect(variables.variables[0]).toBe(var1);
        expect(variables.variables[1]).toBe(var2);
      });
    });


    describe('.select()', function() {
      it('should set the variable by provided value', function() {
        expect(variables.selected).toBe(undefined);
        variables.addMany([var1, var2]);
        variables.select('bindOnce');
        expect(variables.selected).toBe(var1);
      });


      it('should set to undefined if value does not match a variable', function() {
        variables._globals._window.location.search = '';
        variables.addMany([var1, var2]);
        expect(variables.selected).toBe(undefined);
        variables.select('fakeVar');
        expect(variables.selected).toBe(undefined);
      });
    });
  });


  describe('.statistics', function() {
    var statistics;
    beforeEach(function() {
      testing.use(MockGlobals).as(Globals);
      testing.inject(Statistics, function(stats) {
        statistics = stats;
      });
    });


    describe('.calculateConfidenceInterval()', function() {
      it('should provide the correct confidence interval', function() {
        expect(statistics.calculateConfidenceInterval(30, 1000)).toBe(1.859419264179007);
      });
    });


    describe('.calculateRelativeMarginOfError()', function() {
      it('should provide the correct margin of error', function() {
        expect(statistics.calculateRelativeMarginOfError(1.85, 5)).toBe(0.37);
      });
    });


    describe('.getMean()', function() {
      it('should return the mean for a given sample', function() {
        expect(statistics.getMean([1,2,5,4])).toBe(3);
      });
    });


    describe('.calculateStandardDeviation()', function() {
      it('should provide the correct standardDeviation for the provided sample and mean', function() {
        expect(statistics.calculateStandardDeviation([
          2,4,4,4,5,5,7,9
        ], 5)).toBe(2.138089935299395);
      });


      it('should provide the correct standardDeviation for the provided sample and mean', function() {
        expect(statistics.calculateStandardDeviation([
          674.64,701.78,668.33,662.15,663.34,677.32,664.25,1233.00,1100.80,716.15,681.52,671.23,702.70,686.89,939.39,830.28,695.46,695.66,675.15,667.48], 750.38)).toBe(158.57877026559186);
      });
    });


    describe('.calculateCoefficientOfVariation()', function() {
      it('should calculate the correct coefficient of variation', function() {
        expect(statistics.calculateCoefficientOfVariation(0.5, 5)).toBe(0.1);
      });
    });
  });


  describe('.utils', function() {
    var utils;
    beforeEach(function() {
      testing.use(MockGlobals).as(Globals);
      testing.inject(Utils, function(u) {
        utils = u;
      });
    });

    describe('.parseSearch()', function() {
      it('should return serialized query params', function() {
        expect(utils.parseSearch('?variable=bindOnce&angular=angular.js')).toEqual({
          variable: 'bindOnce',
          angular: 'angular.js'
        });
      });


      it('should only remove leading character if "?" present', function() {
        expect(utils.parseSearch('?foo=bar&b=a')).toEqual({
          foo:'bar',
          b: 'a'
        });
        expect(utils.parseSearch('foo=bar&b=a')).toEqual({
          foo:'bar',
          b: 'a'
        });
      });
    });
  });


  describe('.document', function() {
    var doc, scripts, utils, runState;

    beforeEach(function() {
      testing.use(MockGlobals).as(Globals);
      testing.inject(Document, ClientScripts, Utils, RunState, function(d, s, u, rs) {
        doc = d;
        doc._container = document.createElement('div');
        var scriptsTemplate = document.createElement('div')
        scriptsTemplate.setAttribute('id', 'scriptTemplate');
        doc._container.appendChild(scriptsTemplate);
        scripts = s;
        utils = u;
        runState = rs;
      });
    });


    describe('.observeBtns()', function() {
      it('should return an observable', function() {
        expect(typeof doc.observeBtns().filter).toBe('function');
      });
    });


    describe('.onSampleRangeChanged()', function() {
      beforeEach(testing.inject(Runner, function(runner) {
        runState.resetIterations();
      }));


      it('should change the numSamples property', function() {
        expect(runState.numSamples).toBe(20);
        doc.onSampleInputChanged({target: {value: '80'}});
        expect(runState.numSamples).toBe(80);
      });
    });


    describe('.writeReport()', function() {
      it('should write the report to the infoDiv', function() {
        doc.infoDiv = document.createElement('div');
        doc.writeReport('report!');
        expect(doc.infoDiv.innerHTML).toBe('report!')
      });
    });


    describe('.onDOMContentLoaded()', function() {
      it('should call methods to write to the dom', function() {
        var rangeSpy = spyOn(doc, 'addSampleRange');
        var infoSpy = spyOn(doc, 'addInfo');

        doc.onDOMContentLoaded();
        expect(rangeSpy).toHaveBeenCalled();
        expect(infoSpy).toHaveBeenCalled();
      });
    });


    describe('.loadNextScript()', function() {
      beforeEach(function() {
        scripts.addMany([{src: 'angular.js', id: 'angular'}, {src: 'bar'}]);
      });

      it('should shift the first config from window.scripts', function() {
        doc.loadNextScript();
        expect(scripts.all()).toEqual([{src: 'bar'}]);
      });


      it('should override script with provided source from query params', function() {
        var bodySpy = spyOn(document.body, 'appendChild');
        doc.loadNextScript();
        expect(bodySpy.calls[0].args[0].getAttribute('src')).toBe('foo');
      });


      it('should call addScriptToUI with config with correct src', function() {
        var spy = spyOn(doc, 'addScriptToUI');
        doc.loadNextScript();
        expect(spy).toHaveBeenCalled();
        expect(spy.calls[0].args[0]).toEqual({id: 'angular', src: 'foo'});
      })
    });


    xdescribe('.addScriptToUI()', function() {
      beforeEach(function() {
        doc._scriptsContainer = document.createElement('div');
        doc._scriptsContainer.classList.add('scripts');
        var scriptTemplate = document.createElement('script');
        scriptTemplate.setAttribute('id', 'scriptTemplate');
        doc._container.appendChild(scriptTemplate);
      });


      it('should add a script to the info container', function() {
        var appendSpy = spyOn(doc._scriptsContainer, 'appendChild');
        doc.addScriptToUI({src: '/foo.js', id: 'foo'});
        expect(appendSpy).toHaveBeenCalled();
      });
    });


    xdescribe('.addScriptsContainer()', function() {
      it('should set the container to doc._scriptsContainer');
      it('should add script template to doc');
    });


    describe('.getParams()', function() {
      it('should call utils.parseSearch()', function() {
        var spy = spyOn(utils, 'parseSearch');
        doc.getParams();
        expect(spy).toHaveBeenCalled();
      });

      it('should parse query params into an object', function() {
        expect(doc.getParams()).toEqual({
          variable: 'bindOnce',
          angular: 'foo',
          bar: 'baz'
        });
      })
    });
  });


  describe('.runner', function() {
    var runner, report, doc, globals, runState;

    beforeEach(function() {
      testing.use(MockGlobals).as(Globals);
      testing.inject(Document, Globals, Report, Runner, RunState, function(d,g,r,run,rs) {
        doc = d;
        globals = g;
        report = r;
        runner = run;
        runState = rs;

        runState.numSamples = 99;
        runState.iterations = 100;
        runState.recentResult = {
          fakeStep: {
            testTime: 2
          }
        };
      });

      doc.infoDiv = document.createElement('div');
    });


    describe('.runTimedTest()', function() {
      it('should call gc if available', function() {
        globals._window.gc = function() {};
        var spy = spyOn(globals._window, 'gc');
        runner.runTimedTest(mockStep, {});
        expect(spy).toHaveBeenCalled();
      });


      it('should return the time required to run the test', function() {
        var times = {};
        expect(typeof runner.runTimedTest(mockStep, times).testTime).toBe('number');
      });
    });


    describe('.bootstrap()', function() {
      it('should subscribe to button clicks from document', function() {
        var docBtnSpy = spyOn(doc, 'observeBtns').andCallThrough();
        runner.bootstrap();
        expect(docBtnSpy).toHaveBeenCalled();
        expect(typeof runner._btnSubscription).toBe('object');
      });
    });


    describe('.onBtnClick()', function() {
      var sampleEvent;
      beforeEach(function() {
        sampleEvent = {
          target: {
            textContent: 'Loop'
          }
        }
      });

      it('throw an error if the button text does not match anything', function() {
        expect(runner.onBtnClick).toThrow('Could not find handler');
      });


      it('should call the correct benchmark runner', function() {
        var loopSpy = spyOn(runner, 'loopBenchmark');
        var onceSpy = spyOn(runner, 'onceBenchmark');
        var twentyFiveSpy = spyOn(runner, 'twentyFiveBenchmark');
        var profileSpy = spyOn(runner, 'profile');
        expect(loopSpy.callCount).toBe(0);
        expect(onceSpy.callCount).toBe(0);
        expect(twentyFiveSpy.callCount).toBe(0);
        expect(profileSpy.callCount).toBe(0);

        runner.onBtnClick(sampleEvent);
        expect(loopSpy.callCount).toBe(1);

        sampleEvent.target.textContent = 'Once';
        runner.onBtnClick(sampleEvent);
        expect(onceSpy.callCount).toBe(1);

        sampleEvent.target.textContent = 'Loop 25x';
        runner.onBtnClick(sampleEvent);
        expect(twentyFiveSpy.callCount).toBe(1);

        sampleEvent.target.textContent = 'Profile';
        runner.onBtnClick(sampleEvent);
        expect(profileSpy.callCount).toBe(1);
      })
    });


    describe('.runAllTests()', function() {
      beforeEach(testing.inject(Steps, Document, function(steps, doc) {
        steps.add(mockStep);
        doc.infoTemplate = jasmine.createSpy('infoTemplate');
      }));

      it('should call resetIterations before calling done', function() {
        var spy = spyOn(runState, 'resetIterations');
        runState.iterations = 0;
        runner.runAllTests();
        expect(spy).toHaveBeenCalled();
      });


      it('should call done after running for the appropriate number of iterations', function() {
        var spy = spyOn(mockStep, 'fn');
        var doneSpy = jasmine.createSpy('done');

        runs(function() {
          runState.setIterations(5, 5);
          runner.runAllTests(doneSpy);
        });

        waitsFor(function() {
          return doneSpy.callCount;
        }, 'done to be called', 500);

        runs(function() {
          expect(spy.callCount).toBe(5);
        });
      });
    });


    describe('.loopBenchmark()', function() {
      var runAllTestsSpy, btn;
      beforeEach(function() {
        runAllTestsSpy = spyOn(runner, 'runAllTests');
        doc.loopBtn = document.createElement('button');
      });

      it('should call runAllTests if iterations does not start at greater than -1', function() {
        runState.iterations = 0;
        runner.loopBenchmark();
        expect(runAllTestsSpy).toHaveBeenCalled();
        expect(runAllTestsSpy.callCount).toBe(1);
      });


      it('should set the button text to "Pause" while iterating', function() {
        runState.iterations = 0;
        runner.loopBenchmark();
        expect(doc.loopBtn.innerText).toBe('Pause');
      });


      it('should set the runState -1 iterations', function() {
        var spy = spyOn(runState, 'setIterations');
        runState.iterations = 0;
        runner.loopBenchmark();
        expect(spy).toHaveBeenCalledWith(-1);
      });
    });


    describe('.onceBenchmark()', function() {
      var runAllTestsSpy;
      beforeEach(function() {
        doc.onceBtn = document.createElement('button');
        runAllTestsSpy = spyOn(runner, 'runAllTests');
      });

      it('should call runAllTests', function() {
        expect(runAllTestsSpy.callCount).toBe(0);
        runner.onceBenchmark();
        expect(runAllTestsSpy).toHaveBeenCalled();
      });


      it('should set the button text to "..."', function() {
        expect(runAllTestsSpy.callCount).toBe(0);
        runner.onceBenchmark();
      });
    });


    describe('.twentyFiveBenchmark()', function() {
      var runAllTestsSpy;
      beforeEach(function() {
        doc.twentyFiveBtn = document.createElement('button');
        runAllTestsSpy = spyOn(runner, 'runAllTests');
      });


      it('should set the runState to 25 iterations', function() {
        var spy = spyOn(runState, 'setIterations');
        runner.twentyFiveBenchmark();
        expect(spy).toHaveBeenCalledWith(25);
      });


      it('should call runAllTests', function() {
        runner.twentyFiveBenchmark();
        expect(runAllTestsSpy).toHaveBeenCalled();
      });


      it('should pass runAllTests a third argument specifying times to ignore', function() {
        runner.twentyFiveBenchmark();
        expect(runAllTestsSpy.calls[0].args[1]).toBe(5);
      });
    });
  });
});
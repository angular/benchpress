
# Benchpress

Benchpress allows creation and sampling of macro benchmarks to compare performance of real world
web applications. The project is built and maintained by the [Angular](https://github.com/angular)
team, and is used to test performance of [AngularJS](https://github.com/angular/angular.js) and [AngularDart](https://github.com/angular/angular.js), but is not limited to testing
with these frameworks.

```
$ npm install -g angular-benchpress
```

## Status: In-Development

Expect frequent breaking changes.

## Creating Benchmarks

Starting in a project's web app's directory:
 1. Create a directory called "benchmarks" (or some other name if the build step will be provided)
 1. Create a directory in benchmarks/&lt;benchmark-name&gt;
 1. In benchmarks/&lt;benchmark-name&gt;, create a [config file](#benchpress-config) called "bp.conf.js" to specify scripts to load in this benchmark
 1. Add a file called "main.html" which is the html that will be interpolated into the benchmark
   runner template. This is where the markup for the app being tested should live.
    This is required, although it may be empty.
 1. Create any scripts, html files, or other dependent files in the same folder
 1. Run `benchpress build` to generate the combined benchmark runner in "benchpress-build/" within the web app
 1. Still in the web app directory, execute `benchpress run`
 1. Launch Browser (Chrome Canary provides most accurate memory data, See
    [Launching Canary](#launching-canary) for instructions on testing in Chrome
    Canary)
 1. Browse to `localhost:3339`

The benchpress library adds an array to the window object called "benchmarkSteps," which is where
a benchmark should push benchmark configuration objects. The object should contain a `name`, which
is what the benchmark shows up as in the report, and a `fn`, which is the function that gets
evaluated and timed.

```javascript
window.benchmarkSteps.push({
  name: 'Something Expensive',
  description: 'Lengthy description of benchmark...',
  fn: function() {
    someExpensiveOperation();
  }
})
```

### Preparation and cleanup

There are no sophisticated mechanisms for preparing or cleaning up after tests (yet). A benchmark should
add a step before or after the real test in order to do test setup or cleanup. All steps will show
up in reports.

## Benchpress Config

Each benchmark directory should contain a file named `bp.conf.js`, which tells benchpress
how to prepare the benchmark at build-time.

Example benchpress config:

```javascript
module.exports = function(config) {
  config.set({
    //Ordered list of scripts to be appended to head of document
    scripts: [{
      id: 'angular', //optional, allows overriding script at runtime by providing ?angular=/some/path,
      src: '../../../build/angular.js' //relative path to library from runtime benchmark location
    }]
  });
}
```

## CLI

The CLI has three commands:

```
$ benchpress build --build-path=optional/path
$ benchpress run --build-path=optional/path //Starts serving cwd at :3339. Will redirect '/' to build-path
$ benchpress launch_chrome //Launches Chrome Canary as described below
```

## Launching Canary

For Mac and Linux computers, a utility script is included to launch Chrome Canary with special
flags to allow manual garbage collection, as well as high resolution memory reporting. Unless
Chrome Canary is used, these features are not available, and reports will be lacking information.
Samples will also have more outliers with more expensive test runs because garbage collection timing
is left up to the VM.

This launches Chrome Canary in Incognito Mode for more accurate testing.

```
$ benchpress launch_chrome
```

## Running Benchmarks

After opening the benchmark in the browser as described in
[Creating Benchmarks](#creating-benchmarks), the test execution may be configured in two ways:

 1. Number of samples to collect
 1. How many test cycles to run

The number of samples tells benchpress "analyze the most recent n samples for reporting." If the
number of samples is 20, and a user runs a loop 99 times, the last 20 samples are the only
ones that are calculated in the reports. This value is controlled by a text input at the top of the
screen, which is set to 20 by default.

The number of times a test cycle executes is set by pressing the button representing how many
cycles should be performed. Options are:

 * Loop: Keep running until the loop is paused
 * Once: Run one cycle (note that the samples will still be honored, pressing once 100 times will
   still collect the number of samples specified in the text input)
 * 25x: Run 25 cycles and stop, still honoring the specified number of samples to collect

# ngBench

A benchmarking harness built on karma and jasmine.


## Overview

This project is meant to compare the performance of
other projects over time, by running a set of
performance tests against different versions of
a project.

Presently, ng-bench supports comparison of two
SHAs of the Angular.js project.

## Tentative Roadmap

### Test projects other than angular.js

This is an immediate need of the framework.
Currently, ng-bench is tightly coupled with Angular.js,
and will only compare different versions of the repository
at github.com/angular/angular.js.

To enable support for other projects, these tasks
must be completed:

 * Customization of build process (instead of assuming `grunt package`)
 * Allow remote & repo configuration
 * Change the name of the project something other than "ngBench"
### Global Runner

The framework should provide the ability to run
the benchmark runner from within
an existing project, similar to how karma works.

Performance tests can be written within a project,
version-controlled, and executed.

### Compare Working Copy & n SHAs

The framework only supports comparison of
two SHAs within the angular.js project.

The framework should support ability to
compare working copy of a project against any n SHAs
of the same project. This would allow developers to
make sure a local change has a positive impact on
overall performance before committing the change.

### Compare Different Projects

The runner should support running tests against similar
projects, such as comparing performance of multiple
frameworks doing the same task.

### Record and share past runs for historical comparison

The runner should allow saving results of test runs.

A challenge to this feature is that the performance
tests may themselves change over time, so comparing
one run to another might be apples and oranges.

### A UI to set up, run, and view reports

There should be a UI that helps set up the test run,
instead of relying on running a series of Grunt tasks.

The UI should support:

 * Selecting the directory of the project to compare
 * Selecting versions of the project to compare
 * Running tests and seeing progress
 * Viewing reports

### Visualization

The framework should support multiple types of visualization
of data, which can be configured inside of tests, as well
as in reporting views of tests.

Longer-term, there should be an API to write custom
visualizations of data to be included in reports.

First-time setup
-------

In the base directory, run:
```
npm install -g grunt-cli karm
npm install .
```

Comparing Two SHAs of the repository
--------

(Currently it assumes the repo is angularjs)

```
//Creates builds of each SHA and configures Karma to test them.
grunt compareShas:sha1:sha2
//Run the tests
grunt benchmark
```

Once `grunt benchmark` is complete, the test output is available
in report/report.html.


# ngBench

A benchmarking harness built on karma and jasmine.


## Overview

This project is meant to compare the performance of
other projects over time, by running a set of
performance tests against different versions of
a project.

Presently, ng-bench supports comparison of two
SHAs of the Angular.js project.

## Roadmap

 * Test projects other than angular.js
 * Ability to run the benchmark runner from within
    an existing project, similar to how karma works
 * Record and share past runs for historical comparison
 * A UI to set up, run, and view reports

First-time setup
-------

In the base directory, run:
```
npm install -g grunt-cli
npm install -g karma
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


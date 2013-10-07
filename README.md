ngBench
=======

A benchmarking harness built on karma and jasmine.

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
//Start karma (make sure to leave the karma browser tab open)
karma start --single-run
//Run the tests
grunt benchmark
```

Once `grunt benchmark` is complete, the test output is available
in report/report.html.


#!/bin/bash

PROFILE_DIR=/tmp/chrome-ng-bench-$RANDOM

cleanup() {
  rm -rf $PROFILE_DIR
}

# register a trap
trap "cleanup; exit 0" EXIT

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \  --user-data-dir=$PROFILE_DIR \
  --disable-default-apps \
  --no-first-run \
  --enable-benchmarking \
  http://localhost:9999/


#!/bin/bash

VERSION=`echo "console.log(require('./package.json').version)" | node`

echo Building dist files for $VERSION...
mkdir -p dist
browserify -t browserify-shim src/L.Routing.PointToPoint.js >dist/lrm-pointtopoint.js
uglifyjs dist/lrm-pointtopoint.js >dist/lrm-pointtopoint.min.js
echo Done.

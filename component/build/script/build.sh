#!/bin/bash

npm run clean

if [ $? = 0 ]; then

    # umd
    npm run build:umd

    # component
    export BABEL_ENV=es5
    babel src/component --out-dir dist/component --copy-files
    npm run build:css

    # helper
    babel src/helper --out-dir dist/helper --copy-files

    # es
    export BABEL_ENV=es2015
    babel src/component --out-dir dist/es --copy-files

    # readme & pkg.json
    cp README.md dist/README.md
    node build/util/genPkg.js > dist/package.json

else
    echo -e '\033[0;31m Please fix the error, You may run `npm run format` to fix.'
fi

const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./base');
const PRJ_PATHS = require('../util/getPath');

function buildEntry() {
    return fs.readdirSync(PRJ_PATHS.componentRoot)
        .reduce((m, n) => {
            const componentFile = path.join(PRJ_PATHS.componentRoot, n, 'index.jsx');
            if (fs.existsSync(componentFile)) {
                m[`component/${n}/index`] = componentFile
            }
            return m;
        }, {});
}

const config = merge(baseConfig, {
    entry: buildEntry(),
    output: {
        filename: '[name].js',
        path: PRJ_PATHS.distRoot
    }
});

module.exports = config;

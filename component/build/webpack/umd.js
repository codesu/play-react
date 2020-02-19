const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./base');
const PRJ_PATHS = require('../util/getPath');

const config = merge(baseConfig, {
    entry: {
        index: PRJ_PATHS.componentRoot,
    },
    devtool: 'hidden-source-map',
    output: {
        sourceMapFilename: '[file].map',
        filename: '[name].min.js',
        path: path.join(PRJ_PATHS.distRoot, 'umd'),
    },
});

module.exports = config;

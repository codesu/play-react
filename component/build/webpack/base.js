const webpack = require('webpack');
const pkg = require('../../package.json');
const PRJ_PATHS = require('../util/getPath');
const nodeExternals = require('webpack-node-externals');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

process.env.BABEL_ENV = 'es2015';

module.exports = {
    output: {
        libraryTarget: 'umd',
        library: '[name]'
    },
    externals: [
        nodeExternals(),
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    mode: 'production',
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.svg$/,
            loader: 'svg-inline-loader'
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: {
                loader: 'file-loader',
                options: {
                    context: PRJ_PATHS.srcRoot,
                    name: '[path][name].[ext]'
                },
            },
            exclude: /node_modules/
        }]
    },
    plugins: [
        new CaseSensitivePathsPlugin(),
        // new BundleAnalyzerPlugin(),
        new webpack.BannerPlugin({
            banner: `${pkg.name}
version: ${pkg.version}`
        })
    ]
};

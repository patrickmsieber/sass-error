const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleTracker = require('webpack-bundle-tracker');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');



exports.production = function() {
    return {
        output: {
        	filename: '[name].js',
            publicPath: '/static/dist/',
        },
        plugins: [
            new MiniCssExtractPlugin('[name].css'),
            new BundleTracker({filename: './webpack-stats.json'}),
            new UglifyJsPlugin({
                uglifyOptions: {
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    output: {
                        comments: false
                    },
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_fnames: false,
                },
            })
        ]
    };
};

exports.development = function() {
    return {
        output: {
            filename: '[name].js'
        },
        plugins: [
            new MiniCssExtractPlugin('[name].css'),
            new BundleTracker({filename: './webpack-stats.json'})
        ]
    };
};

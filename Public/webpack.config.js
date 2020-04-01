const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const babel_polyfill = require('babel-polyfill');

const middleware = require('webpack-dev-middleware');
const express = require('express');
const app = express();

const parts = require('./webpack_config/lib');

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const autoprefixer = require('autoprefixer');

const APP_ROOT = path.join(__dirname, '/src/private');
const STATIC_ROOT = path.join(__dirname, 'src/static');

const PATHS = {
    app: path.join(APP_ROOT, '/js/app'),
    style: path.join(APP_ROOT, 'js/style'),
    build: path.join(STATIC_ROOT, 'dist')
};

const common = {
    entry: {
        app: ['babel-polyfill', PATHS.app],
        style: PATHS.style,
    },
    output: {
    	path: path.resolve(PATHS.build),
        publicPath: '/static/dist/',
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
                use: {
                    loader: 'babel-loader',
                    query: {
                      presets: ['@babel/preset-env'],
                      plugins: ['add-module-exports']
                    }
                }
            }, 
            {
            	test: /\.scss?$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader',
                    'sass-loader'
                ]
            }, 
            {
            	test: /\.css?$/,
            	use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
                ]
            },
            {test: /\.(jpg|gif|png)$/, loader: 'url-loader?limit=100000' },
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
        ],
    },
    resolve: {
        alias: {
            'root': __dirname,
        },
        modules: ['node_modules']
    },
    plugins: [
        // autoprefixer({ browsers: ['last 2 versions'] }),
        require('precss'),
        require('autoprefixer'),
        new MiniCssExtractPlugin(),
        new ProgressBarPlugin(),
        new CleanWebpackPlugin(['dist'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
};

var config;
// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
    case 'build':
        config = merge(common, parts.production());
    break;
    default:
        config = merge(common, parts.production());
        // const compiler = webpack(config); development
        // app.use(middleware(compiler, {
        //     index: 'src/html/index.html'
        // }));
}


module.exports = config;


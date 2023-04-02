const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ROOT = path.resolve( __dirname, 'src' );
const DESTINATION = path.resolve( __dirname, 'dist' );

module.exports = {
    context: ROOT,

    entry: {
        'main': './scripts/main.ts'
    },
    
    output: {
        filename: '[name].bundle.js',
        path: DESTINATION
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },

    module: {
        rules: [
            /****************
            * PRE-LOADERS
            *****************/
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader'
            },

            /****************
            * LOADERS
            *****************/
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },

    plugins: [
        new HTMLWebpackPlugin({
            template: "./scripts/index.html"
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './scripts/css',
                    to: 'css'
                },
                {
                    from: './scripts/img',
                    to: 'img'
                }
            ]
        })
    ],

    devtool: 'cheap-module-source-map',
    devServer: {}
};


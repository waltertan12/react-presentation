'use strict';

const Webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const HOST = process.env.HOST || require('os').hostname();
const PORT = process.env.PORT || 8888;

module.exports = {
    entry: [
        `webpack-dev-server/client?http://${HOST}:${PORT}`,
        'webpack/hot/only-dev-server',
        path.resolve(__dirname, 'src', 'index.js'),
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
    output: {
        publicPath: `https://${HOST}:${PORT}/`,
        path: path.join(__dirname, '/'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js'],
        modules: [ path.resolve(__dirname, 'src'), 'node_modules' ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules\/)/,
                loader: 'babel-loader',
                query: {
                    presets: [ 'es2015' ],
                    plugins: [
                        'transform-runtime', 
                        'transform-class-properties',
                        [
                            'transform-react-jsx',
                            {
                                pragma: 'createNode',
                            }
                        ],
                    ]
                }
            }
        ]   
    },
    devServer: {
        noInfo: false,
        hot: true,
        inline: true,
        historyApiFallback: true,
        port: PORT,
        host: HOST,
        https: true,
    },
    plugins: [
        new Webpack.NoEmitOnErrorsPlugin(),
        new Webpack.HotModuleReplacementPlugin(),
        new DashboardPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'template.html')
        }),
    ],
};

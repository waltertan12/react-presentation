'use strict';

const Webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 8888;

module.exports = {
    entry: [
        `webpack-dev-server/client?http://${HOST}:${PORT}`,
        'webpack/hot/only-dev-server',
        path.resolve(__dirname, 'src', 'demo.js'),
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
    output: {
        publicPath: `https://${HOST}:${PORT}/`,
        path: path.join(__dirname, '/'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: [ '.js', '.jsx', '.ts', '.tsx', '.json' ],
        modules: [ path.resolve(__dirname, 'src'), 'node_modules' ],
    },
    module: {
        rules: [
            {
                test: /\.(js|ts|jsx|tsx)$/,
                exclude: /(node_modules\/)/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/typescript',
                    ],
                    plugins: [
                        '@babel/transform-runtime', 
                        '@babel/proposal-class-properties',
                        [
                            '@babel/transform-react-jsx',
                            {
                                pragma: 'createNode',
                            },
                        ],
                    ],
                },
            },
        ],
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
            template: path.resolve(__dirname, 'src', 'template.html'),
        }),
    ],
};

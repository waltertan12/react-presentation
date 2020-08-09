const Webpack = require('webpack');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: [
        path.resolve(__dirname, 'src', 'demo.ts'),
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'demo.[chunkhash].js',
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
    plugins: [
		new ForkTsCheckerWebpackPlugin(),
        new WebpackCleanupPlugin(),
        new Webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                drop_console: false,
                drop_debugger: true,
            },
            comments: false,
            console: true,
            mangle: true,
        }),
        new Webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            }
        }),
        new Webpack.optimize.AggressiveMergingPlugin(),
        new Webpack.optimize.OccurrenceOrderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'template.html'),
            filename: '../index.html',
        }),
    ],
};

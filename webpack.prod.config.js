const Webpack = require('webpack');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const path = require('path');

module.exports = {
    entry: [
        path.resolve(__dirname, 'src', 'index.js'),
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
    output: {
        path: path.join(__dirname, '/dist'),
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
    plugins: [
        new WebpackCleanupPlugin(),
        new Webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                drop_console: true,
                drop_debugger: true,
            },
            comments: false,
            console: false,
            mangle: true,
        }),
        new Webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            }
        }),
        new Webpack.optimize.AggressiveMergingPlugin(),
        new Webpack.optimize.OccurrenceOrderPlugin(),
    ],
};

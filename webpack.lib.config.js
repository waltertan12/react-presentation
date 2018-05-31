const Webpack = require('webpack');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const path = require('path');

module.exports = {
    entry: [
        path.resolve(__dirname, 'src', 'index.js'),
    ],
    target: 'web',
    output: {
        library: 'VirtualDOM',
        libraryTarget: 'window',
        path: path.join(__dirname, '/dist'),
        filename: 'lib.min.js',
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
        new Webpack.optimize.ModuleConcatenationPlugin(),
        new WebpackCleanupPlugin(),
        new Webpack.optimize.UglifyJsPlugin(),
        new Webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            }
        }),
        new Webpack.optimize.AggressiveMergingPlugin(),
        new Webpack.optimize.OccurrenceOrderPlugin(),
    ],
};

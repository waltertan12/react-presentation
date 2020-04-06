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
        new Webpack.optimize.ModuleConcatenationPlugin(),
        new WebpackCleanupPlugin(),
        new Webpack.optimize.TerserPlugin(),
        new Webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            }
        }),
        new Webpack.optimize.AggressiveMergingPlugin(),
        new Webpack.optimize.OccurrenceOrderPlugin(),
    ],
};

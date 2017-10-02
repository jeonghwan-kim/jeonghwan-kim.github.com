const path = require('path');
const webpack = require('webpack');
const debug = process.env.NODE_ENV === 'development'

console.log('debug:', debug)

module.exports = {
    entry: {
        main: './_js/main.js'
    },
    output: {
        filename: 'main.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: '/node_modules/',
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    },
    plugins: debug ? [] : [
        new webpack.optimize.UglifyJsPlugin({
          compress: { // https://github.com/mishoo/UglifyJS2/tree/harmony#compress-options
            drop_debugger: true,
            warnings: false,
            drop_console: true,
          },
          output: {
            comments: false
          }
        })
    ]
};
const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: {
        main: './_js/app.js'
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
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};
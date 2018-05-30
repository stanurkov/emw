const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './js/index.html',
    filename: 'index.html',
    inject: 'body',
    
})

module.exports = {
    entry: './js/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'index_bundle.js',
        
    },

    devtool: 'cheap-module-source-map',

    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
     	    { test: /\.css$/, use: [ { loader: "style-loader" },  { loader: "css-loader" } ] },
	    { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' } 
	],
    },

    devServer: {
        proxy: {
            // proxy all requests starting with /api to jsonplaceholder
            '/api/**': {
                target: 'http://localhost:3031/',
                secure: false,
                changeOrigin: true
            }
        }
    },

    plugins: [
        HtmlWebpackPluginConfig
    ],
    target: 'electron'


}

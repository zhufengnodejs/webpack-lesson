var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var openBrowserWebpackPlugin = require('open-browser-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname,'react/index.js'),
    output: {
        path: path.resolve(__dirname, 'build'),//输出路径
        filename: 'bundle.js' //输出文件名
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                query: { presets: ["es2015","react"] },
                exclude:/node_modules/,
                include:path.resolve(__dirname,'react')
            }
        ],
    },
    devServer: {
        inline:true,
        stats: {colors: true}, //显示颜色
        port: 8080,//端口
        contentBase: 'build',//指定静态文件的根目录
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '珠峰React课程',
            template: './react/index.html'
        }),
        new openBrowserWebpackPlugin({ url: 'http://localhost:8080' }),
    ]
};
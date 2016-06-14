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
                loaders: ['react-hot','babel?presets[]=es2015&presets[]=react'],
                exclude:/node_modules/,
                include:path.resolve(__dirname,'react')
            },
            {
                test: /\.css/,
                loaders: [ 'style-loader',
                    'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]']
            }
        ],
    },
    devServer: {
        hot:true,
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
        new webpack.HotModuleReplacementPlugin()
    ]
};
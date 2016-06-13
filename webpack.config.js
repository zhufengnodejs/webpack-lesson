var path = require('path');
var jqueryPath = path.join(__dirname, "./node_modules/jquery/dist/jquery.js");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var openBrowserWebpackPlugin = require('open-browser-webpack-plugin');
var webpack = require('webpack');
var definePlugin = new webpack.DefinePlugin({
    __DEV__: (process.env.BUILD_DEV||'').trim() == 'dev'
});
var ExtractTextPlugin = require("extract-text-webpack-plugin");
function rewriteUrl(replacePath) {//重写url
    return function (req, opt) {
        var queryIndex = req.url.indexOf('?');//取得?所在的索引
        var query = queryIndex >= 0 ? req.url.substr(queryIndex) : "";//取得查询字符串的内容
        //把proxy的path替换为 '/$1\.json',$1取自path匹配到的真实路径中的第一个分组
        req.url = req.path.replace(opt.path, replacePath) + query;
    };
}

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),//入口文件
    output: {
        path: path.resolve(__dirname, 'build'),//输出路径
        filename: 'bundle.js' //输出文件名
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude:/node_modules/
            },
            {
                test: /\.less/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.(woff|woff2|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000"
            },
            {
                test: /\.(jpg|png)$/,
                loader: "url?limit=8192"
            },
            {
                test: /jquery.js$/,
                loader: "expose?jQuery"
            }
        ],
        noParse: [jqueryPath]
    },
    resolve: {
        extensions: ["", ".js", ".css", ".json"],
        alias: {
            'jquery': jqueryPath
        }
    },
    devServer: {
        inline:true,
        stats: {colors: true}, //显示颜色
        port: 8080,//端口
        contentBase: 'build',//指定静态文件的根目录
        proxy: [
            {
                path: /^\/api\/(.*)/,             //替换符合此正则的接口路径
                target: "http://localhost:8080/", //目标域名端口
                rewrite: rewriteUrl('/$1\.json'), //重新定向到新的地址,$1取自path正则匹配到的真实路径的第一个分组
                changeOrigin: true                //修改来源地址
            }
        ]
    },
    plugins: [
        definePlugin,
        new ExtractTextPlugin("bundle.css"),
        new HtmlWebpackPlugin({
            title: '珠峰React课程',
            template: './src/index.html'
        }),
        new openBrowserWebpackPlugin({ url: 'http://localhost:8080' })
    ]
};
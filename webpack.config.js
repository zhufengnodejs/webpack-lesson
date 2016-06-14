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
    entry: {
        a:path.resolve(__dirname, 'src/a.js'),
        b: path.resolve(__dirname, 'src/b.js')
    },
    output: {
        path: path.resolve(__dirname, 'build'),//输出路径
        filename: '[name].[hash].js' //输出文件名
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
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new openBrowserWebpackPlugin({ url: 'http://localhost:8080' }),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.MinChunkSizePlugin({
            compress: {
                warnings: false
            }
        }),
        // 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
        new webpack.optimize.DedupePlugin(),
        // 按引用频度来排序 ID，以便达到减少文件大小的效果
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: 1.5,
            moveToParents: true
        })
    ]
};
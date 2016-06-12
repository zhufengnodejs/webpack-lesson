var path = require('path');
module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),//入口文件
    output: {
        path: path.resolve(__dirname, 'build'),//输出路径
        filename: 'bundle.js' //输出文件名
    },
};
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development', // 开发模式（代码不压缩，保留注释等）
    devtool: 'eval-cheap-module-source-map', // 开发环境SourceMap（快速定位错误）

    // 开发服务器配置
    devServer: {
        host: 'localhost', // 服务器地址
        port: 8080, // 端口号（可修改）
        open: true, // 自动打开浏览器
        hot: true, // 启用热模块替换（HMR）
        historyApiFallback: true, // 支持SPA路由（避免刷新404）
        static: {
            directory: './public' // 额外静态资源目录
        },
        client: {
            overlay: true // 编译错误时在浏览器中显示全屏覆盖层
        }
    }
});
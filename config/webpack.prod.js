const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin'); // 内置在webpack中，用于压缩JS

module.exports = merge(common, {
    mode: 'production', // 生产模式（自动启用代码压缩）
    devtool: 'source-map', // 生产环境SourceMap（用于调试，但不影响运行效率）

    // 优化配置
    optimization: {
        minimizer: [
            // 压缩JS
            new TerserPlugin({
                parallel: true, // 多进程压缩，加快速度
                terserOptions: {
                    compress: {
                        drop_console: true // 移除console.log（可选）
                    }
                }
            })
        ],
        splitChunks: {
            // 分割公共代码（如node_modules中的依赖）
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
});
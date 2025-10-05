const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    // 入口文件（对应你的 src/main.js）
    entry: './src/main.js',

    // 输出配置
    output: {
        path: path.resolve(__dirname, '../dist'), // 输出目录（dist文件夹）
        filename: 'js/[name].[contenthash:8].js', // 打包后的JS文件（带哈希值，避免缓存）
        clean: true, // 每次构建前清空dist目录
    },

    // 模块处理规则
    module: {
        rules: [
            // 处理CSS文件（依赖 css-loader 和 style-loader）
            {
                test: /\.css$/,
                use: [
                    'style-loader', // 开发环境：将CSS注入到DOM中
                    'css-loader' // 解析CSS文件中的 @import 和 url()
                ]
            },

            // 处理HTML文件（依赖 html-loader，用于在JS中导入HTML作为字符串）
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            esModule: false // 避免导入HTML时出现模块化问题
                        }
                    }
                ]
            },

            // 处理静态资源（如图片、字体等，可根据需要添加）
            {
                test: /\.(png|jpe?g|gif|svg|webp|ico|woff2?|eot|ttf|otf)$/i, // 新增 .webp、.ico 等
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[hash][ext][query]'
                }
            }
        ]
    },

    // 插件配置
    plugins: [
        // 生成HTML文件，并自动引入打包后的JS/CSS
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html', // 输出文件名
            inject: 'body' // JS脚本注入到body底部
        }),

        // 复制静态资源（如public下的其他文件，不经过Webpack处理）
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'), // 源目录
                    to: path.resolve(__dirname, '../dist'), // 目标目录
                    globOptions: {
                        ignore: ['**/index.html'] // 排除index.html（已通过HtmlWebpackPlugin处理）
                    }
                }
            ]
        })
    ],

    // 路径别名（简化导入路径）
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src') // 例如：import '@/styles/global.css' 等价于 import '../src/styles/global.css'
        },
        extensions: ['.js', '.json'] // 省略文件后缀
    }
};
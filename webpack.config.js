const path = require('path');

module.exports = {
    entry:'./src/main.js',
    output:{
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name]_[hash:8].js'
    },
    module : {
        rules: [
            {test: /\.(less|css)$/,use:[ 'style-loader',  "css-loader", "less-loader"]},
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            }
            // {
            //     test: /\.(woff|svg|eot|ttf)\??.*$/,
            //     loader: 'url-loader',
            //     exclude: /node_modules/
            // }
        ]
    },
    mode: 'development',
    devtool:'cheap-module-eval-source-map', // 开发环境配置
    devServer:{
        contentBase:'./code',
        host:'localhost',
        port:8081,
        open:false,
        hotOnly:true,
        proxy: {
            '/message': {
                target: 'http://10.99.44.150:7070', // 炼军本地message
                changeOrigin: true,
                // pathRewrite: {
                //     '^/message': '/'
                // }
            }
        }
    }
}

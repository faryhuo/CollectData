/*
* @Author: Fary
* @Date:   2018-01-13 11:26:52
* @Last Modified by:   Fary
* @Last Modified time: 2018-02-07 10:35:01
*/
const path              = require('path');
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


let WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV); 
module.exports = {
    entry: {
        index:'./src/public/app.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: WEBPACK_ENV === 'dev' 
            ? '/dist/' : '/sellapp/',
        filename: 'js/[name].js'
    },
    resolve: {
        alias : {
            page        : path.resolve(__dirname, 'src/page'),
            component   : path.resolve(__dirname, 'src/component'),
            store        : path.resolve(__dirname, 'src/store'),
            common        : path.resolve(__dirname, 'src/common'),
            "@"          :path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env','react',"latest","mobx"],
                        plugins: [/*"transform-runtime"*/
                        ["import", { "libraryName": "antd-mobile", "style": "css" }] ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'stylus-loader']
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 48192,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/public/index.html',
            favicon: './src/public/favicon.ico',
            chunks:["common","index"]
        }),new ExtractTextPlugin("css/[name].css"),
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename: 'js/base.js'
        })

    ],
    devtool: process.env.WEBPACK_ENV=="online"?false:'#cheap-module-eval-source-map',//'cheap-module-eval-source-map',
    devServer: {
        clientLogLevel: 'warning',
        //quiet: true, // necessary for FriendlyErrorsPlugin
        port: 8066,
        host: '0.0.0.0', 
        watchOptions: {
          poll: false
        },
        disableHostCheck: true,
        open:false,
        historyApiFallback: {
            index:'/dist/index.html',
            rewrites:[{
                from:"/login",to:'/dist/login.html'
            }]
        },
        proxy : {
            "/download":{
                target:"http://127.0.0.1:8081/",
                changeOrigin:true,
                secure:false
            },
            "/checkExcelFile":{
                target:"http://127.0.0.1:8081/",
                changeOrigin:true,
                secure:false
            },
            "/SimpleDataQuery":{
                target:"http://127.0.0.1:8081/",
                changeOrigin:true,
                secure:false
            }
        }
    }
};
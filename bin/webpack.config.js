var webpcak = require('webpack');
const fs = require("fs");
const path = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

nodeModules["sequelize"] = "commonjs sequelize";
nodeModules["redis"] = "commonjs redis";
nodeModules["webpack"] = "commonjs webpack";
nodeModules["html-webpack-plugin"] = "commonjs html-webpack-plugin";
nodeModules["webpack-hot-middleware"] = "commonjs webpack-hot-middleware";
nodeModules["webpack-dev-middleware"] = "commonjs webpack-dev-middleware";
nodeModules["ali-oss"] = "commonjs ali-oss";
nodeModules["art-template"] = "commonjs art-template";
nodeModules["think-wx"] = "commonjs think-wx";
nodeModules["rajan-datamodel"] = "commonjs rajan-datamodel";
nodeModules["tedious"] = "commonjs tedious";
nodeModules["pg-hstore"] = "commonjs pg-hstore";
nodeModules["cache-manager"] = "commonjs cache-manager";
nodeModules["class-validator"] = "commonjs class-validator";
nodeModules["class-transformer"] = "commonjs class-transformer";
nodeModules["@nestjs/microservices"] = "commonjs    @nestjs/microservices";

let ignoreMudles = {
    "ali-oss": "^5.2.0",
    "art-template": "^3.0.3",
    "body-parser": "^1.18.2",
    "cookie-parser": "^1.4.3",
    "ejs": "^2.5.9",
    "express": "^4.16.3",
    "jsonminify": "^0.4.1",
    "log4js": "^2.7.0",
    "moment": "^2.22.1",
    "mosca": "^2.8.3",
    "mqtt": "^2.18.3",
    "qr-image": "^3.2.0",
    "rajan-datamodel": "^1.0.1",
    "redis": "^2.8.0",
    "request": "^2.88.0",
    "socket.io": "^2.1.1",
    "svg-captcha": "^1.3.11",
    "ueditor": "^1.2.3",
    "uuid": "^3.2.1",
    "vant": "^1.1.7",
    "vue-resource": "^1.5.1",
   
    "ws": "^6.0.0"
}

const baseDevPath = '../dist/';//编译的目标路径
const baseSrcDevPath = path.join(__dirname, `../dist/`) // 源代码的路径


module.exports = {
    entry:{
        index:'./index.js',
        dstart:'./dstart.js',
        dclose:'./dclose.js',
    },
    output: {
        path: path.resolve(__dirname, baseDevPath+'/'),
        filename: '../dist/bin/[name].js'
    },
    target: 'node',
    externals: nodeModules,
    context: __dirname,
    node: {
        __filename: false,
        __dirname: false
    },
    plugins: [
        new UglifyJsPlugin({
			uglifyOptions:{
				mangle: true,// 启用源码混淆加密
			}
		}),
        new CopyWebpackPlugin([
          

            // 复制后台启动脚本
            // {
            //     from: path.join(__dirname+`/dstart.js`),
            //    to: path.join(__dirname, `../dist/bin/dstart.js`)
            // },
            // {
            //     from: path.join(__dirname+`/dclose.js`),
            //    to: path.join(__dirname, `../dist/bin/dclose.js`)
            // },

			// 复制依赖配置文件
             {
                 from: path.join(__dirname+`/package.json`),
                to: path.join(__dirname, `../dist/bin/package.json`)
             },
			 
			 // 复制静态文件夹
             {
                 from: path.join(__dirname+`/static`),
                to: path.join(__dirname, `../dist/bin/static`)
             }, 

			 // 复制语言包
             {
                 from: path.join(__dirname+`/lang`),
                to: path.join(__dirname, `../dist/bin/lang`)
             }, 
			 
			 // 复制模板文件夹
             {
                 from: path.join(__dirname+`/views`),
                to: path.join(__dirname, `../dist/bin/views`)
             }, 
			 
			 // 复制运行库
             {
                 from: path.join(__dirname+`/core.exe`),
                to: path.join(__dirname, `../dist/bin/core.exe`)
             }, 

             // 复制配置文件
             {
                from: path.join(__dirname+`/../config.ini`),
               to: path.join(__dirname, `../dist/config.ini`)
             }, 

             // 复制启动命令
             {
                from: path.join(__dirname+`/../启动.bat`),
               to: path.join(__dirname, `../dist/启动.bat`)
             }, 
             {
                from: path.join(__dirname+`/../启动[后台].bat`),
               to: path.join(__dirname, `../dist/启动[后台].bat`)
             }, 
             {
                from: path.join(__dirname+`/../停止[后台].bat`),
               to: path.join(__dirname, `../dist/停止[后台].bat`)
             }, 

        ]),
    ]
}
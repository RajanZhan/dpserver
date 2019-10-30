const path = require("path");
var readlineSync = require('readline-sync');
const fs = require("fs");
const ini = require("ini");
var Hjson = require('hjson');
const net = require("net");

// 阻塞退出程序
exports.syncExit = (msg) => {
    console.log(msg.brightRed);
    console.log("请按任意键退出".brightRed);
    readlineSync.question('', {
        hideEchoBack: true // The typed text on screen is hidden by `*` (default).
    });
    process.stdin.pause();
    process.exit();
}

var bootError = exports.syncExit;

// 读取配置文件
exports.getConfig = () => {
    var config = null;
    var configPath = null;
    var configPath1 = path.join(__dirname, "../config.ini");
    var configPath2 = path.join(__dirname, "./config.ini");
    var configPath3 = path.join(__dirname, "../../config.ini");
    if (fs.existsSync(configPath1)) {
        configPath = configPath1;
    } else if (fs.existsSync(configPath2)) {
        configPath = configPath2;
    } else if (fs.existsSync(configPath3)) {
        configPath = configPath3;
    } else {
        return bootError("配置信息读取失败");
    }

    if (fs.existsSync(configPath)) {
        config = ini.parse(fs.readFileSync(configPath, "UTF-8"));
        if (!config.boot) {
            return bootError("配置文件解析失败，缺少boot配置信息");
        }
        if (!config.static) {
            return bootError("配置文件解析失败，缺少static配置信息");
        }

        if (!config.mime) {
            return bootError("配置文件解析失败，缺少mime配置信息");
        }

    } else {
        return bootError("config.ini查找失败，请将config.ini放置程序根目录下");
    }
    return config;
}

/**
 * 读取json文件
 * @param {string} pathStr 配置文件路径
 * @returns {object}  json object
 */
exports.parseJson = (pathStr) => {
    if (!pathStr) {
        throw new Error("json 文件路径不能为空");
    }
    let fullPath1 = path.join(__dirname, pathStr);
    let fullPath2 = path.join(__dirname, '../', pathStr);
    let fullPath = "";
    if (!fs.existsSync(fullPath1)) {
        if (!fs.existsSync(fullPath2)) {
            throw new Error(fullPath2 + " 文件不存在");
        } else {
            fullPath = fullPath2
        }
    } else {
        fullPath = fullPath1
    }

    var _config = fs.readFileSync(fullPath, "utf8");
    return Hjson.parse(_config);
}


/**
 * 检测当前使用的端口
 * @param  {number} port 端口
 * @returns { <Promise> boolean } true 可以使用； false 不可用
 * 
 */
exports.checkPortStatus = (port) => {
    return new Promise((resolve, reject) => {
        if (!port) {
            return reject("检测端口状态时，需要传入端口信息");
        }

        // 创建服务并监听该端口
        var server = net.createServer().listen(port)
        server.on('listening', function () { // 执行这块代码说明端口未被占用

            server.close() // 关闭服务
            resolve(true);
        })
        server.on('error', function (err) {
            if (err.code === 'EADDRINUSE') { // 端口已经被使用
                return resolve(false);
            }
            return resolve(true)
        })

    })



}
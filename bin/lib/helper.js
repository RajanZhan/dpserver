const path = require("path");
var readlineSync = require('readline-sync');
const fs = require("fs");
const ini = require("ini");
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
    const configPath = path.join(__dirname, "../../config.ini");
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
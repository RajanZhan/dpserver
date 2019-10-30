const express = require('express')
const colors = require('colors');
const fs = require("fs");
const path = require("path");
const app = express()
const {
    syncExit,
    getConfig
} = require("./lib/helper");
const bodyParser = require("body-parser");
var config = getConfig();
var staticBaseUrl = new Set(); //缓存静态文件路径的根目录
var staticMap = new Array(); //缓存静态文件路径映射关系
var staticSpace = []; // 存储需要验证w

app.use(bodyParser.urlencoded({
    extended: false
}));
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views'))
const bootError = syncExit;

console.log("配置文件解析中...".bgBrightCyan)

var mime = config.mime.types.split(",")
for (let i in mime) {
    if (mime[i]) {
        mime[i] = mime[i].trim();
    }
}
const mimeSet = new Set(mime);

app.use((req, res, next) => {

    let pathExtName = path.extname(req.path).trim()
    if (pathExtName) {
        pathExtName = pathExtName.substr(1, pathExtName.length);
        if (!mimeSet.has(pathExtName)) {
            return res.render("mimeError.html", {
                pathExtName
            });
        }
    }

    if (config.log && config.log.requestlog) {
        console.log(`[${req.method}] ${req.path}`.brightCyan);
    }
    next()
})



//解析静态文件目录
if (!config.static || !config.static.include) {
    bootError("尚未配置静态文件目录");
}
let staticConfigArr = config.static.include.split(",");
for (let p of staticConfigArr) {
    if (p) {
        let arr = p.split("@");
        if (arr.length == 2 && arr[0] && arr[1]) {
            let baseurl = ('/' + arr[0]).trim()
            let realpath = arr[1].trim()
            app.use(baseurl, express.static(realpath))
            staticBaseUrl.add(baseurl);
            let item = [baseurl, arr[1]]
            // 检测文件路径是否存在
            if (!fs.existsSync(realpath)) {
                item.push(1);
            }
            staticMap.push(item);
            staticSpace.push(baseurl);

        }
    }
}

app.get('/', (req, res) => {
	if(config.boot.mode &&  config.boot.mode == "debug")
	{
		res.render('index.html', {
			title: 'DpServer',
			version: "1.0.0",
			staticMap,
			mime,
		})
	}
	else
	{
		res.send(`
		 <meta charset=utf8>
		 <h2>working...</h2>
		`);
	}
    
})
app.listen(config.boot.port, () => {
    console.log(`(*^▽^*) DpServer 启动成功[${config.boot.mode &&config.boot.mode == "debug"?"debug":"release" }]...`.brightGreen)
    console.log(`(^_−)☆ 服务监听的端口为 ${config.boot.port}`.brightGreen)
    console.log(`(^_−)☆ 访问文件地址 http://localhost:${config.boot.port}/`.brightGreen)

})
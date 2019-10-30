(async () => {

    const express = require('express')
    const colors = require('colors');
    const fs = require("fs");
    const path = require("path");
    const app = express()
    const {
        syncExit,
        getConfig,
        checkPortStatus,
        parseJson,
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
    // 读取语言包
    var lang = null;

    try {
       lang =  parseJson(config.boot.lang);
        if (!lang) {
            return bootError("语言包读取失败".brightRed);
        }
        //检测端口占用
        let portStatus = await checkPortStatus(config.boot.port);
        if (!portStatus) {
            return bootError(`${config.boot.port} ${lang.portCheckError}`);
        }
        console.log(lang.parsingConfig.bgCyan)
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
            return bootError(lang.staticPathError);
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
            if (config.boot.mode && config.boot.mode == "debug") {
                res.render('index.html', {
                    title: 'DpServer',
                    version: "1.0.0",
                    staticMap,
                    mime,
                })
            } else {
                res.send(`
             <meta charset=utf8>
             <h2>working...</h2>
            `);
            }

        })
        app.listen(config.boot.port, () => {
            console.log(`${lang.processBootSuccess}[${config.boot.mode &&config.boot.mode == "debug"?"debug":"release" }]...`.brightGreen)
            console.log(`${lang.processBootSuccessPort} ${config.boot.port}`.brightGreen)
            console.log(`${lang.processBootSuccessPortUrl}${config.boot.port}/`.brightGreen)

        })
    } catch (err) {
        bootError("程序启动失败" + ": " + err.message)
    }


})()
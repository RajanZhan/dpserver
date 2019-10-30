var pm2 = require('pm2');
const colors = require('colors');
const { syncExit,getConfig } = require("./lib/helper");

var config = getConfig();
pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  
  pm2.start({
    name:"dpServer",
    script    : 'index.js',         // Script to be run
    exec_mode : 'cluster',        // Allows your app to be clustered
    instances :config.boot.cluster,                // Optional: Scales your app by 4
    max_memory_restart : '100M'   // Optional: Restarts your app if it reaches 100Mo
  }, function(err, apps) {
    // pm2.disconnect();   // Disconnects from PM2
    if (err) throw err
    
    console.log("后台启动成功...".brightGreen)
    console.log(`(*^▽^*) DpServer 启动成功...`.brightGreen)
    console.log(`(^_−)☆ 服务监听的端口为 ${config.boot.port}`.brightGreen)
    console.log(`(^_−)☆ 访问文件地址 http://localhost:${config.boot.port}/`.brightGreen)
    syncExit("");
  });
});
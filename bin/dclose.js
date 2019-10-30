var pm2 = require('pm2');
const colors = require('colors');
const {
  syncExit
} = require("./lib/helper");
pm2.connect(function (err) {
  if (err) {
    console.error(err);
    return syncExit("pm2 connect error");
  }
  // pm2.disconnect();
  pm2.stop("dpServer", (err) => {
    if(err)
    {
      syncExit("停止服务失败...");
    }
    console.log("停止服务成功...".brightGreen)
    syncExit("");
  })

});
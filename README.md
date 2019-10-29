# dpserver
一个极简的web服务器软件，可以快速创建一个http服务。

## 使用方法：
直接双击“启动.bat” 即可运行

## 配置信息：
编辑config.ini文件 
[boot]
port=8001 #web服务监听的端口，默认是8001，可以根据需求更改

mode=release # 启动模式（可选值：debug、release），默认是release，当mode=debug时，程序的首页，将会展示所有的调试信息，所以建议在调试阶段使用。当应用上线后，强烈建议改为release模式


cluster=1 # 该配置只有当后台启动时生效  启动的进程数量，该功能现在暂时关闭，后续版本会重新启动，敬请期待

max_memory_restart=100M # 该配置只有当后台启动时生效  每个进程的占用内存多大时自动重启我，该功能现在暂时关闭，后续版本会重新启动，敬请期待


[static]

include= mycc@D:\Project\miniWeb\src\cc,# 在这里配置http资源路径，以“,”分隔，配置的规范为：映射名@文件夹路径，例如abc@d:\e\f，则将d:\e\f 目录设置为http的资源文件目录，abc为通过http协议访问的路径前端前缀， 假设在d:\e\f下有一张图片 1.jpg，那么通过http访问1.jpg的路径为http://localhost:8001/abc/1.jpg  以此类推。


[mime]

types=css,js,html,jpg,png,txt,#可以通过本web服务浏览的文件类型(后缀)，通过","分隔


[log]

requestlog=true # 为true 则每个静态文件请求都将打印请求日志


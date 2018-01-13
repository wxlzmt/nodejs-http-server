# nodejs-http-server
在nodejs平台搭建的静态http server

# required
Node.js v4.4.4  (高版本不支持,其它版本没做兼容性测试)

# run
start.bat

# config
配置信息在index.js文件头部,根据注释按需求修改.
```js
//网站的端口号
var port = 80;

//根目录
var basePath = "/home/w";
//var basePath = "E:/GitHub/nodejs-http-server.git/trunk";

//html主页路径
var index_file_path = basePath+ "/main.html";

//日志文件路径
var log_file_path = basePath+ "/log.txt";

//索引html的head区域的文件内容,指向的文件,这是相对路径;
var _INDEX_HEAD_FILE_NAME = "index_head.html";

//读取文件时的缓冲区大小;单位:字节;
var _CACHE_SIZE = 1024*50;
```

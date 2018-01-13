# nodejs-http-server
在nodejs平台搭建的静态http server

# required
Node.js v4.4.4  (高版本不支持,其它版本没做兼容性测试)

https://npm.taobao.org/mirrors/node/v4.4.4/

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

# linux安装使用
创建目录
```shell
# mkdir /home/w
# mkdir /home/software
```

在`/home/software`目录下,下载`nodejs v4.4.4` , 并解压至 `/home/software/`
```shell
# wget https://npm.taobao.org/mirrors/node/v4.4.4/node-v4.4.4-linux-x64.tar.gz
# tar -xvf node-v4.4.4-linux-x64.tar.gz -C /home/software/
# /home/software/node-v4.4.4-linux-x64/bin/node -v
```

在`/home/w`目录下,下载本项目release,并解压至`/home/w/`
```shell
# wget https://github.com/wxlzmt/nodejs-http-server/releases/download/1.0.0/nodejs-http-server-1.0.0.zip
# unzip nodejs-http-server-1.0.0.zip -d /home/w/
```

运行测试
```shell
# /home/software/node-v4.4.4-linux-x64/bin/node /home/w/index.js
```

#### 使用forever使之后台运行.

安装
```shell
# /home/software/node-v4.4.4-linux-x64/bin/npm install forever -g
```

连接
```shell
# ln -s /home/software/node-v4.4.4-linux-x64/bin/node /usr/bin/node
```

启动项目
```shell
# /home/software/node-v4.4.4-linux-x64/bin/forever start -a -e /home/w/err.log /home/w/index.js
```

停止项目
```shell
# /home/software/node-v4.4.4-linux-x64/bin/forever stop /home/w/index.js
```

访问试试
```shell
# curl http://127.0.0.1
```

如果服务正常,但是外网无法访问,则需要防火墙开放80端口.
```shell
# iptables -I INPUT -p tcp --dport 80 -j ACCEPT
# service iptables save
# service iptables save
```

//需要注意的全局变量;

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


/**
 *参数1:时间对象
 *参数2:年月日分隔符,默认是-
 *参数3:时分秒分隔符,默认是:
 */
var formatDate = function (d, s1, s2) {
  if (s1 == null) {
    var s1 = "-";
  }
  if (s2 == null) {
    var s2 = ":";
  }
  var yyyy = d.getFullYear();
  var mo = d.getMonth() < 9 ? ("0" + (d.getMonth()+1)) : d.getMonth()+1;
  var dd = d.getDate() < 10 ? ("0" + d.getDate()) : d.getDate();
  var hh = d.getHours() < 10 ? ("0" + d.getHours()) : d.getHours();
  var mi = d.getMinutes() < 10 ? ("0" + d.getMinutes()) : d.getMinutes();
  var ss = d.getSeconds() < 10 ? ("0" + d.getSeconds()) : d.getSeconds();
  return yyyy + s1 + mo + s1 + dd + " " + hh + s2 + mi + s2 + ss;
}

var writeLog = function(data,ip){
	console.log(data);
	var fs = require("fs");
	var logPath = log_file_path;
	var options = {encoding:"utf8",flag:"a"};
	if(data!=null || typeof(data)=="string"){
		var cia = ip==null?"":"【"+ip+"】";
		fs.writeFile(logPath,"【"+formatDate(new Date())+"】"+cia+data+"\n",options,function(err){
			console.log(err);
		});
	}
}

var readIndexData = function(){
	//读取文件内容
	var rf=require("fs");
	var filepath = index_file_path;
	var data = rf.readFileSync(filepath,'utf-8');
	return data;
}

//打开并读取文件内容
var openAndGetFileContent = function (fileName,charset){
	var fs = require("fs");
	if(fileName==null || fileName.length==0){
		return null;
	}
	var filepath = basePath+"/"+fileName;
	var data = null;
	try{
		var content = fs.readFileSync(filepath,{encoding:charset});
		return content;
		//data = fs.readFileSync(filepath,'binary');
	}catch(e){
		writeLog(e);
		writeLog("读取文件【"+fileName+"】时发生异常");
	}
}

//获取文件索引页面的html的head标签内容;
var getIndexHeadHtml = function(){
	var content = openAndGetFileContent(_INDEX_HEAD_FILE_NAME,"utf8");
	if(content!=null){
		return content;
	}
	return "";
}

//读取文件内容,并用response输出到浏览器终端;
var openAndReadFileToResponse = function(fileName,response){
	var fs = require("fs");
	if(fileName==null || fileName.length==0){
		return null;
	}
	var filepath = basePath+"/"+fileName;
	var data = null;
	try{
		var fd = fs.openSync(filepath,"r");
		while(true){
			var buffer = new Buffer(_CACHE_SIZE,"binary");
			var len = fs.readSync(fd,buffer,0,buffer.length);
			if(len>0){
				response.write(len==buffer.length?buffer:buffer.slice(0,len),"binary");
			}else{
				fs.closeSync(fd);
				break;
			}
		}
		//data = fs.readFileSync(filepath,'binary');
		return true;
	}catch(e){
		writeLog(e);
		writeLog("读取文件【"+fileName+"】时发生异常");
	}
}

var getFileName = function (path){
	if(path!=null && path.length>0){
		var p = path.indexOf("/");
		var len = path.length;
		var q = path.indexOf("?");
		if(p>=0 && (p+1)<len){
			var end = q>0?q:len;
			var realName = path.substring(p+1,end);
			//writeLog("解析到文件名:"+realName);
			return realName;
		}
	}
	return null;
}
//根据文件名获取扩展名
var getFileExtentision = function(fileRealName){
	if(fileRealName!=null && typeof(fileRealName)=="string" && fileRealName.length>0){
		var i1 = fileRealName.lastIndexOf("/");
		if(i1>0 && (i1+1)<=fileRealName.length){
			fileRealName = fileRealName.substring(i1+1,fileRealName.length);
		}
		var p = fileRealName.lastIndexOf(".");
		var len = fileRealName.length;
		if(p>0 && (p+1)<len){//有点，非点开头，非点结束；
			var ext = fileRealName.substring(p+1,len);
			return ext;
		}
	}
}

var extMap = {
//可扩展的table,键是扩展名,值是Mime类型;
"323":"text/h323","acx":"application/internet-property-stream","ai":"application/postscript","aif":"audio/x-aiff","aifc":"audio/x-aiff","aiff":"audio/x-aiff","asf":"video/x-ms-asf","asr":"video/x-ms-asf","asx":"video/x-ms-asf","au":"audio/basic","avi":"video/x-msvideo","axs":"application/olescript","bas":"text/plain","bcpio":"application/x-bcpio","bin":"application/octet-stream","bmp":"image/bmp","c":"text/plain","cat":"application/vnd.ms-pkiseccat","cdf":"application/x-cdf","cer":"application/x-x509-ca-cert","class":"application/octet-stream","clp":"application/x-msclip","cmx":"image/x-cmx","cod":"image/cis-cod","cpio":"application/x-cpio","crd":"application/x-mscardfile","crl":"application/pkix-crl","crt":"application/x-x509-ca-cert","csh":"application/x-csh","css":"text/css","dcr":"application/x-director","der":"application/x-x509-ca-cert","dir":"application/x-director","dll":"application/x-msdownload","dms":"application/octet-stream","doc":"application/msword","dot":"application/msword","dvi":"application/x-dvi","dxr":"application/x-director","eps":"application/postscript","etx":"text/x-setext","evy":"application/envoy","exe":"application/octet-stream","fif":"application/fractals","flr":"x-world/x-vrml","gif":"image/gif","gtar":"application/x-gtar","gz":"application/x-gzip","h":"text/plain","hdf":"application/x-hdf","hlp":"application/winhlp","hqx":"application/mac-binhex40","hta":"application/hta","htc":"text/x-component","htm":"text/html","html":"text/html","htt":"text/webviewhtml","ico":"image/x-icon","ief":"image/ief","iii":"application/x-iphone","ins":"application/x-internet-signup","isp":"application/x-internet-signup","jfif":"image/pipeg","jpe":"image/jpeg","jpeg":"image/jpeg","jpg":"image/jpeg","js":"application/x-javascript","latex":"application/x-latex","lha":"application/octet-stream","lsf":"video/x-la-asf","lsx":"video/x-la-asf","lzh":"application/octet-stream","m13":"application/x-msmediaview","m14":"application/x-msmediaview","m3u":"audio/x-mpegurl","man":"application/x-troff-man","mdb":"application/x-msaccess","me":"application/x-troff-me","mht":"message/rfc822","mhtml":"message/rfc822","mid":"audio/mid","mny":"application/x-msmoney","mov":"video/quicktime","movie":"video/x-sgi-movie","mp2":"video/mpeg","mp3":"audio/mpeg","mpa":"video/mpeg","mpe":"video/mpeg","mpeg":"video/mpeg","mpg":"video/mpeg","mpp":"application/vnd.ms-project","mpv2":"video/mpeg","ms":"application/x-troff-ms","mvb":"application/x-msmediaview","nws":"message/rfc822","oda":"application/oda","p10":"application/pkcs10","p12":"application/x-pkcs12","p7b":"application/x-pkcs7-certificates","p7c":"application/x-pkcs7-mime","p7m":"application/x-pkcs7-mime","p7r":"application/x-pkcs7-certreqresp","p7s":"application/x-pkcs7-signature","pbm":"image/x-portable-bitmap","pdf":"application/pdf","pfx":"application/x-pkcs12","pgm":"image/x-portable-graymap","pko":"application/ynd.ms-pkipko","pma":"application/x-perfmon","pmc":"application/x-perfmon","pml":"application/x-perfmon","pmr":"application/x-perfmon","pmw":"application/x-perfmon","pnm":"image/x-portable-anymap","pot":"application/vnd.ms-powerpoint","ppm":"image/x-portable-pixmap","pps":"application/vnd.ms-powerpoint","ppt":"application/vnd.ms-powerpoint","prf":"application/pics-rules","ps":"application/postscript","pub":"application/x-mspublisher","qt":"video/quicktime","ra":"audio/x-pn-realaudio","ram":"audio/x-pn-realaudio","ras":"image/x-cmu-raster","rgb":"image/x-rgb","rmi":"audio/mid","roff":"application/x-troff","rtf":"application/rtf","rtx":"text/richtext","scd":"application/x-msschedule","sct":"text/scriptlet","setpay":"application/set-payment-initiation","setreg":"application/set-registration-initiation","sh":"application/x-sh","shar":"application/x-shar","sit":"application/x-stuffit","snd":"audio/basic","spc":"application/x-pkcs7-certificates","spl":"application/futuresplash","src":"application/x-wais-source","sst":"application/vnd.ms-pkicertstore","stl":"application/vnd.ms-pkistl","stm":"text/html","svg":"image/svg+xml","sv4cpio":"application/x-sv4cpio","sv4crc":"application/x-sv4crc","swf":"application/x-shockwave-flash","t":"application/x-troff","tar":"application/x-tar","tcl":"application/x-tcl","tex":"application/x-tex","texi":"application/x-texinfo","texinfo":"application/x-texinfo","tgz":"application/x-compressed","tif":"image/tiff","tiff":"image/tiff","tr":"application/x-troff","trm":"application/x-msterminal","tsv":"text/tab-separated-values","txt":"text/plain","uls":"text/iuls","ustar":"application/x-ustar","vcf":"text/x-vcard","vrml":"x-world/x-vrml","wav":"audio/x-wav","wcm":"application/vnd.ms-works","wdb":"application/vnd.ms-works","wks":"application/vnd.ms-works","wmf":"application/x-msmetafile","wps":"application/vnd.ms-works","wri":"application/x-mswrite","wrl":"x-world/x-vrml","wrz":"x-world/x-vrml","xaf":"x-world/x-vrml","xbm":"image/x-xbitmap","xla":"application/vnd.ms-excel","xlc":"application/vnd.ms-excel","xlm":"application/vnd.ms-excel","xls":"application/vnd.ms-excel","xlt":"application/vnd.ms-excel","xlw":"application/vnd.ms-excel","xof":"x-world/x-vrml","xpm":"image/x-xpixmap","xwd":"image/x-xwindowdump","z":"application/x-compress","zip":"application/zip"
};
//根据扩展名获取Content-Type
var getContentType = function(extentision){
	if(extentision!=null && typeof(extentision)=="string" && extentision.length>0){
		var ext = extentision;
		var type = eval('extMap.'+ext);
		return type;
	}
}

var checkIsFileOrFolder = function(curName){
	if(curName=="dir" || curName=="ls"){
		return "folder";
	}else{
		var fs = require('fs');
		var info = null;
		try{
			info = fs.statSync(basePath+"/"+curName);
		}catch(e){
			writeLog(e);
		}
		if(info!=null){
			if(info.isFile()){
				return "file";
			}else{
				return "folder";
			}
		}
	}
}

//curName可能是："dir","ls","doc/kms.pdf"
var getChildFileList = function(curName){
	var fs = require("fs");
	var list = null;
	try{
		var name = (curName==null || curName.length==0)?"":"/"+curName;
		list = fs.readdirSync(basePath+name);
	}catch(e){
		writeLog(e);
	}
	//console.log(list);
	if(list!=null){
		return list;
	}else{
		return [];
	}
}

var formatSize = function(size){
	var _1M = 1024*1024;
	if(size>_1M){
		return (size/_1M).toFixed(2)+"MB";
	}else if(size>0){
		return (size/1014).toFixed(2)+"KB";
	}else{
		return "";//空文件夹
	}
}

var getParentFilePath = function(fileName){
	if(fileName=="dir" || fileName=="ls"){
		return "/";
	}else if(fileName==null || fileName==""){
		return "/";
	}else{
		var p = fileName.lastIndexOf("/");
		if(p>0){
			return "/"+fileName.substring(0,p);
		}else{
			return "/dir";
		}
	}
}

var genFileListHTML = function(parentPath,list){
	//console.log("parentPath=",parentPath,"list=",list);
	var html ="<body onload='onLoad();' >";
	html = html + "<table id='id_tb_content_list' class='tb_custom' cellspacing='0px' cellpadding='0px'>\n<tr type='title' ><th align='center' onclick='sortByName();' >名称</th><th align='center' onclick='sortBySize();' >大小</th><th align='center' onclick='sortByDate();' >修改日期</th></tr>\n";
	html = html +"<tr type='upper' ><td style='padding-left:10px;padding-right:10px;'><a class=\"css-up icon\" href=\""+encodeURI(getParentFilePath(parentPath))+"\">[上级目录]</a></td><td></td><td></td></tr>";
	var fs = require("fs");
	var folderHtmlArr = [];
	var filesHtmlArr = [];
	for (var i = 0;i<list.length;i++) {
		var e = list[i];
		var name = e;
		var info =null;
		try{
			var pp = (parentPath==null || parentPath.length==0)?"":"/"+parentPath;
			info = fs.statSync(basePath+pp+"/"+e);
			var size = formatSize(info.size);
			var dd = formatDate(info.mtime);
			var isFile = info.isFile();
			var css = isFile==true?"css-file":"css-folder";
			var link = "<a class=\""+css+" icon\" href=\""+encodeURI(pp+"/"+name)+"\">"+name+"</a>";
			var htm =  "<tr type='list' onmouseover=\"{style.backgroundColor='#FFFBD1';}\" onmouseout=\"{style.backgroundColor='';}\"><td>"+link+"</td><td size='"+info.size+"' >"+size+"</td><td millions='"+info.mtime.getTime()+"'>"+dd+"</td></tr>";
			if(isFile){
				filesHtmlArr.push(htm);
			}else{
				folderHtmlArr.push(htm);
			}
		}catch(e){
			writeLog(e);
		};
	}
	html = html + folderHtmlArr.join("\n")+filesHtmlArr.join("\n") +"</table></body>";
	return html;
}

//创建服务器
var createServer = function (){
	var write404HTML = function(res){
		res.writeHead(404,{'Content-Type': 'text/html;charset=UTF-8'});
		res.write("<!DOCTYPE html><html><head><meta charset='utf-8'><title>404</title></head><body><h1>404 Not Found</h1></body></html>");
	}
	var http = require('http');
	http.createServer(function(req, res){
		currentIpAddress = getClientIp(req);
		var u = decodeURI(req.url);
		writeLog("请求地址:"+u,currentIpAddress);
		if(u=="/"){
			//载入主页
			res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
			var str = "";
			try{
				str = readIndexData();
			}catch(e){
				writeLog(e);
				str = "服务器发生异常";
			}
			res.end(str);
		}else if(u=="/ls" || u=="/dir"){
			//输出目录
			var list = getChildFileList();
			var html = genFileListHTML("",list);
			res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
			res.end("<!DOCTYPE html><html>"+getIndexHeadHtml()+html+"</html>");
		}else{
			//var url = require('url');
			//var util = require('util');
			//console.log(util.inspect(url.parse(req.url, true)));
			var fileName = getFileName(u);
			if(fileName!=null && fileName.length>0){
				var type = checkIsFileOrFolder(fileName);
				if(type=="file"){
					var exten = getFileExtentision(fileName);
					console.log("fileName="+fileName);
					console.log("exten="+exten);
					var contentType = getContentType(exten);
					if(contentType!=null){
						res.writeHead(200,{'Content-Type':contentType});
					}
					//二进制形式读取
					var flag = openAndReadFileToResponse(fileName,res);
					if(flag){
						res.end();
						return;
					}else{
						write404HTML(res);
					}
				}else if(type=="folder"){
					var list = getChildFileList(fileName);
					var html = genFileListHTML(fileName,list);
					res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
					res.end("<!DOCTYPE html><html>"+getIndexHeadHtml()+html+"</html>");
					return;
				}else{
					write404HTML(res);
				}
			}
			res.end();
		}
	}).listen(port);
	writeLog("服务器已启动,端口号:"+port);
}

function getClientIp(req) {
    var ipAddress;
    var forwardedIpsStr = req.headers['x-forwarded-for']; 
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};

process.on('uncaughtException', function(err){
	writeLog(err);
}); 

//相当于main方法
createServer();

const http = require('http');
const fs = require('fs');
// const path = require('path');
// const { execSync } = require('child_process');
const qs = require('qs')
const ppt = require('./generate')

const server = http.createServer((req, res) => {
    console.log(req.url);
    console.log(req.method);
    var url = req.url;
    // 如果是下载文件的URL，则判断进行处理
    if (req.method === 'GET') {
        // 提取文件名hello.txt
        console.log("request PPT")
        var name = url.substring(url.lastIndexOf('/')+1);
        // 创建可读流，读取当前项目目录下的hello.txt文件
        var rs = fs.createReadStream(__dirname + "/ppt/" + name);
        console.log('filepath :' ,__dirname + "/ppt/" + name);
        // 设置响应请求头，200表示成功的状态码，headers表示设置的请求头
        res.writeHead(200, {
            'Content-Type': 'application/force-download',
            'Content-Disposition': 'attachment; filename=' + name
        });
        // 将可读流传给响应对象response
        rs.pipe(res);
    }

    else {
        // POST
        // generate PPT
        var body = "";
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            // 解析参数
            body = qs.parse(body);
            // 设置响应头部信息及编码
            // res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
            // use wx APP user's openid as file URL
            // var filepath = body._openid;
            // console.log(filepath)
            ppt.generatePPT(body);
            // res.write(filepath);
            // res.end();
        })
    }
});

server.listen(9000, () => {
    console.log("114.115.244.162:9000")
    // console.log(clc.green.underline('http://localhost:9000/'));
    // console.log(clc.green.underline('http://127.0.0.1:9000/'));
});
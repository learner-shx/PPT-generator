// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    
    var request = require('request');
    var _openid = event._openid;
  
    request({
        // G means generate PPT
        url:'http://114.115.244.162:9000/' + _openid,
        method : 'GET',
        json: true,
        headers: 
        {
            "content-type": 'text/html; charset=utf8',
        },
        form : 
        {        
            _openid : _openid,
        }
        }
        , function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(response)
        }
    })
    return "over";
}
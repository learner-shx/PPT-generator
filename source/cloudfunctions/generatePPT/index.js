// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  var request = require('request');

  var description = event.description;
  var template = event.template;
  var _openid = event._openid;

  request({
      // G means generate PPT
      url:'http://114.115.244.162:9000/',
      method : 'POST',
      json: true,
      headers: 
      {
          "content-type": 'text/html; charset=utf8',
      },
      form : 
      {        
          description: description,
          template: template,
          _openid : _openid,
      }
      }
      , function (error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body) // Show the HTML for the baidu homepage.
      }
  })
  return "ok";
}
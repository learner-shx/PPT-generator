const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}


const formatDate = date => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return month + "月" +  day + "日"
}


function getUserInfoFromOpenid(_openid) {
  var user_info = {}
  wx.cloud.database().collection('user').where({
    _openid : _openid
  }).get({
    success(res) {
      user_info._openid = res.data[0]._openid
      user_info.userName = res.data[0].userName
      user_info.avatarUrl = res.data[0].avatarUrl
    }
  })
  return user_info;
}




function getUsersInfoFromOpenids(_openids) {
  var users_info = []
  const _ = wx.cloud.database().command;
  console.log(_openids)
  wx.cloud.database().collection('user').where({
    _openid : _.in(_openids)
  }).get({
    success(res) {
      console.log(res)
      for(var i = 0; i<res.data.length;i++) {
        var msg = {}
        var user_info = res.data[i];
        msg._openid = user_info._openid;
        msg.userName = user_info.userName;
        msg.avatarUrl = user_info.avatarUrl;
        users_info.push(msg);
      }
    }
  })
  return users_info
}


module.exports = {
  formatTime,
  formatDate,
  getUserInfoFromOpenid,
  getUsersInfoFromOpenids
}

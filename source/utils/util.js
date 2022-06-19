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

const getUserInfoFromOpenid = _openid => {

  wx.cloud.database().collection('user').where({
    _openid : _openid
  }).get({
    success(res) {
      console.log(res.data)
      var user_info = {}
      user_info._openid = _openid;
      user_info.userName = res.data.userName;
      user_info.avatarUrl = res.data.avatarUrl;
      return;
    }
  })
  return 1;
}


module.exports = {
  formatTime,
  formatDate,
  getUserInfoFromOpenid
}

// app.js
App({
  
  onLaunch() {
    wx.cloud.init({
      //env:"kamilu-3g69c1hh0c963d36"
      env : "kamilu-3g69c1hh0c963d36"
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: ""
  }
})

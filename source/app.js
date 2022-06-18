// app.js
App({
  
  onLaunch() {

    // var c1 = new wx.cloud.Cloud({
    //   // 资源方 AppID
    //   resourceAppid: 'wxe42ef4ce16840812',
    //   // 资源方环境 ID
    //   resourceEnv: 'kamilu-3g69c1hh0c963d36',
    // })

    // await c1.init()
    wx.cloud.init({
      env : "kamilu-3g69c1hh0c963d36"
    })
    if(wx.getStorageSync('userInfo')) {
      this.globalData.userInfo = wx.getStorageSync('userInfo')
    }
  },
  globalData: {
    userInfo: null,
  }
})

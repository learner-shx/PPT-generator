// app.js
App({
  
  onLaunch() {
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

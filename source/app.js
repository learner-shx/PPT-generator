// app.js

const app = getApp();

App({

  onLaunch() {

    wx.cloud.init({
      env: "cloud1-9gv9ynmtc4528521"
    })

    if (wx.getStorageSync('userInfo')) {
      this.globalData.userInfo = wx.getStorageSync('userInfo')
    }
  },
  globalData: {
    userInfo: null,
    information_info: null
  }
})

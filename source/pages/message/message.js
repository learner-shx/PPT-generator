
const app = getApp();

Page({

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo
    })

    getNewMessage();
  },

  getNewMessage() {

    var that = this;
    wx.cloud.database().collection('message').where({
      _openid: app.globalData.userInfo._openid
    }).get({
      success: res => {
        that.setData({
          message: res.data
        })
      }
    })
  }

})
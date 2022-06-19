
const app = getApp();

Page({

  onShow() {
    this.getMessages();
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo,
      message_users_info : [] // 与本用户发送信息的其他用户信息
    })

    this.getMessages();
    this.getMessageUsersInfo();
  },

  getMessages() {

    var that = this;
    const DB = wx.cloud.database().command;
    wx.cloud.database().collection('message').where(
      DB.or([
        {
            userA_openid: that.data.userInfo._openid,
            A_is_visable: true
        },
        {
            userB_openid: that.data.userInfo._openid,
            B_is_visable: true
        }
    ])
    ).get({
      success: res => {
        that.setData({
          message: res.data
        })
      }
    })
  }
})
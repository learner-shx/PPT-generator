
const app = getApp();
const utils = require("../../utils/util");

Page({

  onShow() {
    if (app.globalData.userInfo != null) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
      this.getMessages()
    }
  },

  onLoad() {
  },


  getMessages() {

    var that = this;
    const DB = wx.cloud.database().command;
    wx.cloud.database().collection('message').where(
      DB.or([
        {
          userAInfo: {
            _openid: this.data.userInfo._openid
          }
        },
        {
          userBInfo: {
            _openid: this.data.userInfo._openid
          }
        }
      ])
    ).watch({
      onChange: function (snapshot) {
        snapshot.docs.sort(utils.sortByProp('last_send_time', 'des'))
        console.log(snapshot.docs)
        that.setData({
          messages: snapshot.docs
        })
      },
      onError: function (err) {
        console.log(err)
      }
    })
  },
  startChat(e) {
    var index = e.currentTarget.dataset.index;
    var chat_id = this.data.messages[index]._id;
    wx.navigateTo({
      url: '../chat/chat?chat_id=' + chat_id,
    })
  }


})

const app = getApp();

Page({

  onShow() {

  },

  onLoad() {

    this.setData({
      userInfo: app.globalData.userInfo,
    })
    this.getMessages()
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
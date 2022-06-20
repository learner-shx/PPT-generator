// pages/hall/requirement/requirement.js
var interstitialAd = null;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    requirement: [],
    about: "none",
    call: "",
  },


  onLoad: function (option) {
    wx.showLoading({
      title: '数据加载中...',
    });

    var that = this;
    this.setData({
      userInfo: app.globalData.userInfo,
      requirement_id: option.id,
      requirement_status : false
    })

    // 获取到该 id 对应的悬赏信息
    wx.cloud.database().collection('requirement').doc(this.data.requirement_id).get({
      success: function (res) {
        console.log(res)
        // res.data 包含该记录的数据
        that.setData({
          requirement: res.data
        })
      }
    })
    wx.hideLoading(); //隐藏正在加载中

  },
  preview(e) {
    console.log(e)
    let currentUrl = e.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.requirement.picList
    })
  },


  sendMessage() {
    if (this.data.userInfo._openid == this.data.requirement._openid) {
      wx.showModal({
        title: "警告", // 提示的标题
        content: "不能和自己发信息", // 提示的内容
        showCancel: false, // 是否显示取消按钮，默认true
        cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
        confirmText: "确定", // 确认按钮的文字，最多4个字符
        confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      })
      return;
    }

    console.log("receive the reward")
    var that = this;
    const DB = wx.cloud.database().command;
    wx.cloud.database().collection('message').where(
      DB.or([
        {
            userAInfo : {
              _openid : that.data.userInfo._openid
            },
            userBInfo : {
              _openid : that.data.requirement._openid
            }
        },
        {
          userBInfo : {
            _openid : that.data.userInfo._openid
          },
          userAInfo : {
            _openid : that.data.requirement._openid
          }
        }
    ])
    ).get({
      success(res) {
        console.log(res.data)
        if (res.data.length == 0) {
          console.log("never build message connection before")
          wx.cloud.database().collection("message").add({
            data: {
              userAInfo: that.data.userInfo,
              userBInfo: {
                _openid : that.data.requirement._openid,
                userName : that.data.requirement.userName,
                avatarUrl : that.data.requirement.avatarUrl
              },
              message_type : true, // true 为用户消息
              A_is_visable : true,
              B_is_visable : true,
              message_list : []
            },
            success(ress) {
              console.log(ress)
              var chat_id = ress._id;
              wx.navigateTo({
                url: '../../chat/chat?chat_id=' + chat_id,
              })
            }
          })
        } else {
          console.log("aleady build message connection before")
          var chat_id = res.data[0]._id;
          console.log(res.data)
          wx.navigateTo({
            url: '../../chat/chat?chat_id=' + chat_id,
          })
        }
      }
    })
  },

  receiveReq() {
    // 接悬赏
    var that = this;

    wx.cloud.database().collection('requirement').doc(this.data.requirement_id).update({
      data : {
        status : "received"
      },
      success(res) {
        console.log(res);
        that.setData({
          requirement_status : true
        })
      }
    })

    wx.showModal({
      title: "通知", // 提示的标题
      content: "悬赏已被接取", // 提示的内容
      showCancel: false, // 是否显示取消按钮，默认true
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
    })
  }
})
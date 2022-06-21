// pages/hall/requirement/requirement.js
var interstitialAd = null;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    information: [],
    about: "none",
    call: "",
  },


  onLoad: function (option) {
    
    
    this.setData({
      userInfo: app.globalData.userInfo,
      information_id: option.id
    })
    this.loadInformation()
  },

  loadInformation() {
    var that = this;
    wx.showLoading({
      title: '数据加载中...',
    });
    // 获取到该 id 对应的悬赏信息
    wx.cloud.database().collection('information').doc(this.data.information_id).get({
      success: function (res) {
        console.log(res)
        // res.data 包含该记录的数据
        that.setData({
          information: res.data
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
              _openid : that.data.information._openid
            }
        },
        {
          userBInfo : {
            _openid : that.data.userInfo._openid
          },
          userAInfo : {
            _openid : that.data.information._openid
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
                _openid : that.data.information._openid,
                userName : that.data.information.userName,
                avatarUrl : that.data.information.avatarUrl
              },
              message_type : true, // true 为用户消息, false 为系统消息
              message_list : [],
              last_send_time : wx.cloud.database().serverDate()
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


})
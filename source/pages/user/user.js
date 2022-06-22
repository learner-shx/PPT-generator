// miniprogram/pages/user/user.js
const utils = require("../../utils/util")
const app = getApp()

Page({
  data: {
    userName: "",
    avatarUrl: "",
    db: {},
    email: "未填写",
    call: "未填写",
    userInfo: {},
    about: "none",
    imageBase64: [],
    information_info: {},
    requirements: {}
  },
  onShow() {


    wx.cloud.database().collection('requirement').where({ //数据查询
      _openid: app.globalData.userInfo._openid //条件
    }).get({
      success: function (res) {
        console.log(res.data)
        requirements = wx.setStorageSync('requirements',res.data)
      }
    })

    this.setData({
      information_info: wx.getStorageSync('information_info'),
      requirements: wx.getStorageSync('requirements')
    })

    if (app.globalData.userInfo!=null) {
      console.log('reload user information')
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo
      })
      var that = this;

      wx.cloud.database().collection('user').where({ //数据查询
        _openid: app.globalData.userInfo._openid //条件
      }).get({
        success: function (res) {
          that.setData({
            avatarUrl: res.data[0].avatarUrl,
            userName: res.data[0].userName,
            email: res.data[0].email,
            call: res.data[0].call,
            user_type: res.data[0].user_type
          })
        }
      })


    }
    
  },

  reqContent(e) {
    console.log(e)
    var option = this.data.requirements[e.currentTarget.dataset.index]._id
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
      url: "../hall/reqContent/reqContent?id=" + option
    })

  },

  getUserProfile(e) {

    var that = this;
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        that.setData({
          userName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })
        console.log(res.userInfo)
        app.globalData.userInfo = res.userInfo

        // 数据库提交结束

        wx.cloud.callFunction({
          name: "login",
          data: {},
          success: res => {
            console.log(res.result.userInfo.openId)
            // 拿到用户的OpenId
            app.globalData.userInfo._openid = res.result.userInfo.openId
            that.setData({
              userInfo: app.globalData.userInfo,
            })

          },
          fail: function (res) {
            console.log(res)
          }
        })

        // 在数据库中查询此openid，如果没有那么新建用户，否则按原用户登录

        wx.cloud.database().collection('user').where({
          _openid: app.globalData.userInfo._openid
        }).get({
          success(res) {
            if (res.data.length == 0) {
              // 没有搜索到则新建用户
              app.globalData.userInfo.user_type = false;
              wx.cloud.database().collection('user').add({
                // data 字段表示需新增的 JSON 数据

                data: {
                  userName: app.globalData.userInfo.nickName,
                  avatarUrl: app.globalData.userInfo.avatarUrl,
                  email: "未填写",
                  call: "未填写",
                  user_type: false
                },
              })
            } else {
              app.globalData.userInfo = res.data[0]
            }
            wx.setStorageSync('userInfo', app.globalData.userInfo);
          }
          
        })

      }
    })

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  },
  onLoad() {
    if (wx.getStorageSync('userInfo')) {
      console.log("get storage userInfo")
      wx.showLoading({
        title: '数据加载中...',
      });
      app.globalData.userInfo = wx.getStorageSync('userInfo');
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo
      })
      var that = this;

      wx.cloud.database().collection('user').where({ //数据查询
        _openid: app.globalData.userInfo._openid //条件
      }).get({
        success: function (res) {
          that.setData({
            avatarUrl: res.data[0].avatarUrl,
            userName: res.data[0].userName,
            email: res.data[0].email,
            call: res.data[0].call,
            user_type: res.data[0].user_type
          })
        }
      })

      wx.cloud.database().collection('requirement').orderBy('uploadTime', 'desc').where({ //数据查询
        _openid: this.data.openid //条件
      }).get({
        success: function (res) {
          wx.hideLoading(); //隐藏正在加载中
          requirements = setStorageSync("requirements",res.data)
        }
      });
    }
  }
})
// miniprogram/pages/user/user.js
const utils = require("../../utils/util")
const app = getApp()

Page({
  data: {
    userName: "",
    avatarUrl: "",
    db: {},
    email:"",
    call:"",
    userInfo: {},
    about: "none",
    imageBase64:[]

  },

  getUserProfile(e) {
    var that = this;
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        
        // 数据库提交开始
        that.setData({
          userName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })

        app.globalData.userInfo = res.userInfo
        
        // 数据库提交结束
        
        wx.cloud.callFunction({
          name: "login",
          data : {},
          success: res => {
            //   console.log('[云函数] [login] user openid: ', res.result.openid)          
            // this.setData({
            //    openId:res.result.openid
            //  })
            console.log(res.result.userInfo.openId)
            // 拿到用户的OpenId
            app.globalData.userInfo._openid = res.result.userInfo.openId
            wx.setStorageSync('userInfo', app.globalData.userInfo);
          },
          fail: function(res) {
            console.log(res)
          }
        })
        
        // 在数据库中查询此openid，如果没有那么新建用户，否则按原用户登录

        wx.cloud.database().collection('user').where({
          _openid : app.globalData.userInfo._openid
        }).get({
          success(res) {
            console.log(res)
            if(res.data.length==0) {
              // 没有搜索到则新建用户
              wx.cloud.database().collection('user').add({
                // data 字段表示需新增的 JSON 数据
      
                data: {
                  userName: app.globalData.userInfo.nickName,
                  avatarUrl: app.globalData.userInfo.avatarUrl,
                  email: "未填写",
                  call: "未填写"
                },
              })
            }
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
      wx.showLoading({
        title: '数据加载中...',
      });
      app.globalData.userInfo = wx.getStorageSync('userInfo');
      var that = this;

      wx.cloud.database().collection('user').where({ //数据查询
        _openid: app.globalData.userInfo._openid //条件
      }).get({
        success: function (res) {
          that.setData({
            avatarUrl: res.data[0].avatarUrl,
            userName: res.data[0].userName,
            email: res.data[0].email,
            call: res.data[0].call
          })
        }
      })
    }
    var arr=[];//暂存图片base64编码
    //提取用户发布的物品信息
    
    wx.cloud.database().collection('requirement').where({ //数据查询
      _openid: this.data.openid //条件
    }).get({
      success: function (res) {
        // res.data 包含该记录的数据
        let length=res.data.length>3? 3:res.data.length;
        for(let i=0;i<length;i++){
          arr.push(res.data[i])
        }
        that.setData({
          imageBase64:arr
        })
        wx.hideLoading(); //隐藏正在加载中
      }
    });
    //提取用户发布的物品信息结束
    var user_info = utils.getUserInfoFromOpenid(this.data.userInfo._openid)
    console.log(user_info)
  },

  showPop() {
    if (this.data.about === "none") {
      this.setData({
        about: "block"
      })
    } else {
      this.setData({
        about: "none"
      })
    }
  },

})
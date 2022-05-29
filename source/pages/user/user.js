// miniprogram/pages/user/user.js
Page({
  data: {
    userName: "",
    headImg: "",
    db: {},
    userinfo: {},
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
        wx.setStorageSync('userinfo', res.userInfo);
        // 数据库提交开始
        that.setData({
          userName: res.userInfo.nickName,
          headImg: res.userInfo.avatarUrl,
          home: res.userInfo.city
        })

        const db = wx.cloud.database({
          env: "cloud1-9gv9ynmtc4528521"
        });
        // 这里可能
        db.collection('user').add({
          // data 字段表示需新增的 JSON 数据

          data: {
            userName: res.userInfo.nickName,
            headImg: res.userInfo.avatarUrl,
            home: res.userInfo.city,
            email: "未填写",
            call: "未填写"
          },
        })
        // 数据库提交结束

        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.cloud.callFunction({
              name: 'login',
              data: {},
              success: res => {
                //   console.log('[云函数] [login] user openid: ', res.result.openid)          
                // this.setData({
                //    openId:res.result.openid
                //  })
                wx.setStorageSync('openId', res);
                wx.reLaunch({ 
                  url: "../index/index"
                })
              }
            });
          }
        })

      }
    })
    //获取用户openid
    // //获取用户openid 结束
    // const {
    //   userInfo
    // } = e.detail;
    // wx.setStorageSync('userinfo', userInfo);
    // const userinfo = wx.getStorageSync('userinfo');
    // this.setData({
    //   userinfo
    // });
    // console.log(e);


  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  },
  onLoad() {
    if (wx.getStorageSync('userinfo')) {
      wx.showLoading({
        title: '数据加载中...',
      });

      const userinfo = wx.getStorageSync('userinfo');
      wx.login({
        //成功放回
        success:(res)=>{
          console.log(res);
          let code=res.code
          wx.request({
          url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx1037e76df21d68a4&secret=bc448ec45feb608fc375463829712980&js_code=${code}&grant_type=authorization_code`,
            success:(res)=>{
              // console.log(res);
              userInfo.openid=res.data.openid
              //获取到你的openid
              // console.log(userInfo.openid);
              this.setData({
                userinfo,
                openid:userInfo.openid
                
                // openid:wx.getStorageSync('openId').result.userInfo.openId
              });
              wx.setStorageSync('openId', res);
              var app = getApp();
              app.globalData.openid = this.data.openid;
            }
          })
        }
      })

      var that = this;
      const db = wx.cloud.database({ // 链接数据表
        env: "cloud1-9gv9ynmtc4528521"
      });
      db.collection('user').where({ //数据查询
        _openid: that.data.openid //条件
      }).get({
        success: function (res) {
          that.setData({
            headImg: res.data[0].headImg,
            userName: res.data[0].userName,
            email: res.data[0].email,
            call: res.data[0].call
          })
        }
      })
    }
    var arr=[];//暂存图片base64编码
    //提取用户发布的物品信息
    const db = wx.cloud.database({ // 链接数据表
      env: "cloud1-9gv9ynmtc4528521"
    });
    db.collection('requirements').where({ //数据查询
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
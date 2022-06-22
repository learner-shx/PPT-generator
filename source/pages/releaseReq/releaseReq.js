// pages/release/release.js
const utils = require("../../utils/util")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // PPT 悬赏相关变量
    imageBase64: "",
    describe: "",
    money: "",
    picList: [],
    countPic: 9,//上传图片最大数量
    showImgUrl: "", //路径拼接，一般上传返回的都是文件名，
    uploadImgUrl: '',//图片的上传的路径
    indexTitle: 0, //标题当前选择的下坐标
  },

  describe(e) {
    this.setData({
      describe: e.detail.value
    })
  },
  money(e) {
    this.setData({
      money: e.detail.value
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
          data : {},
          success: res => {
            console.log(res.result.userInfo.openId)
            // 拿到用户的OpenId
            app.globalData.userInfo._openid = res.result.userInfo.openId
            that.setData({
              userInfo : app.globalData.userInfo,
            })
            
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
            if(res.data.length==0) {
              // 没有搜索到则新建用户
              app.globalData.userInfo.user_type = false;
              wx.cloud.database().collection('user').add({
                // data 字段表示需新增的 JSON 数据
      
                data: {
                  userName: app.globalData.userInfo.nickName,
                  avatarUrl: app.globalData.userInfo.avatarUrl,
                  email: "未填写",
                  call: "未填写",
                  user_type : false
                },
              })
            } else {
              app.globalData.userInfo = res.data[0]
            }
            wx.setStorageSync('userInfo', app.globalData.userInfo);
            wx.navigateBack({
              delta: 1,
            })
          }
        })
        
      }
    })
    
  },

  submitButton() { //提交数据库

    if (utils.checkDesciptionValidity(this.data.describe) && utils.checkNumberValidity(this.data.money)) {
      console.log("pass check")
    } else return;

    var that = this;
    // 数据提交开始
    wx.cloud.database().collection('requirement').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _openid: wx.getStorageSync('openId').result.openid,会自动添加，不需要自己输入
        describe: that.data.describe,
        money: that.data.money,
        picList: that.data.picList,
        status: "unreceived",
        avatarUrl: that.data.userInfo.avatarUrl,
        userName: that.data.userInfo.userName,
        uploadTime: wx.cloud.database().serverDate(),
        acceptedUserList : [],
        acceptedWorkID : null
      },
      success: function (res) {
        wx.showModal({
          title: "提交成功", // 提示的标题
          content: "悬赏发布成功", // 提示的内容
          showCancel: false, // 是否显示取消按钮，默认true
          cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
          confirmText: "确定", // 确认按钮的文字，最多4个字符
          confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
          success(res){
            if(res.confirm){
              wx.switchTab({
                url: '../hall/hall',
              })
            }
          }
        })
        // 数据提交结束
        
      }
    })
  },


  myEventListener: function (e) {
    console.log("上传的图片结果集合")
    console.log(e.detail.picsList)
    this.setData({
      picList: e.detail.picsList
    })
  },

  uploadimg: function () {
    var that = this;
    wx.chooseImage({ //从本地相册选择图片或使用相机拍照
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //将图片变为base64编码
        // if (res.tempFilePaths[0].length <= 600) {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res1 => {
            //成功的回调
            if (res1.data.length > 500000) {
              wx.showModal({
                title: "图片太大", // 提示的标题
                content: "您上传的图片超过600KB，本站暂时未有自动压缩功能，可以自行发QQ或截屏，来进行人工压缩，感谢您的配合！",
                showCancel: true, // 是否显示取消按钮，默认true
                cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
                confirmText: "确定", // 确认按钮的文字，最多4个字符
                confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
                complete: function () { }
              })
            } else {
              var base64Image = res1.data.replace(/[\r\n]/g, '') // 后台返回的base64数据
              var imgData = base64Image.replace(/[\r\n]/g, '') // 将回车换行换为空字符''
              that.setData({
                imageBase64: imgData,
                //前台显示
                img: res.tempFilePaths
              })
              // console.log(that.data.imageBase64)
            }
          }
        })
      }
    })
  },

  onLoad() {
    if(app.globalData.userInfo!=null){
      this.setData({
        openid: app.globalData.userInfo._openid,
        userInfo: app.globalData.userInfo
      })
    }
    else {
      this.setData({
        openid: '',
        userInfo: app.globalData.userInfo
      })
    }
  },
})
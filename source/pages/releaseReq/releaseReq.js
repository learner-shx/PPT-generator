// pages/release/release.js
const utils = require("../../utils/util")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolPicker:["浙江纺织服装学院", "宁波大学", "宁波工程学院"],
    schoolId:"选712择",
    textHei: '10px',
    openid: "",
    countPic:9,//上传图片最大数量
    showImgUrl: "", //路径拼接，一般上传返回的都是文件名，
    uploadImgUrl:'',//图片的上传的路径
    indexTitle: 0, //标题当前选择的下坐标
    thing: [{
        str: "证件"
      },
      {
        str: "服饰"
      },
      {
        str: "数码"
      },
      {
        str: "日用品"
      },
      {
        str: "其他"
      },
    ],
    thingLocation: [{
        str: "本人代管"
      },
      {
        str: "拾取处"
      },
      {
        str: "其他"
      }
    ],
    // 失物招领发布变量
    imageBase64: "", //存储图片转换后的base64编码，用于上传
    addRess: "", //详细地址
    img: "", //物品图片地址
    remark: "", //备注信息
    nowLocation: "", //当前物品位置
    title: "", //失物招领的标题
    nowThing: "", //当前选中的类型
    offOn: 0, //用于判断是否开启验证信息

    // 寻物启事发布变量
    seekImageBase64: "", //寻物启事存储图片转换后的base64编码，用于上传
    seekNowThing: "", //寻物启事当前选中的类型
    seekTitle: "", //寻物启事当前填写的标题
    seekRemark: "", //寻物启事详细信息
    callOrVxIndex: 0, //寻物启事 填写是Vx还是手机号
    callOrVx: "", //寻物启事填写的weix或者手机号
    seekImg: "", //寻物启事的图片地址

    // PPT 悬赏相关变量
    imageBase64: "",
    describe: "",
    money:0,
    picList : []
  },

  schoolPicker(e){
    this.setData({
      schoolId: this.data.schoolPicker[e.detail.value]
    }) 
  },

  callOrVx(e) {
    this.setData({
      callOrVx: e.detail.value
    })
  },

  callOrVxIndex() {
    if (this.data.callOrVxIndex == 0) {
      this.setData({
        callOrVxIndex: 1
      })
    } else {
      this.setData({
        callOrVxIndex: 0
      })
    }
  },

  seekRemark(e) {
    this.setData({
      seekRemark: e.detail.value
    })
  },

  seekTitle(e) {
    this.setData({
      seekTitle: e.detail.value
    })
  },

  remark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  addRess(e) {
    this.setData({
      addRess: e.detail.value
    })
  },
  title(e) {
    this.setData({
      title: e.detail.value
    })
  },
  describe(e) {
    this.setData({
      describe : e.detail.value
    })
  },
  money(e) {
    this.setData({
      money : e.detail.value
    })
  },

  thing(e) {
    if (this.data.indexTitle == 0) {
      this.setData({
        nowThing: this.data.thing[e.currentTarget.dataset.index].str,
      })
    } else {
      this.setData({
        seekNowThing: this.data.thing[e.currentTarget.dataset.index].str,
      })
    }
  },
  Location(e) {
    this.setData({
      nowLocation: this.data.thingLocation[e.currentTarget.dataset.index].str,
    })
  },

  indexTitle1() {
    this.setData({
      indexTitle: 0
    })
  },
  indexTitle2() {
    this.setData({
      indexTitle: 1
    })
  },

  offOn() {
    this.setData({
      offOn: this.data.offOn == 0 ? 1 : 0
    })
  },

  submitButton() { //提交数据库
    if (this.data.describe && this.data.money) {
      var that = this;
      wx.showLoading({
        title: '数据加载中...',
      });
      // 数据提交开始

      wx.cloud.database().collection('requirement').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          // _openid: wx.getStorageSync('openId').result.openid,会自动添加，不需要自己输入
          describe: this.data.describe,
          money : this.data.money,
          picList : this.data.picList
        },
        success: function (res) {
          wx.hideLoading(); //隐藏正在加载中
          wx.showModal({
            title: "提交成功", // 提示的标题
            content: "感谢您的拾金不昧！", // 提示的内容
            showCancel: true, // 是否显示取消按钮，默认true
            cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
            confirmText: "确定", // 确认按钮的文字，最多4个字符
            confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
            complete: function () {
              wx.reLaunch({
                url: "../index/index"
              })
            }
          })
        }
      })
      // 数据提交结束

    } else {
      wx.showToast({
        title: "纺院社区：请勿留空", // 提示的内容
        icon: "none", // 图标，默认success
        image: "", // 自定义图标的本地路径，image 的优先级高于 icon
        duration: 1500, // 提示的延迟时间，默认1500
        mask: false, // 是否显示透明蒙层，防止触摸穿透
      })
    }
  },


  seekSubmitButton() {
    if (this.data.seekNowThing != "" && this.data.seekRemark != "" && this.data.seekTitle != "" && this.data.callOrVx != "") {
      var that = this;
      wx.showLoading({
        title: '数据加载中...',
      });
      // 数据提交开始

      wx.cloud.database().collection('seekThing').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          // _openid: wx.getStorageSync('openId').result.openid,会自动添加，不需要自己输入
          avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
          userName: wx.getStorageSync('userInfo').nickName,
          seekNowThing: this.data.seekNowThing,
          seekRemark: this.data.seekRemark,
          seekTitle: this.data.seekTitle,
          callOrVx: this.data.callOrVxIndex == 0 ? '微信' + this.data.callOrVx : '电话' + this.data.callOrVx,
          seekImageBase64: this.data.seekImageBase64,
          upshot: "丢失"
        },
        success: function (res) {
          wx.hideLoading(); //隐藏正在加载中
          wx.showModal({
            title: "提交成功", // 提示的标题
            content: "请将小程序分享给其他人，加快您找回物品的进度", // 提示的内容
            showCancel: true, // 是否显示取消按钮，默认true
            cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
            confirmText: "确定", // 确认按钮的文字，最多4个字符
            confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
            complete: function () {
              wx.reLaunch({
                url: "../index/index"
              })
            }
          })
        }
      })
      // 数据提交结束

    } else {
      wx.showToast({
        title: "纺院社区：请勿留空", // 提示的内容
        icon: "none", // 图标，默认success
        image: "", // 自定义图标的本地路径，image 的优先级高于 icon
        duration: 1500, // 提示的延迟时间，默认1500
        mask: false, // 是否显示透明蒙层，防止触摸穿透
      })
    }
  },
  /**

 * 上传图片

 */
  myEventListener:function(e){
    console.log("上传的图片结果集合")
    console.log(e.detail.picsList)
    this.setData({
      picList : e.detail.picsList
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
                complete: function () {}
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

  seekUploadimg: function () {
    var that = this;
    wx.chooseImage({ //从本地相册选择图片或使用相机拍照
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //将图片变为base64编码
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => {
            //成功的回调
            // console.log('data:image/png;base64,' + res.data)
            var base64Image1 = res.data.replace(/[\r\n]/g, '') // 后台返回的base64数据
            var imgData1 = base64Image1.replace(/[\r\n]/g, '') // 将回车换行换为空字符''
            // wx.compressImage({
            //   src1: imgData1,
            //   quality: 0,
            //   success: function (res) {}
            // })
            that.setData({
              seekImageBase64: imgData1
            })
            // console.log(that.data.imageBase64)
          }
        })
        //前台显示
        that.setData({
          seekImg: res.tempFilePaths
        })
      }
    })
  },

  onLoad() {
    this.setData({
      openid : app.globalData.userInfo._openid
    })
  },
  onShow() {
    this.setData({
      openid : app.globalData.userInfo._openid
    })
  }
})
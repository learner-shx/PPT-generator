// pages/hall/hall.js
const utils = require("../../utils/util")
var interstitialAd = null;
var searchTextStr="";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    seekShow: "", //寻物启事是否隐藏寻回的物品
    loseShow: "", //失物招领是否显示已认领的物品
    BgColor: "rgb(168, 168, 168)", //按钮初始背景
    buttonLeft: "8rpx", //按钮小圆圈的位置
    loseLength: [], //失物招领显示长度
    seekLength: [],
    indexTitle: 0, //标题当前选择的下坐标
    nowThing: "",
    lose: [], //失物招领标题
    requirements: [], // 需求标题
    describes:[],
    avatarUrl:[],
    userName:[],
  },

  thing(e) {
    if (this.data.nowThing != this.data.thing[e.currentTarget.dataset.index].str) {
      this.setData({
        nowThing: this.data.thing[e.currentTarget.dataset.index].str
      })
    } else {
      this.setData({
        nowThing: ""
      })
    }
  },

  goTop: function (e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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

  onShow: function () {
    // 显示插屏广告
    // if (interstitialAd) {
    //   interstitialAd.show().catch((err) => {
    //     console.error(err)
    //   })
    // }
  },

  search(e){
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
      url: "seach/seach?id=" + searchTextStr  
    })
  },

  searchText(e){
    console.log(e);
    // this.setData({
    //   searchTextStr:"23"
    // })
    searchTextStr=e.detail.value;
  },

  onLoad() {
    wx.showLoading({
      title: '数据加载中...',
    });



    var that = this;
    //提取用户发布的物品信息

    wx.cloud.database().collection('requirement').orderBy('uploadTime','desc').where({}).get({
      success: function (res) {
        console.log(res)
        let arr = []
        let ava = []
        let un = []
        // res.data 包含该记录的数据
        var length = res.data.length > 10 ? 10 : res.data.length;
        for (let i = 0; i < length; i++) {
          arr.push(res.data[i])

        }

        that.setData({
          requirements: arr,

        })
        
      }
    });

    //提取用户发布的寻物启事
    wx.cloud.database().collection('PPTMakerInfo').where({}).get({
      success: function (res) {
        let arr1 = []
        // res.data 包含该记录的数据
        var seeklength = res.data.seeklength > 10 ? 10 : res.data.length;
        for (let i = 0; i < seeklength; i++) {
          arr1.push(res.data[i])
        }
        that.setData({
          seek: arr1
        })
        wx.hideLoading(); //隐藏正在加载中
      }
    });
  },

  /**
   * 上拉触底事件
   */
  async onReachBottom() {
    var that = this;
    //提取用户发布的物品信息

    if (this.data.indexTitle == 0) {
      let length = await wx.cloud.database().collection('requirement').count();
      length = length.total;
      length = length >= (that.data.requirements.length + 10) ? that.data.requirements.length + 10 : length;
      let arr = that.data.requirements
      for (let i = that.data.requirements.length; i < length; i++) {
        if (i == that.data.requirements.length) {
          wx.showLoading({
            title: '数据加载中...',
          });
        }
        await wx.cloud.database().collection('requirement').skip(i).get({
          success: function (res) {
            arr.push(res.data[0])
            if (i == length - 1) {
              that.setData({
                requirements: arr
              })
              wx.hideLoading(); //隐藏正在加载中
            }
          }
        });
      }
    } else {
      let seeklength = await db.collection('PPTMakerInfo').count();
      seeklength = seeklength.total;
      seeklength = seeklength >= (that.data.seek.length + 10) ? that.data.seek.length + 10 : seeklength;
      let arr1 = that.data.seek
      for (let i = that.data.seek.length; i < seeklength; i++) {
        if (i == that.data.seek.length) {
          wx.showLoading({
            title: '数据加载中...',
          });
        }
        await db.collection('PPTMakerInfo').skip(i).get({
          success: function (res) {
            arr1.push(res.data[0])
            if (i == seeklength - 1) {
              that.setData({
                seek: arr1
              })
              wx.hideLoading(); //隐藏正在加载中
            }
          }
        });
      }
    }
  },

  reqContent(e) {
    if (this.data.indexTitle == 0) {
      var option = this.data.requirements[e.currentTarget.dataset.index]._id
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
        url: "reqContent/reqContent?id=" + option
      })
    } else {
      var option = this.data.seek[e.currentTarget.dataset.index]._id
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
        url: "seekContent/seekContent?id=" + option
      })
    }
  },

  showButton() {
    if (this.data.BgColor == "rgb(99, 255, 94)") {
      this.setData({
        BgColor: "rgb(168, 168, 168)",
        buttonLeft: "8rpx",
        loseShow: "",
        seekShow: ""
      })
    } else {
      this.setData({
        BgColor: "rgb(99, 255, 94)",
        buttonLeft: "110rpx",
        loseShow: "已认领",
        seekShow: "寻回"
      })
    }
  },
  receiveReq(e)
  {

  }
})
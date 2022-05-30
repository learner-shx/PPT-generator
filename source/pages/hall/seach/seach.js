// pages/hall/hall.js
var interstitialAd = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchText:"",
    seekShow: "", //寻物启事是否隐藏寻回的物品
    loseShow: "", //失物招领是否显示已认领的物品
    BgColor: "rgb(168, 168, 168)", //按钮初始背景
    buttonLeft: "8rpx", //按钮小圆圈的位置
    loseLength: [], //失物招领显示长度
    seekLength: [],
    indexTitle: 0, //标题当前选择的下坐标
    nowThing: "",
    lose: [], //失物招领标题
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



  onLoad(search) {
    this.setData({
        searchText:search.id
    })
    wx.showLoading({
      title: '数据加载中...',
    });



    var that = this;
    //提取用户发布的物品信息
    const db = wx.cloud.database({ // 链接数据表
      env: "test-5ghp2j4d337534cb"
    });
    db.collection('loseThing').where({}).get({
      success: function (res) {
        let arr = []
        // res.data 包含该记录的数据
        var length = res.data.length > 10 ? 10 : res.data.length;
        for (let i = 0; i < length; i++) {
          arr.push(res.data[i])
        }
        that.setData({
          lose: arr
        })
      }
    });

    //提取用户发布的寻物启事
    db.collection('seekThing').where({}).get({
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
    const db = wx.cloud.database({ // 链接数据表
      env: "test-5ghp2j4d337534cb"
    });
    if (this.data.indexTitle == 0) {
      let length = await db.collection('loseThing').count();
      length = length.total;
      length = length >= (that.data.lose.length + 10) ? that.data.lose.length + 10 : length;
      let arr = that.data.lose
      for (let i = that.data.lose.length; i < length; i++) {
        if (i == that.data.lose.length) {
          wx.showLoading({
            title: '数据加载中...',
          });
        }
        await db.collection('loseThing').skip(i).get({
          success: function (res) {
            arr.push(res.data[0])
            if (i == length - 1) {
              that.setData({
                lose: arr
              })
              wx.hideLoading(); //隐藏正在加载中
            }
          }
        });
      }
    } else {
      let seeklength = await db.collection('seekThing').count();
      seeklength = seeklength.total;
      seeklength = seeklength >= (that.data.seek.length + 10) ? that.data.seek.length + 10 : seeklength;
      let arr1 = that.data.seek
      for (let i = that.data.seek.length; i < seeklength; i++) {
        if (i == that.data.seek.length) {
          wx.showLoading({
            title: '数据加载中...',
          });
        }
        await db.collection('seekThing').skip(i).get({
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

  loseContent(e) {
    if (this.data.indexTitle == 0) {
      var option = this.data.lose[e.currentTarget.dataset.index]._id
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
        url: "../loseContent/loseContent?id=" + option
      })
    } else {
      var option = this.data.seek[e.currentTarget.dataset.index]._id
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
        url: "../seekContent/seekContent?id=" + option
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
  }
})
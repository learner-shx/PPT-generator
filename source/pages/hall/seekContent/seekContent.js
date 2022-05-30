// pages/hall/loseContent/loseContent.js
var interstitialAd = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seek:[],
    about:"none",
    call:"",
  },

  onShow: function () {
    // 显示插屏广告
    // if (interstitialAd) {
    //   interstitialAd.show().catch((err) => {
    //     console.error(err)
    //   })
    // }
  },

  onLoad: function (option) {
    wx.showLoading({
      title: '数据加载中...',
    });

    
    // 在页面中定义插屏广告
    // 创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-342153878bd3fbcc'
      })
      //捕捉错误
      interstitialAd.onError(err => {
        console.log(err);
      })
    }


    var that = this;
    this.setData({
      option: option.id
    })
    const db = wx.cloud.database({ // 链接数据表
      env: "test-5ghp2j4d337534cb"
    });
    db.collection('seekThing').where({ //数据查询
      _id: this.data.option //条件
    }).get({
      success: function (res) {
        that.setData({
          seek:res.data[0]
        })
      }
    })
    wx.hideLoading(); //隐藏正在加载中
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
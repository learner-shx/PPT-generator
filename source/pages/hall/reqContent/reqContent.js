// pages/hall/loseContent/loseContent.js
var interstitialAd = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lose:[],
    about:"none",
    call:"",
  },


  onLoad: function (option) {
    wx.showLoading({
      title: '数据加载中...',
    });

    var that = this;
    this.setData({
      option: option.id
    })
    const db = wx.cloud.database({ // 链接数据表
      env: "test-5ghp2j4d337534cb"
    });
    db.collection('loseThing').where({ //数据查询
      _id: this.data.option //条件
    }).get({
      success: function (res) {
        // res.data 包含该记录的数据
        that.setData({
          lose:res.data[0]
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
      var that = this;
      const db = wx.cloud.database({ // 链接数据表
        env: "test-5ghp2j4d337534cb"
      });
      db.collection('user').where({ //数据查询
        _openid: that.data.lose._openid //条件
      }).get({
        success: function (res) {
          that.setData({
            call: res.data[0].call
          })
        }
      })
    } else {
      this.setData({
        about: "none"
      })
    }
  },

})
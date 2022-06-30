const utils = require("../../utils/util")
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
      arr: [],
      movies: [{
          url: '../../images/Rotating/1.jpg'
        },
        {
          url: '../../images/Rotating/2.jpg'
        },
        {
          url: '../../images/Rotating/3.jpg'
        },
        {
          url: '../../images/Rotating/4.jpg'
        }
      ],
    },
  
    

    onLoad() {

      var that = this;
      wx.showLoading({
        title: '正在加载',
      })
      // console.log("hello")
      // wx.cloud.database().collection('announcement').add({
      //   data : {
      //     time : utils.formatDate(new Date()),
      //     content : "v0.0.1版本，极限验收"
      //   },
      //   success(res) {
      //     console.log(res)
      //   }
      // })
      wx.cloud.database().collection('announcement').get({
        success: function (res) {
          // console.log(res.data);
          that.setData({
            announcement : res.data
          })
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    },
  
    navigator() {
      wx.reLaunch({
        url: "../hall/hall"
      })
    },

    toGenerator() {
      wx.navigateTo({
        // url: '../getMD/getMD',
        url:'../generator/generator'
      })
    },

    toRequirement() {
      wx.navigateTo({
        url: '../releaseReq/releaseReq',
      })
    }
  })
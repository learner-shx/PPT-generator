const utils = require("../../utils/util")
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
      arr: [],
      movies: [{
          url: '../../images/Rotating/3.jpg'
        },
        {
          url: '../../images/Rotating/news.png'
        },
        {
          url: '../../images/Rotating/1.jpg'
        },
        {
          url: '../../images/Rotating/2.jpg'
        }
      ],
    },
  
    async onLoad() {
      var that = this;
      // console.log("hello")
      // wx.cloud.database().collection('announcement').add({
      //   data : {
      //     time : utils.formatDate(new Date()),
      //     content : "v0.0.1版本，初步开发"
      //   },
      //   success(res) {
      //     console.log(res)
      //   }
      // })
      wx.cloud.database().collection('announcement').get({
        success: function (res) {
          console.log(res.data);
          that.setData({
            announcement : res.data
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
        url: '../generator/generator',
      })
    },

    toRequirement() {
      wx.navigateTo({
        url: '../releaseReq/releaseReq',
      })
    }
  })
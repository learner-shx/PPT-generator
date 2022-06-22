// pages/hall/hall.js

const windowWidth = wx.getSystemInfoSync().windowWidth;


Page({
  /**
   * 页面的初始数据
   */
  data: {
    BgColor: "rgb(168, 168, 168)",
    indexTitle: 0,
    activeTab: 0,
    tabTitles: ["PPT悬赏", "PPT制作者"],
    bodyScrollLeft: 0,
    requirements: [],
    informations: [],
    pages: 1,
    offSetLeft : 0
  },

  preview(e) {
    console.log(e)
    let currentUrl = e.currentTarget.dataset.src
    let index = e.currentTarget.dataset.index
    console.log(index)
    console.log(this.data.requirements[index].picList)
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.requirements[index].picList
    })
  },

  selectTab: function (e) {
    console.log(e);
    //设置选中样式
    let toIndex = e.currentTarget.dataset.index;
    let fromIndex = this.data.activeTab;
    if (toIndex === fromIndex) {
      return;
    }
    let offSetLeft = e.currentTarget.offsetLeft;
    this.scrollTopBar(offSetLeft, toIndex);
    this.updatePage(fromIndex, toIndex);
  },
  /**
   * 更新展示页面及选中样式
   */
  updatePage: function (fromIndex, toIndex) {
    // body
    let bodyScrollLeft = toIndex * windowWidth;
    this.setData({
      activeTab: toIndex,
      bodyScrollLeft: bodyScrollLeft,
    });
  },
  /**
   * 自适应tabBar选中位置
   */
  scrollTopBar: function (offSetLeft, index) {
    let that = this;
    var nodeId = "#item-" + index;
    wx.createSelectorQuery().select(nodeId).boundingClientRect(function (rect) {
      console.log(rect)
      var res = wx.getSystemInfoSync();
      let targetOffSetLeft = offSetLeft - (res.windowWidth / 2) + (rect.width / 2);
      that.setData({
        scrollLeft: targetOffSetLeft
      });
    }).exec();
  },
  /**
   * 滑动停止
   */
  scrollEnded: function (e) {
    let that = this;
    wx.createSelectorQuery().select('#scroll-view-bodyId').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY']
    }, function (res) {
      let endIndex = Math.round(res.scrollLeft / windowWidth);
      that.updatePage(that.activeTab, endIndex);
      wx.createSelectorQuery().selectAll('.scroll-header-item-wraper').boundingClientRect(function (rects) {
        var offsetLeft = 0;
        for (var i = 0; i < endIndex; i++) {
          offsetLeft += rects[i].width;
        }
        console.log(offsetLeft);
        that.setData({
          offSetLeft : offsetLeft
        })
        that.scrollTopBar(offsetLeft, endIndex);
      }).exec();
    }).exec();
  },

  onShow: function () {
    this.setData({
      pages: 1
    })
    this.getRequirments()
    this.getInformations()
  },

  // 下拉刷新
  onPullDownRefresh: function () {

    this.getRequirments()
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    console.log("get the bottom")
    this.getRequirments();

  },



  onLoad() {
  },

  searchText(e) {
    console.log(e);
    // this.setData({
    //   searchTextStr:"23"
    // })
    searchTextStr = e.detail.value;
  },

  getRequirments() {

    wx.showLoading({
      title: '数据加载中...',
    });

    var that = this;
    var max_requirments_number = this.data.pages * 10
    // console.log(max_requirments_number)
    wx.cloud.database().collection('requirement').orderBy('uploadTime', 'desc').get({
      success: function (res) {
        let arr = []
        var length = res.data.length > max_requirments_number ? max_requirments_number : res.data.length;
        // 上拉加载，如果悬赏数多于 max_requirments_number， 说明需要刷新页面增加数量
        if (res.data.length > max_requirments_number) {
          that.data.pages = that.data.pages + 1;
        }
        // console.log(that.data.pages)
        for (let i = 0; i < length; i++) {
          arr.push(res.data[i])
        }

        that.setData({
          requirements: arr,
        })
      }
    });

    //提取用户发布的寻物启事
    wx.cloud.database().collection('PPTMakerInfo').get({
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
  getInformations() {

    wx.showLoading({
      title: '数据加载中...',
    });

    var that = this;
    var max_requirments_number = this.data.pages * 10
    // console.log(max_requirments_number)
    wx.cloud.database().collection('information').get({
      success: function (res) {

        console.log(res)
        let arr = []
        var length = res.data.length > max_requirments_number ? max_requirments_number : res.data.length;
        // 上拉加载，如果悬赏数多于 max_requirments_number， 说明需要刷新页面增加数量
        if (res.data.length > max_requirments_number) {
          that.data.pages = that.data.pages + 1;
        }
        // console.log(that.data.pages)
        for (let i = 0; i < length; i++) {
          arr.push(res.data[i])
        }

        that.setData({
          informations: arr,
        })
      }
    });

    //提取用户发布的寻物启事

  },
  reqContent(e) {
    console.log(e)
    var option = this.data.requirements[e.currentTarget.dataset.index]._id
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
      url: "reqContent/reqContent?id=" + option
    })

  },
  infContent(e) {
    console.log(e)
    var option = this.data.informations[e.currentTarget.dataset.index]._id
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）后续可以使用wx.navigateBack 可以返回;
      url: "infContent/infContent?id=" + option
    })

  },


  receiveReq(e) {

  }
})
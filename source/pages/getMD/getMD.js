// pages/getMD.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index : 0,
    title:[""],
    description:[""],
    isnull:true,
    finalMD:"",
  },
  handleInput(e) {
    var that = this;
    console.log(e)
    this.data.time = setTimeout(() => {
      if(e.target.id=="title"){
        that.data.title[e.target.dataset.index] = e.detail.value
      }
      else if(e.target.id=="description"){
        that.data.description[e.target.dataset.index] = e.detail.value
      }
      that.setData({
        title: that.data.title,
        description: that.data.description,
        index: that.data.index
      })
    }, 300)
},

nextpage(){
  this.data.description.push("")
  this.data.title.push("")
      this.setData({
        index:this.data.index+1,
        description:this.data.description,
        title:this.data.title
      })
      console.log(this.data.title.length);
      console.log(this.data.description.length);
},

getMD(){
  this.data.finalMD = ""
  for(var i=0;i<this.data.description.length;i=i+1)
    this.data.finalMD =this.data.finalMD+'#'+this.data.title[i]+'\n\n'+this.data.description[i]+'\n\n'
  wx.showModal({
    content: this.data.finalMD,
    cancelColor: 'cancelColor',
  })

},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
console.log(options)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
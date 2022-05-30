var app= getApp()
Page({

  /**
   * 页面的初始数据
   * navto : 是否去选择分类
   * 
   */
  data: {

    title : "",
    description : "",
    price: "",
    type: {
      name: "PPT类型",
      code : ""
    },

    phoneNum : "",
    qqNum : "",
    wxId : "",
    btncolor: "#AEAEAE",
    canSub : false,
    navto : false,
    limit : [{
      beyondStyle: "#9494A2",
      current : 0,
      maxlength : 15
    },{
      beyondStyle: "#9494A2",
      current : 0,
      maxlength : 200
    }] ,
    autoload : 1
  },
  selectSch: function(){
    var that = this
    wx.showActionSheet({
      itemList: ['商务PPT','演讲PPT','其他PPT'],
      success: function(res){
        var sch = ""
        switch(res.tapIndex){
          case 0 : that.data.type.name="商务PPT";that.data.type.code="0";break;
          case 1: that.data.type.name = "演讲PPT"; that.data.type.code = "1";break;
          case 2: that.data.type.name = "其他PPT"; that.data.type.code = "2";break;
          default: that.data.type.name = "商务PPT"; that.data.type.code = "0";break;
        }
        that.setData({
          type : that.data.type
        })
      }
    })
  },

  inputTitle: function(e){
    var v = e.detail.value
    this.data.limit[0].current = v.length
    if(v != ""){
      this.setData({
        btncolor: "#F36778",
        canSub : true
      })
      if(v.length >= 15){
        this.data.limit[0].beyondStyle = "red"
      }else{
        this.data.limit[0].beyondStyle = "#9494A2"
      }
    }else{
      this.setData({
        btncolor: "#AEAEAE",
        canSub : false
      })
    }
    this.setData({
      limit: this.data.limit
    })
  },
  inputDescription : function(e){
    var v = e.detail.value
    this.data.limit[1].current =  v.length
    if(v.length >=200){
      this.data.limit[1].beyondStyle = "red"
    }else{
      this.data.limit[1].beyondStyle = "#9494A2"
    }
    this.setData({
      limit: this.data.limit
    })
  },
  inputPrice : function(e){
    var v = e.detail.value
    if(v >= 99999.9){
      wx.showToast({
        title: '价格超限啦~,上限99999.9哦~',
        icon : "none",
        duration : 3000
      })
      this.setData({
        price : null
      })
    }
  },
  autoload:function(){
    var that=this
    if(this.data.autoload == 1){
      wx.getStorage({
        key: 'cookie',
        success: function(res) {
          if(res.data){
            wx.request({
              url: 'https://pg.npupaogua.cn/paogua/Home/Release/autoUploadContact',
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded",
                "Cookie": app.globalData.cookie
              },
              data: {
                Mstring: res.data,
              },
              success: function (res) {
                console.log(res)
                if(res.data == '400'){
                  
                }else if(res.data == '401'){

                }else if(res.data =='502'){

                }else{
                  console.log(res.data)
                  var data = res.data
                  if(data.phoneNum != "" || data.wxId != '' || data.qqNum != ''){
                    wx.showModal({
                      title: '温馨提示',
                      content: '检测到你已有联系方式,是否加载？',
                      showCancel :true,
                      cancelText : '否',
                      confirmText : '是',
                      success : function(res){
                        
                        if(res.confirm){
                          that.setData({
                            phoneNum : data.phoneNum,
                            wxId : data.wxId,
                            qqNum : data.qqNum,
                            autoload : 0
                          })
                        }
                        if(res.cancel){
                          that.setData({
                            autoload : 0
                          })
                        }
                        console.log(that.data.autoload)
                      }
                    })
                  }
                }
              }
            })
          }
        },
      })
    }

  },
  formsubmit: function(e){
    var that = this
    if(this.data.canSub ){
      var data = e.detail.value
      if(data.description == ""){
        wx.showToast({
          title: '未填写介绍',
          icon: "none"
        })
      }else if(data.price == ""){
        wx.showToast({
          title : "未填写价格",
          icon : "none"
        })
      } else if(this.data.type.name == "PPT类型"){
        wx.showToast({
          title: '未填写分类',
          icon : "none"
        })
      }else if(data.phoneNum =="" && data.wxId == "" && data.qqNum == ""){
        wx.showToast({
          title: '联系方式至少填写一个',
          icon : "none"
        })
      }else{
          //确认发布
          wx.showModal({
            title: '信息提示',
            content: '发布成功',
            confirmText: "确认",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.cloud.database().collection('information').add({
                data: {
                  title: e.detail.value.title,
                  description: e.detail.value.description,
                  price: e.detail.value.price,
                  type: that.data.type.name,
                  phoneNum: e.detail.value.phoneNum,
                  wxId: e.detail.value.wxid,
                  qqNum: e.detail.value.qqNum,
                } })
          
             }
            }
          })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady : function () {
 
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})

const utils = require("../../utils/util")
var app= getApp()
Page({
  data: {
    description : "",
    price: "",
    phone_number : "",
    email : "",
    PPT_type : ["小组汇报PPT","商务PPT","学术PPT","其他"],
    PPT_type_index : 0,
    time : 0,
    limit : {
      beyondStyle: "#9494A2",
      current : 0,
      maxlength : 200
    },

    validity_check : {
      price : false,
      phone_number : false,
      email : false
    },

    enable_submit : false

  },
  selectPPTtype: function(){
    var that = this
    wx.showActionSheet({
      itemList: that.data.PPT_type,
      success: function(res){
        that.setData({
          PPT_type_index : res.tapIndex
        })
      }
    })
  },

  checkEnableSubmit () {
    console.log(this.data.validity_check)
    if (this.data.validity_check.price&&
      this.data.validity_check.phone_number&&
      this.data.validity_check.email){
        this.setData({
          enable_submit : true
        })
      } else {
        this.setData({
          enable_submit : false
        })
      }
  },

  handleInput(e) {
    clearTimeout(this.data.time)
    this.data.time = setTimeout(() => {
      var value = e.detail.value
      var id = e.target.id
      console.log(id)
      if (id == 'price'){
        this.inputPrice(value)
      } else if (id == 'phone_number'){
        this.inputPhoneNum(value)
      } else if (id == 'email'){
        this.inputEmail(value)
      } else {
        console.log(" id not found")
      }
    },1000)
  },

  inputDescription : function(e){
    var v = e.detail.value
    this.data.limit.current =  v.length
    if(v.length >=200){
      this.data.limit.beyondStyle = "red"
    } else{
      this.data.limit.beyondStyle = "#9494A2"
    }
    this.setData({
      limit: this.data.limit,
      description : v
    })
  },
  inputPrice : function(value){
    if (utils.checkNumberValidity(value)) {
      console.log("valid price")
      this.setData({
        price : value,
      })
      this.data.validity_check.price = true
    } else {
      this.data.validity_check.price = false
    }
    this.checkEnableSubmit()
  },

  inputPhoneNum(value) {
    console.log(value)
    if (utils.checkPhoneNumValidity(value)) {
      console.log("valid phone num")
      this.setData({
        phone_number : value,
      })
      this.data.validity_check.phone_number = true
     
    } else {
      this.data.validity_check.phone_number = false
    }
    this.checkEnableSubmit()
  },

  inputEmail(value){
    if(utils.checkEmailValidty(value)) {
      console.log("valid email address")
      this.setData({
        email : value,
      })
      this.data.validity_check.email = true
      
    } else {
      this.data.validity_check.email = false
    }
    this.checkEnableSubmit()
  },

  submitForm() {
    if (this.data.description == ''){
      this.data.description = '这个人很神秘，什么也没有写'
    }
    var that = this;
    console.log(app.globalData.userInfo._openid)
    wx.cloud.database().collection('user').where({
      _openid : app.globalData.userInfo._openid
    }).update({
      data : {
        introduction : that.data.description,
        email : that.data.email,
        call : that.data.phone_number,
        user_type : true,
        intentional_price : that.data.price,
        expertise_areas : that.data.PPT_type[that.data.PPT_type_index]
      },
      success(res) {
        console.log(res),
        wx.showModal({
          content: "PPT制作者注册成功", // 提示的内容
          showCancel: false, // 是否显示取消按钮，默认true
          cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
          confirmText: "确定", // 确认按钮的文字，最多4个字符
          confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
          success(res){
            if(res.confirm){
              wx.switchTab({
                url: '../user/user',
              })
            }
          }
        })
      }
    })
  }


})
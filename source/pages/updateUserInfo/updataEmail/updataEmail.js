// miniprogram/pages/isMe/qqEmail/qqEmail.js
Page({
  data: {
    email:""
  },
  qqEmailInput(e){
    this.setData({
      email:e.detail.value
    })
  },
  click(e){//数据库修改数据
    const db = wx.cloud.database({
      env: "cloud1-9gv9ynmtc4528521"
    });
    var app = getApp();
    db.collection('user').where({
      _openid: app.globalData.openid,
    }).update({
      // data 字段表示需新增的 JSON 数据
      data: {
        email:this.data.email,
      },
    }) 
    //关闭当前页面并且回到上页面
    wx.showToast({
      title: "修改成功", // 提示的内容
      icon: "none", // 图标，默认success
      image: "", // 自定义图标的本地路径，image 的优先级高于 icon
      duration: 1500, // 提示的延迟时间，默认1500
      mask: false, // 是否显示透明蒙层，防止触摸穿透
    })
    wx.navigateBack({
      delta: 1
    })
  },
})
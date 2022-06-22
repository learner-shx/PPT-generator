
const app = getApp()


Page({
    data: {
        describe: "",
        requirement_ppt : null
    },
    describe(e) {
        this.setData({
            describe: e.detail.value
        })
    },

    onLoad(options) {
        console.log(options)

        this.setData({
            requirement_id: options.id,
            openid: app.globalData.userInfo._openid,
            userInfo: app.globalData.userInfo
        })

    },

    submitReq() {
        if (this.data.requirement_ppt == null) {
            wx.showToast({
              title: '请上传PPT',
              icon : 'error'
            })
        }
    }

})
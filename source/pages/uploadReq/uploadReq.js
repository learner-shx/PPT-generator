
const app = getApp()


Page({
    data: {
        describe: "",
        requirement_ppt: null,
        has_uploaded: false
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
        this.setData({
            has_uploaded: true
        })
        if (this.data.requirement_ppt == null) {
            wx.showToast({
                title: '请上传PPT',
                icon: 'error'
            })
        }
    },

    uploadPPTfile(e) {
        var that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'file',
            success(res) {
                // console.log(res)
                var file_info = res.tempFiles[0];
                console.log(file_info)
                // TODO:判断文件类型是不是ppt,判断文件大小是否合适

                wx.cloud.uploadFile({
                    cloudPath: openid + "_" + file_info.name, // 在云端存储的路径
                    filePath: file_info.path
                }).then(res => {
                    console.log("successfully upload ppt file")
                    console.log(res.fileID)
                    that.setData({
                        has_uploaded : true
                    })
                }).catch(error => {
                    console.log(error)
                })

            }
        })
    }

})
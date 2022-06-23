
const app = getApp()

Page({

    onLoad(option) {
        this.setData({
            ppt_path: option.id
        })
    },

    downloadPPT() {
        wx.showLoading({
            title: '正在加载...',
        })
        var that = this;
        wx.cloud.downloadFile({
            fileID: that.data.ppt_path,
            success: res => {
                console.log(res)
                const filepath = res.tempFilePath
                wx.openDocument({
                    showMenu: true,
                    filePath: filepath,
                    success: function (ress) {
                        wx.hideLoading()
                    }
                })
            }
        });
    }
})
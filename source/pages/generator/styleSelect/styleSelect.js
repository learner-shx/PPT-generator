
const app = getApp();

Page({

    data: {
        PPT_style: ['简约', '自然', '深色', '科技', '随机',],
        // PPT_style_index: 0,
        subPPTpage_number: ['1', '2', '3', '4'],
        // subPPTpage_number_index: 1,
        intelligentPictureMap: true
    },

    switchChange() {
        this.setData({
            intelligentPictureMap: !this.data.intelligentPictureMap
        })
    },

    onLoad(option) {
        console.log(option)
        this.setData({
            PPT_style_index: parseInt(option.id1),
            subPPTpage_number_index: parseInt(option.id2),
            intelligentPictureMap: option.id3 == "false" ? false : true
        })
        console.log("here")
    },

    selectPPTstyle() {
        var that = this
        wx.showActionSheet({
            itemList: that.data.PPT_style,
            success: function (res) {
                console.log(res)
                that.setData({
                    PPT_style_index: res.tapIndex,
                })
            }
        })
    },

    selectPPTextendPageNumber() {
        var that = this
        wx.showActionSheet({
            itemList: that.data.subPPTpage_number,
            success: function (res) {
                console.log(res)
                that.setData({
                    subPPTpage_number_index: res.tapIndex,
                })
            }
        })
    },


    onUnload() {
        app.globalData.targetPageEventChannel = this.getOpenerEventChannel();
        var that = this;
        setTimeout(function () {
            var t = getApp().globalData.targetPageEventChannel
            t ? t.emit('backFromTargetPage', {
                data: {
                    PPT_style_index: that.data.PPT_style_index,
                    subPPTpage_number_index: that.data.subPPTpage_number_index,
                    intelligentPictureMap: that.data.intelligentPictureMap
                }
            }) : console.log('not targetPage navigateBack, canceled')
        }, 400)
    }
})
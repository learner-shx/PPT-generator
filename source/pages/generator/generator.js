// pages/generator/generator.js
Page({

    data: {
        PPT_style: ['自然', '艺术', '学术', '中国风'],
        PPT_style_index: 0
    },


    ppttest() {
        return;
        wx.cloud.callFunction({
            name: 'pptxGenJsWriteFile',
            data: {
                // ppt : pres, // 这个 CloudID 值到云函数端会被替换
                filepath: 'ppttest.pptx',
            },
            success(res) {
                console.log(res)
            }
        })
    },
    selctPPTstyle() {
        var that = this
        wx.showActionSheet({
            itemList: that.data.PPT_style,
            success: function (res) {
                that.setData({
                    PPT_style_index: res.tapIndex
                })
            }
        })
    },

})
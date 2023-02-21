
const app = getApp();

Page({

    data: {
        enableSubmit: false,
        template_index: null,
        template: [
            "简约风格",
            "互联网风格",
            "科技感",
            "卡通小树",
            "唯美小花",
            "中国红中国梦",
            "中国山水风",
            "多边形",
            "极简商务汇报"
        ],
        preview_btn : false
    },


    onLoad() {
        const eventChannel = this.getOpenerEventChannel()
        var that = this;
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            that.setData({
                PPT_title: data.PPT_title,
                subPPT_pages: data.subPPT_pages,
            })
        })
    },

    selectPPTstyle(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            template_index: index,
            enableSubmit: true
        })
    },


    oneTouchGenerator() {

        wx.showLoading({
            title: '正在生成...',
        })
        this.setData({
            enableSubmit: false,
        })

        var that = this;

        var data = {
            PPT_title: that.data.PPT_title,
            subPPT_pages: that.data.subPPT_pages
        }

        wx.cloud.callFunction({

            name: 'generatePPT',
            data: {
                description: data,
                template: that.data.template_index,
                _openid: app.globalData.userInfo._openid
            },
            success(res) {
                console.log(res)

                wx.hideLoading({
                    success: (res) => {
                        wx.showToast({
                            title: '生成成功',
                            duration: 1000
                        })
                        that.setData({
                            preview_btn : true
                        })
                    },
                })
            }
        });
    },

    preview() {
        var that = this;
        wx.showLoading({
            title: '正在加载...',
        })
        // wx.cloud.callFunction({
        //     name : 'downloadPPT',
        //     data : {
        //         _openid : app.globalData.userInfo._openid
        //     },
        //     success(res) {
        //         console.log(res)
        //     }
        // })
        wx.downloadFile({
            // P means preview
            url: "http://kamilu.top:9000/" + app.globalData.userInfo._openid + ".pptx",
            success: re => {
                
                const filepath = re.tempFilePath//.replace('unknown','pptx')
                console.log(filepath)
                wx.openDocument({
                    showMenu: true,
                    filePath: filepath,
                    fileType : 'pptx',
                    success: function () {
                        wx.hideLoading({
                            success(r) {
                                that.setData({
                                    enableSubmit: true,
                                    preview_btn : false
                                });
                            }
                        })
                        console.log('打开文档成功')
                    }
                })
            },
            fail(res) {
                console.log(res)
            }
        });
    }


})
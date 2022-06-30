
const app = getApp();

Page({

    data: {
        enableSubmit : false,
        template_index : null,
        template : [
            "简约风格",
            "互联网风格",
            "科技感",
            "卡通小树",
            "唯美小花"
        ]
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
            template_index : index,
            enableSubmit : true
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
            PPT_title : that.data.PPT_title,
            subPPT_pages : that.data.subPPT_pages
        }

        wx.cloud.callFunction({

            name: 'generatePPT',
            data: {
                description: data,
                template : that.data.template_index,
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
                        wx.showLoading({
                            title: '正在加载...',
                        })
                        console.log("http://114.115.244.162:9000/P/" + app.globalData.userInfo._openid)
                        wx.downloadFile({
                            // P means preview
                            url: "http://114.115.244.162:9000/P/" + app.globalData.userInfo._openid + ".pptx",
                            success: re => {
                                console.log(re)
                                const filepath = re.tempFilePath
                                wx.openDocument({
                                    showMenu: true,
                                    filePath: filepath,
                                    success: function () {
                                        wx.hideLoading({
                                            success(r) {
                                                that.setData({
                                                    enablePreview: true,
                                                });
                                            }
                                        })
                                        console.log('打开文档成功')
                                    }
                                })
                            }
                        });

                    },
                })
            }
        });
    },


})
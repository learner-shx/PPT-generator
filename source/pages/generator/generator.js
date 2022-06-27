// pages/generator/generator.js
Page({

    data: {
        PPT_style: ['serif', 'simple', 'sky', 'solarized','简约ppt'],
        PPT_style_index: 4,
        description: "",
        describe: "",
        downloadUrl: "",
        filePath: "",
        time : 0
    },


    handleInput(e) {
        clearTimeout(this.data.time)
        var that = this;
        this.data.time = setTimeout(() => {
            that.getDescription(e.detail.value)
        }, 300)
    },

    onLoad() {
        this.setData({
            PPT_style_index: 0,
            downloadUrl: "",
            filePath: "0f"
        })
    },
    onShow() {
        this.setData({
            PPT_style_index: 0,
            downloadUrl: "",

        })
    },
    getDescription(value) {
        this.setData({
            description: value,
        })
    },

    oneTouchGenerator() {

        if (this.data.description == ''){
            wx.showToast({
              title: '文案不能为空',
              icon : 'none',
              duration : 500
            })
            return;
        }
        var that = this;
        // console.log(that.data.PPT_style[that.data.PPT_style_index]);
        var suffix;
        if (that.data.PPT_style[that.data.PPT_style_index] == '简约ppt') {
            suffix = '.pptx';
        }
        else {
            suffix = '.html';
        }
        wx.cloud.callFunction({

            name: 'pdc_1',
            data: {
                step: 1,
                // ppt : pres, // 这个 CloudID 值到云函数端会被替换
                style: that.data.PPT_style[that.data.PPT_style_index],
                description: that.data.description,
                filepath: that.data.filePath,
            },
            success(res) {
                console.log(res)
            }
        });

        that.setData({
          downloadUrl: 'res.fileList[0].tempFileURL',
        });

        // // var that = this;
        // var fileList;
        // console.log('cloud://kamilu-3g69c1hh0c963d36.6b61-kamilu-3g69c1hh0c963d36-1312241224/' + that.data.filePath + suffix);
        // var url;
        // wx.cloud.getTempFileURL({
        //     fileList: [{
        //         fileID: 'cloud://kamilu-3g69c1hh0c963d36.6b61-kamilu-3g69c1hh0c963d36-1312241224/' + that.data.filePath + suffix,
        //         maxAge: 60 * 60, // one hour
        //     }]
        // }).then(res => {
        //     // get temp file URL
        //     // res.fileList[0]);
        //     console.log(res);
        //     that.setData({
        //         downloadUrl: 'res.fileList[0].tempFileURL',
                
        //     });
        //     if (res.fileList[0].tempFileURL != ''){
        //         wx.showToast({
        //           title: 'ppt生成成功',
        //           icon : 'none',
        //           duration : 500
        //         })
        //         return;
        //     }
        // }).catch(error => {
        //     console.log(fileList[0]);
        // });
        // console.log(112);
    },


    preview() {
        var suffix;
        var that = this;
        if (that.data.PPT_style[that.data.PPT_style_index] == '简约ppt') {
            suffix = '.pptx';
        }
        else {
            suffix = '.html';
        }

        console.log("http://114.115.244.162:9000/0f"+suffix)

        
        wx.downloadFile({
            url : "http://114.115.244.162:9000/0f"+suffix,
            // fileID: 'cloud://kamilu-3g69c1hh0c963d36.6b61-kamilu-3g69c1hh0c963d36-1312241224/' + that.data.filePath + suffix,
            success: res => {
              console.log("d http://114.115.244.162:9000/0f"+suffix)
                const filepath = res.tempFilePath
                wx.openDocument({
                    showMenu : true,
                    filePath: filepath,
                    fileType : suffix.substring(1),
                    success: function (res) {
                        console.log('打开文档成功')
                    }
                })
            },
            fail : res => {
              console.log(res)
            }
        });

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

})
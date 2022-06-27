
Page({

    data: {
        PPT_title: "",
        downloadUrl: "",
        filePath: "",
        time : 0,
        subPPT_pages : [],
        PPT_style_config : {
            PPT_style: ['简约ppt', 'serif', 'simple', 'sky', 'solarized',],
            PPT_style_index: 0,
            subPPTpage_number: ['1', '2', '3', '4'],
            subPPTpage_number_index: 1,
            intelligentPictureMap: true
        },
    },


    handleInput(e) {
        clearTimeout(this.data.time)
        var that = this;
        var id = e.target.id;
        this.data.time = setTimeout(() => {
            if (id == 'PPT_title') {
                that.setPPTtitle(e.detail.value)
            } else {
                if (id[6] == 'c') {
                    // subPPTcontent_0
                    var index = id.substring(14);
                    console.log(index)
                    that.setSubPPTcontent(index,e.detail.value)
                } else {
                    var index = id.substring(12);
                    console.log(index)
                    that.setSubPPTtitle(index,e.detail.value)
                }
            }
        }, 300)
    },

    setSubPPTcontent(index,value) {
        var subPPT_pages = this.data.subPPT_pages;
        subPPT_pages[index].content = value;
        
        this.setData({
            subPPT_pages : subPPT_pages
        })
    },

    setSubPPTtitle(index,value) {
        var subPPT_pages = this.data.subPPT_pages;
        subPPT_pages[index].title = value;
        
        this.setData({
            subPPT_pages : subPPT_pages
        })
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
            downloadUrl: "",
        })
    },
    setPPTtitle(value) {
        this.setData({
            PPT_title: value,
        })
    },

    deleteItem(e) {
        var subPPT_pages = this.data.subPPT_pages;
        var index = e.currentTarget.dataset.index;
        console.log(index)
        subPPT_pages.splice(index, 1);
        this.setData({
            subPPT_pages : subPPT_pages
        })
    },

    moreOptions() {
        var that = this;
        wx.navigateTo({
          url: './styleSelect/styleSelect?id1=' + that.data.PPT_style_config.PPT_style_index + "&id2=" + that.data.PPT_style_config.subPPTpage_number_index + "&id3=" + that.data.PPT_style_config.intelligentPictureMap,
          events : {
            backFromTargetPage : function (backData) {
                console.log(backData.data)
                that.setData({
                    PPT_style_config : {
                        PPT_style_index : backData.data.PPT_style_index,
                        subPPTpage_number_index : backData.data.subPPTpage_number_index,
                        intelligentPictureMap : backData.data.intelligentPictureMap
                    }
                })
                console.log('return')
            }
          }
        })
    },


    addItem() {
        var subPPT_pages = this.data.subPPT_pages;
        var subPPT_page = {
            title : "",
            content : ""
        }
        subPPT_pages.push(subPPT_page);
        this.setData({
            subPPT_pages : subPPT_pages
        })
    },
 
    oneTouchGenerator() {

        if (this.data.PPT_title == ''){
            wx.showToast({
              title: '标题不能为空',
              icon : 'none',
              duration : 500
            })
            return;
        }
        var that = this;

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


})
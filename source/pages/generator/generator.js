
const app = getApp();

Page({

    data: {
        PPT_title: "",
        downloadUrl: "",
        filePath: "",
        time: 0,
        subPPT_pages: [],
        PPT_style: ['简约ppt', 'serif', 'simple', 'sky', 'solarized'],
        subPPTpage_number: ['1', '2', '3', '4'],
        PPT_style_config: {
            PPT_style_index: 0,
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
                    that.setSubPPTcontent(index, e.detail.value)
                } else {
                    var index = id.substring(12);
                    console.log(index)
                    that.setSubPPTtitle(index, e.detail.value)
                }
            }
        }, 300)
    },

    setSubPPTcontent(index, value) {
        var subPPT_pages = this.data.subPPT_pages;
        subPPT_pages[index].content = value;

        this.setData({
            subPPT_pages: subPPT_pages
        })
    },

    setSubPPTtitle(index, value) {
        var subPPT_pages = this.data.subPPT_pages;
        subPPT_pages[index].title = value;

        this.setData({
            subPPT_pages: subPPT_pages
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
            subPPT_pages: subPPT_pages
        })
    },

    moreOptions() {
        var that = this;
        wx.navigateTo({
            url: './styleSelect/styleSelect?id1=' + that.data.PPT_style_config.PPT_style_index + "&id2=" + that.data.PPT_style_config.subPPTpage_number_index + "&id3=" + that.data.PPT_style_config.intelligentPictureMap,
            events: {
                backFromTargetPage: function (backData) {
                    console.log(backData.data)
                    that.setData({
                        PPT_style_config: {
                            PPT_style_index: parseInt(backData.data.PPT_style_index),
                            subPPTpage_number_index: parseInt(backData.data.subPPTpage_number_index),
                            intelligentPictureMap: backData.data.intelligentPictureMap
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
            title: "",
            content: ""
        }
        subPPT_pages.push(subPPT_page);
        this.setData({
            subPPT_pages: subPPT_pages
        })
    },

    intergrateUserInput() {
        var head = "% " + this.data.PPT_title + "\n\n";
        var mid = "";
        var sub_ppt_page_number = parseInt(this.data.PPT_style_config.subPPTpage_number_index) + 1;
        console.log(sub_ppt_page_number)
        for (var i = 0; i < this.data.subPPT_pages.length; i++) {
            var sub_title = this.data.subPPT_pages[i].title == '' ? '空' : this.data.subPPT_pages[i].title;
            var sub_content = this.data.subPPT_pages[i].content == '' ? '空' : this.data.subPPT_pages[i].content;
            mid += '# ' + sub_title + "\n\n" + sub_content + "\n\n";

            for (var j = 0; j < sub_ppt_page_number; j++) {
                mid += "## " + '空' + "\n\n" + " " + "\n\n";
            }
        }
        return head + mid;
    },

    oneTouchGenerator() {

        if (this.data.PPT_title == '') {
            wx.showToast({
                title: '标题不能为空',
                icon: 'none',
                duration: 500
            })
            return;
        }
        wx.showLoading({
          title: '正在生成...',
        })
        var markdown_file = this.intergrateUserInput();
        // console.log(markdown_file)

        var that = this;
        var suffix;
        if (that.data.PPT_style[that.data.PPT_style_config.PPT_style_index] == '简约ppt') {
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
                style: that.data.PPT_style[that.data.PPT_style_config.PPT_style_index],
                description: markdown_file,
                filepath: that.data.filePath,
            },
            success(res) {
                console.log(res)
                that.setData({
                    downloadUrl: 'res.fileList[0].tempFileURL',
                });
                wx.hideLoading({
                  success: (res) => {
                      wx.showToast({
                        title: '生成成功',
                        duration : 1000
                      })
                  },
                })
            }
        });


    },


    preview() {
        var suffix;
        var that = this;
        if (that.data.PPT_style[parseInt(that.data.PPT_style_config.PPT_style_index)] == '简约ppt') {
            suffix = '.pptx';
        }
        else {
            suffix = '.html';
        }

        wx.downloadFile({
            url: "http://114.115.244.162:9000/0f" + suffix,
            // fileID: 'cloud://kamilu-3g69c1hh0c963d36.6b61-kamilu-3g69c1hh0c963d36-1312241224/' + that.data.filePath + suffix,
            success: res => {
                console.log("d http://114.115.244.162:9000/0f" + suffix)
                const filepath = res.tempFilePath
                wx.openDocument({
                    showMenu: true,
                    filePath: filepath,
                    fileType: suffix.substring(1),
                    success: function (res) {
                        console.log('打开文档成功')
                    }
                })
            },
            fail: res => {
                console.log(res)
            }
        });

    },


})

const app = getApp();

Page({

    data: {
        PPT_title: "",
        enablePreview: false,
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
        if (value != '') {
            this.setData({
                enablePreview : true
            })
        } else {
            this.setData({
                enablePreview : false
            })
        }
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

        var input_information = {
            PPT_title : this.data.PPT_title,
            subPPT_pages : []
        }

        for (var i = 0; i < this.data.subPPT_pages.length; i++) {
            var sub_title = this.data.subPPT_pages[i].title == '' ? '空' : this.data.subPPT_pages[i].title;
            var sub_content = this.data.subPPT_pages[i].content == '' ? '空' : this.data.subPPT_pages[i].content;
            var subPPT = {
                title : sub_title,
                content : sub_content
            }
            input_information.subPPT_pages.push(subPPT)
        }
        console.log(input_information)
        return input_information;
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
        this.setData({
            enablePreview : false
        })
        var input_information = this.intergrateUserInput();
        console.log(input_information)
        var that = this;
        var style_config = {};
        style_config.PPT_style = this.data.PPT_style_config.PPT_style_index;
        style_config.subPPTpage_number = this.data.PPT_style_config.subPPTpage_number_index + 1;
        style_config.intelligentPictureMap = this.data.PPT_style_config.intelligentPictureMap;

        wx.cloud.callFunction({

            name: 'generatePPT',
            data: {
                description: input_information,
                style_config: style_config,
                _openid : app.globalData.userInfo._openid
            },
            success(res) {
                console.log(res)

                wx.hideLoading({
                  success: (res) => {
                      wx.showToast({
                        title: '生成成功',
                        duration : 1000
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

    preview() {

    },


})
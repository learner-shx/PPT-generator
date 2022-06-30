
const app = getApp();

Page({

    data: {
        PPT_title: "",
        enablePreview: false,
        filePath: "",
        time: 0,
        subPPT_pages: [],
        openid :''
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
    getUserProfile() {
        
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
        console.log(app.globalData.userInfo)
        if (app.globalData.userInfo!=null) {
            this.setData({
                openid : app.globalData.userInfo._openid
            })
        }
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
            url: './styleSelect/styleSelect',
            success(res) {
                res.eventChannel.emit('acceptDataFromOpenerPage',{PPT_title : that.data.PPT_title ,subPPT_pages :that.data.subPPT_pages})
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




})
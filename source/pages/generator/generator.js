
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
    getUserProfile(e) {
    
        var that = this;
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            that.setData({
              userName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl,
            })
            console.log(res.userInfo)
            app.globalData.userInfo = res.userInfo
            
            // 数据库提交结束
            
            wx.cloud.callFunction({
              name: "login",
              data : {},
              success: res => {
                console.log(res.result.userInfo.openId)
                // 拿到用户的OpenId
                app.globalData.userInfo._openid = res.result.userInfo.openId
                that.setData({
                  userInfo : app.globalData.userInfo,
                })
                
              },
              fail: function(res) {
                console.log(res)
              }
            })
            
            // 在数据库中查询此openid，如果没有那么新建用户，否则按原用户登录
    
            wx.cloud.database().collection('user').where({
              _openid : app.globalData.userInfo._openid
            }).get({
              success(res) {
                if(res.data.length==0) {
                  // 没有搜索到则新建用户
                  app.globalData.userInfo.user_type = false;
                  wx.cloud.database().collection('user').add({
                    // data 字段表示需新增的 JSON 数据
          
                    data: {
                      userName: app.globalData.userInfo.nickName,
                      avatarUrl: app.globalData.userInfo.avatarUrl,
                      email: "未填写",
                      call: "未填写",
                      user_type : false
                    },
                  })
                } else {
                  app.globalData.userInfo = res.data[0]
                }
                wx.setStorageSync('userInfo', app.globalData.userInfo);
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
            
          }
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
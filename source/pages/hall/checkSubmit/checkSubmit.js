
const app = getApp()

Page({

    data : {
        person_title : ['小试牛刀','大显身手','过关斩将','功成名就']
    },

    onLoad(option) {
        this.setData({
            requirement_id: option.id,
            enable_submit: false,
            selected_index: null,
        })
    },

    onShow() {
        this.checkSubmit()
    },

    checkSubmit() {
        // console.log(this.data.requirement_id)
        wx.showLoading({
            title: '正在加载数据...',
        })
        var that = this;
        wx.cloud.database().collection('requirement').doc(that.data.requirement_id).get({
            success(res) {
                console.log(res)
                that.setData({
                    submittedUserList: res.data.submittedUserList
                })
                wx.hideLoading()
            }
        })
    },

    onlinePreview(e) {
        // console.log(e)
        var that = this;
        var index = e.currentTarget.dataset.index;
        this.setData({
            selected_index: index,
        })
        var ppt_path = this.data.submittedUserList[index].ppt_path;
        console.log(ppt_path)
        wx.showLoading({
            title: '正在加载...',
        })
        wx.cloud.downloadFile({
            fileID: ppt_path,
            success: res => {
                console.log(res)
                const filepath = res.tempFilePath
                wx.openDocument({
                    filePath: filepath,
                    success: function (ress) {
                        wx.hideLoading()
                        that.setData({
                            enable_submit: true
                        })
                        console.log('打开文档成功')
                    }
                })
            }
        });
    },

    acceptPPT() {
        var that = this;
        wx.showModal({
            title: "通知", // 提示的标题
            content: "确认选择并结束悬赏么？", // 提示的内容
            showCancel: true, // 是否显示取消按钮，默认true
            cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
            confirmText: "确定", // 确认按钮的文字，最多4个字符
            confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
            success(res) {
                if (res.confirm) {
                    that.finishRequirement()
                }
            }
        })
    },

    finishRequirement() {
        var that = this;
        wx.showLoading({
            title: '正在处理...',
        })
        this.setData({
            enable_submit : false
        })
        var index = that.data.selected_index;
        wx.cloud.database().collection('requirement').doc(that.data.requirement_id).update({
            data: {
                acceptedWorkID: that.data.submittedUserList[index].userInfo._openid,
                status: 'finished'
            },
            success(res) {
                console.log(res)
            }
        })
        wx.cloud.database().collection('user').doc(that.data.submittedUserList[index].userInfo._id).get({
            success(res){
                console.log(res)
                var solved_requirement_num = res.data.solved_requirement_num + 1;
                var person_title = that.data.person_title[Math.floor(solved_requirement_num,3)];
                wx.cloud.database().collection('user').doc(that.data.submittedUserList[index].userInfo._id).update({
                    data : {
                        solved_requirement_num : solved_requirement_num,
                        person_title : person_title
                    }
                })
                wx.hideLoading({
                  success(ress) {
                      wx.navigateTo({
                        url: '../downloadPPT/downloadPPT?id=' + that.data.submittedUserList[index].ppt_path
                      })
                  }
                })
            }
        })
    },

})
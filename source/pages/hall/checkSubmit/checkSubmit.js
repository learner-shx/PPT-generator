
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
                    submittedUserList: res.data.submittedUserList,
                    userInfo : res.data._openid
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
                that.sendAccpetMessage(that.data.submittedUserList[index]);
                
            }
        })
    },

    sendAccpetMessage(submittedInfo) {
        
        var that = this;
        wx.cloud.database().collection("message").where({
            userBInfo : {
                _openid : submittedInfo.userInfo._openid
            },
            userAInfo : {
                _openid : 'SYSTEM'
            }
        }).get({
            success(res) {
                console.log(res)
                if (res.data.length == 0) {
                    console.log("user finish the job first time");
                    wx.cloud.database().collection("message").add({
                        data: {
                            userAInfo: {
                                _openid : 'SYSTEM',
                                userName : '系统消息',
                                avatarUrl : '../../images/index-icon/system.svg'
                            },
                            userBInfo: submittedInfo.userInfo,
                            message_type: false, // true 为用户消息, false 为系统消息
                            message_list: [{
                                _openid: 'SYSTEM',
                                text: '你提交的作品被' + app.globalData.userInfo.userName + '采纳了，感谢您的付出',
                                time: utils.formatTime(new Date())
                            }],
                            last_send_time: wx.cloud.database().serverDate()
                        },
                    })
                } else {
                    var _id = res.data[0]._id;
                    console.log("search message")
                    wx.cloud.database().collection('message').doc(_id).get({
                        success(res) {
                            console.log(res)
                            var message_list = res.data.message_list;
                            var msg = {
                                _openid: 'SYSTEM',
                                text: '你提交的作品被' + that.data.userInfo.userName + '采纳了，感谢您的付出',
                                time: utils.formatTime(new Date())
                            };
                            message_list.push(msg);
                            wx.cloud.database().collection('message').doc(_id).update({
                                data : {
                                    message_list : message_list,
                                    last_send_time: wx.cloud.database().serverDate()
                                }
                            })
                        }
                        
                    })
                }
            }
        })

        wx.hideLoading({
            success(ress) {
                wx.navigateTo({
                  url: '../downloadPPT/downloadPPT?id=' + submittedInfo.ppt_path
                })
            }
          })
    }

})
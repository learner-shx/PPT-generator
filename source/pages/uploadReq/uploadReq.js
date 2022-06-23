
const app = getApp()
const utils = require('../../utils/util')

Page({
    data: {
        describe: "",
        requirement_ppt: null,
        has_uploaded: false
    },
    describe(e) {
        this.setData({
            describe: e.detail.value
        })
    },

    onLoad(options) {
        console.log(options)

        this.setData({
            requirement_id: options.id,
            openid: app.globalData.userInfo._openid,
            userInfo: app.globalData.userInfo
        })



    },

    submitReq() {
        var that = this
        if (this.data.requirement_ppt == null) {
            wx.showToast({
                title: '请上传PPT',
                icon: 'error'
            })
        } else {
            wx.showModal({
                title: "", // 提示的标题
                content: "是否确定上传，上传后不可修改", // 提示的内容
                showCancel: true, // 是否显示取消按钮，默认true
                cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
                confirmText: "确定", // 确认按钮的文字，最多4个字符
                confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
                success(res) {
                    if (res.confirm) {
                        wx.cloud.database().collection('requirement').doc(that.data.requirement_id).get({
                            success(res) {
                                console.log(res)
                                that.setData({
                                    target_userInfo : {
                                        _openid : res.data._openid,
                                        avatarUrl : res.data.avatarUrl,
                                        userName : res.data.userName
                                    }
                                })
                                var submittedUserList = res.data.submittedUserList;
                                var submittedInfo = {
                                    userInfo: that.data.userInfo,
                                    ppt_path: that.data.requirement_ppt
                                }
                                submittedUserList.push(submittedInfo);
                                console.log(submittedUserList)
                                wx.cloud.database().collection('requirement').doc(that.data.requirement_id).update({
                                    data: {
                                        submittedUserList: submittedUserList
                                    },
                                    success(res) {
                                        console.log("successfully submit")
                                        console.log(res)
                                        wx.showModal({
                                            title: "", // 提示的标题
                                            content: "PPT已提交", // 提示的内容
                                            showCancel: false, // 是否显示取消按钮，默认true
                                            cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
                                            confirmText: "确定", // 确认按钮的文字，最多4个字符
                                            confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
                                            success(res) {
                                                that.sendSystemMessage();
                                                wx.switchTab({
                                                    url: '../hall/hall',
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })

                    }

                }
            })
        }
    },

    sendSystemMessage() {
        console.log("send system message to notice");
        var that = this;
        wx.cloud.database().collection('message').where({
            userAInfo : {
                _openid : 'SYSTEM'
            },
            userBInfo : {
                _openid : that.data.target_userInfo._openid
            }
        }).get({
            success(res) {
                if (res.data.length == 0){
                    console.log("no connection before")
                    wx.cloud.database().collection("message").add({
                        data: {
                            userAInfo: {
                                _openid : 'SYSTEM',
                                userName : '系统消息',
                                avatarUrl : '../../images/index-icon/system.svg'
                            },
                            userBInfo: that.data.target_userInfo,
                            message_type: false, // true 为用户消息, false 为系统消息
                            message_list: [{
                                _openid: 'SYSTEM',
                                text: that.data.userInfo.userName + '完成了你的悬赏,快来看看吧',
                                time: utils.formatTime(new Date())
                            }],
                            last_send_time: wx.cloud.database().serverDate()
                        },
                    })
                } else {
                    var msg = {
                        _openid: 'SYSTEM',
                        text: that.data.userInfo.userName + '完成了你的悬赏，快来看看吧',
                        time: utils.formatTime(new Date())
                    }
                    var message_list = res.data[0].message_list
                    message_list.push(msg)
                    wx.cloud.database().collection('message').where({
                        userAInfo : {
                            _openid : 'SYSTEM'
                        },
                        userBInfo : {
                            _openid : that.data.target_userInfo._openid
                        }
                    }).update({
                        data : {
                            message_list : message_list
                        }
                    })

                }
            }
        })

        
    },

    uploadPPTfile(e) {
        var that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'file',
            success(res) {
                // console.log(res)
                var file_info = res.tempFiles[0];
                console.log(file_info)
                // TODO:判断文件类型是不是ppt,判断文件大小是否合适
                if (file_info.size > 104857600) {
                    wx.showModal({
                        title: "文件大小错误", // 提示的标题
                        content: "文件过大,请压缩小于100MB后上传", // 提示的内容
                        showCancel: false, // 是否显示取消按钮，默认true
                        cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
                        confirmText: "确定", // 确认按钮的文字，最多4个字符
                        confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
                    })
                } else if (!file_info.name.endsWith('ppt') && !file_info.name.endsWith('pptx') && !file_info.name.endsWith('pps') && !file_info.name.endsWith('ppsx')) {
                    wx.showModal({
                        title: "文件类型错误", // 提示的标题
                        content: "请上传PPT文件", // 提示的内容
                        showCancel: false, // 是否显示取消按钮，默认true
                        cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
                        confirmText: "确定", // 确认按钮的文字，最多4个字符
                        confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
                    })
                } else {
                    wx.showLoading({
                        title: '正在上传',
                    })
                    wx.cloud.uploadFile({
                        cloudPath: that.data.openid + "_" + file_info.name, // 在云端存储的路径
                        filePath: file_info.path
                    }).then(ress => {
                        console.log("successfully upload ppt file")
                        console.log(ress.fileID)
                        that.setData({
                            has_uploaded: true,
                            requirement_ppt: ress.fileID
                        })
                        wx.hideLoading({
                            success(res) {
                                wx.showToast({
                                    title: '上传完成',
                                })
                            }
                        })
                    }).catch(error => {
                        console.log(error)
                    })
                }


            }
        })
    }

})
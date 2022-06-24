// pages/chat/chat.js

const app = getApp()
const utils = require("../../utils/util")
const plugin = requirePlugin("chatbot");

Page({

    data: {
        inputValue: "",
        time: 0,
        dirty_word : false
    },

    onLoad: function (options) {
        this.setData({
            userInfo: app.globalData.userInfo,
            chat_id: options.chat_id
        })
        console.log("start chat!")
        this.getChatList()
        this.getTargetUserInfo()
    },

    onShow() {
        console.log(this.data.chat_id)
    },


    handleInput(e) {
        clearTimeout(this.data.time)
        var that = this;
        this.data.time = setTimeout(() => {
            that.getInputValue(e.detail.value)
        }, 300)
    },

    getInputValue(value) {
        this.setData({
            inputValue: value
        })

    },

    publishMessage() {
        var that = this;
        if (this.data.inputValue == "") {
            wx.showToast({
                icon: "none",
                title: '不能发送空消息',
            })
            return;
        }

        plugin.init({
            appid: "P5Ot9PHJDechCYqDFAW1AiK6OtG3Ja", //小程序示例账户，仅供学习和参考
            openid: "123", //用户的openid，非必填，建议传递该参数
        });

        plugin.api.nlp("sensitive", { q: that.data.inputValue, mode: "cnn" }).then((res) => {
            console.log(res.result);
            if(res.result[0][0]!='other'){
                that.setData({
                    dirty_word : true,
                    inputValue : ''
                })
                wx.showToast({
                  title: '敏感词警告',
                  icon : 'error'
                })
            } else {
                that.setData({
                    dirty_word : false
                })
            }
        })
        wx.cloud.database().collection('message').doc(that.data.chat_id).get({
            success(res) {
                console.log(res)
                var message_list = res.data.message_list;

                var msg = {}
                msg._openid = that.data.userInfo._openid
                msg.text = that.data.inputValue
                msg.time = utils.formatTime(new Date())

                console.log(msg)
                message_list.push(msg)
                console.log(message_list)
                if(!that.data.dirty_word){
                    wx.cloud.database().collection('message').doc(that.data.chat_id).update({
                        data: {
                            message_list: message_list,
                            last_send_time: wx.cloud.database().serverDate(),
                        },
                        success(res) {
                            that.getChatList()
                            that.setData({
                                inputValue: ""
                            })
                        }
    
                    })
                }
            }
        })
    },

    getChatList() {
        var that = this;
        wx.cloud.database().collection('message').doc(that.data.chat_id).watch({
            onChange: function (snapshot) {

                // console.log(snapshot.docs[0].message_list)
                that.setData({
                    chatList: snapshot.docs[0].message_list
                })
                that.setData({
                    scrollLast: "toView"
                })
            },
            onError: function (err) {
                console.log(err)
            }
        })
    },
    getTargetUserInfo() {
        var that = this;

        wx.cloud.database().collection('message').doc(that.data.chat_id).get({
            success(res) {
                console.log(res)
                var target_userName, target_user_avatarUrl;
                if (that.data.userInfo._openid == res.data.userAInfo._openid) {

                    target_userName = res.data.userBInfo.userName;
                    target_user_avatarUrl = res.data.userBInfo.avatarUrl;
                    console.log("target user is B")

                } else {

                    target_userName = res.data.userAInfo.userName
                    target_user_avatarUrl = res.data.userAInfo.avatarUrl
                    console.log("target user is A")
                }

                wx.setNavigationBarTitle({
                    title: target_userName
                })
                that.setData({
                    target_userName: target_userName,
                    target_user_avatarUrl: target_user_avatarUrl
                })

            }
        })
    }

})
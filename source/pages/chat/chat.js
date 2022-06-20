// pages/chat/chat.js

const app = getApp()
const utils = require("../../utils/util")

Page({

    data: {
        inputValue : "",
    },

    onLoad : function(options) {
        this.setData({
            userInfo : app.globalData.userInfo,
            chat_id : options.chat_id
        })
        console.log("hello!")
        console.log(options.chat_id)
        
    },

    onShow() {
        console.log(this.data.chat_id)
    }, 

    getMessage() {

    },

    getInputValue(e) {
        this.data.inputValue = e.detail.value
    },

    sendMessage() {
        var that = this;
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
                wx.cloud.database().collection('message').doc(that.data.chat_id).update({
                    data: {
                        message_list : message_list
                    },
                    success(res) {
                        console.log(res)
                        wx.showToast({
                          title: '发送成功',
                        })

                        that.getChatList(),
                        that.setData({
                            inputValue : ''
                        })
                    }
                
                })
            }
        })
    },

    getMessageList() {
        var that = this;
        wx.cloud.database().collection('message').doc(that.data.chat_id).watch({
            onChange: function(snapshot) {
                
                console.log(snapshot.docs[0].message_list)
                that.setData({
                    message_list : snapshot.docs[0].message_list
                })
            },
            onError: function(err){
                console.log(err)
            }
        })
    },

})
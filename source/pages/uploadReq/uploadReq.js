
const app = getApp()


Page({
    data: {
        // PPT 悬赏相关变量
        imageBase64: "",
        describe: "",
        money: "",
        picList: [],
        countPic: 9,//上传图片最大数量
        showImgUrl: "", //路径拼接，一般上传返回的都是文件名，
        uploadImgUrl: '',//图片的上传的路径
        indexTitle: 0, //标题当前选择的下坐标
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


})
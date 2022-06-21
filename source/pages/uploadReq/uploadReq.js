
const app = getApp()


Page({

    onLoad(options) {
        console.log(options)

        this.setData({
            requirement_id : options.id
        })
    },

})
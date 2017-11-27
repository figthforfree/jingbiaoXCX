// pages/s_select/s_select.js
const app = getApp();
//获取应用实例
let ERR_OK = 200;
let url = app.globalData.url;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: url,
    },
    //选定跳转
    xdfuwu:function(e){
        var fuwuid = e.currentTarget.dataset.id;
          wx.redirectTo({
              url: '/pages/book/book?fuwuid=' + fuwuid + '&id=' +this.data.id ,
          })
    },
    //获取服务类型
    getServiceById: function () {
        var url_r = url + '/index/store/getServiceById'
        var _this = this
        app.fetch1(url_r, { id: this.data.id }, (err, data) => {
            console.log(data);
            _this.setData({
                ServiceById:data.data,
                serviceson:data.son
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        this.setData({
            id:id
        })

        this.getServiceById();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    //弹窗显示
    tanselect: function (e) {
        console.log("设置显示状态，1显示0不显示", e.currentTarget.dataset.status);
        var i =e.currentTarget.dataset.i;
        var animation = wx.createAnimation({
            duration: 400,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateX(375).step()
        this.setData({
            animationData: animation.export()
        })
        if (e.currentTarget.dataset.status == 1) {

            this.setData(
                {
                    showModalStatus: true,
                    serviceson2: this.data.serviceson[i],
                    path: this.data.ServiceById[i].path,
                    name: this.data.ServiceById[i].name,

                }
            );
        }

        setTimeout(function () {
            animation.translateX(95).step()
            this.setData({
                animationData: animation
            })
            if (e.currentTarget.dataset.status == 0) {
                this.setData(
                    {
                        showModalStatus: false
                    }
                );
            }
        }.bind(this), 200)
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    rotateAndScale: function () {
        // 旋转同时放大
        this.animation.rotate(45).scale(2, 2).step()
        this.setData({
            animationData: this.animation.export()
        })
    },
    rotateThenScale: function () {
        // 先旋转后放大
        this.animation.rotate(45).step()
        this.animation.scale(2, 2).step()
        this.setData({
            animationData: this.animation.export()
        })
    },
    rotateAndScaleThenTranslate: function () {
        // 先旋转同时放大，然后平移
        this.animation.rotate(45).scale(2, 2).step()
        this.animation.translate(100, 100).step({ duration: 1000 })
        this.setData({
            animationData: this.animation.export()
        })
    }
})
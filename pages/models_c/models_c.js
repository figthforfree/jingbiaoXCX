// pages/models_c/models_c.js
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
    //xuanding 选定车型
    xuanding: function (e) {
        console.log(e)
        var url_r = url + '/index/index/userAddCars';
        var _this = this;
        var id = e.currentTarget.dataset.id;
        app.fetch1(url_r, { user_car_id: this.data.user_car_id, id: id }, (err, data) => {
            wx.redirectTo({
              url: '/pages/mem_bind/mem_bind?user_car_id=' + this.data.user_car_id + '&id=' + id,
            })
            // wx.navigateTo({
            //     url: '/pages/mem_bind/mem_bind?user_car_id=' + this.data.user_car_id + '&id=' + id,
            // })
            // wx.navigateBack({
            //     delta: 2
            // })
        })
    },
    //获取车款
    getchekuan: function (id) {
        var url_r = url + '/index/index/getCarMore';
        var _this = this;
        app.fetch1(url_r, { id: id, user_car_id: this.data.user_car_id }, (err, data) => {
            console.log(data);
            if (data.code == ERR_OK) {
                _this.setData({
                    chekuan: data.data,
                    pl_name: data.pl_name,
                    nf_name: data.nf_name,
                    brand: data.brand
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        var user_car_id = options.user_car_id;
        this.setData({
            user_car_id: user_car_id
        })
        this.getchekuan(id);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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

    }
})
// pages/models_n/models_n.js
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
    //跳转车型
    xuancx: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.redirectTo({
            url: '/pages/models_c/models_c?user_car_id=' + this.data.user_car_id + '&id=' + id,
        })
    },
    //获取年份
    getnianfen: function (id){
        var url_r = url + '/index/index/getCarMore';
        var _this =this;
        app.fetch1(url_r, { id: id, user_car_id: this.data.user_car_id},(err,data)=>{
            console.log(data);
            if(data.code == ERR_OK){
                _this.setData({
                    nianfen: data.data,
                    pl_name: data.pl_name,
                    brand:data.brand
                }) 
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id= options.id;
        this.setData({
            user_car_id:options.user_car_id
        })
        this.getnianfen(id);
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
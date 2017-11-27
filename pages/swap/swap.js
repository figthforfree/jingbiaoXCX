// pages/swap/swap.js
const app = getApp();
//获取应用实例
let ERR_OK = 200;
let url = app.globalData.url;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url:url,
        s_p: 1,
        s_flag: true,
    },
    //获取列表
    swapList: function () {
        var url_r = url + '/index/services/replacevehicle';
        var _this = this;

        if (!_this.data.s_flag) {
            return
        }
        app.fetch1(url_r, { p: _this.data.s_p }, (err, data) => {
            console.log(data);
            var s_p = _this.data.s_p;
            if (s_p == 1) {
                _this.setData({
                    swapList: []
                })
                var swapList = [];
            } else {
                var swapList = _this.data.swapList;
            }
            if (data.code === ERR_OK) {
                swapList = swapList.concat(data.data);
                s_p = s_p + 1;

                _this.setData({
                    swapList: swapList,
                    s_p: s_p
                })
            } else {
                _this.setData({
                    s_flag: false
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.swapList();
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
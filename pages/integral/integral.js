// pages/integral/integral.js
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
        type:1,
        s_flag: true,
    },
    selectscore:function(e){
        var type = e.currentTarget.dataset.status;
        this.setData({
            type: type,
            s_p: 1,
            s_flag: true,
        })
        this.scoreList();
    },
    //获取积分明细
    scoreList: function () {
        if (this.data.s_flag) {
            var url_r = url + '/index/user/scoreList'
            var _this = this
            app.fetch1(url_r, { user_id: wx.getStorageSync('user_id'), p: _this.data.s_p, type:_this.data.type }, (err, data) => {
                console.log(data);
                console.log('55555555');
                var s_p = _this.data.s_p;
                if (s_p == 1) {
                    _this.setData({
                        scoreList: []
                    })
                    var scoreList = [];
                } else {
                    var scoreList = _this.data.scoreList;
                }
                if (data.code === ERR_OK) {
                    scoreList = scoreList.concat(data.data);
                    s_p = s_p + 1;
                    _this.setData({
                        scoreList: scoreList,
                        type: scoreList.type,
                        s_p: s_p
                    })
                } else {
                    _this.setData({
                        s_flag: false
                    })
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            s_p: 1,
            s_flag: true,
        })
        this.scoreList();
        
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
        this.scoreList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
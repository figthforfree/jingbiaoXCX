// pages/books/books.js
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
        selected:true,
        selected1:false,
        type:1
    },
    //预约去评价
    gopingjia: function (e) {
      var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/assess/assess?type=1&s_id='+id,
        })
    },
    //删除预约
    shanyuyue: function (e) {
        var id = e.currentTarget.dataset.id;
        var i = e.currentTarget.dataset.i;
        var url_r = url + '/index/user/delReservation'
        var _this = this;
        wx.showModal({
            title: '提示',
            content: '确定删除预约？',
            success: function (res) {
                if (res.confirm) {
                    app.fetch1(url_r, { id: id }, (err, data) => {
                        console.log(data);
                        if (data.code == ERR_OK) {
                            var reservationList = _this.data.reservationList;
                            reservationList.splice(i, 1)
                            _this.setData({
                                reservationList: reservationList
                            })
                        }
                    })
                }
            }
        })

    },
    //取消预约
    deleyuyue:function(e){
        var id = e.currentTarget.dataset.id;
        var i = e.currentTarget.dataset.i;
        var url_r = url + '/index/user/delReservation'
        var _this = this;
        wx.showModal({
            title: '提示',
            content: '确定取消预约？',
            success: function (res) {
                if (res.confirm) {
                    app.fetch1(url_r, { id: id }, (err, data) => {
                        console.log(data);
                        if (data.code == ERR_OK) {
                            var reservationList = _this.data.reservationList;
                            reservationList.splice(i, 1)
                            _this.setData({
                                reservationList: reservationList
                            })
                        }
                    })
                }
            }
        })
        
    },
    //没有预约、跳转去预约
    goyuyue:function(){
        wx.switchTab({
            url: '/pages/store/store',
        })
    },
    //获取预约列表
    reservationList:function(){
        var url_r = url + '/index/user/reservationList'
        var _this = this;
        app.fetch1(url_r , {user_id:wx.getStorageSync('user_id'),type:this.data.type},(err,data)=>{
            console.log(data);
            console.log(this.data.type);
            if(data.code == ERR_OK){
                _this.setData({
                    reservationList:data.res
                })
            }
        })
    },
    //点击tab切换
    selected: function (e) {
        this.setData({
            selected1: false,
            selected: true,
            type: 1,
            reservationList:[]
        })
        this.reservationList();
    },
    selected1: function (e) {
        this.setData({
            selected: false,
            selected1: true,
            type: 2,
            reservationList: []
        })
        this.reservationList();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.reservationList();
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
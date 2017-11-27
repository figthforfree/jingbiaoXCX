// pages/address/address.js
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
    },
    //点击选择的地址
    gogoods:function(e){
        var url_r = url + '/index/user/changeAddress';
        var a_id = e.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index;
        var _this =this;
        app.fetch1(url_r, { a_id: a_id,user_id:wx.getStorageSync('user_id')},(err,data)=>{
            var address = this.data.address;
            for(var i=0;i<address.length;i++){
                if(index == i){
                    address[i].is_default = 1;
                }else{
                    address[i].is_default = 0;
                }
            }
           _this.setData({
               address: address
           })
           if(_this.data.firm == 1){
               wx.navigateBack({
                   delta: 1
               })
           }
        })
    },
    //获取地址列表
    getAddress: function () {
        var url_r = url + '/index/user/addressList';
        app.fetch1(url_r, { user_id: wx.getStorageSync('user_id') }, (err, data) => {
            if (data.code === ERR_OK) {
                console.log(data);
                this.setData({
                    address: data.data
                })
            } else {
                this.setData({
                    address: []
                })

            }
        });

    },
    //长按删除地址
    longpress: function (e) {
        var id = e.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index;
        var url_r = url + '/index/user/delAddress';
        var _this = this;
        wx.showModal({
            title: '提示',
            content: '确定要删除该地址',
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    app.fetch1(url_r, { a_id: id }, (err, data) => {
                        if (data.code == ERR_OK) {
                            var address = _this.data.address;
                            //删除数组指定的下标
                            address.splice(index, 1);
                            _this.setData({
                                address: address
                            })

                        }
                    })
                }

            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var firm = options.firm;
        this.setData({
            firm:firm
        })
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
        this.getAddress();
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
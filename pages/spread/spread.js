// pages/spread/spread.js
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
    //预览图片
    previewImage:function(){
      var img = url + this.data.userinfo.qr;
        wx.previewImage({
          current: img, // 当前显示图片的http链接
          urls: [img] // 需要预览的图片http链接列表
        })
    },
    
    //获取个人信息
    getusers: function () {
        var url_r = url + '/index/user/getUseInfo';
        var _this = this;
        //获取用户信息
        app.fetch1(url_r, { user_id: wx.getStorageSync('user_id') }, (err, data) => {
            if (data.code == ERR_OK) {
              _this.setData({
                userinfo: data.data
              })
                if (data.data.qr==null || !data.data.qr){//判断数据库是否存在二维码
                  _this.getqr()
                    // if (wx.getStorageSync('access_token')) {//判断缓存是否存在access_token
                    //     console.log(wx.getStorageSync('access_token'))
                    //     _this.getqr()
                    // } else {
                    //     _this.getaccess_token()
                    //     _this.getqr()
                    // }
                }
              
            }
        })

    },
    //获取access_token
    getaccess_token: function () {
        var url_r = url + '/index/index/getaccess_token';
        var _this = this;
        app.fetch1(url_r, { }, (err, data) => {
            wx.setStorageSync('access_token', data.access_token)
        })

    },
    //获取二维码
    getqr:function(){
        var url_r = url + '/index/index/getqr';
        var _this = this;
        //获取用户信息
        app.fetch1(url_r, { user_id: wx.getStorageSync('user_id')}, (err, data) =>            {
            if (data.code == ERR_OK) {
                _this.getusers()
            }
            
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getusers()
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

    },
    
})
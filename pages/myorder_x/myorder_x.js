// pages/myorder_x/myorder_x.js
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
    /**
     * 获取订单详情
     */
    getOrderDetail:function(){
      var url_r = url + '/index/goods/getOrderDetail';
      app.fetch1(url_r,{order_id:this.data.order_id},(err,data)=>{
        if(data.code === ERR_OK){
          var date = new Date;
          date.setTime(data.data.created * 1000);
          var created = date.toLocaleDateString();
          this.setData({
            orderInfo:data.data,
            created:created
          })
        }
        console.log(data)
      })

    },

    //立即支付
    pay: function (e) {
      var _this = this;
      var order_id = _this.data.order_id;
      var url_r = url + '/index/goods/pay';
      app.fetch1(url_r, { order_id: order_id }, (err, data) => {
        //调起微信支付
        if (data.code === ERR_OK) {
          wx.requestPayment(
            {
              'timeStamp': data.data.timeStamp,
              'nonceStr': data.data.nonceStr,
              'package': data.data.package,
              'signType': 'MD5',
              'paySign': data.data.sign,
              'success': function (res) {
                wx.redirectTo({
                  url: '/pages/myorder/myorder?status=2',
                })
              },
              'fail': function (res) {
                console.log(res);
              },
              'complete': function (res) {
                console.log(res);
              }
            })
        } else {
          wx.showToast({
            title: '调起支付失败',
            icon: 'loading'
          })
        }

      })
    },

    //去评价
    gopingjia: function (e) {
      var order_id = this.data.order_id;
      wx.redirectTo({
        url: '/pages/assess/assess?order_id=' + order_id + '&type=2',
      })
    },

    //确认收货
    confirm: function (e) {
      var id = this.data.order_id;
      var url_r = url + '/index/goods/confirmReceipt'
      var _this = this
      app.fetch1(url_r, { order_id: id }, (err, data) => {
        if (data.code == ERR_OK) {
          wx.redirectTo({
            url: '/pages/myorder/myorder?status=4',
          })

        }
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({
        order_id:options.order_id
      })
      this.getOrderDetail()

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
// pages/myorder/myorder.js
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
        s_p:1,
        status:0,
        s_flag: true,
    },

    //立即支付
    pay:function(e){
      var _this = this;
      var order_id = e.currentTarget.dataset.id;
      var url_r = url + '/index/goods/pay';
      app.fetch1(url_r,{order_id:order_id},(err,data)=>{
        //调起微信支付
       if(data.code === ERR_OK){
         wx.requestPayment(
           {
             'timeStamp': data.data.timeStamp,
             'nonceStr': data.data.nonceStr,
             'package': data.data.package,
             'signType': 'MD5',
             'paySign': data.data.sign,
             'success': function (res) { 
               _this.setData({
                 s_p: 1,
                 s_flag: true,
                 status: 2
               })
               _this.getorderlist();
             },
             'fail': function (res) {
               console.log(res);
              },
             'complete': function (res) {
               console.log(res);
              }
           })
       }else{
         wx.showToast({
           title: '调起支付失败',
           icon:'loading'
         })
       }

      })
    },

    //去评价
    gopingjia:function(e){
      var order_id = e.currentTarget.dataset.id;
      wx.redirectTo({
            url: '/pages/assess/assess?order_id='+order_id+'&type=2',
        })
    },
    //分类点击获取数据
    getordertype:function(e){
        var status = e.currentTarget.dataset.status;
        this.setData({
            s_p:1,
            s_flag:true,
            status: status
        })
        this.getorderlist();
    },
    //获取订单列表
    getorderlist:function(){
        if (this.data.s_flag) {
            var url_r = url + '/index/goods/orderList'
            var _this = this
            app.fetch1(url_r, { user_id: wx.getStorageSync('user_id'), p: _this.data.s_p, status: _this.data.status }, (err, data) => {
                var s_p = _this.data.s_p;
                if (s_p == 1) {
                    _this.setData({
                        orderlist: []
                    })
                    var orderlist = [];
                } else {
                    var orderlist = _this.data.orderlist;
                }
                if (data.code === ERR_OK) {
                    orderlist = orderlist.concat(data.order);
                    s_p = s_p + 1;
                    _this.setData({
                        orderlist: orderlist,
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
    //删除单个订单
    delOrder:function(e){
        var id = e.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index;
        var url_r = url + '/index/goods/delOrder'
        var _this = this
        wx.showModal({
            title: '温馨提示',
            content: '确定删除该订单',
            success: function (res) {
                if (res.confirm) {
                    app.fetch1(url_r, { order_id: id }, (err, data) => {
                        if (data.code == ERR_OK) {
                            var orderlist = _this.data.orderlist;
                            //删除数组指定的下标
                            orderlist.splice(index, 1);
                            _this.setData({
                                orderlist: orderlist
                            })

                        }
                    })
                }

            }
        })
    },

    //确认收货
    confirm: function (e) {
      var id = e.currentTarget.dataset.id;
      var url_r = url + '/index/goods/confirmReceipt'
      var _this = this
      app.fetch1(url_r, { order_id: id }, (err, data) => {
        if (data.code == ERR_OK) {
          _this.setData({
            s_p:1,
            s_flag:true,
            status:4
          })
          _this.getorderlist();

        }
      })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        var status = options.status;
        this.setData({
            s_p: 1,
            s_flag: true,
            status: status
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
        this.getorderlist();
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
        this.getorderlist();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
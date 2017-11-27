// pages/firm_order/firm_order.js
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
        a_id: 0,
        score_type: 0,
        message:''
    },
    //获取留言
    getliuyan:function(e){
        this.setData({
            message: e.detail.value
        }) 
    },
    //提交表单
    firmsubmit:function(){
        var url_r = url + '/index/goods/addOrder'
        var _this = this;
        var a_id = _this.data.a_id;
        console.log(a_id);
        if(a_id == undefined || a_id == 0){
            wx.showToast({
                title: '请先选择地址',
                icon: 'loading',
                duration: 1000
            })
        }else{
            var goods = this.data.goods;
            var g_id = [];
            var num = [];
            var priceId = [];
            for (var i = 0; i < goods.length; i++) {
              g_id.push(goods[i].g_id);
              num.push(goods[i].num);
            }
            app.fetch1(url_r, { type: this.data.stype,user_id: wx.getStorageSync('user_id'), g_id: g_id, sg_id: this.data.priceId, a_id: _this.data.a_id, num: num, score_type: _this.data.score_type, msg: _this.data.message},(err,data)=>{
                if(data.code == ERR_OK){
                  if(_this.data.come == 'cart'){
                    //删除购物车数据
                    var cartlist = [];
                    var cart = wx.getStorageSync('mycaty');
                      for(var j=0;j<g_id.length;j++){
                        for (var i = 0; i < cart.length; i++) {
                        if (cart[i].g_id != g_id[j]){
                          //剩余购物车数据
                          cartlist.push(cart[i]);
                        }
                      }
                    }

                      wx.setStorageSync('mycaty', cartlist);
                  }


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
                        wx.redirectTo({
                          url: '/pages/myorder/myorder?status=1',
                        })
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
        }
    },
    //获取地址
    goodsDetailAddress: function () {
       
        var url_r = url + '/index/user/goodsDetailAddress'
        var _this = this;
        app.fetch1(url_r, { user_id: wx.getStorageSync('user_id') }, (err, data) => {
            if (data.code == ERR_OK) {
                _this.setData({
                    address: data.data,
                    a_id: data.data.a_id
                })
            }else{
                _this.setData({
                    address: '',
                    a_id: 0
                })
            }
        })
       
    },

    orderConfirm: function () {
        var url_r = url + '/index/goods/orderConfirm';
        app.fetch1(url_r, {type:this.data.stype,g_id: this.data.g_id, sg_id: this.data.priceId, user_id: wx.getStorageSync('user_id'),num:this.data.num }, (err, data) => {
            if (data.code == ERR_OK) {
                var good = data.data;
                var total_price = 0;
                var freight = 0;
                for(var i=0;i<good.length;i++){
                  total_price += good[i].price * good[i].num
                  freight += good[i].freight
                }
                var total = total_price
                total_price += freight
                //var total_price = data.data.price * this.data.num;
                this.setData({
                    goods: data.data,
                    price: data.data.price,
                    total_price: total_price,
                    total: total,
                    score:data.score,
                    exchang_money: data.exchang_money,
                    freight: freight
                })
            }
        })
    },

  getTotalPrice:function(){
    var good = this.data.goods;
    var freight = this.data.freight;
    var total_price = 0;
    var total = 0;
    for (var i = 0; i < good.length; i++) {
      total += good[i].price * good[i].num
    }
    total_price = total + freight;
    
    this.setData({
      total_price: total_price.toFixed(2),
      total: total.toFixed(2),
    })

  },

    // 增加数量
    addCount(e) {
        var index = e.currentTarget.dataset.index;
        var good = this.data.goods;
        var num = good[index].num;
        num++;
        good[index].num = num;
        this.setData({
            goods: good,
        })

         this.getTotalPrice();
    },
    // 减少数量
    minusCount(e) {
      var index = e.currentTarget.dataset.index;
      var good = this.data.goods;
      var num = good[index].num;
        if (num > 1) {
            num--;
        } else {
            num = 1;
        }
        good[index].num = num;
        this.setData({
          goods: good,
        })

         this.getTotalPrice();
    },
    //积分选择
    switch1Change: function (e) {
        var aa = this.data.exchang_money;
        var total_price = this.data.total_price;
        // var price = this.data.price;
        // var num = this.data.num;
        if (e.detail.value == false){
            this.setData({
                score_type:0,
            })
            this.getTotalPrice();
        }else{
          var total = total_price - aa;
          if(total <= 0){
            wx.showToast({
              title: '不可使用积分',
              icon:'loading'
            })
          }else{
            this.setData({
              score_type: 1,
              total_price: total_price - aa
            })
          } 
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var stype = options.type;
      var come = options.come ? options.come : '';
        var num = options.num;
        var g_id = options.g_id;
        var priceId = options.priceId;
        this.setData({
            come:come,
            stype:stype,
            num: num,
            g_id: g_id,
            priceId: priceId
        })
        this.orderConfirm();


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
        
        this.goodsDetailAddress();
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
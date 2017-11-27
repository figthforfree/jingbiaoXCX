// pages/cart/cart.js
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
        carts: [],               // 购物车列表
        hasList: false,          // 列表是否有数据
        totalPrice: 0,           // 总价，初始为0
        selectAllStatus: true    // 全选状态，默认全选
    },

    //去结算
    pay:function(){
      var cart = this.data.carts;
      var g_id = [];
      var num = [];
      var priceId = [];
      for(var i=0;i<cart.length;i++){
        if (cart[i].selected){
          g_id.push(cart[i].g_id);
          num.push(cart[i].num);
          priceId.push(cart[i].priceId);
        }
      }

      if(!g_id[0]){
        wx.showToast({
          title: '请先选择',
        })
        return 
      }
      //跳转到结算页面
      wx.redirectTo({
        url: '/pages/firm_order/firm_order?come=cart&type=0&num='+num+'&g_id='+g_id+'&priceId='+priceId,
      })


    },
    //获取购物车数据
    cartList:function(){
      var cartlist = wx.getStorageSync('mycaty');
      if(cartlist){
        var total_price = 0;
        for(var i=0;i<cartlist.length;i++){
          cartlist[i].selected = 1;
          total_price += cartlist[i].num * cartlist[i].price; 
        }
        this.setData({
          hasList: true,
          totalPrice:total_price,
          carts:cartlist
        })
      }

    },
    
    //计算总价
    getTotalPrice() {
        let carts = this.data.carts;                  // 获取购物车列表
        let total = 0;
        for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
            if (carts[i].selected) {                   // 判断选中才会计算价格
                total += carts[i].num * carts[i].price;     // 所有价格加起来
            }
        }
        this.setData({                                // 最后赋值到data中渲染到页面
            carts: carts,
            totalPrice: total.toFixed(2)
        });
    },
    //选择时间
    selectList(e) {
        const index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
        let carts = this.data.carts;                    // 获取购物车列表
        const selected = carts[index].selected;         // 获取当前商品的选中状态
        carts[index].selected = !selected;              // 改变状态
        var selectAllStatus = true;
        for(var i=0;i<carts.length;i++){
          if (!carts[i].selected){
             selectAllStatus = false;
            break;
          }
        }

        this.setData({
            selectAllStatus: selectAllStatus,
            carts: carts
        });
        this.getTotalPrice();                           // 重新获取总价
    },
    //全选
    selectAll(e) {
        let selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
        selectAllStatus = !selectAllStatus;
        let carts = this.data.carts;

        for (let i = 0; i < carts.length; i++) {
            carts[i].selected = selectAllStatus;            // 改变所有商品状态
        }
        this.setData({
            selectAllStatus: selectAllStatus,
            carts: carts
        });
        this.getTotalPrice();                               // 重新获取总价
    },
    // 增加数量
    addCount(e) {
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let num = carts[index].num;
        num = num + 1;
        carts[index].num = num;
        this.setData({
            carts: carts
        });
        wx.setStorageSync('mycaty', carts)
        this.getTotalPrice();
    },
    // 减少数量
    minusCount(e) {
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let num = carts[index].num;
        if (num <= 1) {
            return false;
        }
        num = num - 1;
        carts[index].num = num;
        this.setData({
            carts: carts
        });
        wx.setStorageSync('mycaty', carts)
        this.getTotalPrice();
    },
    //删除
    deleteList(e) {
      var _this = this;
      wx.showModal({
        title: '提示',
        content: '确定要删除该商品',
        success: function (res) {
          const index = e.currentTarget.dataset.index;
          let carts = _this.data.carts;
          carts.splice(index, 1);              // 删除购物车列表里这个商品
          _this.setData({
            carts: carts
          });
          wx.setStorageSync('mycaty', carts)
          if (!carts.length) {                  // 如果购物车为空
            _this.setData({
              hasList: false              // 修改标识为false，显示购物车为空页面
            });
          } else {                              // 如果不为空
            _this.getTotalPrice();           // 重新计算总价格
          }

        }
      })
        
    },  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      
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
      this.cartList();
        // this.setData({
        //     hasList: true,        // 既然有数据了，那设为true吧
        //     carts: [
        //         { id: 1, title: '测试数据1', image: '../../img/1_2.jpg', num: 4, price: 0.01 },
        //         { id: 2, title: '测试数据2', image: '../../img/1_2.jpg', num: 1, price: 0.03 }
        //     ]
        // });
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
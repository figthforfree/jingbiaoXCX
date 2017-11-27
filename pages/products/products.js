// pages/products/products.js
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
        price_asc: 0,
        sale_asc: 1,
        keyword: '',
        s_p: 1,
        s_flag: true,
    },
    //销量排序
    paixu1: function (e) {
        var sale_asc = e.currentTarget.dataset.status;
        if(sale_asc != 1){
          this.setData({
            sale_asc: 1,
            price_asc: 0,
            s_p: 1,
            s_flag: true,
          })
          this.goodsList();
        }   

    },
    //价格排序
    paixu2:function(e){
        var price_asc = e.currentTarget.dataset.status;
        if(price_asc == 0){
           price_asc == 1;
        }
        if (price_asc == 1){
            this.setData({
              sale_asc: 0,
              price_asc:2,
              s_p: 1,
              s_flag: true,
            })
        }else{
          this.setData({
              sale_asc: 0,
              price_asc: 1,
              s_p: 1,
              s_flag: true,
          })
        }
        this.goodsList();
        
    },
    //获取列表
    goodsList: function () {
        var url_r = url + '/index/goods/goodsList';
        var _this =this;
        if (!this.data.s_flag){
          return
        }
        app.fetch1(url_r, { cat_id: this.data.cat_id, keyword: this.data.keyword, p: this.data.s_p, price_asc: this.data.price_asc, sale_asc: this.data.sale_asc }, (err, data) => {
            var s_p = _this.data.s_p;
            if (s_p == 1) {
                _this.setData({
                    goodsList: []
                })
                var goodsList = [];
            } else {
                var goodsList = _this.data.goodsList;
            }
            if (data.code === ERR_OK) {
                goodsList = goodsList.concat(data.data);
                s_p = s_p + 1;
                
                _this.setData({
                    goodsList: goodsList,
                    type: goodsList.type,
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
        var cat_id = options.cat_id == undefined ? 0 : options.cat_id;
        var keyword = options.keyword == undefined ? '' : options.keyword;
        this.setData({
            cat_id: cat_id,
            keyword: keyword,
            s_p: 1,
            s_flag: true,
        })

        this.goodsList();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (options) {


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
      this.goodsList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
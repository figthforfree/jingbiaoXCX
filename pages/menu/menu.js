// pages/menu/menu.js
const app = getApp()
let ERR_OK = 200;
let url = app.globalData.url;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        url: url,
        pmenu: []
    },
    //获取分类数据
    getCategory: function () {
        var url_r = url + '/index/index/getCat';
        app.fetch1(url_r, { p_id: 0 }, (err, data) => {
            //console.log(data);
            if (data.code === ERR_OK) {
                var cur_id = data.data[0].cat_id;
                this.setData({
                    cur_id: 0,
                    pmenu: data.data
                })

                //获取推荐的子分类
                this.getbest();
                //获取该分类下的子分类
                //this.getChild(cur_id);

            }
        })
    },
    getbest: function () {
        var url_r = url + '/index/index/getCat';
        app.fetch1(url_r, { is_best: 1 }, (err, data) => {
            console.log(data);
            if (data.code === ERR_OK) {
                this.setData({
                    child: data.data
                })
            } else {
                this.setData({
                    child: []
                })
            }
        })
    },
    getChild: function (cat_id) {
        var url_r = url + '/index/index/getCat';
        app.fetch1(url_r, { p_id: cat_id }, (err, data) => {
            if (data.code === ERR_OK) {
                this.setData({
                    child: data.data
                })
            } else {
                this.setData({
                    child: []
                })
            }
        })
    },
    changecat: function (e) {
        var cat_id = e.currentTarget.dataset.id;
        this.setData({
            cur_id: cat_id
        })
        //如果分类为0 获取推荐
        //如果分类为-1 
        if (cat_id == -1) {
          this.setData({
            child: []
          })
        }else if (cat_id == 0) {
            this.getbest();
        } else {
            this.getChild(cat_id);
        }
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCategory();

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
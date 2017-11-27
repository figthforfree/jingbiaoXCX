// pages/insurance/insurance.js
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
        s_p: 1,
        s_flag: true,
        b_id: 0,
        money_w: 0,
        b_status:1
    },
    //信用卡服务银行
    getData: function () {
        var url_r = url + '/index/services/getData';
        var _this = this;
        app.fetch1(url_r, { type: 1 }, (err, data) => {
            //console.log(data);
            if (data.code === ERR_OK) {
                _this.setData({
                    yinhangData: data.data
                })
            }
        })
    },
    //查银行
    getyh: function (e) {
        var b_id = e.currentTarget.dataset.id;
        this.setData({
            b_id: b_id,
            s_p: 1,
            s_flag: true,
            showModalStatus: false,
        })
        this.xykList();
    },
    //查年费
    getnf: function (e) {
        var money_w = e.currentTarget.dataset.static;
        if (money_w == 1){
            this.setData({
                money_w: 0,
                s_p: 1,
                s_flag: true,
            })
        }else{
            this.setData({
                money_w: 1,
                s_p: 1,
                s_flag: true,
            })
        }
        
        this.xykList();
    },
    //获取列表
    xykList: function () {
        var url_r = url + '/index/services/creditCard';
        var _this = this;

        if (!_this.data.s_flag) {
            return
        }
        app.fetch1(url_r, { b_id: _this.data.b_id, money_w: _this.data.money_w, p: _this.data.s_p }, (err, data) => {
            console.log(data);
            var s_p = _this.data.s_p;
            if (s_p == 1) {
                _this.setData({
                    xykList: []
                })
                var xykList = [];
            } else {
                var xykList = _this.data.xykList;
            }
            if (data.code === ERR_OK) {
                xykList = xykList.concat(data.data);
                s_p = s_p + 1;

                _this.setData({
                    xykList: xykList,
                    s_p: s_p
                })
            } else {
                _this.setData({
                    s_flag: false
                })
            }
        })
    },
    //点击选排序
    selectCat: function (e) {
        // console.log("设置显示状态，1显示0不显示", e.currentTarget.dataset.status);

        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(-300).step()
        this.setData({
            animationData: animation.export()
        })
        if (e.currentTarget.dataset.status == 1) {
            //this.getCartList();
            this.setData(
                {
                  b_status:0,
                  showModalStatus: true
                }
            );
        }
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation
            })
            if (e.currentTarget.dataset.status == 0) {
                this.setData(
                    {
                      b_status: 1,
                      showModalStatus: false
                    }
                );
            }
        }.bind(this), 200)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getData();
        this.xykList();
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
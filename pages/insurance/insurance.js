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
        c_id:0,
        i_id:0,
        c_status:1,
        x_status:1
    },
    //保险服务公司类型
    getData: function () {
        var url_r = url + '/index/services/getData';
        var _this = this;
        app.fetch1(url_r, { type: 2 }, (err, data) => {
            //console.log(data);
            if (data.code === ERR_OK) {
                _this.setData({
                    gsData: data.data
                })
            }
        })
    },
    //保险服务险种类型
    getData2: function () {
        var url_r = url + '/index/services/getData';
        var _this = this;
        app.fetch1(url_r, { type: 4 }, (err, data) => {
            //console.log(data);
            if (data.code === ERR_OK) {
                _this.setData({
                    xzData: data.data
                })
            }
        })
    },
    //查公司
    getgs:function(e){
        var c_id = e.currentTarget.dataset.cid;
        this.setData({
            c_id :c_id,
            s_p:1,
            s_flag:true,
            showModalStatus: false,
        })
        this.baoxianList();
    },
    //查险种
    getxz: function (e) {
        var i_id = e.currentTarget.dataset.iid;
        this.setData({
            i_id: i_id,
            s_p: 1,
            s_flag: true,
            showModalStatus2: false,
        })
        this.baoxianList();
    },
    //获取列表
    baoxianList: function () {
        var url_r = url + '/index/services/insurance';
        var _this = this;
        
        if (!_this.data.s_flag) {
            return
        }
        app.fetch1(url_r, { c_id: _this.data.c_id, i_id: _this.data.i_id, p: _this.data.s_p }, (err, data) => {
            //console.log(data);
            var s_p = _this.data.s_p;
            if (s_p == 1) {
                _this.setData({
                    baoxianList: []
                })
                var baoxianList = [];
            } else {
                var baoxianList = _this.data.baoxianList;
            }
            if (data.code === ERR_OK) {
                baoxianList = baoxianList.concat(data.data);
                s_p = s_p + 1;

                _this.setData({
                    baoxianList: baoxianList,
                    s_p: s_p
                })
            } else {
                _this.setData({
                    s_flag: false
                })
            }
        })
    },
    //点击选公司
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
                  c_status:0,
                  x_status:1,
                  showModalStatus: true,
                  showModalStatus2: false
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
                      c_status: 1,
                      x_status: 1,
                      showModalStatus: false
                    }
                );
            }
        }.bind(this), 200)
    },
    //点击选险种
    selectCat2: function (e) {
        // console.log("设置显示状态，1显示0不显示", e.currentTarget.dataset.status);

        var animation = wx.createAnimation({
          duration: 200,
          timingFunction: "linear",
          delay: 0
        })
        this.animation = animation
        animation.translateY(-300).step()
        this.setData({
          animationData2: animation.export()
        })
        if (e.currentTarget.dataset.status == 1) {
            //this.getCartList();
            this.setData(
                {
                  x_status: 0,
                  c_status:1,
                  showModalStatus2: true,
                  showModalStatus: false,
                }
            );
        }
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData2: animation
            })
            if (e.currentTarget.dataset.status == 0) {
                this.setData(
                    {
                      x_status: 1,
                      c_status: 1,
                      showModalStatus2: false
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
        this.getData2();
        this.baoxianList();//保险列表
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
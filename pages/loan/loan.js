// pages/loan/loan.js
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
        s_p: 1,
        s_flag: true,
        b_id: 0,
        q_id: 0,
        month_interest: 0,
        b_status:1,
        q_status:1
    },
    //贷款服务银行
    getData: function () {
        var url_r = url + '/index/services/getData';
        var _this = this;
        app.fetch1(url_r, { type: 1 }, (err, data) => {
            //console.log(data);
            if (data.code === ERR_OK) {
                _this.setData({
                    yhData: data.data
                })
            }
        })
    },
    //贷款服务额度
    getData2: function () {
        var url_r = url + '/index/services/getData';
        var _this = this;
        app.fetch1(url_r, { type: 3 }, (err, data) => {
            //console.log(data);
            if (data.code === ERR_OK) {
                _this.setData({
                    edData: data.data
                })
            }
        })
    },
    //查银行
    getyh: function (e) {
        var b_id = e.currentTarget.dataset.bid;
        this.setData({
            b_id: b_id,
            s_p: 1,
            s_flag: true,
            showModalStatus: false,
        })
        this.daikuanList();
    },
    //查额度
    geted: function (e) {
        var q_id = e.currentTarget.dataset.qid;
        this.setData({
            q_id: q_id,
            s_p: 1,
            s_flag: true,
            showModalStatus2: false,
        })
        this.daikuanList();
    },
    //查月利息
    getlixi: function (e) {
      this.setData({
        showModalStatus2: false,
        showModalStatus: false,
        b_status: 1,
        q_status: 1
      })
        var month_interest = e.currentTarget.dataset.static;
        if (month_interest == 1) {
            this.setData({
                month_interest: 0,
                s_p: 1,
                s_flag: true,
            })
        } else {
            this.setData({
                month_interest: 1,
                s_p: 1,
                s_flag: true,
            })
        }

        this.daikuanList();
    },
    //获取列表
    daikuanList: function () {
        var url_r = url + '/index/services/loanservice';
        var _this = this;

        if (!_this.data.s_flag) {
            return
        }
        app.fetch1(url_r, { b_id: _this.data.b_id, q_id: _this.data.q_id, p: _this.data.s_p, month_interest: _this.data.month_interest }, (err, data) => {
            console.log(data);
            var s_p = _this.data.s_p;
            if (s_p == 1) {
                _this.setData({
                    daikuanList: []
                })
                var daikuanList = [];
            } else {
                var daikuanList = _this.data.daikuanList;
            }
            if (data.code === ERR_OK) {
                daikuanList = daikuanList.concat(data.data);
                s_p = s_p + 1;

                _this.setData({
                    daikuanList: daikuanList,
                    s_p: s_p
                })
            } else {
                _this.setData({
                    s_flag: false
                })
            }
        })
    },
    //点击选银行
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
                  q_status:1,
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
                      b_status: 1,
                      q_status: 1,
                      showModalStatus: false
                    }
                );
            }
        }.bind(this), 200)
    },
    //点击选额度
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
                  b_status: 1,
                  q_status: 0,
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
                      b_status: 1,
                      q_status: 1,
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
        this.daikuanList();
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
// pages/models/models.js
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
        dailogmodel: false,
        dailogmodel2: false,
        isScroll: true,//控制底层滚动条
        dianjisou: false,//控制取消按钮
        searchinput: '',//默认数据
        s_p:1,
        s_flag:true,
        toView: 'inToViewA',  
    },
    //获取搜索关键字
    getkw: function (e) {
        this.setData({
            kw: e.detail.value
        })
    },

    //获取热门品牌
    getHotCarBrand: function () {
        var url_r = url + '/index/index/getHotCarBrand';
        var _this = this;
        app.fetch1(url_r, {}, (err, data) => {
            //console.log(data);
            if (data.code == ERR_OK) {
                _this.setData({
                    HotCarBrand: data.data
                })
            }
        })
    },
    //获取车辆品牌列表
    getCarBrand: function () {
        var url_r = url + '/index/index/getCarBrand';
        var _this = this;
        app.fetch1(url_r, {}, (err, data) => {
            console.log(data);
            if (data.code == ERR_OK) {
                _this.setData({
                    CarBrand: data.data
                })
            }
        })
    },
    //获取品牌下的车型
    getVehicleModel: function (id) {
        var url_r = url + '/index/index/getVehicleModel';
        var _this = this;
        app.fetch1(url_r, { id: id }, (err, data) => {
            //console.log(data);
            if (data.code == ERR_OK) {
                _this.setData({
                    VehicleModel: data.data
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getHotCarBrand();
        this.getCarBrand();

    },
    //跳转排量
    xuanpl: function (e) {
        console.log(e);
        var id = e.currentTarget.dataset.id;
        var user_id = wx.getStorageSync('user_id');
        var url_r = url + '/index/index/addUserCarModel';
        var _this = this;
        app.fetch1(url_r, { id: id, user_id: user_id }, (err, data) => {
            if (data.code == ERR_OK) {
                wx.redirectTo({
                    url: '/pages/models_p/models_p?user_car_id=' + data.user_car_id + '&id=' + id,
                })
            }
        })
    },
    //去搜索
    goseach: function (e) {
        var url_r = url + '/index/index/getCarByWord';
        var _this = this;
        var word = e.detail.value;
        if (word != undefined && word != '') {
            app.fetch1(url_r, { word: word, p: this.data.s_p }, (err, data) => {
              if (data.code == ERR_OK) {
                _this.setData({
                  seachlist: data.data
                })
              } else {
                _this.setData({
                  seachlist: ''
                })
              }
            })
             
        } else {
            _this.setData({
                seachlist: ''
            })
        }
    },
    //取消搜索
    untanseach: function () {
        var isScroll = this.data.isScroll;
        this.setData(
            {
                isScroll: true,
                showModalStatus2: false,
                dianjisou: false,//取消按钮隐藏
                searchinput: '',//清空input默认值
                kw: '',//清空data里面的kw
                seachlist: '',//清空搜索结果
                //dailogmodel2: false
            }
        );
    },
    //搜索弹窗显示
    tanseach: function (e) {
        //var id = e.currentTarget.dataset.topid;
        var isScroll = this.data.isScroll;
        var animation = wx.createAnimation({
            duration: 400,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        //animation.translateX(375).step()

        this.setData({
          s_p: 1,
          s_flag: true,
            animationData: animation.export()
        })

        if (e.currentTarget.dataset.status == 1) {

            this.setData(
                {
                    isScroll: false,
                    showModalStatus2: true,
                    dianjisou: true,//取消按钮出现
                    //dailogmodel: true
                }
            );
        }

        setTimeout(function () {
            animation.translateX(95).step()
            this.setData({
                animationData2: animation
            })
            if (e.currentTarget.dataset.status == 0) {
                this.setData(
                    {
                        showModalStatus2: false,
                        dailogmodel2: false
                    }
                );
            }
        }.bind(this), 200)
    },
    //品牌弹窗显示
    tanselect: function (e) {
        var id = e.currentTarget.dataset.topid;
        var animation = wx.createAnimation({
            duration: 400,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateX(375).step()

        this.setData({
            path: e.currentTarget.dataset.path,
            name: e.currentTarget.dataset.name,
            animationData: animation.export()
        })
        //获取页面高度
        // wx.getSystemInfo({
        //     success: function (res) {
        //         var wh =res.windowHeight
        //     }
        // })
        if (e.currentTarget.dataset.status == 1) {
            this.getVehicleModel(id);
            this.setData(
                {
                    showModalStatus: true,
                    dailogmodel: true
                }
            );
        }

        setTimeout(function () {
            animation.translateX(95).step()
            this.setData({
                animationData: animation
            })
            if (e.currentTarget.dataset.status == 0) {
                this.setData(
                    {
                        showModalStatus: false,
                        dailogmodel: false
                    }
                );
            }
        }.bind(this), 200)
    },
    //点击锚跳转
    scrollToViewFn: function (e) {
        var _id = e.target.dataset.id;
        this.setData({
            toView: 'inToView' + _id
        })
        console.log(this.data.toView)

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
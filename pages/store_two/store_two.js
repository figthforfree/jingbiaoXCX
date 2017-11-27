var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var demo = new QQMapWX({
    key: 'CHTBZ-QOZR6-7S6ST-MZHSR-BO7BH-HQBV4' // 必填
});

// pages/store/store.js
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
        morenstatus:3
    },
    //选取城市下的分区
    getDistrict:function(){
        var url_r = url + '/index/index/getDistrict';
        var _this = this;
        app.fetch1(url_r, { city: wx.getStorageSync('city') }, (err, data) => {
            if (data.code === ERR_OK) {
                this.setData({
                    District: data.store
                })
            }
        })

    },

    //默认排序
    chose:function(e){
      var status = e.currentTarget.dataset.status;
      var old_status = this.data.status;
      this.setData({
        morenstatus:status,
        showModalStatus2: false
      })
      if(old_status != status){
        this.getstoreList()
      }
    },

    //选地区排序
    xuandq:function(e){
        var dq = e.currentTarget.dataset.name;
        this.setData({
            district:dq,
            showModalStatus: false
        })
        wx.setStorage({
            key: 'district',
            data: dq,
        })
        this.getstoreList()
    },
    //获取门店列表
    getstoreList: function () {
            var _this = this;
            var city = wx.getStorageSync('city');
            // var district = wx.getStorageSync('district');
            if (_this.data.district){
                var district = _this.data.district;
            }else{
                var district = '所有';
            }
            
            //当前位置，缓存xy
            var longitude = wx.getStorageSync('longitude');
            var latitude = wx.getStorageSync('latitude');
            var url_r = url + '/index/index/storeList';
            app.fetch1(url_r, {ser_id:this.data.ser_id, status: this.data.morenstatus, city: city, country: district, latitude: latitude, longitude: longitude}, (err, data) => {
                if (data.code === ERR_OK) {
                    var store = data.data;
                    // console.log(data)
                    this.setData({
                        store: store,
                        district: district
                    })
                }else if(date.code === 201){
                  this.setData({
                    store: []
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
                    showModalStatus: true,
                    showModalStatus2:false
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
                        showModalStatus: false
                    }
                );
            }
        }.bind(this), 200)
    },
    //点击选排序2
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
                    showModalStatus2: true,
                    showModalStatus: false
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
                        showModalStatus2: false
                    }
                );
            }
        }.bind(this), 200)
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '京骉车宝-门店',
            path: '/pages/store/store',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        //获取该服务有无开启
        this.setData({
          ser_id:id
        })
        this.getstoreList();
        this.getDistrict();
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
        this.getstoreList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
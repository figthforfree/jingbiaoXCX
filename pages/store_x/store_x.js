// pages/store_x/store_x.js
var WxParse = require('../../wxParse/wxParse.js');//富文本
//获取应用实例
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
        imgUrls: [
            '../../img/1-5.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            '../../img/1-5.jpg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        p: 1,
        flag: true,
        commentlist: []

    },
    //获取评价
    getComment: function () {
        var url_r = url + '/index/goods/commentList';
        var flag = this.data.flag;
        if (flag) {
            app.fetch1(url_r, { type: 1, id: this.data.id, p: this.data.p }, (err, data) => {
                if (data.code === ERR_OK) {
                    var p = this.data.p;
                    var commentlist = this.data.commentlist;
                    var com = data.data;
                    var len = com.length;
                    for (var i = 0; i < len; i++) {
                        var imgs = new Array();
                        if (com[i]['imgs']) {
                            imgs = com[i]['imgs'].split(',');
                        }
                        com[i]['imgs'] = imgs
                    }
                    commentlist = commentlist.concat(com)
                    p = p + 1;
                    if (len < 5) {
                        var flag = false;
                    } else {
                        var flag = true;
                    }
                    this.setData({
                        flag: flag,
                        p: p,
                        commentlist: commentlist
                    })

                } else {
                    this.setData({
                        flag: false
                    })
                }
            })
        }


    },
    getMoreComment: function () {
        this.getComment()
    },
    //获取门店详情
    getstoreD: function (id) {
        var url_r = url + '/index/index/getStoreDetail'
        var _this = this;
        //当前位置，缓存xy
        var longitude = wx.getStorageSync('longitude');
        var latitude = wx.getStorageSync('latitude');
        app.fetch1(url_r, { id: id, latitude: latitude, longitude: longitude }, (err, data) => {
            console.log(data);
            if (data.code == ERR_OK) {
                _this.setData({
                    storeimg: data.img,
                    storeimgi: data.img.length,
                    storeD: data.store
                })
                WxParse.wxParse('contents', 'html', this.data.storeD.content, this, 0);
            }
        })
    },

    bindser: function (e) {
        //url='/pages/book/book?id='+id 
        var id = e.currentTarget.dataset.id;
        
        var _this = this;
        if (this.data.user == undefined || !this.data.user) {
            var url_r = url + '/index/user/getUseInfo';
            var _this = this;
            //获取用户信息
            app.fetch1(url_r, { user_id: wx.getStorageSync('user_id') }, (err, data) => {
                //console.log(data.data);
                if (data.code == ERR_OK) {
                    _this.setData({
                        user: data.data
                    })

                    if (_this.data.user.is_check == 5) {
                        wx.navigateTo({
                            url: '/pages/book/book?id=' + id,
                        })
                    } else {
                        wx.showModal({
                            title: '温馨提示',
                            content: '绑定会员才能添加爱车哦',
                            success: function (res) {
                                if (res.confirm) {
                                    wx.switchTab({
                                        url: '/pages/users/users',
                                    })
                                }
                            }
                        })
                    }
                }
            })
        } else {
            if (_this.data.user.is_check == 5) {
                wx.navigateTo({
                    url: '/pages/book/book?id=' + id,
                })
            } else {
                wx.showModal({
                    title: '温馨提示',
                    content: '绑定会员才能添加爱车哦',
                    success: function (res) {
                        if (res.confirm) {
                            wx.switchTab({
                                url: '/pages/users/users',
                            })
                        }
                    }
                })
            }
        }

    },

    /**
   * 监听定位到当前位置
   */
    listenerBtnGetLocation: function () {
        //wx.getLocation({
        //type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        //success: function (res) {
        var latitude = parseFloat(this.data.storeD.latitude)
        var longitude = parseFloat(this.data.storeD.longitude)
        var name = this.data.storeD.name
        var address = this.data.storeD.address
        console.log(latitude);
        console.log(longitude);
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28,
            name: name,
            address: address,
            success: function (res) {
                console.log(res);
                console.log('来了');
            },
        })
        //}
        //})
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        this.setData({
          id:id
        })
        
        this.getstoreD(id);

        this.getComment();
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
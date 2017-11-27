var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var demo = new QQMapWX({
  key: 'CHTBZ-QOZR6-7S6ST-MZHSR-BO7BH-HQBV4' // 必填
});
//index.js
const app = getApp();
//获取应用实例
let ERR_OK = 200;
let url = app.globalData.url;

Page({
    data: {
        url: url,
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),

        imgUrls: [
            '../../img/1-5.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            '../../img/1-5.jpg'
        ],
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000
    },

    //index/index/getReservationCar选择要服务的车
    getReservationCar: function () {
        var url_r = url + '/index/index/getReservationCar';
        app.fetch1(url_r, { user_id: wx.getStorageSync('user_id') }, (err, data) => {
            if (data.code === ERR_OK) {
                this.setData({
                    car: data.car['brand_name'],
                    car_id: data.car.id
                })
            } else {
                this.setData({
                    car: '车库还是空的，赶紧添加一辆爱车吧',
                    car_id: 0
                })
            }
        })
    },
    //获取首页banner
    getbanner: function () {
        var url_r = url + '/index/index/getbanner';
        app.fetch1(url_r, { id: 2 }, (err, data) => {
            if (data.code === ERR_OK) { 
                // 设置banner
                this.setData({
                    slider: data.data
                })
            }
        });
    },
    //获取秒杀banner
    getmbanner: function () {
      var url_r = url + '/index/index/getbanner';
      app.fetch1(url_r, { id: 3 }, (err, data) => {
        if (data.code === ERR_OK) {
          // 设置banner
          this.setData({
            mbanner: data.data
          })
        }
      });
    },
    //获取商品推荐
    getbestgoods1: function () {
        var url_r = url + '/index/index/getBsetGoods';
        var _this = this;
        app.fetch1(url_r, { type: 1 }, (err, data) => {
            //console.log(data);
            
            if (data.code === ERR_OK) {
                // 设置banner
                this.setData({
                    bestgood: data.data
                })
            }
        })
    },
    //获取产品推荐
    getbestgoods2:function(){
        var url_r = url + '/index/index/getBsetGoods';
        var _this =this;
        app.fetch1(url_r,{ type : 2 },(err,data)=>{
            if (data.code === ERR_OK) {
                // 设置banner
                this.setData({
                    bestgoods: data.data
                })
            }
        })
    },
   
    //获取个人信息--绑定车辆
    getusers: function () {
        var _this = this;
        if(this.data.user == undefined || !this.data.user){
            var url_r = url + '/index/user/getUseInfo';
            var _this = this;
            //获取用户信息
            app.fetch1(url_r, { user_id: wx.getStorageSync('user_id') }, (err, data) => {
                //console.log(data.data);
                if (data.code == ERR_OK) {
                    _this.setData({
                        user: data.data
                    })

                    if (this.data.user.phone != '' && this.data.user.phone != null) {
                        wx.navigateTo({
                            url: '/pages/mycar/mycar',
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
        }else{
          if (this.data.user.phone != '' && this.data.user.phone != null) {
                wx.navigateTo({
                    url: '/pages/mycar/mycar',
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
    //获取用户信息
    getUserInfo: function () {
        var user_id = wx.getStorageSync("user_id");
        if (user_id) {
            return;
        }
        var code;
        var _this = this;
        wx.login({
            success: function (res) {
                code = res.code
                //获取用户信息
                wx.getUserInfo({
                    success: function (res) {
                        var userInfo = res.userInfo
                        var nickName = userInfo.nickName
                        var avatarUrl = userInfo.avatarUrl
                        var gender = userInfo.gender //性别 0：未知、1：男、2：女
                        var province = userInfo.province
                        var city = userInfo.city
                        var country = userInfo.country;
                        //用户nickname
                      
                        
                        _this.setUserInfo(code, nickName, avatarUrl, gender, province, city, country);
                    },
                    fail: function (e) {
                        wx.showToast({
                            title: '您拒绝了授权，页面不能正常访问',
                            image: '/image/warning.png',
                            duration: 3000
                        })

                        //重新授权
                        wx.openSetting({
                            success: (res) => {
                                /** 
                                res.authSetting = {
                                  "scope.userInfo": true,
                                  "scope.userLocation": true
                                  }
                                  */
                                _this.getUserInfo();
                            }
                        })

                    },
                })
            }
        })
    },

    setUserInfo: function (code, nickName, avatarUrl, gender, province, city, country) {
        var url_r = url + '/index/index/setUserInfo';
        var _this = this;
        app.fetch1(url_r, { p_id:_this.data.p_id,code: code, nickname: nickName, gender: gender, avatarUrl: avatarUrl }, (err, data) => {
            if (data.code === ERR_OK) {
                // 缓存user_id
                var user_id = data.user_id;
                wx.setStorageSync("user_id", user_id);
            } else {
                console.log(data.msg)
            }

        })


    },
    //获取首页6大业务模块
    getyewu: function () {
      var _this = this;
      var url_r = url + '/index/store/getTopService'
      app.fetch1(url_r, {}, (err, data) => {
        //console.log(data);
        if (data.code === ERR_OK) {
          _this.setData({
            yewulist: data.data
          })
        }
      })
    },


    //搜索商品kw 
    search_kw:function(e){
      var kw = e.detail.value;
      wx.navigateTo({
        url: '/pages/products/products?keyword='+kw,
      })
    },
    //获取当前定位
    getLocation:function(){
      var _this = this;
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          // 调用接口
          demo.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success: function (res) {
              //console.log(res);
              var city = res.result.address_component.city;
              var district = res.result.address_component.district;
              wx.setStorage({
                key: 'city',
                data: city,
              })
              wx.setStorage({
                  key: 'district',
                  data: district,
              })
              _this.setData({
                city:city
              })
            },
            fail: function (res) {
              // console.log(res);
            },
            complete: function (res) {
              // console.log(res);
            }
          });
          wx.setStorage({
            key: "latitude",
            data: latitude
          })
          wx.setStorage({
            key: "longitude",
            data: longitude
          })
        },
        fail:function(res){
            var city = '深圳市';
            var district = '福田区';
            wx.setStorage({
                key: 'city',
                data: city,
            })
            wx.setStorage({
                key: 'district',
                data: district,
            })
            _this.setData({
                city: city
            })
            var latitude = 22.543099;
            var longitude = 114.057868;
            wx.setStorage({
                key: "latitude",
                data: latitude
            })
            wx.setStorage({
                key: "longitude",
                data: longitude
            })
        }
      })
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function (options) {
      var p_id = options.user_id ? options.user_id : 0;
      this.setData({
        p_id:p_id
      })
        this.getbanner();
        this.getmbanner();
        this.getyewu();
        this.getbestgoods1();
        this.getbestgoods2(); 
        this.getLocation()
    },
    onReady: function () {
        this.getUserInfo(); 
    },
    onShow: function(){
        
        this.getReservationCar();
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '京骉车宝',
            path: '/pages/index/index',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }


})

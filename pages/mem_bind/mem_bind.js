// pages/mem_bind/mem_bind.js
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
        driving_path: '',
        showModalStatus:false
    },

    //跳过支付
    jump:function(){
        this.setData({
            showModalStatus: false
        })
    //   wx.redirectTo({
    //     url: '/pages/mycar/mycar',
    //   })
    },

    //支付
    pay:function(){
      //去支付
      var url_r = url + '/index/goods/carOrder';
      var user_car_id = this.data.id;
      var price = this.data.price;
      console.log(price)
      if (price == '0.00' || !price){
        wx.showToast({
          title: '该车辆暂未定价',
          icon:'loading'
        })
        return false
      }
      app.fetch1(url_r, { user_car_id: user_car_id  }, (err, data) => {
        if (data.code == ERR_OK) {
          wx.requestPayment(
            {
              'timeStamp': data.data.timeStamp,
              'nonceStr': data.data.nonceStr,
              'package': data.data.package,
              'signType': 'MD5',
              'paySign': data.data.sign,
              'success': function (res) {
                wx.redirectTo({
                  url: '/pages/mycar/mycar',
                })

              },
              'fail': function (res) {
                wx.redirectTo({
                  url: '/pages/mycar/mycar',
                })
              },
              'complete': function (res) {
                console.log(res);
              }
            })

        } else {
          wx.showToast({
            title: '调起支付失败',
            icon: 'loading'
          })
        }
      })



    },


    //提交绑定信息
    tijiaobind: function () {
        var url_r = url + '/index/user/saveDriveInfo';
        var _this = this;
        var license = this.data.chepai;
        var id = this.data.id;
        var frame_num = this.data.chejia;
        var driving_1 = this.data.driving_1;
        var driving_2 = this.data.driving_2;
        var driving_3 = this.data.driving_3;
        console.log(id)
        
        if (!driving_2) {
            wx.showToast({
                title: '请上传车辆照片',
                icon: 'loading',
                duration: 2000
            })
            return
        }
        if (!driving_1) {
            wx.showToast({
                title: '上传行驶证正面',
                icon: 'loading',
                duration: 2000
            })
            return
        }
        if (!driving_3) {
            wx.showToast({
                title: '上传行驶证副证',
                icon: 'loading',
                duration: 2000
            })
            return
        }
        if (license == undefined || license == '') {
            wx.showToast({
                title: '请输入车牌号',
                icon: 'loading',
                duration: 2000
            })
            return
        }


        app.fetch1(url_r, { driving_1: driving_1, driving_2: driving_2, driving_3: driving_3, license: license, user_id: wx.getStorageSync('user_id'), id: id }, (err, data) => {
            console.log(data);
            if (data.code == ERR_OK) {
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000
                })

                if (_this.data.is_qualification == 1){
                  wx.redirectTo({
                    url: '/pages/mycar/mycar',
                  })
                }else{
                  //弹出支付弹窗
                  _this.setData({
                    showModalStatus:true
                  })
                }
            }
        })

    },
    //获取车辆详情
    getusers: function () {
        var url_r = url + '/index/user/getDriveInfo';
        var _this = this;
        var id = this.data.id;
        app.fetch1(url_r, { id: id }, (err, data) => {
            if (data.code == ERR_OK) {
                if(data.data.is_check != 1 && data.data.is_check != 3){
                  //说明没有提交按钮--直接弹出支付弹窗
                  if (!data.data.is_qualification){
                    _this.setData({
                      showModalStatus: true
                    })
                  }
                }
                _this.setData({
                    is_check: data.data.is_check,
                    driving_1: data.data.driving_1,
                    driving_2: data.data.driving_2,
                    driving_3: data.data.driving_3,
                    chepai: data.data.number,
                    texts: data.data.texts,
                    is_qualification: data.data.is_qualification,
                    price:data.price
                })
            }
        })

    },
    //获取车牌
    getchepai: function (e) {
        console.log(e)
        this.setData({
            chepai: e.detail.value
        })
    },

    //上传行驶证正面
    uploadimg1: function () {
        var _this = this;
        var is_check = this.data.is_check;
        if (is_check == 1 || is_check == 3) {
            var url_r = url + '/index/user/imageUpload';
            wx.chooseImage({
                count: 1,
                success: function (res) {
                    wx.showLoading({
                        title: '上传中',
                    })
                    wx.uploadFile({
                        url: url_r,
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        header: { 'content-type': 'multipart/form-data' },
                        success: function (resu) {
                            //转为json对象
                            wx.hideLoading()
                            var data = JSON.parse(resu.data);
                            if (data.code === ERR_OK) {
                                _this.setData({
                                    driving_1: data.path
                                })
                            }
                        }
                    })
                }
            })
        }

    },
    //上传行驶证车照
    uploadimg2: function () {
        var is_check = this.data.is_check;
        console.log(is_check)
        if (is_check == 1 || is_check == 3) {
            var _this = this;
            var url_r = url + '/index/user/imageUpload';
            wx.chooseImage({
                count: 1,
                success: function (res) {
                    wx.showLoading({
                        title: '上传中',
                    })
                    wx.uploadFile({
                        url: url_r,
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        header: { 'content-type': 'multipart/form-data' },
                        success: function (resu) {
                            //转为json对象
                            wx.hideLoading()
                            var data = JSON.parse(resu.data);
                            if (data.code === ERR_OK) {
                                _this.setData({
                                    driving_2: data.path
                                })
                            }
                        }
                    })
                }
            })
        }

    },
    //上传行驶证副证
    uploadimg3: function () {
        var is_check = this.data.is_check;
        if (is_check == 1 || is_check == 3) {
            var _this = this;
            var url_r = url + '/index/user/imageUpload';
            wx.chooseImage({
                count: 1,
                success: function (res) {
                    wx.showLoading({
                        title: '上传中',
                    })
                    wx.uploadFile({
                        url: url_r,
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        header: { 'content-type': 'multipart/form-data' },
                        success: function (resu) {
                            //转为json对象
                            wx.hideLoading()
                            var data = JSON.parse(resu.data);
                            if (data.code === ERR_OK) {
                                _this.setData({
                                    driving_3: data.path
                                })
                            }
                        }
                    })
                }
            })
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.user_car_id ? options.user_car_id : options.id;
        this.setData({
            id: id,
            
        })
        this.getusers();

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getusers();
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
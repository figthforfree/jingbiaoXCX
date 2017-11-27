// pages/book/book.js
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
        date: '选择服务日期',
        time: '选择服务时间',
        ser_name:'选择服务类型',
        car:'选择要服务的车'
    },

    //获取立即预约门店详情
    getStoreNamePath: function () {
        var url_r = url + '/index/index/getStoreNamePath';
        var _this = this;
        app.fetch1(url_r, { id: this.data.mendianid }, (err, data) => {
            
            _this.setData({
                StoreNamePath: data.store
            })
        })
        
    },
    //index/index/getReservationCar选择要服务的车
    getReservationCar:function(){
      var url_r = url + '/index/index/getReservationCar';
      app.fetch1(url_r, { user_id:wx.getStorageSync('user_id') }, (err, data) => {
        if(data.code ===ERR_OK){
          this.setData({
            car:data.car['brand_name']+'-'+data.car['model_name'],
            car_id:data.car.id
          })
        }else{
          this.setData({
            car:'选择要服务的车',
            car_id:0
          })
        }
      })
    },

    //通过id获取预约服务类型信息
    byidgetservice:function(){
        var fuwuid = this.data.fuwuid;
        if(fuwuid != undefined && fuwuid != ''){
            var url_r = url + '/index/index/getServiceById';
            var _this = this;
            app.fetch1(url_r,{id:fuwuid},(err,data)=>{
                _this.setData({
                    ser_name: data.ser_name
                })
            })
        }
    },
    
    //选日期
    bindDateChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },
    //选时间
    bindTimeChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            time: e.detail.value
        })
    },

    //提交预约
    addresv:function(){
      var car_id = this.data.car_id;
      var mendianid = this.data.mendianid;
      var ser_name = this.data.ser_name;
      var date = this.data.date;
      var tim = this.data.time;
      if(!car_id){
        wx.showToast({
          title: '请选择服务车辆',
          duration:2000
        })
        return 
      }
      if (ser_name == '选择服务类型') {
        wx.showToast({
          title: '请选择服务类型',
          duration: 2000
        })
        return
      }
      if (date == '选择服务日期') {
        wx.showToast({
          title: '请选择服务日期',
          duration: 2000
        })
        return
      }
      if (tim == '选择服务时间') {
        wx.showToast({
          title: '请选择服务时间',
          duration: 2000
        })
        return
      }

      var time = date+' '+tim;

      var url_r = url + '/index/store/addReservation';
      app.fetch1(url_r, { id: mendianid, user_id: wx.getStorageSync('user_id'), ser_name: ser_name, user_car_id: car_id, time: time, service_id: this.data.fuwuid},(err,data)=>{
        if(data.code === ERR_OK){
          wx.switchTab({
            url: '/pages/users/users',
          })
        }
      })


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        var fuwuid = options.fuwuid;
        this.setData({
            mendianid:id,
            fuwuid: fuwuid,
        })
        this.getStoreNamePath();
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
        this.byidgetservice();
        this.getReservationCar();
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
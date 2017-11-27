// pages/users/users.js
const app = getApp();
//获取应用实例
let ERR_OK = 200;
let url = app.globalData.url;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: url
    },
    //获取客服电话公司地址
    commonData:function(){
        var url_r = url + '/index/user/commonData';
        var _this = this;
        app.fetch1(url_r, {}, (err, data) => {
            //console.log(data);
            if (data.code == ERR_OK) {
                _this.setData({
                    commonData: data
                })
            } else {
                _this.setData({
                    commonData: ''
                })
            }
        })
    },
    //打电话
    callph: function (e) {
        var phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone, //测试
            success: function () {
                console.log("拨打电话成功！")
            },
            fail: function () {
                console.log("拨打电话失败！")
            }
        })
    },
    /**
   * 监听定位到指定位置
   */
    gohome: function () {
        var latitude = parseFloat(this.data.commonData.latitude)
        var longitude = parseFloat(this.data.commonData.longitude)
        var name = this.data.commonData.company
        var address = this.data.commonData.address
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28,
            name: name,
            address: address,
            success: function (res) {
                console.log(res);
            },
        })
    },
    //转发，分享
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '我的',
            path: '/pages/users/users',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    //获取个人中心单条预约
    getOneReservation: function () {
        var url_r = url + '/index/user/getOneReservation';
        var _this = this;
        app.fetch1(url_r, { user_id: wx.getStorageSync('user_id') }, (err, data) => {
            //console.log(data.data);
            if (data.code == ERR_OK) {
                _this.setData({
                    getOneReservation: data.res
                })
            }else{
                _this.setData({
                    getOneReservation:''
                })
            }
        })

    },
    //获取手机状态跳转
    gobind:function(){
        var is_check = this.data.userinfo.is_check;
        wx.navigateTo({
            url: '/pages/mem_bind_re/mem_bind_re',
        })
    },

    //是否可以添加车辆
    gomycar:function(){
      //url='/pages/mycar/mycar'
      if (this.data.userinfo.phone != '' && this.data.userinfo.phone != null){
        wx.navigateTo({
          url: '/pages/mycar/mycar',
        })
      }else{
        wx.showToast({
          title: '请先绑定会员',
          icon:'loading'
        })
      }

    },
    gomyspread:function(){
        wx.navigateTo({
            url: '/pages/spread/spread',
        })
    },
    //获取个人信息
    getusers: function () {
        var url_r = url + '/index/user/getUseInfo';
        var _this = this;
        //获取用户信息
        app.fetch1(url_r ,{user_id:wx.getStorageSync('user_id')},(err,data)=>{
            //console.log(data.data);
            if(data.code == ERR_OK){
                _this.setData({
                    userinfo:data.data
                })
            }
        })
        
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      
      this.commonData();
      
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
        this.getusers();
        this.getOneReservation();
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
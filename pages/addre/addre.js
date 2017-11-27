// pages/addre/addre.js
const app = getApp();
//获取应用实例
let ERR_OK = 200;
let url = app.globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      region: ['请选择', '请选择', '请选择'],
  },

  addoredit:function(){
    var url_r = url + '/index/user/addOrEdit';
    var name = this.data.name;
    var phone = this.data.phone;
    var address = this.data.address;
    var region = this.data.region;
    if(name == undefined || name == ''){
      wx.showToast({
        title: '请输入联系人',
        duration:2000,
        icon:'loading'
      })
      return
    }

    if (phone == undefined || phone == '') {
      wx.showToast({
        title: '请输入手机号码',
        duration: 2000,
        icon: 'loading'
      })
      return
    }
    var myreg  = /^1[34578][0-9]{9}$/;
    if (!myreg.test(phone)){
      wx.showToast({
        title: '手机号码有误',
        duration: 2000,
        icon: 'loading'
      })
      return
    }

    if (region[0] == '请选择'){
      wx.showToast({
        title: '请选择地址',
        duration: 2000,
        icon: 'loading'
      })
      return
    }

    if (address == undefined || address == '') { 
      wx.showToast({
        title: '请输入详细地址',
        duration: 2000,
        icon: 'loading'
      })
      return
    }

    app.fetch1(url_r,{a_id:this.data.a_id,user_id:wx.getStorageSync('user_id'),name:name,phone:phone,province:region[0],city:region[1],country:region[2],address:address},(err,data)=>{
      wx.navigateBack({
          delta:1
      })
    })


  },

  getDetail:function(){
    var url_r = url + '/index/user/getOneAddress';
    app.fetch1(url_r, { a_id: this.data.a_id}, (err, data) => {
      if(data.code === ERR_OK){
        var region = [data.province,data.city,data.country];
        this.setData({
          name: data.address.name,
          phone: data.address.phone,
          address: data.address.address,
          region: region
        })
      }
    })
  },

  getname:function(e){
    this.setData({
      name:e.detail.value
    })

  },
  getphone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getaddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  bindRegionChange: function (e) {
      this.setData({
          region: e.detail.value
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var a_id = options.a_id == undefined ? 0 : options.a_id;
    this.setData({
      a_id:a_id
    });
    this.getDetail();

  
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
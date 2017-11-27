// pages/sub_card/sub_card.js
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
    tableshow:false,
    showcar: false,
    form_data: '',
    selected1: true,
    second: 60,
    car_name: '',
    car_id: 0,
    chosecar: false, //没有点击选择车辆
  },

  /**
   * 选择车辆
   */
  choseCar: function () {
    wx.navigateTo({
      url: '/pages/mycar/mycar?leixing=1',
    })
    //点击了选择车辆
    this.setData({
      chosecar: true
    })
  },


  /**
  * 表单提交
  */
  formSubmit: function (e) {
    var type = e.detail.target.dataset.type;
    var data = e.detail.value;
    if (type == 'sms') {
      //表单数组的下标
      var index = e.detail.target.dataset.index;
      //发送验证码的字段 为字段名称加上_yzm =》 name_yzm
      var name = e.detail.target.dataset.name;
      //数组第一个值为手机号码字段名称 
      var phone_name = name.split('_')[0];
      for (var i in data) {
        if (i == phone_name) {
          if (data[i]) {
            //验证是否合法手机号
            if (!/^1[34578]\d{9}$/.test(data[i])) {
              wx.showToast({
                title: '手机号有误',
                icon: 'loading',
                duration: 2000
              })
              return false
            }
            //发送验证码--- i 为字段名称
            this.sendsms(data[i], i, index);
          } else {
            wx.showToast({
              title: '请先输入手机号',
              icon: 'loading'
            })
          }
          break;
        }
      }
    } else {
      //提交表单数据
      var flag = false;
      var tabledata = this.data.tabledata;
      for (var i in data) {
        //判断表单数据是否为空
        if (data[i] == '' || data[i] == 0) {
          flag = true;
          break;
        }
      }
      if (flag) {
        wx.showToast({
          title: '表单数据不完整',
          icon: 'loading'
        })
        return
      }
      //是否有验证码
      var phone_name = '';
      for (var i = 0; i < tabledata.length; i++) {
        //说明有手机号码字段 
        if (tabledata[i].type == 'code') {
          phone_name = tabledata[i].name_en;
          break;
        }
      }
      if (phone_name) {
        //验证手机号及验证码
        var send_yzm = this.data.sendyzm; //发送的验证码
        var send_phone = this.data.sendphone; //发送验证码的手机号
        var input_yzm = ''; //用户输入的验证码
        var input_phone = ''; //用户输入的手机号
        var input_yzm_name = phone_name + '_yzm';  //验证码字段名
        for (var i in data) {
          if (i == input_yzm_name) {
            input_yzm = data[i];
            //在提交的数据中删除验证码字段
            delete data[i];
          }
          if (i == phone_name) {
            input_phone = data[i];
          }

          //删除验证码数据字段
        }
        //检查用户输入的验证码
        if (send_yzm != input_yzm) {
          wx.showToast({
            title: '验证码错误',
            icon: 'loading'
          })
          return
        }
        //检查用户发送验证码的手机
        if (send_phone != input_phone) {
          wx.showToast({
            title: '不要修改验证号码',
            icon: 'loading'
          })
          return
        }
      }

      data.s_id = this.data.id;
      data.from = 2;
      //发送数据
      var url_r = url + '/index/services/addForm';
      app.fetch1(url_r, data, (err, data) => {
        if (data.code == ERR_OK) {
          wx.showToast({
            title: '提交成功',
            duration: 2000
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/c_card/c_card',
            })
          }, 1500)
        } else {
          wx.showToast({
            title: '数据错误',
          })
        }

      })
    }
  },

  /**
   * 发送验证码
   * filed_name 为字段 name_en 值 
   * index 表单数组下标
   */
  sendsms: function (phone, field_name, index) {
    var url_r = url + '/index/user/serviceSms';
    app.fetch1(url_r, { phone: phone }, (err, data) => {
      if (data.code === ERR_OK) {
        //记录发送验证码的手机号及返回的手机验证码

        this.setData({ 'sendyzm': data.yzm, 'sendphone': data.phone })
        //60秒倒计时
        this.countdown();
      } else {
        wx.showToast({
          title: data.msg,
          duration: 3000
        })
        return
      }
    })

  },



  //60s倒计时
  countdown: function () {
    var _this = this;
    var second = _this.data.second;
    _this.setData({
      selected: true,
      selected1: false
    });
    if (second == 0) {
      _this.setData({
        selected: false,
        selected1: true,
        second: 60,
      });
      return;
    }
    var time = setTimeout(function () {
      _this.setData({
        second: second - 1
      });
      _this.countdown();
    }, 1000)
  },

  //输出表单/index/services/showTable
  showTable: function () {
    var url_r = url + '/index/services/showTable';
    var _this = this;
    app.fetch1(url_r, { id: 2 }, (err, data) => {
      if (data.code == ERR_OK) {
        var table = data.data;
        var tabledata = [];
        var form_name = [];
        for (var i = 0; i < table.length; i++) {
          var name = table[i].name_en;
          form_name.push(name);
          tabledata.push(table[i])
          if (table[i].type == 'code') {
            //手机验证码字段name值为手机号码字段值 加上 ‘_yzm’
            var yzm_name = name + '_yzm';
            //添加手机验证码字段 
            var da = { name: '验证码', name_en: yzm_name, type: 'yzm', second: 60, selected1: true, selected: false }
            tabledata.push(da)
          }
        }
        this.setData({
          tableshow:true,
          tabledata: tabledata,
          form_name: form_name
        })
      } else {
       this.setData({
         tableshow:false
       })
      }
    })
  },

  //选择车辆--获取车辆id
  getReservationCar: function () {
    var url_r = url + '/index/index/getReservationCar';
    app.fetch1(url_r, { user_id: wx.getStorageSync('user_id') }, (err, data) => {
      if (data.code === ERR_OK) {
        this.setData({
          car_name: data.car['brand_name'],
          car_id: data.car.id
        })
      } else {
        this.setData({
          car_name: '',
          car_id: 0
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id
    })
    this.showTable();
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
    if (this.data.chosecar) {
      //获取默认车辆
      this.getReservationCar()
    }

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
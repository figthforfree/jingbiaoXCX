// pages/mem_bind_re/mem_bind_re.js
const app = getApp()
//获取应用实例
let ERR_OK = 200;
let url = app.globalData.url;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: url,
        second: 60,
        selected: false,
        selected1: true,
    },
    //绑定
    select: function (e) {

        //验证输入的验证码
        var yzm = this.data.yzm;
        var sendsms = this.data.sendsms;
        var phone = this.data.phone;
        var sendphone = this.data.sendphone;

        if (yzm == undefined || yzm != sendsms) {
            wx.showToast({
                title: '验证码错误',
                icon: 'loading',
                duration: 3000
            })
            return
        }

        if (phone == undefined || phone != sendphone) {
            wx.showToast({
                title: '不要修改手机号码',
                icon: 'loading',
                duration: 3000
            })
            return
        }

        //保存手机号
        this.savephone(phone);

    },
    //更改绑定
    selects:function(e){
        this.setData({
            phone_low: ''
        })
    },
    savephone: function (phone) {
        var url_r = url + '/index/user/saveUserPhone';
        app.fetch1(url_r, { phone: phone, user_id: wx.getStorageSync('user_id') }, (err, data) => {
            console.log(data);
            if (data.code === ERR_OK) {
                wx.switchTab({
                    url: '/pages/users/users'
                })
            } else {
                wx.showToast({
                    title: data.data.msg,
                    duration: 3000
                })
                return
            }
        })
    },

    //点击发送短信
    getyzm: function () {
        var phone = this.data.phone;
        console.log(this.data.userinfo.phone)
        if (phone == this.data.userinfo.phone){
            wx.showToast({
                title: '已经绑定了此号码',
                icon: 'loading',
                duration: 3000
            })
            return
        }
        //用户输入的验证码
        var codestr = this.data.codestr;
        if (phone == undefined) {
            wx.showToast({
                title: '请填写手机号',
                icon: 'loading',
                duration: 3000
            })
            return
        }

        var reg = /^1[34578]\d{9}$/;
        if (!reg.test(phone)) {
            wx.showToast({
                title: '手机号码有误',
                icon: 'loading',
                duration: 3000
            })
            return
        }

        this.sendSms(phone)
    },

    sendSms: function (phone) {
        var url_r = url + '/index/user/sendSms';
        app.fetch1(url_r, { phone: phone, user_id: wx.getStorageSync('user_id') }, (err, data) => {
            if (data.code === ERR_OK) {
                this.setData({
                    sendsms: data.yzm,
                    sendphone: data.phone
                })
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
    //获取手机号码
    getphone: function (e) {
        this.setData({
            phone: e.detail.value
        })

    },

    getsms: function (e) {
        this.setData({
            yzm: e.detail.value
        })
    },
    //获取个人信息
    getusers: function () {
        var url_r = url + '/index/user/getUseInfo';
        var _this = this;
        //获取用户信息
        app.fetch1(url_r, { user_id: wx.getStorageSync('user_id') }, (err, data) => {
            //console.log(data.data);
            if (data.code == ERR_OK) {
                _this.setData({
                    userinfo: data.data
                })
                if (data.data.phone == null || !data.data.phone) {
                  var phone_low = '';
                } else {
                  var phone_low = data.data.phone;
                }

                _this.setData({
                  phone_low: phone_low
                })
              
            }
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            is_check: options.is_check
        })
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
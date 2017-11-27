// pages/mycar/mycar.js
const app = getApp();
//获取应用实例
let ERR_OK = 200;
let url = app.globalData.url;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url:url,
        showtubiao:true,
    },
    /**
   * 单选
   */
    check: function (e) {
        var index = e.currentTarget.dataset.index; //获取页面自定义属性值0
        this.data.saleslist[index].selectStatus = true;
        this.setData({
            saleslist: this.data.saleslist
        });
        var _this = this;
        var saleslist = _this.data.saleslist;
        for (var i = 0; i < saleslist.length; i++) {
            if (!saleslist[i].selectStatus) {
                _this.setData({
                    allStatus: false
                });
                break;
            }
        }
        if (i >= saleslist.length) {
            _this.setData({
                allStatus: true
            });
        }
    },
    //点击切换选定图标
    showbiao:function(e){
      var id = e.currentTarget.dataset.id;
      userCarCheck(id);
     

    },
    userCarCheck:function(id){
      var _this = this;
      var url_r = url + '/index/index/userCarCheck';
      app.fetch1(url_r,{id:id,user_id:wx.getStorageSync('user_id')},(err,data)=>{
        wx.navigateBack({
          delta: 1
        })
    
      })

    },
    //车辆列表
    getuserCarList:function(){
        var url_r = url + '/index/index/userCarList';
        var _this =this;
        app.fetch1(url_r,{user_id:wx.getStorageSync('user_id')},(err,data)=>{
            if(data.code == ERR_OK){
                _this.setData({
                    userCarList:data.data
                })
            }
        })
    },
    //长按
    longpress:function(e){
        console.log(e);
        var id =e.currentTarget.dataset.id;
        var index =e.currentTarget.dataset.index;
        var url_r = url + '/index/index/delUserCar';
        var _this = this;
        wx.showModal({
            title: '提示',
            content: '是否删除该车辆',
            success: function (res) {
                console.log(res);
                if (res.confirm){
                     app.fetch1(url_r,{id:id},(err,data)=>{
                         console.log(data);
                        if(data.code == ERR_OK){
                            var userCarList = _this.data.userCarList;
                            //删除数组指定的下标
                            userCarList.splice(index,1);
                            _this.setData({
                                userCarList: userCarList
                            })
                            
                        }
                     })
                }
               
            }
        })
    },
    //去排量
    gopailiang:function(e){
        var i = e.currentTarget.dataset.index;
        //获取点击的类型页面
        var leixing = this.data.leixing;
        var userCarList = this.data.userCarList;
        var model_name = userCarList[i].model_name;
        var user_car_id = userCarList[i].id;
        var id = userCarList[i].id;
        if (leixing){
            var is_c = e.currentTarget.dataset.isc;
            console.log(is_c)
            if(is_c>=5){
                this.userCarCheck(user_car_id);
            }
            
        }else{
            if (!model_name) {
                var car_id = userCarList[i].cat_id;
                wx.redirectTo({
                    url: '/pages/models_p/models_p?user_car_id=' + user_car_id + '&id=' + car_id,
                })
            } else {
              wx.navigateTo({
                url: '/pages/mem_bind/mem_bind?user_car_id=' + user_car_id + '&id=' + id,
              })
            }
        }
        
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var leixing = options.leixing;
      this.setData({
        leixing:leixing
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
        this.getuserCarList();
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
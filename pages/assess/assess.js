// pages/assess/assess.js
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
        content:'',
        path:[]
    },


    getpl:function(e){
      this.setData({
        content:e.detail.value
      })
    },

    //上传行驶证
    uploadimg: function () {
      if(this.data.length >=4){
        wx.showToast({
          title: '最多上传四张图片',
        })
        return 
      }
      var _this = this;
     // var url_r = url + '/index/user/imageUpload';
      wx.chooseImage({
        count: 1,
        success: function (res) {
          wx.showLoading({
            title: '上传中',
          })
          wx.uploadFile({
            url: url + '/index/user/imageUpload',
            filePath: res.tempFilePaths[0],
            name: 'file',
            header: { 'content-type': 'multipart/form-data' },
            success: function (resu) {
              //转为json对象
              wx.hideLoading()
              var data = JSON.parse(resu.data);
              if (data.code === ERR_OK) {
                var path = _this.data.path;
                path.push(data.path);
                _this.setData({
                  path: path
                })
              }
            }
          })
        }
      })
    },

    submitpinglun:function(){
      var content = this.data.content
      if(!content){
        wx.showToast({
          title: '请输入评价',
        })
        return 
      }

      var url_r = url + '/index/user/addComment';
      app.fetch1(url_r,{type:this.data.stype,id:this.data.id,order_id:this.data.order_id,content:content,path:this.data.path},(err,data)=>{
        if(data.code == ERR_OK){
          if(this.data.stype == 1){
              var url = '/pages/books/books';
          }else{
            var url = '/pages/myorder/myorder?status=0';
          }
          wx.redirectTo({
            url: url,
          })
        }
      });


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var stype = options.type;
      var order_id = options.order_id == undefined ? 0 : options.order_id;
      var id = options.s_id == undefined ? 0 : options.s_id;
      this.setData({
        stype:stype,
        order_id:order_id,
        id:id
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
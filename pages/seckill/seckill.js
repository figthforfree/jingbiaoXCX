// pages/seckill/seckill.js
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
        s_p:1,
        falg:true,
        Interval:null,
        indicatorDots: false,
        autoplay: true,
        interva: 5000,
        duration: 1000
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
    //获取秒杀分类
    spikeCat:function(){
        var url_r = url + '/index/goods/spikeCat'
        var _this = this;
        app.fetch1(url_r,{},(err,data)=>{
            console.log(data);
            if(data.code == ERR_OK){
                _this.setData({
                    spikeCat: data.data,
                    cat_id:data.data[0].cat_id,
                    cat_name:data.data[0].name
                })
                _this.spikeList();
            }
        })
    },
    dianji:function(e){
      var cat_id = e.currentTarget.dataset.id;
      var car_name = e.currentTarget.dataset.name;
      var _this = this;
      _this.setData({
          cat_id: cat_id,
          cat_name: car_name,
          timearr:[],
          s_p:1,
          falg:true
      })
      if (this.data.Interval != null){
        clearInterval(this.data.Interval)
      }
      _this.spikeList();
    },
    //获取秒杀列表
    spikeList:function(){
        var url_r = url + '/index/goods/spikeList'
        var _this = this;
        if (!this.data.falg){
          return
        }
        app.fetch1(url_r, { cat_id: _this.data.cat_id, p: _this.data.s_p},(err,data)=>{
            if(data.code == ERR_OK){
              var s_p = _this.data.s_p;
              if(s_p == 1){
                _this.setData({
                  spikeList:[],
                  timearr:[]
                })
              }else{
                clearInterval(_this.data.Interval)
              }
              s_p = s_p + 1;
              var spikeList = _this.data.spikeList;
              var old_time = _this.data.timearr;
              var data1 = data.data;
              var timearr = new Array()
              var time = Date.parse(new Date()) / 1000;
              _this.setData({
                s_p: s_p,
                spikeList: spikeList.concat(data1)
              })
              var day_1 = 24 * 60 * 60
              var h_1 = 60 * 60
              var i_1 = 60
              var len = data1.length;
              for (var i = 0; i < len; i++) {
                var sjc = data1[i].end_time//结束时间
                var dqtime = sjc - time;//当前时间
                if (dqtime > 0) {
                    var day = parseInt(dqtime / day_1 )
                    var h = parseInt((dqtime - (day * day_1)) / h_1 ) 
                    var i_i = parseInt((dqtime - (day * day_1) - (h * h_1)) / i_1 ) 
                    var s = dqtime - (day * day_1) - (h * h_1) - (i_i * i_1) 
                    console.log(i_i)
                    timearr[i] = { d: day, h: h, i: i_i, s: s, y: dqtime}
                } else {
                    //活动已经结束
                    timearr[i] = {y:0}

                }     
              }
              if(len < 10){ 
                var falg=false
              }else{
                var falg=true
              }
              timearr = old_time.concat(timearr);
              _this.setData({
                  timearr: timearr,
                  falg: falg
              })
              var Interval = setInterval(function () {
                  for (var x in timearr){
                      var dqtime = timearr[x].y - 1;
                      var day = parseInt(dqtime / day_1)
                      var h = parseInt((dqtime - (day * day_1)) / h_1)
                      var i_i = parseInt((dqtime - (day * day_1) - (h * h_1)) / i_1)
                      var s = dqtime - (day * day_1) - (h * h_1) - (i_i * i_1)
                      if (dqtime <= 0 ){
                          timearr[x] = { d: 0, h:0, i: 0, s: 0, y: 0 }
                      }else{
                          timearr[x] = { d: day, h: h, i: i_i, s: s, y: dqtime }
                      }
                  }
                  _this.setData({
                      timearr: timearr,
                  })
              }, 1000) //循环时间 这里是1秒   
              _this.setData({
                Interval: Interval
              })
            }else{
              if(_this.data.s_p == 1){
                if (_this.data.Interval != null) {
                  clearInterval(_this.data.Interval)
                }
                _this.setData({
                  spikeList: [],
                  timearr: []
                })
              }
              _this.setData({
                falg:false
              })
              
            }
        })
    },
    /**
     * 倒计时
     */
    countdown: function (dqtime){
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getmbanner();
        this.spikeCat();
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
      this.spikeList()

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
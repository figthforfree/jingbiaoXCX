// pages/product/product.js
var WxParse = require('../../wxParse/wxParse.js');//富文本
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
        showView: true,
        selected: true,
        selected1: false,
        selected2: false,
        screenWidth: 0,
        screenHeight: 0,
        imgwidth: 0,
        imgheight: 0,
        imgUrls: [
            '../../img/1-5.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            '../../img/1-5.jpg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        attrValueList: [],
        noformat: false,
        firstIndex: -1,
        commodityAttr: [],
        show_sel_value: '',
        num: 1,
        a_id: 0,
        priceId: 0,
        p: 1,
        flag: true,
        commentlist: []
    },

    // 增加数量
    addCount() {
        var num = this.data.num;
        //秒杀商品不能超出限购数量
        num++;
        if (this.data.is_spike == 1 && this.data.goodsDetail.buy_limit){
          if (num > this.data.goodsDetail.buy_limit){
            wx.showToast({
              title: '限购数量:' + this.data.goodsDetail.buy_limit,
              icon:'loading'
            })
          }
          return
        }
        this.setData({
            num: num
        })

        // this.getTotalPrice();
    },
    // 减少数量
    minusCount() {
        var num = this.data.num;
        if (num > 1) {
            num--;
        } else {
            num = 1;
        }
        this.setData({
            num: num
        })

        // this.getTotalPrice();
    },
    //获取评价
    getComment: function () {
        var url_r = url + '/index/goods/commentList';
        var flag = this.data.flag;
        if (flag) {
            app.fetch1(url_r, { type: 2, g_id: this.data.g_id, p: this.data.p }, (err, data) => {
                if (data.code === ERR_OK) {
                    var p = this.data.p;
                    var commentlist = this.data.commentlist;
                    var com = data.data;
                    var len = com.length;
                    for (var i = 0; i < len; i++) {
                        var imgs = new Array();
                        if (com[i]['imgs']) {
                            imgs = com[i]['imgs'].split(',');
                        }
                        com[i]['imgs'] = imgs
                    }
                    commentlist = commentlist.concat(com)
                    p = p + 1;
                    if (len < 5) {
                        var flag = false;
                    } else {
                        var flag = true;
                    }
                    this.setData({
                        flag: flag,
                        p: p,
                        commentlist: commentlist
                    })

                } else {
                    this.setData({
                        flag: false
                    })
                }
            })
        }


    },
    getMoreComment: function () {
        this.getComment()
    },
    //获取商品规格
    getGoogSpec: function () {
        var g_id = this.data.g_id;
        var that = this;
        var url_r = url + '/index/goods/getGoogSpec';
        app.fetch1(url_r, { g_id: g_id }, (err, data) => {
            if (data.code === ERR_OK) {
              if(that.data.is_spike == 1){
                that.setData({
                  includeGroup: data.spec,
                  commodityAttr: data.spec,
                  currPrice: data.spec.spike_price,
                  currStock: data.spec.stock,
                  priceId: data.spec.priceId
                });
              }else{
                that.setData({
                  includeGroup: data.spec,
                  commodityAttr: data.spec,
                  currPrice: data.spec.price,
                  currStock: data.spec.stock,
                  priceId: data.spec.priceId
                });
              }
                
                that.distachAttrValue(that.data.commodityAttr);

                if (that.data.commodityAttr.length == 1) {
                    for (var i = 0; i < that.data.commodityAttr[0].attrValueList.length; i++) {
                        that.data.attrValueList[i].selectedValue = that.data.commodityAttr[0].attrValueList[i].attrValue;
                    }
                    that.setData({

                        attrValueList: that.data.attrValueList
                    });
                }

            } else {
              //没有商品规格
                that.setData({
                    noformat: true
                })
            }
        })


    },

    distachAttrValue: function (commodityAttr) {
        // 将后台返回的数据组合成类似
        // {
        //   attrKey:'型号',
        //   attrValueList:['1','2','3']
        // }
        var attrValueList = this.data.attrValueList;
        for (var i = 0; i < commodityAttr.length; i++) {
            for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
                var attrIndex = this.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);
                // console.log('属性索引', attrIndex); // 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置
                if (attrIndex >= 0) {
                    // 如果属性值数组中没有该值，push新值；否则不处理
                    if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
                        attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
                    }
                } else {
                    attrValueList.push({
                        attrKey: commodityAttr[i].attrValueList[j].attrKey,
                        attrValues: [commodityAttr[i].attrValueList[j].attrValue]
                    });
                }
            }
        }
        // console.log('result', attrValueList)
        for (var i = 0; i < attrValueList.length; i++) {
            for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
                if (attrValueList[i].attrValueStatus) {
                    attrValueList[i].attrValueStatus[j] = true;
                } else {
                    attrValueList[i].attrValueStatus = [];
                    attrValueList[i].attrValueStatus[j] = true;
                }
            }
        }
        this.setData({
            attrValueList: attrValueList
        });
    },
    getAttrIndex: function (attrName, attrValueList) {
        // 判断数组中的的attrKey是否有该属性值
        for (var i = 0; i < attrValueList.length; i++) {
            if (attrName == attrValueList[i].attrKey) {
                break;
            }
        }
        return i < attrValueList.length ? i : -1;
    },
    isValueExist: function (value, valueArr) {
        // 判断是否已有属性值
        for (var i = 0; i < valueArr.length; i++) {
            if (valueArr[i] == value) {
                break;
            }
        }
        return i < valueArr.length;
    },
    selectAttrValue: function (e) {
        // 点选属性值，联动判断其他属性值是否可选
        // {
        //   attrKey:'型号',
        //   attrValueList:['1','2','3'],
        //   selectedValue:'1',
        //   attrValueStatus:[true,true,true]
        // }
        // console.log(e.currentTarget.dataset);
        var attrValueList = this.data.attrValueList;
        var index = e.currentTarget.dataset.index;//属性索引
        var key = e.currentTarget.dataset.key;
        var value = e.currentTarget.dataset.value;
        if (e.currentTarget.dataset.status || index == this.data.firstIndex) {
            if (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value) {
                // 取消选中
                this.disSelectValue(attrValueList, index, key, value);
            } else {
                // 选中
                this.selectValue(attrValueList, index, key, value);
            }

        }
    },
    selectValue: function (attrValueList, index, key, value, unselectStatus) {
        // console.log('firstIndex', this.data.firstIndex);
        // 选中
        var includeGroup = [];
        if (index == this.data.firstIndex && !unselectStatus) { // 如果是第一个选中的属性值，则该属性所有值可选
            var commodityAttr = this.data.commodityAttr;
            // 其他选中的属性值全都置空
            // console.log('其他选中的属性值全都置空', index, this.data.firstIndex, !unselectStatus);
            for (var i = 0; i < attrValueList.length; i++) {
                for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
                    attrValueList[i].selectedValue = '';
                }
            }
        } else {
            var commodityAttr = this.data.includeGroup;
        }

        // console.log('选中', commodityAttr, index, key, value);
        for (var i = 0; i < commodityAttr.length; i++) {
            for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
                if (commodityAttr[i].attrValueList[j].attrKey == key && commodityAttr[i].attrValueList[j].attrValue == value) {
                    includeGroup.push(commodityAttr[i]);
                }
            }
        }
        attrValueList[index].selectedValue = value;

        // 判断属性是否可选
        for (var i = 0; i < attrValueList.length; i++) {
            for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
                attrValueList[i].attrValueStatus[j] = false;
            }
        }
        for (var k = 0; k < attrValueList.length; k++) {
            for (var i = 0; i < includeGroup.length; i++) {
                for (var j = 0; j < includeGroup[i].attrValueList.length; j++) {
                    if (attrValueList[k].attrKey == includeGroup[i].attrValueList[j].attrKey) {
                        for (var m = 0; m < attrValueList[k].attrValues.length; m++) {
                            if (attrValueList[k].attrValues[m] == includeGroup[i].attrValueList[j].attrValue) {
                                attrValueList[k].attrValueStatus[m] = true;
                            }
                        }
                    }
                }
            }
        }
        
        //是否为秒杀商品
        if(this.data.is_spike == 1){
          var price = includeGroup[0].spike_price;
        }else{
          var price = includeGroup[0].price
        }
        this.setData({
            attrValueList: attrValueList,
            includeGroup: includeGroup,
            price: price,
            currStock: includeGroup[0].stock,
            priceId: includeGroup[0].priceId
        });

        var count = 0;
        for (var i = 0; i < attrValueList.length; i++) {
            for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
                if (attrValueList[i].selectedValue) {
                    count++;
                    break;
                }
            }
        }
        if (count < 2) {// 第一次选中，同属性的值都可选
            this.setData({
                firstIndex: index
            });
        } else {
            this.setData({
                firstIndex: -1
            });
        }
    },
    disSelectValue: function (attrValueList, index, key, value) {
        // 取消选中
        var commodityAttr = this.data.commodityAttr;
        attrValueList[index].selectedValue = '';

        // 判断属性是否可选
        for (var i = 0; i < attrValueList.length; i++) {
            for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
                attrValueList[i].attrValueStatus[j] = true;
            }
        }
        this.setData({
            includeGroup: commodityAttr,
            attrValueList: attrValueList,
            priceId: 0
        });

        for (var i = 0; i < attrValueList.length; i++) {
            if (attrValueList[i].selectedValue) {
                this.selectValue(attrValueList, i, attrValueList[i].attrKey, attrValueList[i].selectedValue, true);
            }
        }
    },
    submit: function () {
        var value = [];
        for (var i = 0; i < this.data.attrValueList.length; i++) {
            if (!this.data.attrValueList[i].selectedValue) {
                break;
            }
            value.push(this.data.attrValueList[i].selectedValue);
        }
        if (i < this.data.attrValueList.length) {
            wx.showToast({
                title: '请选择规格',
                icon: 'loading',
                duration: 1000
            })
        } else {
            wx.redirectTo({
                url: '/pages/firm_order/firm_order?type='+this.data.is_spike+'&num=' + this.data.num + '&g_id=' + this.data.g_id + '&priceId=' + this.data.priceId,
            })

            // wx.showToast({
            //   title: '选择的规格为：' + value.join('-'),
            //   icon: 'sucess',
            //   duration: 1000
            // })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        showView: (options.showView == "true" ? true : false)
        var g_id = options.g_id;
        var is_spike = options.type == undefined ? 0 : options.type;
        var _this = this;
        _this.setData({
            g_id: g_id,
            is_spike:is_spike,
        });
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    screenHeight: res.windowHeight,
                    screenWidth: res.windowWidth,
                });
            }
        });
        this.goodsDetail();//获取详情
        this.getGoogSpec();//获取规格
        this.commonData();//获取客服电话公司地址
        this.getComment()
    },
    //获取客服电话公司地址
    commonData: function () {
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
                // console.log("拨打电话成功！")
            },
            fail: function () {
                // console.log("拨打电话失败！")
            }
        })
    },
    //获取商品详情
    goodsDetail: function (e) {
        var url_r = url + '/index/goods/goodsDetail'
        var _this = this;
        app.fetch1(url_r, { g_id: this.data.g_id,type:this.data.is_spike }, (err, data) => {

            if (data.code == ERR_OK) {
                this.setData({
                    goodsDetail: data.goods,
                    goodsDetailimg: data.img,
                    price: data.goods.price
                })
                WxParse.wxParse('contents', 'html', this.data.goodsDetail.content, this, 0);
                WxParse.wxParse('after_sale', 'html', this.data.goodsDetail.after_sale, this, 0);
            }
        })
    },

    //图片自适应
    imageLoad: function (e) {
        var _this = this;
        var $width = e.detail.width,    //获取图片真实宽度  
            $height = e.detail.height,
            ratio = $width / $height;   //图片的真实宽高比例  
        var viewWidth = 750,           //设置图片显示宽度，  
            viewHeight = 750 / ratio;    //计算的高度值     
        this.setData({
            imgwidth: viewWidth,
            imgheight: viewHeight
        })
    },
    //选择颜色尺寸切换
    onshowstate: function () {
        var that = this;
        var value = [];
        for (var i = 0; i < this.data.attrValueList.length; i++) {
            if (!this.data.attrValueList[i].selectedValue) {
                break;
            }
            value.push(this.data.attrValueList[i].selectedValue);
        }

        that.setData({
            showView: (!that.data.showView),
            show_sel_value: value.join('-'),
        })
    },

    //详情tab切换
    selected: function (e) {
        this.setData({
            selected1: false,
            selected2: false,
            selected: true
        })
    },
    selected1: function (e) {
        this.setData({
            selected: false,
            selected2: false,
            selected1: true
        })
    },
    selected2: function (e) {
        this.setData({
            selected: false,
            selected1: false,
            selected2: true
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
      var cartlist = wx.getStorageSync('mycaty');
      var cartnum = cartlist.length;
      this.setData({
        cartnum: cartnum
      })

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

    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '商品详情',
            path: '/pages/product/product?g_id=' + this.data.g_id,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    gocart:function(){
        var value = [];
        for (var i = 0; i < this.data.attrValueList.length; i++) {
            if (!this.data.attrValueList[i].selectedValue) {
                break;
            }
            value.push(this.data.attrValueList[i].selectedValue);
        }
        if (i < this.data.attrValueList.length) {
            wx.showToast({
                title: '请选择规格',
                icon: 'loading',
                duration: 1000
            })
        } else {
            var is_spike = this.data.is_spike
            if (is_spike==1){
                wx.showToast({
                    title: '秒杀商品不可加入购物车！',
                    icon: 'loading',
                    duration: 1000
                })
            }else{
                var num = this.data.num
                var g_id = this.data.g_id
                var priceId = this.data.priceId
                var path = this.data.goodsDetail.path
                var title = this.data.goodsDetail.title
                var price = this.data.price
                
                var arr = new Array();
                arr = { 'g_id': g_id, 'priceId': priceId,'num':num,'path':path,'price':price,'title':title}
                if (wx.getStorageSync('mycaty')){
                    var lowarr = wx.getStorageSync('mycaty')
                    console.log(lowarr.length)
                    var num_is = 0
                    for (var i = 0; i < lowarr.length;i++){
                        if (lowarr[i]['g_id'] == g_id){
                            if (lowarr[i]['priceId'] == priceId){
                                if (lowarr[i]['num'] == num){
                                    wx.showToast({
                                        title: '已经在购物车',
                                        icon: 'loading',
                                        duration: 1000
                                    })
                                    return 
                                }else{
                                    lowarr[i]['num'] = num
                                    num_is = 1
                                }
                            }
                        }
                    }
                  
                    if (num_is){
                        wx.setStorageSync('mycaty', lowarr)
                    }else{
                       lowarr.unshift(arr)
                       wx.setStorageSync('mycaty', lowarr)
                       var cartnum = lowarr.length;
                        this.setData({
                          cartnum: cartnum
                        })
                       wx.showToast({
                           title: '加入购物车成功',
                           icon: 'success',
                           duration: 1000
                       })
                    }
                }else{
                    arr = [arr]
                    wx.setStorageSync('mycaty',arr)
                    var cartnum = arr.length;
                    this.setData({
                      cartnum: cartnum
                    })
                    wx.showToast({
                        title: '加入购物车成功',
                        icon: 'success',
                        duration: 1000
                    })
                }
                
            }
        }
    }
})
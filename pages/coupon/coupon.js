// orderList.js

//获取应用实例
var app = getApp();
var Entry = require('../../lib/js/entry.js');

Page({
  data: {
    couponText:"不使用优惠券",
    chooseImg:"radio2.png", //radio2 不使用优惠券
    status:0, // 0  不使用优惠券
    id:"",// 优惠券的id
    couponArr:[
      {id:1,name:"首次下单优惠券",indate:"2017-07-06",tag:"车险用户使用",money:0.7,type:1},
      {id:2,name:"夏日出行优惠券",indate:"2017-08-05",tag:"夏日防暑专享",money:3,type:0},
      {id:3,name:"首次下单优惠券",indate:"2017-09-04",tag:"所有用户使用",money:3,type:1},
      {id:4,name:"轻松出行优惠券",indate:"2017-10-03",tag:"车险用户使用",money:100,type:0},
    ],
    // couponArr:[],
  },

  onShow(option) {
    var that = this
    app.globalData.account
    // that.setData({
    //   couponArr: coupons,
    // })
    // 请求数据接口 coupon 优惠券接口
    // app.request('ugorder', function (res) {
    //   var ugorder = res.data.data;
    //   that.setData({ ugorder });
    //   var wxUserInfo = app.globalData;
    //   console.log("!!!!!!!!!!!ugorder res wxUserInfo", wxUserInfo)
    //   that.setData({ wxUserInfo });
    // });
    // console.log("kdjfkdjfkdjfkdjfkj",couponArr);
  },

  // 使用不使用优惠券(默认不使用)
  bindInfoChange(e) {
    var that = this

    if (e.currentTarget.dataset.name==0 && that.data.chooseImg=="radio2.png") {
      that.setData({
        chooseImg:"radio1.png",
        status:1,// 使用优惠券
      })
    }else{
      that.setData({
        chooseImg:"radio2.png",
        status:0,// 不使用优惠券
      })

    }
  },

  // 选择的优惠券(发送给赵哥)
  bindCoupon(e){
    var that = this
    var couponId = e.currentTarget.id
    that.setData ({
      id: couponId ,
    })
    console.log("id=>",this.data.id);
  },

  bindRouterTo(e) {
    var routername = e.currentTarget.dataset.routername;
    var url = '../' + routername + '/' + routername;
    wx.navigateTo({
      url
    });
  },

  onShareAppMessage(res) {
    return {
      title: '天地安上门洗车',
      path: '/pages/shareqr/shareqr'
    }
  },
})

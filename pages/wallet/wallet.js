// orderList.js

//获取应用实例
var app = getApp();
var Entry = require('../../lib/js/entry.js');

Page({
  data: {
    wxUserInfo:{},
    couponText:"不使用优惠券",
    chooseImg:"radio2.png", //radio2 不使用优惠券
    status:0, // 0  不使用优惠券
    id:"",// 优惠券的id

    account:{
      useable: 0,
      couponNum: 0,
    },
  },
  onLoad(option){
    var that = this
    app.getAccount(app.setPageData(this,'account'),true)
  },
  onShow(option) {
    var that = this
    that.setData({
      wxUserInfo: app.globalData.wxFullInfo.userInfo,
      phone: app.globalData.user.user.mobile,
    });
  },
  onReady(){
    console.log("wallet account:", this.data.account)
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
})

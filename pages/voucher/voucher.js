// orderList.js

//获取应用实例
var app = getApp();
var Entry = require('../../lib/js/entry.js');

Page({
  data: {
      type1:"充值",
      wxUserInfo:{},
  },

  onShow(option) {
    var that = this
    app.getWxUser(app.setPageData(this, 'wxUserInfo'))
  },


  bindRouterTo(e) {
    // console.log('wxUserInfo',this.data.)
    var routername = e.currentTarget.dataset.routername;
    var url = '../' + routername + '/' + routername;
    wx.navigateTo({
      url
    });
  },
// 表单提交的金额
formBindsubmit:function(e){
  var money = e.detail.value.money
  console.log("money",money);
  wx.showLoading({
    title: '加载中',
    mask: true
  });
  app.rh('putpay', function (res) {
    wx.hideLoading();
    console.log(res);
    var paydata = res.data;
    paydata.complete = function () {
    };
    paydata.success = function () {
      wx.redirectTo({
        url: '../wallet/wallet'
      })
    };
    paydata.fail = function (res) {
      console.log("pay fail,res",res)
    }
    wx.requestPayment(paydata);
  }, {money});
},



})


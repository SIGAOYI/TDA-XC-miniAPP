// orderList.js

//获取应用实例
var app = getApp();
var Entry = require('../../lib/js/entry.js');

Page({
  data: {
    item:{
      wxUserInfo:{},
      type2:"提现",
      // userInfo:{
      //   avatarUrl:"../../lib/img/icon/headimg.png",
      //   nickname:"我就是鼎鼎大名的昵称"
      // }
    }
  },

  onShow(option) {
    var that = this
    that.setData({
      item:{
        wxUserInfo: app.globalData.userInfo,
        type2:"提现"
      }
    });
  },


  bindRouterTo(e) {
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
},




})


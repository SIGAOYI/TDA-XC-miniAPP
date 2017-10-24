// proofPhone.js

var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: undefined
  },
  bindInfoChange (e) {
    var val = e.detail.value;
    this.setData({
      phone: val
    });
  },
  bindSubmitForm () {
    var phone = this.data.phone;
    var regPhone = /^1(3|4|5|7|8)\d{9}$/;
    if (regPhone.test(phone)) {

      wx.showLoading({
        title: '正在获取',
        mask: true
      });

      var data = {
        // data: {
          phone
        // }
      };
      app.rh('getCode', function (res) {
        var errMsg = res.errMsg;
        if (errMsg) {
          wx.showToast({
            title: '获取失败',
            image: '../../lib/img/icon/error.png'
          });
        } else {
          wx.hideLoading();
          wx.navigateTo({
            url: '../proofCode/proofCode?molibe=' + phone
          });
        };
      }, data);
    } else {
      wx.showToast({
        title: '号码有误',
        image: '../../lib/img/icon/error.png'
      });
      return;
    }
  }
})
// chooseCar.js
// 重复渲染优化
var app = getApp();

Page({
  data: {
    appUserInfo: [],
    key: ''
  },
  onLoad(options) {
    console.log("chooseCar onLoad options", options)
    var key = options.key;
    this.setData({key});
  },
  onShow() {
    console.log("choose car onshow getCurrentPages()", getCurrentPages())
    wx.showNavigationBarLoading();

    var that = this;
    app.rh('cars', function (res) {
      var appUserInfo = res.data;
      for (var i = 0; i < appUserInfo.length; i++) {
        appUserInfo[i].usualaddr = JSON.parse(appUserInfo[i].usualaddr);
      };
      that.setData({
        appUserInfo
      });
      wx.hideNavigationBarLoading();
    });
  },
  chooseCarInfo(e) {
    if (this.data.key === undefined) {
      return false;
    };
    var inx = e.currentTarget.dataset.index;
    var appUserInfo = this.data.appUserInfo[inx];
    var key;

    app.keepIndexData.addr = appUserInfo.usualaddr;
    for (key in app.keepIndexData.car) {
      app.keepIndexData.car[key] = appUserInfo[key];
    };

    wx.navigateBack();
  },
  bindAddInfo() {
    wx.navigateTo({
      url: '../addCar/addCar'
    });
  },
  bindEditInfo(e) {
    var inx = e.currentTarget.dataset.index;
    var data = JSON.stringify(this.data.appUserInfo[inx]);
    wx.navigateTo({
      url: '../addCar/addCar?aui=' + data
    });
  }
})
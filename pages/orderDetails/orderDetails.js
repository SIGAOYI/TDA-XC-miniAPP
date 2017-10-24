// orderDetails.js

var app = getApp();

Page({
  data: {
    info: {}
  },
  onLoad: function (options) {
    var that = this;

    wx.showNavigationBarLoading();

    var info = options.list;
    info = JSON.parse(info);
    console.log("detail info:",info);
    this.setData({ info });

    // var data = {
    //   data: {
    //     carid: info.car_id
    //   }
    // };

    // app.request('carInfo', function (res) {
    //   var res = res.data.data;
    //   var info = that.data.info;
    //   info.plate = res.plate;
    //   info.color = res.color;
    //   info.linkman = res.linkman;
    //   info.phone = res.phone;
    //   info.gender = res.gender;
    //   that.setData({ info });
    // }, data);

    //   var res = res.data.data;
    //   var info = that.data.info;
    //   info.plate = res.plate;
    //   info.color = res.color;
    //   info.linkman = res.linkman;
    //   info.phone = res.phone;
    //   info.gender = res.gender;
    // that.setData({ info })

    wx.hideNavigationBarLoading();
  },
  bindCheckAddr () {
    var info = this.data.info;
    wx.openLocation({
      latitude: info.addrUs.location.lat,
      longitude: info.addrUs.location.lng,
      name: info.addrUs.addr,
      address: info.addr.addrUs + info.addrUs.remark
    })
  }
})
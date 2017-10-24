// driverHistoryOrder.js

var app = getApp();
var Entry = require('../../lib/js/entry.js');

Page({
  data: {
    start: 0,
    url: '',
    list: [],
    status: ['已付款', '派单中', '已接单', '洗车中', '完成', '评价完成']
  },
  onLoad: function (options) {
    var url = options.url;
    this.setData({url});
    this.getListData(url);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var url = that.data.url;
    this.getListData(url);
  },
  onShareAppMessage (res) {
    return {
      title: '天地安上门洗车',
      path: '/pages/entry/entry'
    }
  },
  getListData (url) {
    var that = this;

    var start = this.data.start;
    var data = {
      // data: {
        start
      // }
    };
    wx.showNavigationBarLoading();
    app.rh(url, function (res) {
      wx.hideNavigationBarLoading();

      var list = that.data.list;
      var add = res.data;

      if (add === null) {
        wx.showToast({
          title: '已经到底',
          image: '../../lib/img/icon/error.png'
        });

        return false;
      }
      add = that.dealData(add);
console.log("add",add);
      list = [...list, ...add];
  
      var start = that.data.start;

      start += 10;
      that.setData({
        list,
        start
      });
    }, data);
  },
  dealData(res) {
    var list = [];
    var entry = new Entry.entry(this);
    for (var i = 0; i < res.length; i++) {
      var obj = {};
      var data = res[i];

      var ct = data['created_at'];
      ct = timeChange(entry, ct);

      var st = data.appointment;
      st = timeChange(entry, st);

      var et = data.end;
      et = timeChange(entry, et);

      // var addr = data.usualaddr;
      // addr = JSON.parse(addr);
      var addr, remark
      if (data.type === 1) {
        addr = data.address
        remark = data.remark
      } else {
        let addrt = data.usualaddr;
        addrt = JSON.parse(addrt);
        addr = addrt.addr
        remark = addrt.remark
      }

      var plate = data.plate;
      var score = data.score;
      var status = data.status-1;
      var orderNo = data.order_no;
      var car_id = data.car_id;

      obj = {
        ct,
        st,
        et,
        addr,
        remark,
        plate,
        score,
        status,
        orderNo,
        car_id
      };

      list.push(obj);
    };
    function timeChange(entry, time) {
      var time = time * 1000;
      time = entry.timeStrSwitchStamp(time);
      return time;
    };
    return list;
  }
})
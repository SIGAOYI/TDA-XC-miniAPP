// orderList.js

//获取应用实例
var app = getApp();
var Entry = require('../../lib/js/entry.js');

Page({
  data: {
    start: 0, // 触底加载
    list: [],//undefined,
    status: ['未付款','派单中', '待接单', '已接单', '洗车中', '完成', '评价完成', '取消订单'],
    pj: ['满意', '不满意'],
    pjInx: [2, 1]
  },
  onLoad: function (options){
  },
  onShow: function (options) {
    wx.showNavigationBarLoading();
    this.setData({
      list:null,
    });
    var that = this;

    var start = 0;
    var data = {
      // data: {
        start
      // }
    };

    app.rh('orders', function (res) {
      res = res.data;
      wx.hideNavigationBarLoading()
      var list;
      if (res === null) {
        list = null;
      } else {
        list = that.dealData(res);
        start += 10;
      }

      console.log("onShow orders res set list:", list)
      that.setData({
        list,
        start
      });
    }, data)
  },
  onShareAppMessage(res) {
    return {
      title: '天地安上门洗车',
      path: '/pages/entry/entry'
    }
  },
  dealData(res) {
    var list = [];
    var entry = new Entry.entry(this);
    for (var i = 0; i < res.length; i++) {
      var obj = {};
      var data = res[i];
      if(data.status===0){
        continue
      }
      var ct = data['created_at'];
      ct = timeChange(entry, ct);

      var st = data.appointment;
      st = timeChange(entry, st);

      var et = data.end;
      et = timeChange(entry, et);

      var addr = data.usualaddr;
      addr = JSON.parse(addr);

      var plate = data.plate;
      var score = data.score;
      var status = data.status;
      var orderNo = data.order_no;

      obj = {
        ct,
        st,
        et,
        addr,
        plate,
        score,
        status,
        orderNo
      };

      list.push(obj);
    };
    function timeChange(entry, time) {
      var time = time * 1000;
      time = entry.timeStrSwitchStamp(time);
      return time;
    };
    return list;
  },
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh")
    // wx.showNavigationBarLoading();

    var that = this;

    var start = this.data.start;
    var data = {
      // data: {
        start:0
      // }
    };

    app.rh('orders', function (res) {
      res = res.data;
      console.log("onPullDownRefresh res")
      // wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      var list;
      if (res === null) {
        list = null;
      } else {
        list = that.dealData(res);
      }
      console.log("onPullDownRefresh orders res set list:", list)
      that.setData({
        list
      });
    }, data)
  },
  onReachBottom () {
    wx.showNavigationBarLoading();
   
    var that = this;

    var start = this.data.start;
    var data = {
      // data: {
        start
      // }
    };

    app.rh('orders', function (res) {
      res = res.data;
      wx.hideNavigationBarLoading()
      var list;
      console.log("onReachBottom orders res :", res)
      if (res === null) {
        console.log("onReachBottom orders res null:")
        // return
        list = that.data.list;
      } else {
        let listNew = that.dealData(res);
        list = [...that.data.list,...listNew]
        start += 10;
      }

      console.log("onReachBottom orders res set list:",list)
      that.setData({
        list,
        start
      });
     }, data);
  },
  bindPickerChange (e) {
    var that = this;
    var val = e.detail.value;
    val = parseInt(val);
    val = this.data.pjInx[val];
    console.log(val);
    var index = e.target.dataset.index;
    var orderNo = this.data.list[index].orderNo;
    var data = {
      // data: {
        orderNo,
        score: val
      // }
    };

    wx.showNavigationBarLoading();

    app.rh('score', function () {
      var list = that.data.list;
      list[index].score = val;
      that.setData({
        list
      });
      wx.hideNavigationBarLoading();
    }, data);
  }
})
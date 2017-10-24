// snapOrder.js

var app = getApp();
var Entry = require('../../lib/js/entry.js');

Page({
  data: {
    snaplist: undefined,
  },
  onLoad (options) {
    wx.showNavigationBarLoading();

    var that = this;

    app.rh('orderstt', function (res) {
      var snaplist = res.data;

      if (snaplist === null) {
        snaplist = null;
      } else {
        snaplist = that.dealData(snaplist);
      };

      that.setData({
        snaplist
      });

      wx.hideNavigationBarLoading();
    });

    wx.onSocketMessage(this.onSocketMessage);
  },
  onSocketMessage (res) {
    var that = this;
    var data = JSON.parse(res.data);
    var jser = data.jser
    var recData = [data.data];
    recData = that.dealData(recData);
    var snaplist = that.data.snaplist;
    switch (jser) {
      case 'takingOrders_o': 
        // snaplist.unshift(recData[0]);
        snaplist = [...recData, ...snaplist];
        that.setData({
          snaplist
        });
        break;
      default:
        for (var i = 0; i < snaplist.length; i++) {
          if (snaplist[i]['orderNo'] === recData[0]['orderNo']) {
            snaplist.splice(i, 1);
            break;
          };
        };
        that.setData({
          snaplist
        });
        break;
    }
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
  sendSocketMessage(msg) {
    wx.sendSocketMessage({
      data: msg
    })
  },
  bindSnap (e) {
    var that = this;
    var orderNo = e.currentTarget.dataset.no;

    var data = {
      // data: {
        orderNo
      // }
    }
    wx.showNavigationBarLoading();
    app.rh('takeOrder', function (res) {
      wx.showToast({
        title: '抢单成功',
        icon: 'success'
      });
      var snaplist = that.data.snaplist;
      for (var i = 0; i < snaplist.length; i++) {
        var data = snaplist[i]['orderNo'];
        if (data === orderNo) {
          snaplist.splice(i, 1);
          break;
        }
      };

      that.setData({
        snaplist
      });

      wx.hideNavigationBarLoading();
    }, data);
  },
  bindComeBack () {
    wx.navigateBack();
  }
})
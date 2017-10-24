// driverIndex.js

var app = getApp();
var Entry = require('../../lib/js/entry.js');

Page({
  data: {
    xcList: undefined,
    ggList: undefined,
    tabType: true,
    driverStatus: false,
    socketOpen: false,
    todayXCAll: 0,
    todayGGAll: 0,
    socketMsgQueue: []
  },
  onLoad (options) {
    console.log("driverindex options:",options)
    var that = this;
    // 建立长连接;
    console.log("isSocketOpen:",app.globalData.socketOpen)
    if (!app.globalData.socketOpen){
      this.createWS();
    }
    // 获取登陆状态
    app.rh('dlogin', function (res) {
      var driverStatus = res.data.loginWork;
      driverStatus = driverStatus ? true : false;
      that.setData({
        driverStatus
      });
    });
  },
  onReachBottom(){
    console.log("onReachBottom")
  },
  onShow () {
    wx.showNavigationBarLoading();

    var that = this;

    wx.onSocketMessage(function (res) {
      var res = res.data;
      res = JSON.parse(res);
      switch (res.jser) {
        case 'loginWork':
          if (!res.errMsg) {
            var driverStatus = that.data.driverStatus;
            driverStatus = !driverStatus;
            that.setData({
              driverStatus
            });
            wx.hideNavigationBarLoading();
          } else {
            wx.showToast({
              title: '请求失败',
              image: '../../lib/img/icon/error.png'
            });
            wx.hideNavigationBarLoading();
          }
          break;
      }
    });

    app.rh('dgorder', function (res) {

      var ggList = res.data.gg;
      var xcList = res.data.xc;
      var todayXCAll = res.data.xcDay;
      var todayGGAll = res.data.ggDay;
      let xcListRaw = xcList
      let ggListRaw = ggList
      // 公估订单
      console.log("ggList raw", ggList)
      if (ggList === null) {
        ggList = null;
      } else {
        ggList = that.dealData(ggList);
      };
      console.log("xcList raw", xcList)
      // 洗车订单
      if (xcList === null) {
        xcList = null;
      } else {
        xcList = that.dealData(xcList);
      };
      console.log("xcList",xcList)
      that.setData({
        xcList,
        ggList,
        todayXCAll,
        todayGGAll,
        xcListRaw,
        ggListRaw,
      });

      wx.hideNavigationBarLoading();
    });
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

      var ct = data['created_at'];
      ct = timeChange(entry, ct);

      var st = data.appointment;
      st = timeChange(entry, st);

      var et = data.end;
      et = timeChange(entry, et);

      var addr, remark, addrUs
// if(data.type===1){
//   addr=data.address
//   remark=data.remark
// }else{
  addrUs = data.usualaddr;
  addrUs = JSON.parse(addrUs);
  addr = addrUs.addr
  remark = addrUs.remark
// }

      var plate = data.plate;
      var score = data.score;
      var status = data.status;
      var orderNo = data.order_no;
      var car_id = data.car_id;

      obj = {
        ct,
        st,
        et,
        addr,
        addrUs,
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
  },
  switchTab () {
    var tabType = this.data.tabType;
    tabType = !tabType;
    this.setData({
      tabType
    })
  },
  createWS () {
    var that = this;
    // var url = 'wss://tdacar.cn/ws?code=' + app.globalData.cookieHeader;
    // var url = 'wss://tdacar.cn/ws?code=' + app.globalData.cookieHeader;
    var url = 'wss://' + app.globalData.domain+'/ws2/join'
    console.log("!!! createWS in url:",url)
    wx.connectSocket({
      url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Cookie': app.cookieHeader
      },
      data: {
        x: 'sdf',
        y: 'asdf'
      },
      success:function(res){
        console.log("connectSocket success",res)
      },
      fail: function (res) {
        console.log("connectSocket fail",res)
      },
    });
    wx.onSocketOpen(function () {
      for (var i = 0; i < that.data.socketMsgQueue.length; i++) {
        that.sendSocketMessage(that.data.socketMsgQueue[i])
      };
      console.log("!!! socket open")
      app.globalData.socketOpen=true
      that.setData({
        socketOpen: true,
        socketMsgQueue: []
      });
      // that.sendSocketMessage("that.data.socketMsgQueue[i]111")
    });
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！', res)
    });
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
      app.globalData.socketOpen=false
    })
  },
  sendSocketMessage(msg) {
    if (app.globalData.socketOpen) {
      wx.sendSocketMessage({
        data: msg
      })
    } else {
      this.data.socketMsgQueue.push(msg)
      this.createWS();
    }
  },
  bindWorkStatus () {
    var driverStatus = this.data.driverStatus;
    wx.showNavigationBarLoading();
    if (driverStatus) {
      driverStatus = 0;
    } else {
      driverStatus = 1
    };
    var data = {
      jser: 'loginWork',
      data: {
        loginWork: driverStatus
      }
    };
    data = JSON.stringify(data);
    this.sendSocketMessage(data);
  },
  bindSnap () {
    this.sendSocketMessage("asfsdfsdffsfas111")
    if (!this.data.driverStatus) {
      wx.showToast({
        title: '未出车',
        image: '../../lib/img/icon/error.png'
      });
      return false;
    }
    if (!app.globalData.socketOpen) {
      wx.showToast({
        title: '连接失败',
        image: '../../lib/img/icon/error.png'
      });
      return false;
    };
    wx.navigateTo({
      url: '../snapOrder/snapOrder'
    });
  },
  bindCashCar (e) {
    console.log("bindCashCar e:",e)
    var that = this;

    var btnType = e.currentTarget.dataset.type;
    var orderNo = e.currentTarget.dataset.no;

    var data = {
      // data: {
        orderNo
      // }
    };
    wx.showNavigationBarLoading();
    if (btnType === '0') {
      app.rh('workStart', function (res) {
        var xcList = that.data.xcList;
        for (var i = 0; i < xcList.length; i++) {
          var data = xcList[i]['orderNo'];
          if (data === orderNo) {
            xcList[i]['status'] = xcList[i]['status'] + 1;
            break;
          }
        };

        that.setData({
          xcList
        });

        wx.hideNavigationBarLoading();
      }, data);
    } else {
      if (btnType === '1') {
        app.rh('workFinish', function (res) {
          var xcList = that.data.xcList;
          for (var i = 0; i < xcList.length; i++) {
            var data = xcList[i]['orderNo'];
            if (data === orderNo) {
              xcList.splice(i, 1);
              break;
            }
          };

          that.setData({
            xcList
          });

          wx.hideNavigationBarLoading();

          wx.showToast({
            title: '完成订单',
            icon: 'success'
          });
        }, data);
      } else if (btnType === '2') {
        app.rh('workFinish', function (res) {
          var ggList = that.data.ggList;
          for (var i = 0; i < ggList.length; i++) {
            var data = ggList[i]['orderNo'];
            if (data === orderNo) {
              ggList.splice(i, 1);
              break;
            }
          };

          that.setData({
            ggList
          });

          wx.hideNavigationBarLoading();

          wx.showToast({
            title: '完成订单',
            icon: 'success'
          });
        }, data);
      };
      if (btnType === '1') {
        var todayXCAll = this.data.todayXCAll;
        todayXCAll++;
        that.setData({
          todayXCAll
        });
      } else if (btnType === '2') {
        var todayGGAll = this.data.todayGGAll;
        todayGGAll++;
        that.setData({
          todayGGAll
        });
      }
    }
  },
  bindCheckDetails (e) {
    var no = e.currentTarget.dataset.no;
    var type = e.currentTarget.dataset.type;

    var list,listSpe;
    if (type === '0') {
      list = this.data.xcListRaw;
      listSpe=this.data.xcList;
    } else if (type === '1') {
      list = this.data.ggListRaw;
      listSpe = this.data.ggList;
    }
    list = Object.assign(list[no],listSpe[no])
    list = JSON.stringify(list);
    wx.navigateTo({
      url: '../orderDetails/orderDetails?list=' + list
    })
  },
  bindHistoryOrder () {
    var tabType = this.data.tabType;
    var url;
    if (tabType) {
      url = 'ordersxc';
    } else {
      url = 'ordersgg';
    }
    wx.navigateTo({
      url: '../driverHistoryOrder/driverHistoryOrder?url=' + url
    })
  },
  bindCallKfPhone() {
    wx.makePhoneCall({
      phoneNumber: '18950156229'
    });
  }
})

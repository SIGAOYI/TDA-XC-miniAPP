// chooseTime.js
//获取应用实例
var app = getApp();

var CT = require('../../lib/js/ct.js');

Page({
  data: {
    cTime: {},
    pickerTime: {},
    limitArr: []
  },
  onLoad(option) {
    var ctime = JSON.parse(option.ctime);
    var ct = new CT.main(this);
    ct._init(ctime);
  },
  bindPickerTimeChange(e) {
    var type = e.target.dataset.changeType;
    var pickerTime = this.data.pickerTime;
    var limitArr = this.data.limitArr;
    var cTime = this.data.cTime;
    const interval = 60 * 60 * 1000;
    var ct = new CT.main(this);
    switch (type) {
      case 'stsd':
        var setD = e.detail.value;
        var setDate = setD + ' ' + pickerTime.stst;
        var setDateStamp = ct.timeStrSwitchStamp(setDate);
        if (setDateStamp > limitArr[0] && setDateStamp < limitArr[1]) {
          var et = setDateStamp + interval;
          var etStr = ct.timeStrSwitchStamp(et);
          var etsd = etStr.substring(0, 10);
          var etst = etStr.substring(11);
          pickerTime[type] = setD;
          pickerTime['etsd'] = etsd;
          pickerTime['etst'] = etst;
          this.setData({
            pickerTime
          });
          ct.setCTime('st', setDate);
          ct.setCTime('et', etStr);
        } else {
          wx.showToast({
            title: '时间有误',
            image: '../../lib/img/icon/error.png'
          })
        }
        break;
      case 'stst':
        var setT = e.detail.value;
        var setDate = pickerTime.stsd + ' ' + setT;
        var setDateStamp = ct.timeStrSwitchStamp(setDate);
        if (setDateStamp > limitArr[0] && setDateStamp < limitArr[1]) {
          var et = setDateStamp + interval;
          var etStr = ct.timeStrSwitchStamp(et);
          var etsd = etStr.substring(0, 10);
          var etst = etStr.substring(11);
          pickerTime[type] = setT;
          pickerTime['etsd'] = etsd;
          pickerTime['etst'] = etst;
          this.setData({
            pickerTime
          });
          ct.setCTime('st', setDate);
          ct.setCTime('et', etStr);
        } else {
          wx.showToast({
            title: '时间有误',
            image: '../../lib/img/icon/error.png'
          })
        }
        break;
      case 'etsd':
        var setD = e.detail.value;
        var setDate = setD + ' ' + pickerTime.etst;
        var setDateStamp = ct.timeStrSwitchStamp(setDate);
        if (setDateStamp > limitArr[2] && setDateStamp < limitArr[3] && setDateStamp > cTime.st) {
          pickerTime[type] = setD;
          this.setData({
            pickerTime
          });
          ct.setCTime('et', setDate);
        } else {
          wx.showToast({
            title: '时间有误',
            image: '../../lib/img/icon/error.png'
          })
        }
        break;
      case 'etst':
        var setT = e.detail.value;
        var setDate = pickerTime.etsd + ' ' + setT;
        var setDateStamp = ct.timeStrSwitchStamp(setDate);
        if (setDateStamp > limitArr[2] && setDateStamp < limitArr[3] && setDateStamp > cTime.st) {
          pickerTime[type] = setT;
          this.setData({
            pickerTime
          });
          ct.setCTime('et', setDate);
        } else {
          wx.showToast({
            title: '时间有误',
            image: '../../lib/img/icon/error.png'
          })
        }
        break;
    }
  },
  confirmTap() {
    // 时间间隔 常量
    const interval = 60 * 60 * 1000;
    var cTime = this.data.cTime;

    // 预约起始时间, 间隔不得少于60分钟
    if ((cTime.et - cTime.st) < interval) {
      wx.showToast({
        title: '间隔太短',
        image: '../../lib/img/icon/error.png'
      });
      return false;
    }

    app.keepIndexData.ct = cTime;

    wx.navigateBack();
    // // 返回订单页面
    // var routerParamsJSON = JSON.stringify(cTime);

    // // 关闭当前页面, 禁止用户返回
    // wx.reLaunch({
    //   url: '../entry/entry?ctime=' + routerParamsJSON
    // });
  },
  cancelTap() {
    wx.navigateBack();
  },
  bindRouterTo(e) {
    var routername = e.currentTarget.dataset.routername;
    var url = '../' + routername + '/' + routername;
    wx.navigateTo({
      url
    });
  },
})
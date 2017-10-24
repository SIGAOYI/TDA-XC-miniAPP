// proofCode.js

//获取应用实例
var app = getApp();

Page({
  data: {
    num: 60,
    timer: undefined,
    getCode: false,
    molibe: undefined,
    code: undefined
  },
  onLoad (options) {

    var molibe = options.molibe;

    this.setData({
      molibe
    });

    var num = this.data.num;

    var timer = setInterval(() => {
      num --;
      if (num === 0) {
        this.setData({
          num: 60,
          getCode: true
        });
        clearInterval(timer);
      } else {
        this.setData({
          num
        });
      }
    }, 1000);
  },
  bindInfoChange (e) {
    var val = e.detail.value;
    this.setData({
      code: val
    });
  },
  bindSubmitForm () {
    var code = this.data.code;
    var molibe = this.data.molibe;
    if (code) {

      wx.showLoading({
        title: '正在获取',
        mask: true
      });

      var data = {
        // data: {
          phone: molibe,
          code
        // }
      };

      app.rh('bindPhone', function (res) {
        var errMsg = res.errMsg;
        if (errMsg) {
          wx.showToast({
            title: '绑定错误',
            image: '../../lib/img/icon/error.png'
          });
        } else {
          app.globalData.user.user.mobile = molibe
          wx.hideLoading();
          wx.navigateBack({
            delta: 2
          })
        }
      }, data);
    } else {
      wx.showToast({
        title: '请输入验证码',
        image: '../../lib/img/icon/error.png'
      });
    }
  },
  bindGetCode () {
    var that = this;
    var getCode = this.data.getCode;
    if (getCode) {
      wx.showLoading({
        title: '正在获取',
        mask: true
      });

      var molibe = this.data.molibe;

      var data = {
        // data: {
          phone: molibe
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

          getCode = false;

          var num = that.data.num;

          var timer = setInterval(() => {
            num--;
            if (num === 0) {
              that.setData({
                num: 60,
                getCode: true
              });
              clearInterval(timer);
            } else {
              that.setData({
                num
              });
            }
          }, 1000);

          that.setData({
            getCode
          });
        }
      }, data);
    } else {
      return false;
    }
  }
})
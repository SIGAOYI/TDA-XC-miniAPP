// sureOrder.js

var app = getApp();

Page({
  data: {
    info: undefined,
    orderNo: undefined,
    couponId:0,
    account: {
      useable: 0,
      couponNum: 0,
    },
    accountPay:0,
    onlinePay:30,
  },
  onLoad: function (options) {
    console.log("sureorder onLoad options", options)
    let that=this
    let da=3000
    app.getAccount(function (res) {
      let accountPay=res.useable>=da?da:res.useable;
      let onlinePay= res.useable >= da ? 0 : da-res.useable;
      that.setData({ account: res, accountPay, onlinePay})
    }, true)
    // app.getAccount(app.setPageData(this, 'account'), true)
    
    let couponId=0
    if (options.couponId){
      console.log("options couponsid true")
      couponId = parseInt(options.couponId)
    }
    // wx.showNavigationBarLoading()

    var info = app.keepIndexData;
    console.log("sureorder info",info)
    this.setData({
      info,
      couponId,
    });
    // this.getOrderNo(info);
  },
  onShow(options) {
    var that = this
    console.log("sureorder onShow options", options)

  },
  getOrderNo (info) {
    var that = this;
    console.log(info);
    var orderInfo = {
      appointment: info.ct.st,
      end: info.ct.et,
      usualaddr: info.addr,
      carId: info.car.id,
      couponId: this.data.couponId,
    }
    var data = {
      // data: {
        order: orderInfo,
      // }
    };
    app.rh('order', function (res) {
      console.log("order res", res)
      if(res.errMsg!==""){
        app.showErr(res.errMsg)
        return
      }
      var orderNo = res.data.order_no;
      that.setData({
        orderNo
      });
      // wx.hideNavigationBarLoading();
      that.payInternal();
    }, data);
  },
  pay () {
    let that=this
    that.getOrderNo(that.data.info);
    // wx.showModal({
    //   title: '提示',
    //   confirmText: "知道了",
    //   content: '清除沥青,柏油,水泥等其他汽车美容业务，不在无水洗车范畴，请知悉!',
    //   showCancel: false,
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定');
    //       wx.showLoading({
    //         title: '提交订单中',
    //         mask: true
    //       });
    //       // that.getOrderNo(that.data.info);
    //     } else {
    //       console.log('用户点击取消')
    //     }
    //   }
    // });
  },
  payInternal(){
    var that = this;
    wx.showLoading({
      title: '提交订单中',
      mask: true
    });
    var data = {
      // data: {
        orderNo: that.data.orderNo
      // }
    };
    app.rh('pay', function (res) {
      wx.hideLoading();
      console.log(typeof res.data,res);
      if (typeof res.data === "string" && res.data==="success"){
        wx.redirectTo({
          url: '../orderList/orderList'
        })
      }
      var paydata = res.data;
      paydata.complete = function () {
      };
      paydata.success = function () {
        wx.redirectTo({
          url: '../orderList/orderList'
        })
      };
      wx.requestPayment(paydata);
      // var date = new Date();
      // nowTime = Math.floor((date.getTime() / 1000)))
      // var nonceStr = that.randomString(32);
      // console.log(nonceStr);
      // var orderNo = res.data.data.order_no;
      // var data = {
      //   data: {
      //     orderNo
      //   }
      // };
      //   app.request('testPayed', function (res) {
      //     if (res.data.errMsg === '') {
      //       wx.hideLoading();
      //       wx.navigateBack();
      //     }
      //   }, data);
    }, data);
  },
  bindChooseCoupon(e) {
    var url = '../' + "chooseCoupon" + '/' + "chooseCoupon?from=order";
    wx.navigateTo({
      url
    });
  },
  // randomString(len) {
  //   len = len || 32;
  //   var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  //   var maxPos = chars.length;
  //   var pwd = '';
  //   for(var i = 0; i <len; i++) {
  //     pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  //   }
  //   return pwd;
  // }

})

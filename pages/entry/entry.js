//index.js
//获取应用实例
var app = getApp();

var Entry = require('../../lib/js/entry.js');
var QQMapWX = require('../../lib/js/qqmap-wx-jssdk.min.js');
Page({
  data: {
    wxUserInfo: {}, // 微信用户基本信息
    ugorder: {}, // 绑定手机和订单状态
    sidebarCtrl: 0, // 侧边栏控制
    cTime: {}, // 预约时间
    car: {},//car
    addr: {}, // 预约地址
    allowBanSubmit: false, // 是否允许提交
    isLogin: false,
    isDriver: false,
    isDuser: false,
    prv: "",
  },
  showNum: 0,
  entry: null,
  freshSaga:false,
  onLoad(option) {
    console.log("entry onLoad,option1111:", option)
    let that = this
    app.getWxUser(app.setPageData(this, 'wxUserInfo'))
    // 页面初始化
    this.entry = new Entry.entry(this);
    this.entry._init(); // 初始化信息
    app.globalFreshUg=true;
  },
  cbUgOrder(res) {
    // function(res) {
    //   that.setData({ ugorder: res.data })
    // }
    app.globalFreshUg=false;
    if (res.data.isDuser === 1) {
      wx.setEnableDebug({
        enableDebug: true
      })
      console.log("is debug true----------")
    }
    let isDriver = false
    if (res.data.userType === 1) {
      isDriver = true
    }
    this.setData({ ugorder: res.data, isDriver })
    let ol = res.data.lastOrder
    let allowBanSubmit = false
    console.log("set ugorder")
    if (ol.car.id !== 0) {
      app.keepIndexData.car = ol.car
      this.setData({
        allowBanSubmit: true,
        car: ol.car,
      })
    }
    if (ol.usualaddr !== "") {
      let addr = JSON.parse(ol.usualaddr)
      console.log("addr---", addr.location.lat)
      if (addr.location.lat !== null) {
        app.keepIndexData.addr = addr
        this.setData({
          addr
        })
      }
    }
  },
  onShow(option) {
    this.showNum++
    console.log("this.freshSaga", this.freshSaga, app.globalFreshUg)
    console.log("entry onshow111111", this.showNum, "show option:", option)
    if (app.globalFreshUg === true){
      app.rh('ugorder', this.cbUgOrder)
      console.log("ugorder after111:")
    }
    if (this.showNum < 2) {
      return
    }
    console.log("entry onshow111111>1")
    var that = this;
    var cTime = app.keepIndexData.ct;
    var car = app.keepIndexData.car;
    var addr = app.keepIndexData.addr;

    let allowBanSubmit = false
    if (app.keepIndexData.car.id) {
      allowBanSubmit = true
    }

    if (addr.addr === '') {
      // let entry = new Entry.entry(this);
      this.entry.initAddr();
      addr = app.keepIndexData.addr;
    }

    this.setData({
      cTime,
      car,
      addr,
      allowBanSubmit,
    });
  },
  onShareAppMessage(res) {
    return {
      title: '天地安上门洗车',
      path: '/pages/entry/entry'
    }
  },
  ctrlSidebarOpen() {
    console.log('entry data', this.data)
    this.setData({
      sidebarCtrl: 1,
    });
  },
  ctrlSidebarClose() {
    this.setData({
      sidebarCtrl: 0
    });
  },
  chooseTime() {
    var cTimeJSONStr = JSON.stringify(this.data.cTime);
    wx.navigateTo({
      url: '../chooseTime/chooseTime?ctime=' + cTimeJSONStr
    })
  },
  bindAddrChange() {
    var that = this;
    // 打开地图选择位置
    wx.chooseLocation({
      success(res) {
        var addr = {
          location: {
            lat: res.latitude,
            lng: res.longitude
          },
          addr: res.address,
          remark: ''
        };

        // 成功回调并不会触发onShow,所以手动设置
        that.setData({
          addr: addr
        });

        app.keepIndexData.addr = addr;
      }
    });
  },
  bindAddrRemark(e) {
    var str = e.detail.value;
    var addr = this.data.addr;
    addr.remark = str;

    this.setData({
      addr: addr
    });

    app.keepIndexData.addr = addr;
  },

  bindCarInfoChange() {
    wx.navigateTo({
      url: '../chooseCar/chooseCar?key=entry'
    });
  },

  bindRouterTo(e) {
    var routername = e.currentTarget.dataset.routername;
    var url = '../' + routername + '/' + routername;
    wx.navigateTo({
      url
    });
  },

  bindSubmit() {
    var that = this
    var a = true;
    var b = true;
    var c = true;
    console.log('app.keepIndexData', app.keepIndexData)

    // begin-------------调用腾讯地图API-------------------
    // 实例化API核心类
    var demo = new QQMapWX({
      key: 'AWLBZ-C5G3F-NRBJL-NJIWF-Q7YIS-AUB6B' // 必填
    });

    // 调用接口
    demo.reverseGeocoder({
      location: {
        latitude: app.keepIndexData.addr.location.lat,
        longitude: app.keepIndexData.addr.location.lng
      },
      // 获取城市名字
      success: function (res) {
        console.log('resresresresresresresres', res);
        // var prv = res.result.ad_info.province;
        that.data.prv = res.result.ad_info.province
        if (0 && that.data.prv !== "福建省") {
          console.log("999999")
          wx.showToast({
            title: '服务范围仅限厦门市',
            duration: 2000,
            image: '../../lib/img/icon/error.png'
          })
          a = false;
        }
        if (!that.data.allowBanSubmit) {
          wx.showToast({
            title: '信息未填写',
            image: '../../lib/img/icon/error.png'
          })
          b = false;
        }

        if (that.data.ugorder.mobile === '') {
          app.globalFreshUg = true
          wx.navigateTo({
            url: '../proofPhone/proofPhone'
          });
          c = false;
        };
        if (a && b && c) {
          console.log("abc", a + b + c)
          this.freshSaga = true;
          app.globalFreshUg=true
          console.log("abc this.fresh", this.freshSaga, app.globalFreshUg)
          wx.navigateTo({
            url: '../sureOrder/sureOrder'
          });
        }
      },
      // fail: function(res) {
      //     console.log(res);
      // },
      // complete: function(res) {
      //     console.log(res);
      // }
    });
    // end---------------调用腾讯地图API-------------------

    // console.log("0101010101101001")

    //     if (!this.data.allowBanSubmit) {
    //       wx.showToast({
    //         title: '信息未填写',
    //         image: '../../lib/img/icon/error.png'
    //       })
    //       return false;
    //     }

    //     if (this.data.ugorder.mobile === '') {
    //       wx.navigateTo({
    //         url: '../proofPhone/proofPhone'
    //       });
    //       return false;
    //     };

    //     wx.navigateTo({
    //       url: '../sureOrder/sureOrder'
    //     });

  },
  bindCallKfPhone() {
    wx.makePhoneCall({
      phoneNumber: '18950156229'
    });
  }
});
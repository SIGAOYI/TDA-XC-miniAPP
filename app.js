App({
  onLaunch (option) {
    console.log("app onlaunch option:",option)
    this.initData();
    // this.login();
    this.wxLogin();
    // this.checkWxLogin();
    wx.removeStorage({
      key: 'remark',
      success: function (res) { }
    });

  },
  initData(){

  },
  // 首页信息存储数据格式;
  keepIndexData: {
    ct: {
      st: undefined,
      et: undefined,
      stStr: '',
      etStr: ''
    },
    addr: {
      addr: '',
      remark: '',
      location: {
        lat: undefined,
        lng: undefined
      }
    },
    car: {
      color: '',
      gender: undefined,
      id: undefined,
      linkman: '',
      phone: '',
      plate: ''
    }
  },
  globalData: {
    domain: 'tdacar.cn',
    path: 'https://tdacar.cn/',
    // domain:'zhimi.wang:800',
    // path: 'https://zhimi.wang:800/',
    wxFullInfo: undefined,
    user:undefined,
    account:{
      useable:undefined,
      coupons:[],
      couponNum:0,
    },
    socketOpen:false,
  },
  globalFreshUg:false,
  showErr(title){
    wx.showToast({
      title: title,
      image: '../../lib/img/icon/error.png'
    })
  },
  getAccount(cb,fresh){
    let that=this
    if (fresh || this.globalData.account.useable === undefined){
      this.rh('account', function (res) {
        let coupons = res.data.coupons.map((item) => {
          item.coupon.indate = that.tools.stampToTimeStr(item.coupon.indate)
          item.coupon.money = item.coupon.money / 100
          return item
        })
        console.log('account resssss',res)
        that.globalData.account={
          useable:res.data.useable,
          coupons,
          couponNum: res.data.couponNum,
        }
        typeof cb === "function" && cb(that.globalData.account)
      }, {})
    }
    console.log("getaccount not rh,cb,account:", typeof cb, that.globalData.account)
    typeof cb === "function" && cb(that.globalData.account)
  },
  getWxUser(cb){
    console.log('getWxUser in')
    if (this.globalData.wxFullInfo){
      typeof cb == "function" && cb(this.globalData.wxFullInfo.userInfo)
    }else{
      this.wxLogin(null,cb)
    }  
  },
  checkWxLogin(){
    let that=this
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        console.log('checkSession suc', that.globalData.wxFullInfo)
      },
      fail: function () {
        //登录态过期
        console.log('checkSession fail')
        that.wxLogin(); //重新登录
      }
    })
  },
  wxLogin(sucFunc,cbUserInfo){
    console.log('wxlogin in')
    let that = this
    wx.login({
      success(res) {
        console.log('wx.login res:',res)
        if(res.code){
          that.wxLoginCode=res.code
        } else {
          console.log('wx.login res fail:' + res.errMsg)
        }
        if (!that.globalData.wxFullInfo){
          that.getWxFullInfo(sucFunc,cbUserInfo);
        }else{
          if (typeof sucFunc === 'function') {
            sucFunc()
          }
        }
      },
      fail(res) {
        console.log('wx -------login fail', res);
      }
    });
  },
  getWxFullInfo(sucFunc, cbUserInfo){
    console.log("getWxFullInfo in")
    let that=this
    wx.getUserInfo({
      withCredentials: true,
      success(res) {
        that.globalData.wxFullInfo = res
        // that.globalData.wxUserInfo = res.userInfo
        console.log("getWxFullInfo suc res", res)
        typeof sucFunc == "function" && sucFunc()
        console.log("sucFunc == function", sucFunc == "function")
        typeof cbUserInfo == "function" && cbUserInfo(that.globalData.wxFullInfo.userInfo)
        console.log("cbUserInfo == function", cbUserInfo == "function")
      },
      fail(res) {
        console.log('getWxFullInfo getUserInfo fail', res);
      }
    });
  },
  reqMsg:[],
  wxLoginCode: undefined,
  cookieHeader: undefined,
  isLogin: false,
  loginStart:false,

  login(sucFunc,extraParams){
    console.log("login in extraParams", extraParams, "loginCode", this.wxLoginCode, 'wxFullInfo', this.globalData.wxFullInfo)
    if (this.loginStart || this.isLogin){
      console.log("!!alreadyLogin")
      return
    }else{
      console.log("loginstart to true")
      this.loginStart=true
    }
    if (!this.wxLoginCode || this.globalData.wxFullInfo===undefined){
      console.log("login to wxLogin shift start to false")
      let that=this
      this.loginStart=false
      this.wxLogin(function(){
        that.login(sucFunc, extraParams)
      });
      return
    }
    let payload = { code: this.wxLoginCode, userInfo: this.globalData.wxFullInfo}
    if(extraParams){
      object.assign(payload, extraParams)
    }
    this.rh('login',sucFunc, payload)
  },
  loginSuc(res){
    console.log("loginSuc res:", res)
    this.isLogin=true;
    this.loginStart=false;
    this.cookieHeader = res.data.trd_session;
    this.globalData.user = res.data.user
    // this.globalData.lastOrder=res.order
    console.log("loginsuc msgLength",this.reqMsg.length,this.reqMsg)
    for (var i = 0; i < this.reqMsg.length; i++) {
      console.log("for requestHttp path:", this.reqMsg[i].path,this.reqMsg[i])
      this.rh(this.reqMsg[i].api, this.reqMsg[i].successfunc, this.reqMsg[i].dataobj);
       this.reqMsg.pop()
    }
  },
  rh(api, successfunc, dataobj){
    console.log("----#rh in api:",api,"dataobj:",dataobj)
    var path = "https://" + this.globalData.domain + "/" + api;
    var ch = this.cookieHeader;
    console.log('---rh ch:',ch,"islogin:",this.isLogin)
    if(api!=='login' && (ch===undefined || this.isLogin===false)){
      console.log("rh not login push to login")
      this.reqMsg.push({ api, successfunc, dataobj});
      this.login(this.loginSuc);
    }else{
      this.request(path, ch, this.wrapSuc(successfunc,api), dataobj);
    }
  },
  wrapSuc(sucFunc,name){
    let that=this
    return function(res){
      console.log("###req suc for:"+name,res)
      let resp=res.data
      if (resp.errMsg !== "") {
        console.log("--resp err:", resp.errMsg)
      }
      if (name === 'login') {
        that.loginSuc(resp)
        return
      }
      if(typeof sucFunc==='function'){
        sucFunc(resp)
      }
    }
  },
  // wx.request
  request(path, ch, successfunc, dataobj) {
    console.log("###request in,dataobj,successfunc:",dataobj, successfunc)
    wx.request({
      url: path,
      header: {
        'content-type': 'application/json',
        'Cookie': ch
      },
      data: { data : dataobj},
      method: 'POST',
      success: successfunc,
      fail(res) {
        console.log('request fail for'+path+':', res);
      }
    });
  },
  setGlobalData(globalVarName) {
    return function (aVar) {
      that.globalData.globalVarName = aVar
    }
  },
  setPageData(page,name){
    return function(data){
      console.log("setPageData name,data",name,data)
      page.setData({[name]:data})
    }
  },
  pageDataSet(page) {
    return function (res) {
      // page.setData({ ...res.data })
    }
  },
  onError: function (msg) {
    console.log("app onerror msg:",msg)
  },
  tools:{
    stampToTimeStr: stampToTimeStr,
    
  }
});

function stampToTimeStr(stamp) {
  var date = new Date();
  date.setTime(stamp);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();

  var md = mapArr([year, month, day]);
  var hm = mapArr([hour, minute]);
  function mapArr(arr) {
    var maparr = arr.map((item) => {
      if (item < 10) {
        item = '0' + item;
        return item;
      } else {
        return item;
      }
    });
    return maparr;
  }
  var str = md.join('-') + ' ' + hm.join(':');
  return str;
}
// addCar.js

//获取应用实例
var app = getApp();

Page({
  data: {
    addInfo: {},
    edit: false
  },
  onLoad(option) {
    console.log("addCar onLoad:",option)
    let aui={gender:1}
    let edit=false
    if (option.aui) {
      aui = JSON.parse(option.aui);
      edit=true
    };
    this.setData({
      addInfo: aui,
      edit
    });
  },
  bindInfoChange(e) {
    var that = this;
    console.log("bindInfoChange e:",e)
    // 获取值之后移除空格
    var val = e.detail.value;
   

    var addInfo = this.data.addInfo;
    // var _type = e.target.dataset.type;
    var _type = e.currentTarget.dataset.type;
    
    if (_type === 'gender') {
      val = parseInt(e.currentTarget.dataset.value);
    }else{
      val = removeAllSpace(val);
    }

    if (_type === 'plate') {
      val = val.toLocaleUpperCase();
    }

    setInfo(_type, val, that);

    // 移除空格func
    function removeAllSpace(str) {
      return str.replace(/\s+/g, "");
    };

    // set数据
    function setInfo(_type, val, that) {
      var addInfo = that.data.addInfo;
      addInfo[_type] = val;
      that.setData({
        addInfo
      });
    }
  },
  bindAddrChange() {
    var that = this;
    var addInfo = this.data.addInfo;

    wx.chooseLocation({
      success(res) {
        var addr = {
          location: {
            lat: res.latitude,
            lng: res.longitude
          },
          addr: res.address
        };
        addInfo.usualaddr = addr
        that.setData({
          addInfo
        });
      }
    });
  },

  bindAddrRemark(e) {
    var str = e.detail.value;
    var addInfo = this.data.addInfo;
    if (addInfo.usualaddr === undefined) {
      addInfo.usualaddr = {};
    };
    addInfo.usualaddr.remark = str;
    this.setData({
      addInfo
    });
  },

  bindSubmitForm() {
    var addInfo = this.data.addInfo;
    var regCarNum = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-z]{1}[A-z]{1}[A-z0-9]{4}[A-z0-9挂学警港澳]{1}$/;
    var regName = /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/;
    var regPhone = /^1(3|4|5|7|8)\d{9}$/;
    console.log("addInfo",addInfo)
    console.warn(regCarNum.test(addInfo.plate), regName.test(addInfo.linkman), regPhone.test(addInfo.phone) ,addInfo.gender !== undefined ,addInfo.color !== '')
    // !regCarNum.test(addInfo.plate)
    if (addInfo.plate === undefined || addInfo.plate === ''){
      app.showErr("车牌号不能为空")
    } else if (addInfo.color === undefined || addInfo.color === '') {
      app.showErr("颜色不能为空")
    } else if (addInfo.linkman === undefined || !regName.test(addInfo.linkman)){
      app.showErr("联系人有误")
    }else if (addInfo.gender === undefined){
      app.showErr("性别不能为空")
    }else if (!regPhone.test(addInfo.phone)) {
      app.showErr("电话有误")
    }else{
      wx.showLoading({
        title: '正在提交',
        mask: true
      });
      app.rh('car', function () {
        wx.hideLoading();
        wx.navigateBack();
      }, { car: addInfo });
    }

    // if (regCarNum.test(addInfo.plate) && regName.test(addInfo.linkman) && regPhone.test(addInfo.phone) && addInfo.gender !== undefined && addInfo.color !== '') {
    //   wx.showLoading({
    //     title: '正在提交',
    //     mask: true
    //   });
    //   app.rh('car', function () {
    //     wx.hideLoading();
    //     wx.navigateBack();
    //   }, {car: addInfo});
    // } else {

    // };
  },
  bindDelInfo () {
    wx.showLoading({
      title: '正在删除',
      mask: true
    });
    var data = {
      // data: {
        car: {
          id: this.data.addInfo.id
        },
        delCar: this.data.addInfo.id,
      // }
    };
    app.rh('car', function () {
      wx.hideLoading();
      wx.navigateBack();
    }, data);
  }
})
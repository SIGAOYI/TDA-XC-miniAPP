// qa.js
Page({
  bindCallKfPhone() {
    wx.makePhoneCall({
      phoneNumber: '18950156229'
    });
  },
  onShareAppMessage(res) {
    return {
      title: '天地安上门洗车',
      path: '/pages/entry/entry'
    }
  }
})
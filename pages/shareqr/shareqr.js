// shareqr.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc: ''
  },
  onLoad () {
    wx.showNavigationBarLoading();
    var that = this;

    app.rh('qrpic', function (res) {
      var imgsrc = res.data;

      that.setData({
        imgsrc
      });

      console.log(imgsrc);

      wx.hideNavigationBarLoading();
    });
  },
  onShareAppMessage(res) {
    return {
      title: '天地安上门洗车',
      path: '/pages/entry/entry'
    }
  },
  bindLoadImgToLocal () {
    var img = this.data.imgsrc;

    // console.log(img);
    wx.showNavigationBarLoading();
    wx.downloadFile({
      url: img,
      success (res) {
        var path = res.tempFilePath

        wx.saveImageToPhotosAlbum({
          filePath: path,
          success() {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            });
          },
          fail() {
            wx.showToast({
              title: '保存失败',
              image: '../../lib/img/icon/error.png'
            });
          },
          complete () {
            wx.hideNavigationBarLoading();
          }
        })
      }
    })
  }
})
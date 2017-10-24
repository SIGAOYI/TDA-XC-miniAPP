var QMAP = require('../../lib/js/qqmap-wx-jssdk.min.js');
var Entry = function (_that) {
    var t = {
      key: 'AWLBZ-C5G3F-NRBJL-NJIWF-Q7YIS-AUB6B',
      app: getApp(),
      setData (obj) {
        _that.setData(obj);
      },
      initTime () {
        var date = new Date();
        const stime = 120;
        const etime = 180;
        var time = date.getTime();
        var cTime = {};
        
        cTime.st = time + (stime * 60 * 1000);
        cTime.et = time + (etime * 60 * 1000);
        cTime.stStr = this.timeStrSwitchStamp(cTime.st);
        cTime.etStr = this.timeStrSwitchStamp(cTime.et);

        this.app.keepIndexData.ct = cTime;
        console.log("set inittime")
        this.setData({ cTime })
      },
      timeStrSwitchStamp(param) {
        if (typeof (param) === 'number') {
          return this.stampToTimeStr(param);
        } else if (typeof (param) === 'string') {
          return this.timeStrToStamp(param);
        } else {
          console.log('error');
          return false;
        }
      },
      stampToTimeStr(stamp) {
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
      },
      timeStrToStamp(str) {
        var reg = /\d+/g;
        var arr = str.match(reg);
        arr = arr.map((item) => {
          var i = parseFloat(item);
          return i;
        })
        var date = new Date();
        date.setFullYear(arr[0]);
        date.setMonth(arr[1] - 1);
        date.setDate(arr[2]);
        date.setHours(arr[3]);
        date.setMinutes(arr[4]);
        var stamp = date.getTime();
        return stamp;
      },
      initAddr() {
        var qmap = new QMAP({
          'key': this.key
        });
        this.addr(qmap);
      },
      addr(qmap) {
        var that = this;
        qmap.reverseGeocoder({
          success: function (res) {
            var addr = {
              location: res.result.location,
              addr: res.result.address,
              remark: ''
            };
            // console.log("set init addr")
            // console.log("_that.data.addr.addr22", _that.data.addr.addr)
            that.app.keepIndexData.addr = addr;
            if (_that.data.addr.addr === undefined) {
              that.setData({ addr }); // 回调会迟于onShow,所以在回调中赋值
            }
          },
          fail: function (res) {
            console.log('fail');
          }
        });
      },
      _init () {
        // 应用实例;
        // var app = getApp();

        // 判断应用实例中的 ct 即预约时间是否有值, 是否初始化默认值
        if (_that.data.cTime.st === undefined) {
          this.initTime();
        }
        // 判断应用实例中的 ct 即预约时间是否有值, 是否初始化默认值
        // console.log("_that.data.addr.addr", _that.data.addr.addr)
        if (_that.data.addr.addr === undefined) {
          this.initAddr();
        }

        // 获取用户信息(头像,昵称等);
        // this.getUserInfo();
      }
    };
    return t;
}
module.exports = {
  entry: Entry
}
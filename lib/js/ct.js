var ct = function (_that) {
  var t = {
    setData(obj, name, val) {
      _that.setData(obj);
    },
    initTime(setime) {
      // 获取当前时间戳
      // const stime = 30;
      var date = new Date();
      var nowt = date.getTime();
      // 计算出预约的起始和截止时间
      var limitArr = this.timeLimit(nowt);
      // 计算起始时间的字符串
      var limitStrArr = [setime.st, limitArr[1], setime.et, limitArr[3]];
      limitStrArr = limitStrArr.map((item) => {
        var i = this.timeStrSwitchStamp(item);
        return i;
      });
      // 分解字符串
      var pickerTime = this.pickerUseStr(limitStrArr);

      this.setData({ pickerTime });

      this.setData({ limitArr });

      var cTime = {
        st: limitArr[0],
        stStr: limitStrArr[0],
        et: limitArr[2],
        etStr: limitStrArr[2]
      }

      this.setData({ cTime });
    },
    setCTime(type, strval) {
      var cTime = _that.data.cTime;
      var str = type + 'Str';
      cTime[str] = strval;
      cTime[type] = this.timeStrSwitchStamp(strval);
      _that.setData({ cTime });
    },
    timeLimit(nowt) {
      const stime = 30; // 30分钟
      const sday = 7; // 7天
      // 预约开始的起始时间
      var sts = nowt + (stime * 60 * 1000);
      // 预约截止的起始时间
      var ets = sts + (stime * 2 * 60 * 1000);
      // 预约截止的终点时间
      var ete = sts + (sday * 24 * 60 * 60 * 1000);
      // 预约开始的截止时间
      var ste = ete - (stime * 60 * 1000);
      var arr = [sts, ste, ets, ete];
      return arr;
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
    pickerUseStr(arr) {
      var obj = {};
      var name = ['stsd', 'stst', 'etsd', 'etst'];
      for (var i = 0; i < arr.length; i++) {
        if ((i % 2) !== 0) {
          continue;
        }
        let d = arr[i].substring(0, 10);
        let t = arr[i].substring(11);
        obj[name[i]] = d;
        obj[name[(i + 1)]] = t;
      }
      return obj;
    },
    _init(ctime) {
      var that = this;
      var pickerTime = that.initTime(ctime);
    }
  };
  return t;
}
module.exports = {
  main: ct
}
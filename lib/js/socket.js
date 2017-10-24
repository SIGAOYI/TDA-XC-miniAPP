var socket = function (app) {
    var s = {
        // 请求地址前部分;
        wsurl: 'wss://tdacar.cn/ws?code=',
        // app: getApp(),
        init () {
            var that = this;
            // 获取user'code; 并连接socket;
            wx.login({
                success (res) {
                    console.log(app.socketOpen);
                    // 拼接请求地址
                    that.wsurl += res.code;
                    // 连接socket
                    that.connectSocket(that.wsurl);
                    // 监听WebSocket 是否打开
                    that.onSocketOpen();
                    that.onSocketMessage();
                }
            })
        },
        connectSocket (wsurl) {
            wx.connectSocket({
                url: wsurl,
                header:{
                    'content-type': 'application/json'
                },
                method:"GET",
                success () {
                    console.log('connectSocket_success');
                }
            });
        },
        onSocketOpen () {
            var that = this;
            wx.onSocketOpen(function(res) {
                // console.log(that.app.globalData.socketOpen);
                app.socketOpen = true;
                for (var i = 0; i < app.socketMsgQueue.length; i++){
                    that.sendSocketMessage(app.socketMsgQueue[i]);
                }
                app.socketMsgQueue = [];
            })
        },
        sendSocketMessage (msg) {
            var that = this;
            if (app.socketOpen) {
                wx.sendSocketMessage({
                    data: msg
                });
            } else {
                app.socketMsgQueue.push(msg);
            }
        },
        onSocketMessage () {
            wx.onSocketMessage(function(res) {
                console.log('收到服务器内容：' + res.data);
                console.log('and one');
            })
        }
    };
    return s;
}
module.exports = {
  socket: socket
}

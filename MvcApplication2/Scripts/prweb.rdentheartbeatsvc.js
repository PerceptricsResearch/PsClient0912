/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.6.4-vsdoc.js" />
(function (prweb, $) {
    prweb.rdentheartbeatsvc = (function () {
        var that = {};

        that.rdentheartbeatURL = null;

        that.myintervaId = 0;
        that.StartHeartBeat = function () {
//            that.myintervaId = setInterval(that.sendActiveHeartBeattoServer, 30000); // 30 seconds
        };

        that.StopHeartBeat = function () {
//            clearInterval(that.myintervaId);
        };



        that.OktoSend = true; // don't send anymore requests unless ajax call comes back ok...

        that.sendActiveHeartBeattoServer = function () {
            if (that.OktoSend) {
                var myurl = that.rdentheartbeatURL; // was populated in view on the server...passed as an option...in subscriberhome...

                that.OktoSend = false;
                prweb.dataManager.sendRequest({
                    url: myurl,
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (heartbeatobjectfromserver) {
                        that.OktoSend = true; //heartbeatobjectfromserver
                    },
                    error: function () {
                        alert("prweb.rdentheartbeatsvc.js reports sendActiveHeartBeattoServer Error ");
                    }
                });
            }
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
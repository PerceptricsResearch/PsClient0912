/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.debugsvc = (function () {
        var that = {};

        that.Vmx = {
            dxnry: ko.observableArray([{Msg: "debug console"}])
        };


        that.Write = function (dbgmsg) {
            that.Vmx.dxnry.push({ Msg: dbgmsg });
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
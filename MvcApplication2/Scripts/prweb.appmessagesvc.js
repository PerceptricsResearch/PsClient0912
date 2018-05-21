/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.appmessagesvc = (function () {
        var that = {};

        that.SvcOptions = {
            viewhtmlurl: false
        };

        that.Vmx = {
            message: ko.observable(""),
            subscriptions: {
            },
            populate: function () {
                try {
                    this.message("...loading..");
                }
                catch (ex) {
                    alert("prweb.appmessagesvc.Vmx.populate reports " + ex.Message);
                }
                return;
            },
            dispose: function () {
                try {

                }
                catch (ex) {
                    alert("prweb.appmessagesvc.Vmx.dispose reports " + ex.Message);
                }
                return;
            }
        };

        //#region Message Methods

        that.PopulateViewMessage = function (msgtxt) {
            try {
                that.Vmx.message(msgtxt);
            }
            catch (ex) {
                alert("prweb.appmessagesvc.Vmx.PopulateViewMessage reports " + ex.Message);
            }
            return;
        };

        //#endregion


        that.WidgetizeAppMessage = function () {
            try {
                that.Vmx.populate();
                switch (true) {
                    case (prweb.Platform == "subscriber" || prweb.Platform == "metrics"):
                        $("#appmessagewrapper").appmessage();//could do options here...make the appmessage draggable etc...
                }

            }
            catch (ex) {
                alert("prweb.appmessagesvc.WidgetizeNavi reports " + ex.Message);
            }
            return;
        };

        that.Initialize = function () {
            try {
                switch (true) {
                    case (prweb.Platform == "subscriber" || prweb.Platform == "metrics"):
                        that.WidgetizeAppMessage();
                        break;
                };
            }
            catch (ex) {
                alert("prweb.appmessagesvc.Initialize reports " + ex.Message);
            }
            return;
        };

        that.Dispose = function () {
            try {
                that.Vmx.dispose();
            }
            catch (ex) {
                alert("prweb.appmessagesvc.Dispose reports " + ex.Message);
            }
            return;
        };

        that.Shutdown = function () {
            try {
                that.Dispose();
            }
            catch (ex) {
                alert("prweb.appmessagesvc.Shutdown reports " + ex.Message);
            }
            return;
        };


        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.surveypagenavisvc = (function () {
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
                    this.message("SurveyPageNaviSvc Vmx populate");
                }
                catch (ex) {
                    alert("prweb.surveypagenavisvc.Vmx.populate reports " + ex.Message);
                }
                return;
            },
            dispose: function () {
                try {

                }
                catch (ex) {
                    alert("prweb.surveypagenavisvc.Vmx.dispose reports " + ex.Message);
                }
                return;
            }
        };

        that.WidgetizeNavi = function () {
            try {
                //put the surveypagenavigatorwidget on the right jqueryselector object
                // if it was named the same thing in every platform, this would always be the same code...
                that.Vmx.populate();
                switch (true) {
                    case (prweb.Platform == "subscriber"):
                        $("#surveypagenavirootcontainer").surveypageslist();
                        prweb.appsvc.ViewModelx.hassurveypagescontext(true); //shows the orange pages btn in appbar...
                }

            }
            catch (ex) {
                alert("prweb.surveypagenavisvc.WidgetizeNavi reports " + ex.Message);
            }
            return;
        };

        that.RetrieveSurveyPageNaviViewHtml = function () {
            try {
                if (that.SvcOptions.viewhtmlurl) {
                    prweb.dataManager.sendRequest({
                        url: that.SvcOptions.viewhtmlurl,
                        dataType: 'html',
                        type: 'GET',
                        success: function (viewhtml) {
                            try {
                                $("#shomesurveypagenavipanel").html("").html(viewhtml);
                                viewhtml = null;
                                that.WidgetizeNavi();
                            }
                            catch (ex) {
                                alert("prweb.surveypagenavisvc.RetrieveSurveyPageNaviViewHtml.success reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (ex) {
                            alert("prweb.surveypagenavisvc.RetrieveSurveyPageNaviViewHtml.sendRequest reports error..." + ex.error());
                        }
                    });
                }
            }
            catch (ex) {
                alert("prweb.surveypagenavisvc.Initialize reports " + ex.Message);
            }
            return;
        };

        that.Initialize = function () {
            try {
                switch (true) {
                    case (prweb.Platform == "subscriber"):
                        that.RetrieveSurveyPageNaviViewHtml();
                        break;
                };
            }
            catch (ex) {
                alert("prweb.surveypagenavisvc.Initialize reports " + ex.Message);
            }
            return;
        };

        that.Dispose = function () {
            try {
                that.Vmx.dispose();
                $("#shomesurveypagenavipanel").html("");
            }
            catch (ex) {
                alert("prweb.surveypagenavisvc.Dispose reports " + ex.Message);
            }
            return;
        };

        that.Shutdown = function () {
            try {
                that.Dispose();
            }
            catch (ex) {
                alert("prweb.surveypagenavisvc.Shutdown reports " + ex.Message);
            }
            return;
        };


        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
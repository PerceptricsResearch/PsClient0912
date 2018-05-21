/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.guestplatformsvc = (function () {
        var that = {};

        //#region SendCommentSupport
        that.SubscriberEmail = false;

        that.SendCommentErrorHandler = function (sendrslt) {
            that.SetMsgAreaSimpleText(sendrslt);
        };
        that.ConfirmSendComment = function (sendrslt) {
            that.SetMsgAreaSimpleText(sendrslt);
        };

        that.NewEmailPkg = function (msghtml) {
            var rslt = {
                ToEmail: "",
                SurveyName: "",
                InitiatingEmail: "",
                MsgColxn: []
            };
            rslt.ToEmail = that.SubscriberEmail;
            rslt.SurveyName = prweb.actionContext.currentsurveyname;
            rslt.InitiatingEmail = "admin@perceptricsresearch.com";
            rslt.MsgColxn.push(msghtml);
            return rslt;
        };

        that.commentURL = false;
        that.SendComment = function (msghtml) {
            if (that.commentURL) {
                try {
                    var myurl = that.commentURL;
                    var dataToSend = {
                        emailpkg: that.NewEmailPkg(msghtml)
                    };
                    if (dataToSend.emailpkg) {
                        prweb.dataManager.sendRequest({
                            url: myurl,
                            cache: false,
                            data: JSON.stringify(dataToSend),
                            dataType: 'json',
                            contentType: 'application/json',
                            success: that.ConfirmSendComment,
                            error: that.SendCommentErrorHandler
                        });
                    }
                    dataToSend = null;
                    myurl = null;
                }
                catch (ex) {
                    alert("prweb.guestplatformsvc.SendComment reports error..." + ex.Message);
                }
            }
            return;
        };
        //#endregion

        //        that.MsgAreaDefaultPage = "<div>Welcome. Thanks for participating.</div>";

        that.MessageAreaVmx = {};
        that.populateMsgAreaVmx = function () {
            var vmx = {
                pageentry: ko.observable(prweb.domaincontentsvc.NewDRObservablePage("x", "0")),
                msgareavisible: ko.observable(true),
                simpletext: ko.observable(),
                subscriptions: {},
                Dispose: null
            };
            vmx.Dispose = function () {

            };
            vmx.pageentry().html("<div>Welcome. Thanks for viewing our research.</div>");
            that.MessageAreaVmx = vmx;
        };

        that.SetMsgAreaSimpleText = function (newtext) {
            that.MessageAreaVmx.pageentry().html("<div>" + newtext + "</div>");
        };

        that.ButtonBarVmx = {};

        that.populateButtonBarVmx = function () {
            var vmx = {
                groupsbtnvisible: ko.observable(true),
                pagesbtnvisible: ko.observable(true),
                detailsbtnvisible: ko.observable(true),
                helpbtnvisible: ko.observable(true),
                subscriptions: {},
                Dispose: null
            };
            vmx.Dispose = function () {

            };
            that.ButtonBarVmx = vmx;
        };

        that.ActionListVmx = {};
        that.populateActionListVmx = function () {
            var vmx = {
                restartbtnvisible: ko.observable(false),
                groupsbtnvisible: ko.observable(false),
                detailsbtnvisible: ko.observable(false),
                guestactionsbtnvwrslts: ko.observable(false),
                guestactionsbtnhelp: ko.observable(true),
                guestactionsbtnprivacy: ko.observable(false),
                guestactionsbtnauthinfo: ko.observable(false),
                guestactionsbtncomment: ko.observable(true),
                guestactionsbtnprsch: ko.observable(true),
                subscriptions: {},
                Dispose: null
            };
            vmx.Dispose = function () {

            };
            that.ActionListVmx = vmx;
        };

        that.PageCount = 1;

        that.GroupsBtnClickAction = function () {
            try {
                //                that.ButtonBarVmx.groupsbtnvisible(false);
            }
            catch (ex) {
                alert("prweb.guestplatformsvc.GroupsBtnClickAction reports error..." + ex.Message);
            }
        };

        that.DetailsBtnClickAction = function () {

        };

        that.CompleteSetUpofGuestPlatform = function () {
            //this sets up a widget...that does all the stuff for handlers etc...
            // presumably, could do a dynamic script call here...
            // load all of the supporting scripts...and in the callback, do this widget setup...
            try {
                prweb.panelsmgr.Initialize();
                $("#prwbuttonbar").guestmanager();
            }
            catch (ex) {
                alert("prweb.guestplatformsvc.CompleteSetUpofGuestPlatform reports error..." + ex.Message);
            }
        };


        that.PlatformInitialize = function (dmdobj) {
            that.CompleteSetUpofGuestPlatform();
        };


        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.publishsurveyview', {
        options: {
            id: 0,
            surveyGuidstring: null,
            chngeSvyStatePkg: null,
            chngSurveyStateURL: null,
            sendRentEmailURL: null,
            rdentDxnryURL: null,
            isDisposed: false
        },

        xevent: "click.publishsurveyview",

//#region Create
        _create: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.publishsurveyview";
                //                this.element.pinchpanzoom({ ppztargetslctor: "#publishsurveyviewkodomnode" });
            }
            prweb.publishsvc.rdldxnryURL = this.options.rdentDxnryURL;
            prweb.publishsvc.InitializePublishStatusInfo();
            prweb.surveymetadatasvc.LaunchSurveyMetaDataView();
            this._populatePublishToStatusBtnClickHandler();
            this._populateRDentLinkClickHandler();
            this._populateSendEmailClickHandler();
            this._populateButtonHandlers(); //edit and back buttons...
        },
//#endregion

        //#region ButtonClickHandlers
        _populatePublishToStatusBtnClickHandler: function () {
            var saveparms = {
                tgtstate: null, //populated in publishsvc.ChangePublishStatusBtnAction
                chgpkg: this.options.chngeSvyStatePkg,
                chngstateURL: this.options.chngSurveyStateURL
            };
            $("#publishtostatusbtn").on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.cancelBubble = true;
                    prweb.publishsvc.ChangePublishStatusBtnAction(saveparms);
                }
                catch (ex) {
                    alert("publishsurveyview.PublishToStatusBtnClickHandler reports " + ex.Message);
                }
                return false;
            });
            return;
        },

        _populateButtonHandlers: function () {
            try {
                $("#publisheditdonebtn").on(this.xevent, function (e) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    prweb.publishsvc.EditDoneButtonAction();
                    return false;
                });
                $("#publishbackcancelbtn").on(this.xevent, function (e) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    prweb.publishsvc.BackCancelButtonAction();
                    return false;
                });
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.PopulateButtonHandlers reports " + ex.Message);
            }
            return;
        },

        _populateSendEmailClickHandler: function () {
            var rdentemailurl = this.options.sendRentEmailURL;
            $("#rdentlinksendemailbtn").on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.cancelBubble = true;
                    prweb.publishsvc.SendEmailBtnAction(rdentemailurl);
                    //                $("#publishmsgarea").css("display", "");
                }
                catch (ex) {
                    alert("prweb.publishsurveyview.SendEmailClickHandler reports " + ex.Message);
                }
                return false;
            });
            return;
        },

        _populateRDentLinkClickHandler: function () {
            $("#rdentlinkbtn").on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.cancelBubble = true;
                    //                    $("#rdentlinktext").css("display", "");
                    prweb.publishsvc.RDentLinkBtnAction();
                }
                catch (ex) {
                    alert("prweb.publishsurveyview.RDentLinkClickHandler reports " + ex.Message);
                }
                return false;
            });
            return;
        },
        //#endregion

        //        _populatepublishmsgareaClickHandler: function () {
        //            //            var self = this;
        //            $("#publishmsgarea").bind(this.xevent, function () {
        //                //                $(this).fadeOut();
        //            });
        //        },

        //        _populateTextAreaReadonlyFocusHandler: function () {
        //            this.options.rdentlinktext.focus(function () {
        //                var mdt = $(this);
        //                mdt.attr("readonly", "");
        //                mdt.select();
        //            });
        //        },


        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#publishtostatusbtn").off(this.xevent);
                    $("#publisheditdonebtn").off(this.xevent);
                    $("#publishbackcancelbtn").off(this.xevent);
                    $("#rdentlinkbtn").off(this.xevent);
                    $("#rdentlinksendemailbtn").off(this.xevent);
                    //                    if (prweb.IsTouch) {
                    //                        //                        this.element.data("pinchpanzoom").dispose();
                    //                    }
                    prweb.surveymetadatasvc.RemoveSurveyMetaDataView();
                    prweb.publishsvc.Shutdown();
                }
                catch (ex) {
                    alert("prweb.publishsurveyview.dispose reports error " + ex.Message);
                    ex = null;
                }
                finally {
                    this.options.isDisposed = true;
                }
            }
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.publishsurveyview.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
        //#endregion

    });
} (this.prweb, jQuery));

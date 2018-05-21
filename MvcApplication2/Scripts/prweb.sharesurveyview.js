/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.sharesurveyview', {
        //#region Options
        options: {
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion
        xevent: "click.sharesurveyview",

        //#region Create
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.sharesurveyview";
                };
                this._populateButtonHandlers();
                prweb.surveymetadatasvc.RegisterSMDConsumer();
                prweb.surveymetadatasvc.LaunchSurveyMetaDataView();
                prweb.sharesurveysvc.RetrieveSurveyLinks();
            }
            catch (ex) {
                alert("prweb.sharesurveyview.create reports " + ex.Message);
            }
        },

        _populateButtonHandlers: function () {
            try {
                $("#shareeditdonebtn").on(this.xevent, function (e) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    prweb.sharesurveysvc.EditDoneButtonAction();
                    return false;
                });
                $("#sharebackcancelbtn").on(this.xevent, function (e) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    prweb.sharesurveysvc.BackCancelButtonAction();
                    return false;
                });
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.PopulateButtonHandlers reports " + ex.Message);
            }
            return;
        },

        populateDataBoundButtonHandlers: function () {
            $(".shareshowlinkbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.sharesurveysvc.ShowLinkButtonAction(ko.dataFor(this));
                return false;
            });
            $(".sharesendlinkbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.sharesurveysvc.SendLinkButtonAction(ko.dataFor(this));
                return false;
            });
        },

        //#endregion
        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#shareeditdonebtn").off(this.xevent);
                    $("#sharebackcancelbtn").off(this.xevent);
                    $(".shareshowlinkbtn").off(this.xevent);
                    $(".sharesendlinkbtn").off(this.xevent);
                    prweb.sharesurveysvc.Shutdown();
                }
                catch (ex) {
                    alert("prweb.sharesurveyview.dispose reports error " + ex.Message);
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
                alert("prweb.sharesurveyview.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
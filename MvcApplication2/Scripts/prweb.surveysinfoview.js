/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.surveysinfoview', {
        options: {
            id: 0,
            ismymainpanelpartial: false,
            isDisposed: false
        },

        xevent: "click.surveysinfoview",

        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.surveysinfoview";
                }
                prweb.surveysinfosvc.xevent = this.xevent;
                prweb.surveysinfosvc.PopulateCustomBindings();
                prweb.surveymetadatasvc.RegisterSMDConsumer();
                prweb.surveysinfosvc.RetrieveSurveyInfoItemColxn();
                this._populateButtonHandlers();
                this._populateSurveyPreviewBtnHandler();
                prweb.surveymetadatasvc.LaunchSurveyMetaDataView();
            }
            catch (ex) {
                alert("prweb.surveysinfoview.create reports " + ex.Message);
            }
            return;
        },

        _populateButtonHandlers: function () {
            try {
                $("#surveysinfoeditdonebtn").on(this.xevent, function (e) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    prweb.showClick(this);
                    prweb.surveysinfosvc.EditDoneButtonAction();
                    return false;
                });
                $("#surveysinfobackcancelbtn").on(this.xevent, function (e) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    prweb.showClick(this);
                    prweb.surveysinfosvc.BackCancelButtonAction();
                    return false;
                });
            }
            catch (ex) {
                alert("prweb.surveysinfoview.PopulateButtonHandlers reports " + ex.Message);
            }
            return;
        },

        _populateSurveyPreviewBtnHandler: function () {
            $("#surveysinfoshowpagesbtn").on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.cancelBubble = true;
                    prweb.showClick(this);
                    var $swrapper = $("#surveyplayercontainerwrapper");
                    $swrapper.toggle();
                    
                    $("#surveyplayercontainer").surveyplayer();
                    prweb.scrollTo($swrapper);
                    $swrapper = null;
                }
                catch (ex) {
                    alert("prweb.surveyinfoview.ShowPagesBtn handler reports " + ex.Message);
                }
                return false;
            });
            return;
        },


        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    //all of these handlers are populated in a ko.CustomBinding...see surveysinfosvc.PopulateCustomBindings
                    $("#surveysinfoeditdonebtn").off(this.xevent);
                    $("#surveysinfobackcancelbtn").off(this.xevent);
                    $("#surveysinfoshowpagesbtn").off(this.xevent);
                    $(".surveysinfosectionheader").off(this.xevent);
                    $(".surveyinfoitemwrapper").off(this.xevent);
                    $(".surveyinfoitemeditbtn").off(this.xevent);
                    $(".addsurveyinfobtn").off(this.xevent);
                    $(".removesurveyinfobtn").off(this.xevent);
                    prweb.surveymetadatasvc.RemoveSurveyMetaDataView();
                    prweb.surveysinfosvc.Shutdown();
                }
                catch (ex) {
                    alert("prweb.surveysinfoview.dispose reports error " + ex.Message);
                    ex = null;
                }
                finally {
                    this.options.isDisposed = true;
                }
            }
            return;
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.surveysinfoview.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
        //#endregion

    });
} (this.prweb, jQuery));
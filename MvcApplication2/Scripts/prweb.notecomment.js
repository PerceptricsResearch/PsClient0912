/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.notecomment', {
        options: {
            id: 0,
            onbacktoggle: false,
            isnew: false,
            notecommentdata: false,
            isDisposed: false
        },

        xevent: "click.notecomment",

        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.notecomment";
                }
                //                prweb.notecommentsvc.RetrieveSurveyInfoItemColxn();
                this._populateButtonHandlers();
                prweb.notecommentsvc.InitializeNoteCommentData();
                //                    $("#surveyinfostextroot").textentry({ slidoutselctor: "#textentrybottompanel" });
            }
            catch (ex) {
                alert("prweb.notecomment.create reports " + ex.Message);
            }
            return;
        },

        //        populateDataBoundButtonHandlers: function () {
        //            try {

        //            }
        //            catch (ex) {
        //                alert("prweb.notecomment.populateDataBoundButtonHandlers reports " + ex.Message);
        //            }
        //            return;
        //        },

        _populateButtonHandlers: function () {
            try {
                $("#notecommenteditdonebtn").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        prweb.notecommentsvc.notecommentEditDoneButtonAction();
                    }
                    catch (ex) {
                        alert("prweb.notecomment.editdonebtnHandler reports " + ex.Message);
                    }
                    return false;
                });
                $("#notecommentbackcancelbtn").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        prweb.notecommentsvc.notecommentBackCancelButtonAction();
                    }
                    catch (ex) {
                        alert("prweb.notecomment.backcancelbtnHandler reports " + ex.Message);
                    }
                    return false;
                });
            }
            catch (ex) {
                alert("prweb.notecomment.PopulateButtonHandlers reports " + ex.Message);
            }
            return;
        },


        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    //                    prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.smddetailsbtnclick, this._moveToVisualStateShiftMainPanel, this);
                    $("#notecommenteditdonebtn").off(this.xevent);
                    $("#notecommentbackcancelbtn").off(this.xevent);
                    var tedata = $('#textentrycontainerwrapper').data("textentry") || false;
                    if (tedata != false) {
                        tedata.destroy();
                    }
                    else {
                        alert("prweb.notecomment.dispose reports textentry is null...not disposed.");
                    }
                    tedata = null;
                    prweb.notecommentsvc.Shutdown();
                }
                catch (ex) {
                    alert("prweb.notecomment.dispose reports error " + ex.Message);
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
                alert("prweb.notecomment.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
        //#endregion

    });
} (this.prweb, jQuery));
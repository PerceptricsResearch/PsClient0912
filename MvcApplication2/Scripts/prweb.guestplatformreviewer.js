/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.guestplatformreviewer', {
        //#region Options
        options: {
            guestservice: false,
            subscriberemail: false,
            pgzeroURL: false,
            domaindxnry: false,
            baseurlcolxn: false,
            surveyiconmodel: false,
            surveymetadataviewUrl: false,
            groupsslideoutviewUrl: false,
            resultsURL: false,
            commentUrl: false,
            guesthearbeatURL: false,
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion
        xevent: "click.guestplatformreviewer",

        //#region Create
        _create: function () {
            try {
                prweb.setUpKOImageBinding();
                prweb.InitWindowFrame();
                prweb.domaincontentsvc.DomainDxnry = this.options.domaindxnry;
                prweb.surveymetadatasvc.SurveyMetaDataViewUrl = this.options.surveymetadataviewUrl;
                prweb.guestplatformsvc.commentURL = this.options.commentUrl;
                prweb.guestplatformsvc.SubscriberEmail = this.options.subscriberemail;
                if (this._populateSurveyIconListSvc()) {
                    switch (true) {
                        case (this.options.guestservice == "Review"):
                            this._loadReviewerView();
                            break;
                    }
                }
                else {
                    //do the sorry we can't load your survey domain thing...
                    alert("do the sorry we can't load your survey domain thing...");
                }
            }
            catch (ex) {
                alert("prweb.guestplatformreviewer.create reports " + ex.Message);
            }
        },

        //#region populateSurveyIconListSvc
        _populateSurveyIconListSvc: function () {
            var rslt = false;
            try {
                prweb.surveyiconlistsvc.baseURLObject = this.options.baseurlcolxn;
                var simlist = {};
                simlist["0"] = this.options.surveyiconmodel;
                prweb.surveyiconlistsvc.populateVmx(simlist);
                var kodata = prweb.surveyiconlistsvc.viewModelx.myrows()[0];
                prweb.surveymodelsvc.populateVmx(kodata);
                $("#guestheader").addClass("prwnoselect").html(prweb.surveymodelsvc.SurveyName());
                rslt = true;
            }
            catch (ex) {
                alert("prweb.guestplatformreviewer.populateSurveyIconListSvc reports " + ex.Message);
            }
            return rslt;
        },
        //#endregion

        _loadReviewerView: function () {
            try {
                prweb.actionContext.currentsurveyname = prweb.surveymodelsvc.SurveyName();
                $("#guesthcpsurveyhost").removeClass("prwslideouthide");
                if (prweb.IsTouch) {
                    prweb.gestureizer.DesignInitialize();
                }
                $("#surveyplayercontainer").surveyplayer();
            }
            catch (ex) {
                alert("prweb.guestplatformreviewer.loadReviewerView reports " + ex.Message);
            }
            return;
        },



        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {

                }
                catch (ex) {
                    alert("prweb.guestplatformreviewer.dispose reports error " + ex.Message);
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
                alert("prweb.guestplatformreviewer.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
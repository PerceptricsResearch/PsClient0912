/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.guestplatformresults', {
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
        xevent: "click.guestplatformresults",

        //#region Create
        _create: function () {
            try {
                prweb.setUpKOImageBinding();
                prweb.InitWindowFrame();
                prweb.domaincontentsvc.DomainDxnry = this.options.domaindxnry;
                prweb.surveymetadatasvc.SurveyMetaDataViewUrl = this.options.surveymetadataviewUrl;
                prweb.rfmsvc.GroupsSlideoutViewUrl = this.options.groupsslideoutviewUrl;
                prweb.guestplatformsvc.commentURL = this.options.commentUrl;
                prweb.guestplatformsvc.SubscriberEmail = this.options.subscriberemail;
                if (this._populateSurveyIconListSvc()) {
                    switch (true) {
                        case (this.options.guestservice == "Results"):
                            this._loadRsltsData();
                            break;
                        case (this.options.guestservice != "Results"):
                            alert("prweb.guestplatformresults reports guestservice is not Results.");
                            break;
                    }
                }
                else {
                    //do the sorry we can't load your survey domain thing...
                    alert("do the sorry we can't load your survey domain thing...");
                }
            }
            catch (ex) {
                alert("prweb.guestplatformresults.create reports " + ex.Message);
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
                alert("prweb.guestplatformresults.populateSurveyIconListSvc reports " + ex.Message);
            }
            return rslt;
        },
        //#endregion


        //#region LoadResultsData
        _loadRsltsData: function () {
            try {
                prweb.rfmsvc.DisposeResultsViews(); //dispose of results views 
                prweb.rfmsvc.rsltsGrpRFM = false;
                prweb.rfmsvc.CurrentRPSOData = false;
                prweb.actionContext.currentpgnumber = 1;
                prweb.actionContext.currentrsltsallrdentscount = 0;
                prweb.actionContext.currentrsltsurl = 'None';
                prweb.actionContext.currentsurveyname = 'None';
                var rsltsurl = this.options.resultsURL;
                prweb.actionContext.currentrsltsurl = rsltsurl;
                prweb.actionContext.currentsurveyname = prweb.surveymodelsvc.SurveyName();
                //                $("#homecenterpanel").html("<div style='margin-left:45%;margin-top:25%;'><p>Loading " + prweb.actionContext.currentsurveyname + "</p></div>");
                prweb.dataManager.sendRequest({
                    url: rsltsurl,
                    success: function (rsltsmodeldata) {
                        try {
                            if (rsltsmodeldata.RPSO) {
                                prweb.actionContext.currentrsltsallrdentscount = rsltsmodeldata.RPSO.AllSurveyRDENTSCount;
                                prweb.rfmsvc.CurrentRPSOData = rsltsmodeldata;
                                prweb.rfmsvc.CurrentRPSOData.RFMGuid = false;
                                prweb.rfmsvc.DefaultResultsURL = prweb.actionContext.currentrsltsurl;
                                prweb.rfmsvc.SdsRespIdDxnry = {};
                                prweb.rfmsvc.populateSDSRespIdDxnry();
                            }
                            else {
                                alert("No Results for This Survey...");
                            }
                            $("#guesthcpsurveyhost").removeClass("prwslideouthide");
                            if (prweb.IsTouch) {
                                prweb.gestureizer.DesignInitialize();
                            }
                            $("#resultssurveyviewroot").resultsplayer();

                        }
                        catch (e) {
                            alert("No Results for This Survey...");
                        }
                        rsltsmodeldata = null;
                        return true;
                    },
                    error: function (ex) {
                        alert("prweb.guestplatformresults.loadResultsSurveyView sendRequest reports ... " + ex.error().toString());
                    }
                });
                rsltsurl = null;
                //                prweb.pubsub.publish(prweb.events.subscriberplatform.rsltssurveyselected)

            }
            catch (ex) {
                alert("prweb.guestplatformresults.loadRsltsData reports " + ex.Message);
            }
        },
        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {

                }
                catch (ex) {
                    alert("prweb.guestplatformresults.dispose reports error " + ex.Message);
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
                alert("prweb.guestplatformresults.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
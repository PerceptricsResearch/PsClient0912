/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.6.4-vsdoc.js" />
(function (prweb, $) {
    prweb.subscriberheartbeatsvc = (function () {
        var that = {};

        that.subscriberheartbeatURL = null;

        that.myintervaId = 0;
        that.StartHeartBeat = function () {
            that.myintervaId = setInterval(that.sendActorNewHeartBeattoServer, 30000); // 30 seconds
        };

        that.StopHeartBeat = function () {
            clearInterval(that.myintervaId);
            return true;
        };



        //        that.ViewModelx = ko.observable();

        //        that.populateVMx = function () {
        //            var newvm = {
        //                //                mysurveymodel: prweb.surveymodelsvc.viewModelx().mysurveymodel,
        //                //                myrdentlink: ko.observable(), //prweb.surveymodelsvc.viewModelx().myrdentlink,
        //                //                msgfromserver: ko.observable(), //populated in callbacks for ajax calls....
        //                //                publishstatus: ko.computed(function () {
        //                //                    var parm = prweb.surveymodelsvc.viewModelx().mysurveymodel.SurveyStateID();
        //                //                    return that.SurveyStateIDToString(parm);
        //                //                }),
        //                //                tostatusstring: ko.computed(function () {
        //                //                    var parm = prweb.surveymodelsvc.viewModelx().mysurveymodel.SurveyStateID();
        //                //                    return that.AvailableToStatusString(parm);
        //                //                }),
        //                //                tostatusid: ko.computed(function () {
        //                //                    var parm = prweb.surveymodelsvc.viewModelx().mysurveymodel.SurveyStateID();
        //                //                    return that.AvailableToStatusID(parm);
        //                //                }),
        //                junk: {}
        //            };
        //            that.isNewVmx = true;
        //            that.ViewModelx(newvm);
        //            //            prweb.pubsub.publish(prweb.events.publishsvc.datacontextchanged)
        //        };

        that.OktoSend = true; // don't send anymore requests unless ajax call comes back ok...

        that.SIconListHasMarks = true; //set to true because sicons come from the server first time with marks set...

        that.KVPSifter = function (shpkg, xicnrow) {
            var sid = shpkg.SurveyID;
            var ActRdentkvp = Enumerable.From(shpkg.KVPColxn).Where(function (kvp) { return kvp.Key == "HasActiveRDents" }).Any();
            if (ActRdentkvp) {
                xicnrow.HasActiveRDents(true);
                prweb.appsvc.populateActiveRDentLight(true);
            }
            else {
                xicnrow.HasActiveRDents(false);
            }
            var NewRsltskvp = Enumerable.From(shpkg.KVPColxn).Where(function (kvp) { return kvp.Key == "HasNewResults" }).Any();
            if (NewRsltskvp) {
                xicnrow.HasNewResults(true);
                prweb.appsvc.populateNewResultsLight(true);
            }
            else {
                xicnrow.HasNewResults(false);
            }
            ActRdentkvp = null;
            NewRsltskvp = null;
            sid = null;
            shpkg = null;
            xicnrow = null;
            return true;
        };

        that.ExamineIconRows = function (icnrow, xhrtbtpkg) {
            if (xhrtbtpkg) {
                var hrtbtrow = xhrtbtpkg[icnrow.SurveyID()];
                if (hrtbtrow) {
                    that.KVPSifter(hrtbtrow, icnrow);
                    prweb.surveymetadatasvc.ClearCache(icnrow.SurveyID());
                    icnrow.HasSMDMarks(true);
                }
                else {
                    if (icnrow.HasSMDMarks()) {
                        icnrow.HasActiveRDents(false);
                        icnrow.HasNewResults(false);
                        prweb.surveymetadatasvc.ClearCache(icnrow.SurveyID());
                        icnrow.HasSMDMarks(false);
                    }
                }
                hrtbtrow = null;
                that.SIconListHasMarks = true; // enumerate surveyiconrows only when any are marked...
            }
            else {
                if (icnrow.HasSMDMarks()) {
                    icnrow.HasActiveRDents(false);
                    icnrow.HasNewResults(false);
                    prweb.surveymetadatasvc.ClearCache(icnrow.SurveyID());
                    icnrow.HasSMDMarks(false);
                    that.SIconListHasMarks = false;
                }
            }
            icnrow = null;
            xhrtbtpkg = null;
            return true;
        };

        that.sendActorNewHeartBeattoServer = function () {
            var papp = null;
            if (that.OktoSend) {
                papp = prweb.appsvc;
                papp.populateActiveRDentLight(false);
                papp.populateNewResultsLight(false);
                papp = null;
                var hrtbturl = that.subscriberheartbeatURL; // was populated in view on the server...passed as an option...in subscriberhome...
                that.OktoSend = false;
                prweb.dataManager.sendRequest({
                    url: hrtbturl,
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (hrtbtpkg) {
                        that.OktoSend = true;
                        var therows = null;
                        //this updates surveyiconlistsvc.ViewModelX.myrows(SurveyID).HasNewResults and .HasActiveRDents...
                        //hrtbtpkg is type SubscriberHeartBeatPkg...
                        if (that.SIconListHasMarks || hrtbtpkg) {
//                            therows = prweb.surveyiconlistsvc.viewModelx.myrows();
//                            // ExamineIconRows is expecting a row with observable fields...the rows coming from surveyiconlistsvc are not in observable form...
                            //                            // they don't get put into observable form until a particular one is selected and put into surveymodelsvc.vmx...
// I would like to avoid having every row, every field as an observable...so probably need to make the parts of the row observable when they need to be...
//                            Enumerable.From(therows).ForEach(function (row) { return that.ExamineIconRows(row, hrtbtpkg); });
                        }
                        hrtbtpkg = null;
                        hrtbturl = null;
                        therows = null;
                        return true;
                    },
                    error: function () {
                        alert("prweb.subscriberheartbeatsvc.js reports sendActorNewHeartBeattoServer Error ");
                    }
                });
            }
            return true;
        };
        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
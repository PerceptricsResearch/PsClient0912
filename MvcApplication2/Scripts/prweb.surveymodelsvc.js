/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.surveymodelsvc = (function () {
        var that = {};

        that.Initialize = function () {
            prweb.pubsub.subscribe(prweb.events.appsvc.surveycontextchanged, this.SurveyContextChangedHandler, this);
            return true;
        };

        that.SurveyContextChangedHandler = function (e) {
            //            alert("surveymodelsvc sees appsvc.surveycontextchanged surveyid=" + e.newcontext);
            try {
                switch (true) {
                    case (!e.newcontext):
                        if (that.hasOwnProperty("viewModelx")) {
                            that.DisposeVmx();
                        }
                        break;
                    case (e.newcontext > -1):
                        break;
                    case (e.newcontext == -1):
                        that.populateVmx(false);
                        that.PageCount = 1;
                        break;
                }
            }
            catch (ex) {
                alert("prweb.surveymodelsvc.SurveyContextChangedHandler reports " + ex.Message);
            }
            return true;
        };

        that.SurveyName = function (newname) {
            var rslt = false
            if (that.viewModelx) {
                if (that.viewModelx.mysurveymodel) {
                    if (newname) {
                        that.viewModelx.mysurveymodel.SurveyName(newname);
                        prweb.surveyiconlistsvc.SurveyName(that.CurrentSurveyID(), newname);
                    }
                    rslt = that.viewModelx.mysurveymodel.SurveyName();
                }
            }
            return rslt;
        };

        that.SurveyGuidString = function () {
            var rslt = false
            if (that.viewModelx) {
                if (that.viewModelx.mysurveymodel) {
                    rslt = that.viewModelx.mysurveymodel.SurveyGuidString();
                }
            }
            return rslt;
        };

        that.ToFullyQualifiedURL = function (baseurl) {
            var rslt = false;
            try {
                var sid = that.CurrentSurveyID();
                if (sid) {
                    var oldparm = "/0"; //"id=" + oldval;
                    var newparm = "/" + (sid.toString());
                    rslt = baseurl.replace(oldparm, newparm);
                }
            }
            catch (ex) {
                alert("prweb.surveymodelsvc.ToFullyQualifiedURL reports " + ex.Message);
            }
            return rslt;
        };

        that.SurveyViewURL = function () {
            var rslt = false
            var baseurl = prweb.surveyiconlistsvc.baseURLObject.URL;
            rslt = that.ToFullyQualifiedURL(baseurl);
            return rslt;
        };
        that.PageZeroURL = function () {
            var rslt = false
            var baseurl = prweb.surveyiconlistsvc.baseURLObject.PageZeroURL;
            rslt = that.ToFullyQualifiedURL(baseurl);
            return rslt;
        };

        that.ResultsDataURL = function () {
            var rslt = false
            var baseurl = prweb.surveyiconlistsvc.baseURLObject.ResultsModelURL;
            rslt = that.ToFullyQualifiedURL(baseurl);
            return rslt;
        };

        that.ResultsGrpListViewURL = function () {
            var rslt = false
            var baseurl = prweb.surveyiconlistsvc.baseURLObject.ResultsGrpListViewURL;
            rslt = that.ToFullyQualifiedURL(baseurl);
            return rslt;
        };

        that.ResultsGrpDefnViewURL = function () {
            var rslt = false
            var baseurl = prweb.surveyiconlistsvc.baseURLObject.ResultsGrpDefnViewURL;
            rslt = that.ToFullyQualifiedURL(baseurl);
            return rslt;
        };

        that.PublishViewURL = function () {
            var rslt = false
            var baseurl = prweb.surveyiconlistsvc.baseURLObject.PublishSurveyURL;
            rslt = that.ToFullyQualifiedURL(baseurl);
            return rslt;
        };

        that.SurveysInfoViewURL = function () {
            var rslt = false
            var baseurl = prweb.surveyiconlistsvc.baseURLObject.SurveysInfoViewURL;
            rslt = that.ToFullyQualifiedURL(baseurl);
            return rslt;
        };

        that.sMdURL = function () {
            var rslt = false
            var baseurl = prweb.surveyiconlistsvc.baseURLObject.MetaDataURL;
            rslt = that.ToFullyQualifiedURL(baseurl);
            return rslt;
        };

        that.PCModelURL = function () {
            var rslt = false
            var baseurl = prweb.surveyiconlistsvc.baseURLObject.PCModelURL;
            rslt = that.ToFullyQualifiedURL(baseurl);
            return rslt;
        };

        that.CurrentSurveyID = function () {
            var rslt = false
            try {
                if (that.viewModelx) {
                    if (that.viewModelx.mysurveymodel) {
                        rslt = that.viewModelx.mysurveymodel.SurveyID();
                    }
                    //                    else {
                    ////                        rslt = prweb.appsvc.CurrentSurveyContext;
                    //                    }
                }
                //                else {
                //                    rslt = prweb.appsvc.CurrentSurveyContext;
                //                }
            }
            catch (ex) {
                alert("prweb.surveymodelsvc.CurrentSurveyID reports " + ex.Message);
            }
            return rslt;
        };

        that.SurveyStateIDToString = function () {
            var rslt = "unknown";
            var sstate = -1;
            try {
                if (that.viewModelx.mysurveymodel) {
                    sstate = that.viewModelx.mysurveymodel.SurveyStateID();
                }
                switch (true) {
                    case (sstate == 0):
                        rslt = "Not Published";
                        break;
                    case (sstate == 1):
                        rslt = "Open - Accepting New Respondents";
                        break;
                    case (sstate == 2):
                        rslt = "Closed - New Respondents prohibited";
                        break;
                };
                sstate = null;
            }
            catch (ex) {
                alert("prweb.surveymodelsvc.SurveyStateIDToString reports error...");
            }
            return rslt;
        };

        //#region ClearAllPageUrlCacheForCurrentSurvey
        that.CraftPageUrl = function (pgnum) {
            var rslt = false;
            try {
                var adjustpgnum = pgnum - 1
                var npURL = that.PCModelURL();
                if (npURL) {
                    var arrpgn = npURL.split("pgNumber=");
                    var pgn = arrpgn[1];
                    var oldpgparm = "pgNumber=" + pgn;
                    var newpgparm = "pgNumber=" + (adjustpgnum.toString());
                    rslt = npURL.replace(oldpgparm, newpgparm);
                }
            }
            catch (ex) {
                alert("prweb.surveyplayersvc.CraftPageUrl reports " + ex.Message);
            }

            return rslt;
        };
        //this needs to do the same for resultspagesurls if they are different...
        that.ClearAllPageUrlCacheForCurrentSurvey = function () {
            var rslt = false;
            try {
                var url = that.PageZeroURL();
                if (url) {
                    prweb.dataManager.resetData(url);
                }
                if (prweb.designerpcmsvc.IPNColxn) {
                    for (var n in prweb.designerpcmsvc.IPNColxn) {
                        var pgnum = prweb.designerpcmsvc.IPNColxn[n].ipn;
                        url = that.CraftPageUrl(pgnum);
                        if (url) {
                            prweb.dataManager.resetData(url);
                        }
                    }
                    rslt = true;
                }
            }
            catch (ex) {
                alert("prweb.surveymodelsvc.ClearPCMUrlCacheForSurveyId reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion

        //        that.OpenSurvey = function () {
        //            prweb.pubsub.publish(prweb.events.subscriberplatform.surveyopened); // causes surveypageslist.js to bind click pageicons...
        //            return true;
        //            //subscriberplatform.js will show the pagesbtn...
        //        };

        that.CloseSurvey = function () {
            that.DisposeVmx();
            prweb.pubsub.publish(prweb.events.subscriberplatform.surveyclosed); // causes surveypageslist.js to unbind click pageicons...
            return true;
            //subscriberplatform.js will hide the pagesbtn...
        };

        //surveypagesllist.js support stuff here...
        that.PageCount = 1;
        that.pageslistViewModelx = {};
        that.DisposePagesListVmx = function () {
            try {
                that.pageslistViewModelx.pageslist = null;
                delete that.pageslistViewModelx.pageslist;
                that.pageslistViewModelx = null;
                delete that.pageslistViewModelx;
            }
            catch (ex) {
                alert("prweb.surveymodelsvc.DisposePagesListVmx reports " + ex.Message);
            }
            return true;
        };

        that.AddPage = function () {
            try {
                var mypgs = that.pageslistViewModelx.pageslist();
                mypgs.push(that.PageCount);
                that.pageslistViewModelx.pageslist.valueHasMutated();
                mypgs = null;
            }
            catch (ex) {
                alert("prweb.surveymodelsvc.AddPage reports error..." + ex.Message);
            }
        };

        that.RemovePage = function () {
            try {
                var mypgs = that.pageslistViewModelx.pageslist();
                mypgs.pop();
                that.pageslistViewModelx.pageslist.valueHasMutated();
                mypgs = null;
            }
            catch (ex) {
                alert("prweb.surveymodelsvc.RemovePage reports error..." + ex.Message);
            }
        };

        that.RefreshPagesCount = function () {
            that.pageslistViewModelx.pageslist(Enumerable.RangeTo(1, that.PageCount).ToArray());
        };

        that.populatepageslistVMx = function () {
            try {
                that.pageslistViewModelx = {
                    pageslist: null
                };
                var pgitemarray = [];
                var makepageitem = function (pgnum) {
                    var pgitem = {
                        pgnumber: pgnum,
                        isselected: ko.observable(false),
                        isdefault: ko.observable(true)
                    };
                    pgitemarray.push(pgitem);
                    return true;
                };
                var pgcnt = Math.max(1, that.PageCount);
                Enumerable.RangeTo(1, pgcnt).ForEach(function (kvp) { return makepageitem(kvp) }); //.ToArray();
                that.pageslistViewModelx.pageslist = ko.observableArray(pgitemarray);
            }
            catch (ex) {
                alert("prweb.surveymodelsvc.populatepageslistVMx reports " + ex.Message);
            }
            return true;
        };

        that.ManagePageChange = function (pgnumber) {
            try {
                //that.pageslistViewModelx can get to be null...should check for it
                if (that.pageslistViewModelx) {
                    if (that.pageslistViewModelx.pageslist !== undefined) {
                        var pgs = that.pageslistViewModelx.pageslist();
                        for (var i = 0; i < pgs.length; i++) {
                            if (pgs[i].pgnumber == pgnumber) {
                                pgs[i].isdefault(false);
                                pgs[i].isselected(true);
                            }
                            else {
                                pgs[i].isselected(false);
                                pgs[i].isdefault(true);
                            }
                        }
                        pgs = null;
                        prweb.scrollTo($(".selectedpageicon", "#surveypagenaviscrollable"), "#surveypagenaviscrollable");
                    }
                }
            }
            catch (ex) {
                alert("prweb.surveymodelsvc.ManagePageChange reports " + ex.Message);
            }
            return;
        };

        //viewmodelx is populate by prweb.surveyiconlist.js _populateViewPagesBtns.clickhandler for the viewpagesbtn...(viewsurveypages...)
        // the type is a SurveyIconModel....
        that.viewModelx = {};

        that.DisposeVmx = function () {
            try {
                if (that.viewModelx) {
                    for (var p in that.viewModelx.mysurveymodel) {
                        that.viewModelx.mysurveymodel[p] = null;
                        delete that.viewModelx.mysurveymodel[p];
                    };
                    that.viewModelx.mysurveymodel = null;
                    delete that.viewModelx.mysurveymodel;
                    that.viewModelx.myrdentlink = null;
                    delete that.viewModelx.myrdentlink;
                    that.viewModelx.publishstatus = null;
                    delete that.viewModelx.publishstatus;
                    that.viewModelx = null;
                    delete that.viewModelx;
                }
            }
            catch (ex) {
                alert("prweb.surveymodelsvc.DisposeVmx reports error..." + ex.Message);
            }
            return true;
        };

        that.populateVmx = function (vmxdata) {
            try {
                that.CloseSurvey();
            }
            catch (ex) {
                alert("prweb.surveymodelsvc.populateVmx.CloseSurvey reports error..." + ex.Message);
            }
            that.viewModelx = {
                mysurveymodel: false,
                myrdentlink: ko.observable(),
                publishstatus: ko.observable()
            };
            if (vmxdata) {
                that.viewModelx.mysurveymodel = ko.mapping.fromJS(vmxdata);
            }
            that.viewModelx.myrdentlink("No link available yet...");
            //            that.viewModelx(newvm);
            that.viewModelx.publishstatus(that.SurveyStateIDToString());
            vmxdata = null;
            return true;
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
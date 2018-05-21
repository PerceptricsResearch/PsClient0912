/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.6.4-vsdoc.js" />
(function (prweb, $) {
    prweb.surveymetadatasvc = (function () {
        var that = {};


        that.SurveyMetaDataViewUrl = false;

        that.LaunchSurveyMetaDataView = function () {
            var newcontext = -1;
            prweb.dataManager.sendRequest({
                url: that.SurveyMetaDataViewUrl,
                dataType: 'html',
                type: 'GET',
                success: function (smdviewhtml) {
                    try {
                        $("#surveymetadatacontainer").html("").html(smdviewhtml);
                        smdviewhtml = null;
                        $('#prwsmdroot').surveymetadata({ surveycontext: newcontext });
                        newcontext = null;
                    }
                    catch (ex) {
                        alert("prweb.surveymetadatasvc.LaunchSurveyMetaDataView.sendRequest.successhandler reports ... " + ex.toString());
                    }
                    finally {
                        return true;
                    }
                },
                error: function (ex) {
                    alert("prweb.surveymetadatasvc.LaunchSurveyMetaDataView sendRequest reports ... " + ex.toString());
                    ex = null;
                }
            });
            return;
        };

        that.RemoveSurveyMetaDataView = function () {
            try {
                var smdroot = $("#prwsmdroot");
                var smdwidget = smdroot.data("surveymetadata");
                if (smdwidget) {
                    smdwidget.dispose();
                    smdwidget = null;
                }
                smdroot.remove();
                smdroot = null;
                $("#surveymetadatacontainer").html("");
            }
            catch (ex) {
                alert("prweb.surveymetadatasvc.RemoveSurveyMetaDataView reports ... " + ex.toString());
                ex = null;
            }
            return;
        };

        that.IsOpen = false;

        that.OpenSurvey = function () {
            that.IsOpen = true;
            //subscriberplatform.js will show the pagesbtn...
        };

        that.CloseSurvey = function () {
            that.IsOpen = false;
            //subscriberplatform.js will hide the pagesbtn...
        };


        //        that.MarkIsDirty = function (surveyID) {
        //            var rslt = false;
        //            if (that.IsOpen) {
        //                var myisdifferentsurveyid = that.IsDifferenSurveyID();
        //                var crntsurveyid = that.CurrentSurveyID();
        //                if (crntsurveyid) {
        //                    if (surveyID == crntsurveyid) {
        //                        that.IsDirty = true;
        //                        rslt = true;
        //                    }
        //                }
        //            }
        //            return rslt;
        //        };

        // is called by subscriberheartbeatsvc...intended to refresh any smddata is indicated stale by hrtbtsvc...
        // Also, this method sets IsDirty when the surveyid equals CurrentSurveyID...this will allow the Vmx to be populated with new smdata...
        // Also, retrieves the SMD for the currentSurveyID......maybe we shouldn't...depends on whether the SMDView gets a new widget each time it is openned...
        that.ClearCache = function (surveyid) {
            var siconsmdurl = prweb.surveyiconlistsvc.SMDUrl(surveyid);
            if (siconsmdurl) {
                prweb.dataManager.resetData(siconsmdurl);
            }
            if (that.IsConsumerRegistered) {
                if (surveyid == that.CurrentSurveyID()) {
                    that.IsDirty = true;
                    that.retrieveSurveyMetaDataModel();
                }
            }
            //            if (that.CurrentSurveyID() == surveyid) {
            //                that.IsDirty = true;
            //                // Also, retrieves the SMD for the currentSurveyID......maybe we shouldn't...depends on whether the SMDView gets a new widget each time it is openned...
            //                // If SMDView is a new widget each time, then it will get new data anyway...because the cache was cleared...?
            //                that.retrieveSurveyMetaDataModel();
            //            }
        };

        //clears the dataManager.Cache for that.sMdURL...and retrieves new Vmx data...
        //        that.RefreshSMDDataModel = function () {
        //            if (that.IsDirty && that.IsOpen) {
        //                var mysmdurl = that.sMdURL();
        //                if (mysmdurl) {
        //                    prweb.dataManager.resetData(mysmdurl);
        //                    that.retrieveSurveyMetaDataModel();
        //                }
        //            }
        //        };

        that.IsDirty = true;

        that.IsDifferenSurveyID = function () {
            var rslt = true;
            var mycrntsurveyid = that.CurrentSurveyID();
            var svymdlsvcsurveyid = prweb.surveymodelsvc.CurrentSurveyID();
            if (mycrntsurveyid && svymdlsvcsurveyid) {
                if (mycrntsurveyid == svymdlsvcsurveyid) {
                    rslt = false;
                }
            }
            return rslt;
        };

        that.CurrentSurveyID = function () {
            var rslt = false
            try {
                var vmx = that.viewModelx();
                if (vmx) {
                    if (vmx.hasOwnProperty("dxnry")) {
                        rslt = vmx.dxnry.SurveyID() || false;
                    }
                }
            }
            catch (ex) {
                alert("surveymetadatasvc.CurrentSurveyID reports " + ex.Message);
            }
            //            if (that.viewModelx().dxnry) {
            //                rslt = that.viewModelx().dxnry.SurveyID() || false;
            //            }
            //            if (that.viewModelx().stats) {
            //                var statsrows = that.viewModelx().stats();
            //                rslt = Enumerable.From(statsrows).Where(function (kvp) { return kvp.Key() == "SurveyID" }).Select(function (xkvp) { return xkvp.Valu() }).FirstOrDefault(false);
            //            }
            return rslt;
        };

        //this link is a function from surveymodelsvc....surveymodelsvc is populated with surveyiconmodel when surveyiconclicked...see surveyiconlist.js...viewbtn.click...
        that.sMdURL = prweb.surveymodelsvc.sMdURL;

        that.IsConsumerRegistered = false;

        that.RegisterSMDConsumer = function () {
            var rslt = false;
            var surveyid = prweb.surveymodelsvc.CurrentSurveyID();
            var mycurrentsurveyid = that.CurrentSurveyID();
            that.IsConsumerRegistered = true;
            if (mycurrentsurveyid == surveyid) {
                rslt = true;
            }
            else {
                that.IsDirty = true;
                that.populateVmx(); //loads a dummy observable until the asynch request comes back...
                that.retrieveSurveyMetaDataModel();
            }
            return rslt;
        };

        //this method is called by 1)surveymetadata.js._retrieveSurveyMetaDataModel....that method is called in the SMDDetailsBtnClick open animation handler...
        //it is also called by 2) this._ClearCache when the SurveyID passed to ClearCache is the CurrentSurveyID...ClearCache is called by the subscriberheartbeatsvc...
        that.retrieveSurveyMetaDataModel = function () {
            var myisdifferent = that.IsDifferenSurveyID();
            var myisdirty = that.IsDirty;
            var mySmdURL = that.sMdURL();
            if (mySmdURL) {
                prweb.dataManager.sendRequest({
                    url: mySmdURL,
                    success: function (smddata) {
                        //probably want to do this only when smdata IsDirty...a different survey makes smdata dirty, or the activrsltsheartbeat can make it dirty
                        // the idea is prevent creating new observable arrays everytime in ko...
                        if (that.IsConsumerRegistered && (myisdifferent || myisdirty)) {
                            that.populateVmx(smddata);
                            that.IsDirty = false;
                        }
                    },
                    error: function () {
                        alert('SurveyMetaDataSvc retrieve surveymetadatamodel error...');
                    }
                });
            }
        };


        //surveymodelsvc.viewmodelx is populated by prweb.surveyiconlist.js _populateViewPagesBtns.clickhandler for the viewpagesbtn...(viewsurveypages...)
        // the type is a SurveyIconModel....
        //this viewModelx is a list of smd kvp's...shows statistics for the survey...requires an ajax call to get this data...need a url...is available in surveymodelsvc.vmx...
        that.viewModelx = ko.observable();

        that.populateVmx = function (vmxdata) {
            var newvm = {
                //                stats: ko.observableArray([{
                //                    Key: ko.observable("key is not set"),
                //                    Valu: ko.observable("valu is not set")
                //                }]),
                //                myotherthing: ko.observable("-99"),
                dxnry: { "SurveyID": ko.observable(-1)} //"xRespondentCompletedCount": 999, "xIgnatz": "bubba home" },
                //                mysomething: {}
            };

            //            if (vmxdata) {
            //                //do whatever transformations on the stats.kvp's here...could add fields...just have to include in the stats defn above...and make it observable to bind to it...
            //                //e.g....var categorizedlist = Enumerable.From(vmxdata).groupbyCategory.ToArray()
            //                // then do newvm.stats(categorizedlist)  {"xRespondentCompletedCount": 999, "xIgnatz": "bubba home"}
            //                //                newvm.stats = ko.mapping.fromJS(vmxdata); //stats(vmxdata); //ko.mapping.fromJS(vmxdata);
            //            }
            //            newvm.myotherthing("Nothing in here...");
            var makedxnryrow = function (kvp) {
                newvm.dxnry[kvp.Key] = ko.observable(kvp.Valu);
            };
            Enumerable.From(vmxdata).ForEach(function (kvp) { return makedxnryrow(kvp) });

            this.viewModelx(newvm);
        };



        //want to partition the view of surveymetadata into categories....support stuff here...
        that.CategoryPages = {}; //is associative array...key will be a category name...content will be a list of smdkeyvaluepairs...groups kvp's by category...
        that.pageslistViewModelx = ko.observable();
        that.populatepageslistVMx = function () {
            var pgsvmx = {
                pageslist: null,
                usethis: null
            };
            //            pgsvmx.pageslist = Enumerable.From(that.CategoryPages).ToArray(); use categories here...
            that.pageslistViewModelx(pgsvmx);
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.6.4-vsdoc.js" />
(function (prweb, $) {
    prweb.surveyiconlistsvc = (function () {
        var that = {};

        that.SurveyName = function (surveyid, newname) {
            var rslt = false;
            try {
                if (that.viewModelx.myrows) {
                    var xmyrows = that.viewModelx.myrows();
                    rslt = Enumerable.From(xmyrows).Where(function (xrow) { return xrow.SurveyID == surveyid; }).Select(function (srow) { return srow; }).FirstOrDefault();
                    if (rslt) {
                        rslt.SurveyName(newname); //this should be observable...see populate vmx below...
                    }
                    xmyrows = null;
                    surveyid = null;
                }
            }
            catch (ex) {
                alert("prweb.surveyiconlistsvc.SurveyName() reports " + ex.Message);
            }

            return rslt;
        };

        //called by designersavesurveysvc.UpdateSurveyIconListSvc
        that.UpdateSurveyIconRow = function (surveyid, surveyname) {
            var rslt = false;
            try {
                that.SurveyName(surveyid, surveyname);
                rslt = true;
            }
            catch (ex) {
                alert("prweb.surveyiconlistsvc.UpdateSurveyIconRow reports " + ex.Message);
            }
            return rslt;
        };

        that.SMDUrl = function (surveyid) {
            var rslt = false;
            if (that.viewModelx.myrows) {
                var xmyrows = that.viewModelx.myrows();
                rslt = Enumerable.From(xmyrows).Where(function (xrow) { return xrow.SurveyID == surveyid; }).Select(function (srow) { return srow.MetaDataURL; }).FirstOrDefault();
                xmyrows = null;
                surveyid = null;
            }
            return rslt;
        };

        that.OpenSurvey = function () {
            //            prweb.pubsub.publish(prweb.events.subscriberplatform.surveyopened); // causes surveypageslist.js to bind click pageicons...
            //subscriberplatform.js will show the pagesbtn...
        };

        that.CloseSurvey = function () {
            //            prweb.pubsub.publish(prweb.events.subscriberplatform.surveyclosed); // causes surveypageslist.js to unbind click pageicons...
            //subscriberplatform.js will hide the pagesbtn...
        };

        //this link is a function from surveymodelsvc....surveymodelsvc is populated with surveyiconmodel when surveyiconclicked...see surveyiconlist.js...viewbtn.click...
        that.surveyiconsmodelurl = null;
        //myrows are surveyiconmodels....they do not have a metadatacolxn....
        that.viewModelx = {};

        that.populateVmx = function (vmxdata) {
            try {
                that.viewModelx = {
                    myrows: ko.observableArray()
                };
                if (vmxdata) {
                    //                that.viewModelx.myrows = ko.mapping.fromJS(vmxdata);//not doing this eliminates observable properties on invidivual rows...
                    for (var row in vmxdata) {
                        vmxdata[row].SurveyName = ko.observable(vmxdata[row].SurveyName); //make certain properties observable...
                        vmxdata[row].HasActiveRDents = ko.observable(vmxdata[row].HasActiveRDents); //make certain properties observable...
                        vmxdata[row].HasNewResults = ko.observable(vmxdata[row].HasNewResults); //make certain properties observable...
                        vmxdata[row].ActiveRDentsCount = ko.observable(vmxdata[row].ActiveRDentsCount); //make certain properties observable...

                    }
                    that.viewModelx.myrows(vmxdata);
                }
                vmxdata = null;
                if (prweb.appsvc !== undefined) {
                    prweb.appsvc.SurveyIconListSvcReady();
                }
            }
            catch (ex) {
                alert("prweb.surveyiconlistsvc.populateVmx  reports " + ex.Message);
            }

            return true;
        };
        //is called by appsvc.SurveyContextChangedHandler...ensures that surveymodelsvc.Vmx is populated with the appropriate surveyiconmodel
        //is particularly important when nagigation occurs based on browser back forward operations using the bbq.state.stack..
        that.PopulateSurveyModelSvcVmx = function (sid) {
            try {
                if (sid) {
                    var cursid = prweb.surveymodelsvc.CurrentSurveyID();
                    if (sid != cursid) {
                        var row = false;
                        row = Enumerable.From(that.viewModelx.myrows()).Where(function (xrow) {
                            return xrow.SurveyID == sid;
                        }).Select(function (srow) {
                            return srow;
                        }).FirstOrDefault();
                        if (row) {
                            prweb.surveymodelsvc.populateVmx(row);
                        }
                    }
//                    else {
//                        var xx = "survemodelsvc.currentsurveyid is equal to sid";
//                    }

                }
            }
            catch (ex) {
                alert("prweb.surveyiconlistsvc.PopulateSurveyModelSvcVmx  reports" + ex.Message);
            }
            return;
        };

        that.AddNewSurveyIconRow = function (newrowjs) {
            try {
                //                var myrowsjs = that.viewModelx.myrows(); //ordinary array unwrapped
                newrowjs.SurveyName = ko.observable(newrowjs.SurveyName); //make certain properties observable...
                newrowjs.HasActiveRDents = ko.observable(newrowjs.HasActiveRDents); //make certain properties observable...
                newrowjs.HasNewResults = ko.observable(newrowjs.HasNewResults); //make certain properties observable...
                newrowjs.ActiveRDentsCount = ko.observable(newrowjs.ActiveRDentsCount); //make certain properties observable...
                that.viewModelx.myrows.push(newrowjs);
                //                myrowsjs.push(newrowjs);
                //                that.viewModelx.myrows.valueHasMutated();
            }
            catch (ex) {
                alert("prweb.surveyiconlistsvc.AddNewSurveyIconRow reports " + ex.Message);
            }
            return;
        };

        that.baseURLObject = false;

        that.RetrieveSurveyIconModels = function () {
            var myurl = that.surveyiconsmodelurl;
            var populateguy = that.populateVmx;
            if (myurl) {
                try {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        cache: false,
                        success: function (sidata) {
                            try {
                                that.baseURLObject = sidata.baseurlcolxn;
                                populateguy(sidata.simcolxn);
                                sidata = null;
                                myurl = null;
                                populateguy = null;
                            }
                            catch (ex) {
                                alert("prweb.surveyiconlistsvc.RetrieveSurveyIconModels.successhandler reports " + ex.Message);
                            }
                            return true;
                        },
                        error: function (e) {
                            alert("prweb.surveyiconlistsvc.RetrieveSurveyIconModels.sendRequest reports " + e.error().toString());
                        }
                    });
                }
                catch (ex) {
                    alert("prweb.surveyiconlistsvc.RetrieveSurveyIconModels reports " + ex.Message);
                }
            }
            return true;
        };

        // called by prweb.appsvc.InitializeAppSvc...
        that.Initialize = function () {
            try {
                that.RetrieveSurveyIconModels();
            }
            catch (ex) {
                alert("prweb.surveyiconlistsvc.Initialize reports " + ex.Message);
            }
            return true;
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
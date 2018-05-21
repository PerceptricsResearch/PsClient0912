/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.publishsvc = (function () {
        var that = {};

        //#region Utility Methods - SurveyStateID AvailableToStatus etc.
        that.SurveyStateIDToString = function (sstate) {
            var rslt = "unknown";
            if (sstate == 0) {
                rslt = "Not Published";
            }
            else if (sstate == 1) {
                rslt = "Open - Accepting New Respondents";
            }
            else if (sstate == 2) {
                rslt = "Closed - New Respondents prohibited";
            }
            return rslt;
        };

        that.AvailableToStatusID = function (sstate) {
            var rslt = 0;
            if (sstate == 0) {
                rslt = 1;
            }
            else if (sstate == 1) {
                rslt = 2;
            }
            else if (sstate == 2) {
                rslt = 1;
            }
            return rslt;
        };

        that.AvailableToStatusString = function (sstate) {
            var rslt = "unknown";
            if (sstate == 0) {
                rslt = that.SurveyStateIDToString(1);
            }
            else if (sstate == 1) {
                rslt = that.SurveyStateIDToString(2); ;
            }
            else if (sstate == 2) {
                rslt = that.SurveyStateIDToString(1); ;
            }
            return rslt;

        };

        that.StatusToColor = function (sstate) {
            var rslt = "#000";
            if (sstate == 0) {
                rslt = "#155";
            }
            else if (sstate == 1) {
                rslt = "#188";
            }
            else if (sstate == 2) {
                rslt = "#f11";
            }
            return rslt;
        };
        //#endregion

        //#region EvaluateDirtySurveyStatus
        that.EvaluateDirtySurveyStatus = function () {
            var rslt = false;
            try {
                rslt = (that.Vmx.currentsurveystatus() != that.Vmx.originalsurveystatus);
            }
            catch (ex) {
                alert("prweb.publishsvc.EvaluateDirtySurveyStatus  reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion

        //#region Vmx and DisposeVmx
        that.Vmx = {
            surveymodel: null,
            isadvanced: ko.observable(false),
            surveyname: ko.observable("not set"),
            currentsurveystatus: ko.observable(),
            originalsurveystatus: null,
            surveystatusstring: ko.observable("not set"),
            availabletostatus: ko.observable("loading..."),
            ischangeenabled: ko.observable(false),
            isservermsgenabled: ko.observable(false),
            islinkvisible: ko.observable(false),
            myrdentlink: ko.observable("no link available"),
            msgfromserver: ko.observable("server message area..."),
            isdirty: ko.observable(false),
            editdonetext: ko.observable("Edit"),
            backcanceltext: ko.observable("Back"),
            message: ko.observable(""),
            subscriptions: {
                currentsurveystatus: null,
                oncurrentsurveystatuschange: function (newval) {
                    try {
                        that.Vmx.surveystatusstring(that.SurveyStateIDToString(newval));
                        that.Vmx.isdirty(that.EvaluateDirtySurveyStatus());
                    }
                    catch (ex) {
                        alert("prweb.publishsvc.Vmx.onstatuschanged  reports " + ex.Message);
                    }
                    return;
                },
                subscribecurrentsurveystatus: function () {
                    try {
                        var thisiswhat = this;
                        that.Vmx.subscriptions.currentsurveystatus = that.Vmx.currentsurveystatus.subscribe(that.Vmx.subscriptions.oncurrentsurveystatuschange);
                    }
                    catch (ex) {
                        alert("prweb.publishsvc.Vmx.subscriptions.subscribecurrentsurveystatus  reports " + ex.Message);
                    }
                    return;
                },
                isdirty: null,
                onisdirtychanged: function (newval) {
                    try {
                        if (newval) {
                            that.Vmx.message("Use the Done button to save this survey's publish status.");
                            that.Vmx.editdonetext("Done");
                            that.Vmx.backcanceltext("Cancel");
                        }
                        else {
                            that.Vmx.message("Select this survey's publish status.");
                            that.Vmx.editdonetext("Edit");
                            that.Vmx.backcanceltext("Back");
                        }
                    }
                    catch (ex) {
                        alert("prweb.publishsvc.Vmx.onisdirtychanged  reports " + ex.Message);
                    }
                    return;
                },
                subscribeisdirty: function () {
                    try {
                        that.Vmx.subscriptions.isdirty = that.Vmx.isdirty.subscribe(that.Vmx.subscriptions.onisdirtychanged);
                    }
                    catch (ex) {
                        alert("prweb.publishsvc.Vmx.subscriptions.subscribeisdirty  reports " + ex.Message);
                    }
                    return;
                },
                dispose: function () {
                    that.Vmx.subscriptions.currentsurveystatus.dispose();
                    that.Vmx.subscriptions.currentsurveystatus = null;
                    that.Vmx.subscriptions.isdirty.dispose();
                    that.Vmx.subscriptions.isdirty = null;
                }
            },
            methods: {
                populate: function () {
                    try {
                        var thisiswhat = this;
                        that.Vmx.isdirty(false);
                        that.Vmx.ischangeenabled(false);
                        that.Vmx.editdonetext("Edit");
                        that.Vmx.backcanceltext("Back");
                        that.Vmx.surveymodel = prweb.surveymodelsvc.viewModelx.mysurveymodel;
                        var surveystateid = prweb.surveymodelsvc.viewModelx.mysurveymodel.SurveyStateID();
                        that.Vmx.currentsurveystatus(surveystateid);
                        that.Vmx.originalsurveystatus = surveystateid;
                        that.Vmx.surveystatusstring(that.SurveyStateIDToString(surveystateid));
                        that.Vmx.subscriptions.subscribecurrentsurveystatus();
                        that.Vmx.subscriptions.subscribeisdirty();
                        that.Vmx.message("Use the Edit button to change this survey's publish status.");
                    }
                    catch (ex) {
                        alert("prweb.publishsvc.Vmx.populate  reports " + ex.Message);
                    }
                    return;
                },
                nextavailablestatus: function () {
                    var rslt;
                    try {
                        rslt = that.AvailableToStatusID(that.Vmx.surveymodel.SurveyStateID());
                    }
                    catch (ex) {
                        alert("prweb.publishsvc.Vmx.nextavailablestatus  reports " + ex.Message);
                    }
                    return rslt;
                },
                populateavailabletostatus: function () {
                    try {
                        var statusid = that.Vmx.surveymodel.SurveyStateID();
                        that.Vmx.availabletostatus(that.AvailableToStatusString(statusid));
                    }
                    catch (ex) {
                        alert("prweb.publishsvc.Vmx.populatenextstatusstring  reports " + ex.Message);
                    }
                },
                dispose: function () {
                    try {
                        that.Vmx.subscriptions.dispose();
                        that.Vmx.isdirty(false);
                        ko.cleanNode($("#publishhomecontentouter")[0]);
                        that.Vmx.surveymodel = null;
                    }
                    catch (ex) {
                        alert("prweb.publishsvc.Vmx.dispose  reports " + ex.Message);
                    }
                    return;
                }
            }
        };

        that.DisposeVmx = function () {
            try {
                that.Vmx.methods.dispose();
            }
            catch (ex) {
                alert("prweb.publishsvc.Vmx.DisposeVmx  reports " + ex.Message);
            }
        };
        //#endregion

        //#region SaveChangeParms and SendChangeSurveyStatusToServer
        that.SaveChangeParms = false;

        that.sendChangeSurveyStatusToServer = function () {
            try {
                if (that.SaveChangeParms) {
                    var chngsvystatusurl = that.SaveChangeParms.chngstateURL; // was populated in view on the server...passed as an option...
                    var dataToSend = {
                        changesurveystatepkg: that.SaveChangeParms.chgpkg
                    };
                    dataToSend.changesurveystatepkg.TargetState = that.Vmx.methods.nextavailablestatus();
                    dataToSend.changesurveystatepkg.SurveyGuid = that.Vmx.surveymodel.SurveyGuidString();
                    dataToSend.changesurveystatepkg.CurrentState = that.Vmx.surveymodel.SurveyStateID().toString();
                    var testhis = JSON.stringify(dataToSend);
                    var dbg = 2;
                    prweb.dataManager.sendRequest({
                        url: chngsvystatusurl,
                        data: testhis,
                        dataType: 'json',
                        contentType: 'application/json',
                        cache: false,
                        success: function (msgserver) {
                            try {
                                that.Vmx.surveymodel.SurveyStateID(tgtstate); //updates surveystate on surveymodelsvc?
                                that.Vmx.msgfromserver(msgserver);
                                //                    prweb.pubsub.publish(prweb.events.publishsvc.datacontextchanged)//do this in the success handler for the ajax call...
                            }
                            catch (ex) {
                                alert("prweb.publishsvc.sendChangeSurveyStatusToServer.successHandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.publishsvc.sendChangeSurveyStatusToServer.sendRequest reports " + e.error().toString);
                        }
                    });
                }

            }
            catch (ex) {
                alert("prweb.publishsvc.sendChangeSurveyStatusToServer reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region EditDone and BackCancel ButtonActions
        that.EnableChangeStatus = function (newval) {
            var rslt = false;
            try {
                that.Vmx.ischangeenabled(newval);
                if (newval) {
                    that.Vmx.message("Press Change Publish Status to alter this survey's publish status.");
                }
                else {
                    that.Vmx.message("Use the Edit button to change this survey's publish status.");
                }
            }
            catch (ex) {
                alert("prweb.publishsvc.EnableChangeStatus reports " + ex.Message);
            }
            return rslt;
        };

        that.RestoreOriginalValues = function () {
            var rslt = false;
            try {
                that.Vmx.currentsurveystatus(that.Vmx.originalsurveystatus);
            }
            catch (ex) {
                alert("prweb.publishsvc.RestoreOriginalValues reports " + ex.Message);
            }
            return rslt;
        };

        that.BackCancelButtonAction = function () {
            try {
                if (that.Vmx.isdirty()) {
                    that.RestoreOriginalValues();
                    that.EnableChangeStatus(false);

                }
                else {
                    //this should navigate to shared home...
                    prweb.appsvc.PopulateSurveyModelContext(false);
                }
            }
            catch (ex) {
                alert("prweb.publishsvc.BackCancelButtonAction reports " + ex.Message);
            }
            return;
        };

        that.EditDoneButtonAction = function () {
            try {
                if (that.Vmx.isdirty()) {
                    that.EnableChangeStatus(false);
                    //                    that.sendChangeSurveyStatusToServer(needs parms);
                }
                else {
                    //do the edit action...EnableChangeStatus click...
                    that.EnableChangeStatus(true);
                    that.Vmx.methods.populateavailabletostatus();
                }
            }
            catch (ex) {
                alert("prweb.publishsvc.PopulateButtonHandlers reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region ChangePublishStatusBtn action
        that.ChangePublishStatusBtnAction = function (saveparms) {
            try {
                that.EnableChangeStatus(false);
                var nextstatus = that.Vmx.methods.nextavailablestatus();
                that.SaveChangeParms = saveparms;
                that.SaveChangeParms.tgtstate = nextstatus;
                that.Vmx.currentsurveystatus(nextstatus);
                nextstatus = null;
            }
            catch (ex) {
                alert("prweb.publishsvc.ChangePublishStatusBtnAction reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region RDentLink methods.
        that.rdldxnryURL = null;

        that.RDentLoginDxnry = {};

        that.retrieveRDentLogin = function (surveyid) {
            var rdlrslt = {
                islogin: false,
                login: "Respondent Link is not available for this survey..."
            };
            try {
                if (that.RDentLoginDxnry) {
                    if (that.RDentLoginDxnry[surveyid]) {
                        rdlrslt.islogin = true;
                        rdlrslt.login = that.RDentLoginDxnry[surveyid].NEMA;
                    }
                }
                else {
                    rdlrslt.islogin = false;
                    rdlrslt.login = "Respondent links are not available at this time...";
                }
            }
            catch (ex) {
                alert("prweb.publishsvc.retrieveRDentLogin  reports " + ex.Message);
            }
            return rdlrslt;
        };

        // who calls this?
        that.retrieveRDentLoginDxnry = function () {
            try {
                var myurl = that.rdldxnryURL;
                if (myurl) {
                    try {
                        prweb.dataManager.sendRequest({
                            url: myurl,
                            dataType: 'json',
                            contentType: 'application/json',
                            //                        cache: false,
                            success: function (rdldxnry) {
                                that.RDentLoginDxnry = rdldxnry;
                                that.populateRDentLink();
                                return;
                            },
                            error: function (e) {
                                alert("prweb.publishsvc.retrieveRDentLoginDxnry.successhandler reports  " + e.error().toString);
                            }
                        });
                    }
                    catch (ex) {
                        alert("prweb.publishsvc.retrieveRDentLoginDxnry.sendRequest reports " + ex.Message);
                    }
                }
            }
            catch (ex) {
                alert("prweb.publishsvc.retrieveRDentLoginDxnry  reports " + ex.Message);
            }
        };

        //        that.RDentLinkBaseUrl = "http://192.168.1.105:53922/PRWeb/RDentPortal/Index/";
        that.RDentLinkBaseUrl = "http://perceptricsresearch.com/PRWeb/RDentPortal/Index/";
        //"prefix http then.....perceptricsresearch.com/RDentPortal/Index/{surveyid}/{rdentemail}"

        that.populateRDentLink = function () {
            var rslt = false;
            try {
                var surveyid = that.Vmx.surveymodel.SurveyID().toString();
                var rdlrslt = that.retrieveRDentLogin(surveyid);
                if (rdlrslt.islogin) {
                    var sid = that.Vmx.surveymodel.SurveyID();
                    var email = rdlrslt.login;
                    var secondpart = sid + "/" + email + "/";
                    that.Vmx.myrdentlink(that.RDentLinkBaseUrl + secondpart);
                    rslt = true;
                    sid = null;
                    email = null;
                    secondpart = null;
                }
                else {
                    that.Vmx.myrdentlink(rdlrslt.login);
                    rslt = false;
                }
                rdlrslt = null;
            }
            catch (ex) {
                alert("prweb.publishsvc.populateRDentLink  reports " + ex.Message);
            }
            return rslt;
        };

        that.RDentLinkBtnAction = function () {
            try {
                var isvis = that.Vmx.islinkvisible();
                that.Vmx.islinkvisible(!isvis);
            }
            catch (ex) {
                alert("prweb.publishsvc.RDentLinkBtnAction reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region SendEmailBtnAction
        that.SendEmailwithRDentLink = function (sendemurl) {
            try {
                var sendemailurl = sendemurl; //was populated in view on the server...passed as an option..
                var dataToSend = {
                    surveyname: "empty",
                    linktext: "empty"
                };
                dataToSend.surveyname = that.Vmx.surveymodel.SurveyName();
                dataToSend.linktext = that.Vmx.myrdentlink();
                prweb.dataManager.sendRequest({
                    url: sendemailurl,
                    data: JSON.stringify(dataToSend),
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (msgserver) {
                        that.Vmx.msgfromserver(msgserver);
                        return;
                    },
                    error: function (e) {
                        alert("prweb.publishsvc.SendEmailwithRDentLink reports " + e.error().toString);
                    }
                });
            }
            catch (ex) {
                alert("prweb.publishsvc.SendEmailwithRDentLink reports " + ex.Message);
            }
            return;
        };

        that.SendEmailBtnAction = function (rdentemailurl) {
            try {
                var linkurlstr = that.Vmx.myrdentlink();
                var sn = prweb.surveymodelsvc.SurveyName();
                var lnkname = "Respondent";
                var subjectpart = sn + " " + lnkname + " link";
                var bodypart = "Survey: " + sn + " " + lnkname + " link " + linkurlstr;
                //do the email thing here...
                var mailparts = {
                    to: "?",
                    subject: subjectpart,
                    body: bodypart
                }
                prweb.ShowMail(mailparts);
                linkurlstr = null;
            }
            catch (ex) {
                alert("prweb.publishsvc.SendEmailBtnAction reports " + ex.Message);
            }


            return;
        };
        //#endregions

        //#region InitializePublishStatusInfo and Shutdown
        that.InitializePublishStatusInfo = function () {
            try {
                that.SaveChangeParms = false;
                that.Vmx.methods.populate();
                var konode = $("#publishhomecontentouter");
                ko.applyBindings(that.Vmx, konode[0]);
                konode = null;
                that.retrieveRDentLoginDxnry();
            }
            catch (ex) {
                alert("prweb.publishsvc.InitializePublishStatusInfo  reports " + ex.Message);
            }
        };

        that.Shutdown = function () {
            try {
                that.DisposeVmx();
                that.SaveChangeParms = false;
            }
            catch (ex) {
                alert("prweb.publishsvc.Shutdown  reports " + ex.Message);
            }
            return;
        };
        //#endregion

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
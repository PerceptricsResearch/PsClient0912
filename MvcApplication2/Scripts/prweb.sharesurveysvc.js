/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.sharesurveysvc = (function () {
        var that = {};

        that.retrieveglinfoUrl = false;

        that.BaseUrl = "http://www.perceptricsresearch.com/GuestPortal/Index/"
        that.GLIstring = "";

        that.SharedLinksDxnry = [];

        //#region EvaluateDirtyLinks
        that.EvaluateDirtyLinks = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SharedLinksDxnry.length; i++) {
                    var linkentry = that.SharedLinksDxnry[i];
                    rslt = (rslt || (linkentry.isshared() != linkentry.isharedoriginal()));
                    linkentry = null;
                };
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.EvaluateDirtyLinks reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion

        //#region InitializeSharedLinksDxnry and linkentry methods
        that.InitializeSharedLinksDxnry = function (linkrowcolxn) {
            var makedxnryrow = function (lrow) {
                var linkentry = {
                    name: ko.observable(lrow.LinkName),
                    description: ko.observable(lrow.LinkDescription),
                    isshared: ko.observable(lrow.IsShared),
                    isenabled: ko.observable(false),
                    status: ko.observable("disabled"),
                    linkurl: null,
                    linkisvisible: ko.observable(false),
                    isharedoriginal: ko.observable(lrow.IsShared),
                    alternativevaluescolxn: ["Off", "On"],
                    currentvalue: ko.observable("Off"),
                    suffix: null,
                    methods: {
                        updatedatatosend: null,
                        oncurrentvaluechanged: null,
                        onissharedchange: null,
                        changestatus: null,
                        createlinkurl: null,
                        enable: null,
                        dispose: null,
                        disable: null
                    },
                    subscription: null
                };
                if (linkentry.isshared()) {
                    linkentry.currentvalue("On");
                };
                linkentry.methods.createlinkurl = function () {
                    var rslt = false;
                    try {
                        var sid = prweb.surveymodelsvc.CurrentSurveyID();
                        var suffix = sid.toString() + "/" + that.GLIstring + "/" + linkentry.name();
                        linkentry.linkurl = that.BaseUrl + suffix;
                        sid = null;
                        suffix = null;
                    }
                    catch (ex) {
                        alert("prweb.sharesurveysvc.linkentry.methods.createlinkurl reports " + ex.Message);
                    }
                    return rslt;
                };
                linkentry.methods.updatedatatosend = function (newval) {
                    try {
                        var linkname = linkentry.name();
                        var row = Enumerable.From(that.dataToSend.linkspkg.LinkRowsColxn).Where(function (dtsr) { return dtsr.LinkName == linkname }).FirstOrDefault();
                        if (row) {
                            row.IsShared = newval;
                        }
                        row = null;
                    }
                    catch (ex) {
                        alert("prweb.sharesurveysvc.linkentry.methods.updatedatatosend reports " + ex.Message);
                    }
                };
                linkentry.methods.oncurrentvaluechanged = function (newval) {
                    try {
                        switch (true) {
                            case (newval == "Off"):
                                linkentry.isshared(false);
                                linkentry.methods.updatedatatosend(false);
                                break;
                            case (newval == "On"):
                                linkentry.isshared(true);
                                linkentry.methods.updatedatatosend(true);
                                break;
                        }
                        that.Vmx.isdirty(that.EvaluateDirtyLinks());
                    }
                    catch (ex) {
                        alert("prweb.sharesurveysvc.oncurrentvaluechanged reports " + ex.Message);
                    }

                    return;
                };
                linkentry.methods.changestatus = function (newstatus) {
                    linkentry.status(newstatus);
                    return;
                };
                linkentry.methods.dispose = function () {
                    linkentry.subscription.dispose();
                    linkentry.subscription = null;
                    return;
                };
                linkentry.subscription = linkentry.currentvalue.subscribe(linkentry.methods.oncurrentvaluechanged);
                linkentry.methods.createlinkurl();
                that.SharedLinksDxnry.push(linkentry);

                return true;
            };
            var rslt = false;
            try {
                // this gives me a viewmodel with properties named 0, 1, 2,...for each 
                //                var linknames = ["Results", "Review", "Test"];
                Enumerable.From(linkrowcolxn).ForEach(function (lr) { return makedxnryrow(lr) });
                //                that.Vmx.slinksdxnry = that.SharedLinksDxnry;
                rslt = true;
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.InitializeSharedLinksDxnry reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion

        //#region Vmx and DisposeVmx

        that.Vmx = {
            slinksdxnry: ko.observable(),
            isadvanced: ko.observable(false),
            surveyname: ko.observable("not set"),
            surveystatus: ko.observable("not set"),
            isdirty: ko.observable(false),
            isdirtysubscription: null,
            editdonetext: ko.observable("Edit"),
            backcanceltext: ko.observable("Back"),
            message: ko.observable(""),
            methods: {
                populate: function () {
                    try {
                        that.Vmx.isdirty(false);
                        that.Vmx.editdonetext("Edit");
                        that.Vmx.backcanceltext("Back");
                        that.Vmx.slinksdxnry(that.SharedLinksDxnry);
                        that.Vmx.methods.subscribeisdirty();
                        that.Vmx.message("Use the Edit button to change your Share settings.");
                    }
                    catch (ex) {
                        alert("prweb.sharesurveysvc.Vmx.populate  reports " + ex.Message);
                    }
                    return;
                },
                onisdirtychanged: function (newval) {
                    try {
                        if (newval) {
                            that.Vmx.message("Use the Done button to save your Share settings.");
                            that.Vmx.editdonetext("Done");
                            that.Vmx.backcanceltext("Cancel");
                        }
                        else {
                            that.Vmx.message("Use the Edit button to change your Share settings.");
                            that.Vmx.editdonetext("Edit");
                            that.Vmx.backcanceltext("Back");
                        }
                    }
                    catch (ex) {
                        alert("prweb.sharesurveysvc.Vmx.onisdirtychanged  reports " + ex.Message);
                    }
                    return;
                },
                subscribeisdirty: function () {
                    try {
                        that.Vmx.isdirtysubscription = that.Vmx.isdirty.subscribe(that.Vmx.methods.onisdirtychanged);
                    }
                    catch (ex) {
                        alert("prweb.sharesurveysvc.Vmx.subscribeisdirty  reports " + ex.Message);
                    }
                    return;
                },
                dispose: function () {
                    try {
                        that.Vmx.isdirtysubscription.dispose();
                        that.Vmx.isdirtysubscription = null;
                        that.Vmx.isdirty(false);
                    }
                    catch (ex) {
                        alert("prweb.sharesurveysvc.Vmx.dispose  reports " + ex.Message);
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
                alert("prweb.sharesurveysvc.Vmx.DisposeVmx  reports " + ex.Message);
            }
        };
        //#endregion

        //#region RetrieveSurveyLinks and CreateUrl
        that.CreateRetrieveUrl = function () {
            var rslt = false;
            try {
                var baseurl = that.retrieveglinfoUrl;
                var sid = prweb.surveymodelsvc.CurrentSurveyID();
                if (sid) {
                    var oldparm = "/0"; //"id=" + oldval;
                    var newparm = "/" + (sid.toString());
                    rslt = baseurl.replace(oldparm, newparm);
                }
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.CreateUrl reports " + ex.Message);
            }
            return rslt;
        };
        that.RetrieveSurveyLinks = function () {
            try {
                var myurl = that.CreateRetrieveUrl();
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        success: function (glidata) {
                            try {
                                //the glidata object is an anonymous type created in subscribermaincontroller.JsonRetrieveGLInfo
                                that.dataToSend.linkspkg = glidata.linkspkg;
                                that.GLIstring = glidata.glistring;
                                that.SharedLinksDxnry = [];
                                that.InitializeSharedLinksDxnry(glidata.linkspkg.LinkRowsColxn);
                                $("#sharesurveylinksroot").removeClass("prwslideouthide");
                                that.Vmx.methods.populate();
                                var konode = $("#sharehomecontentouter");
                                ko.applyBindings(that.Vmx, konode[0]);
                                konode = null;
                                that.SaveUrl = glidata.saveurl;
                                that.PopulateDataBoundButtonHandlers();
                            }
                            catch (ex) {
                                alert("prweb.sharesurveysvc.RetrieveSurveyLinks.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.sharesurveysvc.RetrieveSurveyLinks.sendRequest reports error..." + e.toString());
                        }
                    });
                }
                else {
                    alert("prweb.sharesurveysvc.RetrieveSurveyLinks reports shared links url is false.");
                }
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.RetrieveSurveyLinks  reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region SaveLinks and SaveLinksCompletedHandler
        that.SaveLinksCompleteHandler = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SharedLinksDxnry.length; i++) {
                    var linkentry = that.SharedLinksDxnry[i];
                    var newval = linkentry.isshared();
                    linkentry.isharedoriginal(newval);
                    linkentry = null;
                    newval = null;
                };
                that.Vmx.isdirty(that.EvaluateDirtyLinks());
                rslt = true;
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.SaveLinksCompleteHandler reports " + ex.Message);
            }
            return rslt;
        };

        that.SaveUrl = false;
        that.dataToSend = {
            linkspkg: false
        };
        that.SaveSharedSurveyLinks = function () {
            try {
                var myurl = that.SaveUrl;
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        data: JSON.stringify(that.dataToSend),
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (saveresponse) {
                            try {
                                //this needs to clear the sendRequest data cache for the retrieveGLIUrl...
                                //this needs to do some stuff to make isdirty false...
                                that.SaveLinksCompleteHandler();
                            }
                            catch (ex) {
                                alert("prweb.sharesurveysvc.SaveSharedSurveyLinks.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.sharesurveysvc.SaveSharedSurveyLinks.sendRequest reports error..." + e.toString());
                        }
                    });
                }
                else {
                    alert("prweb.sharesurveysvc.SaveSharedSurveyLinks reports shared links url is false.");
                }

            }
            catch (ex) {
                alert("prweb.sharesurveysvc.SaveSharedSurveyLinks  reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region EditDone and BackCancel ButtonActions
        that.EnableCheckboxes = function (newval) {
            var rslt = false;
            try {
                for (var i = 0; i < that.SharedLinksDxnry.length; i++) {
                    var linkentry = that.SharedLinksDxnry[i];
                    linkentry.isenabled(newval);
                    linkentry = null;
                };
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.EnableCheckboxes reports " + ex.Message);
            }
            return rslt;
        };

        that.RestoreOriginalValues = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SharedLinksDxnry.length; i++) {
                    var linkentry = that.SharedLinksDxnry[i];
                    var orig = linkentry.isharedoriginal();
                    linkentry.isshared(orig);
                    switch (true) {
                        case (!orig):
                            linkentry.currentvalue("Off");
                            break;
                        case (orig):
                            linkentry.currentvalue("On");
                            break;
                    }
                    linkentry = null;
                    orig = null;
                };
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.RestoreOriginalValues reports " + ex.Message);
            }
            return rslt;
        };

        that.BackCancelButtonAction = function () {
            try {
                if (that.Vmx.isdirty()) {
                    that.RestoreOriginalValues();
                    that.EnableCheckboxes(false);

                }
                else {
                    //this should navigate to shared home...
                    prweb.appsvc.PopulateSurveyModelContext(false);
                }
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.BackCancelButtonAction reports " + ex.Message);
            }
            return;
        };

        that.EditDoneButtonAction = function () {
            try {
                if (that.Vmx.isdirty()) {
                    that.EnableCheckboxes(false);
                    that.SaveSharedSurveyLinks();
                }
                else {
                    //do the edit action...enable checkboxes click...
                    that.EnableCheckboxes(true);
                }
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.PopulateButtonHandlers reports " + ex.Message);
            }
            return;
        };
        //#endregion

        that.ShowMail = function (mailparts) {
            var rslt = "mailto:?";
            try {
                rslt = "mailto:" + mailparts.to + "subject=" + mailparts.subject + "&body=" + mailparts.body;

                window.location.replace(rslt);
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.ShowMail reports " + ex.Message);
            }
            return;
        };

        //#region ShowLink and SendLink ButtonActions
        that.ShowLinkButtonAction = function (kodata) {
            if (kodata) {
                var curval = kodata.linkisvisible();
                if (curval) {
                    kodata.linkisvisible(false);
                }
                else {
                    kodata.linkisvisible(true);
                }
                curval = null;
                kodata = null;
            }
            return;
        };
        that.SendLinkButtonAction = function (kodata) {
            try {
                if (kodata) {
                    var linkurlstr = kodata.linkurl;
                    var sn = prweb.surveymodelsvc.SurveyName();
                    var lnkname = kodata.name();
                    var subjectpart = sn + " " + lnkname + " link";
                    var bodypart = "Survey: " + sn + " " + lnkname + " link " + linkurlstr;
                    //do the email thing here...
                    var mailparts = {
                        to: "?",
                        subject: subjectpart,
                        body: bodypart
                    }
                    that.ShowMail(mailparts);

                    linkurlstr = null;
                    kodata = null;
                }
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.SendLinkButtonAction reports " + ex.Message);
            }
            return;
        };

        that.PopulateDataBoundButtonHandlers = function () {
            try {
                $("#sharehomeroot").data("sharesurveyview").populateDataBoundButtonHandlers();
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.PopulateDataBoundButtonHandlers reports " + ex.Message);
            }
            return;
        };
        //#endregion

        that.DisposeSharedLinksDnxry = function () {
            try {
                for (var i = 0; i < that.SharedLinksDxnry.length; i++) {
                    that.SharedLinksDxnry[i].methods.dispose();
                    that.SharedLinksDxnry[i] = null;
                };
                that.SharedLinksDxnry = null;
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.DisposeSharedLinksDnxry reports " + ex.Message);
            }
        };

        that.Shutdown = function () {
            that.DisposeSharedLinksDnxry();
            that.DisposeVmx();
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
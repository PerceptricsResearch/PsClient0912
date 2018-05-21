/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.notecommentsvc = (function () {
        var that = {};

        //#region Utitilies and Variables
        that.settingshomeUrl = false;

        that.SurveyInfoItemDxnry = [];

        that.Retrievesurveyinfoentry = function (section, name) {
            var rslt = false;
            try {
                var sc = Enumerable.From(that.dataToSend.surveyinfopkg.SurveyInfoSectionColxn).Where(function (s) { return s.SectionName == section }).FirstOrDefault();
                if (sc) {
                    rslt = Enumerable.From(sc.SettingsItemColxn).Where(function (s) { return s.SettingName == name }).FirstOrDefault();
                }
                else {
                    alert("prweb.notecommentsvc.Retrievesurveyinfoentry reports SectionName returns nothing. ");
                }
                sc = null;
            }
            catch (ex) {
                alert("prweb.notecommentsvc.Retrievesurveyinfoentry reports " + ex.Message);
            }

            return rslt;
        };
        //#endregion

        //#region EvaluateDirtySurveyInfos
        that.EvaluateDirtySurveyInfos = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SurveyInfoItemDxnry.length; i++) {
                    var itemscolxn = that.SurveyInfoItemDxnry[i].SurveyInfoItemColxn;
                    for (var j = 0; j < itemscolxn.length; j++) {
                        var surveyinfoentry = itemscolxn[j];
                        //                        rslt = (rslt || (surveyinfoentry.currentvalue() != surveyinfoentry.originalvalue));
                        surveyinfoentry = null;
                    }
                    itemscolxn = null;
                };
            }
            catch (ex) {
                alert("prweb.notecommentsvc.EvaluateDirtySurveyInfos reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion

        //#region InitializeSurveyInfoItemDxnry and surveyinfoentry methods
        that.InitializeSurveyInfoItemDxnry = function (surveyinfossectioncolxn) {
            var makesection = function (sect) {
                try {
                    var surveyinfossection = {
                        SectionTitle: sect.SectionTitle,
                        SectionDescription: sect.SectionDescription,
                        SurveyInfoItemColxn: [],
                        displayMode: function (inforow) {
                            return inforow.name;
                        },
                        isenabled: ko.observable(false),
                        iscollapsed: ko.observable(true),
                        methods: {
                            junk: null
                        }
                    };
                    var makesurveyinforow = function (srow) {
                        try {
                            var surveyinfoentry = {
                                name: srow.InfoName,
                                visiblelemcolxn: ko.observable(),
                                elemcolxn: srow.ElementsColxn,
                                displayTemplate: function (skvp) {
                                    return skvp.Key;
                                },
                                iseditable: srow.IsEditable,
                                isenabled: ko.observable(false),
                                iscollapsed: ko.observable(true),
                                subscriptions: {
                                    iscollapsed: null,
                                    oniscollapsedchanged: function (newval) {
                                        try {
                                            if (!newval) {
                                                surveyinfoentry.visiblelemcolxn(surveyinfoentry.elemcolxn);
                                            }
                                            else {
                                                surveyinfoentry.methods.populatecollapsedvisiblecolxn();
                                            }
                                            //                                            surveyinfoentry.methods.updatedatatosend(newval);
                                            //                                            that.Vmx.isdirty(that.EvaluateDirtySurveyInfos());
                                        }
                                        catch (ex) {
                                            alert("prweb.notecommentsvc.SurveyInfoItemDxnry.oniscollapsedchanged reports " + ex.Message);
                                        }
                                        return;
                                    },
                                    subscribeiscollapsed: function () {
                                        try {
                                            var thisiswhat = this;
                                            thisiswhat = null;
                                            surveyinfoentry.subscriptions.iscollapsed = surveyinfoentry.iscollapsed.subscribe(surveyinfoentry.subscriptions.oniscollapsedchanged);
                                        }
                                        catch (ex) {
                                            alert("prweb.notecommentsvc.SurveyInfoItemDxnry.subscriptions.subscribeelemcolxn  reports " + ex.Message);
                                        }
                                        return;
                                    }
                                },
                                methods: {
                                    populatecollapsedvisiblecolxn: function () {
                                        var rslt = { Key: "collapsed", Valu: "" };
                                        rslt.Valu = "lets try this as a collapsed thing";
                                        surveyinfoentry.visiblelemcolxn([rslt]);
                                        return;
                                    },
                                    updatedatatosend: function (newval) {
                                        try {
                                            var sectionname = surveyinfossection.SectionTitle;
                                            var section = Enumerable.From(that.dataToSend.surveyinfopkg.SurveyInfoSectionColxn).Where(function (sec) { return sec.SectionTitle == sectionname }).FirstOrDefault();
                                            if (section) {
                                                var infoname = surveyinfoentry.name;
                                                var row = Enumerable.From(section.SurveyInfoItemColxn).Where(function (s) { return s.InfoName == infoname }).FirstOrDefault();
                                                if (row) {
                                                    row.ElementsColxn = newval;
                                                }
                                                row = null;
                                                infoname = null;
                                            }
                                        }
                                        catch (ex) {
                                            alert("prweb.notecommentsvc.surveyinfoentry.methods.updatedatatosend reports " + ex.Message);
                                        }
                                        return;
                                    },
                                    dispose: function () {
                                        //                                        surveyinfoentry.subscriptions.iscollapsed.dispose();
                                        //                                        surveyinfoentry.subscriptions.iscollapsed = null;
                                        return;
                                    }
                                }
                            };
                            surveyinfoentry.methods.populatecollapsedvisiblecolxn();
                            surveyinfoentry.subscriptions.subscribeiscollapsed();
                            surveyinfossection.SurveyInfoItemColxn.push(surveyinfoentry);
                            srow = null;
                        }
                        catch (ex) {
                            alert("prweb.notecommentsvc.InitializeSurveyInfoItemDxnry.makesurveyinforow reports " + ex.Message);
                        }
                        return true;
                    };
                    Enumerable.From(sect.SurveyInfoItemColxn).ForEach(function (item) { return makesurveyinforow(item) });
                    that.SurveyInfoItemDxnry.push(surveyinfossection);
                }
                catch (ex) {
                    alert("prweb.notecommentsvc.InitializeSurveyInfoItemDxnry.makesection reports " + ex.Message);
                }
                return true;
            };
            var rslt = false;
            try {
                Enumerable.From(surveyinfossectioncolxn).ForEach(function (section) { return makesection(section) });
                rslt = true;
            }
            catch (ex) {
                alert("prweb.notecommentsvc.InitializeSurveyInfoItemDxnry reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion

        //#region Vmx and DisposeVmx
        that.Vmx = {
            currentnc: null,
            originalnc: null,
            sourcekodata: null,
            surveyinfodxnry: null,
            isadvanced: ko.observable(false),
            surveyname: ko.observable("not set"),
            surveystatus: null,
            viewtitle: "",
            isheadervisible: true,
            isedit: false,
            isdirty: ko.observable(false),
            isdirtysubscription: null,
            editdonetext: ko.observable("Edit"),
            backcanceltext: ko.observable("Back"),
            message: ko.observable(""),
            subscriptions: {
                colxn: {

                },
                onanychanged: function (newval) {
                    that.Vmx.isdirty(that.Vmx.methods.evaluateisdirty());
                },
                subscribeall: function () {
                    try {
                        for (var s in this.colxn) {
                            this.colxn[s] = that.Vmx.currentnc[s].subscribe(this.onanychanged);
                        }
                    }
                    catch (ex) {
                        alert("prweb.notecommentsvc.Vmx.subscriptions.subscribeall  reports " + ex.Message);
                    }
                    return;
                },
                dispose: function () {
                    try {
                        for (var s in this.colxn) {
                            this.colxn[s].dispose();
                            this.colxn[s] = null;
                            delete this.colxn[s];
                        };
                    }
                    catch (ex) {
                        alert("prweb.notecommentsvc.Vmx.subscriptions.dispose  reports " + ex.Message);
                    }
                    return;
                }
            },
            methods: {
                applychangestosource: function () {
                    try {

                        for (var i = 0; i < that.Vmx.originalnc.length; i++) {
                            var key = that.Vmx.originalnc[i].Key;
                            var value = that.Vmx.currentnc[key]();
                            if (key == "body") {
                                var html = $("#textentryeditorplaceholder").getCode();
                                value = html;
                                html = null;
                            }
                            that.NoteCommentSource.elemcolxn[i].Valu = value;
                        };
                    }
                    catch (ex) {
                        alert("prweb.notecommentsvc.Vmx.methods.applychangestosource  reports " + ex.Message);
                    }
                    return;
                },
                evaluateisdirty: function () {
                    var rslt = false;
                    for (var i = 0; i < that.Vmx.originalnc.length; i++) {
                        var key = that.Vmx.originalnc[i].Key;
                        var value = that.Vmx.originalnc[i].Valu;
                        rslt = (rslt || that.Vmx.currentnc[key] != value);
                    };

                    return rslt;
                },
                populatecurrent: function () {
                    try {
                        var cnc = {
                            body: "",
                            date: "",
                            title: "",
                            author: ""
                        };
                        that.Vmx.originalnc = that.NoteCommentSource.elemcolxn;
                        for (var i = 0; i < that.NoteCommentSource.elemcolxn.length; i++) {
                            var key = that.NoteCommentSource.elemcolxn[i].Key;
                            var value = that.NoteCommentSource.elemcolxn[i].Valu;
                            cnc[key] = ko.observable(value);
                            that.Vmx.subscriptions.colxn[key] = null;
                        };
                        $('#textentrycontainerwrapper').textentry({
                            currenttext: cnc.body,
                            sendbtn: false
                        });

                        that.Vmx.isheadervisible = (that.NoteCommentSource.name != "description");
                        switch (true) {
                            case (that.NoteCommentSource.name == "description"):
                                that.Vmx.viewtitle = "Survey Description";
                                break;
                            case (that.NoteCommentSource.name == "note"):
                                that.Vmx.viewtitle = "Note";
                                break;
                            case (that.NoteCommentSource.name == "comment"):
                                that.Vmx.viewtitle = "Comment";
                                break;
                        };
                        that.Vmx.currentnc = cnc;
                        that.Vmx.isdirty(false);
                        that.Vmx.editdonetext("Edit");
                        that.Vmx.backcanceltext("Back");
                        that.Vmx.methods.subscribeisdirty();
                        that.Vmx.message("When you have finished with your changes, please press Done.");
                        that.Vmx.subscriptions.subscribeall();
                    }
                    catch (ex) {
                        alert("prweb.notecommentsvc.Vmx.methods.populatecurrent  reports " + ex.Message);
                        that.Vmx.message("Sorry, note/comment was not loaded. " + ex.Message);
                    }
                    return;
                },
                populate: function () {
                    try {
                        that.Vmx.isdirty(false);
                        that.Vmx.editdonetext("Edit");
                        that.Vmx.backcanceltext("Back");
                        that.Vmx.surveyname(prweb.surveymodelsvc.SurveyName());
                        that.Vmx.surveystatus = prweb.surveymodelsvc.SurveyStateIDToString();
                        that.Vmx.surveyinfodxnry = that.SurveyInfoItemDxnry; // (that.SurveyInfoItemDxnry);
                        that.Vmx.methods.subscribeisdirty();
                        that.Vmx.message("Use the Edit button to change this survey's info.");
                    }
                    catch (ex) {
                        alert("prweb.notecommentsvc.Vmx.populate  reports " + ex.Message);
                    }
                    return;
                },
                onisdirtychanged: function (newval) {
                    try {
                        if (newval) {
                            that.Vmx.message("Use the Done button to save your changes.");
                            that.Vmx.editdonetext("Done");
                            that.Vmx.backcanceltext("Cancel");
                        }
                        else {
                            that.Vmx.message("Select info to change.");
                            that.Vmx.editdonetext("Edit");
                            that.Vmx.backcanceltext("Back");
                        }
                        that.NoteCommentSource.isdirty = newval;
                    }
                    catch (ex) {
                        alert("prweb.notecommentsvc.Vmx.onisdirtychanged  reports " + ex.Message);
                    }
                    return;
                },
                subscribeisdirty: function () {
                    try {
                        that.Vmx.isdirtysubscription = that.Vmx.isdirty.subscribe(that.Vmx.methods.onisdirtychanged);
                    }
                    catch (ex) {
                        alert("prweb.notecommentsvc.Vmx.subscribeisdirty  reports " + ex.Message);
                    }
                    return;
                },
                dispose: function () {
                    try {
                        that.Vmx.isdirtysubscription.dispose();
                        that.Vmx.isdirtysubscription = null;
                        that.Vmx.subscriptions.dispose();
                        that.Vmx.isdirty(false);
                        ko.cleanNode($("#notecommenthomecontentouter")[0]); //this ends up calling dispose on textentry widget...somehow...
                        that.Vmx.currentnc = null;
                        that.Vmx.originalnc = null;
                        that.Vmx.surveyinfodxnry = null;
                    }
                    catch (ex) {
                        alert("prweb.notecommentsvc.Vmx.dispose  reports " + ex.Message);
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
                alert("prweb.notecommentsvc.Vmx.DisposeVmx  reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region InitializeNoteCommentData and NoteCommentSource
        that.NoteCommentSource = null;
        that.InitializeNoteCommentData = function () {
            try {
                that.Vmx.methods.populatecurrent();
                var konode = $("#notecommenthomecontentouter");
                ko.applyBindings(that.Vmx, konode[0]);
                konode = null;
                that.Vmx.isdirty(true);
            }
            catch (ex) {
                alert("prweb.notecommentsvc.InitializeNoteCommentData reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region NoteComment Svc Methods
        that.notecommentEditDoneButtonAction = function (onbackselector) {
            try {
                //do something with notecommentdata
                // add it to the section.SurveyInfosDictionary...etc...
                that.Vmx.methods.applychangestosource();
                var editdone = that.NoteCommentSource.methods.editdone;
                that.NoteCommentSource = null;
                $("#notecommenthomeroot").toggle().data("notecomment").destroy();
                //                $("#notecommenthomeroot").data("notecomment").destroy();
                editdone();
                editdone = null;
            }
            catch (ex) {
                alert("prweb.notecommentsvc.notecommentEditDoneButtonAction reports " + ex.Message);
            }
            return;
        };
        that.notecommentBackCancelButtonAction = function (onbackselector) {
            try {
                //dosomething with notecomment data...
                var editcancel = that.NoteCommentSource.methods.editcancel;
                that.NoteCommentSource = null;
                $("#notecommenthomeroot").toggle().data("notecomment").destroy();
                //                $("#notecommenthomeroot").data("notecomment").destroy();
                editcancel();
                editcancel = null;
            }
            catch (ex) {
                alert("prweb.notecommentsvc.notecommentBackCancelButtonAction reports " + ex.Message);
            }
            return;
        };
        //#endregions

        //#region PopulateDataBoundButtonHandlers and CollapseAny
        that.PopulateDataBoundButtonHandlers = function () {
            try {
                //                $("#surveysinfohomeroot").data("surveysinfoview").populateDataBoundButtonHandlers();
            }
            catch (ex) {
                alert("prweb.notecommentsvc.PopulateDataBoundButtonHandlers reports " + ex.Message);
            }
            return;
        };

        that.CollapseAny = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SurveyInfoItemDxnry.length; i++) {
                    that.SurveyInfoItemDxnry[i].iscollapsed(true);
                };
            }
            catch (ex) {
                alert("prweb.notecommentsvc.EvaluateDirtySurveyInfos reports " + ex.Message);
            }
            return rslt;
        };

        that.CollapseAnyInfos = function (kodata) {
            return;
        };
        //#endregion

        //#region RetrieveSurveyInfoItemColxn and Url
        that.retrievesurveysinfoUrl = false;

        that.RetrieveSurveyInfoItemColxn = function () {
            try {
                var myurl = that.retrievesurveysinfoUrl;
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        success: function (surveyinfodata) {
                            try {
                                //the settingsdata object is an anonymous type created in subscribermaincontroller.JsonRetrieveSettingsInfo
                                that.dataToSend.surveyinfopkg = null;
                                that.dataToSend.surveyinfopkg = surveyinfodata.surveyinfopkg;
                                that.SurveyInfoItemDxnry = [];
                                that.InitializeSurveyInfoItemDxnry(surveyinfodata.surveyinfopkg.SurveyInfoSectionColxn);
                                $("#notecommenthomeroot").removeClass("prwslideouthide");
                                that.Vmx.methods.populate();
                                var konode = $("#notecommenthomecontentouter");
                                ko.applyBindings(that.Vmx, konode[0]);
                                konode = null;
                                //                                that.SaveUrl = surveyinfodata.saveurl;
                                that.PopulateDataBoundButtonHandlers();
                                if (prweb.IsTouch) {
                                    $("#notecommenthomeroot").css('-webkit-transform', ' translate3d(0,0,0)');
                                }
                                surveyinfodata = null;
                            }
                            catch (ex) {
                                alert("prweb.notecommentsvc.RetrieveSettingsColxn.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.notecommentsvc.RetrieveSettingsColxn.sendRequest reports error..." + e.toString());
                        }
                    });
                }
                else {
                    alert("prweb.notecommentsvc.RetrieveSettingsColxn reports retrieve url is false.");
                }
            }
            catch (ex) {
                alert("prweb.notecommentsvc.RetrieveSettingsColxn  reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region SaveLinks and SaveSettingsCompleteHandler
        that.SaveSettingsCompleteHandler = function () {
            var rslt = false;
            try {
                //                for (var i = 0; i < that.SharedLinksDxnry.length; i++) {
                //                    var linkentry = that.SharedLinksDxnry[i];
                //                    var newval = linkentry.isshared();
                //                    linkentry.isharedoriginal(newval);
                //                    linkentry = null;
                //                    newval = null;
                //                };
                that.Vmx.isdirty(that.EvaluateDirtySurveyInfos());
                rslt = true;
            }
            catch (ex) {
                alert("prweb.notecommentsvc.SaveSettingsCompleteHandler reports " + ex.Message);
            }
            return rslt;
        };

        that.SaveUrl = false;
        that.dataToSend = {
            surveyinfopkg: false
        };
        that.SaveSettings = function () {
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
                                that.SaveSettingsCompleteHandler();
                            }
                            catch (ex) {
                                alert("prweb.notecommentsvc.SaveSettings.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.notecommentsvc.SaveSettings.sendRequest reports error..." + e.toString());
                        }
                    });
                }
                else {
                    alert("prweb.notecommentsvc.SaveSettings reports shared links url is false.");
                }

            }
            catch (ex) {
                alert("prweb.notecommentsvc.SaveSettings  reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region EditDone and BackCancel ButtonActions
        that.EnableCheckboxes = function (newval) {
            var rslt = false;
            try {
                for (var i = 0; i < that.SurveyInfoItemDxnry.length; i++) {
                    that.SurveyInfoItemDxnry[i].isenabled(newval);
                    var itemscolxn = that.SurveyInfoItemDxnry[i].SurveyInfoItemColxn;
                    for (var j = 0; j < itemscolxn.length; j++) {
                        var surveyinfoentry = itemscolxn[j];
                        surveyinfoentry.isenabled(newval);
                        surveyinfoentry = null;
                        surveyinfoentry = null;
                    }
                    itemscolxn = null;
                };
                if (newval) {
                    that.Vmx.message("Select your survey info.");
                }
                else {
                    that.Vmx.message("Use the Edit button to change this survey's info.");
                }

            }
            catch (ex) {
                alert("prweb.notecommentsvcsvc.EnableCheckboxes reports " + ex.Message);
            }
            return rslt;
        };

        that.RestoreOriginalValues = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SurveyInfoItemDxnry.length; i++) {
                    var itemscolxn = that.SurveyInfoItemDxnry[i].SettingsItemColxn;
                    for (var j = 0; j < itemscolxn.length; j++) {
                        var surveyinfoentry = itemscolxn[j];
                        if (surveyinfoentry.currentvalue() != surveyinfoentry.originalvalue) {
                            surveyinfoentry.currentvalue(surveyinfoentry.originalvalue);
                        };
                        surveyinfoentry = null;
                    }
                    itemscolxn = null;
                };
            }
            catch (ex) {
                alert("prweb.notecommentsvc.RestoreOriginalValues reports " + ex.Message);
            }
            return rslt;
        };

        that.BackCancelButtonAction = function () {
            try {
                if (that.Vmx.isdirty()) {
                    //                    that.RestoreOriginalValues();
                    //                    that.EnableCheckboxes(false);
                }
                else {
                    //this should navigate to  appcntxtsurveysview...
                    //                    prweb.appsvc.PopulateSurveyModelContext(false);
                }
            }
            catch (ex) {
                alert("prweb.notecommentsvc.BackCancelButtonAction reports " + ex.Message);
            }
            return;
        };

        that.EditDoneButtonAction = function () {
            try {
                if (that.Vmx.isdirty()) {
                    //                    that.EnableCheckboxes(false);
                    //                    that.SaveSettings();
                }
                else {
                    //do the edit action...enable checkboxes click...
                    //                    var isedit = that.Vmx.isedit;
                    //                    that.EnableCheckboxes(!isedit);
                    //                    that.Vmx.isedit = !isedit;
                    //                    isedit = null;
                }
            }
            catch (ex) {
                alert("prweb.notecommentsvc.EditDoneButtonAction reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region DisposeSurveyInfoItemDxnry and Shutdown
        that.DisposeSurveyInfoItemDxnry = function () {
            var rslt = false;
            //            try {
            //                for (var i = 0; i < that.SurveyInfoItemDxnry.length; i++) {
            //                    var itemscolxn = that.SurveyInfoItemDxnry[i].SurveyInfoItemColxn;
            //                    for (var j = 0; j < itemscolxn.length; j++) {
            //                        itemscolxn[j].methods.dispose();
            //                        itemscolxn[j] = null;
            //                    }
            //                    itemscolxn = null;
            //                    that.SurveyInfoItemDxnry[i].SurveyInfoItemColxn = null;
            //                    that.SurveyInfoItemDxnry[i] = null;
            //                };
            //                that.SurveyInfoItemDxnry = null;
            //            }
            //            catch (ex) {
            //                alert("prweb.notecommentsvc.DisposeSurveyInfoItemDxnry reports " + ex.Message);
            //            }
            return rslt;
        };

        that.Shutdown = function () {
            that.NoteCommentSource = null;
            that.DisposeVmx();
            that.DisposeSurveyInfoItemDxnry();
            return;
        };
        //#endregion

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
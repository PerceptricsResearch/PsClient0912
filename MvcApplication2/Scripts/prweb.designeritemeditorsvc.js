/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.designeritemeditorsvc = (function () {
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
                    alert("prweb.designeritemeditorsvc.Retrievesurveyinfoentry reports SectionName returns nothing. ");
                }
                sc = null;
            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.Retrievesurveyinfoentry reports " + ex.Message);
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
                alert("prweb.designeritemeditorsvc.EvaluateDirtySurveyInfos reports " + ex.Message);
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
                                            alert("prweb.designeritemeditorsvc.SurveyInfoItemDxnry.oniscollapsedchanged reports " + ex.Message);
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
                                            alert("prweb.designeritemeditorsvc.SurveyInfoItemDxnry.subscriptions.subscribeelemcolxn  reports " + ex.Message);
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
                                            alert("prweb.designeritemeditorsvc.surveyinfoentry.methods.updatedatatosend reports " + ex.Message);
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
                            alert("prweb.designeritemeditorsvc.InitializeSurveyInfoItemDxnry.makesurveyinforow reports " + ex.Message);
                        }
                        return true;
                    };
                    Enumerable.From(sect.SurveyInfoItemColxn).ForEach(function (item) { return makesurveyinforow(item) });
                    that.SurveyInfoItemDxnry.push(surveyinfossection);
                }
                catch (ex) {
                    alert("prweb.designeritemeditorsvc.InitializeSurveyInfoItemDxnry.makesection reports " + ex.Message);
                }
                return true;
            };
            var rslt = false;
            try {
                Enumerable.From(surveyinfossectioncolxn).ForEach(function (section) { return makesection(section) });
                rslt = true;
            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.InitializeSurveyInfoItemDxnry reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion

        //#region Vmx and DisposeVmx
        that.Vmx = {
            ditemmodel: ko.observableArray([]),
            cache: null,
            myT: null,
            istextentryvisible: false,
            isheadervisible: true,
            isedit: false,
            isdirty: ko.observable(false),
            isdirtysubscription: null,
            editdonetext: ko.observable("Edit"),
            backcanceltext: ko.observable("Back"),
            message: ko.observable("designeritem editor loading..."),
            subscriptions: {
                colxn: {

                },
                onanychanged: function (newval) {
                    that.Vmx.isdirty(that.Vmx.methods.evaluateisdirty());
                },
                subscribeall: function () {
                    try {
                        for (var s in this.colxn) {
                            //                            this.colxn[s] = that.Vmx.currentnc[s].subscribe(this.onanychanged);
                        }
                    }
                    catch (ex) {
                        alert("prweb.designeritemeditorsvc.Vmx.subscriptions.subscribeall  reports " + ex.Message);
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
                        alert("prweb.designeritemeditorsvc.Vmx.subscriptions.dispose  reports " + ex.Message);
                    }
                    return;
                }
            },
            methods: {
                resize: function () {
                    var edtbls = $(".prwdesignereditable", "#designeritemeditorresident");
                    if (edtbls.length > 0) {
                        for (var i = 0; i < edtbls.length; i++) {
                            prweb.flex.IsEditableOverflow(edtbls[i]);
                        };
                    }
                    edtbls = null;
                    return;
                },
                widgetizeT: function (el) {
                    try {
                        var myT = that.Vmx.myT;
                        var model = that.Vmx.ditemmodel()[0];
                        var w = model.modelcore.DesignerItemWidth() + "%";
                        var h = model.modelcore.DesignerItemHeight() + "%";
                        var t = 0; // model.modelcore.DI_CanvasTop() + "%";
                        var lft = 0; // model.modelcore.DI_CanvasLeft() + "%";
                        model = null;
                        $("#designeritemeditorcanvasinner").css("left", lft).css("top", t).css("width", w).css("height", h);
                        var wdgt = null;
                        switch (true) {
                            case (myT == "prweditablecontainer"):
                                break;
                            case (myT == "prwTIgnatz"):
                                wdgt = $(".ignatzprwt", "#designeritemeditorresident").ignatzprwt();
                                //                                wdgt.data("ignatzprwt").EditStart(); //self._getChildprwT(myT).EditStart();
                                break;
                            case (myT == "prwTImage"):
                                wdgt = $(".imageprwt", "#designeritemeditorresident").imageprwt();
                                wdgt.data("imageprwt").EditStart();
                                break;
                            case (myT == "prwTQuestOptionSet"):
                                wdgt = $(".questoptsetprwt", "#designeritemeditorresident").questoptsetprwt();
                                //                                wdgt.data("questoptsetprwt").EditStart();
                                break;
                            case (myT == "prwTStylablePageContentModel"):
                                wdgt = $(".stylablepageprwt", "#designeritemeditorresident").stylablepageprwt(); //this guy does not get DeviceControl...
                                wdgt.data("stylablepageprwt").EditStart();
                                break;
                            case (true):
                                alert("prweb.designeritemeditorsvc.Vmx.widgetizeT.encounterred myT=" + myT);
                                break;
                        };
                        wdgt = null;
                        myT = null;
                        that.Vmx.methods.resize();
                    }
                    catch (ex) {
                        alert("prweb.designeritemeditorsvc.Vmx.widgetizeT  reports " + ex.Message);
                    }
                    return;
                },
                applychangestosource: function () {
                    try {
                        var html = $("#textentryeditorplaceholder").getCode();
                        var redtblewidget = prweb.designertextsvc.CurrentEditable.data("designereditable");
                        if (redtblewidget) {
                            redtblewidget.populateEditedHtml(html);
                        }
                        redtblewidget = null;
                        html = null;
                        return;
                    }
                    catch (ex) {
                        alert("prweb.designeritemeditorsvc.Vmx.methods.applychangestosource  reports " + ex.Message);
                    }
                    return;
                },
                reverttocache: function () {
                    try {
                        var da = that.Vmx.ditemmodel()[0]
                        for (var f in da.modelcore) {
                            if (ko.isObservable(da.modelcore[f])) {
                                if (da.modelcore[f]() != that.Vmx.cache.modelcore[f]) {
                                    da.modelcore[f](that.Vmx.cache.modelcore[f]);
                                }
                            }
                        }
                        for (var f in da.QuestOptSetModel) {
                            if (ko.isObservable(da.QuestOptSetModel[f])) {
                                if (da.QuestOptSetModel[f]() != that.Vmx.cache.QuestOptSetModel[f]) {
                                    //this approach ultimately does not work for complex observables...need to rebuild designeritem from base js in designersvc...
                                    var seeval = da.QuestOptSetModel[f]();
                                    if (da.QuestOptSetModel[f].isObservableArray()) {
                                        da.QuestOptSetModel[f](ko.observableArray(that.Vmx.cache.QuestOptSetModel[f]));
                                    }
                                    else {
                                        da.QuestOptSetModel[f](that.Vmx.cache.QuestOptSetModel[f]);
                                    }
                                }
                            }
                        }
                        that.Vmx.ditemmodel.valueHasMutated();
                    }
                    catch (ex) {
                        alert("prweb.designeritemeditorsvc.Vmx.reverttocache  reports " + ex.Message);
                    }
                    return;
                },
                evaluateisdirty: function () {
                    var rslt = false;
                    return rslt;
                },
                populate: function (dimodel) {
                    try {
                        that.Vmx.cache = ko.toJS(dimodel);
                        that.Vmx.myT = dimodel.modelcore.presenterT;
                        that.Vmx.isdirty(false);
                        that.Vmx.editdonetext("Done");
                        that.Vmx.backcanceltext("Back");
                        var diarray = [];
                        diarray.push(dimodel); //this is the same observable that is in designercanvas.so any changes are permanent
                        that.Vmx.ditemmodel(diarray);
                        that.Vmx.methods.subscribeisdirty();
                        that.Vmx.message("When you have finished with your changes, please press Done.");
                    }
                    catch (ex) {
                        alert("prweb.designeritemeditorsvc.Vmx.populate  reports " + ex.Message);
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
                        //                        that.DesignerItemSource.isdirty = newval;
                    }
                    catch (ex) {
                        alert("prweb.designeritemeditorsvc.Vmx.onisdirtychanged  reports " + ex.Message);
                    }
                    return;
                },
                subscribeisdirty: function () {
                    try {
                        that.Vmx.isdirtysubscription = that.Vmx.isdirty.subscribe(that.Vmx.methods.onisdirtychanged);
                    }
                    catch (ex) {
                        alert("prweb.designeritemeditorsvc.Vmx.subscribeisdirty  reports " + ex.Message);
                    }
                    return;
                },
                dispose: function () {
                    try {
                        that.Vmx.isdirtysubscription.dispose();
                        that.Vmx.isdirtysubscription = null;
                        that.Vmx.subscriptions.dispose();
                        that.Vmx.isdirty(false);
                        that.Vmx.ditemmodel([]);
                        //                        ko.cleanNode($("#designeritemeditorhomecontainer")[0]); //this ends up calling dispose on textentry widget...somehow...
                    }
                    catch (ex) {
                        alert("prweb.designeritemeditorsvc.Vmx.dispose  reports " + ex.Message);
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
                alert("prweb.designeritemeditorsvc.Vmx.DisposeVmx  reports " + ex.Message);
            }
            return;
        };
        //#endregion





        //#region PopulateDataBoundButtonHandlers and CollapseAny
        that.PopulateDataBoundButtonHandlers = function () {
            try {
                //                $("#surveysinfohomeroot").data("surveysinfoview").populateDataBoundButtonHandlers();
            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.PopulateDataBoundButtonHandlers reports " + ex.Message);
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
                alert("prweb.designeritemeditorsvc.EvaluateDirtySurveyInfos reports " + ex.Message);
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
                                $("#DesignerItemhomeroot").removeClass("prwslideouthide");
                                that.Vmx.methods.populate();
                                var konode = $("#DesignerItemhomecontentouter");
                                ko.applyBindings(that.Vmx, konode[0]);
                                konode = null;
                                //                                that.SaveUrl = surveyinfodata.saveurl;
                                that.PopulateDataBoundButtonHandlers();
                                if (prweb.IsTouch) {
                                    $("#DesignerItemhomeroot").css('-webkit-transform', ' translate3d(0,0,0)');
                                }
                                surveyinfodata = null;
                            }
                            catch (ex) {
                                alert("prweb.designeritemeditorsvc.RetrieveSettingsColxn.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.designeritemeditorsvc.RetrieveSettingsColxn.sendRequest reports error..." + e.toString());
                        }
                    });
                }
                else {
                    alert("prweb.designeritemeditorsvc.RetrieveSettingsColxn reports retrieve url is false.");
                }
            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.RetrieveSettingsColxn  reports " + ex.Message);
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
                alert("prweb.designeritemeditorsvc.SaveSettingsCompleteHandler reports " + ex.Message);
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
                                alert("prweb.designeritemeditorsvc.SaveSettings.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.designeritemeditorsvc.SaveSettings.sendRequest reports error..." + e.toString());
                        }
                    });
                }
                else {
                    alert("prweb.designeritemeditorsvc.SaveSettings reports shared links url is false.");
                }

            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.SaveSettings  reports " + ex.Message);
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
                alert("prweb.designeritemeditorsvcsvc.EnableCheckboxes reports " + ex.Message);
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
                alert("prweb.designeritemeditorsvc.RestoreOriginalValues reports " + ex.Message);
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
                alert("prweb.designeritemeditorsvc.BackCancelButtonAction reports " + ex.Message);
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
                alert("prweb.designeritemeditorsvc.EditDoneButtonAction reports " + ex.Message);
            }
            return;
        };
        //#endregion


        //#region Add Remove EditableContainer
        that.editablecontent = false;
        that.editablecontainerpgnum = 0;
        that.editableselector = false;
        that.AddEditableContainer = function (editparms) {
            try {
                $("#designeritemeditortextentryroot").css("display", "");
                $("#designeritemeditorpanelsroot").css("display", "none");
                that.editablecontent = editparms.editablecontent;
                that.editableselector = editparms.editableselector;
                $('#textentrycontainerwrapper').textentry({
                    currenttext: ko.observable(that.editablecontent),
                    sendbtn: false
                });
                that.Vmx.istextentryvisible = true;
            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.AddEditableContainer reports " + ex.Message);
            }
            return;
        };
        that.RemoveEditableContainer = function () {
            try {
                $("#designeritemeditortextentryroot").css("display", "none");
                $("#designeritemeditorpanelsroot").css("display", "");
                that.Vmx.istextentryvisible = false;
            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.RemoveEditableContainer reports " + ex.Message);
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
            //                alert("prweb.designeritemeditorsvc.DisposeSurveyInfoItemDxnry reports " + ex.Message);
            //            }
            return rslt;
        };

        that.Shutdown = function () {
            try {
                that.DesignerItemSource = null;
                that.DisposeVmx();
                //            that.DisposeSurveyInfoItemDxnry();
            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.InitializeDesignerItemData reports " + ex.Message);
            }

            return;
        };
        //#endregion

        //#region TextButtonAction
        that.DesignerItemTextButtonAction = function () {
            try {
                var myT = that.Vmx.myT;
                var editablescolxn = $(".prwdesignereditable", "#designeritemeditorresident");
                switch (true) {
                    case (myT == "prwTIgnatz"):
                        editablescolxn.addClass("activeeditable")
                            .designereditable({
                                autoedit: true,
                                myprwT: myT
                            });
                        break;
                    case (myT == "prwTQuestOptionSet"):
                        that.Vmx.message("Tap or click the text you want to edit...");
                        editablescolxn.designereditable({
                            autoedit: false,
                            myprwT: myT
                        });
                        break;
                }
                editablescolxn = null;
            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.DesignerItemTextButtonAction reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region ExitActions
        that.ExitActions = function () {
            try {
                prweb.designerpanelsmgr.CloseAnyDiEditor();
                $("#designeritemeditorhomeroot").toggle().data("designeritemeditor").destroy();
                that.RemoveEditableContainer();
                $("#designerhomeviewcontainer").toggle();
                var activedi = $(".activedesigneritem, .editinprogress");
                if (activedi.length == 1) {
                    activedi.data("designeritem")._makeInActive();
                    var tdo = setTimeout(function () {
                        try {
                            activedi.data("designeritem").resizeEditables();
                        }
                        catch (ex) {
                            alert("prweb.designeritemeditorsvc.ExitActions.tdo reports " + ex.Message);
                        }
                        finally {
                            activedi = null;
                            clearTimeout(tdo);
                        }
                        return;
                    }, 200);
                }
                else {
                    activedi = null;
                }
                $("#prwebappbtnbar").css("display", "");
            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.ExitActions reports " + ex.Message);
            }

            return;
        };
        //#endregion

        //#region DesignerItemEditDone and BackCancel Action
        that.DesignerItemEditDoneButtonAction = function (onbackselector) {
            try {
                if (that.Vmx.istextentryvisible) {
                    that.Vmx.methods.applychangestosource();
                    prweb.designersvc.MarkDesignerDirty();
                    that.RemoveEditableContainer();
                }
                else {
                    prweb.designersvc.MarkDesignerDirty();
                    that.ExitActions();
                }
            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.DesignerItemEditDoneButtonAction reports " + ex.Message);
            }
            return;
        };
        that.DesignerItemBackCancelButtonAction = function (onbackselector) {
            try {
                if (that.Vmx.istextentryvisible) {
                    // revert to lockbox...
                    that.RemoveEditableContainer();
                }
                else {
                    that.Vmx.methods.reverttocache();
                    that.ExitActions();
                }
            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.DesignerItemBackCancelButtonAction reports " + ex.Message);
            }
            return;
        };
        //#endregions

        //#region InitializeDesignerItemData and DesignerItemSource
        that.DesignerItemSource = null;
        that.InitializeDesignerItemData = function (ditemmodel) {
            try {

                $("#designerhomeviewcontainer").toggle();
                $("#designeritemeditorhomeroot").toggle().designeritemeditor();
                that.DesignerItemSource = ditemmodel;
                //                var temp = ko.toJS(ditemmodel);
                that.Vmx.methods.populate(ditemmodel);
                //                if (!that.Vmx.isapplied) {
                //                    var konode = $("#designeritemeditorhomecontainer");
                //                    ko.applyBindings(that.Vmx, konode[0]);
                //                    konode = null;
                //                    that.Vmx.isapplied = true;
                //                }
                that.Vmx.isdirty(true);
                //                var w = ditemmodel.modelcore.DesignerItemWidth() + "%";
                //                var h = ditemmodel.modelcore.DesignerItemHeight() + "%";
                //                $("#designeritemeditorresident").css("width", w);
                //                $("#designeritemeditorresident").css("height", h);
                //                that.Vmx.methods.widgetizeT(ditemmodel.modelcore.presenterT);
                $("#prwebappbtnbar").css("display", "none");
                prweb.designerpanelsmgr.CloseAny();
                prweb.panelsmgr.CloseAllPanels();
            }
            catch (ex) {
                alert("prweb.designeritemeditorsvc.InitializeDesignerItemData reports " + ex.Message);
            }
            return;
        };
        //#endregion

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
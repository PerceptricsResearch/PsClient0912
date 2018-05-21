/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.settingssvc = (function () {
        var that = {};

        that.settingshomeUrl = false;

        that.SettingsInfoDxnry = [];

        that.RetrieveSettingEntry = function (section, name) {
            var rslt = false;
            try {
                var sc = Enumerable.From(that.dataToSend.settingspkg.SettingsSectionColxn).Where(function (s) { return s.SectionName == section }).FirstOrDefault();
                if (sc) {
                    rslt = Enumerable.From(sc.SettingsItemColxn).Where(function (s) { return s.SettingName == name }).FirstOrDefault();
                }
                else {
                    alert("prweb.settingssvc.RetrieveSettingEntry reports SectionName returns nothing. ");
                }
                sc = null;
            }
            catch (ex) {
                alert("prweb.settingssvc.RetrieveSettingEntry reports " + ex.Message);
            }

            return rslt;
        };

        //#region EvaluateDirtySettings
        that.EvaluateDirtySettings = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SettingsInfoDxnry.length; i++) {
                    var itemscolxn = that.SettingsInfoDxnry[i].SettingsItemColxn;
                    for (var j = 0; j < itemscolxn.length; j++) {
                        var settingentry = itemscolxn[j];
                        rslt = (rslt || (settingentry.currentvalue() != settingentry.originalvalue));
                        settingentry = null;
                    }
                    itemscolxn = null;
                };
            }
            catch (ex) {
                alert("prweb.settingssvc.EvaluateDirtySettings reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion

        //#region InitializeSettingsInfoDxnry and settingentry methods
        that.InitializeSettingsInfoDxnry = function (settingssectioncolxn) {
            var makesection = function (sect) {
                try {
                    var settingssection = {
                        SectionName: sect.SectionName,
                        SettingsItemColxn: [],
                        iscollapsed: ko.observable(true),
                        methods: {
                            junk: null
                        }
                    };
                    var makesettingrow = function (srow) {
                        try {
                            var settingentry = {
                                name: srow.SettingName,
                                description: srow.SettingDescription,
                                currentvalue: ko.observable(srow.SettingValue),
                                originalvalue: srow.SettingValue,
                                currentvaluendx: ko.observable(srow.CurValueNdx),
                                originalvaluendx: srow.CurValueNdx,
                                alternativevaluescolxn: srow.AlternativeValuesColxn,
                                selectortype: srow.SelectorType,
                                iseditable: srow.IsEditable,
                                isenabled: ko.observable(false),
                                methods: {
                                    updatedatatosend: null,
                                    oncurrentvaluechange: null,
                                    dispose: null
                                },
                                subscription: null
                            };
                            settingentry.methods.updatedatatosend = function (newval) {
                                try {
                                    var sectionname = settingssection.SectionName;
                                    var section = Enumerable.From(that.dataToSend.settingspkg.SettingsSectionColxn).Where(function (sec) { return sec.SectionName == sectionname }).FirstOrDefault();
                                    if (section) {
                                        var settingname = settingentry.name;
                                        var row = Enumerable.From(section.SettingsItemColxn).Where(function (s) { return s.SettingName == settingname }).FirstOrDefault();
                                        if (row) {
                                            row.SettingValue = newval;
                                        }
                                        row = null;
                                        settingname = null;
                                    }
                                }
                                catch (ex) {
                                    alert("prweb.settingssvc.settingentry.methods.updatedatatosend reports " + ex.Message);
                                }
                            };
                            settingentry.methods.oncurrentvaluechange = function (newval) {
                                try {
                                    settingentry.methods.updatedatatosend(newval);
                                    that.Vmx.isdirty(that.EvaluateDirtySettings());
                                }
                                catch (ex) {
                                    alert("prweb.settingssvc.oncurrentvaluechange reports " + ex.Message);
                                }

                                return;
                            };
                            settingentry.methods.dispose = function () {
                                settingentry.subscription.dispose();
                                settingentry.subscription = null;
                                return;
                            };
                            settingentry.subscription = settingentry.currentvalue.subscribe(settingentry.methods.oncurrentvaluechange);

                            settingssection.SettingsItemColxn.push(settingentry);
                        }
                        catch (ex) {
                            alert("prweb.settingssvc.InitializeSettingsInfoDxnry.makesettingrow reports " + ex.Message);
                        }
                        return true;
                    };
                    Enumerable.From(sect.SettingsItemColxn).ForEach(function (item) { return makesettingrow(item) });
                    that.SettingsInfoDxnry.push(settingssection);
                }
                catch (ex) {
                    alert("prweb.settingssvc.InitializeSettingsInfoDxnry.makesection reports " + ex.Message);
                }
                return true;
            };
            var rslt = false;
            try {
                Enumerable.From(settingssectioncolxn).ForEach(function (section) { return makesection(section) });
                rslt = true;
            }
            catch (ex) {
                alert("prweb.settingssvc.InitializeSettingsInfoDxnry reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion


        //#region Vmx and DisposeVmx

        that.Vmx = {
            settingsdxnry: null,
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
                        that.Vmx.settingsdxnry = that.SettingsInfoDxnry; // (that.SettingsInfoDxnry);
                        that.Vmx.methods.subscribeisdirty();
                        that.Vmx.message("Use the Edit button to change your settings.");
                    }
                    catch (ex) {
                        alert("prweb.settingssvc.Vmx.populate  reports " + ex.Message);
                    }
                    return;
                },
                onisdirtychanged: function (newval) {
                    try {
                        if (newval) {
                            that.Vmx.message("Use the Done button to save your Settings.");
                            that.Vmx.editdonetext("Done");
                            that.Vmx.backcanceltext("Cancel");
                        }
                        else {
                            that.Vmx.message("Select your settings.");
                            that.Vmx.editdonetext("Edit");
                            that.Vmx.backcanceltext("Back");
                        }
                    }
                    catch (ex) {
                        alert("prweb.settingssvc.Vmx.onisdirtychanged  reports " + ex.Message);
                    }
                    return;
                },
                subscribeisdirty: function () {
                    try {
                        that.Vmx.isdirtysubscription = that.Vmx.isdirty.subscribe(that.Vmx.methods.onisdirtychanged);
                    }
                    catch (ex) {
                        alert("prweb.settingssvc.Vmx.subscribeisdirty  reports " + ex.Message);
                    }
                    return;
                },
                dispose: function () {
                    try {
                        that.Vmx.isdirtysubscription.dispose();
                        that.Vmx.isdirtysubscription = null;
                        
                        that.Vmx.isdirty(false);
                        //                        if (this.options.hasAppliedBindings) {
                        ko.cleanNode($("#settingshomecontentouter")[0]);
                        that.Vmx.settingsdxnry = null;
                        //                        };
                    }
                    catch (ex) {
                        alert("prweb.settingssvc.Vmx.dispose  reports " + ex.Message);
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
                alert("prweb.settingssvc.Vmx.DisposeVmx  reports " + ex.Message);
            }
        };
        //#endregion


        that.PopulateDataBoundButtonHandlers = function () {
            try {
                $("#settingshomeroot").data("settingsview").populateDataBoundButtonHandlers();
            }
            catch (ex) {
                alert("prweb.settingssvc.PopulateDataBoundButtonHandlers reports " + ex.Message);
            }
            return;
        };

        that.CollapseAny = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SettingsInfoDxnry.length; i++) {
                    that.SettingsInfoDxnry[i].iscollapsed(true);
                };
            }
            catch (ex) {
                alert("prweb.settingssvc.EvaluateDirtySettings reports " + ex.Message);
            }
            return rslt;
        };

        //#region RetrieveSettingsInfo and CreateUrl
        that.retrievesettingsinfoUrl = false;

        that.RetrieveSettingsColxn = function () {
            try {
                var myurl = that.retrievesettingsinfoUrl;
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        success: function (settingsdata) {
                            try {
                                //the settingsdata object is an anonymous type created in subscribermaincontroller.JsonRetrieveSettingsInfo
                                that.dataToSend.settingspkg = null;
                                that.dataToSend.settingspkg = settingsdata.settingspkg;
                                that.SettingsInfoDxnry = [];
                                that.InitializeSettingsInfoDxnry(settingsdata.settingspkg.SettingsSectionColxn);
                                $("#settingsinforoot").removeClass("prwslideouthide");
                                that.Vmx.methods.populate();
                                var konode = $("#settingshomecontentouter");
                                ko.applyBindings(that.Vmx, konode[0]);
                                konode = null;
                                //                                that.SaveUrl = settingsdata.saveurl;
                                that.PopulateDataBoundButtonHandlers();
                                if (prweb.IsTouch) {
                                    $("#settingsinforoot").css('-webkit-transform', ' translate3d(0,0,0)');
                                }
                                settingsdata = null;
                            }
                            catch (ex) {
                                alert("prweb.settingssvc.RetrieveSettingsColxn.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.settingssvc.RetrieveSettingsColxn.sendRequest reports error..." + e.toString());
                        }
                    });
                }
                else {
                    alert("prweb.settingssvc.RetrieveSettingsColxn reports retrieve url is false.");
                }
            }
            catch (ex) {
                alert("prweb.settingssvc.RetrieveSettingsColxn  reports " + ex.Message);
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
                that.Vmx.isdirty(that.EvaluateDirtyLinks());
                rslt = true;
            }
            catch (ex) {
                alert("prweb.settingssvc.SaveSettingsCompleteHandler reports " + ex.Message);
            }
            return rslt;
        };

        that.SaveUrl = false;
        that.dataToSend = {
            settingspkg: false
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
                                alert("prweb.settingssvc.SaveSettings.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.settingssvc.SaveSettings.sendRequest reports error..." + e.toString());
                        }
                    });
                }
                else {
                    alert("prweb.settingssvc.SaveSettings reports shared links url is false.");
                }

            }
            catch (ex) {
                alert("prweb.settingssvc.SaveSettings  reports " + ex.Message);
            }
            return;
        };
        //#endregion


        //#region EditDone and BackCancel ButtonActions
        that.EnableCheckboxes = function (newval) {
            var rslt = false;
            try {
                for (var i = 0; i < that.SettingsInfoDxnry.length; i++) {
                    var itemscolxn = that.SettingsInfoDxnry[i].SettingsItemColxn;
                    for (var j = 0; j < itemscolxn.length; j++) {
                        var settingentry = itemscolxn[j];
                        settingentry.isenabled(newval);
                        settingentry = null;
                        settingentry = null;
                    }
                    itemscolxn = null;
                };
                if (newval) {
                    that.Vmx.message("Select your settings.");
                }
                else {
                    that.Vmx.message("Use the Edit button to change your Settings.");
                }

            }
            catch (ex) {
                alert("prweb.settingssvcsvc.EnableCheckboxes reports " + ex.Message);
            }
            return rslt;
        };

        that.RestoreOriginalValues = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SettingsInfoDxnry.length; i++) {
                    var itemscolxn = that.SettingsInfoDxnry[i].SettingsItemColxn;
                    for (var j = 0; j < itemscolxn.length; j++) {
                        var settingentry = itemscolxn[j];
                        if (settingentry.currentvalue() != settingentry.originalvalue) {
                            settingentry.currentvalue(settingentry.originalvalue);
                        };
                        settingentry = null;
                    }
                    itemscolxn = null;
                };
            }
            catch (ex) {
                alert("prweb.settingssvc.RestoreOriginalValues reports " + ex.Message);
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
                    //this should navigate to  appcntxtsettingsview...
                    //subscriberplatform is subscribed to this event...surveyContextChangedHandler puts the appcntxtviewmanager back in homecenterpanel...
                    var e = { newcontext: false };
                    prweb.pubsub.publish(prweb.events.appsvc.surveycontextchanged, e);
                }
            }
            catch (ex) {
                alert("prweb.settingssvc.BackCancelButtonAction reports " + ex.Message);
            }
            return;
        };

        that.EditDoneButtonAction = function () {
            try {
                if (that.Vmx.isdirty()) {
                    that.EnableCheckboxes(false);
                    that.SaveSettings();
                }
                else {
                    //do the edit action...enable checkboxes click...
                    that.EnableCheckboxes(true);
                }
            }
            catch (ex) {
                alert("prweb.settingssvc.EditDoneButtonAction reports " + ex.Message);
            }
            return;
        };
        //#endregion


        that.DisposeSettingsInfoDxnry = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SettingsInfoDxnry.length; i++) {
                    var itemscolxn = that.SettingsInfoDxnry[i].SettingsItemColxn;
                    for (var j = 0; j < itemscolxn.length; j++) {
                        itemscolxn[j].methods.dispose();
                        itemscolxn[j] = null;
                    }
                    itemscolxn = null;
                    that.SettingsInfoDxnry[i].SettingsItemColxn = null;
                    that.SettingsInfoDxnry[i] = null;
                };
                that.SettingsInfoDxnry = null;
            }
            catch (ex) {
                alert("prweb.settingssvc.DisposeSettingsInfoDxnry reports " + ex.Message);
            }
            return rslt;
        };

        that.Shutdown = function () {
            that.DisposeVmx();
            that.DisposeSettingsInfoDxnry();
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
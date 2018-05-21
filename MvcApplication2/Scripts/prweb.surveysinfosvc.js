/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.surveysinfosvc = (function () {
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
                    alert("prweb.surveysinfosvc.Retrievesurveyinfoentry reports SectionName returns nothing. ");
                }
                sc = null;
            }
            catch (ex) {
                alert("prweb.surveysinfosvc.Retrievesurveyinfoentry reports " + ex.Message);
            }

            return rslt;
        };
        //#endregion

        //#region EvaluateDirtySurveyInfos
        that.EvaluateDirtySurveyInfos = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SurveyInfoItemDxnry.length; i++) {
                    var itemscolxn = that.SurveyInfoItemDxnry[i].SurveyInfoItemColxn();
                    for (var j = 0; j < itemscolxn.length; j++) {
                        var surveyinfoentry = itemscolxn[j];
                        rslt = (rslt || surveyinfoentry.isdirty);
                        surveyinfoentry = null;
                    }
                    itemscolxn = null;
                };
            }
            catch (ex) {
                alert("prweb.surveysinfosvc.EvaluateDirtySurveyInfos reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion

        that.NewSurveyInfoEntry = function (sectiontitle, srow, isnew) {
            var surveyinfoentry = null;
            try {
                surveyinfoentry = {
                    id: srow.ID,
                    name: srow.InfoName,
                    visiblelemcolxn: ko.observable(),
                    elemcolxn: srow.ElementsColxn,
                    isdirty: false,
                    displayTemplate: function (skvp) {
                        return skvp.Key;
                    },
                    iseditable: srow.IsEditable,
                    isenabled: ko.observable(false),
                    isremoveenabled: ko.observable(false),
                    iscollapsed: ko.observable(true),
                    isattached: ko.observable(true),
                    subscriptions: {
                        iscollapsed: null,
                        oniscollapsedchanged: function (newval) {
                            try {
                                if (!newval) {
                                    surveyinfoentry.visiblelemcolxn(surveyinfoentry.elemcolxn);
                                    //                                    surveyinfoentry.isenabled(true);
                                }
                                else {
                                    surveyinfoentry.methods.populatecollapsedvisiblecolxn();
                                    //                                    surveyinfoentry.isenabled(false);
                                }
                            }
                            catch (ex) {
                                alert("prweb.surveysinfosvc.SurveyInfoItemDxnry.oniscollapsedchanged reports " + ex.Message);
                            }
                            return;
                        },
                        subscribeiscollapsed: function () {
                            try {
                                //                                            var thisiswhat = this;
                                //                                            thisiswhat = null;
                                surveyinfoentry.subscriptions.iscollapsed = surveyinfoentry.iscollapsed.subscribe(surveyinfoentry.subscriptions.oniscollapsedchanged);
                            }
                            catch (ex) {
                                alert("prweb.surveysinfosvc.SurveyInfoItemDxnry.subscriptions.subscribeelemcolxn  reports " + ex.Message);
                            }
                            return;
                        }
                    },
                    methods: {
                        addnew: function () {
                            try {
                                if (isnew) {
                                    var sectionname = sectiontitle;
                                    var section = Enumerable.From(that.Vmx.surveyinfodxnry).Where(function (sec) {
                                        return sec.SectionTitle == sectionname
                                    }).FirstOrDefault();
                                    var sicolxn = section.SurveyInfoItemColxn();
                                    sicolxn.push(surveyinfoentry);
                                    section.SurveyInfoItemColxn.valueHasMutated();
                                    surveyinfoentry.isenabled(true);
                                    isnew = false;
                                }
                            }
                            catch (ex) {
                                alert("prweb.surveysinfosvc.surveyinfoentry.methods.addnew reports " + ex.Message);
                            }
                            return;
                        },
                        remove: function (kocontext) {
                            try {
                                kocontext.$data.methods.dispose();
                                kocontext.$parent.SurveyInfoItemColxn.remove(kocontext.$data);
                                that.Vmx.isdirty(true);
                            }
                            catch (ex) {
                                alert("prweb.surveysinfosvc.surveyinfoentry.methods.remove reports " + ex.Message);
                            }
                            return;
                        },
                        edit: function () {
                            prweb.notecommentsvc.NoteCommentSource = surveyinfoentry;
                            $("#notecommenthomeroot").toggle().notecomment();
                            return;
                        },
                        editcancel: function () {
                            $("#surveysinfohomeroot").toggle();
                            return;
                        },
                        editdone: function () {
                            surveyinfoentry.methods.addnew(); //adds item to surveyinfodxnry.surveyinfoscolxn only if it is a new item..
                            $("#surveysinfohomeroot").toggle();
                            surveyinfoentry.iscollapsed(true);
                            surveyinfoentry.iscollapsed(false);
                            that.Vmx.isdirty(true);
                            return;
                        },
                        populatecollapsedvisiblecolxn: function () {
                            var rslt = {
                                Key: "collapsed",
                                Valu: ""
                            };
                            switch (true) {
                                case (surveyinfoentry.name == "description"):
                                    rslt.Valu += "<span>Press here to show expanded description.</span>";
                                    break;
                                case (surveyinfoentry.name == "note" || surveyinfoentry.name == "comment"):
                                    for (var i = 0; i < surveyinfoentry.elemcolxn.length; i++) {
                                        if (i < 2) {
                                            rslt.Valu += "<span>" + surveyinfoentry.elemcolxn[i].Valu + "</span>";
                                            if (i == 0) {
                                                rslt.Valu += "<span>  </span>";
                                            }
                                        }
                                    };
                                    break;
                            };
                            surveyinfoentry.visiblelemcolxn([rslt]);
                            return;
                        },
                        updatedatatosend: function () {
                            var rslt = true; //is called by SaveSurveyInfos...
                            try {
                                var sectionname = sectiontitle;
                                var section = Enumerable.From(that.dataToSend.surveyinfopkg.SurveyInfoSectionColxn).Where(function (sec) {
                                    return sec.SectionTitle == sectionname
                                }).FirstOrDefault();
                                if (section) {
                                    var infoname = surveyinfoentry.name;
                                    var id = surveyinfoentry.id;
                                    var row = Enumerable.From(section.SurveyInfoItemColxn).Where(function (s) {
                                        return (s.InfoName == infoname) && (s.ID == id)
                                    }).FirstOrDefault();
                                    if (row) {
                                        row.ElementsColxn = JSON.parse(JSON.stringify(surveyinfoentry.elemcolxn));
                                    }
                                    else {
                                        //need to create a new row...use the defaultsurveyitem(dsi), jsonparse.jsonstringify
                                        var dsi = JSON.parse(JSON.stringify(section.DefaultSurveyInfoItem));
                                        //populate it...
                                        dsi.ElementsColxn = JSON.parse(JSON.stringify(surveyinfoentry.elemcolxn));
                                        dsi.ID = prweb.NewGuid();
                                        surveyinfoentry.id = dsi.ID;
                                        section.SurveyInfoItemColxn.push(dsi);
                                        dsi = null;
                                    }
                                    row = null;
                                    infoname = null;
                                }
                            }
                            catch (ex) {
                                alert("prweb.surveysinfosvc.surveyinfoentry.methods.updatedatatosend reports " + ex.Message);
                                rslt = false;
                            }
                            return rslt;
                        },

                        dispose: function () {
                            surveyinfoentry.subscriptions.iscollapsed.dispose();
                            surveyinfoentry.subscriptions.iscollapsed = null;
                            return;
                        }
                    }
                };
                surveyinfoentry.methods.populatecollapsedvisiblecolxn();
                surveyinfoentry.subscriptions.subscribeiscollapsed();
                //                surveyinfossection.SurveyInfoItemColxn.push(surveyinfoentry);
                srow = null;
            }
            catch (ex) {
                alert("prweb.surveysinfosvc.InitializeSurveyInfoItemDxnry.makesurveyinforow reports " + ex.Message);
            }
            return surveyinfoentry;
        };

        //#region InitializeSurveyInfoItemDxnry and surveyinfoentry methods
        that.InitializeSurveyInfoItemDxnry = function (surveyinfossectioncolxn) {
            var makesection = function (sect) {
                try {
                    var surveyinfossection = {
                        SectionTitle: sect.SectionTitle,
                        DefaultSurveyInfoItem: sect.DefaultSurveyInfoItem,
                        SectionDescription: sect.SectionDescription,
                        SurveyInfoItemColxn: ko.observableArray([]),
                        displayMode: function (inforow) {
                            return inforow.name;
                        },
                        isattached: ko.observable(true),
                        isenabled: ko.observable(false),
                        isremoveenabled: ko.observable(false),
                        iscollapsed: ko.observable(true),
                        methods: {

                            collapseany: function (exthisid) {
                                var itemscolxn = surveyinfossection.SurveyInfoItemColxn();
                                for (var j = 0; j < itemscolxn.length; j++) {
                                    if (!itemscolxn[j].iscollapsed()) {
                                        if (itemscolxn[j].id != exthisid) {
                                            itemscolxn[j].iscollapsed(true);
                                        }
                                    }
                                }
                                itemscolxn = null;
                                return;
                            },
                            enableremove: function () {
                                var itemscolxn = surveyinfossection.SurveyInfoItemColxn();
                                for (var i = 0; i < itemscolxn.length; i++) {
                                    itemscolxn[i].isremoveenabled(true);
                                }
                                surveyinfossection.isremoveenabled(true);
                            },
                            disableremove: function () {
                                var itemscolxn = surveyinfossection.SurveyInfoItemColxn();
                                for (var i = 0; i < itemscolxn.length; i++) {
                                    itemscolxn[i].isremoveenabled(false);
                                }
                                surveyinfossection.isremoveenabled(false);
                            },
                            restoreorginal: function () {
                                var origcolxn = null;
                                var sectionname = sectiontitle;
                                var section = Enumerable.From(that.dataToSend.surveyinfopkg.SurveyInfoSectionColxn).Where(function (sec) {
                                    return sec.SectionTitle == sectionname
                                }).FirstOrDefault();
                                if (section) {

                                }
                            },
                            populatesicolxn: function (sectxn) {
                                try {
                                    var sicolxn = [];
                                    var makesurveyinforow = function (srow) {
                                        try {
                                            var surveyinfoentry = that.NewSurveyInfoEntry(surveyinfossection.SectionTitle, srow, false);
                                            sicolxn.push(surveyinfoentry);
                                            srow = null;
                                            surveyinfoentry = null;
                                        }
                                        catch (ex) {
                                            alert("prweb.surveysinfosvc.surveyinfossection.populatesicolxn.makesurveyinforow reports " + ex.Message);
                                        }
                                        return true;
                                    };
                                    Enumerable.From(sectxn.SurveyInfoItemColxn).ForEach(function (item) {
                                        return makesurveyinforow(item)
                                    });
                                    surveyinfossection.SurveyInfoItemColxn(sicolxn);
                                    sicolxn = null;
                                    makesurveyinforow = null;
                                }
                                catch (ex) {
                                    alert("prweb.surveysinfosvc.surveyinfossection.populatesicolxn reports " + ex.Message);
                                }
                                return;
                            }
                        }
                    };
                    surveyinfossection.methods.populatesicolxn(sect);
                    that.SurveyInfoItemDxnry.push(surveyinfossection);
                }
                catch (ex) {
                    alert("prweb.surveysinfosvc.InitializeSurveyInfoItemDxnry.makesection reports " + ex.Message);
                }
                return true;
            };
            var rslt = false;
            try {
                Enumerable.From(surveyinfossectioncolxn).ForEach(function (section) {
                    return makesection(section)
                });
                rslt = true;
            }
            catch (ex) {
                alert("prweb.surveysinfosvc.InitializeSurveyInfoItemDxnry reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion


        //#region Vmx and DisposeVmx
        that.Vmx = {
            surveyinfodxnry: null,
            isadvanced: ko.observable(false),
            surveyname: ko.observable("not set"),
            surveystatus: null,
            isedit: false,
            isdirty: ko.observable(false),
            isdirtysubscription: null,
            editdonetext: ko.observable("Edit"),
            backcanceltext: ko.observable("Back"),
            message: ko.observable(""),
            methods: {
                populate: function () {
                    try {
                        that.Vmx.isdirty(false);
                        that.Vmx.isedit = false;
                        that.Vmx.editdonetext("Edit");
                        that.Vmx.backcanceltext("Back");
                        that.Vmx.surveyname(prweb.surveymodelsvc.SurveyName());
                        that.Vmx.surveystatus = prweb.surveymodelsvc.SurveyStateIDToString();
                        that.Vmx.surveyinfodxnry = that.SurveyInfoItemDxnry; // (that.SurveyInfoItemDxnry);
                        that.Vmx.methods.subscribeisdirty();
                        that.Vmx.message("Use the Edit button to change this survey's info.");
                    }
                    catch (ex) {
                        alert("prweb.surveysinfosvc.Vmx.populate  reports " + ex.Message);
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
                    }
                    catch (ex) {
                        alert("prweb.surveysinfosvc.Vmx.onisdirtychanged  reports " + ex.Message);
                    }
                    return;
                },
                subscribeisdirty: function () {
                    try {
                        that.Vmx.isdirtysubscription = that.Vmx.isdirty.subscribe(that.Vmx.methods.onisdirtychanged);
                    }
                    catch (ex) {
                        alert("prweb.surveysinfosvc.Vmx.subscribeisdirty  reports " + ex.Message);
                    }
                    return;
                },
                dispose: function () {
                    try {
                        that.Vmx.isdirtysubscription.dispose();
                        that.Vmx.isdirtysubscription = null;
                        that.Vmx.isdirty(false);
                        ko.cleanNode($("#surveysinfohomecontentouter")[0]);
                        that.Vmx.surveyinfodxnry = null;
                    }
                    catch (ex) {
                        alert("prweb.surveysinfosvc.Vmx.dispose  reports " + ex.Message);
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
                alert("prweb.surveysinfosvc.Vmx.DisposeVmx  reports " + ex.Message);
            }
            return;
        };
        //#endregion


        //#region CollapseAny and CollapseAnyInfos
        that.CollapseAny = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SurveyInfoItemDxnry.length; i++) {
                    that.SurveyInfoItemDxnry[i].iscollapsed(true);
                };
            }
            catch (ex) {
                alert("prweb.surveysinfosvc.CollapseAny reports " + ex.Message);
            }
            return rslt;
        };

        //#endregion

        //#region RetrieveSurveyInfoItemColxn 
        that.retrievesurveysinfoUrl = false;

        that.RetrieveSurveyInfoItemColxn = function () {
            try {
                var myurl = that.retrievesurveysinfoUrl;
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        cache: false,
                        success: function (surveyinfodata) {
                            try {
                                //the settingsdata object is an anonymous type created in subscribermaincontroller.JsonRetrieveSettingsInfo
                                that.SaveUrl = surveyinfodata.saveurl;
                                that.dataToSend.surveyinfopkg = null;
                                that.dataToSend.surveyinfopkg = surveyinfodata.surveyinfopkg;
                                that.SurveyInfoItemDxnry = [];
                                that.InitializeSurveyInfoItemDxnry(JSON.parse(JSON.stringify(surveyinfodata.surveyinfopkg.SurveyInfoSectionColxn)));
                                $("#surveysinforoot").removeClass("prwslideouthide");
                                that.Vmx.methods.populate();
                                var konode = $("#surveysinfohomecontentouter");
                                ko.applyBindings(that.Vmx, konode[0]);
                                konode = null;
                                if (prweb.IsTouch) {
                                    $("#surveysinforoot").css('-webkit-transform', ' translate3d(0,0,0)');
                                }
                                surveyinfodata = null;
                            }
                            catch (ex) {
                                alert("prweb.surveysinfosvc.RetrieveSettingsColxn.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.surveysinfosvc.RetrieveSettingsColxn.sendRequest reports error..." + e.toString());
                        }
                    });
                }
                else {
                    alert("prweb.surveysinfosvc.RetrieveSettingsColxn reports retrieve url is false.");
                }
            }
            catch (ex) {
                alert("prweb.surveysinfosvc.RetrieveSettingsColxn  reports " + ex.Message);
            }
            return;
        };
        //#endregion


        //#region SaveSurveyInfos, SaveSurveyInfosCompleteHandler, and dataToSend
        that.SaveSurveyInfosCompleteHandler = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SurveyInfoItemDxnry.length; i++) {
                    var itemscolxn = that.SurveyInfoItemDxnry[i].SurveyInfoItemColxn();
                    for (var j = 0; j < itemscolxn.length; j++) {
                        var surveyinfoentry = itemscolxn[j];
                        surveyinfoentry.isdirty = false;
                        surveyinfoentry = null;
                    }
                    itemscolxn = null;
                };
                that.Vmx.isedit = false;
                that.Vmx.isdirty(false); //that.EvaluateDirtySurveyInfos());
                rslt = true;
            }
            catch (ex) {
                alert("prweb.surveysinfosvc.SaveSettingsCompleteHandler reports " + ex.Message);
            }
            return rslt;
        };

        that.SaveUrl = false;
        // the survyeinfopkg is the object received from the server...use it to carry the changes payload back to the server...
        that.dataToSend = {
            surveyinfopkg: false
        };
        that.SaveSurveyInfos = function () {
            try {
                var rslt = true;
                for (var i = 0; i < that.SurveyInfoItemDxnry.length; i++) {
                    var itemscolxn = that.SurveyInfoItemDxnry[i].SurveyInfoItemColxn();
                    for (var j = 0; j < itemscolxn.length; j++) {
                        var surveyinfoentry = itemscolxn[j];
                        rslt = (rslt && surveyinfoentry.methods.updatedatatosend());
                        surveyinfoentry = null;
                    }
                    itemscolxn = null;
                };
                var myurl = that.SaveUrl;
                if (rslt && myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        data: JSON.stringify(that.dataToSend),
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (saveresponse) {
                            try {
                                //this needs to clear the sendRequest data cache for the retrieveGLIUrl...
                                //this needs to do some stuff to make isdirty false...
                                that.SaveSurveyInfosCompleteHandler();
                            }
                            catch (ex) {
                                alert("prweb.surveysinfosvc.SaveSurveyInfos.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.surveysinfosvc.SaveSettings.sendRequest reports error..." + e.toString());
                        }
                    });
                }
                else {
                    alert("prweb.surveysinfosvc.SaveSettings reports shared links url is false.");
                }

            }
            catch (ex) {
                alert("prweb.surveysinfosvc.SaveSettings  reports " + ex.Message);
            }
            return;
        };
        //#endregion


        //#region EditDone and BackCancel ButtonActions and RestoreOriginalValues
        that.EnableButtons = function (newval) {
            var rslt = false;
            try {
                if (newval) {
                    that.Vmx.message("Select your survey info.");
                }
                else {
                    that.Vmx.message("Use the Edit button to change this survey's info.");
                }
                for (var i = 0; i < that.SurveyInfoItemDxnry.length; i++) {
                    if (that.SurveyInfoItemDxnry[i].SectionTitle != "Description") {
                        that.SurveyInfoItemDxnry[i].isenabled(newval);
                    }
                    that.SurveyInfoItemDxnry[i].isremoveenabled(false);
                    var itemscolxn = that.SurveyInfoItemDxnry[i].SurveyInfoItemColxn();
                    for (var j = 0; j < itemscolxn.length; j++) {
                        var surveyinfoentry = itemscolxn[j];
                        surveyinfoentry.isenabled(newval);
                        if (newval == false) {
                            surveyinfoentry.isremoveenabled(false);
                        }
                        surveyinfoentry = null;
                        surveyinfoentry = null;
                    }
                    itemscolxn = null;
                };
            }
            catch (ex) {
                alert("prweb.surveysinfosvcsvc.EnableCheckboxes reports " + ex.Message);
            }
            return rslt;
        };

        that.RestoreOriginalValues = function () {
            var rslt = true;
            try {
                that.Vmx.isdirty(false);
                for (var i = 0; i < that.SurveyInfoItemDxnry.length; i++) {
                    that.SurveyInfoItemDxnry[i].isremoveenabled(false);
                    var sectionname = that.SurveyInfoItemDxnry[i].SectionTitle;
                    var section = Enumerable.From(that.dataToSend.surveyinfopkg.SurveyInfoSectionColxn).Where(function (sec) {
                        return sec.SectionTitle == sectionname
                    }).FirstOrDefault();
                    if (section) {
                        that.SurveyInfoItemDxnry[i].methods.populatesicolxn(JSON.parse(JSON.stringify(section)));
                    }
                };
                that.Vmx.message("Changes have been cancelled and discarded.  Use the Edit button to change this survey's info. ");
            }
            catch (ex) {
                rslt = false;
                alert("prweb.surveysinfosvc.RestoreOriginalValues reports " + ex.Message);
            }
            return rslt;
        };

        that.BackCancelButtonAction = function () {
            try {
                if (that.Vmx.isdirty()) {
                    that.Vmx.isedit = false;
                    that.EnableButtons(false);
                    that.RestoreOriginalValues();
                }
                else {
                    //this should navigate to  appcntxtsettingsview...
                    prweb.appsvc.PopulateSurveyModelContext(false);
                }
            }
            catch (ex) {
                alert("prweb.surveysinfosvc.BackCancelButtonAction reports " + ex.Message);
            }
            return;
        };

        that.EditDoneButtonAction = function () {
            try {
                if (that.Vmx.isdirty()) {
                    that.EnableButtons(false);
                    that.SaveSurveyInfos();
                }
                else {
                    //do the edit action...enable add remove and itemedit click...
                    var isedit = that.Vmx.isedit;
                    that.EnableButtons(!isedit);
                    that.Vmx.isedit = !isedit;
                    isedit = null;
                }
            }
            catch (ex) {
                alert("prweb.surveysinfosvc.EditDoneButtonAction reports " + ex.Message);
            }
            return;
        };
        //#endregion


        //#region PopulateCustomBindings - all the databound buttons event handlers are here...
        //attches jquery event handlers...uses this custom binding to identify when binding elements are attached to the dom....
        that.xevent = false;
        that.PopulateCustomBindings = function () {
            if (ko.bindingHandlers.surveyinfosvcxevent == undefined) {
                ko.bindingHandlers.surveyinfosvcxevent = {
                    init: function (element, valueAccessor) {
                        var $eelem = $(element);
                        switch (true) {
                            case ($eelem.hasClass("surveyinfoitemeditbtn")):
                                $eelem.on(that.xevent, function (e) {
                                    try {
                                        e.preventDefault();
                                        e.cancelBubble = true;
                                        prweb.showClick(this);
                                        ko.dataFor(this).methods.edit();
                                        $("#surveysinfohomeroot").toggle();
                                    }
                                    catch (ex) {
                                        alert("prweb.surveysinfosvc.surveyinfoitemeditbtn.clickhandelr reports " + ex.Message);
                                    }
                                    return false;
                                });
                                break;
                            case ($eelem.hasClass("surveyinfoitemwrapper")):
                                $eelem.on(that.xevent, function (e) {
                                    e.preventDefault();
                                    e.cancelBubble = true;
                                    var kocontext = ko.contextFor(this);
                                    var iscol = kocontext.$data.iscollapsed();
                                    switch (true) {
                                        case (iscol):
                                            //                                            kocontext.$parent.methods.collapseany();
                                            prweb.showClick(this);
                                            kocontext.$data.iscollapsed(false);
                                            var exid = kocontext.$data.id;
                                            var themethod = kocontext.$parent.methods.collapseany;
                                            setTimeout(function () {
                                                themethod(exid);
                                                exid = null;
                                                themethod = null;
                                            }, 600);
                                            break;
                                        case (!iscol):
                                            prweb.showClick(this);
                                            kocontext.$data.iscollapsed(true);
                                            break;
                                    }
                                    iscol = null;
                                    kocontext = null;
                                    prweb.scrollTo($(this));
                                    return false;
                                });
                                break;
                            case ($eelem.hasClass("surveysinfosectionheader")):
                                $eelem.on(that.xevent, function (e) {
                                    e.preventDefault();
                                    e.cancelBubble = true;
                                    prweb.showClick(this);
                                    var kodata = ko.dataFor(this);
                                    var iscol = kodata.iscollapsed();
                                    switch (true) {
                                        case (iscol):
                                            that.CollapseAny();
                                            kodata.iscollapsed(false);
                                            break;
                                        case (!iscol):
                                            kodata.iscollapsed(true);
                                            break;
                                    }
                                    iscol = null;
                                    kodata = null;
                                    prweb.scrollTo($(this));
                                    return false;
                                });
                                break;
                            case ($eelem.hasClass("addsurveyinfobtn")):
                                $eelem.on(that.xevent, function (e) {
                                    try {
                                        e.preventDefault();
                                        e.cancelBubble = true;
                                        prweb.showClick(this);
                                        var kodata = ko.dataFor(this);
                                        kodata.methods.collapseany();
                                        $("#surveysinfohomeroot").toggle();

                                        kodata.isremoveenabled(false);
                                        kodata.methods.disableremove();
                                        var dsi = JSON.parse(JSON.stringify(kodata.DefaultSurveyInfoItem));
                                        prweb.notecommentsvc.NoteCommentSource = that.NewSurveyInfoEntry(kodata.SectionTitle, dsi, true);
                                        kodata = null;
                                        dsi = null;
                                        $("#notecommenthomeroot").toggle().notecomment({
                                            onbacktoggle: "#surveysinfohomeroot",
                                            isnew: true
                                        });
                                    }
                                    catch (ex) {
                                        alert("prweb.surveysinfoview.addsurveyinfobtn.clickhandelr reports " + ex.Message);
                                    }
                                    return false;
                                });
                                break;
                            case ($eelem.hasClass("removesurveyinfobtn")):
                                $eelem.on(that.xevent, function (e) {
                                    try {
                                        e.preventDefault();
                                        e.cancelBubble = true;
                                        prweb.showClick(this);
                                        var kodata = ko.dataFor(this);
                                        var isremoveenabled = kodata.isremoveenabled();
                                        switch (true) {
                                            case (isremoveenabled):
                                                kodata.methods.disableremove();
                                                break;
                                            case (!isremoveenabled):
                                                kodata.methods.enableremove();
                                                break;
                                        };
                                        isremoveenabled = null;
                                        kodata = null;
                                    }
                                    catch (ex) {
                                        alert("prweb.surveysinfoview.addsurveyinfobtn.clickhandelr reports " + ex.Message);
                                    }
                                    return false;
                                });
                                break;
                            case ($eelem.hasClass("surveyinfoitemremovebtn")):
                                $eelem.on(that.xevent, function (e) {
                                    try {
                                        e.preventDefault();
                                        e.cancelBubble = true;
                                        prweb.showClick(this);
                                        var kocontext = ko.contextFor(this);
                                        kocontext.$data.methods.remove(kocontext);
                                        kocontext = null;
                                    }
                                    catch (ex) {
                                        alert("prweb.surveysinfoview.surveyinfoitemremovebtn.clickhandelr reports " + ex.Message);
                                    }
                                    return false;
                                });
                                break;
                        };
                        return;
                    },
                    update: function (element, valueAccessor) {
                        var rslt = 2;
                        return;
                    }
                };
            }
            return;
        };
        //#endregion

        //#region DisposeSurveyInfoItemDxnry and Shutdown
        that.DisposeSurveyInfoItemDxnry = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SurveyInfoItemDxnry.length; i++) {
                    var itemscolxn = that.SurveyInfoItemDxnry[i].SurveyInfoItemColxn();
                    for (var j = 0; j < itemscolxn.length; j++) {
                        itemscolxn[j].methods.dispose();
                        itemscolxn[j] = null;
                    }
                    itemscolxn = null;
                    that.SurveyInfoItemDxnry[i].SurveyInfoItemColxn = null;
                    that.SurveyInfoItemDxnry[i] = null;
                };
                that.SurveyInfoItemDxnry = null;
            }
            catch (ex) {
                alert("prweb.surveysinfosvc.DisposeSurveyInfoItemDxnry reports " + ex.Message);
            }
            return rslt;
        };

        that.Shutdown = function () {
            that.DisposeVmx();
            that.DisposeSurveyInfoItemDxnry();
        };
        //#endregion

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
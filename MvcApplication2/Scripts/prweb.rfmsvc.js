/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.rfmsvc = (function () {
        var jnkthing = [],
            that = {};

        that.GroupNameandSize = "";
        that.GroupsSlideoutViewUrl = false;

        //#region ClearResultsDataCache
        that.ClearResultsDataCache = function () {
            try {
                if (that.grpRsltsUrl) {
                    prweb.dataManager.resetData(that.grpRsltsUrl);
                }
                else {
                    alert("prweb.rfmsvc.ClearResultsDataCache say grpRsltsUrl is empty or false.");
                }
            }
            catch (ex) {
                alert("prweb.rfmsvc.ClearResultsDataCache reports " + ex.Message);
            }

        };
        //#endregion

        //#region ClearRPSODataForThisRFM and CurrentRPSOData
        that.CurrentRPSOData = false;
        that.ClearRPSODataForThisRFM = function () {
            try {
                if (that.rsltsGrpRFM) {
                    if (that.CurrentRPSOData) {
                        if (that.CurrentRPSOData.RFMGuid == that.rsltsGrpRFM.Guid()) {
                            that.CurrentRPSOData = false;
                        }
                    }
                }
            }
            catch (ex) {
                alert("prweb.rfmsvc.ClearRPSODataForThisRFM reports " + ex.Message);
            }
        };
        //#endregion

        //#region PopulateGroupHeaderInfo
        that.PopulateGroupHeaderInfo = function () {
            var rslt = "";
            try {
                if (that.rsltsGrpRFM) {
                    var sizetxt = "";
                    var grpname = that.rsltsGrpRFM.Name();
                    if (that.CurrentRPSOData) {
                        if (that.CurrentRPSOData.RFMGuid == that.rsltsGrpRFM.Guid()) {
                            var gouprdentcnt = that.CurrentRPSOData.RPSO.AllSurveyRDENTSCount;
                            // this does a change on a property ....uses one row from viewmodel.list...
                            that.rsltsGrpRFM.RDentCount(gouprdentcnt);
                            var grppctincluded = "0.0%";
                            if (prweb.actionContext.currentrsltsallrdentscount > 0) {
                                var mypct = (gouprdentcnt / prweb.actionContext.currentrsltsallrdentscount) * 100;
                                grppctincluded = ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                            }
                            sizetxt = (" Size: " + grppctincluded + "  (" + gouprdentcnt + ")");
                            that.rsltsGrpRFM.MessageOnGroupIcon(" Size: " + grppctincluded + "  (" + gouprdentcnt + ")");
                            //                            that.viewModelx().rfelemlist.MessageOnGroupIcon(" Size: " + grppctincluded + "  (" + gouprdentcnt + ")");
                        }
                    }

                    $("#surveycurrentgrplabel").css("background", "hsla(36, 100%, 50%, 1)").html(grpname + sizetxt);
                    rslt = grpname + sizetxt;
                }
                else {
                    //                    alert("prweb.rfmsvc.PopulateGroupHeaderInfo says that.resultsGrpRFM is false..");
                    if (that.CurrentRPSOData) {
                        var gouprdentcnt = that.CurrentRPSOData.RPSO.AllSurveyRDENTSCount;
                        var grppctincluded = "0.0%";
                        if (prweb.actionContext.currentrsltsallrdentscount > 0) {
                            var mypct = (gouprdentcnt / prweb.actionContext.currentrsltsallrdentscount) * 100;
                            grppctincluded = ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                        }
                        sizetxt = (" Size: " + grppctincluded + "  (" + gouprdentcnt + ")");
                        var grpname = "All Respondents";
                        $("#surveycurrentgrplabel").css("background", "hsla(179, 100%, 50%, 0.2)").html(grpname + sizetxt);
                        rslt = grpname + sizetxt;
                    }
                }
                that.GroupNameandSize = rslt;
            }
            catch (ex) {
                alert("prweb.rfmsvc.PopulateGroupHeaderInfo " + ex.Message);
            }
            return rslt;
        };
        //#endregion


        that.IsVmxrsltsGrpRFM = function () {
            var rslt = false;
            var tr = that.viewModelx() || false;
            if (tr) {
                if (tr.hasOwnProperty("rfelemlist")) {
                    var rel = tr.rfelemlist;
                    var vmguid = rel.Guid();
                    var rfmguid = that.rsltsGrpRFM.Guid();
                    if (vmguid == rfmguid) {
                        rslt = true;
                    };
                }
            }
            return rslt;
        };

        //#region ShowPieCharts
        that.ShowPieCharts = function () {
            try {
                var kodata = false;
                var callpcvmodesvc = true;
                var activersltsbtn = false;
                if (that.rsltsGrpRFM) {
                    prweb.actionContext.currentrsltsurl = that.grpRsltsUrl;
                    callpcvmodesvc = false; //pcvmodesvc will be call by retrieveResultsForGroup.success handler...
                    var isdirty = false; //that.evaluateIsRFMDirty();
                    var rsltssource = false;
                    if (that.IsVmxrsltsGrpRFM()) {
                        isdirty = that.evaluateIsRFMDirty();
                    }
                    if (isdirty) {
                        that.rsltsGrpRFM.IsRFMDirty(true);
                        rsltssource = that.rfgoListFromTemporary();
                    }
                    else {
                        rsltssource = ko.toJS(that.rsltsGrpRFM.RFGOList());
                    }
                    var isadequate = that.rsltsGrpRFM.IsShowRsltsBtn(); //false;
                    if (that.IsVmxrsltsGrpRFM()) {
                        isadequate = that.IsRFMAdequatelyDefined();
                    }
                    if (!that.rsltsGrpRFM.IsShowRsltsBtn()) {
                        var msgtxt = "Use Edit to define this group.";
                        that.rsltsGrpRFM.MessageOnGroupIcon(msgtxt);
                        callpcvmodesvc = true; //make sure it shows piecharts...also need to turn off all of the resultsbtns on grouplist..
                        var activersltsbtnx = $(".activeresults", "#rsltsgrplistrfgolistview");
                        if (activersltsbtnx.length == 1) {
                            activersltsbtnx.css("background", "hsl(290, 100%, 21%)").removeClass("activeresults");
                        }
                    }
                    if (isadequate) {
                        that.retrieveResultsForGroup(rsltssource);
                    }
                }
                else {
                    var firstrsltsbtn = $(".activategroupbtn", "#rsltsgrplistrfgolistview").eq(0);
                    if (firstrsltsbtn.length == 1) {
                        kodata = ko.dataFor(firstrsltsbtn[0]);
                        if (kodata) {
                            that.rsltsGrpRFM = kodata;
                            that.grpRsltsUrl = that.rsltsGrpRFM.GroupResultsURL();
                            prweb.actionContext.currentrsltsurl = that.grpRsltsUrl;
                            var xrsltssource = ko.toJS(that.rsltsGrpRFM.RFGOList());
                            that.retrieveResultsForGroup(xrsltssource);
                            firstrsltsbtn.css("background", "#ff9900").addClass("activeresults");
                        }
                    }
                }
                if (callpcvmodesvc) {
                    that.PopulateGroupHeaderInfo();
                    prweb.actionContext.current = "Results";
                    prweb.pcvmodesvc.ModeTo("computepaths");
                }
                activersltsbtn = null;
                kodata = null;
            }
            catch (ex) {
                alert("rfmsvc.ShowPieCharts reports " + ex.Message);
            }
        };
        //#endregion

        that.RemoveGrpListBtnAction = function (rfmparam) {
            try {
                var paramguid = rfmparam.Guid();
                var rfmguid = that.rsltsGrpRFM.Guid() || false;
                if (paramguid == rfmguid) {
                    that.rsltsGrpRFM = false;
                    that.currentrfm = false;
                    that.CurrentRPSOData = false;
                    that.grpRsltsUrl = false;
                    prweb.actionContext.currentrsltsurl = false;
                    that.currentrdentset = false;
                    $(".activeresults", "#rsltsgrplistrfgolistview").removeClass("activeresults");
                    that.ShowPieCharts();
                    that.PopulateGroupHeaderInfo();
                }
            }
            catch (ex) {
                alert("prweb.rfmsvc.RemoveGrpListBtnAction reports " + ex.Message);
            }
        };

        that.SaveChangesGrpListBtnAction = function () {
            try {
                var paramguid = rfmparam.Guid();
                var rfmguid = that.rsltsGrpRFM.Guid() || false;
                if (paramguid !== rfmguid) {
                    that.currentrfm = rfmparam;
                    that.rsltsGrpRFM = rfmparam;
                    if (that.rsltsGrpRFM) {
                        if (that.CurrentRPSOData) {
                            if (that.CurrentRPSOData.RFMGuid != that.rsltsGrpRFM.Guid()) {
                                that.CurrentRPSOData = false;
                            }
                        }
                    }
                    that.grpRsltsUrl = that.rsltsGrpRFM.GroupResultsURL();
                    prweb.actionContext.currentrsltsurl = that.grpRsltsUrl;
                    that.currentrdentset = rfmparam.RDentSetsList()[0];
                    that.populateVmx(rfmparam);
                }
                that.saveRFM(rfmparam.rfelemlist);
                var tvo = setTimeout(that.ShowPieCharts, 800);
            }
            catch (ex) {
                alert("prweb.rfmsvc.SaveChangesGrpListBtnAction reports " + ex.Message);
            }

        };

        that.CancelChangesGrpListBtnAction = function (rfmparam) {
            try {
                var paramguid = rfmparam.Guid();
                var rfmguid = that.rsltsGrpRFM.Guid() || false;
                if (paramguid !== rfmguid) {
                    that.currentrfm = rfmparam;
                    that.rsltsGrpRFM = rfmparam;
                    if (that.rsltsGrpRFM) {
                        if (that.CurrentRPSOData) {
                            if (that.CurrentRPSOData.RFMGuid != that.rsltsGrpRFM.Guid()) {
                                that.CurrentRPSOData = false;
                            }
                        }
                    }
                    that.grpRsltsUrl = that.rsltsGrpRFM.GroupResultsURL();
                    prweb.actionContext.currentrsltsurl = that.grpRsltsUrl;
                    that.currentrdentset = rfmparam.RDentSetsList()[0];
                    that.populateVmx(rfmparam);
                }
                that.CancelChangesGrpDefnBtnAction(rfmparam);
                var tvo = setTimeout(that.ShowPieCharts, 800);
            }
            catch (ex) {
                alert("prweb.rfmsvc.CancelChangesGrpListBtnAction reports " + ex.Message);
            }
        };

        that.CancelChangesGrpDefnBtnAction = function (rfmparam) {
            that.ClearResultsDataCache();
            that.ClearRPSODataForThisRFM();
            var rslt = that.cancelChangesRFM(rfmparam);
            var msgtxt = "";
            msgtxt = "Changes discarded.";
            that.rsltsGrpRFM.RDentCount(0);
            that.rsltsGrpRFM.MessageOnGroupIcon(msgtxt);
            that.rsltsGrpRFM.IsRFMDirty(false);
            return rslt;
        };

        that.GroupResultsBtnSelectedAction = function (rfmparam) {
            var isadequate = false;
            try {
                that.rsltsGrpRFM = rfmparam;
                that.grpRsltsUrl = that.rsltsGrpRFM.GroupResultsURL();
                prweb.actionContext.currentrsltsurl = that.grpRsltsUrl;
                var isdirty = that.rsltsGrpRFM.IsRFMDirty();
                var rsltssource = ko.toJS(that.rsltsGrpRFM.RFGOList());
                if (isdirty) {
                    rsltssource = that.rfgoListFromTemporary();
                }
                that.retrieveResultsForGroup(rsltssource);
            }
            catch (ex) {
                alert("prweb.rfmsvc.GroupResultsBtnSelectedAction reports " + ex.Message);
            }
            return;
        };

        that.GroupEditBtnAction = function (rfmparam) {
            try {
                that.currentrfm = rfmparam;
                that.rsltsGrpRFM = rfmparam;
                if (that.rsltsGrpRFM) {
                    if (that.CurrentRPSOData) {
                        if (that.CurrentRPSOData.RFMGuid != that.rsltsGrpRFM.Guid()) {
                            that.CurrentRPSOData = false;
                        }
                    }
                }
                that.grpRsltsUrl = that.rsltsGrpRFM.GroupResultsURL();
                prweb.actionContext.currentrsltsurl = that.grpRsltsUrl;
                that.currentrdentset = rfmparam.RDentSetsList()[0];
                prweb.pubsub.publish(prweb.events.subscriberplatform.grpdefnselected, that.rsltsGrpRFM);
            }
            catch (ex) {
                alert("prweb.rfmsvc.GroupEditBtnAction reports " + ex.Message);
            }
            return;
        };

        that.BackToGroupsAction = function () {
            var callpcvmodesvc = true;
            var isadequate = false;
            try {
                isadequate = that.IsRFMAdequatelyDefined();
                var isdirty = that.evaluateIsRFMDirty();
                var msgtxt = "";
                if (isdirty || !isadequate) {
                    that.ClearResultsDataCache();
                    if (isdirty) {
                        that.rsltsGrpRFM.IsRFMDirty(true);
                        msgtxt = "Use Results to view this group's statistics.";
                    }
                    if (!isadequate) {
                        msgtxt = "Use Edit to define this group.";
                    }
                    var grpname = that.rsltsGrpRFM.Name();
                    that.rsltsGrpRFM.RDentCount(0);
                    that.rsltsGrpRFM.MessageOnGroupIcon(msgtxt);
                    $("#surveycurrentgrplabel").css("background", "hsla(36, 100%, 50%, 1)").html(grpname + " " + msgtxt);
                    that.ClearRPSODataForThisRFM();
                }
                that.rsltsGrpRFM.IsRFMDirty(isdirty);
                //                if (callpcvmodesvc) {
                //                    that.PopulateGroupHeaderInfo();
                //                    prweb.actionContext.current = "Results";
                //                    //                    if (prweb.pcvmodesvc.pcvmode !== "computepaths") {
                //                    prweb.pcvmodesvc.ModeTo("computepaths");
                //                    //                    }
                //                }
            }
            catch (ex) {
                alert("prweb.rfmsvc.BackToGroupsAction " + ex.Message);
            }

        };

        that.GrpDefnDoneBtnAction = function () {
            var isadequate = false;
            try {
                isadequate = that.IsRFMAdequatelyDefined();
                var isdirty = that.evaluateIsRFMDirty();
                var msgtxt = "";
                if (isdirty || !isadequate) {
                    that.ClearResultsDataCache();
                    if (isdirty) {
                        that.rsltsGrpRFM.IsRFMDirty(true);
                        msgtxt = "Use Results to view this group's statistics.";
                    }
                    if (!isadequate) {
                        msgtxt = "Use Edit to define this group.";
                    }
                    var grpname = that.rsltsGrpRFM.Name();
                    that.rsltsGrpRFM.RDentCount(0);
                    that.rsltsGrpRFM.MessageOnGroupIcon(msgtxt);
                    $("#surveycurrentgrplabel").css("background", "hsla(36, 100%, 50%, 1)").html(grpname + " " + msgtxt);
                    that.ClearRPSODataForThisRFM();
                }
                that.rsltsGrpRFM.IsRFMDirty(isdirty);
                prweb.pcvmodesvc.GrpSelectorsTo(false);
            }
            catch (ex) {
                alert("prweb.rfmsvc.GrpDefnDoneBtnAction reports " + ex.Message);
            }

            return isadequate;
        };

        //#region Initialize and Dispose Various Views and GroupsSlideoutPanel

        that.DisposeCurrentSurveyResults = function (rsltgrpurllist) {
            try {
                for (var n in rsltgrpurllist) {
                    var url = rsltgrpurllist[n].GroupResultsURL;
                    prweb.dataManager.resetData(url);
                }
                prweb.dataManager.resetData(that.rfmListURL);
                that.rsltsGrpRFM = false;
                that.grpRsltsUrl = false;
                that.CurrentRPSOData = false;
                prweb.actionContext.currentrsltsurl = false;
                that.priorRfgoListFromPreview = false;
            }
            catch (ex) {
                alert("prweb.rfmsvc.DisposeCurrentSurveyResults" + ex.Message);
            }
        };

        that.SurveyViewDispose = function () {
            try {
                var svyw = $('#surveyresultsview').data("surveyview");
                if (svyw) {
                    svyw.dispose();
                }
                $('#surveyresultsview').remove();
                svyw = null;

            }
            catch (ex) {
                alert("prweb.rfmsvc.SurveyViewDispose reports error " + ex.Message);
                ex = null;
            }
        };

        that.GroupsSlideOutPanelDispose = function () {
            try {
                var gspw = $("#groupsslideoutpanel").data("groupsslideoutpanel");
                if (gspw) {
                    gspw.dispose();
                }
                $("#groupsslideoutpanel").remove();
                gspw = null;
            }
            catch (ex) {
                alert("prweb.rfmsvc.GroupsSlideOutPanelDispose reports error " + ex.Message);
                ex = null;
            }
        };

        that.DisposeResultsViews = function () {
            try {
                that.GroupsSlideOutPanelDispose();
                that.SurveyViewDispose();
            }
            catch (ex) {
                alert("prweb.rfmsvc.DisposeResultsViews reports error " + ex.Message);
                ex = null;
            }
        };

        that.InitializeGroupsSlideoutPanel = function () {
            try {
                var myurl = that.GroupsSlideoutViewUrl;
                prweb.dataManager.sendRequest({
                    url: myurl,
                    dataType: 'html',
                    type: 'GET',
                    success: function (viewhtml) {
                        $("#groupsslideoutcontainer").html(viewhtml);
                        $("#groupsslideoutpanel").groupsslideoutpanel();
                    },
                    error: function (ex) {
                        alert("prweb.rfmsvc.InitializeGroupsSlideoutPanel.loadgroupslideoutpanel.sendRequest reports ... " + ex.toString());
                    }
                });
                myurl = null;
            }
            catch (ex) {
                alert("prweb.rfmsvc.InitializeGroupsSlideoutPanel reports ... " + ex.toString());
            }
        };

        that.ManageGroupsSlideoutContainer = function () {
            try {
                var appcontext = prweb.appsvc.CurrentAppContext;
                var lstappcntxt = prweb.appsvc.LastAppContext;
                switch (true) {
                    case (appcontext == "Results"):
                        try {
                            var myurl = that.GroupsSlideoutViewUrl;
                            prweb.dataManager.sendRequest({
                                url: myurl,
                                dataType: 'html',
                                type: 'GET',
                                success: function (viewhtml) {
                                    $("#groupsslideoutcontainer").html(viewhtml);
                                    $("#groupsslideoutpanel").groupsslideoutpanel();
                                },
                                error: function (ex) {
                                    alert("prweb.rfmsvc.ManageGroupsSlideoutContainer.loadgroupslideoutpanel.sendRequest reports ... " + ex.toString());
                                }
                            });
                            myurl = null;
                        }
                        catch (ex) {
                            alert("prweb.rfmsvc.ManageGroupsSlideoutContainer.loadgroupslideoutpanel reports ... " + ex.toString());
                        }
                        break;
                    case (lstappcntxt == "Results"):
                        try {
                            var gspw = $("#groupsslideoutpanel").data("groupsslideoutpanel");
                            if (gspw) {
                                gspw.dispose();
                            }
                            $("#groupsslideoutpanel").remove();
                            gspw = null;
                        }
                        catch (ex) {
                            alert("prweb.rfmsvc.ManageGroupsSlideoutContainer.gspw.dispose reports error " + ex.Message);
                            ex = null;
                        }
                        break;
                }
            }
            catch (ex) {
                alert("prweb.rfmsvc.ManageGroupsSlideoutContainer reports error " + ex.Message);
                ex = null;
            }
        };

        //#endregion

        //populated in subscriberplatform...loadResultsView success handler from all respondents group download. 
        //Is consumed by pagecontentview.populateQoiPathsSDSRespMdlID.  permits grpdefnmarks to be set in the event results not yet downloaded for the group.
        that.DefaultResultsURL = false;

        that.IsPreviewResults = false;

        that.RFMList = null;

        that.pcmidpgnumbersUrl = false;
        that.pcmidpgnumbers = false; // populate in thatretrievePCMIDpgNumbers

        //#region retrievePCMIDpgNumbers
        // called by prweb.resultsgrouplist.retrieveRFGOListModel.success ...
        that.retrievePCMIDpgNumbers = function () {
            try {
                var dbgx = 2;
                alert("somebody called prweb.rfmsvc.retrievePCMIDpgNumbers");
                prweb.dataManager.sendRequest({
                    url: that.pcmidpgnumbersUrl,
                    success: function (pcmdata) {
                        that.pcmidpgnumbers = pcmdata;
                        //                        that.ShowPieCharts();
                    },
                    error: function () {
                        alert('prweb.rfmsvc.retrievePCMIDpgNumbers error...');
                    }
                });
            }
            catch (ex) {
                alert("prweb.rfmsvc.retrievePCMIDpgNumbers reports " + ex.Message);
            }
        };
        //#endregion

        //#region pgNumberPlease

        that.pgNumberplease = function (pcmid) {
            var rslt = false;
            try {
                var pgnumkvp = false;
                if (that.pcmidpgnumbers) {
                    pgnumkvp = Enumerable.From(that.pcmidpgnumbers).Where(function (xpcm) { return xpcm.Key == pcmid }).FirstOrDefault();
                    rslt = pgnumkvp.Valu;
                }
                else {
                    alert("prweb.rfmsvc.pgNumberplease says pcmidpgnumbers is false...");
                }
            }
            catch (ex) {
                alert("prweb.rfmsvc.pgNumberplease says pcmidpgnumbers reports " + ex.Message);
            }
            return rslt;
        };

        //        that.usethis = ko.observable();
        //#endregion

        that.NewRFMPlease = function () {
            var rslt = false;
            return rslt;
        };



        //#region viewModelx and populateVmx

        that.populateVmx = function (vmxdata) {
            try {
                var newvm = {
                    rfelemlist: null,
                    toPgNum: null,
                    usethis: null
                };
                newvm.rfelemlist = vmxdata;
                newvm.toPgNum = ko.computed({
                    read: function () { return },
                    write: function (value) {
                        var xxxxx = value.PCM_ID();
                        value.PgNumber(this.pgNumberplease(xxxxx));
                    },
                    owner: this
                });
                that.CopyofRDentsList = ko.toJS(vmxdata.RDentSetsList());
                that.CopyofRFGOList = ko.toJS(vmxdata.RFGOList());
                that.viewModelx(newvm);
                that.PopulateGroupHeaderInfo();
            }
            catch (ex) {
                alert("prweb.rfmsvc.populateVmx reports " + ex.Message);
            }
        };

        that.viewModelx = ko.observable(); // populated by resultsgroupdefn.js in the applybindings and updatemodel methods...
        //        that.viewModelx = { 
        //            rfelemlist: ko.observable(),
        //            somelse: null
        //            };


        //#endregion

        that.SdsRespIdDxnry = {};
        that.populateSDSRespIdDxnry = function () {
            try {
                for (var n in that.CurrentRPSOData.RsltsDetailsDxnry) {
                    var rows = that.CurrentRPSOData.RsltsDetailsDxnry[n];
                    for (var x in rows) {
                        var dkey = rows[x].RMKey1;
                        that.SdsRespIdDxnry[dkey] = rows[x].SDSRespModelID;
                    }
                }
            }
            catch (ex) {
                alert("prweb.rfmsvc.populateSDSRespIdDxnry reports " + ex.Message);
            }
        };

        // this method is triggered by resultsplayersvc.pageentry.SelectionsChangeHandler
        that.ManageRDentSetOptionsChanged = function (newlist, pcmid) {
            try {
                var toSDSRespID = function (rmkey1) {
                    var rslt = -1;
                    try {
                        rslt = that.SdsRespIdDxnry[rmkey1] || -1;
                    }
                    catch (ex) {
                        alert("prweb.rfmsvc.ManageRDentSetOptionsChanged.toSDSRespID reports " + ex.Message);
                    }
                    return rslt;
                };
                var newsdsrespidlist = Enumerable.From(newlist).Select(function (x) { return toSDSRespID(x); }).ToArray();
                var grpcontext = Enumerable.From(that.currentrdentset.RFElemList()).Where(function (rfe) { return rfe.PCM_ID() == pcmid }).FirstOrDefault();
                if (grpcontext) {
                    if (newlist.length > 0) {
                        grpcontext.SelectedOptionIDList(newsdsrespidlist);
                    }
                    else {
                        if (that.removeEmptyRFEfromCurrentRDentSet(parseInt(pcmid))) {
                            prweb.pubsub.publish(prweb.events.subscriberplatform.rsltsfilteremelementschanged, false);
                        }
                    }
                }
                else {
                    if (newsdsrespidlist.length > 0) {
                        var newrfe = that.addnewrfetocurrentrdentset(pcmid, newsdsrespidlist);
                        prweb.pubsub.publish(prweb.events.subscriberplatform.rsltsfilteremelementschanged, true);
                    }
                }
            }
            catch (ex) {
                alert("prweb.rfmsvc.ManageRDentSetOptionsChanged reports " + ex.Message);
            }
        };

        that.rfmListURL = null; // populated in resultsgrouplist.create method...

        that.saveRfmURL = null; // populated in resultsgrouplist.create method...

        that.grpRsltsUrl = null; // populated in resultsgrouplist.create method...

        that.rsltsGrpRFM = null; // populate in resultsgrouplist.resultsbtnClickHandler...in resultsgrouplist._populateGroupResultsBtns

        that.newrfeobject = null; // populated by resultsgrouplist.js...create method...

        that.newRFGObject = null;

        that.currentrfm = null;

        that.currentrdentset = null;

        that.currentrdentsetnumber = function () {
            var rslt = 0;
            if (that.currentrdentset) {
                rslt = that.currentrdentset.SetID();
            }
            return rslt;
        };

        that.PopulateCurrentRDentSetHelpMessage = function (msgtxt) {
            try {
                if (that.currentrdentset) {
                    that.currentrdentset.HelpMessage(msgtxt);
                }
            }
            catch (ex) {
                alert("prweb.rfmsvc.PopulateCurrentRDentSetHelpMessage reports " + ex.Message);
            }

        };


        //#region CopyRDentsList and RestoreRDentslist

        that.CopyofRDentsList = false; //this is populate by populateVmx...takes the JS

        that.CopyRDentsList = function () {

        };

        that.RestoreRDentsList = function (rfmparam) {
            try {
                var currentrdsl = rfmparam.RDentSetsList();
                var copyrdsl = ko.mapping.fromJS(that.CopyofRDentsList);
                var obsrdsl = copyrdsl();
                rfmparam.RDentSetsList(obsrdsl);
            }
            catch (ex) {
                alert("prweb.rfmsvc.RestoreRDentsList reports " + ex.Message);
            }

        };

        //#endregion

        //#region CopyRFGOList RestoreRFGOList

        that.CopyofRFGOList = false;

        that.RestoreRFGOList = function (rfmparam) {
            try {
                var currentrfgol = rfmparam.RFGOList();
                var copyrfgol = ko.mapping.fromJS(that.CopyofRFGOList);
                var obsrfgol = copyrfgol();
                rfmparam.RFGOList(obsrfgol);
            }
            catch (ex) {
                alert("prweb.rfmsvc.RestoreRDentsList reports " + ex.Message);
            }
        };

        //#endregion


        //#region RDentSet Add Remove Empty also RFEOperation addnew, newrfeplease, removeEmptyRFE
        that.EmptyRDentSetsList = function () {
            var tv = that.viewModelx();
            var tr = tv.rfelemlist;
            tr.RDentSetsList([]);
        };

        that.AddRDentSetToViewModelx = function (rs) {
            try {
                var tv = that.viewModelx();
                var tr = tv.rfelemlist;
                var rsl = tr.RDentSetsList();
                var cnt = rsl.length;
                rs.SetID(cnt);
                rsl.push(rs);


                tr.RDentSetsList.valueHasMutated();
                var seeitagain = tr.RDentSetsList();
                //                rsl.valueHasMutated();
                var dbgx = 2;
            }
            catch (ex) {
                alert("prweb.rfmsvc.AddRDentSetToViewModelx reports " + ex.Message);
            }
        };

        that.AddNewRDentSet = function () {
            try {
                var rs = {
                    SetID: ko.observable(),
                    RFElemList: ko.observableArray(),
                    IsModified: ko.observable(false),
                    IsAddedNew: ko.observable(true),
                    IsDeleted: ko.observable(false),
                    HelpMessage: ko.observable("Use the Edit button to select respondents. See the help section below for more."),
                    SetName: ko.observable()
                }
                that.AddRDentSetToViewModelx(rs);
            }
            catch (ex) {
                alert("prweb.rfmsvc.AddNewRDentSet reports " + ex.Message);
            }
        };

        that.RemoveRDentSet = function () {

        };

        that.removeEmptyRFEfromCurrentRDentSet = function (pcmid) {
            var rslt = false;
            if (that.currentrdentset) {
                var targetrfe = Enumerable.From(that.currentrdentset.RFElemList()).Where(function (x) { return x.PCM_ID() == pcmid }).FirstOrDefault();
                if (targetrfe) {
                    that.currentrdentset.RFElemList.remove(targetrfe);
                }
                rslt = true;
            }
            return rslt;
        };

        that.addnewrfetocurrentrdentset = function (pcmid, optionlist) {
            if (that.currentrdentset) {
                var myrfe = that.newrfeobject;
                //need to figure out what sequenceNumber should be....
                myrfe.PCM_ID = parseInt(pcmid);
                myrfe.IsDirty = true;
                myrfe.IsPlaceholder = false;
                myrfe.SelectedOptionIDList = optionlist;
                //                myrfe.SelectedOptionIDList.push(optionid);
                var jmyrfe = JSON.parse(JSON.stringify(myrfe))

                var xxrfe = ko.mapping.fromJS(jmyrfe); // this creates an observable from jmrfe...needs to be one so the bindings on the new rfe work...
                //                var testRDentSetsList = ko.mapping.toJS(this.viewModelx().rfelemlist).RDentSetsList;
                //                var testCRDSBefore = ko.mapping.toJS(this.currentrdentset.RFElemList);
                var rslt = that.currentrdentset.RFElemList.push(xxrfe); //.mappedCreate(xxrfe);
                //                var testCRDSAfter = ko.mapping.toJS(this.currentrdentset.RFElemList);
                //                var obsCRDSAfter = this.currentrdentset.RFElemList();
                myrfe = null;
                jmyrfe = null;
                return xxrfe; //rslt;
            }
        };

        that.newrfeplease = function () {
            return that.newrfeobject;
        };

        //#endregion

        //#region cancelChangesRFM
        that.cancelChangesRFM = function (rfmparam) {
            //alternatively, how about just retrieve the resultsFilterModel from the server...replace the RFM.RDentSetsList...
            var rslt = true;
            try {

                if (rfmparam.IsAddedNew()) {
                    //empty the rdentsetslist to one only with empty .rfeelemlist
                    that.EmptyRDentSetsList();
                    that.AddNewRDentSet();
                    that.viewModelx().rfelemlist.IsRFMDirty(false);
                    //                    that.rsltsGrpRFM.IsRFMDirty(false);
                    //                    var dbgx = 2;
                    //restore the rfgo and rdentset lists...rfgo 
                    //                    that.RestoreRDentsList(rfmparam);
                    //                    that.RestoreRFGOList(rfmparam);
                }
                else {
                    that.DiscardChangesReplaceFromCache(rfmparam);
                    // then set the priorPreview from the RDentSetList as modified...so IsDirty/IsPreviewDirty return false....
                    if (rslt) {
                        this.populatePriorPreviewList();
                    }
                    else {
                        alert('could not Cancel...sorry');
                    }
                }

                return rslt;
            }
            catch (ex) {
                alert("prweb.rfmsvc.cancelChangesRfm reports " + ex.Message);
            }
        };

        //#endregion


        //#region rfgolistFromPreview
        that.toOptionList = function (someobj) {
            var xso = someobj.SelectedOptionIDList;
            return xso;
        };
        //this uses RDentsSetList...creates a flat array of optionIDs.
        that.rfgoListFromPreview = function () {
            var rslt = false;
            try {
                var toOptList = that.toOptionList;
                //  rdentSetsList are modified in pagecontentview.js...when qoims are checked/unchecked...databinding records the changes in RDentSetsList...
                //            var testRDentSetsList = ko.mapping.toJS(this.viewModelx().rfelemlist).RDentSetsList;
                var tr = that.viewModelx() || false;
                if (tr) {
                    if (tr.hasOwnProperty("rfelemlist")) {
                        var rel = tr.rfelemlist;
                        var vmguid = rel.Guid();
                        var rfmguid = that.rsltsGrpRFM.Guid();
                        if (vmguid == rfmguid) {
                            var xa = Enumerable.From(ko.mapping.toJS(rel).RDentSetsList).Select(function (rs) { return rs.RFElemList });
                            //            var testxa = xa.ToArray();
                            rslt = Enumerable.From(xa).Select(function (item) { return Enumerable.From(item).Select(function (idn) { return toOptList(idn); }).Flatten().ToArray() }).ToArray();
                            xa = null;
                        }
                        //                        else {
                        //                            alert("prweb.rfmsvc.rfgoListFromPreview says vmx and rsltGrpRFM aren't equal.");
                        //                        }
                        toOptList = null;
                    }
                }
            }
            catch (ex) {
                alert("prweb.rfmsvc.rfgoListFromPreview reports " + ex.Message);
            }

            return rslt;
        };

        //#endregion

        //#region rfgoListFromTemporary

        //this uses RDentsSetList...creates a list of RFGO js objects...
        that.rfgoListFromTemporary = function () {
            // creates a list of RFGO items...from the RDentsSetList...
            var rslt = [];
            try {
                var rfgotemp = that.rfgoListFromPreview(); //this uses RDentsSetList...
                if (rfgotemp) {
                    var myrfgo = that.newRFGObject;
                    var pushoptionlistitems = function (xtemprow) {
                        var jmyrfgo = JSON.parse(JSON.stringify(myrfgo))
                        jmyrfgo.OptionIDList = xtemprow; //.push(xtemprow);
                        rslt.push(jmyrfgo);
                    };
                    Enumerable.From(rfgotemp).ForEach(function (temprow) {
                        return pushoptionlistitems(temprow)
                    });
                }
                var xxdebug = 2;
            }
            catch (ex) {
                alert("prweb.rfmsvc.rfgoListFromTemporary reports " + ex.Message);
            }

            return rslt;
        };

        //#endregion

        //#region populatePriorPreviewList
        that.priorRfgoListFromPreview = false;
        that.populatePriorPreviewList = function () {
            try {
                var rfgotemp = that.rfgoListFromTemporary();
                that.priorRfgoListFromPreview = rfgotemp;
            }
            catch (ex) {
                alert("prweb.rfmsvc.populatePriorPreviewList reports " + ex.Message);
            }

        };

        //#endregion

        //#region IsAdequatelyDefined and ShowRsltsBtn

        that.PopulateIsShowRsltsBtn = function (rslt) {
            try {
                var tr = false;
                var tv = that.viewModelx();
                if (tv) {
                    tr = tv.rfelemlist || false;
                    if (tr) {
                        tr.IsShowRsltsBtn(rslt);
                    }
                }
            }
            catch (ex) {
                alert("prweb.rfmsvc.PopulateIsShowRsltsBtn reports " + ex.Message);
            }

        };

        that.IsRFMAdequatelyDefined = function () {
            var rslt = false;
            try {
                var prev = that.rfgoListFromPreview();
                if (prev.length > 0) {
                    if (prev[0].length > 0) {
                        rslt = true;
                    }
                }
                that.PopulateIsShowRsltsBtn(rslt);
            }
            catch (ex) {
                alert("prweb.rfmsvc.IsRFMAdequatelyDefined reports " + ex.Message);
            }

            return rslt;
        };

        //#endregion

        //#region IsDirty and IsSqnceEqual

        // this is areSetsEqual...do they have only the same members...without respect to their ordinal sequence..
        that._isSqnceEqual = function (tempseqn, origseqn) {
            // sets are equal if intersection(tempseq,origseqn).count = tempsqn.count = origseqn.count...
            var intersectCount = Enumerable.From(tempseqn).Intersect(Enumerable.From(origseqn)).Count();
            var temcount = Enumerable.From(tempseqn).Count();
            var origcount = Enumerable.From(origseqn).Count();
            var rslt = ((temcount == origcount) && (intersectCount == temcount));
            return rslt;
        };


        that.IsDirty = function () {
            var rslt = false;
            try {
                var myequalitycomparer = that._isSqnceEqual;
                if (that.viewModelx().rfelemlist) {
                    var rfgotemp = false,
                    optlsts = false;
                    rfgotemp = that.rfgoListFromPreview(); // this is an array of the temporary rfgoitems.optionIDList...something like this would get saved if RFM is Saved...

                    var rfesx = ko.mapping.toJS(that.viewModelx().rfelemlist.RFGOList());
                    optlsts = Enumerable.From(rfesx).Select(function (r) { return r.OptionIDList }).ToArray(); // this is orginal rfgoitem.optionIDList..
                    if (optlsts.length == 0) {
                        optlsts.push([]); //put in an empty array so that rfgotemp.length and optlsts.length are equal when both are effectively empty...is a shape problem.
                    }
                    // this does equality comparison of rfgotemp.item(n) and optlsts.item(n)...make it a function with two parameters...temp/orig optlist...
                    // OR(logical) the result of the function with the results of all previous function calls...
                    if (rfgotemp && optlsts) {
                        if (rfgotemp.length == optlsts.length) {
                            //there would be some kind of foreach loop here to examine each row in temp vs orig for equality...
                            var temprowsenum = Enumerable.From(rfgotemp);
                            var origrowsenum = Enumerable.From(optlsts);
                            var gimmeignatz = function (xtemprow) {
                                var ndx = temprowsenum.IndexOf(xtemprow);
                                var otherrow = origrowsenum.ElementAt(ndx);
                                if ((otherrow) && (xtemprow.length == otherrow.length)) {
                                    var intequal = myequalitycomparer(xtemprow, otherrow);
                                    rslt = !intequal || rslt;
                                }
                                else {
                                    rslt = true;
                                }
                            };
                            Enumerable.From(rfgotemp).ForEach(function (temprow) {
                                return gimmeignatz(temprow)
                            });
                        }
                        else {
                            rslt = true;
                        }
                        temprowsenum = null;
                        origrowsenum = null;
                    }
                    else if (rfgotemp || optlsts) {
                        rslt = true;
                    }
                    rfesx = null;
                    myequalitycomparer = null;
                    rfgotemp = null;
                    optlsts = null;
                }
            }
            catch (ex) {
                alert("prweb.rfmsvc.IsDirty reports " + ex.Message);
            }

            return rslt;
        };


        //#endregion

        //#region evaluteIsRFMDirty

        that.evaluateIsRFMDirty = function () {
            var rslt = false;
            try {
                //                if (that.IsRFMAdequatelyDefined()) {

                //                }
                var tr = false;
                var tv = that.viewModelx();
                if (tv) {
                    tr = tv.rfelemlist || false;
                    if (tr) {
                        var vmguid = tr.Guid();
                        var rfmguid = that.rsltsGrpRFM.Guid();
                        if (vmguid == rfmguid) {
                            rslt = that.IsDirty();
                            tr.IsRFMDirty(rslt);
                        }
                    }
                }
                tr = null;
                tv = null;
            }
            catch (ex) {
                alert("prweb.evaluateIsRFMDirty reports " + ex.Message);
            }

            return rslt
        };

        //#endregion

        //#region isPreviewDirty

        that.isPreviewDirty = function (newrfgotemp) {
            var rslt = false;
            var priorlist = that.priorRfgoListFromPreview;
            var priorlistenum = false;
            var newrfgoenum = false;
            var myequalitycomparer = that._isSqnceEqual;
            var evaluateeachoptionlist = function (priorrow) {
                var ndx = priorlistenum.IndexOf(priorrow);
                var otherrow = newrfgoenum.ElementAt(ndx);
                if ((otherrow.OptionIDList) && (priorrow.OptionIDList.length == otherrow.OptionIDList.length)) {
                    var intequal = myequalitycomparer(priorrow.OptionIDList, otherrow.OptionIDList);
                    if (!intequal) {
                        rslt = true;
                    }
                }
                else {
                    rslt = true;
                }
            };
            if (priorlist) {
                if (newrfgotemp) {
                    if (priorlist.length == newrfgotemp.length) {
                        priorlistenum = Enumerable.From(priorlist);
                        newrfgoenum = Enumerable.From(newrfgotemp);
                        Enumerable.From(priorlist).ForEach(function (priorlistrow) {
                            return evaluateeachoptionlist(priorlistrow)
                        });
                    }
                    else {
                        rslt = true;
                    }
                }
                else {
                    rslt = true;
                }
            }
            else {
                rslt = true;
            }
            return rslt
        };

        //#endregion

        //#region previewResults

        that.previewResults = function () {
            var rfgotemp = that.rfgoListFromTemporary();
            // use what is in the dataManager.Cache unless IsPreviewDirty...true when rfgoListFromTempory <> priorPreviewList....
            var myPreviewIsDirty = that.isPreviewDirty(rfgotemp);
            if (myPreviewIsDirty) {
                prweb.dataManager.resetData(that.grpRsltsUrl);
            }

            that.viewModelx().rfelemlist.IsRFMDirty(that.IsDirty());
            that.retrieveResultsForGroup(rfgotemp);
            var xxdbg = 2;
        };

        //#endregion

        //#region retrieveResultsForGroup
        // Is Called by resultsgrouplist.resultsBtnClickHandler....and also by this.previewResults...
        that.retrieveResultsForGroup = function (rfgoListParam) {
            try {
                if (prweb.appmessagesvc !== undefined) {
                    prweb.appmessagesvc.PopulateViewMessage("retrieveing results...please wait.");
                }
                if (rfgoListParam.length == 0) {
                    rfgoListParam = that.rfgoListFromTemporary();
                }
                that.priorRfgoListFromPreview = rfgoListParam;
                prweb.actionContext.currentrsltsurl = false;
                that.grpRsltsUrl = that.rsltsGrpRFM.GroupResultsURL();
                var rsltsurl = that.grpRsltsUrl;
                var dataToSend = {
                    RFGOList: {}
                };
                dataToSend.RFGOList = rfgoListParam;
                prweb.dataManager.sendRequest({
                    url: rsltsurl,
                    data: JSON.stringify(dataToSend),
                    dataType: 'json',
                    contentType: 'application/json',
                    //                        cache: false,
                    success: function (rpsodata) {
                        try {
                            that.CurrentRPSOData = rpsodata || false;
                            var rfmguid = that.rsltsGrpRFM.Guid();
                            if (that.CurrentRPSOData) {
                                that.CurrentRPSOData.RFMGuid = rfmguid;
                                that.populateSDSRespIdDxnry();
                            }
                            var grptxt = that.PopulateGroupHeaderInfo();
                            prweb.actionContext.current = "Results";
                            prweb.actionContext.currentrsltsurl = rsltsurl;

                            prweb.pcvmodesvc.ModeTo("computepaths");
                            prweb.pubsub.publish(prweb.events.subscriberplatform.grprsltsselected, rfmguid);
                            if (prweb.appmessagesvc !== undefined) {
                                prweb.appmessagesvc.PopulateViewMessage(prweb.rfmsvc.GroupNameandSize + " Page " + prweb.actionContext.currentpgnumber.toString());
                            }
                        }
                        catch (ex) {
                            alert("prweb.rfmsvc.retrieveResultsForGroup.succshandler reports " + ex.Message);
                        }
                        return;
                    },
                    error: function () {
                        //                    dataToSend = null;
                        //                    testxe = null;
                        alert("RFMSVC reports RetrieveResultsForGroup Error ");
                    }
                });
            }
            catch (ex) {
                alert("prweb.rfmsvc.retrieveResultsForGroup reports " + ex.Message);
            }
        };


        //#endregion

        //#region SaveRFM

        that.saveRFM = function (rfmParam) {
            //            var self = this;
            try {
                prweb.dataManager.resetData(that.saveRfmURL);
                var rfgotemp = that.rfgoListFromTemporary();
                var saveurl = that.saveRfmURL;
                var testxe = that.rsltsGrpRFM;
                var testRgrpRFM = ko.mapping.toJS(that.rsltsGrpRFM);
                var textrfmParam = ko.mapping.toJS(rfmParam); // this is JSObj form of RFM...
                //need to figure out what sequenceNumber should be....is zerobased RFEM_List.IndexOf(rfe)....
                var addRFelemToList = function (xrfe) {
                    var seqnum = textrfmParam.RFEM_List.length;
                    xrfe.SequenceNumber = seqnum;
                    textrfmParam.RFEM_List.push(xrfe);
                };
                var replaceRFElemList = function (xrds) {
                    Enumerable.From(xrds.RFElemList).ForEach(function (rfe) { return addRFelemToList(rfe); })
                };
                var updateRFMProperties = function () {
                    textrfmParam.RFEM_List = [];
                    textrfmParam.RFGOList = rfgotemp;
                    Enumerable.From(textrfmParam.RDentSetsList).ForEach(function (rds) { return replaceRFElemList(rds); });
                };
                // this does a changes on a JSObject copy of RFM properties...ultimately stringified and sent to server...
                updateRFMProperties();
                var dataToSend = {
                    RFM: {}
                };
                dataToSend.RFM = textrfmParam;
                var testDtSndStringify = JSON.stringify(dataToSend);
                prweb.dataManager.sendRequest({
                    url: saveurl,
                    data: testDtSndStringify,
                    dataType: 'json',
                    contentType: 'application/json',
                    //                        cache: false,
                    success: function (pocoPkg) {
                        try {
                            var myRFM = rfmParam; // this is the RFM...in observable form....is it the same as rsltsGrpRFM?
                            // this does a changes on RFM properties that are in observable form..
                            var addRFEToList = function (xrfe) {
                                //                        var rfemlist = myRFM.RFEM_List();
                                var seqnum = myRFM.RFEM_List().length;
                                //                        var seqnum = rfemlist.length;
                                xrfe.SequenceNumber(seqnum);
                                myRFM.RFEM_List.push(xrfe);
                                //                        rfemlist.push(xrfe);
                            };
                            var replaceRFEList = function (xrds) {
                                Enumerable.From(xrds.RFElemList()).ForEach(function (rfe) { return addRFEToList(rfe); })
                            };
                            var updateRFMProps = function () {
                                myRFM.RFEM_List([]);
                                var obsrfgotemp = ko.mapping.fromJS(rfgotemp);
                                var toobjrfgo = obsrfgotemp();
                                myRFM.RFGOList(toobjrfgo);
                                Enumerable.From(myRFM.RDentSetsList()).ForEach(function (rds) { return replaceRFEList(rds); });
                            };
                            //                    var testrfebefore = myRFM.RFEM_List();
                            //                    var testrfgobefore = myRFM.RFGOList();
                            updateRFMProps();
                            //                    var testrfgoafter = myRFM.RFGOList();
                            //                    var testrfeafter = myRFM.RFEM_List();
                            myRFM.ID(pocoPkg._DB_ID);
                            myRFM.Guid(pocoPkg._POCOGuid)
                            // need to set IsDirty to false to turn off savecancel buttons...
                            myRFM.IsRFMDirty(false);
                            that.updateDataStoreCache(myRFM);
                            // show some kind of confirmation...
                            alert("Group saved...");
                        }
                        catch (ex) {
                            alert("prweb.rfmsvc.saveRFM.successhandler reports " + ex.Message);
                        }

                    },
                    error: function () {
                        //                    dataToSend = null;
                        //                    testxe = null;
                        alert("RFMSVC reports Save ResultsGroup Error ");
                    }
                });
            }
            catch (ex) {
                alert("prweb.rfmsvc.saveRFM reports " + ex.Message);
            }

        };

        //#endregion

        //#region DiscardChangesReplaceFromCache
        that.updateDataStoreCache = function (myrfmObs) {
            var dbg = 2;
        };

        that.DiscardChangesReplaceFromCache = function (myrfmObs) {
            //            var self = this;
            var rslt = false;
            try {
                var myrfmJso = ko.mapping.toJS(myrfmObs); // this could get put in dataStoreCache...
                //            var newrfmObs = ko.mapping.fromJS(myrfmJso);
                //            this.viewModelx().rfelemlist = newrfmObs;
                var rfmlisturl = that.rfmListURL;
                var vmxrfelist = function (newrfm) {
                    var reduxrfm = Enumerable.From(that.RFMList.rfgoitems()).Where(function (rfm) { return rfm.ID() == myrfmJso.ID }).FirstOrDefault();
                    //                self.RFMList.rfgoitems.replace(reduxrfm, newrfm); NEED TO DO REPLACE HERE...everything is counting on binding to the same object...
                    // just have to redo the click handlers for the buttons in resultsgrouplist.js...add a subscribe...and raise an event...where?
                    reduxrfm.RDentSetsList(newrfm.RDentSetsList());
                    //                reduxrfm.Name(newrfm.Name());
                    //                reduxrfm.IsRFMDirty(newrfm.IsRFMDirty());
                    //                reduxrfm.MessageOnGroupIcon(newrfm.MessageOnGroupIcon());
                    //                prweb.dataManager.resetData(self.grpRsltsUrl);
                    that.priorRfgoListFromPreview = false;
                    //                self.rsltsGrpRFM = newrfm;
                    that.currentrdentset = null;
                    return true;
                };
                var clearcurrentRDentSet = function () {
                    that.currentrdentset = null;
                };
                prweb.dataManager.cachedOnlyRequest({
                    url: rfmlisturl,
                    success: function (data) {
                        var reduxrfm = Enumerable.From(data.rfmlist).Where(function (rfm) { return rfm.ID == myrfmJso.ID }).FirstOrDefault();
                        var newrfmObs = ko.mapping.fromJS(reduxrfm);
                        vmxrfelist(newrfmObs);
                        rslt = true;
                    },
                    error: function (oops) {
                        var xxdbg = 2;
                    }
                });
            }
            catch (ex) {
                alert("prweb.rfmsvc.DiscardChangesReplaceFromCache reports " + ex.Message);
            }

            return rslt;
        };

        //#endregion


        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
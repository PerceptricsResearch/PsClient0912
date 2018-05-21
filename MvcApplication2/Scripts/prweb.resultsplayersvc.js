/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.resultsplayersvc = (function () {
        var rps = {};
        rps.ModeTo = false;
        rps.NewPlayerSvc = function ($element) {
            var that = {};


            that.ResultData = function () {
                var rslt = prweb.dataStore.get(prweb.actionContext.currentrsltsurl) || false;
                if (!rslt) {
                    resultsData = prweb.dataStore.get(prweb.rfmsvc.DefaultResultsURL) || false;
                }
                return rslt;
            };
            that.toPct = function (xpct) {
                return (xpct.toString() + '%');
            };
            that.RoundPct = function (fpct) {
                return (Math.round(fpct * Math.pow(10, 1)) / Math.pow(10, 1));
            };
            that.qoiPathMaker = function (pct) {
                var rad = Math.PI / 180,
                    angleplus = ((360 * (100 - pct) / 100.1)),
                    sangleplus = ((360 * (pct + 25) / 100.1)),
                    endAngle = (90 + angleplus),
                    startAngle = (angleplus + sangleplus),
                    cx = 50,
                    cy = 50,
                    r = 47,
                    isLargArc = 0,
                    x1 = cx + r * Math.cos(-startAngle * rad),
                    x2 = cx + r * Math.cos(-endAngle * rad),
                    y1 = cy + r * Math.sin(-startAngle * rad),
                    y2 = cy + r * Math.sin(-endAngle * rad);

                if ((endAngle - startAngle) < -180.0) {
                    isLargArc = 1;
                }
                return ("M" + " " + cx + " " + cy + " " + "L" + " " + x1 + " " + y1 + " " + "A" + " " + r + " " + r + " " + 0 + " " + isLargArc + " " + 1 + " " + x2 + " " + y2 + " " + "Z");
            };

            that.ComputePathsForPage = function (pagenum) {
                try {
                    var pageentry = that.PageNumberDxnry[pagenum.toString()];
                    if (prweb.rfmsvc.CurrentRPSOData) {
                        var allcount = prweb.rfmsvc.CurrentRPSOData.RPSO.AllSurveyRDENTSCount;
                        if (allcount > 0) {
                            var rows = prweb.rfmsvc.CurrentRPSOData.RsltsDetailsDxnry[pageentry.pcmID];
                            var dxnry = {};
                            for (var x in rows) {
                                var dkey = rows[x].RMKey1;
                                dxnry[dkey] = rows[x];
                            }
                            for (var n in pageentry.QoimColxn) {
                                var rcount = 0;
                                if (dxnry[n]) {
                                    rcount = dxnry[n].RespDentCount;
                                    pageentry.QoimColxn[n].RespONSEModel.ID = dxnry[n].SDSRespModelID;
                                }
                                var mypct = that.RoundPct((rcount / allcount) * 100);
                                pageentry.QoimColxn[n].PctPath(that.qoiPathMaker(mypct));
                                pageentry.QoimColxn[n].PctString(that.toPct(mypct));
                            }
                            rows = null;
                            dxnry = null;
                        }

                    }
                    pageentry = null;
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.ComputePathsForPage reports " + ex.Message);
                }
                return;
            };

            that.ShowGrpDefnMarksForPage = function (pagenum, showmarks) {
                try {
                    var pageentry = that.PageNumberDxnry[pagenum.toString()];
                    //this looks at the rfmsvc.currentrdentset...

                    var mypcmid = pageentry.pcmID;
                    var grpcontext = Enumerable.From(prweb.rfmsvc.currentrdentset.RFElemList()).Where(function (rfe) { return rfe.PCM_ID() == mypcmid }).FirstOrDefault();
                    if (grpcontext) {
                        var sels = grpcontext.SelectedOptionIDList();
                        for (var nx in pageentry.QoimColxn) {
                            var sds = prweb.rfmsvc.SdsRespIdDxnry[nx] || -1;
                            if (sds > -1) {
                                var cx = Enumerable.From(sels).Contains(sds);
                                if (cx) {
                                    pageentry.QoimColxn[nx].SelectedState(true);
                                }
                                else {
                                    pageentry.QoimColxn[nx].SelectedState(false);
                                }
                            }
                            else {
                                pageentry.QoimColxn[nx].SelectedState(false);
                            }
                        };
                    }
                    else {
                        for (var n in pageentry.QoimColxn) {
                            pageentry.QoimColxn[n].SelectedState(false);
                        };
                    }
                    grpcontext = null;
                    pageentry.manageSelectors();
                    pageentry = null
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.ShowGrpDefnMarksForPage reports " + ex.Message);
                }
                return;
            };

            that.ApplyPcvModeForPage = function (pagenum) {
                try {
                    var pageentry = that.PageNumberDxnry[pagenum.toString()];
                    if (prweb.pcvmodesvc.pcvmode) {
                        switch (true) {
                            case prweb.pcvmodesvc.pcvmode == "computepaths":
                                prweb.pcvmodesvc.IsGrpSelectorsOn = false;
                                //                            if (pageentry.currentmode != prweb.pcvmodesvc.pcvmode) {
                                //                                pageentry.manageSelectors();
                                that.ComputePathsForPage(parseInt(pagenum));
                                pageentry.manageSelectors();
                                pageentry.currentmode = prweb.pcvmodesvc.pcvmode;
                                //                            }
                                break;
                            case prweb.pcvmodesvc.pcvmode == "grpdefnmarksfalse":
                                that.ShowGrpDefnMarksForPage(parseInt(pagenum), false);
                                pageentry.currentmode = prweb.pcvmodesvc.pcvmode;
                                break;
                            case prweb.pcvmodesvc.pcvmode == "grpdefnmarkstrue":
                                that.ShowGrpDefnMarksForPage(parseInt(pagenum), true);
                                pageentry.currentmode = prweb.pcvmodesvc.pcvmode;
                                break;
                        };
                    }
                    else {
                        // default configuration for pcv is show a piechart....
                        prweb.pcvmodesvc.pcvmode = "computepaths";
                    }
                    pageentry = null;
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.ApplyPcvModeForPage reports " + ex.Message);
                }
                return;
            };

            that.ModeTo = function (targetmode) {
                that.ApplyPcvModeForPage(that.actionContext.currentpgnumber);
                return;
            };
            that.ModeChangeSubscribe = function () {
                prweb.pubsub.subscribe(prweb.events.subscriberplatform.pcvmodechange, that.ModeTo, that);
            };

            that.ModeChangeUnSubscribe = function () {
                prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.pcvmodechange, that.ModeTo, that);
            };


            //#region Variables and Utility functions
            that.actionContext = {
                currentpgnumber: 0
            };

            that.PriorPageNumber = 0;

            that.PageCount = 3;

            //        that.MyPages = false;

            that.NxtPgUrl = false;

            that.ToNdx = function (pgNumber) {
                var rslt = ((parseInt(pgNumber) - 1) % 3); // 3 could sapiindexdxnry.lengthcount...
                return rslt;
            };

            that.CurrentNdx = function () {
                var pgnum = that.actionContext.currentpgnumber;
                var ndx = that.ToNdx(parseInt(pgnum));
                return ndx;
            };

            //associative dxnry of pcelements of T html...image, qoptset etc
            that.PCElemHtmlDxnry = {};

            // associative dxnry of SapiNdx and PageNumber...
            that.SapiIndexDxnry = {}; //ko.observableArray(); //{ "0": 1, "1": false, "2": false, "3": false, "4": false };

            // asociate dxnry of PageNumber and SapiNdxObject...is populated by the sendRequest:callback that loads html into sapi.prwpageitem...
            // if there is a 
            that.PageNumberDxnry = {}; //ko.observableArray();

            that.Vmx = {
                sdxnry: null,
                currentpgnum: ko.observable(1)
            };
            //#endregion

            //#region PutPageHTMLinSapiItem
            that.DefaultPgObj = function () {
                //this has to be a pcelemcolxn that has to be an observable pcelem with some loading html in its modelcore...bindings expect pcelemcolxn observable
                var rslt = {
                    pcelemcolxn: ko.observableArray(prweb.observablemodelsvc.DefaultPagePCM())
                };
                return rslt;
            };

            that.PutPageHTMLinSapiItem = function (pageumber, sentry) {
                var rslt = false;
                try {
                    //put PageDxnry(pagenumber).pageobj() in sapitem(sndx)
                    //                    var pgobjisloaded = that.PageNumberDxnry[pageumber.toString()].isloaded();
                    //                    if (pgobjisloaded) {
                    sentry.pgobj(that.PageNumberDxnry[pageumber.toString()].pgobj());
                    //                    sentry.pgobj.valueHasMutated();
                    //                    }
                    //                    else {
                    //                        //pgobj is not yet loaded...subscribe to that.PageNumberDxnry[PageNumber].pgobj change...
                    //                        var pgobjsubscription = null;
                    //                        pgobjsubscription = that.PageNumberDxnry[pageumber.toString()].pgobj.subscribe(function (pgcontent) {
                    //                            sentry.pgobj(pgcontent);
                    //                            pgobjsubscription.dispose();
                    //                            pgobjsubscription = null;
                    //                        });
                    //                        sentry.pgobj(that.DefaultPgObj());
                    //                    }
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.PutPageHTMLinSAPiItem reports " + ex.Message);
                }
                return rslt;
            };
            //#endregion

            //is called when ko foreach binding puts a pcelemT on a page...this doesn't actually call a widget, just does css from the model.
            //see InitializeSapiDxnry.sapientry.widgetizeAddedElement
            that.WigdetizeElement = function (elem) {
                try {
                    var mymodel = ko.dataFor(elem);
                    if (mymodel) {
                        var scale = mymodel.modelcore.Scale();
                        var rot = mymodel.modelcore.Rotation();
                        $(elem).css("left", mymodel.modelcore.DI_CanvasLeft() + "%")
                                               .css("top", mymodel.modelcore.DI_CanvasTop() + "%")
                                               .css("width", mymodel.modelcore.DesignerItemWidth() + "%")
                                               .css("height", mymodel.modelcore.DesignerItemHeight() + "%")
                                               .css("z-index", mymodel.modelcore.DI_CanvasZindex());
                        var echild = $(elem).children().eq(0);
                        if (rot != 0 || scale != 1) {
                            var tstring = "translate(0,0)" + " scale(" + scale + ")" + " rotate(" + rot + "deg)";
                            if (prweb.IsTouch) {
                                tstring = "translate3d(0,0,0)" + " scale(" + scale + ")" + " rotate(" + rot + "deg)";
                            }
                            $(elem).css("transform", tstring)
                                .css("-webkit-transform", tstring)
                                .css("-moz-transform", tstring)
                                .css("-o-transform", tstring)
                                .css("msTransform", tstring);
                            tstring = null;
                        }
                        scale = null;
                        rot = null;
                        if (mymodel.modelcore.presenterT == "prwTQuestOptionSet") {
                            $(elem).activequestoptset({ model: mymodel });
                        }
                        else {
                            ko.applyBindings(mymodel, echild[0]);
                            echild = null;
                        }
                        echild = null;
                    }
                    mymodel = null;
                    //                    return;
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.SapiDxnry.widgetizeAddedElement reports " + ex.Message);
                }
                elem = null;
                return true;
            };



            //#region InitializeSapiItemsDxnry
            that.InitializeSapiItemsDxnry = function () {
                var makedxnryrow = function (kvp) {
                    var sapientry = {
                        pgnum: ko.observable(false),
                        //                        pgobj: ko.observableArray(),
                        pgobj: ko.observable({
                            pcelemcolxn: ko.observableArray()
                        }),
                        isvisible: ko.observable(true),
                        widgetizeAddedElement: that.WigdetizeElement,
                        myindex: kvp,
                        makeInactive: null,
                        makeActive: null,
                        onpgnumchange: null,
                        changepgnum: null,
                        scrolltoposition: 0,
                        priorpgnum: false,
                        subscription: null,
                        dispose: null
                    };
                    that.SapiIndexDxnry[kvp] = sapientry;
                    sapientry.makeInactive = function () {
                        sapientry.isvisible(false);
                    };
                    sapientry.makeActive = function () {
                        sapientry.isvisible(true);
                    };
                    sapientry.onpgnumchange = function (newpgnum) {
                        if (newpgnum) {
                            that.PutPageHTMLinSapiItem(parseInt(newpgnum), sapientry);
                        }
                        //                    var dbx = self.pgobj();
                        return true;
                    };
                    sapientry.changepgnum = function (newpgnum) {
                        try {
                            sapientry.makeActive();
                            sapientry.priorpgnum = sapientry.pgnum();
                            sapientry.pgnum(parseInt(newpgnum));
                            return true
                        }
                        catch (ex) {
                            alert("prweb.resultsplayersvc.sapientry.changepgnum reports " + ex.Message);
                        }

                    };
                    sapientry.clear = function () {
                        sapientry.isvisible(false);
                        sapientry.pgnum(false);
                        sapientry.priorpgnum = false;
                        //                        sapientry.pgobj([]);
                        sapientry.pgobj({
                            pcelemcolxn: ko.observableArray()
                        });
                    };
                    sapientry.subscription = sapientry.pgnum.subscribe(sapientry.onpgnumchange);
                    sapientry.dispose = function () {
                        try {
                            sapientry.subscription.dispose(); //ko subscription on pgnum... dispose...
                            sapientry.pgobj().pcelemcolxn([]);
                        }
                        catch (ex) {
                            alert("prweb.resultsplayersvc.sapientry.dispose reports " + ex.Message);
                        }
                        return;
                    };
                    return true
                };
                var rslt = false;
                try {
                    // this gives me a viewmodel with properties named 0, 1, 2,...for each 
                    Enumerable.RangeTo(0, 2).ForEach(function (kvp) { return makedxnryrow(kvp.toString()) });
                    that.Vmx.sdxnry = that.SapiIndexDxnry;
                    rslt = true;
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.InitializeSapiItemsDxnry reports " + ex.Message);
                }
                return rslt;
            };


            //#endregion

            //#region PageDxnry Initialize

            //#region CraftPageURL
            //that.NxtPgUrl needs to already have the base surveyUrl ...
            //is the same base url as surveymodelsvc.PCModelURL
            that.CraftPageUrl = function (pgnum) {
                var rslt = false;
                try {
                    var adjustpgnum = pgnum - 1
                    var npURL = that.NxtPgUrl;
                    if (npURL) {
                        var arrpgn = npURL.split("pgNumber=");
                        var pgn = arrpgn[1];
                        var oldpgparm = "pgNumber=" + pgn;
                        var newpgparm = "pgNumber=" + (adjustpgnum.toString());
                        rslt = npURL.replace(oldpgparm, newpgparm);
                    }
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.CraftPageUrl reports " + ex.Message);
                }

                return rslt;
            };
            //#endregion

            that.InitializePageDxnry = function () {
                var makedxnryrow = function (kvp) {
                    var pageentry = {
                        isloaded: ko.observable(false), //isloaded is true for testing...
                        //                        pgobj: ko.observableArray(),
                        pgobj: ko.observable({
                            pcelemcolxn: ko.observableArray()
                        }),
                        pgnum: kvp,
                        pcmID: 0,
                        tohtml: null,
                        currentmode: false,
                        QoimColxn: false,
                        manageQoimColxn: null,
                        manageSelectors: null,
                        OptListSubscriptions: {},
                        OptListdispose: null,
                        SelectionsChangeHandler: null,
                        retrievePage: null,
                        dispose: null
                    };
                    pageentry.SelectionsChangeHandler = function (newval) {
                        prweb.rfmsvc.ManageRDentSetOptionsChanged(newval, pageentry.pcmID);
                        return;
                    };
                    pageentry.OptListdispose = function () {
                        try {
                            for (var n in pageentry.OptListSubscriptions) {
                                pageentry.OptListSubscriptions[n].dispose();
                                pageentry.OptListSubscriptions[n] = null;
                                delete pageentry.OptListSubscriptions[n];
                            };
                        }
                        catch (ex) {
                            alert("prweb.resultsplayersvc.PageDxnry.pageentry.OptListdispose reports " + ex.Message);
                        }
                        return;
                    };
                    pageentry.manageSelectors = function () {
                        try {
                            var qos = pageentry.pgobj().pcelemcolxn();
                            if (qos) {
                                var pcvmode = prweb.pcvmodesvc.pcvmode;
                                for (var i = 0; i < qos.length; i++) {
                                    if (qos[i].QuestOptSetModel != null) {
                                        switch (true) {
                                            case (pcvmode == "grpdefnmarksfalse"):
                                                {
                                                    qos[i].QuestOptSetModel.ResultsVisible("hidden");
                                                    qos[i].QuestOptSetModel.SelectorsVisible(true);
                                                    pageentry.OptListdispose();
                                                    //                                                    for (var n in pageentry.OptListSubscriptions) {
                                                    //                                                        pageentry.OptListSubscriptions[n].dispose();
                                                    //                                                        pageentry.OptListSubscriptions[n] = null;
                                                    //                                                        delete pageentry.OptListSubscriptions[n];
                                                    //                                                    };
                                                    //testing for the widget...
                                                    var sel = "#" + qos[i].QuestOptSetModel.QosprwtID();
                                                    var $qos = $(sel);
                                                    if ($qos.length < 1) {
                                                        alert("resultsplayer.pageentry.manageSelectors says $qos length < 1");
                                                    }
                                                    else {
                                                        var $qospar = $qos.parent();
                                                        if ($qospar.length < 1) {
                                                            alert("resultsplayer.pageentry.manageSelectors says $qospar length < 1");
                                                        }
                                                        else {
                                                            $qospar.activequestoptset(); //calls init on widget...
                                                            // $("#" + qos[i].QuestOptSetModel.QosprwtID()).parent().activequestoptset();
                                                        }
                                                        $qospar = null;
                                                    }
                                                    $qos = null;
                                                    //                                                        $("#" + qos[i].QuestOptSetModel.QosprwtID()).parent().activequestoptset(); //calls init on widget...
                                                    //init displays qoims.selectedState....on or checked for true...
                                                    break;
                                                }
                                            case (pcvmode == "grpdefnmarkstrue"):
                                                {
                                                    qos[i].QuestOptSetModel.ResultsVisible("hidden");
                                                    qos[i].QuestOptSetModel.SelectorsVisible(true);
                                                    if (!pageentry.OptListSubscriptions[i]) {
                                                        pageentry.OptListSubscriptions[i] = qos[i].QuestOptSetModel.SelectedOptionsList.subscribe(pageentry.SelectionsChangeHandler);
                                                    }
                                                    $("#" + qos[i].QuestOptSetModel.QosprwtID()).parent().activequestoptset(); //calls init on widget...
                                                    //init displays qoims.selectedState....on or checked for true...
                                                    break;
                                                }
                                            case (pcvmode == "computepaths" || !pcvmode):
                                                {
                                                    qos[i].QuestOptSetModel.ResultsVisible("visible");
                                                    qos[i].QuestOptSetModel.SelectorsVisible(false);
                                                    pageentry.OptListdispose();
                                                    //                                                    for (var n in pageentry.OptListSubscriptions) {
                                                    //                                                        pageentry.OptListSubscriptions[n].dispose();
                                                    //                                                        pageentry.OptListSubscriptions[n] = null;
                                                    //                                                        delete pageentry.OptListSubscriptions[n];
                                                    //                                                    };
                                                    break;
                                                }
                                        };
                                    }
                                };
                            }
                        }
                        catch (ex) {
                            alert("prweb.resultsplayersvc.PageDxnry.pageentry.manageSelectors reports " + ex.Message);
                        }
                        return;
                    };
                    pageentry.currentmode = false;
                    pageentry.QoimColxn = false;
                    pageentry.manageQoimColxn = function () {
                        //this will put percentages and path d attrs in the qoim models
                        //depending upon the pcvmodesvc.pcvmode...
                        try {
                            if (pageentry.QoimColxn) {
                                that.ComputePathsForPage(pageentry.pgnum);
                            }
                        }
                        catch (ex) {
                            alert("prweb.resultsplayersvc.PageDxnry.pagentry.manageQoimColxn reports " + ex.Message);
                        }
                        return;
                    };
                    pageentry.tohtml = function (pcecolxn, pcmid) {
                        var rslt = [];
                        try {
                            prweb.observablemodelsvc.GeneratePageQoimColxn = true;
                            prweb.observablemodelsvc.AllQoimsInPCElemColxn = {}; //resets it..is a dxnry by responsemodel.Key1
                            for (var n in pcecolxn) {
                                var presT = pcecolxn[n].modelcore.presenterT;
                                var obspcelem = prweb.observablemodelsvc.PCElemFromJSData(pcecolxn[n], pcmid);
                                obspcelem.modelcore.html(that.PCElemHtmlDxnry[presT]);
                                rslt.push(obspcelem);
                            };
                            pageentry.QoimColxn = prweb.observablemodelsvc.AllQoimsInPCElemColxn;
                            pageentry.manageQoimColxn();
                            prweb.observablemodelsvc.AllQoimsInPCElemColxn = false;
                            prweb.observablemodelsvc.GeneratePageQoimColxn = false;
                        }
                        catch (ex) {
                            alert("prweb.resultsplayersvc.PageDxnry.pagentry.tohtml reports " + ex.Message);
                        }
                        return rslt;
                    };
                    pageentry.makepgobj = function (pcmodel) {
                        var rslt = false;
                        try {
                            pageentry.pcmID = pcmodel.pcmSdsID;
                            var obspcelemcolxn = pageentry.tohtml(pcmodel.PCElementsColxn, pcmodel.pcmSdsID);
                            //                            pageentry.isloaded(true);
                            //                            pageentry.pgobj(obspcelemcolxn);
                            pageentry.pgobj().pcelemcolxn(obspcelemcolxn);
                            //                            pageentry.pgobj({
                            //                                pcelemcolxn: ko.observableArray(obspcelemcolxn)
                            //                            });
                            //                            pageentry.manageSelectors();
                            //                        var test1 = pageentry.pgobj().pcelemcolxn();
                            obspcelemcolxn = null;
                            rslt = true;
                        }
                        catch (ex) {
                            alert("prweb.resultsplayersvc.PageDxnry.pagentry.makepgobj reports " + ex.Message);
                        }
                        return rslt;
                    };
                    var pgurl = that.CraftPageUrl(kvp);
                    pageentry.retrievePage = function () {
                        var rslt = false;
                        try {
                            if (!pageentry.isloaded()) {
                                if (prweb.appmessagesvc !== undefined) {
                                    prweb.appmessagesvc.PopulateViewMessage("retrieveing page info...please wait.");
                                }

                                var myurl = pgurl;
                                if (myurl) {
                                    prweb.dataManager.sendRequest({
                                        url: myurl,
                                        success: function (pcmodel) {
                                            try {
                                                var mpo = pageentry.makepgobj(pcmodel);
                                                pageentry.isloaded(mpo);
                                                if (pageentry.pgnum == that.actionContext.currentpgnumber.toString()) {
                                                    that.ApplyPcvModeForPage(that.actionContext.currentpgnumber);
                                                    prweb.flex.ScaleEditables();
                                                }
                                                if (prweb.appmessagesvc !== undefined) {
                                                    prweb.appmessagesvc.PopulateViewMessage(prweb.rfmsvc.GroupNameandSize + " Page " + that.actionContext.currentpgnumber.toString());
                                                }
                                                rslt = mpo;
                                            }
                                            catch (ex) {
                                                alert("prweb.resultsplayersvc.pagentry.retrievepage.successhandler reports " + ex.Message);
                                            }
                                            return;
                                        },
                                        error: function (e) {
                                            alert('prweb.resultsplayersvc.pageentry.retrievepage.sendRequest reports error...' + e.toString());
                                        }
                                    });
                                }
                            }
                            else {
                                rslt = true;
                            }
                        }
                        catch (ex) {
                            "prweb.resultsplayersvc.pagentry.retrievepage reports " + ex.Message
                        }
                        return rslt;
                    };
                    pageentry.dispose = function () {
                        try {
                            pageentry.OptListdispose();
                            pageentry.QoimColxn = false;
                            pageentry.pgobj().pcelemcolxn([]);
                        }
                        catch (ex) {
                            alert("prweb.resultsplayersvc.PageDxnry.pagentry.dispose reports " + ex.Message);
                        }
                        return;
                    };
                    that.PageNumberDxnry[kvp] = pageentry;

                    return true; // this gives me a viewmodel PageNumberDxnry[x].isloaded(), .pgobj()......
                };


                if (that.PageCount > 0) {
                    Enumerable.RangeTo(1, that.PageCount).ForEach(function (kvp) { return makedxnryrow(kvp.toString()) });
                }
                return true
            };


            //#endregion

            //#region SapiDxnry and PageDxnry Utilties and Initialize
            that.PublishPageChangeEvents = function () {
                var newpgnum = that.actionContext.currentpgnumber;
                var priorpgnumber = that.PriorPageNumber;
                prweb.pubsub.publish(prweb.events.subscriberplatform.surveycurrentpagechanged, newpgnum);
            };
            //this is called by ConfigureCurrentSapiItem...and ConfigureSurroundingPages
            that.PopulatePgEntryPageObj = function (pgnum) {
                var rslt = false
                try {
                    if (pgnum <= that.PageCount) {
                        if (that.PageNumberDxnry[pgnum.toString()].retrievePage()) {
                            rslt = true;
                        }
                    }
                    else {
                        rslt = true;
                    }
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.PopulatePgEntryPageObj reports " + ex.Message);
                }
                return rslt;
            };

            that.ConfigureSurroundingPages = function () {
                var curpgnum = that.actionContext.currentpgnumber;
                that.PopulatePgEntryPageObj(parseInt(curpgnum) + 1);
            };

            that.ConfigureCurrentSapiItem = function (curpgnum) {
                //this is called by PopulateCurrentPageNumber...
                // changing SapiDxnry[ndx].pgnum causes it onpgnumchangehandler to fire...configures its pgobj....see InitializeSapiItemsDxnry and PutPageHTMLinSapiItem
                var rslt = false;
                try {
                    that.SapiIndexDxnry[that.ToNdx(parseInt(curpgnum)).toString()].makeActive();
                    rslt = that.PopulatePgEntryPageObj(parseInt(curpgnum));
                    rslt = that.SapiIndexDxnry[that.ToNdx(parseInt(curpgnum)).toString()].changepgnum(parseInt(curpgnum));
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.ConfigureCurrentSapiItem reports " + ex.Message);
                }
                return rslt;
            };

            that.PopulateCurrentPageNumber = function (newpgnum) {
                var rslt = that.ConfigureCurrentSapiItem(newpgnum);
                //                var priorpgnumber = that.actionContext.currentpgnumber;
                //                that.PriorPageNumber = priorpgnumber;
                that.actionContext.currentpgnumber = parseInt(newpgnum);
                //                prweb.surveymodelsvc.ManagePageChange(parseInt(newpgnum));
                return rslt;
            };

            that.Initialize = function (pgcount) {
                try {
                    //                    rps.ModeTo = that.ModeTo;
                    that.ModeChangeSubscribe();
                    that.PageCount = pgcount;
                    that.InitializePageDxnry();
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.Initialize reports " + ex.Message);
                }
            };

            that.Dispose = function () {
                try {
                    that.ModeChangeUnSubscribe();
                    for (var kvp in that.PageNumberDxnry) {
                        that.PageNumberDxnry[kvp].dispose();
                        that.PageNumberDxnry[kvp] = null;
                        delete that.PageNumberDxnry[kvp];
                    };
                    that.PageNumberDxnry = {};
                    for (var kvp in that.SapiIndexDxnry) {
                        that.SapiIndexDxnry[kvp].dispose();
                        that.SapiIndexDxnry[kvp] = null;
                        delete that.SapiIndexDxnry[kvp];
                    };
                    that.SapiIndexDxnry = {};
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.Dispose reports " + ex.Message);
                }
                return;
            };
            //#endregion

            //#region setUpScrollApi
            that.GetSapiDxnryLength = function () {
                var rslt = 3;
                return rslt;
            };
            that.scrollapi = false;
            that.setUpScrollApi = function () {
                try {
                    that.scrollapi = that.newScrollApi();
                    that.actionContext.currentpgnumber = 1;
                    that.scrollapi.prwcurrentndx = 0;
                    that.scrollapi.prwcurrentpage = 1;
                    that.scrollapi.isscrollto = false;
                    that.scrollapi.isPrev = false;
                    that.scrollapi.isNext = false;
                    that.scrollapi.prwnxtbtn = $("#resultsplayernext");
                    that.scrollapi.prwprevbtn = $("#resultsplayerprev");
                    if (that.scrollapi.prwpgcount == 1) {
                        that.scrollapi.prwnxtbtn.hide();
                    };
                    //                that.MyPages = $(".resultsplayersurveypage", "#resultsplayersurveycontainer");
                    that.InitializeSapiItemsDxnry();
                    that.scrollapi.sizethePagesPanel();
                    that.scrollapi.addWindowResizeHandler();
                    var konode = $("#resultsplayersurveycontainer");
                    ko.applyBindings(that.Vmx, konode[0]);
                    konode = null;
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.setUpScrollApi reports " + ex.Message);
                }
                return;
            };
            //#endregion

            //#region ScrollAPI
            that.newScrollApi = function () {
                var sapi = {
                    getIndex: null,
                    sizethePagesPanel: null,
                    beforeSeekHandler: null,
                    afterSeekHandler: null,
                    isResizing: null,
                    resizeAction: null,
                    myimpliedpgnum: 1,
                    prwpgcount: 0,
                    isscrollto: true,
                    scrolltoTargetPgNum: 1,
                    isPrev: false,
                    isNext: false,
                    prwnxtbtn: false,
                    prwprevbtn: false,
                    prwcurrentpage: 0,
                    nxtpgurl: false
                };
                sapi.getIndex = function () {
                    return that.ToNdx(that.actionContext.currentpgnumber);
                }
                sapi.makeOtherSapiItemsInactive = function () {
                    //                    var cndx = sapi.getIndex();
                    //                    for (var ndx = 0; ndx < 3; ndx++) {
                    //                        if (cndx != ndx) {
                    //                            that.SapiIndexDxnry[ndx.toString()].makeInactive();
                    //                        }
                    //                    };
                };
                sapi.$container = $("#resultsplayersurveyscrollable");
                sapi.$panel = $("#resultsplayersurveyscrollable");
                sapi.$items = $("#resultsplayersurveyitems");
                sapi.beforeSeekHandler = function (i) {
                    var rslt = false;
                    sapi.isPrev = false;
                    sapi.isNext = false;
                    if (i >= 0) {
                        try {
                            if (sapi.isscrollto) {
                                //the issscrollto method...surveyview.navigatetopgnumber...sets scrolltoTargetPgNum..
                                sapi.isscrollto = false;
                                if (parseInt(sapi.scrolltoTargetPgNum) <= sapi.prwpgcount) {
                                    rslt = true;
                                    that.PriorPageNumber = that.actionContext.currentpgnumber;
                                    that.actionContext.currentpgnumber = parseInt(sapi.scrolltoTargetPgNum);
                                    prweb.actionContext.currentpgnumber = that.actionContext.currentpgnumber;
                                }
                            }
                            else {
                                var curndx = sapi.getIndex(); //is the position of scrllapi
                                sapi.isPrev = (i < curndx);
                                sapi.isNext = (i > curndx);
                                if (curndx == 2 && i == 0) {
                                    sapi.isNext = true;
                                    sapi.isPrev = false;
                                }
                                else if (curndx == 0 && i == 2) {
                                    sapi.isNext = false;
                                    sapi.isPrev = true;
                                }
                                if (sapi.isNext) {
                                    if (that.actionContext.currentpgnumber < sapi.prwpgcount) {
                                        rslt = true;
                                    }
                                    that.PriorPageNumber = that.actionContext.currentpgnumber;
                                    that.actionContext.currentpgnumber = Math.min(sapi.prwpgcount, that.actionContext.currentpgnumber + 1);
                                }
                                else if (sapi.isPrev) {
                                    if (that.actionContext.currentpgnumber > 0) {
                                        rslt = true;
                                    }
                                    that.PriorPageNumber = that.actionContext.currentpgnumber;
                                    that.actionContext.currentpgnumber = Math.max(1, that.actionContext.currentpgnumber - 1);
                                }
                            }
                        }
                        catch (ex) {
                            alert("prweb.resultsplayersvc.beforeSeekHandler reports " + ex.Message);
                        }
                    }

                    return rslt;
                };
                sapi.afterSeekHandler = function () {
                    var rslt = true;
                    try {
                        if (sapi.isPrev) {
                            //change surrounding SapiEntryPgNums...
                        }
                        else if (sapi.isNext) {
                            //change surrounding SapiEntryPgNums...
                            that.ConfigureSurroundingPages(that.actionContext.currentpgnumber)
                        }
                        if (that.actionContext.currentpgnumber !== sapi.prwpgcount) {
                            sapi.prwnxtbtn.css("display", "");
                        }
                        else {
                            sapi.prwnxtbtn.css("display", "none");
                        }
                        if (that.actionContext.currentpgnumber == 1) {
                            sapi.prwprevbtn.css("display", "none");
                        }
                        else {
                            sapi.prwprevbtn.css("display", "");
                        }
                        //                        prweb.flex.ScaleEditables();
                        that.PublishPageChangeEvents();
                    }
                    catch (ex) {
                        alert("prweb.resultsplayersvc.scollapi.afterseekhandler reports " + ex.Message);
                    }

                    return rslt;
                };
                sapi.isResizing = false;
                sapi.sizethePagesPanel = function () {
                    var fixleft = 0;
                    try {
                        var itemndx = sapi.getIndex();
                        var itemslctor = "#resultsplayersurveypage" + itemndx.toString();
                        //                        var $panel = $("#resultsplayersurveyscrollable");

                        //                        if (!prweb.IsTouch) {
                        //                            var pph = sapi.$panel.height();
                        //                            var ppw = sapi.$panel.width();
                        //                            sapi.$panel.width(Math.min(ppw, Math.round(1.6 * pph)));
                        //                        }

                        var scale = sapi.$container.attr("data-scale");
                        var pw = sapi.$panel.innerWidth();
                        var ph = sapi.$panel.innerHeight();
                        var $item = $(itemslctor);
                        if ($item.length == 1) {
                            var $itemparent = $item.parent();
                            sapi.$items.clearQueue().stop(true, true); //.css("left", 0);
                            var pos = $itemparent.css("width", pw + "px").css("height", ph + "px").position();
                            var posleft = pos.left / scale;
                            var ipw = 0; //$itemparent.innerWidth();
                            var iph = 0; //$itemparent.innerHeight();
                            //                            $item.css("height", iph + "px").css("width", ipw + "px");
                            fixleft = -posleft;
                            pw, ph, ipw, iph, pos, posleft, scale, $item, $itemparent, itemndx, itemslctor = null;
                        }
                        else {
                            alert(itemslctor + " resultsplayersvc.sapi.sizethePagesPanel selector.length not equal 1...")
                        }
                    }
                    catch (ex) {
                        alert("prweb.resultsplayersvc.sizethePagesPanel reports " + ex.Message);
                    }
                    return fixleft;
                }
                sapi.resizeAction = function () {
                    try {
                        clearTimeout(sapi.isResizing);
                        sapi.isResizing = false;
                        var fixleft = sapi.sizethePagesPanel();
                        sapi.$items.clearQueue().stop(true, true).css("left", fixleft);
                        fixleft = null;
                    }
                    catch (ex) {
                        alert("prweb.resultsplayersvc.sapi.resizeAction reports " + ex.Message);
                    }
                    return;
                };
                sapi.resizeHandler = function (e) {
                    try {
                        if (e.handleObj.namespace == "rpsapi") {
                            clearTimeout(sapi.isResizing);
                            sapi.isResizing = false;
                            sapi.isResizing = setTimeout(function () {
                                sapi.$items.clearQueue().stop(true, true);
                                sapi.resizeAction();
                                return;
                            }, 200);
                        }
                    }
                    catch (ex) {
                        alert("prweb.resultsplayersvc.sapi.resizeHandler reports " + ex.Message);
                    }
                    return;
                };
                sapi.addWindowResizeHandler = function () {
                    $(window).on("resize.rpsapi", sapi.resizeHandler);
                    return;
                };
                sapi.reset = function () {
                    try {
                        clearTimeout(sapi.isResizing);
                        sapi.isResizing = false;
                        sapi.prwpgcount = that.PageCount;
                        that.actionContext.currentpgnumber = 1;
                        prweb.actionContext.currentpgnumber = 1; //resultsgroupdefn._populatePageIconLights looks here...
                        sapi.scrolltoTargetPgNum = 1;
                        sapi.isscrollto = true;
                        sapi.$items.clearQueue().stop(true, true).css("left", 0);
                        sapi.$panel.clearQueue().stop(true, true).scrollLeft(0);

                        sapi.isscrollto = false;
                        that.actionContext.currentpgnumber = 1;
                        prweb.actionContext.currentpgnumber = 1; //resultsgroupdefn._populatePageIconLights looks here...

                    }
                    catch (ex) {
                        alert("prweb.resultsplayersvc.sapi.reset reports " + ex.Message);
                    }
                    return;
                };
                sapi.dispose = function () {
                    try {
                        $(window).off('resize.rpsapi', sapi.resizeHandler);
                        clearTimeout(sapi.isResizing);
                        sapi.isResizing = false;
                    }
                    catch (ex) {
                        alert("prweb.resultsplayersvc.sapi.dispose reports " + ex.Message);
                    }
                    return;
                };
                return sapi;
            };
            //#endregion

            //#region AnimatePageChange
            that.CurrentItemNdx = 0;
            that.animatePageChange = function (direction) {
                try {
                    if (!direction) {
                        //                        var fixleft = that.scrollapi.sizethePagesPanel();
                        //                        $("#resultsplayersurveyscrollable").scrollLeft(-fixleft);
                        that.scrollapi.isPrev = false;
                        that.scrollapi.isNext = false;
                        that.scrollapi.resizeAction();
                        that.scrollapi.afterSeekHandler();
                        prweb.flex.ScaleEditables();
                        that.ApplyPcvModeForPage(parseInt(that.actionContext.currentpgnumber));
                        prweb.surveymodelsvc.ManagePageChange(that.actionContext.currentpgnumber);
                        if (prweb.appmessagesvc !== undefined) {
                            prweb.appmessagesvc.PopulateViewMessage(prweb.rfmsvc.GroupNameandSize + " Page " + that.actionContext.currentpgnumber.toString());
                        }
                        //                        $("#resultsplayersurveyscrollable").animate({ scrollLeft: -fixleft }, { duration: 10, easing: 'easeInQuad', complete: that.scrollapi.afterSeekHandler });
                    }
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.animatepagechange reports " + ex.Message);
                }
                return;
            };
            //#endregion

            //#region AnimatePageLeaving
            that.AnimatePageLeaving = function (direction, newi) {
                try {
                    //                var curndx = that.scrollapi.getIndex();
                    var oppamt = "0";
                    switch (direction) {
                        case ("next"):
                            oppamt = "-=100"; //"-25%";
                            break;
                        case ("prev"):
                            oppamt = "+=100"; //"25%";
                            break;
                    }
                    that.scrollapi.$items.clearQueue().stop(true, false).animate({ left: oppamt }, { duration: 300, easing: 'linear' });
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.AnimatePageLeaving reports " + ex.Message);
                }
            };


            that.AnimatePageArriving = function (direction, fxleft, isnewpage) {
                try {
                    var oppamt = 0;
                    var gap = 50;
                    if (isnewpage) {
                        gap = that.scrollapi.$panel.innerWidth() - 100;
                    }
                    switch (direction) {
                        case ("next"):
                            fxleft += gap;
                            oppamt = "-=" + gap; //"-25%";
                            break;
                        case ("prev"):
                            fxleft -= gap;
                            oppamt = "+=" + gap; //"25%";
                            break;
                    };
                    that.scrollapi.$items.css("left", fxleft).animate({ left: oppamt }, { duration: 300, easing: 'linear', complete: function () {
                        if (isnewpage) {
                            that.ApplyPcvModeForPage(parseInt(that.actionContext.currentpgnumber));
                            var priorndx = that.ToNdx(that.PriorPageNumber);
                            that.SapiIndexDxnry[priorndx.toString()].makeInactive();
                            prweb.flex.ScaleEditables();
                            if (prweb.appmessagesvc !== undefined) {
                                prweb.appmessagesvc.PopulateViewMessage(prweb.rfmsvc.GroupNameandSize + " Page " + that.actionContext.currentpgnumber.toString());
                            }
                        }
                        return;
                    }
                    });
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.AnimatePageLeaving reports " + ex.Message);
                }
                return;
            };

            //#endregion

            //#region ManagePageChange
            that.ManagePageChange = function (direction, newi) {
                try {
                    that.scrollapi.isscrollto = false;
                    var isnewpage = that.scrollapi.beforeSeekHandler(newi);
                    if (isnewpage) {
                        prweb.actionContext.currentpgnumber = parseInt(that.actionContext.currentpgnumber);
                        that.PopulateCurrentPageNumber(parseInt(that.actionContext.currentpgnumber));
                        //                        that.ApplyPcvModeForPage(parseInt(that.actionContext.currentpgnumber));

                    }
                    switch (direction) {
                        case ("next"):
                            that.AnimatePageLeaving("next");
                            break;
                        case ("prev"):
                            that.AnimatePageLeaving("prev");
                            break;
                    };
                    var tx = setTimeout(function () {
                        try {
                            var fxleft = 0;
                            fxleft = that.scrollapi.sizethePagesPanel();
                            that.AnimatePageArriving(direction, fxleft, isnewpage);
                            that.scrollapi.afterSeekHandler();
                            that.ConfigureSurroundingPages();
                            prweb.surveymodelsvc.ManagePageChange(that.actionContext.currentpgnumber);
                            //                        prweb.flex.ScaleEditables();
                        }
                        catch (ex) {
                            alert("prweb.resultsplayersvc.ManagePageChange.complete reports " + ex.Message);
                        }
                        clearTimeout(tx);
                        tx = null;
                        return;
                    }, 10);
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.ManagePageChange reports " + ex.Message);
                }
                return;
            };
            //#endregion

            //#region Navigate Next Prev SeekTo
            that.navigateNext = function () {
                var nexti = that.ToNdx(Math.min(that.PageCount, that.actionContext.currentpgnumber + 1));
                that.ManagePageChange("next", nexti);
                return;
            };

            that.navigatePrev = function () {
                var previ = that.ToNdx(Math.max(0, that.actionContext.currentpgnumber - 1));
                that.ManagePageChange("prev", previ);
                return;
            };

            that.seekTo = function (pgnum) {
                try {
                    var scrndx = that.ToNdx(parseInt(pgnum));
                    that.scrollapi.isPrev = false;
                    that.scrollapi.isNext = false;
                    that.scrollapi.scrolltoTargetPgNum = parseInt(pgnum);
                    that.scrollapi.isscrollto = true;
                    if (that.scrollapi.beforeSeekHandler(scrndx)) {
                        that.scrollapi.isscrollto = false;
                        that.PopulateCurrentPageNumber(that.actionContext.currentpgnumber);
                        //                        that.ApplyPcvModeForPage(that.actionContext.currentpgnumber);
                        prweb.actionContext.currentpgnumber = parseInt(pgnum); //resultsgroupdefn._populatePageIconLights looks here...
                        that.animatePageChange(false);
                        //                        prweb.flex.ScaleEditables();
                    };
                    that.scrollapi.isscrollto = false;
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.seekTo reports " + ex.Message);
                }
                return;
            };
            //#endregion

            //#region RetrievePageZero
            that.RetrievePageZero = function (myurl) {
                try {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        success: function (pagezerodata) {
                            try {
                                $("#defaultloadingpage").remove();
                                that.SapiIndexDxnry["0"].clear();
                                that.SapiIndexDxnry["1"].clear();
                                that.SapiIndexDxnry["2"].clear();
                                that.scrollapi.reset();
                                that.NxtPgUrl = pagezerodata.nxtpgurl; //is the same url as surveymodelsvc.PCModelURL...this way elinates dependency...
                                //                            that.NxtPgUrl = prweb.surveymodelsvc.PCModelURL();
                                that.Initialize(pagezerodata.pgcount);

                                that.PCElemHtmlDxnry["prwTQuestOptionSet"] = pagezerodata.questoptset;
                                that.PCElemHtmlDxnry["prwTImage"] = pagezerodata.image;
                                that.PCElemHtmlDxnry["prwTIgnatz"] = pagezerodata.ignatz;
                                that.PCElemHtmlDxnry["prwTStylablePageContentModel"] = pagezerodata.stylablepage;
                                that.PageNumberDxnry["1"].makepgobj(pagezerodata.model);

                                that.scrollapi.prwpgcount = pagezerodata.pgcount

                                that.SapiIndexDxnry["0"].changepgnum(1);
                                that.animatePageChange(false);
                                that.ConfigureSurroundingPages();
                                prweb.surveymodelsvc.PageCount = pagezerodata.pgcount;
                                if (prweb.guestplatformsvc !== undefined) {
                                    prweb.guestplatformsvc.PageCount = pagezerodata.pgcount;
                                    prweb.guestplatformsvc.PlatformInitialize(pagezerodata.model.DesignerMetaData);
                                }
                                prweb.actionContext.currentpgnumber = 1;
                                prweb.rfmsvc.ShowPieCharts();
                                prweb.flex.ScaleEditables();
                                prweb.rfmsvc.InitializeGroupsSlideoutPanel();
                                prweb.surveymetadatasvc.LaunchSurveyMetaDataView();
                                if (prweb.surveypagenavisvc !== undefined) {
                                    prweb.surveypagenavisvc.Initialize();
                                    prweb.surveymodelsvc.ManagePageChange(parseInt(that.actionContext.currentpgnumber));
                                }
                                if (prweb.appmessagesvc !== undefined) {
                                    prweb.appmessagesvc.Initialize();
                                    prweb.appmessagesvc.PopulateViewMessage("Use the Groups and Details buttons on the left.");
                                }
                            }
                            catch (ex) {
                                alert("prweb.resultsplayersvc.RetrievePageZero.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert('prweb.resultsplayersvc.RetrievePageZero.sendRequest reports error...' + e.toString());
                        }
                    });
                }
                catch (ex) {
                    alert("prweb.resultsplayersvc.RetrievePageZero reports " + ex.Message);
                }
                return;
            };

            //#endregion

            that.LastSurveyItemURL = false;
            that.SurveySelect = function () {
                try {
                    var url = that.LastSurveyItemURL;
                    if (!url) {
                        url = prweb.surveymodelsvc.PageZeroURL();
                    }
                    if (url) {
                        that.RetrievePageZero(url);
                    }
                }
                catch (ex) {
                    alert("prweb.surveyplayersvc.SurveySelect reports " + ex.Message);
                }
            };


            return that;

        };
        return rps;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
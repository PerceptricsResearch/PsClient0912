/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.designerpcmsvc = (function () {

        //#region Class Variables

        var that = {};

        that.PcmIdListUrl = null;
        that.PcmodelUrl = null;
        that.SurveyContext = false;
        that.IPNColxn = {};
        that.IPNColxnLength = function () {
            var rslt = 0;
            for (var k in that.IPNColxn) {
                rslt++;
            };
            return rslt;
        };
        that.UnDoableColxn = false;
        that.UnDoableColxnLength = function () {
            var rslt = 0;
            for (var k in that.UnDoableColxn) {
                rslt++;
            };
            return rslt;
        };
        that.uid = 0;
        that.UniqueID = function () {
            that.uid++;
            return Math.max(1, that.uid);
        };
        //#endregion

        //#region NewIPNColxnItem
        that.NewIPNColxnItem = function (pgnum, isurl) {
            var rslt = {
                ipn: pgnum,
                isDirty: false,
                pgItemPgNumberstring: "",
                pgItemSdsId: -1,
                pcmsdsid: -1,
                urlpgnum: false,
                pcmcolxnNdx: false,
                isundone: false
            };
            if (isurl) {
                rslt.urlpgnum = pgnum;
            }
            return rslt;
        };
        //#endregion

        //#region NewPCM and PCMfromJSData Methods
        that.DefaultStylablePCM = function (pcmid) {
            var rslt = prweb.designerpcelementsvc.pcElementofT("prwTStylablePageContentModel"); //this pcelem has observable properties
            rslt.pcmID = pcmid;
            rslt.pcelemNdx = 0;
            rslt.modelcore.DI_CanvasTop(0);
            rslt.modelcore.DI_CanvasLeft(0);
            rslt.modelcore.DI_CanvasZindex(799);
            rslt.modelcore.DesignerItemHeight(100);
            rslt.modelcore.DesignerItemWidth(100);
            rslt.modelcore.BackgroundStr(prweb.brushes.WhiteBrush);
            return rslt;
        };

        that.NewPCM = function () {
            var rslt = false;
            var xpcmid = that.UniqueID(); // this id is the key used to distinguish rows in ViewModelx.pcmcolxn...access this row by that.Vmx.pcmcolxn[id]
            try {
                rslt = {
                    MyGuid: false,
                    MyGuidStr: false,
                    PageItemModel: {
                        MyGuidStr: false,
                        SdsID: -1,
                        PageNumber: false
                    },
                    DesignerMetaData: false,
                    SurveyID: that.SurveyContext,
                    PermanentGuidString: null,
                    PagesCount: null,
                    pcmID: xpcmid, // this id is the key used to distinguish rows in ViewModelx.pcmcolxn...access this row by that.Vmx.pcmcolxn[id]
                    pcmSdsID: -1,
                    IsPageRetrieved: false,
                    pcelemcolxn: ko.observableArray([that.DefaultStylablePCM(xpcmid)]),
                    BehaviorsList: []
                };
            }
            catch (ex) {
                alert("designerpcmsvc.NewPCM reports error .." + ex.Message);
            };
            xpcmid = null;
            return rslt;
        };

        that.PCMfromJSData = function (pcmjs) {
            var rslt = false;
            // pcmjs is a PCMJsonObject from SubscriberMainController...see PCMJsonObject type/class in SubscriberMainController
            try {
                rslt = {
                    MyGuid: pcmjs.PermanentGuidString,
                    MyGuidStr: pcmjs.PermanentGuidString,
                    PageItemModel: {
                        MyGuidStr: pcmjs.PageItemModel.MyGuidStr,
                        SdsID: pcmjs.PageItemModel.SdsID,
                        PageNumber: pcmjs.PageItemModel.PageNumber
                    },
                    DesignerMetaData: pcmjs.DesignerMetaData,
                    SurveyID: pcmjs.SurveyID,
                    PermanentGuidString: pcmjs.PermanentGuidString,
                    PagesCount: pcmjs.PagesCount,
                    pcmID: pcmjs.PgNumber, //that.Vmx.pcmcolxn.length + 1, // this id is the key used to distinguish rows in ViewModelx.pcmcolxn...access this row by that.Vmx.pcmcolxn[id]
                    pcmSdsID: pcmjs.pcmSdsID || -1,
                    IsPageRetrieved: true,
                    pcelemcolxn: ko.observableArray(),
                    BehaviorsList: pcmjs.BehaviorsList
                };
            }
            catch (ex) {
                alert("prweb.designerpcmsvc.PCMfromJSData reports error .." + ex.Message);
            };
            return rslt;
        };
        //#endregion

        //#region Undo Methods
        that.NewUnDoableItem = function () {
            var rslt = {
                action: "",
                toUndo: false,
                undoIPNColxnItemNdx: false,
                actiondata: false,
                isundone: false
            };
            return rslt;
        };

        that.UndoInsert = function (undoval) {
            var pgnum = that.IPNColxn[undoval.undoIPNColxnItemNdx].ipn;
            //gotta decrement all the ipns for every row after this...is behaviorally like an remove...
            Enumerable.From(that.IPNColxn).Where(function (x) { return x.Value.ipn > pgnum }).ForEach(function (xs) { return that.DecrementIPN(xs.Value); });
            that.IPNColxn[undoval.undoIPNColxnItemNdx].isundone = true;
            return pgnum;
        };

        that.UndoRemove = function (undoval) {
            var pgnum = Math.abs(that.IPNColxn[undoval.undoIPNColxnItemNdx].ipn);
            //gotta increment all the ipns for every row after this...is behaviorally like an insert...but no new rows are added...
            Enumerable.From(that.IPNColxn).Where(function (x) { return x.Value.ipn >= pgnum }).ForEach(function (xs) { return that.IncrementIPN(xs.Value); });
            that.IPNColxn[undoval.undoIPNColxnItemNdx].ipn = pgnum; //puts it back to what it was???
            return pgnum;
        };

        that.IsNotUndone = function (undoneclxnitemvalue) {
            return (!undoneclxnitemvalue.isundone);
        };

        that.Undo = function (undoscope) {
            var rslt = {
                pagecountdelta: 0,
                pgnum: false
            };
            var undoitem = false;
            if (!undoscope) {
                undoitem = Enumerable.From(that.UnDoableColxn)
                    .Where(function (ux) { return that.IsNotUndone(ux.Value) })
                    .OrderBy(function (x) { return x.Key })
                    .LastOrDefault();
                switch (true) {
                    case (undoitem.Value.action == 'insertpage'):
                        {
                            rslt.pgnum = that.UndoInsert(undoitem.Value);
                            undoitem.Value.isundone = true;
                            rslt.pagecountdelta = -1;
                            break;
                        };
                    case (undoitem.Value.action == 'removepage'):
                        {
                            rslt.pgnum = that.UndoRemove(undoitem.Value);
                            undoitem.Value.isundone = true;
                            rslt.pagecountdelta = 1;
                            break;
                        };
                    case (undoitem.Value.action):
                        {
                            break;
                        };
                };
            }
            else {
                switch (true) {
                    case (undoscope.scope == "pcelemcolxn"):
                        {
                            rslt = that.UndoPCElemColxnAction(undoscope.ipnndx);
                        };
                };
            };

            return rslt;
        };

        that.UndoPCElemColxnAction = function (ipnndx) {
            var rslt = false;
            var undoitem = Enumerable.From(that.UnDoableColxn)
                            .Where(function (ux) { return ((ux.Value.undoIPNColxnItemNdx == ipnndx) && that.IsNotUndone(ux.Value)) })
                            .OrderBy(function (x) { return x.Key })
                            .LastOrDefault();
            var pcm = false;
            if (undoitem) {
                switch (true) {
                    case (undoitem.Value.action == 'removepcelem'):
                        {
                            try {
                                pcm = that.PCMforIPNColxnNdx(ipnndx);
                                var pcelemjs = undoitem.Value.actiondata.pcejs;
                                prweb.designersvc.InsertPCElemToObservable(pcelemjs, pcm.pcelemcolxn(), pcm.pcmID);
                                undoitem.Value.actiondata.pcejs = null; //.Dispose();
                                undoitem.Value.actiondata = false;
                                undoitem.Value.isundone = true;
                                rslt = {
                                    pagecountdelta: 0,
                                    pgnum: that.IPNColxn[ipnndx].ipn
                                };
                                //                                                pcm.pcelemcolxn.valueHasMutated();
                                pcm = null;
                                pcelemjs = null;
                                pgnum = null;
                            }
                            catch (ex) {
                                alert("removepcelem.undo reports..." + ex.Message);
                            }
                            break;
                        };
                    case (undoitem.Value.action == "insertpcelem"):
                        {
                            try {
                                pcm = that.PCMforIPNColxnNdx(ipnndx);
                                var removeitem = Enumerable.From(pcm.pcelemcolxn())
                                            .Where(function (x) { return x.pcelemID == undoitem.Value.actiondata.pcelemID })
                                            .FirstOrDefault();
                                if (removeitem) {
                                    pcm.pcelemcolxn.remove(removeitem);
                                    removeitem.Dispose();
                                    removeitem = null;
                                    undoitem.Value.actiondata.pcejs = null; //.Dispose();
                                    undoitem.Value.actiondata = false;
                                    undoitem.Value.isundone = true;
                                    rslt = {
                                        pagecountdelta: 0,
                                        pgnum: that.IPNColxn[ipnndx].ipn
                                    };
                                }

                                pcm = null;
                            }
                            catch (ex) {
                                alert("insertpcelem.undo reports..." + ex.Message);
                            }
                            break;
                        };
                };
            }
            undoitem = null;
            return rslt;
        };

        that.RegisterUndoable = function (newundoable) {
            var ndx = that.UnDoableColxnLength() + 1;
            that.UnDoableColxn[ndx] = newundoable;
        };

        //#endregion





        //#region InsertNewPage
        that.IncrementIPN = function (ipnitemvalue) {
            if (!ipnitemvalue.isundone) {
                ipnitemvalue.ipn++;
            }
        };

        that.InsertNewPage = function (insertpgnum) {
            var rslt = false;
            try {
                //for each ipnitem in that.ipncolxn where ipnitem.value.ipn >= insertpgnum, ipnitem.value.ipn++
                Enumerable.From(that.IPNColxn).Where(function (x) { return x.Value.ipn >= insertpgnum }).ForEach(function (xs) { return that.IncrementIPN(xs.Value); });
                var pcmndx = prweb.designersvc.PCMColxnLength() + 1;
                prweb.designersvc.PCMColxn[pcmndx] = that.NewPCM(); //inserts npg/pcm into PCMColxn....
                var newipnobj = that.NewIPNColxnItem(insertpgnum, false);
                newipnobj.pcmcolxnNdx = pcmndx;
                var ipnndx = that.IPNColxnLength() + 1;
                that.IPNColxn[ipnndx] = newipnobj;
                rslt = insertpgnum;
                var newundo = that.NewUnDoableItem();
                newundo.action = "insertpage";
                newundo.actiondata = insertpgnum;
                newundo.undoIPNColxnItemNdx = ipnndx;
                that.RegisterUndoable(newundo);
                pcmndx = null;
                newipnobj = null;
                ipnndx = null;
                insertpgnum = null;
            }
            catch (ex) { alert("prweb.designerpcmsvc.InsertNewPage reports error..." + ex.Message); }
            return rslt;
        };
        //#endregion

        //#region PastePage
        that.PastePage = function (insertpgnum) {

        };
        //#endregion

        //#region CutPage
        that.CutPage = function (pgnum) {

        };
        //#endregion

        //#region RemovePage
        that.NoPageOne = function () {
            var rslt = false;
            var ipnitem = Enumerable.From(that.IPNColxn).Where(function (x) { return that.IsIPN(x.Value, 1) }).FirstOrDefault();
            if (!ipnitem) {
                rslt = true;
            }
            return rslt;
        };

        that.DecrementIPN = function (ipnitemvalue) {
            if (!ipnitemvalue.isundone) {
                ipnitemvalue.ipn--;
            }
        };
        that.RemovePage = function (removepgnum) {
            var rslt = false;
            try {
                var ipnitem = Enumerable.From(that.IPNColxn).Where(function (x) { return that.IsIPN(x.Value, removepgnum) }).FirstOrDefault();
                if (ipnitem) {
                    ipnitem.Value.ipn = removepgnum * -1;
                    Enumerable.From(that.IPNColxn).Where(function (x) { return x.Value.ipn > removepgnum }).ForEach(function (xs) { return that.DecrementIPN(xs.Value); });
                    var newundo = that.NewUnDoableItem();
                    newundo.action = "removepage";
                    newundo.actiondata = removepgnum;
                    newundo.undoIPNColxnItemNdx = ipnitem.Key;
                    that.RegisterUndoable(newundo);
                }
                else { alert("prweb.designerpcmsvc.RemovePage cannot find page to remove with pagenum= " + removepgnum.toString()); }
                if (removepgnum == 1 && that.NoPageOne() == 1) {
                    that.InsertNewPage(1);
                }
            }
            catch (ex) { alert("prweb.designerpcmsvc.RemovePage reports error..." + ex.Message); }
            return rslt;
        };

        //#endregion




        //#region RetrievePCM from Server Methods

        that.UrlForPgNum = function (tpgnum) {
            var npURL = that.PcmodelUrl;
            var arrpgn = npURL.split("pgNumber=");
            var pgn = arrpgn[1];
            var oldpgparm = "pgNumber=" + pgn;
            var newpgparm = "pgNumber=" + (tpgnum.toString());
            var retstring = npURL.replace(oldpgparm, newpgparm);
            return retstring;
        };

        that.PopulatePcmodeUrl = function (pgnum) {
            var rslt = false;
            try {
                if (that.SurveyContext > 0) {
                    that.PcmodelUrl = prweb.surveymodelsvc.PCModelURL();
                    if (that.PcmodelUrl) {
                        rslt = that.UrlForPgNum(pgnum);
                    }
                }
            }
            catch (ex) {
                alert("prweb.designerpcmsvc.PopulatePcmodeUrlreports error...");
            }
            return rslt;
        };


        that.PageNumOnRetrieveComplete = false;
        that.RetrievePCMCompleteHandler = function (pgdata) {
            if (pgdata) {
                var npg = that.PCMfromJSData(pgdata);
                var npgpcelemcolxn = npg.pcelemcolxn(); //this is the colxn of pcelements...on the new page...
                prweb.designersvc.ReplicatePCElementColxn(npgpcelemcolxn, pgdata.PCElementsColxn, npg.pcmID); //this populates the pcelemcolxn with new pceelements...
                var pcmndx = prweb.designersvc.PCMColxnLength() + 1;
                prweb.designersvc.PCMColxn[pcmndx] = npg; //inserts npg/pcm into PCMColxn....
                that.IPNColxn[that.PageNumOnRetrieveComplete].pcmcolxnNdx = pcmndx;
                npgpcelemcolxn = null;
                npg = null;
                pgdata = null;
                // then make the designer display the page...
                prweb.designersvc.NavigateToPageNumber(that.IPNColxn[that.PageNumOnRetrieveComplete].ipn);
            }
            else {
                alert("prweb.designerpcmsvc.RetrievePCMCompleteHandler reports pgdata is empty...");
            }
        };

        that.RetrievePCM = function (pgnum, callback) {
            var retrvcomplhandler = null;
            var myurl = that.PopulatePcmodeUrl(pgnum - 1);
            if (myurl) {
                try {
                    if (callback) {
                        retrvcomplhandler = callback;
                    }
                    else {
                        retrvcomplhandler = that.RetrievePCMCompleteHandler;
                        //                        that.PageNumOnRetrieveComplete = pgnum;
                    }
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        cache: false,
                        success: retrvcomplhandler,
                        error: function (ex) {
                            alert("prweb.designerpcmsvc.RetrievePCM.sendRequest reports error...");
                        }
                    });
                }
                catch (ex) {
                    alert("prweb.designerpcmsvc.RetrievePCM reports error...");
                }
            }
        };

        //#endregion

        //#region PCMforPageNumber



        that.IsIPN = function (xpv, xpgnum) {
            var rslt = false;
            if (!xpv.isundone) {
                rslt = (xpv.ipn == xpgnum);
            };
            return rslt;
        };

        that.IsPcmNdx = function (xpv, xpcmNdx) {
            var rslt = false;
            if (!xpv.isundone) {
                rslt = (xpv.pcmcolxnNdx == xpcmNdx);
            };
            return rslt;
        };

        that.IPNRowforPgNum = function (pgnum) {
            var rslt = false;
            var ipnitem = Enumerable.From(that.IPNColxn).Where(function (x) { return that.IsIPN(x.Value, pgnum) }).FirstOrDefault();
            if (ipnitem) {
                rslt = ipnitem.Value;
            }
            ipnitem = null;
            return rslt;
        };

        that.IPNRowforPCMColxnNdx = function (pcmNdx) {
            var rslt = false;
            var ipnitem = Enumerable.From(that.IPNColxn).Where(function (x) { return that.IsPcmNdx(x.Value, pcmNdx) }).FirstOrDefault();
            if (ipnitem) {
                rslt = ipnitem.Value;
            }
            ipnitem = null;
            return rslt;
        };

        that.IPNColxnNdxforPgNum = function (pgnum) {
            var rslt = false;
            var ipnitem = Enumerable.From(that.IPNColxn).Where(function (x) { return that.IsIPN(x.Value, pgnum) }).FirstOrDefault();
            if (ipnitem) {
                rslt = parseInt(ipnitem.Key);
            }
            return rslt;
        };

        that.PCMColxnNdxforPgNumber = function (pgnum) {
            var rslt = false;
            var ipnitem = Enumerable.From(that.IPNColxn).Where(function (x) { return that.IsIPN(x.Value, pgnum) }).FirstOrDefault();
            if (ipnitem) {
                rslt = ipnitem.Value.pcmcolxnNdx
            }
            return rslt;
        };

        that.PgNumforPCMColxnNdx = function (pcmNdx) {
            var rslt = false;
            var ipnitem = Enumerable.From(that.IPNColxn).Where(function (x) { return that.IsPcmNdx(x.Value, pcmNdx) }).FirstOrDefault();
            if (ipnitem) {
                rslt = ipnitem.Value.ipn;
            }
            ipnitem = null;
            return rslt;
        };

        that.PCMforPageNumber = function (pgnum) {
            var rslt = false;
            if (that.IPNColxn) {
                var ipnitem = Enumerable.From(that.IPNColxn).Where(function (x) { return that.IsIPN(x.Value, pgnum) }).FirstOrDefault();
                if (ipnitem) {
                    switch (true) {
                        case (ipnitem.Value.pcmcolxnNdx != false):
                            {
                                rslt = prweb.designersvc.PCMColxn[ipnitem.Value.pcmcolxnNdx];
                                break;
                            };
                        case ((ipnitem.Value.pcmcolxnNdx == false) && (ipnitem.Value.urlpgnum != false)):
                            {
                                that.PageNumOnRetrieveComplete = ipnitem.Value.ipn;
                                setTimeout(function () {
                                    that.RetrievePCM(ipnitem.Value.urlpgnum); //RetrievePCMCompleteHandler is called when this does success...
                                }, 0);


                                break;
                            };
                    };
                }
            }
            return rslt;
        };
        that.PCMforIPNColxnNdx = function (ipncolxnNdx) {
            var rslt = false;
            if (that.IPNColxn) {
                var ipnitem = that.IPNColxn[ipncolxnNdx];
                if (ipnitem) {
                    switch (true) {
                        case (ipnitem.pcmcolxnNdx != false):
                            {
                                rslt = prweb.designersvc.PCMColxn[ipnitem.pcmcolxnNdx];
                                break;
                            };
                            //                        case ((ipnitem.Value.pcmcolxnNdx == false) && (ipnitem.Value.urlpgnum != false)):
                            //                            {
                            //                                that.PageNumOnRetrieveComplete = ipnitem.Key;
                            //                                that.RetrievePCM(ipnitem.Value.urlpgnum); //RetrievePCMCompleteHandler is called when this does success...
                            //                                break;
                            //                            }
                    };
                }
            }
            return rslt;
        };

        //#endregion

        //#region NavigateToPageNumber

        that.xNavigateToPageNumber = function (pgnum) {
            if (that.PCMforPageNumber(pgnum)) {
                // then make the designer display the page...
                prweb.designersvc.Vmx.currentpagenumber(pgnum);
                //                prweb.designersvc.Vmx.currentpagenumber.valueHasMutated();
            }
            //else, the NavigationRetrievalCompleteHandler will be fired when RetrievePCM does success....
        };

        //#endregion

        //#region IPNColxn Initialize Methods
        that.PopulateIPNColxn = function (p, isurl) {
            that.IPNColxn[p] = that.NewIPNColxnItem(p, isurl);
        };

        that.InitializeIPNColxnNewSurvey = function (pgcnt) {
            that.IPNColxn = {};
            that.UnDoableColxn = {};
            Enumerable.RangeTo(1, pgcnt).ForEach(function (p) { return that.PopulateIPNColxn(p, false); });
            prweb.designersvc.PCMColxn[1] = that.NewPCM(1);
            that.IPNColxn[1].pcmcolxnNdx = 1;
            that.IPNColxn[1].isDirty = true;
            //this gets  prweb.designerpageslist to show pagenumber icons for the entire survey...
            prweb.surveymodelsvc.PageCount = pgcnt;
            prweb.surveymodelsvc.RefreshPagesCount();

            prweb.designersvc.Vmx.currentpagenumber(1);
            prweb.designersvc.Vmx.currentpagenumber.valueHasMutated();
            prweb.designersvc.Vmx.pagescount(pgcnt); // this triggers the event that designerpageslist is subscribed to for ResetPageIcons
            prweb.designersvc.Vmx.pagescount.valueHasMutated(); // this triggers the event that designerpageslist is subscribed to for ResetPageIcons
        };


        that.PopulateIpnItemFromJS = function (ipnitemjs) {
            try {
                that.IPNColxn[ipnitemjs.Value.ipn] = {
                    ipn: ipnitemjs.Value.ipn,
                    isDirty: false,
                    pgItemPgNumberstring: ipnitemjs.Value.pgItemPgNumberstring,
                    pgItemSdsId: ipnitemjs.Value.pgItemSdsId,
                    pcmsdsid: ipnitemjs.Value.pcmsdsid,
                    urlpgnum: ipnitemjs.Value.ipn,
                    pcmcolxnNdx: false,
                    isundone: false
                };
            }
            catch (ex) {
                alert("prweb.designerpcmsvc.PopulateIpnItemFromJS reports " + ex.Message);
            }
            return;
        };
        that.InitializeIPNColxnStoredSurvey = function (ipncolxn) {
            that.IPNColxn = {};
            that.UnDoableColxn = {};
            Enumerable.From(ipncolxn).OrderBy(function (xx) { return xx.Value.ipn }).ForEach(function (x) { return that.PopulateIpnItemFromJS(x); });
            //            Enumerable.RangeTo(1, pgcnt).ForEach(function (p) { return that.PopulateIPNColxn(p, true); });
            that.IPNColxn[1].pcmcolxnNdx = 1;
        };

        that.RetrievePCMCompleteInitHandler = function (pgdata) {
            //pgdata is a PCMJsonObject retrieved from the Server...
            var npg = null;
            if (pgdata) {
                prweb.designersavesurveysvc.InitializeDesignerMetaDataSvc(pgdata.DesignerMetaData);
                that.InitializeIPNColxnStoredSurvey(pgdata.DesignerMetaData.IPNColxn);
                prweb.designersvc.ImpliedPageCount = pgdata.PagesCount;
                prweb.designersvc.PageInsertPointManager('init');
//                that.IPNColxn[1].pcmcolxnNdx = 1;
                npg = that.PCMfromJSData(pgdata);
                var npgpcelemcolxn = npg.pcelemcolxn(); //this is the colxn of pcelements...on the new page...
                prweb.designersvc.ReplicatePCElementColxn(npgpcelemcolxn, pgdata.PCElementsColxn, npg.pcmID); //this populates the pcelemcolxn with new pceelements...
                try {
                    prweb.designersvc.PCMColxn[1] = npg; //inserts npg/pcm into PCMColxn....
                    //this gets  prweb.designerpageslist to show pagenumber icons for the entire survey...
                    prweb.surveymodelsvc.PageCount = pgdata.PagesCount;
                    prweb.surveymodelsvc.RefreshPagesCount();
                    prweb.designersvc.Vmx.pagescount(pgdata.PagesCount); // this triggers the event that designerpageslist is subscribed to for ResetPageIcons
                    // then make the designer display the page...
                    prweb.designersvc.NavigateToPageNumber(1);
                    //                    prweb.designersvc.Vmx.currentpagenumber(1);
                    //                    prweb.designersvc.Vmx.currentpagenumber.valueHasMutated();

                }
                catch (ex) {
                    alert("prweb.designerpcmsvc.RetrievePCMCompleteInitHandler reports error...");
                }
                npgpcelemcolxn = null;
                npg = null;
                pgdata = null;
            }
        };

        that.InitStoredSurvey = function () {
            that.IPNColxn = {};
            that.RetrievePCM(1, that.RetrievePCMCompleteInitHandler);
        };
        //#endregion

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
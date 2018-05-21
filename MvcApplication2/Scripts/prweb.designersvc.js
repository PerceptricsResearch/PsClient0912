/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.designersvc = (function () {
        //#region ClassVariables

        var that = {};

        that.uid = 0;
        that.UniqueID = function () {
            that.uid++;
            return Math.max(1, that.uid);
        };

        that.IsReady = false;
        that.DesignerPagesListHtml = false;
        that.designerresourcesUrl = null;
        that.donebtn = null;
        that.editablecontainer = null;
        that.CurrentSurveyContext = false;
        that.CurrentPCMContext = false;
        that.CurrentDesignerItemContext = false;
        that.DefaultSurveyContext = false;
        that.LastDesignerItemContext = false;
        that.LastSurveyContext = false;
        that.CurrentPCElemModel = false;
        that.CurrentPageNumber = 1;

        that.Vmx = false;
        that.IsDesignerDirty = false;
        that.PCMColxn = {};
        that.PCMColxnLength = function () {
            var rslt = 0;
            for (var k in that.PCMColxn) {
                rslt++;
            };
            return rslt;
        };
        //#endregion



        //#region NavigateToPageNumber 

        that.NavigateToPageNumber = function (pgnum) {
            var rslt = false;
            that.PopulateDesignerItemContext(false);
            if (pgnum == that.Vmx.currentpagenumber()) {
                that.Vmx.currentpagenumber.valueHasMutated();
                //                rslt = that.Vmx.currentpagenumber();
            }
            else {
                that.Vmx.currentpagenumber(parseInt(pgnum));
                rslt = true;
                //                prweb.designerpcmsvc.PCMforPageNumber(parseInt(pgnum));
                //                prweb.designerpcmsvc.NavigateToPageNumber(parseInt(pgnum));
            }
            pgnum = null;
            return rslt;
        };

        that.NavigateNextPage = function () {
            var rslt = false;
            var pgnum = that.Vmx.currentpagenumber();
            if (pgnum < that.ImpliedPageCount) {
                var tpgnum = pgnum + 1;
                rslt = that.NavigateToPageNumber(tpgnum);
                prweb.appmessagesvc.PopulateViewMessage("Showing page " + tpgnum + ".");
                tpgnum = null;
            }
            else {
                prweb.appmessagesvc.PopulateViewMessage("Showing last page. No more pages available.");
            }
            return rslt;
        };
        that.NavigatePrevPage = function () {
            var rslt = false;
            var pgnum = that.Vmx.currentpagenumber();
            if (pgnum > 1) {
                var tpgnum = pgnum - 1;
                rslt = that.NavigateToPageNumber(tpgnum);
                prweb.appmessagesvc.PopulateViewMessage("Showing page " + tpgnum + ".");
                tpgnum = null;
            }
            else {
                prweb.appmessagesvc.PopulateViewMessage("Showing first page. No previous pages are available.");
            }
            return rslt;
        };
        //#endregion

        //#region PagesCount and PageNumber Changed Handlers

        that.PagesCountChangedHandler = function (pgcountnewvalue) {
            prweb.pubsub.publish(prweb.events.subscriberplatform.pageslistpagecountchanged);
        };
        //this is the subscribed handler for Vmx.currentpagenumber changes...see initializeVMx here...
        that.PageNumberChangedHandler = function (newpgnumvalue) {
            that.CurrentPageNumber = newpgnumvalue;
            prweb.flex.ScaleEditables();
        };


        //#endregion

        //#region DialogueManager and IsDirty
        that.ClearDesignerDirty = function () {
            that.IsDesignerDirty = false;
            that.HideSaveBtn();
        };

        that.MarkDesignerDirty = function () {
            try {
                var ipnrow = prweb.designerpcmsvc.IPNRowforPgNum(that.CurrentPageNumber)
                if (ipnrow) {
                    ipnrow.isDirty = true;
                }
                if (!that.IsDesignerDirty) {
                    that.IsDesignerDirty = true;
                    prweb.dialoguemanager.ReqisterRequiredDialogue("designerclosesave");
                    that.ShowSaveBtn();
                }
            }
            catch (ex) {
                alert("prweb.designersvc.MarkDesignerDirty reports " + ex.Message);
            }

        };

        that.DialogueCompleteHandler = function (dlgrslt) {
            prweb.pubsub.unsubscribe(prweb.events.dialoguemanager.dialoguecomplete, that.DialogueCompleteHandler, that);
            switch (true) {
                case (dlgrslt == 'savesurveycomplete'):
                    that.ClearDesignerDirty();
                    break;
                case (dlgrslt !== 'cancel'):
                    that.ClearDesignerDirty();
                    that.HideExitCloseSaveButtons();
                    break;
                case (that.IsDesignerDirty):
                    prweb.dialoguemanager.ReqisterRequiredDialogue("designerclosesave");
                    break;
            };
        };

        that.SubscribeToDialogueManagerComplete = function () {
            prweb.pubsub.subscribe(prweb.events.dialoguemanager.dialoguecomplete, that.DialogueCompleteHandler, that);
        };

        //#endregion

        //#region Done and Save Buttons
        that.xevent = "click.designersvc";

        that.DesignerDoneBtnClickHandler = function () {
            prweb.appsvc.EvaluateSurveyContextChange(false); //false here changes the survey context to false...causes designerappcontext view to appear..
        };
        that.DesignerSaveBtnClickHandler = function () {
            prweb.dialoguemanager.DesignerSaveOnlyHandler();
            //            prweb.appsvc.EvaluateSurveyContextChange(that.CurrentSurveyContext); //false here changes the survey context to false...causes designerappcontext view to appear..
        };

        that.ShowSaveBtn = function () {
            $("#designerdonebtn").css("right", "55%").css("left", "0.2em");
            $("#designersavebtn").css("display", "").bind(that.xevent, that.DesignerSaveBtnClickHandler);
        };
        that.HideSaveBtn = function () {
            $("#designersavebtn").css("display", "none").unbind(that.xevent);
            $("#designerdonebtn").css("right", "2em").css("left", "2em");
        };
        that.ShowExitCloseSaveButtons = function () {
            that.HideExitCloseSaveButtons();
            $("#designerbtns").css("display", "");
            $("#designanchor").css("display", "none");
            $("#designerdonebtn").css("right", "2em").css("left", "2em").bind(that.xevent, that.DesignerDoneBtnClickHandler);
            if (that.IsDesignerDirty) {
                that.ShowSaveBtn();
            }
            else {
                that.HideSaveBtn();
            }
        };
        that.HideExitCloseSaveButtons = function () {
            $("#designerdonebtn").unbind(that.xevent);
            $("#designersavebtn").unbind(that.xevent);
            $("#designerbtns").css("display", "none");
            $("#designanchor").css("display", "");

        };


        //#endregion

        //#region PageInsertPointManager

        that.PageInsertNdx = false;
        that.MostRecentPgInsertAction = false;
        that.PageInsertPointManager = function (myaction) {
            if (!myaction) {
                myaction = (that.MostRecentPgInsertAction || 'last'); //default is last...or the most recent insertaction...
            }
            switch (true) {
                case (myaction == 'reset'):
                    {
                        that.PageInsertNdx = false;
                        that.MostRecentPgInsertAction = false;
                        break;
                    };
                case (myaction == 'init'):
                    {
                        that.PageInsertNdx = that.ImpliedPageCount + 1;
                        that.MostRecentPgInsertAction = false;
                        break;
                    };
                case (myaction == 'first'):
                    {
                        that.PageInsertNdx = that.ImpliedPageCount + 1;
                        that.MostRecentPgInsertAction = 'first';
                        break;
                    };
                case (myaction == 'last'):
                    {
                        that.PageInsertNdx = that.ImpliedPageCount + 1;
                        that.MostRecentPgInsertAction = 'last';
                        break;
                    };
                case (myaction == 'current'):
                    {
                        that.PageInsertNdx = that.Vmx.currentpagenumber() + 1;
                        that.MostRecentPgInsertAction = 'current';
                        break;
                    };
                case (myaction == 'before'):
                    {
                        that.PageInsertNdx = that.Vmx.currentpagenumber();
                        that.MostRecentPgInsertAction = 'before';
                        break;
                    };
                case (myaction == 'after'):
                    {
                        that.PageInsertNdx = that.Vmx.currentpagenumber() + 1;
                        that.MostRecentPgInsertAction = 'after';
                        break;
                    };
            };
            return that.PageInsertNdx;
        };

        //#endregion

        //#region ImpliedPageManager

        that.ImpliedPageCount = false;
        that.ImpliedPageManager = function (myaction, myvalue) {
            var rslt = false;
            switch (true) {
                case (myaction == 'reset'):
                    {
                        prweb.designerpcmsvc.IPNColxn = {};
                        prweb.designerpcmsvc.UnDoableColxn = false;
                        that.ImpliedPageCount = false;
                        that.PageInsertPointManager('reset');
                        break;
                    };
                case (myaction == 'initnew'):
                    {
                        that.ImpliedPageCount = myvalue;
                        that.PageInsertPointManager('init');
                        prweb.designerpcmsvc.InitializeIPNColxnNewSurvey(that.ImpliedPageCount);
                        break;
                    };
                case (myaction == 'initstored'):
                    {
                        prweb.designerpcmsvc.InitStoredSurvey();
                        break;
                    };
                case (myaction == 'add'):
                    {
                        that.ImpliedPageCount++;
                        rslt = prweb.designerpcmsvc.InsertNewPage(that.PageInsertNdx);
                        var pcnt = that.ImpliedPageCount; //reflects the new pcm added...
                        prweb.surveymodelsvc.PageCount = pcnt;
                        prweb.surveymodelsvc.AddPage();
                        that.Vmx.pagescount(pcnt);
                        pcnt = null;
                        break;
                    };
                case (myaction == 'remove'):
                    {
                        var pcnt = that.ImpliedPageCount;
                        that.ImpliedPageCount = Math.max(pcnt - 1, 1);
                        prweb.designerpcmsvc.RemovePage(myvalue);
                        prweb.surveymodelsvc.PageCount = that.ImpliedPageCount; // Math.max(pcnt - 1, 1);
                        if (pcnt > 1) {
                            prweb.surveymodelsvc.RemovePage();
                        };
                        that.Vmx.pagescount(that.ImpliedPageCount);
                        break;
                    };
            };
            return rslt;
        };


        //#endregion

        //PCElement Stuff
        //#region UnDo PCElemColxnAction and RegisterUndoable

        that.UndoPCelemColxnAction = function () {
            var rslt = prweb.designerpcmsvc.Undo({
                scope: "pcelemcolxn",
                ipnndx: prweb.designerpcmsvc.IPNColxnNdxforPgNum(that.CurrentPageNumber)
            });
            if (rslt) {
                that.NavigateToPageNumber(rslt.pgnum);
            }
            else { alert("found nothing to undo on this page...."); }
            return;
        };

        that.RegisterUndoable = function (pcelemaction, pcelemJS) {
            //pcelemJS can be either 1)a JS version of pcelem-for remove.... or 2)just the pcelem.pcelemID-for insert...
            var newundo = prweb.designerpcmsvc.NewUnDoableItem();
            newundo.action = pcelemaction;
            newundo.undoIPNColxnItemNdx = prweb.designerpcmsvc.IPNColxnNdxforPgNum(that.CurrentPageNumber);
            if (pcelemJS) {
                switch (true) {
                    case (pcelemaction == "removepcelem"):
                        {
                            newundo.actiondata = {
                                pcelemID: pcelemJS.pcelemID,
                                pcejs: pcelemJS
                            };
                            break;
                        };
                    case (pcelemaction == "insertpcelem"):
                        {
                            newundo.actiondata = {
                                pcelemID: pcelemJS,
                                pcejs: false
                            };
                            break;
                        };
                };
            }
            prweb.designerpcmsvc.RegisterUndoable(newundo);
            return;
        };

        //#endregion

        //#region PCElem Colxn Methods 

        that.DisposePcelemcolxn = function (ndx) {
            // dispose of the pcmcolxn row content...
            try {
                var pcolxn = that.PCMColxn[ndx].pcelemcolxn.removeAll();
                for (var p in pcolxn) {
                    pcolxn[p].Dispose();
                    pcolxn[p] = null;
                    delete pcolxn[p];
                };
                pcolxn = null;
            }
            catch (ex) {
                alert("designersvc.DisposePcelemcolxn reports ..." + ex.Message);
            }
            return;
        };

        that.InsertPCElemToObservable = function (pcelmjs, targetcolxn, targetpcmid) {
            var pcelmobservable = prweb.designerpcelementsvc.PCElemFromJSData(pcelmjs, targetpcmid);
            pcelmjs = null;
            targetpcmid = null;
            targetcolxn.push(pcelmobservable);
            pcelmobservable = null;
            targetcolxn = null;
        };

        that.PCelemColxnAddT = function (presenterT, elemprops) {
            var currentpgnum,
                xpcelem,
                pcm,
                pcelmcolxn,
                pcelemndx = null;
            try {
                xpcelem = prweb.designerpcelementsvc.pcElementofT(presenterT, elemprops); //this pcelem has observable properties
                currentpgnum = that.Vmx.currentpagenumber();
                pcm = prweb.designerpcmsvc.PCMforPageNumber(currentpgnum); //that.PCMColxn[currentpcmndx]; //that.Vmx.pcmcolxn()[currentpcmndx];
                xpcelem.pcmID = pcm.pcmID;
                pcelmcolxn = pcm.pcelemcolxn(); //is a jsArray of pcelements...
                pcelemndx = pcelmcolxn.length;
                xpcelem.pcelemNdx = pcelemndx;
                pcelmcolxn[pcelemndx] = xpcelem;
                that.RegisterUndoable("insertpcelem", xpcelem.pcelemID);
                pcm.pcelemcolxn.valueHasMutated();
                that.MarkDesignerDirty();
            }
            catch (ex) {
                alert("prweb.designersvc.PCElemColxnAddT reports error...");
                ex = null;
            }
            finally {
                xpcelem = null;
                pcm = null;
                pcelmcolxn = null;
                currentpgnum = null;
                pcelemndx = null;
                return true;
            }
        };

        that.PCelemCopyElement = function () {
            if (that.CurrentPCElemModel) {
                prweb.clipboardsvc.AddElement(ko.toJS(that.CurrentPCElemModel));
            }
        };

        that.PCElemPasteElement = function () {
            var currentpgnum = null;
            var targetpg = null;
            var targetpgpcelemcolxn = null;
            var pcelem = null;
            var pcelemndx = null;
            try {
                currentpgnum = that.Vmx.currentpagenumber();
                targetpg = prweb.designerpcmsvc.PCMforPageNumber(currentpgnum); // this is target page...
                targetpgpcelemcolxn = targetpg.pcelemcolxn(); //this is the colxn of pcelements...as a JS Array
                pcelem = prweb.clipboardsvc.PasteElement(); // this is JS form of PCElem to be pasted...
                pcelemndx = targetpgpcelemcolxn.length;
                pcelem.pcelemNdx = pcelemndx;
                //                pcelem.pcelemID = pcelemndx;
                var insertedpcelem = prweb.designerpcelementsvc.PCElemFromJSData(pcelem, targetpg.pcmID);
                targetpgpcelemcolxn.push(insertedpcelem); // this adds an observable PCElem to page.pcelemecolxn...
                that.RegisterUndoable("insertpcelem", insertedpcelem.pcelemID);
                pcelem = null;
                insertedpcelem = null;
                currentpgnum = null;
                target = null;
                targetpgpcelemcolxn = null;
                pcelemndx = null;
                targetpg.pcelemcolxn.valueHasMutated();
                targetpg = null;

            }
            catch (ex) {
                alert("prweb.designersvc.PCElemPasteElement reports error...");
            }
        };

        that.PCelemColxnRemove = function () {
            var currentpgnum,
                pcm,
                removeitem = null;
            try {
                if (that.CurrentDesignerItemContext) {
                    currentpgnum = that.Vmx.currentpagenumber();
                    pcm = prweb.designerpcmsvc.PCMforPageNumber(currentpgnum); //that.Vmx.pcmcolxn()[currentpcmndx];
                    //this could use a ko.util...instead of 
                    removeitem = Enumerable.From(pcm.pcelemcolxn()).Where(function (x) { return x.pcelemID == that.CurrentDesignerItemContext }).FirstOrDefault();
                    if (removeitem) {
                        that.RegisterUndoable("removepcelem", ko.toJS(removeitem));
                        pcm.pcelemcolxn.remove(removeitem);
                        that.PopulateDesignerItemContext(false);
                        removeitem.Dispose();
                        removeitem = null;
                    }
                    else {
                        alert("designersvc.PCelemColxnRemove reports removeitem is null false...");
                    }
                }
            }
            catch (ex) {
                alert("designersvc.PCelemColxnRemove reports " + ex.Message);
            }
            currentpgnum,
            pcm,
            removeitem = null;
            return true;
        };

        that.PCElemCutElement = function () {
            that.PCelemCopyElement();
            that.PCelemColxnRemove();
        };

        that.PCelemColxnUndo = function () {
            that.UndoPCelemColxnAction();
        };

        //this method is called by PCMColxnPastePage and designerpcmsvc.RetrievePCMCompleteHandler and designerpcmsvc.RetrievePCMCompleteInitHandler
        that.ReplicatePCElementColxn = function (targetpgpcolxn, sourcecolxn, targetpcmid) {
            var pcelmobservable = null;
            for (var p in sourcecolxn) {
                that.InsertPCElemToObservable(sourcecolxn[p], targetpgpcolxn, targetpcmid);
            };
            targetpgpcolxn = null;
            sourcecolxn = null;
            targetpcmid = null;
        };

        //#endregion

        //PCM Stuff
        //#region UnDo PCMColxn Methods
        that.UndoPageAction = function () {
            var rslt = prweb.designerpcmsvc.Undo();
            that.ImpliedPageCount = that.ImpliedPageCount + rslt.pagecountdelta;
            prweb.surveymodelsvc.PageCount = that.ImpliedPageCount; // Math.max(pcnt - 1, 1);
            that.Vmx.pagescount(that.ImpliedPageCount);
            if (rslt.pagecountdelta > 0) {
                prweb.surveymodelsvc.AddPage();
                that.NavigateToPageNumber(rslt.pgnum);
            };
            if (rslt.pagecountdelta < 0) {
                prweb.surveymodelsvc.RemovePage();
                that.NavigateToPageNumber(rslt.pgnum - 1);
            };
            rslt = null;
        };

        //#endregion

        //#region PCMColxn Methods Insert Remove Copy Paste Cut

        that.PCMColxnInsertNewPage = function (action) {
            that.MarkDesignerDirty();
            if (!action) {
                that.PageInsertPointManager('last');
            }
            var newpgnum = that.ImpliedPageManager('add', null);
            that.NavigateToPageNumber(newpgnum);
            //            prweb.pubsub.publish(prweb.events.subscriberplatform.scrolltopage, newpgnum);
            return newpgnum;
        };
        that.PCMColxnRemovePage = function () {
            try {
                that.MarkDesignerDirty();
                that.ImpliedPageManager('remove', that.CurrentPageNumber);
                var navtopage = Math.min(that.CurrentPageNumber, that.ImpliedPageCount);
                that.NavigateToPageNumber(navtopage);
                //                prweb.pubsub.publish(prweb.events.subscriberplatform.scrolltopage, navtopage);
                navtopage = null;
            }
            catch (ex) {
                alert("prweb.designersvc.PCMColxnRemovePage reports error...");
            }

        };
        that.PCMColxnPastePage = function (action) {
            that.MarkDesignerDirty();
            if (!action) {
                that.PageInsertPointManager('last');
            }
            // inserts a new page...page.pcelemcolxn is created new from pageclipboard.pcelemcolxn...
            var pgdata = prweb.clipboardsvc.PastePage();
            var npg = null;
            var newpgnum = false;
            if (pgdata) {
                newpgnum = that.ImpliedPageManager('add', null);
                npg = prweb.designerpcmsvc.PCMforPageNumber(newpgnum);
                var npgpcelemcolxn = npg.pcelemcolxn(); //this is the colxn of pcelements...on the newpage...is empty right now...is a jsArray...
                //remove the default stylablepcm...should dispose it...
                var si = npgpcelemcolxn.pop();
                si.Dispose();
                si = null;
                that.ReplicatePCElementColxn(npgpcelemcolxn, pgdata, npg.pcmID); //this populates the newpage.pcelemcolxn with new pceelements...
                npgpcelemcolxn = null;
                npg = null;
                pgdata = null;
                that.NavigateToPageNumber(newpgnum);
            }
            else {
                alert("the page clipboard is empty. Nothing to Paste.");
            }
            pgdata = null;
            npg = null;
            return newpgnum
        };
        that.PCMColxnCopyPage = function () {
            //            var currentpcmndx = that.CurrentPageNumber;
            var pcm = prweb.designerpcmsvc.PCMforPageNumber(that.CurrentPageNumber);
            if (pcm) {
                prweb.clipboardsvc.AddPage(ko.toJS(pcm.pcelemcolxn));
            }
            pcm = null;
        };
        that.PCMColxnCutPage = function () {
            that.MarkDesignerDirty();
            that.PCMColxnCopyPage();
            that.PCMColxnRemovePage();
        };

        //#endregion

        //#region QuestOptSetMethods 
        //#region Options BoxsBtns Methods

        //        that.PopulateForegroundColorColxn = function (newcolor) {
        //            var rslt = {};
        //            rslt = prweb.colorssvc.GetForegroundColorColxn(newcolor);

        //            return rslt;
        //        };



        that.BoxsBtnsColorBorderChange = function () {

        };
        that.BoxsBtnsColorCheckChange = function () {

        };
        //#region ShowRadioButtons On Off

        that.ShowRadioButtonsOnState = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                if (that.CurrentPCElemModel.QuestOptSetModel) {
                    var brushid = that.CurrentPCElemModel.QuestOptSetModel.RadioBtnOnBrushID();
                    that.CurrentPCElemModel.modelcore.CheckBoxOnOffUrlStr("url(#" + brushid + ")"); //tell the svg to use this radialGradient...
                    brushid = null;
                    rslt = true;
                }
            }
            return rslt;
        };
        that.ShowRadioButtonsOffState = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                if (that.CurrentPCElemModel.QuestOptSetModel) {
                    var brushid = that.CurrentPCElemModel.QuestOptSetModel.RadioBtnOffBrushID();
                    that.CurrentPCElemModel.modelcore.CheckBoxOnOffUrlStr("url(#" + brushid + ")"); //tell the svg to use this radialGradient...
                    brushid = null;
                    rslt = true;
                }
            }
            return rslt;
        };

        //#endregion

        //#region BoxBtnsSizeChange

        that.computeMaxSize = function (newsizepct) {
            var rslt = { w: 100, h: 100 };
            var svgdivsel = "." + that.CurrentPCElemModel.QuestOptSetModel.SvgDivClass();
            var svgdivelem = $(svgdivsel).eq(0);
            //            var svgdiv = svgdivelem.eq(0);
            //            var svgdivw = svgdiv.width();
            var svgdivh = svgdivelem.height();
            var par = svgdivelem.parent();
            var parw = par.width();
            //            var parh = par.height();
            //            var wpct = svgdivw / parw;
            rslt.w = Math.round(Math.min(svgdivh / parw, 0.7) * 100);
            return rslt;
        };


        that.BoxsBtnsSizeChange = function (sizerslt) {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                if (that.CurrentPCElemModel.QuestOptSetModel) {
                    //                    sizerslt = sizerslt * 2;//this makes the 50% default size 100%....and size changes occur from their....
                    var maxsize = that.computeMaxSize(sizerslt);
                    //                    var szrsltstrh = Math.min(Math.round((sizerslt * 2 * 100)), Math.max(maxsize.w, maxsize.h));
                    var szrsltstrw = Math.min(Math.round((sizerslt * maxsize.w)), Math.round(maxsize.w));
                    //                    var szrsltstrmtb = Math.floor((100 - szrsltstrh) * 0.5);
                    var szrsltstrright = 99 - szrsltstrw;
                    var szrsltstroptionwidth = 99 - szrsltstrw;
                    var szrsltstroptionleft = szrsltstrw;
                    //                    that.CurrentPCElemModel.QuestOptSetModel.SelectorHeight(szrsltstrh + "%");
                    that.CurrentPCElemModel.QuestOptSetModel.SelectorWidth(szrsltstrw + "%");
                    //                    that.CurrentPCElemModel.QuestOptSetModel.SelectorMarginTopBottom(szrsltstrmtb + "%");
                    that.CurrentPCElemModel.QuestOptSetModel.SelectorMarginRight(szrsltstrright + "%");

                    that.CurrentPCElemModel.QuestOptSetModel.OptionTextMarginLeft(szrsltstroptionleft + "%");
                    that.CurrentPCElemModel.QuestOptSetModel.OptionTextWidth(szrsltstroptionwidth + "%");
                    rslt = true;
                    szrsltstrh = null;
                    szrsltstrw = null;
                    szrsltstrmtb = null;
                }
            }
            return rslt;
        };

        //#endregion

        that.ApplyRequireAnswerToOptions = function (isrequired) {

        };

        that.ShowCheck = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                if (that.CurrentPCElemModel.QuestOptSetModel) {
                    if (that.CurrentPCElemModel.QuestOptSetModel.RadioBtnVisible() == "hidden") {
                        that.CurrentPCElemModel.QuestOptSetModel.BoxVisible("visible");
                        that.CurrentPCElemModel.QuestOptSetModel.CheckVisible("visible");
                        rslt = true;
                    }
                }
            }
            return rslt;
        };

        that.ApplyRadioButtonsToOptions = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                if (that.CurrentPCElemModel.QuestOptSetModel) {
                    that.CurrentPCElemModel.QuestOptSetModel.RadioBtnVisible("visible");
                    that.CurrentPCElemModel.QuestOptSetModel.BoxVisible("hidden");
                    that.CurrentPCElemModel.QuestOptSetModel.CheckVisible("hidden");
                    var brushid = that.CurrentPCElemModel.QuestOptSetModel.RadioBtnOffBrushID();
                    that.CurrentPCElemModel.modelcore.CheckBoxOnOffUrlStr("url(#" + brushid + ")"); //tell the svg to use this linearGradient...
                    brushid = null;
                    rslt = true;
                }
            }
            return rslt;
        };

        that.ApplyCheckBoxesToOptions = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                if (that.CurrentPCElemModel.QuestOptSetModel) {
                    that.CurrentPCElemModel.QuestOptSetModel.BoxVisible("visible");
                    that.CurrentPCElemModel.QuestOptSetModel.RadioBtnVisible("hidden");
                    var brushid = that.CurrentPCElemModel.QuestOptSetModel.BoxBackgroundBrushID();
                    that.CurrentPCElemModel.QuestOptSetModel.BoxBackgroundBrushUrl("url(#" + brushid + ")"); //tell the svg to use this linearGradient...
                    brushid = null;
                    rslt = true;
                }
            }
            return rslt;
        };

        //#endregion
        //#region  Add Remove Option Column Row
        that.AddOptionsRow = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                if (that.CurrentPCElemModel.QuestOptSetModel) {
                    var rows = that.CurrentPCElemModel.QuestOptSetModel.UniGridRows();
                    that.CurrentPCElemModel.QuestOptSetModel.UniGridRows(rows + 1);
                }
            }
            return rslt;
        };
        that.RemoveOptionsRow = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                if (that.CurrentPCElemModel.QuestOptSetModel) {
                    var rows = that.CurrentPCElemModel.QuestOptSetModel.UniGridRows();
                    that.CurrentPCElemModel.QuestOptSetModel.UniGridRows(Math.max(1, rows - 1));
                }
            }
            return rslt;
        };

        that.AddOptionsColumn = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                if (that.CurrentPCElemModel.QuestOptSetModel) {
                    var cols = that.CurrentPCElemModel.QuestOptSetModel.UniGridColumns();
                    that.CurrentPCElemModel.QuestOptSetModel.UniGridColumns(cols + 1);
                }
            }
            return rslt;
        };
        that.RemoveOptionsColumn = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                if (that.CurrentPCElemModel.QuestOptSetModel) {
                    var cols = that.CurrentPCElemModel.QuestOptSetModel.UniGridColumns();
                    that.CurrentPCElemModel.QuestOptSetModel.UniGridColumns(Math.max(1, cols - 1));
                }
            }
            return rslt;
        };

        that.AddQuestOption = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                if (that.CurrentPCElemModel.QuestOptSetModel) {
                    that.CurrentPCElemModel.QuestOptSetModel.ItemsObservableColxn.push(prweb.designerpcelementsvc.QuestOptionItemModel("Option New"));
                }
            }
            return rslt;
        };
        that.RemoveQuestOption = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                if (that.CurrentPCElemModel.QuestOptSetModel) {
                    var sel = "#" + that.CurrentPCElemModel.QuestOptSetModel.QosprwtID();
                    var issel = $("#designeritemeditorresident").children().eq(0); //$(sel, "#designeritemeditorcanvas");
                    var isseldata = issel.data("questoptsetprwt") || false;
                    if (isseldata) {
                        isseldata.showDeletables();
                    }
                    //                    $(sel).data("questoptsetprwt").showDeletables();
                }
            }
            return rslt;
        };

        //#endregion
        //#endregion

        //#region AlignmentHandlers BringForward Front Back Backward

        that.GetMaxZndx = function () {
            var currentpcmndx = that.Vmx.currentpagenumber();
            var pcm = prweb.designerpcmsvc.PCMforPageNumber(currentpcmndx); //that.PCMColxn[currentpcmndx]; //that.Vmx.pcmcolxn()[currentpcmndx];
            var maxz = Enumerable.From(pcm.pcelemcolxn()).Select(function (pce) { return pce.modelcore.DI_CanvasZindex() }).Max();
            pcm = null;
            currentpcmndx = null;
            return maxz
        };
        that.GetMinZndx = function () {
            var currentpcmndx = that.Vmx.currentpagenumber();
            var pcm = prweb.designerpcmsvc.PCMforPageNumber(currentpcmndx); //that.PCMColxn[currentpcmndx]; //that.Vmx.pcmcolxn()[currentpcmndx];
            var maxz = Enumerable.From(pcm.pcelemcolxn()).Where(function (pce) { return pce.PresenterTypeName !== "prwTStylablePageContentModel" }).Select(function (pce) { return pce.modelcore.DI_CanvasZindex() }).Min();
            pcm = null;
            currentpcmndx = null;
            return maxz
        };

        that.BringForward = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                var zndx = that.CurrentPCElemModel.modelcore.DI_CanvasZindex();
                that.CurrentPCElemModel.modelcore.DI_CanvasZindex(Math.min(1000, zndx + 1));
                $("#" + that.CurrentPCElemModel.pcelemID).data("designeritem").updateZindex(); //cant use ko ...it calls cleanData for some reason...destroys widgts
                rslt = true;
            }
            return rslt;
        };
        that.BringToFront = function () {
            var rslt = false;

            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                var maxzndx = that.GetMaxZndx();
                that.CurrentPCElemModel.modelcore.DI_CanvasZindex(Math.min(1000, maxzndx + 1));
                $("#" + that.CurrentPCElemModel.pcelemID).data("designeritem").updateZindex(); //cant use ko ...it calls cleanData for some reason...destroys widgts
                rslt = true;
            }
            return rslt;
        };
        that.SendBackward = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                var zndx = that.CurrentPCElemModel.modelcore.DI_CanvasZindex();
                that.CurrentPCElemModel.modelcore.DI_CanvasZindex(Math.max(800, (zndx - 1)));
                $("#" + that.CurrentPCElemModel.pcelemID).data("designeritem").updateZindex(); //cant use ko ...it calls cleanData for some reason...destroys widgts
                rslt = true;
            }
            return rslt;
        };
        that.SendToBack = function () {
            var rslt = false;
            try {
                if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                    var minzndx = that.GetMinZndx();
                    var effzndx = Math.max(minzndx - 1, 800);
                    that.CurrentPCElemModel.modelcore.DI_CanvasZindex(effzndx);
                    $("#" + that.CurrentPCElemModel.pcelemID).data("designeritem").updateZindex(); //cant use ko ...it calls cleanData for some reason...destroys widgts
                    rslt = true;
                }
            }
            catch (ex) {
                alert("prweb.designersvc.SendToBack reports " + ex.Message);
            }
            return rslt;
        };

        that.UndoArrangement = function () {

        };

        //#endregion

        that.editablecontent = false;
        that.editablecontainerpgnum = 0;
        that.editableselector = false;
        that.AddEditableContainer = function (ta, edselctor) {
            try {
                //                that.editableselector = edselctor;
                //                that.editablecontainerpgnum = that.Vmx.currentpagenumber();
                //                that.editablecontent = ta;
                //                that.PCelemColxnAddT("prweditablecontainer");
            }
            catch (ex) {
                alert("designersvc.AddEditableContainer reports error..." + ex.Message);
            }
            return;
        };

        that.RemoveEditableContainer = function () {
            prweb.designeritemeditorsvc.RemoveEditableContainer();
            //            var currentpgnum,
            //                pcm,
            //                removeitem = null;
            //            if (prweb.designertextsvc.CurrentEditable && that.editablecontainerpgnum) {
            //                try {
            //                    currentpgnum = that.editablecontainerpgnum; //that.Vmx.currentpagenumber();
            //                    pcm = prweb.designerpcmsvc.PCMforPageNumber(currentpgnum); //that.Vmx.pcmcolxn()[currentpcmndx];
            //                    //this could use a ko.util...instead of 
            //                    if (pcm) {
            //                        removeitem = Enumerable.From(pcm.pcelemcolxn()).Where(function (x) { return x.PresenterTypeName == "prweditablecontainer" }).FirstOrDefault();
            //                        if (removeitem) {
            //                            pcm.pcelemcolxn.remove(removeitem);
            //                            removeitem.Dispose();
            //                            removeitem = null;
            //                        }
            //                    }

            //                    //                else {
            //                    //                    alert("designersvc.RemoveEditableContainer reports removeitem is null false...");
            //                    //                }
            //                }
            //                catch (ex) {
            //                    alert("designersvc.RemoveEditableContainer reports error..." + ex.Message);
            //                }
            //            }
            //            currentpgnum,
            //            pcm,
            //            removeitem = null;
            return true;
        };

        //#region Styling Methods and Handlers

        that.PopulateDesignerItemContext = function (designeritemid) {
            if (that.IsReady) {
                if (designeritemid) {
                    prweb.designerpanelsmgr.CloseAnyExToolbox();
                }
                that.Vmx.designeritemcontext(designeritemid);
            }
            designeritemid = null;
            return true;
        };

        that.PopulateCurrentPCElemModel = function () {
            if (that.CurrentDesignerItemContext) {
                var currentpcmndx = that.Vmx.currentpagenumber();
                var pcm = prweb.designerpcmsvc.PCMforPageNumber(currentpcmndx); //that.PCMColxn[currentpcmndx]; //that.Vmx.pcmcolxn()[currentpcmndx];
                var themodel = Enumerable.From(pcm.pcelemcolxn()).Where(function (x) { return x.pcelemID == that.CurrentDesignerItemContext }).FirstOrDefault();
                if (themodel) {
                    that.CurrentPCElemModel = themodel;
                }
                else {
                    that.CurrentPCElemModel = false;
                }
                pcm = null;
                themodel = null;
            }
        };

        that.ActiveStylingSvcSubscriptions = {};
        that.TargetPropertyDxnry = {};



        that.CurrentImgOpacity = 1;

        that.ImageOpacityChange = function (opacityrslt) {
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                that.CurrentPCElemModel.modelcore.ImageOpacity(opacityrslt);
                that.MarkDesignerDirty();
            }
        };
        that.MakeNoImage = function () {
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                that.CurrentPCElemModel.modelcore.ImageVisibility("hidden");
                that.CurrentPCElemModel.modelcore.ImageUriString("");
                that.MarkDesignerDirty();
            }

        };
        that.ImageURIChangedHandler = function (newimageuri) {
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                var largesizeuri = newimageuri.replace("mgrimgthumb", "mgrimgsmall");
                //                var nourlx = largesizeuri.replace("url(", "");
                //                var nourlxx = nourlx.replace(")", "");
                that.CurrentPCElemModel.modelcore.ImageUriString(largesizeuri);
                //                that.CurrentPCElemModel.modelcore.ImageOpacity(that.CurrentImgOpacity);ImageVisibility
                that.CurrentPCElemModel.modelcore.ImageVisibility("visible");
                that.MarkDesignerDirty();
            }
        };
        that.MakeNoColor = function () {
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                var targetproperty = that.TargetPropertyDxnry["colorssvc"];
                switch (true) {
                    case (targetproperty == "BackgroundStr"):
                        {
                            that.CurrentPCElemModel.modelcore.BackgroundStr(prweb.brushes.WhiteBrush);
                            that.MarkDesignerDirty();
                            break;
                        }
                    case (targetproperty == "CheckBoxBackgroundStr"):
                        {
                            that.CurrentPCElemModel.modelcore.CheckBoxBackgroundStr(prweb.brushes.WhiteBrush);
                            that.MarkDesignerDirty();
                            break;
                        }
                }
                targetproperty = null;
            }
        };

        that.UpdateGradientOpacity = function (opacityval) {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                var targetproperty = that.TargetPropertyDxnry["colorssvc"];
                switch (true) {
                    case (targetproperty == "BackgroundStr"):
                        {
                            that.CurrentPCElemModel.modelcore.BackgroundOpacity(opacityval);
                            break;
                        }
                    case (targetproperty == "CheckBoxBackgroundStr"):
                        {
                            that.CurrentPCElemModel.modelcore.CheckBoxBackgroundOpacity(opacityval);
                            break;
                        }
                };
                targetproperty = null;
            }
            return rslt;
        };

        that.UpdateGradientBrush = function (opacityval) {
            var rslt = false;
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                var targetproperty = that.TargetPropertyDxnry["colorssvc"];
                switch (true) {
                    case (targetproperty == "BackgroundStr"):
                        {
                            that.CurrentPCElemModel.modelcore.BackgroundStr(prweb.colorssvc.GetBackgroundColorColxn());
                            that.CurrentPCElemModel.modelcore.BackgroundOpacity(opacityval);
                            that.CurrentPCElemModel.modelcore.BackgroundVisibility("visible");
                            that.MarkDesignerDirty();
                            break;
                        }
                    case (targetproperty == "CheckBoxBackgroundStr"):
                        {
                            that.CurrentPCElemModel.modelcore.CheckBoxBackgroundStr(prweb.colorssvc.GetBackgroundColorColxn());
                            that.CurrentPCElemModel.modelcore.CheckBoxBackgroundOpacity(opacityval);
                            that.MarkDesignerDirty();
                            //                            that.CurrentPCElemModel.modelcore.BackgroundVisibility("visible");
                            break;
                        }
                    case (targetproperty == "RadioButtonOnStr"):
                        {
                            that.CurrentPCElemModel.modelcore.CheckBoxForegroundStr(prweb.colorssvc.GetRBForegroundColorColxn());
                            that.MarkDesignerDirty();
                            break;
                        }
                    case (targetproperty == "RadioButtonOffStr"):
                        {
                            that.CurrentPCElemModel.modelcore.CheckBoxBackgroundStr(prweb.colorssvc.GetRBBackgroundColorColxn());
                            that.MarkDesignerDirty();
                            break;
                        }
                };
                targetproperty = null;
            }
            return rslt;
        };

        that.ColorChangedHandler = function (newcolorvaluestring) {
            if (that.CurrentDesignerItemContext && that.CurrentPCElemModel) {
                that.MarkDesignerDirty();
                if (that.TargetPropertyDxnry["colorssvc"]) {
                    var targetproperty = that.TargetPropertyDxnry["colorssvc"];
                    switch (true) {
                        case (targetproperty == 'SelectedText'):
                            //                            prweb.designertextsvc.ExecuteColor(newcolorvaluestring); this should update the fill of the Font Color Btn #dsgnrtextcolorbtntext
                            break;
                        case (targetproperty == "BackgroundStr"):
                            that.CurrentPCElemModel.modelcore.BackgroundVisibility("visible");
                            break;
                        case (targetproperty == "ForegroundStr"):
                            that.CurrentPCElemModel.modelcore.ForegroundStr(newcolorvaluestring);

                            break;
                        case (targetproperty == "BorderBrushStr"):
                            that.CurrentPCElemModel.modelcore.BorderBrushStr(newcolorvaluestring);
                            break;
                        case (targetproperty == "CheckBoxBackgroundStr"):
                            //                            that.CurrentPCElemModel.modelcore.CheckBoxBackgroundStr(newcolorvaluestring);
                            break;
                        case (targetproperty == "CheckBoxForegroundStr"):
                            that.CurrentPCElemModel.modelcore.CheckBoxForegroundStr(newcolorvaluestring);
                            break;
                        case (targetproperty == "CheckBoxBorderBrushStr"):
                            that.CurrentPCElemModel.modelcore.CheckBoxBorderBrushStr(newcolorvaluestring);
                            break;
                        case (targetproperty == "RadioButtonOnStr"):
                            //                            that.UpdateRadioButtonBrush();
                            break;
                    };
                }
            }
        };

        that.IdentifyTargetPropertyOnModel = function (stylesvc, targetpropertyname) {
            that.TargetPropertyDxnry[stylesvc] = targetpropertyname; // e.g. colorssvc, background, e.g., colorssvc, border
            prweb.colorssvc.IsRadioButtonTarget = false;
            prweb.colorssvc.IsBackgroundGradientTarget = false;
            switch (true) {
                case (stylesvc == "colorssvc" && (targetpropertyname == "BackgroundStr" || targetpropertyname == "CheckBoxBackgroundStr")):
                    {
                        prweb.colorssvc.IsBackgroundGradientTarget = true;
                        break;
                    };
                case (stylesvc == "colorssvc" && targetpropertyname == "RadioButtonOnStr"):
                    {
                        prweb.colorssvc.IsRadioButtonTarget = true;
                        break;
                    };
                case (stylesvc == "colorssvc" && targetpropertyname == "RadioButtonOffStr"):
                    {
                        prweb.colorssvc.IsRadioButtonTarget = true;
                        break;
                    };
            }
        };

        that.ManageStylingSvcsSubscriptions = function (designeridorfalse) {
            //should remove active subscriptions first....
            if (designeridorfalse) {
                prweb.colorssvc.IsDesignerItemContext = true;
                // keep only one subscription...
                if (!that.ActiveStylingSvcSubscriptions["colorssvc"]) {
                    that.ActiveStylingSvcSubscriptions["colorssvc"] = prweb.colorssvc.SubscribeToColorChanged(that.ColorChangedHandler);
                }
            }
            else {
                prweb.colorssvc.IsDesignerItemContext = false; //only do colorchanges when there is a designeritemcontext...
            } //remove subscriptions?
        };


        //#endregion

        //#region ChangeSurveyContext

        that.ChangeSurveyContext = function (e) {
            //the following stuff should be done once ManageChangeSurveyDialog is complete...
            that.IsDesignerDirty = false;
            that.ImpliedPageManager('reset', null);
            that.PCMColxnDispose();
            that.PCMColxn = {
            };
            prweb.designersavesurveysvc.ResetDesignerMetaDataSvc();
            switch (true) {
                case (!e.newcontext):
                    {
                        that.Vmx.surveymodelcontext(false);
                        break;
                    };
                case (e.newcontext > 0):
                    {// retrieve PCMmodel from the server...and put that model in designersvc.PCMColxn...
                        prweb.designerpcmsvc.SurveyContext = e.newcontext;
                        that.Vmx.surveymodelcontext(e.newcontext);
                        that.ShowExitCloseSaveButtons();
                        that.ImpliedPageManager('initstored', false);
                        break;
                    };
                case (e.newcontext == -1):
                    {
                        prweb.designerpcmsvc.SurveyContext = e.newcontext;
                        that.Vmx.surveymodelcontext(e.newcontext);
                        that.MarkDesignerDirty();
                        that.ShowExitCloseSaveButtons();
                        that.ImpliedPageManager('initnew', 1);
                        break;
                    };
            };
            return;
        };


        //#endregion

        //#region VMX Methods Init Dispose Subscribe DesignerContextChangeHandler SurveyContextChangeHandler

        that.isNewVmx = false;

        that.DesignerItemContextChangeHandler = function (newvalue) {
            if (newvalue !== that.CurrentDesignerItemContext) {
                //                if (that.CurrentDesignerItemContext) {
                //                    prweb.pubsub.publish("prweb_designerinactive" + that.CurrentDesignerItemContext);
                //                }
                that.LastDesignerItemContext = that.CurrentDesignerItemContext;
                that.CurrentDesignerItemContext = newvalue; //
                prweb.appsvc.populateDesignerItemContext(that.CurrentDesignerItemContext); //this makes the styles button show/hide on the app button bar...
                if (!newvalue) {
                    prweb.designerpanelsmgr.CloseDesignerPanelsRequiringDIContext();
                }
                that.PopulateCurrentPCElemModel();
                that.ManageStylingSvcsSubscriptions(newvalue);
                prweb.pubsub.publish(prweb.events.designersvc.designeritemcontextchanged, newvalue);
            }
            else {
                alert("designersvc.DesignerItemContextChangeHandler sees designercontextChange...but newvalu equals CurrentDesignerItemContext...");
            }
            newvalue = null;
            return;
        };

        that.SurveyContextChangeHandler = function (newvalue) {
            if (newvalue !== that.CurrentSurveyContext) {
                //                that.ImpliedPageManager('reset', null);
                that.LastSurveyContext = that.CurrentSurveyContext;
                that.CurrentSurveyContext = newvalue;
                prweb.designerpcmsvc.SurveyContext = newvalue;
                that.Vmx.hassurveycontext(that.HasSurveyContext());
                that.Vmx.hassurveypagescontext(that.HasSurveyPagesContext());
                prweb.appsvc.populateDesignSurveyContext(that.CurrentSurveyContext);
            }
            newvalue = null;
            return;
        };

        that.VMXSubscriptions = {};
        that.SubscribetoVmxChanges = function () {
            that.VMXSubscriptions["designeritemcontext"] = that.Vmx.designeritemcontext.subscribe(that.DesignerItemContextChangeHandler);
            that.VMXSubscriptions["surveymodelcontext"] = that.Vmx.surveymodelcontext.subscribe(that.SurveyContextChangeHandler);
            return true;
        };

        that.PopulatePCMContext = function (pcmid) {
            if (that.IsReady) {
                that.Vmx.pcmcontext(pcmid);
            }
            pcmid = null;
            return;
        };

        that.HasSurveyContext = function () {
            var rslt = false;
            if (that.CurrentSurveyContext) {
                rslt = true;
            }
            return rslt;
        };
        that.HasDesignerItemContext = function () {
            var rslt = false;
            if (that.CurrentDesignerItemContext) {
                rslt = true;
            }
            return rslt;
        };
        that.HasSurveyPagesContext = function () {
            var rslt = false;
            if (that.CurrentSurveyContext) {
                rslt = true;
            }
            return rslt;
        };

        //SEE PopulateVmx below....this method is called by ko whenever vmx.currentpagenumber mutates....the designer ui only knows about 
        // the pcelements returned by this method in pcelemcolxn...
        that.PCElemCoxnforPageNumber = function (pgnum) {
            var rslt = null;
            var pcmsvcrslt = prweb.designerpcmsvc.PCMforPageNumber(pgnum);
            if (pcmsvcrslt) {
                rslt = pcmsvcrslt.pcelemcolxn;
            }
            else {
                rslt = ko.observableArray(); // this is a dummy empty observablearray for the designer to show...
            }
            pcmsvcrslt = null;
            return rslt;
        };

        that.populateVmx = function () {
            // do stuff to that.Vmx.somepropertyname here....e.g.
            prweb.designerpcmsvc.NewPCM(1); // this is a default pagecontentmodel...represents a blank survey page with no pagecontentelements...
            that.Vmx.currentpagenumber(1);
            that.Vmx.currentpcelemcolxn = ko.computed(function () {
                var pgnum = that.Vmx.currentpagenumber();
                return that.PCElemCoxnforPageNumber(pgnum); //returns an observablearray...of pcelements if any...;
            }, this);
            return true;
        };

        that.InitializeVMX = function () {
            that.Vmx = {
                pagescount: ko.observable(1),
                message: ko.observable("loading designer..."),
                currentpagenumber: ko.observable(1),
                currentpcelemcolxn: null, // becomes a ko.computed in that.populateVmx
                //pcmcolxn: ko.observable(that.PCMColxn), //this is a dxnry of pcmentry....add new page puts a new pageentry in here....
                pcmcontext: ko.observable(), //is a pcmid
                currentPCM: ko.observable(), // this is a PCMEntry...it has a colxn of pcelements...each pcelement becomes a DesignerItem on the DesignerHome.designcanvas...
                currentDesignerItem: ko.observable(),
                designeritemcontext: ko.observable(false), // is a designeritemid
                surveymodelcontext: ko.observable(), //prweb.surveymodelsvc.viewModelx().mysurveymodel,
                hassurveycontext: ko.observable(false),
                hassurveypagescontext: ko.observable(false),
                widgetizeAddedElement: function (elem) {
                    try {
                        $(elem).designeritem();
                    }
                    catch (ex) {
                        alert("designersvc.Vmx.widgetizeAddedElement reports error..." + ex.Message);
                    }
                    elem = null;
                    return true;
                }
            };
            return true;
        };

        that.DestroyVMX = function () {
            if (that.Vmx) {
                that.Vmx.currentpcelemcolxn.dispose(); //ko.computeds have to be dispose()...
                delete that.Vmx.currentpcelemcolxn;
                delete that.Vmx.hassurveycontext;
                delete that.Vmx.surveymodelcontext;
                delete that.Vmx.designeritemcontext;
                delete that.Vmx.currentDesignerItem;
                delete that.Vmx.currentPCM;
                delete that.Vmx.pcmcontext;
                delete that.Vmx.currentpagenumber;
                delete that.Vmx.pagescount;
                delete that.Vmx.widgetizeAddedElement;
                delete that.Vmx.hassurveypagescontext;
                //                that.Vmx = null;
                delete that.Vmx;
            }
            return;
        };

        that.PCMColxnDispose = function () {
            var pcolxn = null;
            if (that.PCMColxn) {
                for (var k in that.PCMColxn) {
                    pcolxn = that.PCMColxn[k].pcelemcolxn.removeAll();
                    for (var p in pcolxn) {
                        pcolxn[p].Dispose();
                        pcolxn[p] = null;
                        delete pcolxn[p];
                    };
                    pcolxn = null;
                    delete that.PCMColxn[k].pcmID;
                    that.PCMColxn[k].pcelemcolxn = null;
                    delete that.PCMColxn[k].pcelemcolxn;
                    delete that.PCMColxn[k];
                };
                delete that.PCMColxn;
            }
            return;
        };

        that.ShutdownDesignerSvc = function () {
            try {
                prweb.designerpanelsmgr.ShutDown();
                that.IsReady = false;
                var ps = prweb.pubsub.unsubscribe;
                ps(prweb.events.subscriberplatform.pagelistpageiconselected, that.NavigateToPageNumber, that);
                ps(prweb.events.imagesmgrsvc.selectedimgurlchanged, that.ImageURIChangedHandler, that);
                ps(prweb.events.dialoguemanager.dialoguecomplete, that.DialogueCompleteHandler, that);
                ps = null;
                for (var s in that.ActiveStylingSvcSubscriptions) {
                    that.ActiveStylingSvcSubscriptions[s].dispose();
                    that.ActiveStylingSvcSubscriptions[s] = null;
                    delete that.ActiveStylingSvcSubscriptions[s];
                };
                that.ActiveStylingSvcSubscriptions = null;
                for (var xs in that.VMXSubscriptions) {
                    that.VMXSubscriptions[xs].dispose();
                    that.VMXSubscriptions[xs] = null;
                    delete that.VMXSubscriptions[xs];
                };
                that.VMXSubscriptions = null;
                delete that.VMXSubscriptions;
                that.DestroyVMX();
                prweb.designerpcmsvc.IPNColxn = {
                };
                that.PCMColxnDispose();
                that.TargetPropertyDxnry = null;
                delete that.TargetPropertyDxnry;
                that.ActiveStylingSvcSubscriptions = null;
                delete that.ActiveStylingSvcSubscriptions;
                var papp = prweb.appsvc.DesignerSvcShutdown();
                //                papp();
                papp = null;
                that.CurrentPCElemModel = false;
                that.CurrentSurveyContext = false;
                that.CurrentPCMContext = false;
                that.CurrentDesignerItemContext = false;
                that.CurrentSurveyContext = false;
                that.CurrentPCMContext = false;
                that.DefaultSurveyContext = false;
                that.LastDesignerItemContext = false;
                that.LastSurveyContext = false;
                that.CurrentPCElemModel = false;
                that.donebtn = null;
                var dts = prweb.designertextsvc.Shutdown();
                dts = null;
            }
            catch (ex) {
                alert("prweb.designersvc.ShutDown reports error...");
            }
            finally {
                that.HideExitCloseSaveButtons();
                that.IsDesignerDirty = false;
                return;
            }
        };

        that.InitializeDesignerSvc = function () {
            if (prweb.IsTouch) {
                that.xevent = "tap.designersvc";
            }
            prweb.designerpanelsmgr.Initialize();
            that.IsDesignerDirty = false;
            //            that.ShowExitCloseSaveButtons();
            that.ActiveStylingSvcSubscriptions = {
            };
            that.TargetPropertyDxnry = {
            };
            that.VMXSubscriptions = {
            };
            that.PCMColxn = {
            };
            prweb.designerpcmsvc.IPNColxn = {
            };
            that.InitializeVMX();
            that.populateVmx();
            that.SubscribetoVmxChanges();
            that.IsReady = true;
            //            that.PopulateSurveyModelContext(prweb.appsvc.CurrentSurveyContext);
            that.VMXSubscriptions["currentpagenumber"] = that.Vmx.currentpagenumber.subscribe(that.PageNumberChangedHandler);
            that.VMXSubscriptions["pagescount"] = that.Vmx.pagescount.subscribe(that.PagesCountChangedHandler);
            //            var psms = prweb.surveymodelsvc;
            prweb.surveymodelsvc.PageCount = that.PCMColxnLength();
            var psms = prweb.surveymodelsvc.populatepageslistVMx();
            psms = null;
            var ps = prweb.pubsub.subscribe;
            ps(prweb.events.subscriberplatform.pagelistpageiconselected, that.NavigateToPageNumber, that);
            ps(prweb.events.imagesmgrsvc.selectedimgurlchanged, that.ImageURIChangedHandler, that);
            ps = null;
            var pimg = prweb.imagesmgrsvc.InitializeImagesMgrSvc();
            //            pimg();
            pimg = null;
            var papp = prweb.appsvc.DesignerSvcReady();
            //            papp();
            papp = null;
            return;
        };

        //#endregion

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
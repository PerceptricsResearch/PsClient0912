/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {
    prweb.designersavesurveysvc = (function () {

        //#region Class Variables

        var that = {};

        that.saveSurveyUrl = null;
        that.savePageUrl = null;

        that.PagePkgQueue = $({});

        //this is a dictionary of pagenumstoSave..ndx, pgnum...is used by NextPageNumToSave(), and PopulatePagesToSaveDxnry()
        that.PagesToSaveDxnry = {};

        that.CountofPagesToSave = 0;
        that.CountofPagesSaved = 0;

        //this stuff supports the assignment of unique responsemodel.Key1's to qoims when pages are saved....
        that.LastRmKey1 = 0;
        that.NextRmKey1 = function () {
            that.LastRmKey1++;
            return that.LastRmKey1;
        };

        //#endregion

        //#region DesignerMetaDataSvc Methods

        that.DesignerMetaDataSvcInitialized = false;
        that.InitializeDesignerMetaDataSvc = function (dmdo) {
            if (dmdo) {
                that.LastRmKey1 = dmdo.LastRMKey1;
            }
            that.DesignerMetaDataSvcInitialized = true;
        };
        that.ResetDesignerMetaDataSvc = function () {
            that.DesignerMetaDataSvcInitialized = false;
            that.LastRmKey1 = 0;
        };

        that.IPNSvc = (function () {
            var me = {};

            me.IsNormalPgNumStr = function (ipn, pgnumstring) {
                return (ipn.toString() == pgnumstring)
            };

            me.GetBoundingPgItemStrings = function (pgnum) {
                var rslt = false;
                try {
                    var orderedipn = Enumerable.From(prweb.designerpcmsvc.IPNColxn).OrderBy(function (x) { return x.Value.ipn }).ToArray();
                    var xlower = 0;
                    var xupper = orderedipn.length;
                    var lowerndx = (pgnum - 1) - 1; // i know...just to show orderipn is zero based... 
                    var upperndx = (pgnum - 1) + 1; // i know...just to show orderipn is zero based... 
                    if (orderedipn[lowerndx]) {
                        xlower = orderedipn[lowerndx].Value.pgItemPgNumberstring;
                    }
                    var uppernormal = false;
                    if (orderedipn[upperndx]) {
                        xupper = orderedipn[upperndx].Value.pgItemPgNumberstring;
                        uppernormal = me.IsNormalPgNumStr(orderedipn[upperndx].Value.ipn, xupper);
                    }
                    else {
                        uppernormal = true; //happens when this is the last row...
                    }
                    rslt = {
                        lowerpgnumstr: xlower,
                        upper: { pgnumstr: xupper,
                            isnormal: uppernormal
                        }
                    };
                }
                catch (ex) {
                    alert("prweb.designersavesurveysvc.IPNSvc.GetBoundingPgItemStrings reports " + ex.Message);
                }

                return rslt;
            };

            me.ToPgItemPageNumber = function (ipnrow) {
                var rslt = false;
                var pgnum = ipnrow.ipn;
                var pgitemstr = ipnrow.pgItemPgNumberstring;
                var isnormal = me.IsNormalPgNumStr(pgnum, pgitemstr);
                var ispcmpresent = (ipnrow.pcmcolxnNdx != false);
                var ispgitemstrempty = !(pgitemstr.length > 0);
                var boundingkeys = false;
                switch (true) {
                    case (!isnormal && ispcmpresent && ispgitemstrempty):
                        boundingkeys = me.GetBoundingPgItemStrings(pgnum);
                        if (boundingkeys) {
                            var betweenstr = null;
                            if (boundingkeys.upper.isnormal) {
                                rslt = pgnum;
                            }
                            else {
                                betweenstr = boundingkeys.lowerpgnumstr + boundingkeys.upper.pgnumstr;
                                rslt = betweenstr;
                            }
                        }
                        break;
                    case (!isnormal && ispcmpresent):
                        boundingkeys = me.GetBoundingPgItemStrings(pgnum);
                        if (boundingkeys) {
                            if (boundingkeys.upper.isnormal) {
                                rslt = pgnum;
                            }
                        }
                        break;
                }
                return rslt;
            };

            me.PrepareIPNColxnForSave = function () {
                try {
                    var orderedipn = Enumerable.From(prweb.designerpcmsvc.IPNColxn).OrderByDescending(function (x) { return x.Value.ipn }).ToArray();
                    for (var n in orderedipn) {
                        var ipnrow = orderedipn[n].Value;
                        var pcm = false;
                        if (ipnrow.pcmcolxnNdx) {
                            pcm = prweb.designersvc.PCMColxn[ipnrow.pcmcolxnNdx];
                            var newstring = me.ToPgItemPageNumber(ipnrow);
                            if (newstring) {
                                ipnrow.pgItemPgNumberstring = newstring;
                                pcm.PageItemModel.PageNumber = newstring;
                                ipnrow.pgItemSdsId = pcm.PageItemModel.SdsID;
                                ipnrow.pcmsdsid = pcm.pcmSdsID;
                                ipnrow.isDirty = true;
                            }
                            var dbgz = 2;
                        }
                    };
                }
                catch (ex) {
                    var dbgx = 2;
                }

            };


            return me;
        } ());


        that.GetDesignerMetaDataToSave = function () {
            //            that.IPNSvc.PrepareIPNColxnForSave();
            return { LastRMKey1: that.LastRmKey1,
                IPNColxn: Enumerable.From(prweb.designerpcmsvc.IPNColxn).OrderBy(function (x) { return x.Value.ipn }).ToArray()
            }
        };


        //#endregion

        //#region SurveyCompleteHandler and ErrorHandler

        that.ErrorHandler = function () {
            alert("prweb.designersavesurveysvc.sendRequest.ErrorHandler reports error...");
            // that.AddToPagePkgQueue();//queues up another attempt at SendPagePkgToServer...
        };

        that.SurveyCompletelySavedHandler = function () {
            prweb.dialoguemanager.PublishSaveDialogueComplete("surveysavecomplete");
        };

        //#endregion

        //#region UpdatePCMColxnwithDBIDs

        that.UpdatePCMColxnItemsWithDbIDs = function (pocolist) {
            //this puts the DbID on PCM/PCE's that were not previously stored in the DB...
            //the pocolist is what is returned from SubscriberMainController when a page is stored...
            // only have to do updates where any sdsid = -1 and dbid > 0....
            var rslt = true;
            try {
                var ndx = that.CountofPagesSaved + 1; //this is an index to a dictionary of pagenumstoSave..ndx, pgnum...
                var pgnum = that.PagesToSaveDxnry[ndx]; //this is the pgnumber of page that was just saved...
                var pcm = prweb.designerpcmsvc.PCMforPageNumber(pgnum); //prweb.designersvc.PCMColxn[pgnum]; //this is the page just saved...
                var ipnrow = prweb.designerpcmsvc.IPNRowforPgNum(pgnum);
                var testpceguids = pcm.pcelemcolxn();
                if (ipnrow) {
                    ipnrow.isDirty = false;
                }
                for (var k in pocolist) {
                    try {
                        var pocoitem = pocolist[k];
                        var cg = pocoitem._POCOGuid;
                        switch (true) {
                            case (pcm.PageItemModel.MyGuidStr == cg):
                                pcm.PageItemModel.SdsID = pocoitem._DB_ID;
                                ipnrow.pgItemSdsId = pocoitem._DB_ID;
                                break;
                            case (pcm.MyGuidStr == cg):
                                pcm.pcmSdsID = pocoitem._DB_ID;
                                ipnrow.pcmsdsid = pocoitem._DB_ID;
                                pcm.SurveyID = that.SavedSurveyID;
                                break;
                            case (true):
                                //spin thru the pcm.PCElemColxn looking for pcelem.MyGuid = cg.MyGuid
                                var pcelem = Enumerable.From(pcm.pcelemcolxn()).Where(function (x) { return x.MyGuidStr == cg }).FirstOrDefault();
                                if (pcelem) {
                                    pcelem.pcelemSdsID = pocoitem._DB_ID;
                                    pcelem.pcmID = pcm.pcmSdsID;
                                }
                                else {
                                    rslt = false;
                                    //                                alert("designersavesurveysvc.UpdatePCMColxnItemsWithDbIDs can't find pcelem with pocoitem.MyGuid...");
                                };
                                break;
                        }
                    }
                    catch (ex) {
                        alert("designersavesurveysvc.UpdatePCMColxnItemsWithDbIDs.For in pocolist reports error..." + ex.Message);
                    }
                };
            }

            catch (ex) {
                rslt = false;
                alert("designersavesurveysvc.UpdatePCMColxnItemsWithDbIDs reports error..." + ex.Message);
            }
            return rslt;
        };


        //#endregion

        //#region SendNextPage
        that.SendNextPage = function (pocolist) {
            try {
                //this needs to update any sdsid on pcm or pce in the designersvc.PCMColxn for this page just saved...
                var didupdate = that.UpdatePCMColxnItemsWithDbIDs(pocolist);
                that.CountofPagesSaved++;
                if (that.CountofPagesSaved != that.CountofPagesToSave) {
                    that.PagePkgQueue.dequeue("savesurveyq");
                }
                else {
                    that.PagePkgQueue.queue("savesurveyq", []);
                    that.SurveyCompletelySavedHandler();
                }
            }
            catch (ex) {
                alert("prweb.designersavesurveysvc.SendNextPage reports error...");
            }
        };


        //#endregion

        //#region NewGuid and guid generator
        //this is Guid stuff...
        that.fourDigits = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toLowerCase();
        };
        that.NewGuid = function () {
            return that.fourDigits() + that.fourDigits()
                     + that.fourDigits()
                     + that.fourDigits()
                     + that.fourDigits()
                     + that.fourDigits() + that.fourDigits() + that.fourDigits();
        };
        //#endregion



        //#region NewPagePkg
        that.NewPagePkg = function (pgnum) {
            var rslt = false;
            try {
                var pcm = prweb.designerpcmsvc.PCMforPageNumber(pgnum); //prweb.designersvc.PCMColxn[pgnum];
                //                pcm.PageItemModel.PageNumber = that.IPNSvc.ToPgItemPageNumber(pgnum);
                if (pcm.PageItemModel.PageNumber) {
                    var dbgx = 2;
                }
                else {
                    var dbgy = 2;
                }
                if (!pcm.PageItemModel.MyGuidStr) {
                    pcm.PageItemModel.MyGuidStr = that.NewGuid();
                }
                if (!pcm.MyGuidStr) {
                    pcm.MyGuidStr = that.NewGuid();
                    pcm.MyGuid = pcm.MyGuidStr;
                    pcm.PermanentGuidString = pcm.MyGuidStr;
                }
                var pcolxn = pcm.pcelemcolxn()
                for (var pc in pcolxn) {
                    if (!pcolxn[pc].MyGuidStr) {
                        pcolxn[pc].MyGuidStr = that.NewGuid();
                    }
                };
                //pgobj is a PCMJsonObject in js format...fields match PCMJsonObject type/class in SubscriberMainController...
                var xpgscnt = prweb.designerpcmsvc.IPNColxnLength();
                var pgobj = {
                    MyGuid: pcm.MyGuid,
                    MyGuidStr: pcm.MyGuidStr,
                    DesignerMetaData: null,
                    SurveyID: that.SurveyIDJustSaved,
                    PgNumber: pgnum,
                    pcmSdsID: pcm.pcmSdsID,
                    PermanentGuidString: pcm.PermanentGuidString,
                    PagesCount: xpgscnt,
                    PageItemModel: pcm.PageItemModel,
                    PCElementsColxn: ko.toJS(pcm.pcelemcolxn)
                };
                for (var p in pgobj.PCElementsColxn) {
                    pgobj.PCElementsColxn[p].modelcore.html = null;
                    if (!pgobj.PCElementsColxn[p].MyGuidStr) {
                        pgobj.PCElementsColxn[p].MyGuidStr = that.NewGuid();
                    }
                    if (pgobj.PCElementsColxn[p].QuestOptSetModel) {
                        var iocolxn = pgobj.PCElementsColxn[p].QuestOptSetModel.ItemsObservableColxn;
                        for (var q in iocolxn) {
                            var qoim = iocolxn[q];
                            switch (true) {
                                case (!qoim.RespONSEModel):
                                    {
                                        var rm = {
                                            ID: 0,
                                            QuestID: 0,
                                            Key1: that.NextRmKey1(),
                                            Key2: 0,
                                            Key3: 0
                                        }
                                        qoim.RespONSEModel = rm;
                                        //this rm also needs to get put on the corresponding pcm in designersvc.PCMColxn...
                                        pcm.pcelemcolxn()[p].QuestOptSetModel.ItemsObservableColxn()[q].RespONSEModel = rm;
                                        break;
                                    };
                                case (!qoim.RespONSEModel.Key1):
                                    {
                                        var newrmkey1 = that.NextRmKey1();
                                        qoim.RespONSEModel.Key1 = newrmkey1;
                                        //this rmkey1 also needs to get put on the corresponding pcm in designersvc.PCMColxn...
                                        pcm.pcelemcolxn()[p].QuestOptSetModel.ItemsObservableColxn()[q].RespONSEModel.Key1 = newrmkey1;
                                        break;
                                    };
                                case (qoim.RespONSEModel.Key1 > 0):
                                    {
                                        break;
                                    };
                            }
                        };
                    }
                };
                if (pgnum == 1) {
                    pgobj.DesignerMetaData = that.GetDesignerMetaDataToSave();
                }
                rslt = pgobj;
            }
            catch (ex) {
                alert("prweb.designersavesurveysvc.NewPagePkg pgnum= " + pgnum + "  reports " + ex.Message);
            }
            return rslt;
        };

        //#endregion

        //#region SendPagePkgToServer
        that.NextPageNumToSave = function () {
            var ndx = that.CountofPagesSaved + 1; //this is an index to a dictionary of pagenumstoSave..ndx, pgnum...
            var rslt = that.PagesToSaveDxnry[ndx]; //this is the pgnumber of page to be saved...
            return rslt;
        };

        that.SendPagePkgToServer = function () {
            try {
                var myurl = that.savePageUrl;
                var nxtpgnum = that.NextPageNumToSave();
                //                var xpgpkg = that.NewPagePkg(nxtpgnum);
                var dataToSend = {
                    PgPkg: that.NewPagePkg(nxtpgnum)
                };
                //            dataToSend.PgPkg = xpgpkg;
                //            var testDtSndStringify = JSON.stringify(dataToSend);
                if (dataToSend.PgPkg) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        cache: false,
                        data: JSON.stringify(dataToSend),
                        dataType: 'json',
                        contentType: 'application/json',
                        success: that.SendNextPage,
                        error: that.ErrorHandler
                    });
                }

                dataToSend = null;
                myurl = null;
                nxtpgnum = null;
            }
            catch (ex) {
                alert("prweb.designersavesurveysvc.SendPagePkgToServer reports error..." + ex.Message);
            }
        };

        //#endregion

        //#region UpdateSurveyIconListSvc
        that.SavedSurveyID = false;
        that.SurveyIDJustSaved = -1;
        that.SurveyIconModelForNewSurvey = false;
        that.UpdateSurveyIconListSvc = function (saversltpkg) {
            //Also NEED TO MAKE SURE APPCONTEXT and SURVEYCONTEXT are set to the new SURVEYID...
            //add a new row to surveyiconlistsvc vmx...
            //make sure to put the DbId from the pocoidpkg in SavedSurveyID...and on the surveyiconmodel row that gets put into surveyiconlist.vmx...
            // dequeue the next function in the savsurveyq
            try {
                that.SavedSurveyID = saversltpkg.poco._DB_ID;
                that.SurveyIDJustSaved = saversltpkg.poco._DB_ID;
                that.SurveyIconModelForNewSurvey = false;
                that.SurveyIconModelForNewSurvey = saversltpkg.surveyiconmodel; //could be a model or false...populated in the controller method.
                if (that.SurveyIconModelForNewSurvey) {
                    //presumably could queue a method here in surveymodelsvc that would add the surveyiconmodel to the the surveyiconlist Vmx...
                    prweb.surveyiconlistsvc.AddNewSurveyIconRow(that.SurveyIconModelForNewSurvey); //this just does the update immediately, not queued.
                }
                else {
                    //clear the retrievepagezeroUrl cache...if pagecount was changed by the designer...
                    //need to clear the urls for pages retrieved by surveyplayer or results
                    prweb.surveymodelsvc.ClearAllPageUrlCacheForCurrentSurvey();
                }
            }
            catch (ex) {
                alert("prweb.designersavesurveysvc.UpdateSurveyIconListSvc reports " + ex.Message);
            }
            finally {
                that.PagePkgQueue.dequeue("savesurveyq");
            }
        };


        //#endregion

        //#region NewSurveyItemPkg
        that.SurveyNameResult = false;
        that.NewSurveyItemPkg = function () {
            var simpkg = false;
            switch (true) {
                case (prweb.appsvc.CurrentSurveyContext == -1):
                    {
                        simpkg = {
                            MyGuid: "",
                            SIM: that.CurrentSurveyItemModel,
                            SIM_SDSID: -1,
                            SurveyName: that.SurveyNameResult || "New Survey"
                        };
                        break;
                    };
                case (prweb.appsvc.CurrentSurveyContext > 0):
                    {
                        simpkg = {
                            MyGuid: prweb.surveymodelsvc.SurveyGuidString(),
                            SIM: null,
                            SIM_SDSID: prweb.appsvc.CurrentSurveyContext,
                            SurveyName: that.SurveyNameResult || prweb.surveymodelsvc.SurveyName()
                        };
                        break;
                    };
            };
            return simpkg;
        };


        //#endregion

        //#region SendSurveyItemPkgToServer
        that.CurrentSurveyItemModel = {};

        that.SendSurveyItemPkgToServer = function () {
            try {
                var myurl = that.saveSurveyUrl;
                //                var nxtpgnum = that.NextPageNumToSave();
                //                var xpgpkg = that.NewPagePkg(nxtpgnum);
                var dataToSend = {
                    SimPkg: that.NewSurveyItemPkg()
                };
                //            dataToSend.PgPkg = xpgpkg;
                //            var testDtSndStringify = JSON.stringify(dataToSend);
                prweb.dataManager.sendRequest({
                    url: myurl,
                    cache: false,
                    data: JSON.stringify(dataToSend),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: that.UpdateSurveyIconListSvc,
                    error: that.ErrorHandler
                });
                dataToSend = null;
                myurl = null;
                nxtpgnum = null;
            }
            catch (ex) {
                alert("prweb.designersavesurveysvc.SendPagePkgToServer reports error..." + ex.Message);
            }
        };


        //#endregion

        //#region AddSurveyItem AddPagePkg ToQueue

        that.AddSurveyItemToPkgQueue = function () {
            that.PagePkgQueue.queue("savesurveyq", that.SendSurveyItemPkgToServer);
        };

        that.AddPageToPkgQueue = function () {
            that.PagePkgQueue.queue("savesurveyq", that.SendPagePkgToServer);
        };

        //#endregion

        that.DirtyPageNumbersCount = 0;

        that.DirtyPgNumbers = function () {
            var rslt = [];
            for (var k in prweb.designersvc.PCMColxn) {
                // do some selection here on pcm or pcecolxn properties...otherwise its a list of all pagenumbers...
                var ipnrow = prweb.designerpcmsvc.IPNRowforPCMColxnNdx(k);
                if (ipnrow) {
                    if (ipnrow.isDirty) {
                        rslt.push(ipnrow.ipn);
                    }
                }

            };
            return rslt;
        };

        //#region PopulatePagesToSaveDxnry
        that.PopulatePagesToSaveDxnry = function () {
            var rslt = false;
            that.IPNSvc.PrepareIPNColxnForSave();
            // use linq to get an ordered list of dirty pagenumbers...
            var dpnbrs = that.DirtyPgNumbers();
            var dirtypgnumslist = Enumerable.From(dpnbrs).OrderBy(function (x) { return x; }).ToArray();
            // for each dirtypgnum in dirtypgnumslist
            // increment countofPagesToSave...put dirtypgnum in PagesToSaveDxnry[countofPagesToSave] = dirtypgnum
            that.DirtyPageNumbersCount = dirtypgnumslist.length;
            if (that.DirtyPageNumbersCount > 0) {
                //put savesurveyitempkg in the queue...
                that.AddSurveyItemToPkgQueue();
                //then add all the savepagepkgs to the queue...
                for (var k in dirtypgnumslist) {
                    if (dirtypgnumslist[k] != 1) {
                        that.CountofPagesToSave++;
                        that.PagesToSaveDxnry[that.CountofPagesToSave] = dirtypgnumslist[k];
                        that.AddPageToPkgQueue(); //...puts another function entry in the PagePkgQueue 
                    }
                };
                //always have to save Page 1...save it last....it has lastRMKey1 object that needs to be saved...
                that.CountofPagesToSave++;
                that.PagesToSaveDxnry[that.CountofPagesToSave] = 1;
                that.AddPageToPkgQueue(); //...puts another function entry in the PagePkgQueue 
                rslt = true;
            }
            return rslt;
        };




        //#endregion

        //#region SaveSurvey
        that.SaveSurvey = function () {
            try {
                // i would like this guy to add modal progressbar/dialogue that survey is being saved...
                // and the success function on the sendRequest...would eliminate the progressbar and put up a confirm dialogue that survey successfully saved...
                //                alert("prweb.designersavesurveysvc.SaveSurvey is executing save...");
                //                prweb.dialoguemanager.ReqisterRequiredDialogue("savesurveybusy");
                that.PagePkgQueue.queue("savesurveyq", []); //clears the queue...
                that.DirtyPageNumbersCount = 0;
                that.CountofPagesToSave = 0;
                that.CountofPagesSaved = 0;
                that.PagesToSaveDxnry = {};
                if (that.PopulatePagesToSaveDxnry()) {
                    that.PagePkgQueue.dequeue("savesurveyq"); //start the queue...
                }
                else {
                    alert("prweb.designersavesurveysvc.SaveSurvey reports PagesToSaveDxnry has no pages...");
                }
            }
            catch (ex) {
                alert("prweb.designersavesurveysvc.SaveSurvey reports error " + ex.Message);
            }
        };

        //#endregion

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
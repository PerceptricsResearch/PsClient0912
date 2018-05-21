/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {
    prweb.rdentsurveyplayersvc = (function () {
        var that = {};

        //#region Variables and Utility functions
        that.actionContext = {
            currentpgnumber: 0
        };

        that.IsAtLastPage = function () {
            return (that.actionContext.currentpgnumber == that.PageCount);
        };

        that.PriorPageNumber = 0;

        that.PageCount = 3;

        //        that.MyPages = false;

        that.NxtPgUrl = false;

        that.ToNdx = function (pgNumber) {
            var rslt = ((pgNumber - 1) % 3); // 3 could sapiindexdxnry.lengthcount...
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
        that.PutPageHTMLinSapiItem = function (pageumber, sentry) {
            var rslt = false;
            try {
                //put PageDxnry(pagenumber).pageobj() in sapitem(sndx)
                var pgobjisloaded = that.PageNumberDxnry[pageumber.toString()].isloaded();
                if (pgobjisloaded) {
                    sentry.pgobj(that.PageNumberDxnry[pageumber.toString()].pgobj());
                }
                else {
                    //pgobj is not yet loaded...subscribe to that.PageNumberDxnry[PageNumber].pgobj change...
                    var pgobjsubscription = null;
                    pgobjsubscription = that.PageNumberDxnry[pageumber.toString()].pgobj.subscribe(function (pgcontent) {
                        sentry.pgobj(pgcontent);
                        pgobjsubscription.dispose();
                    });
                    //                    sentry.pgobj({
                    //                        pcelemcolxn: ko.observableArray()
                    //                    });
                }
            }
            catch (ex) {
                alert("prweb.rdentsurveyplayersvc.PutPageHTMLinSAPiItem reports " + ex.Message);
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
                            tstring = "translate3d(0,0,0)" + " scale(" + scale + ")" + " rotate(" + rot + "deg)"
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
                        $(elem).rdquestoptset({ model: mymodel });
                    }
                    else {
                        ko.applyBindings(mymodel, echild[0]);
                        echild = null;
                    }
                }
                return;
            }
            catch (ex) {
                alert("prweb.rdentsurveyplayersvc.SapiDxnry.widgetizeAddedElement reports " + ex.Message);
            }

            elem = null;
            return true;
        }

        //#region InitializeSapiItemsDxnry
        that.InitializeSapiItemsDxnry = function () {
            var makedxnryrow = function (kvp) {
                var sapientry = {
                    pgnum: ko.observable(false),
                    pgobj: ko.observable({
                        pcelemcolxn: ko.observableArray()
                    }),
                    isvisible: ko.observable(false),
                    widgetizeAddedElement: that.WigdetizeElement,
                    myindex: kvp,
                    makeInactive: null,
                    makeActive: null,
                    onpgnumchange: null,
                    changepgnum: null,
                    scrolltoposition: 0,
                    priorpgnum: false
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
                        that.PutPageHTMLinSapiItem(newpgnum, sapientry);
                    }
                    //                    var dbx = self.pgobj();
                    return true;
                };
                sapientry.changepgnum = function (newpgnum) {
                    sapientry.makeActive();
                    sapientry.priorpgnum = sapientry.pgnum();
                    sapientry.pgnum(newpgnum);
                    return true
                };
                sapientry.clear = function () {
                    sapientry.isvisible(false);
                    sapientry.pgnum(false);
                    sapientry.priorpgnum = false;
                    sapientry.pgobj({
                        pcelemcolxn: ko.observableArray()
                    });
                };
                sapientry.pgnum.subscribe(sapientry.onpgnumchange);

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
                alert("prweb.rdentsurveyplayersvc.InitializeSapiItemsDxnry reports " + ex.Message);
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
                alert("prweb.rdentsurveyplayersvc.CraftPageUrl reports " + ex.Message);
            }

            return rslt;
        };
        //#endregion

        that.InitializePageDxnry = function () {
            var makedxnryrow = function (kvp) {
                var pageentry = {
                    isloaded: ko.observable(false), //isloaded is true for testing...
                    pgobj: ko.observable(false),
                    pgnum: kvp,
                    tohtml: null,
                    retrievePage: null
                };
                //                var self = pageentry;
                pageentry.tohtml = function (pcecolxn, pcmid) {
                    var rslt = [];
                    try {
                        for (var n in pcecolxn) {
                            var presT = pcecolxn[n].modelcore.presenterT;
                            var obspcelem = prweb.observablemodelsvc.PCElemFromJSData(pcecolxn[n], pcmid);
                            obspcelem.modelcore.html(that.PCElemHtmlDxnry[presT]);
                            rslt.push(obspcelem);
                        }
                    }
                    catch (ex) {
                        alert("prweb.rdentsurveyplayersvc.PageDxnry.pagentry.tohtml reports " + ex.Message);
                    }
                    return rslt;
                };
                pageentry.makepgobj = function (pcmodel) {
                    var rslt = false;
                    try {
                        var obspcelemcolxn = pageentry.tohtml(pcmodel.PCElementsColxn, pcmodel.pcmSdsID);
                        pageentry.isloaded(true);
                        pageentry.pgobj({
                            pcelemcolxn: ko.observableArray(obspcelemcolxn)
                        });
                        //                        var test1 = pageentry.pgobj().pcelemcolxn();
                        obspcelemcolxn = null;
                        rslt = true;
                    }
                    catch (ex) {
                        alert("prweb.rdentsurveyplayersvc.PageDxnry.pagentry.makepgobj reports " + ex.Message);
                    }
                    return rslt;
                };
                var pgurl = that.CraftPageUrl(kvp);
                pageentry.retrievePage = function () {
                    var rslt = false;
                    try {
                        if (!pageentry.isloaded()) {
                            var myurl = pgurl;
                            var xdbg = 2;
                            if (myurl) {
                                prweb.dataManager.sendRequest({
                                    url: myurl,
                                    success: function (pcmodel) {
                                        try {
                                            rslt = pageentry.makepgobj(pcmodel);
                                        }
                                        catch (ex) {
                                            alert("prweb.rdentsurveyplayersvc.pagentry.retrievepage.successhandler reports " + ex.Message);
                                        }
                                    },
                                    error: function (e) {
                                        alert('prweb.rdentsurveyplayersvc.pageentry.retrievepage.sendRequest reports error...' + e.toString());
                                    }
                                });
                            }
                        }
                        else {
                            rslt = true;
                        }
                    }
                    catch (ex) {
                        "prweb.rdentsurveyplayersvc.pagentry.retrievepage reports " + ex.Message
                    }
                    return rslt;
                };
                that.PageNumberDxnry[kvp] = pageentry;

                return true // this gives me a viewmodel PageNumberDxnry[x].isloaded(), .pgobj()......
            };
            if (that.PageCount > 0) {
                Enumerable.RangeTo(1, that.PageCount).ForEach(function (kvp) { return makedxnryrow(kvp.toString()) });
            }
            return true
        };
        //#endregion

        //#region SapiDxnry and PageDxnry Utilties
        that.PublishPageChangeEvents = function () {
            var newpgnum = that.actionContext.currentpgnumber;
            //            var priorpgnumber = that.PriorPageNumber;
            if (newpgnum == that.PageCount) {
                prweb.responsesvc.EvaluateSurveyComplete();
            }
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
                alert("prweb.rdentsurveyplayersvc.PopulatePgEntryPageObj reports " + ex.Message);
            }
            return rslt;
        };

        that.ConfigureSurroundingPages = function (curpgnum) {
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
                alert("prweb.rdentsurveyplayersvc.ConfigureCurrentSapiItem reports " + ex.Message);
            }
            return rslt;
        };

        that.PopulateCurrentPageNumber = function (newpgnum) {
            var rslt = that.ConfigureCurrentSapiItem(newpgnum);
            //            var priorpgnumber = that.actionContext.currentpgnumber;
            //            that.PriorPageNumber = priorpgnumber;
            that.actionContext.currentpgnumber = parseInt(newpgnum);
            return rslt;
        };

        that.Initialize = function (pgcount) {
            try {
                that.PageCount = pgcount;
                that.InitializePageDxnry();
            }
            catch (ex) {
                alert("prweb.rdentsurveyplayersvc.Initialize reports " + ex.Message);
            }
        };
        //#endregion

        //#region setUpScrollApi
        that.GetSapiDxnryLength = function () {
            var rslt = 3;
            return rslt;
        };
        that.setUpScrollApi = function () {
            try {
                that.scrollapi = that.newScrollApi();
                that.actionContext.currentpgnumber = 1;
                that.scrollapi.prwcurrentndx = 0;
                that.scrollapi.prwcurrentpage = 1;
                that.scrollapi.isscrollto = false;
                that.scrollapi.isPrev = false;
                that.scrollapi.isNext = false;
                that.scrollapi.prwnxtbtn = $("#surveyplayernext");
                that.scrollapi.prwprevbtn = $("#surveyplayerprev");
                if (that.scrollapi.prwpgcount == 1) {
                    that.scrollapi.prwnxtbtn.hide();
                };
                that.InitializeSapiItemsDxnry();
                that.scrollapi.sizethePagesPanel();
                that.scrollapi.addWindowResizeHandler();
                var konode = $("#surveyplayersurveycontainer");
                ko.applyBindings(that.Vmx, konode[0]);
                konode = null;
            }
            catch (ex) {
                alert("prweb.rdentsurveyplayersvc.setUpScrollApi reports " + ex.Message);
            }
        };

        //#endregion

        //#region ScrollAPI
        that.scrollapi = false;

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
                //                var cndx = sapi.getIndex();
                //                for (var ndx = 0; ndx < 3; ndx++) {
                //                    if (cndx != ndx) {
                //                        that.SapiIndexDxnry[ndx.toString()].makeInactive();
                //                    }
                //                };
            };
            sapi.$container = $("#surveyplayersurveycontainer");
            sapi.$panel = $("#surveyplayersurveyscrollable");
            sapi.$items = $("#surveyplayersurveyitems");
            sapi.beforeSeekHandler = function (i) {
                var rslt = false;
                sapi.isNext = false;
                sapi.isPrev = false;
                if (i >= 0) {
                    try {
                        if (sapi.isscrollto) {
                            sapi.isscrollto = false;
                            if (parseInt(sapi.scrolltoTargetPgNum) <= sapi.prwpgcount) {
                                rslt = true;
                                that.PriorPageNumber = that.actionContext.currentpgnumber;
                                that.actionContext.currentpgnumber = parseInt(sapi.scrolltoTargetPgNum);
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
                        alert("prweb.rdentsurveyplayersvc.beforeSeekHandler reports " + ex.Message);
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
                        that.ConfigureSurroundingPages(that.actionContext.currentpgnumber);
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
                    that.PublishPageChangeEvents();
                    //                    sapi.makeOtherSapiItemsInactive();
                }
                catch (ex) {
                    alert("prweb.rdentsurveyplayersvc.scollapi.afterseekhandler reports " + ex.Message);
                }

                return rslt;
            };

            sapi.isResizing = false;
            sapi.sizethePagesPanel = function () {
                var fixleft = 0;
                try {
                    var itemndx = sapi.getIndex();
                    var itemslctor = "#surveyplayersurveypage" + itemndx;
                    //                    var $panel = sapi.$panel;
                    var scale = sapi.$container.attr("data-scale");
                    var pw = sapi.$panel.innerWidth();
                    var ph = sapi.$panel.innerHeight();
                    var $item = $(itemslctor);
                    if ($item.length == 1) {
                        //                        $panel.scrollLeft(0);
                        var $itemparent = $item.parent();
                        sapi.$items.stop(true, true);
                        var pos = $itemparent.css("width", pw + "px").css("height", ph + "px").position();
                        var posleft = pos.left / scale;
                        var ipw = $itemparent.innerWidth();
                        var iph = $itemparent.innerHeight();
                        $item.css("height", iph + "px").css("width", ipw + "px"); //.css("width", ipw + "px");
                        //                        $panel = null;
                        $item = null;
                        itemslctor = null;
                        fixleft = -posleft;
                        pw = null;
                    }
                    else {
                        alert(itemslctor + " impliedpgnum=" + sapi.myimpliedpgnum)
                    }
                }
                catch (ex) {
                    alert("prweb.rdentsurveyplayersvc.sizethePagesPanel reports " + ex.Message);
                }
                return fixleft;
            };
            sapi.resizeAction = function () {
                clearTimeout(sapi.isResizing);
                sapi.isResizing = false;
                var fixleft = sapi.sizethePagesPanel();
                sapi.$items.clearQueue().stop(true, false).css("left", fixleft);
            };
            sapi.resizeHandler = function (e) {
                try {
                    if (e.handleObj.namespace == "spsapi") {
                        clearTimeout(sapi.isResizing);
                        sapi.isResizing = false;
                        sapi.isResizing = setTimeout(function () {
                            sapi.resizeAction();
                            return;
                        }, 200);
                    }
                }
                catch (ex) {
                    alert("prweb.rdentsurveyplayersvc.sapi.resizeHandler reports " + ex.Message);
                }
                return;
            };
            sapi.addWindowResizeHandler = function () {
                $(window).on("resize.spsapi", sapi.resizeHandler);
            };
            sapi.reset = function () {
                clearTimeout(sapi.isResizing);
                sapi.isResizing = false;
                sapi.prwpgcount = that.PageCount;
                sapi.scrolltoTargetPgNum = 1;
                sapi.$items.clearQueue().stop(true, true).css("left", 0);
                sapi.$panel.clearQueue().stop(true, true).scrollLeft(0);
                sapi.isscrollto = false;
                that.actionContext.currentpgnumber = 1;
            };
            sapi.dispose = function () {
                try {
                    $(window).off('resize.spsapi', sapi.resizeHandler);
                    clearTimeout(sapi.isResizing);
                    sapi.isResizing = false;
                }
                catch (ex) {
                    alert("prweb.rdentsurveyplayersvc.sapi.dispose reports " + ex.Message);
                }
            };
            return sapi;
        };
        //#endregion

        //#region AnimatePageChange
        that.CurrentItemNdx = 0;
        that.animatePageChange = function (direction) {
            try {
                if (!direction) {
                    that.scrollapi.isPrev = false;
                    that.scrollapi.isNext = false;
                    that.scrollapi.resizeAction();
                    that.scrollapi.afterSeekHandler();
                }
            }
            catch (ex) {
                alert("prweb.rdentsurveyplayersvc.animatepagechange reports " + ex.Message);
            }
        };
        //#endregion

        //#region AnimatePageLeaving Arriving
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
                alert("prweb.rdentsurveyplayersvc.AnimatePageLeaving reports " + ex.Message);
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
                        var priorndx = that.ToNdx(that.PriorPageNumber);
                        that.SapiIndexDxnry[priorndx.toString()].makeInactive();
                    }
                }
                });
            }
            catch (ex) {
                alert("prweb.rdentsurveyplayersvc.AnimatePageLeaving reports " + ex.Message);
            }
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
                    var fxleft = 0;
                    fxleft = that.scrollapi.sizethePagesPanel();
                    that.AnimatePageArriving(direction, fxleft, isnewpage);
                    that.scrollapi.afterSeekHandler();
                    that.ConfigureSurroundingPages();

                    clearTimeout(tx);
                    tx = null;
                }, 10);
            }
            catch (ex) {
                alert("prweb.rdentsurveyplayersvc.ManagePageChange.complete reports " + ex.Message);
            }
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
            var scrndx = that.ToNdx(parseInt(pgnum));
            that.scrollapi.isPrev = false;
            that.scrollapi.isNext = false;
            that.scrollapi.scrolltoTargetPgNum = parseInt(pgnum);
            that.scrollapi.isscrollto = true;
            if (that.scrollapi.beforeSeekHandler(scrndx)) {
                that.scrollapi.isscrollto = false;
                that.PopulateCurrentPageNumber(that.actionContext.currentpgnumber);
                that.animatePageChange(false);
            };
            that.scrollapi.isscrollto = false;
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
                            that.actionContext.currentpgnumber = 1;
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
                            that.scrollapi.prwpgcount = pagezerodata.pgcount;

                            that.SapiIndexDxnry["0"].changepgnum(1);
                            that.animatePageChange(false);
                            that.ConfigureSurroundingPages(1);
                            prweb.responsesvc.PageCount = pagezerodata.pgcount;
                            prweb.responsesvc.PlatformInitialize(pagezerodata.model.DesignerMetaData);
                        }
                        catch (ex) {
                            alert("prweb.rdentsurveyplayersvc.RetrievePageZero.successhandler reports " + ex.Message);
                        }
                    },
                    error: function (e) {
                        alert('prweb.rdentsurveyplayersvc.RetrievePageZero.sendRequest reports error...' + e.toString());
                    }
                });
            }
            catch (ex) {
                alert("prweb.rdentsurveyplayersvc.RetrievePageZero reports " + ex.Message);
            }
        };

        //#endregion

        that.pageZeroURL = false;
        that.SurveySelect = function () {
            try {
                var url = that.pageZeroURL;
                //                if (!url) {
                //                    url = prweb.surveymodelsvc.PageZeroURL();
                //                    //                    url = that.galleryVmx().gallery()[0].URL;
                //                }
                if (url) {
                    that.RetrievePageZero(url);
                }
            }
            catch (ex) {
                alert("prweb.rdentsurveyplayersvc.SurveySelect reports " + ex.Message);
            }
        };

        that.FinishPageObject = false;

        that.FinishPageURL = false;
        //called by responsesvc.surveycompleteaction...
        that.AddFinishPage = function () {
            try {
                var po = prweb.domaincontentsvc.DomainPagePlease("finish", 0);
                that.FinishPageObject = po;
            }
            catch (ex) {
                alert("prweb.rdentsurveyplayersvc.AddFinishPage reports " + ex.Message);
            }
        };
        //called by responsesvc.ConfirmResponseColxnSent
        that.ShowFinishPage = function () {
            try {
                prweb.responsesvc.SetMsgAreaSimpleText("Your responses have been sent.");
                if (that.FinishPageObject) {
                    prweb.responsesvc.MessageAreaVmx.pageentry(that.FinishPageObject); //.html;
                }
            }
            catch (ex) {
                alert("prweb.rdentsurveyplayersvc.ShowFinishPage reports " + ex.Message);
            }

        };
        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
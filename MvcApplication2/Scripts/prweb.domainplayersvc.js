/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.domainplayersvc = (function () {
        var dps = {};

        dps.NewPlayerSvc = function ($element) {
            var that = {};
            //#region Variables and Utility functions
            that.actionContext = {
                currentpgnumber: 0
            };

            that.PriorPageNumber = 0;

            that.ItemCountChangedSubscription = {};

            that.ICChangedHandler = function (newcount) {
                that.scrollapi.isNext = false;
                that.scrollapi.isPrev = false;
                that.scrollapi.afterSeekHandler();
                if (that.ItemCountChangedSubscription[that.CurrentDomain]) {
                    that.ItemCountChangedSubscription[that.CurrentDomain].dispose();
                    that.ItemCountChangedSubscription[that.CurrentDomain] = null;
                    delete that.ItemCountChangedSubscription[that.CurrentDomain];
                }
            };

            that.SubscribeToItemCountChanged = function (domain) {
                if (!that.ItemCountChangedSubscription[domain]) {
                    that.ItemCountChangedSubscription[domain] = prweb.domaincontentsvc.DomainDxnry[domain].ItemCountSubscribable.subscribe(that.ICChangedHandler);
                };
            };

            that.PageCount = function () {
                var rslt = 0;
                if (that.CurrentDomain) {
                    rslt = prweb.domaincontentsvc.PageCountforDomain(that.CurrentDomain);
                }
                //                else {
                //                    alert("prweb.domainplayersvc.PageCount reports CurrentDomain=" + that.CurrentDomain);
                //                }
                return rslt;
            };

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

            //            //associative dxnry of pcelements of T html...image, qoptset etc
            //            that.PCElemHtmlDxnry = {};

            // associative dxnry of SapiNdx and PageNumber...
            that.SapiIndexDxnry = {}; //ko.observableArray(); //{ "0": 1, "1": false, "2": false, "3": false, "4": false };

            // asociate dxnry of PageNumber and SapiNdxObject...is populated by the sendRequest:callback that loads html into sapi.prwpageitem...
            // if there is a 
            //            that.PageNumberDxnry = {}; //ko.observableArray();

            that.Vmx = {
                sdxnry: null,
                currentpgnum: ko.observable(1)
            };
            //#endregion

            that.CurrentDomain = false;

            //#region PutPageHTMLinSapiItem
            that.PutPageHTMLinSapiItem = function (pageumber, sentry) {
                var rslt = false;
                try {
                    if (that.CurrentDomain) {
                        sentry.pgobj(prweb.domaincontentsvc.DomainPagePlease(that.CurrentDomain, pageumber - 1));
                    }
                    else {
                        alert("prweb.domainplayersvc.PutPageHTMLinSAPiItem reports CurrentDomain=" + that.CurrentDomain);
                    }
                }
                catch (ex) {
                    alert("prweb.domainplayersvc.PutPageHTMLinSAPiItem reports " + ex.Message);
                }
                return rslt;
            };
            //#endregion

            //is called when ko foreach binding puts a pcelemT on a page...this doesn't actually call a widget, just does css from the model.
            //see InitializeSapiDxnry.sapientry.widgetizeAddedElement
            that.WigdetizeElement = function (elem) {
                try {

                }
                catch (ex) {
                    alert("prweb.domainplayersvc.SapiDxnry.widgetizeAddedElement reports " + ex.Message);
                }
                return true;
            }

            that.DefaultPgObj = function () {
                var rslt = prweb.domaincontentsvc.NewDRObservablePage();
                return rslt;
            };

            //#region InitializeSapiItemsDxnry
            that.InitializeSapiItemsDxnry = function () {
                var makedxnryrow = function (kvp) {
                    var sapientry = {
                        pgnum: ko.observable(false),
                        pgobj: ko.observable(that.DefaultPgObj()),
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
                        sapientry.pgobj(that.DefaultPgObj());
                        return;
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
                    alert("prweb.domainplayersvc.InitializeSapiItemsDxnry reports " + ex.Message);
                }
                return rslt;
            };
            //#endregion


            //#region SapiDxnry and PageDxnry Utilties
            that.PublishPageChangeEvents = function () {
                var newpgnum = that.actionContext.currentpgnumber;
                var priorpgnumber = that.PriorPageNumber;
            };
            //this is called by ConfigureCurrentSapiItem...and ConfigureSurroundingPages
            that.PopulatePgEntryPageObj = function (pgnum) {
                var rslt = false
                try {
                    if (pgnum <= that.PageCount()) {
                        var sentry = false;
                        sentry = that.SapiIndexDxnry[(that.ToNdx(pgnum)).toString()];
                        if (sentry) {
                            sentry.makeActive();
                            sentry.changepgnum(pgnum);
                            rslt = true;
                        }
                        pgnum = null;
                        sentry = null;
                    }
                    else {
                        rslt = true;
                    }
                }
                catch (ex) {
                    alert("prweb.domainplayersvc.PopulatePgEntryPageObj reports " + ex.Message);
                }
                return rslt;
            };

            that.ConfigureSurroundingPages = function (curpgnum) {
                //                that.PopulatePgEntryPageObj(curpgnum + 1)
            };

            that.ConfigureCurrentSapiItem = function (curpgnum) {
                //this is called by PopulateCurrentPageNumber...
                // changing SapiDxnry[ndx].pgnum causes it onpgnumchangehandler to fire...configures its pgobj....see InitializeSapiItemsDxnry and PutPageHTMLinSapiItem
                var rslt = false;
                try {
                    rslt = that.PopulatePgEntryPageObj(curpgnum);
                    //                    rslt = that.SapiIndexDxnry[that.ToNdx(curpgnum)].changepgnum(curpgnum);
                }
                catch (ex) {
                    alert("prweb.domainplayersvc.ConfigureCurrentSapiItem reports " + ex.Message);
                }
                return rslt;
            };

            that.PopulateCurrentPageNumber = function (newpgnum) {
                //this is called by OnBeforeSeekHAndler...
                var rslt = that.ConfigureCurrentSapiItem(newpgnum);
                var priorpgnumber = that.actionContext.currentpgnumber;
                that.PriorPageNumber = priorpgnumber;
                that.actionContext.currentpgnumber = newpgnum;
                return rslt;
            };
            //#endregion

            //#region setUpScrollApi
            that.GetSapiDxnryLength = function () {
                var rslt = 3;
                return rslt;
            };
            that.scrollapi = false;
            that.setUpScrollApi = function (selectors) {
                try {
                    that.scrollapi = that.newScrollApi(selectors);
                    that.actionContext.currentpgnumber = 1;
                    that.scrollapi.isscrollto = false;
                    that.scrollapi.isPrev = false;
                    that.scrollapi.isNext = false;
                    that.scrollapi.prwnxtbtn = $(selectors.next);
                    that.scrollapi.prwprevbtn = $(selectors.prev);
                    if (that.scrollapi.prwpgcount() == 1) {
                        that.scrollapi.prwnxtbtn.hide();
                    };
                    //                that.MyPages = $(".domainplayersurveypage", "#domainplayersurveycontainer");
                    that.InitializeSapiItemsDxnry();
                    that.scrollapi.sizethePagesPanel();
                    that.scrollapi.addWindowResizeHandler();
                    var konode = $(selectors.konode, $element);
                    ko.applyBindings(that.Vmx, konode[0]);
                    konode = null;
                }
                catch (ex) {
                    alert("prweb.domainplayersvc.setUpScrollApi reports " + ex.Message);
                }
            };
            //#endregion

            //#region ScrollAPI
            that.newScrollApi = function (selectors) {
                var sapi = {
                    getIndex: null,
                    sizethePagesPanel: null,
                    beforeSeekHandler: null,
                    afterSeekHandler: null,
                    isResizing: null,
                    resizeAction: null,
                    prwpgcount: 0,
                    isscrollto: true,
                    scrolltoTargetPgNum: 1,
                    isPrev: false,
                    isNext: false,
                    prwnxtbtn: false,
                    prwprevbtn: false,
                    nxtpgurl: false
                };
                sapi.prwpgcount = function () {
                    return that.PageCount();
                };
                sapi.getIndex = function () {
                    return that.ToNdx(that.actionContext.currentpgnumber);
                }
                sapi.$container = $(selectors.container);
                sapi.$panel = $(selectors.panelscrollable);
                sapi.$items = $(selectors.items);
                sapi.makeOtherSapiItemsInactive = function () {
                    //                    var cndx = sapi.getIndex();
                    //                    for (var ndx = 0; ndx < 3; ndx++) {
                    //                        if (cndx != ndx) {
                    //                            that.SapiIndexDxnry[ndx.toString()].makeInactive();
                    //                        }
                    //                    };
                };

                sapi.beforeSeekHandler = function (i) {
                    var rslt = false;
                    sapi.isNext = false;
                    sapi.isPrev = false;
                    if (i >= 0) {
                        try {
                            if (sapi.isscrollto) {
                                //the issscrollto method...surveyview.navigatetopgnumber...sets scrolltoTargetPgNum..
                                sapi.isscrollto = false;
                                if (sapi.scrolltoTargetPgNum <= sapi.prwpgcount()) {
                                    rslt = true;
                                    that.actionContext.currentpgnumber = sapi.scrolltoTargetPgNum;
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
                                    if (that.actionContext.currentpgnumber < sapi.prwpgcount()) {
                                        rslt = true;
                                    }
                                    that.actionContext.currentpgnumber = Math.min(sapi.prwpgcount(), that.actionContext.currentpgnumber + 1);
                                }
                                else if (sapi.isPrev) {
                                    if (that.actionContext.currentpgnumber > 0) {
                                        rslt = true;
                                    }
                                    that.actionContext.currentpgnumber = Math.max(1, that.actionContext.currentpgnumber - 1);
                                }
                            }
                            //                            var xxrslt = that.PopulateCurrentPageNumber(sapi.prwcurrentpage);
                            //                            xxrslt = null;
                        }
                        catch (ex) {
                            alert("prweb.domainplayersvc.beforeSeekHandler reports " + ex.Message);
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
                        if (that.actionContext.currentpgnumber < sapi.prwpgcount()) {
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
                        sapi.makeOtherSapiItemsInactive();
                    }
                    catch (ex) {
                        alert("prweb.domainplayersvc.scollapi.afterseekhandler reports " + ex.Message);
                    }

                    return rslt;
                };
                sapi.isResizing = false;
                sapi.sizethePagesPanel = function () {
                    var fixleft = 0;
                    try {

                        //                        $("#rddomainplayerscrollable", $element).scrollLeft(0);
                        var itemndx = sapi.getIndex();
                        var itemslctor = selectors.pagecontent + itemndx;
                        //                        var $panel = $(selectors.panelscrollable);
                        var scale = sapi.$container.attr("data-scale");
                        var pw = sapi.$panel.innerWidth();
                        var ph = sapi.$panel.innerHeight();
                        var $item = $(itemslctor);
                        if ($item.length == 1) {
                            //                        $panel.scrollLeft(0);
                            var $itemparent = $item.parent();
                            that.SapiIndexDxnry[itemndx.toString()].makeActive();
                            sapi.$items.clearQueue().stop(true, false);
                            var pos = $itemparent.css("width", pw + "px").css("height", ph + "px").position();
                            var posleft = pos.left / parseInt(scale);
                            var ipw = $itemparent.innerWidth();
                            var iph = $itemparent.innerHeight();
                            $item.css("height", iph + "px").css("width", ipw + "px");
                            //                            $panel = null;
                            $item, $itemparent = null;
                            itemslctor, itemndx = null;
                            pw, ph, ipw, iph, pos, scale = null;
                            fixleft = -posleft;
                        }
                        else {
                            alert(itemslctor + " impliedpgnum=" + sapi.myimpliedpgnum)
                        }
                    }
                    catch (ex) {
                        alert("prweb.domainplayersvc.sizethePagesPanel reports " + ex.Message);
                    }
                    return fixleft;
                };
                sapi.resizeAction = function () {
                    try {
                        clearTimeout(sapi.isResizing);
                        sapi.isResizing = false;
                        var fixleft = sapi.sizethePagesPanel();
                        sapi.$items.clearQueue().stop(true, false).css("left", fixleft);
                        fixleft = null;
                    }
                    catch (ex) {
                        alert("prweb.resultsplayersvc.sapi.resizeAction reports " + ex.Message);
                    }
                    return;
                };
                sapi.resizeHandler = function (e) {
                    try {
                        if (e.handleObj.namespace == "dpsapi") {
                            clearTimeout(sapi.isResizing);
                            sapi.isResizing = false;
                            sapi.isResizing = setTimeout(function () {
                                sapi.resizeAction();
                                return;
                            }, 800);
                        }
                    }
                    catch (ex) {
                        alert("prweb.resultsplayersvc.sapi.resizeHandler reports " + ex.Message);
                    }
                    return;
                };
                sapi.addWindowResizeHandler = function () {
                    $(window).on("resize.dpsapi", sapi.resizeHandler);
                    return;
                };
                sapi.reset = function () {
                    try {
                        that.actionContext.currentpgnumber = 1;
                        sapi.$items.clearQueue().stop(true, false).css("left", 0);
                        //                        $("#rddomainplayerscrollable").clearQueue().stop(true, false).scrollLeft(0);
                        sapi.prwcurrentndx = 0;
                        sapi.isNext = false;
                        sapi.isPrev = false;
                        sapi.scrolltoTargetPgNum = 1;
                        sapi.myimpliedpgnum = parseInt(1);
                        //                        sapi.prwcurrentpage = 1;
                        sapi.isscrollto = false;
                    }
                    catch (ex) {
                        alert("prweb.resultsplayersvc.sapi.reset reports " + ex.Message);
                    }

                    //                    if (sapi.beforeSeekHandler(0)) {
                    //                    sapi.myimpliedpgnum = parseInt(1);
                    //                    }
                };
                sapi.dispose = function () {
                    try {
                        $(window).off('resize.dpsapi', sapi.resizeHandler);
                        clearTimeout(sapi.isResizing);
                        sapi.isResizing = false;
                    }
                    catch (ex) {
                        alert("prweb.domainplayersvc.sapi.dispose reports " + ex.Message);
                    }
                };
                return sapi;
            };
            //#endregion

            //#region AnimatePageChange
            that.CurrentItemNdx = 0;
            that.animatePageChange = function (direction) {
                try {
                    //                    var fixleft = that.scrollapi.sizethePagesPanel();
                    if (!direction) {
                        that.scrollapi.resizeAction();
                        that.scrollapi.afterSeekHandler();
                        return;
                    }
                }
                catch (ex) {
                    alert("prweb.domainplayersvc.animatepagechange reports " + ex.Message);
                }
            };
            //#endregion

            //#region AnimatePageLeaving Arriving
            that.AnimatePageLeaving = function (direction, newi) {
                try {
                    var oppamt = "0";
                    switch (direction) {
                        case ("next"):
                            oppamt = "-=100"; //"-25%";
                            break;
                        case ("prev"):
                            oppamt = "+=100"; //"25%";
                            break;
                    };
                    that.scrollapi.$items.clearQueue().stop(true, false).animate({ left: oppamt }, { duration: 300, easing: 'linear' });
                }
                catch (ex) {
                    alert("prweb.domainplayersvc.AnimatePageLeaving reports " + ex.Message);
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
                    }});
                }
                catch (ex) {
                    alert("prweb.domainplayersvc.AnimatePageLeaving reports " + ex.Message);
                }
            };
            //#endregion

            //#region ManagePageChange
            that.ManagePageChange = function (direction,newi) {
                try {
                    that.scrollapi.isscrollto = false;
                    var isnewpage = that.scrollapi.beforeSeekHandler(newi);
                    if (isnewpage) {
                        //                        prweb.actionContext.currentpgnumber = parseInt(that.actionContext.currentpgnumber);
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
                    alert("prweb.domainplayersvc.ManagePageChange reports " + ex.Message);
                }
            };
            //#endregion

            //#region Navigate Next Prev SeekTo
            that.navigateNext = function () {
                var nexti = that.ToNdx(Math.min(that.PageCount(), that.actionContext.currentpgnumber + 1));
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
            that.RetrieveDomainPageZero = function (domainname) {
                try {
                    var dpg = prweb.domaincontentsvc.DomainPagePlease(domainname, 0);
                    if (dpg) {

                        that.CurrentDomain = domainname;
                        that.LastDomain = domainname;

                        that.SapiIndexDxnry["0"].clear();
                        that.SapiIndexDxnry["1"].clear();
                        that.SapiIndexDxnry["2"].clear();
                        that.scrollapi.reset();

                        that.SapiIndexDxnry["0"].pgobj(dpg);
                        that.SapiIndexDxnry["0"].makeActive();
                        that.SapiIndexDxnry["0"].onpgnumchange(1);
                        that.scrollapi.resizeAction();
                        that.scrollapi.afterSeekHandler();
                        if (prweb.domaincontentsvc.PageCountforDomain(domainname) == 0) {
                            that.SubscribeToItemCountChanged(domainname);
                        }
                    }
                }
                catch (ex) {
                    alert("prweb.domainplayersvc.RetrievePageZero reports " + ex.Message);
                }
            };

            //#endregion

            //this all comes from the domaincontentsvc now...
            that.DomainList = {}; //is a list of domain items...has URL for page zero...maybe a listable title and a longer description...
            that.populateDomainList = function (domaincolxn) {
                var i = 0;
                for (var n in prweb.domaincontentsvc.DomainDxnry) {
                    that.DomainList[i] = prweb.domaincontentsvc.DomainDxnry[n];
                    i++;
                }
            };
            that.LastDomain = false;
            that.DomainSelect = function () {
                try {
                    var name = that.LastDomain;
                    if (!name) {
                        name = that.DomainList[0].Name;
                    }
                    if (name) {
                        that.RetrieveDomainPageZero(name);
                    }
                }
                catch (ex) {
                    alert("prweb.domainplayersvc.DomainSelect reports " + ex.Message);
                }
            };

            that.DomainListItemSelectAction = function (domainitem) {
                try {
                    that.LastDomain = domainitem.Name;
                    that.RetrieveDomainPageZero(domainitem.Name);
                }
                catch (ex) {
                    alert("prweb.domainplayersvc.DomainListItemSelectAction.successhandler reports " + ex.Message);
                }
            };

            that.Dispose = function () {
                try {
                    for (var n in that) {
                        that[n] = null;
                    }
                    that = null;
                }
                catch (ex) {
                    alert("prweb.domainplayersvc.Dispose reports " + ex.Message);
                }
            };
            return that;

        };
        return dps;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
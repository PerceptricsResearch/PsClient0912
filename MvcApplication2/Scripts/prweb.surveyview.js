/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.surveyview', {
        //#region Options
        options: {
            id: 0,
            surveyGuidstring: null,
            eventID: null,
            mysurveypanel: null,
            mymainpanel: null,
            ismymainpanelpartial: "empty",
            mypages: false,
            //            pcmidpgnumbersUrl: null,
            //            pcmidpgnumbers: null,
            resultsmodelUrl: null,
            sdsresponsemodelUrl: null,
            pagesCount: 0,
            nxtPgURL: null,
            nxtPage: null,
            rsltsgrpsbtn: null,
            rsltsgrpsbtnvisibiliy: false,
            smddtlsbtn: null,
            smddtlsbtnvisibility: false,
            grpdefncntnr: null,
            grpdefncntnrvisibility: false,
            scrllpgspanel: null,
            scrllapi: null,
            subscribe: null,
            publish: null,
            title: '',
            displayName: '',
            surveyID: -1,
            myDOMNode: null,
            defaultRPSO: null,
            hasAppliedBindings: false,
            sendRequest: null,
            isDisposed: false
        },
        //#endregion

        xevent: "click.surveyview",

        //#region Create
        _create: function () {
            //            var self = this;
            this.options.eventID = this.options.surveyGuidstring;
            prweb.surveymodelsvc.PageCount = this.options.pagesCount;
            prweb.actionContext.currentpgnumber = 1;
            //            $(".scrollablepagespanel").scrollable({ vertical: false, mousewheel: false });
            this.scrollapi = this._newScrollApi(); //$(".scrollablepagespanel").data("scrollable");
            //            this.scrollapi.mypages = $(".prwpage", this.element);
            this.scrollapi.prwcurrentndx = 0;
            this.scrollapi.prwcurrentpage = 1;
            this.scrollapi.isscrollto = false;
            this.scrollapi.isPrev = false;
            this.scrollapi.isNext = false;
            this.scrollapi.nxtpgurl = this.options.nxtPgURL;
            this.scrollapi.prwpgcount = this.options.pagesCount;
            this.scrollapi.prwnxtbtn = $("#nextsurveyview");
            this.scrollapi.prwprevbtn = $("#prevsurveyview");
            //            this.scrollapi.mypages = this.options.mypages;
            //            this.options.mymainpanel = this.element;
            //            this.options.mysurveypanel = $("#pagesbucket");
            $("#surveynamelabel").html(prweb.actionContext.currentsurveyname);
            $("#surveycurrentgrplabel").html("All Respondents");
            if (this.scrollapi.prwpgcount == 1) {
                this.scrollapi.prwnxtbtn.hide();
            };
            prweb.pagessvc.MyPages = $(".prwpage", this.element); //this.scrollapi.mypages;
            prweb.pagessvc.NxtPgUrl = this.options.nxtPgURL;
            prweb.pagessvc.Initialize(this.options.pagesCount);
            //            this.options.myDOMNode = $(".scrollablepagespanel")[0];
            var konode = $("#animatescrollpanel");
            ko.applyBindings(prweb.pagessvc.Vmx, konode[0]);
            konode = null;
            this.scrollapi.sizethePagesPanel();
            var ps = prweb.pubsub.subscribe;
            this._manageVSMEvents(ps);
            ps = null;
            this.scrollapi.addWindowResizeHandler();
            //            $(window).resize(this.scrollapi.sizethePagesPanel);
            prweb.rfmsvc.ShowPieCharts();
            prweb.rfmsvc.InitializeGroupsSlideoutPanel();
            if (prweb.IsTouch) {
                this.xevent = "tap.surveyview";
                this._widgetizePinchPanZoom();
                this._populateSwipeGestureHandler();
            }
            this._populatePrevNextBtnHandlers();
            prweb.surveymetadatasvc.LaunchSurveyMetaDataView();
            //            prweb.surveymodelsvc.OpenSurvey();
        },
        //#endregion

        //#region ScrollAPI
        scrollapi: false,

        _newScrollApi: function () {
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
                return prweb.pagessvc.ToNdx(sapi.myimpliedpgnum);
            }
            sapi.sizethePagesPanel = function () {
                var fixleft = 0;
                try {
                    var itemndx = sapi.getIndex();
                    var itemslctor = "#scrpgitem" + itemndx;

                    var $panel = $("#animatescrollpanel");
                    var pw = $panel.innerWidth();
                    var $item = $(itemslctor);
                    if ($item.length == 1) {
                        //                        $item.children().eq(0).css("top", "").css("left", "");
                        //                        $item.css('-webkit-transform', '');

                        $item.parent().css("width", pw + "px");
                        var xt = $panel[0].getBoundingClientRect();
                        var xd = $item[0].getBoundingClientRect();
                        //            var difftop = xd.top - xt.top;
                        var diffleft = xd.left - xt.left;
                        var isleft = $panel.scrollLeft();
                        //            var istop = this.element.scrollTop();
                        $panel = null;
                        $item = null;
                        xt = null;
                        xd = null;
                        itemslctor = null;
                        pw = null;

                        fixleft = -diffleft - isleft;
                    }
                    else {
                        alert(itemslctor + " impliedpgnum=" + sapi.myimpliedpgnum)
                    }
                }
                catch (ex) {
                    alert("surveyview.sizethePagesPanel reports " + ex.Message);
                }
                return fixleft;
            }
            sapi.beforeSeekHandler = function (i) {
                var rslt = false;
                if (i >= 0) {
                    try {
                        //I am an eventhandler in scrllapi...this = scrllapi..
                        if (sapi.isscrollto) {
                            //the issscrollto method...surveyview.navigatetopgnumber...sets scrolltoTargetPgNum..
                            sapi.isscrollto = false;
                            if (sapi.scrolltoTargetPgNum <= sapi.prwpgcount) {
                                rslt = true;
                                sapi.prwcurrentpage = sapi.scrolltoTargetPgNum;
                            }
                        }
                        else {
                            var curndx = sapi.getIndex(); //is the position of scrllapi
                            sapi.isPrev = (i < curndx);
                            sapi.isNext = (i > curndx);
                            if (curndx == 4 && i == 0) {
                                sapi.isNext = true;
                                sapi.isPrev = false;
                            }
                            else if (curndx == 0 && i == 4) {
                                sapi.isNext = false;
                                sapi.isPrev = true;
                            }
                            if (sapi.isNext) {
                                if (sapi.prwcurrentpage < sapi.prwpgcount) {
                                    rslt = true;
                                }
                                sapi.prwcurrentpage = Math.min(sapi.prwpgcount, sapi.prwcurrentpage + 1);
                            }
                            else if (sapi.isPrev) {
                                if (sapi.prwcurrentpage > 0) {
                                    rslt = true;
                                }
                                sapi.prwcurrentpage = Math.max(1, sapi.prwcurrentpage - 1);
                            }
                        }
                        var xxrslt = prweb.pagessvc.PopulateCurrentPageNumber(sapi.prwcurrentpage);
                        xxrslt = null;
                    }
                    catch (ex) {
                        alert("surveyview.beforeSeekHandler reports " + ex.Message);
                    }
                }

                return rslt;
            };
            sapi.afterSeekHandler = function () {
                var rslt = true;
                try {
                    //                    var sapi = $('#surveyresultsview').data("surveyview").scrollapi;
                    //I am an eventhandler in scrllapi...this = scrllapi..
                    //change surrounding SapiEntryPgNums...
                    if (sapi.isPrev) {
                        //change surrounding SapiEntryPgNums...
                    }
                    else if (sapi.isNext) {
                        //change surrounding SapiEntryPgNums...
                        prweb.pagessvc.ConfigureSurroundingPages(sapi.prwcurrentpage)
                    }
                    if (sapi.prwcurrentpage !== sapi.prwpgcount) {
                        sapi.prwnxtbtn.css("display", "");
                    }
                    else {
                        sapi.prwnxtbtn.hide();
                    }
                    if (sapi.prwcurrentpage == 1) {
                        sapi.prwprevbtn.hide();
                    }
                    else {
                        sapi.prwprevbtn.css("display", "");
                    }
                    prweb.pagessvc.PublishPageChangeEvents();
                }
                catch (ex) {
                    alert("surveyview.scollapi.afterseekhandler reports " + ex.Message);
                }

                return rslt;
            };
            sapi.isResizing = false;
            sapi.resizeAction = function () {
                var fixleft = sapi.sizethePagesPanel();
                $("#animatescrollpanel").animate({ scrollLeft: -fixleft }, { duration: 10, easing: 'easeInQuad' });
                //                    clearTimeout(sapi.isResizing);
                //                    sapi.isResizing = false;
            };
            sapi.resizeHandler = function () {
                clearTimeout(sapi.isResizing);
                sapi.isResizing = setTimeout(sapi.resizeAction, 200);
            };
            sapi.addWindowResizeHandler = function () {
                $(window).bind("resize.sapi", sapi.resizeHandler);
            };
            sapi.dispose = function () {
                try {
                    $(window).unbind('resize.sapi', sapi.resizeHandler);
                    clearTimeout(sapi.isResizing);
                    sapi.isResizing = false;
                }
                catch (ex) {
                    alert("prweb.surveyview.sapi.dispose reports " + ex.Message);
                }
            };
            return sapi;
        },
        //#endregion

        //#region AnimatePageChange
        _animatePageChange: function (direction) {
            try {
                var fixleft = this.scrollapi.sizethePagesPanel();
                $("#animatescrollpanel").animate({ scrollLeft: -fixleft }, { duration: 400, easing: 'easeInQuad', complete: this.scrollapi.afterSeekHandler });
            }
            catch (ex) {
                alert("surveyview.animatepagechange reports " + ex.Message);
            }
        },
        //#endregion

        //#region Navigate Next Prev SeekTo
        _navigateNext: function () {
            var nexti = this.scrollapi.getIndex() + 1;
            if (this.scrollapi.beforeSeekHandler(nexti)) {
                //do moveanimationnext...
                this.scrollapi.myimpliedpgnum += 1;
                this._animatePageChange("next");
            };
        },

        _navigatePrev: function () {
            var previ = this.scrollapi.getIndex() - 1;
            if (this.scrollapi.beforeSeekHandler(previ)) {
                //do moveanimationprev...
                this.scrollapi.myimpliedpgnum -= 1;
                this._animatePageChange("prev");
            };
        },

        _seekTo: function (pgnum) {
            var scrndx = prweb.pagessvc.ToNdx(pgnum);
            if (this.scrollapi.beforeSeekHandler(scrndx)) {
                //do moveanimation.
                this.scrollapi.myimpliedpgnum = parseInt(pgnum);
                this._animatePageChange("navigate");
            };
        },
        //#endregion

        //#region populatePrevNextBtnHandlers
        _populatePrevNextBtnHandlers: function () {
            var self = this;
            this.scrollapi.prwnxtbtn.bind(this.xevent, function () {
                self._navigateNext();
            });
            this.scrollapi.prwprevbtn.bind(this.xevent, function () {
                self._navigatePrev();
            });
        },

        //#endregion

        //#region WidgetizePinchZoom
        _widgetizePinchPanZoom: function () {
            try {
                $("#pagespanelitemswrap", this.element).pinchpanzoom({ ppztargetslctor: ".ppztargetitem",
                                                                       currentndxsource: prweb.pagessvc.CurrentNdx,
                                                                        issurveyviewpagepanelhost: true });
            }
            catch (ex) {
                alert("surveyview.widgetizePinchPanZoom reports " + ex.Message);
            }

        },
        //#endregion

        //#region SwipeGestureHandler
        xswipeevent: "swipe.surveyview",
        _populateSwipeGestureHandler: function () {
            var self = this;
            this.element.css('-webkit-transform', ' translate3d(0,0,0)');
            $("#animatescrollpanel").css('-webkit-transform', ' translate3d(0,0,0)');
            $("#pagespanelitemswrap").bind(this.xswipeevent, function (e) {
                switch (true) {
                    case (e.direction == "left"):
                        self._navigateNext();
                        break;
                    case (e.direction == "right"):
                        self._navigatePrev();
                        break;
                }
            });
        },
        //#endregion

        //#region NavigateToPageNumber
        //is EventHandler for pagelistpageiconselected...
        _navigateToPageNumber: function (pgnum) {
            this.scrollapi.isscrollto = true;
            this.scrollapi.scrolltoTargetPgNum = parseInt(pgnum);
            this._seekTo(parseInt(pgnum));
        },
        //#endregion

        //#region retrievePCMIDpgNumbers 
        // moved to resultsgrouplist and rfmsvc... see success handler for resultsgrouplist._retrieveRFGOListModel...
        //        _retrievePCMIDpgNumbers: function () {
        //            var self = this;
        //            prweb.dataManager.sendRequest({
        //                url: self.options.pcmidpgnumbersUrl,
        //                success: function (pcmdata) {
        //                    self.options.pcmidpgnumbers = pcmdata;
        //                    prweb.rfmsvc.pcmidpgnumbers = pcmdata;
        //                },
        //                error: function () {
        //                    alert('SurveyView retrieve PCMIDpgNumbers error...');
        //                }
        //            });
        //        },
        //#endregion

        //#region GroupDefnPageIconSelected
        _moveToVisualstategrpdefnpageiconselected: function (e) {
            // var smddata = this.options.sendRequest('surveymetadaturl');  need to get PCMID pgNumber map for this survey...
            // take the PCMID in pcmiddata, use the smddatamap to get the corresponding pgNumber
            // navigate to that pgNumber....may have to retrieve the page...put it in the scollable items...then seekTo the index in the items where the page was placed...

            try {
                if (prweb.rfmsvc.pcmidpgnumbers) {
                    var pgnumkvp = Enumerable.From(prweb.rfmsvc.pcmidpgnumbers).Where(function (xpcm) { return xpcm.Key == e.pcmid }).FirstOrDefault();
                    var pgnum = pgnumkvp.Valu;
                    this._navigateToPageNumber(pgnum);
                }
            }
            catch (ex) {
                alert("prweb.surveyview.moveToVisualstategrpdefnpageiconselected reports " + ex.Message);
            }

        },

        //#endregion

        //#region AnimateSurveyPanel
        _animateSurveyPanel: function (panelconfig) {
            var leftwidth = "280px";
            var open = false;
            if (panelconfig) {
                switch (true) {
                    case (panelconfig.open):
                        leftwidth = panelconfig.leftwidth
                        open = true;
                        break;
                }
            }
            else {
                open = false;
            }
            var resizething = this.scrollapi.resizeHandler;
            switch (true) {
                //                case (this.options.ismymainpanelpartial == "empty"):      
                //                    this.options.ismymainpanelpartial = false;      
                //                    if (!this.options.pcmidpgnumbers) {      
                //                        this._retrievePCMIDpgNumbers();      
                //                    }      
                //                    break;      
                case (open):
                    this.element.animate({ left: leftwidth }, { duration: 200, easing: 'easeInQuad', complete: resizething });
                    //                    prweb.publishsvc.isNewVmx = false;
                    this.options.ismymainpanelpartial = true;
                    break;
                case (!open):
                    var $this = this.element;
                    var tvo = setTimeout(function () {
                        $this.animate({ left: "0px" }, { duration: 100, easing: 'easeInQuad', complete: resizething });
                    }, 200);

                    this.options.ismymainpanelpartial = false
                    break;
            }
            leftwidth = null;
            //            mymainpanel = null;
            //            resizething = null;
        },
        //#endregion

        //#region RsltsGroupsButtonClick
        // this animates the surveypages when a panel is open and closed...makes the pages wider or narrower to make room for the panel...
        // right now it is only responsive to groups click...needs to also respond to pages, details actions etc...
        // which means we need to separate out the stuff that changes actionContext, pcvmodesvc, and pcmidpgnumbers...i think...
        _moveToVisualstatersltsgroupsbtnclick: function () {
            try {
                prweb.actionContext.isrsltsgrpdefnactive = false;
                prweb.rfmsvc.ShowPieCharts();
                this.options.grpdefncntnrvisibility = false;
                this.options.smddtlsbtnvisibility = false; //prweb.panelsmgr closes the surveymetadatapanel...
                var rsltsgrpIsOpen = prweb.panelsmgr.GetPanelIsOpen("groupsslideoutpanel");
                if (rsltsgrpIsOpen) {
                    //                            this.options.rsltsgrpsbtn.hide();//this is in groupsslideoutpanel now...
                    this.options.rsltsgrpsbtnvisibiliy = false;
                    this._animateSurveyPanel(false);
                }
                else {
                    //                            this.options.rsltsgrpsbtn.css("display", "");//this is in groupsslideoutpanel now...
                    this.options.rsltsgrpsbtnvisibiliy = true;
                    this._animateSurveyPanel({
                        leftwidth: "280px",
                        open: true
                    });
                }
                //                prweb.actionContext.isrsltsgrpdefnactive = false;
                //                prweb.rfmsvc.ShowPieCharts();
            }
            catch (ex) {
                alert("surveyview.movetoVisualrsltsgroupsbtnclick reports " + ex.Message);
            }
        },

        //#endregion

        //#region DetailsButtonClick SurveyMetaData

        _moveToVisualstatesmddetailsbtnclick: function (smddtlsbtnvisibility) {
            try {
                prweb.actionContext.isrsltsgrpdefnactive = false;
                prweb.rfmsvc.ShowPieCharts();
                this.options.grpdefncntnrvisibility = false;
                this.options.rsltsgrpsbtnvisibiliy = false; //prweb.panelsmgr closes the groupsslideoutpanel...
                var smdisOpen = prweb.panelsmgr.GetPanelIsOpen("surveymetadata"); //this happens before the widget reportsIsDocked...so use opposite of what you would think.
                if (smdisOpen) {
                    this.options.smddtlsbtnvisibility = false;
                    this._animateSurveyPanel(false);
                }
                else {
                    this.options.smddtlsbtnvisibility = true;
                    this._animateSurveyPanel({
                        leftwidth: "220px",
                        open: true
                    });
                }
            }
            catch (ex) {
                alert("surveyview.movetoVisualrsltsgroupsbtnclick reports " + ex.Message);
            }
        },

        //#endregion

        //#region ActionsButtonClick
        _moveToVisualStateActionsBtnClick: function () {
            //            var isOpen = prweb.panelsmgr.GetPanelIsOpen("navpanel"); //this happens before the widget reportsIsDocked...so use opposite of what you would think.
            //            if (isOpen) {
            this._animateSurveyPanel(false);
            //            }
        },
        //#endregion

        //#region SurveysButtonClick
        _moveToVisualstateSurveysbtnclick: function () {
            //            var isOpen = prweb.panelsmgr.GetPanelIsOpen("surveyiconlist"); //this happens before the widget reportsIsDocked...so use opposite of what you would think.
            //            if (isOpen) {
            this._animateSurveyPanel(false);
            //            }
        },
        //#endregion

        //#region manageVSMEvents
        _manageVSMEvents: function (ps) {
            try {
                ps(prweb.events.subscriberplatform.rsltsgroupsbtnclick, this._moveToVisualstatersltsgroupsbtnclick, this);
                ps(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateActionsBtnClick, this);
                ps(prweb.events.subscriberplatform.smddetailsbtnclick, this._moveToVisualstatesmddetailsbtnclick, this);
                ps(prweb.events.subscriberplatform.surveysbtnclick, this._moveToVisualstateSurveysbtnclick, this);
                ps(prweb.events.subscriberplatform.grpdefnpageiconselected, this._moveToVisualstategrpdefnpageiconselected, this)
                ps(prweb.events.subscriberplatform.pagelistpageiconselected, this._navigateToPageNumber, this);
                ps = null;
            }
            catch (ex) {
                alert("prweb.surveyview.manageVSMEvents reports " + ex.Message);
            }
        },
        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    //                    prweb.surveymodelsvc.CloseSurvey();
                    var ps = prweb.pubsub.unsubscribe;
                    this._manageVSMEvents(ps);
                    ps = null;
                    prweb.surveymetadatasvc.RemoveSurveyMetaDataView();
                    if (prweb.IsTouch) {
                        $("#pagespanelitemswrap").unbind(this.xswipeevent);
                        $("#pagespanelitemswrap").data("pinchpanzoom").dispose();
                    }
                    this.options.rsltsgrpsbtn = null;
                    this.options.smddtlsbtn = null;
                    this.options.grpdefncntnr = null;
                    this.options.publish = null;
                    this.options.subscribe = null;
                    this.options.sendRequest = null;
                    this.options.surveyGuidstring = null;
                    this.options.resultsmodelUrl = null;
                    this.options.resultsModel = null;
                    //                    this.options.scrllapi.getNaviButtons().unbind().empty();
                    this.scrollapi.prwnxtbtn.unbind(this.xevent);
                    this.scrollapi.prwprevbtn.unbind(this.xevent);
                    this.scrollapi.prwnxtbtn = null;
                    this.scrollapi.prwprevbtn = null;
                    this.scrollapi.prwcurrentndx = null;
                    this.scrollapi.prwcurrentpage = null;
                    this.scrollapi.nxtpgurl = null;
                    this.scrollapi.dispose();
                    this.scrollapi = null;
                    //                    this.scrollapi.prwpopulatenxtpgurl = null;
                    //                    this.scrollapi.prwretrievenxtpage = null;
                    //                    this.options.scrllapi.beforeseekHandler = null
                    //                    this.options.scrllapi.seektoHandler = null;
                    //                    this.options.scrllapi.onSeek(null); //= null;
                    //                    this.options.scrllapi.onBeforeSeek(null); //= null;
                    //                    this._retrieveNextPage = null;
                    //            this._myseektoHandler = null;
                    //                    this.options.scrllapi = null;
                    //                    $(".scrollablepagespanel").unbind().empty().removeData("scrollable");

                    //            $(".scrollablepagespanel").removeData("scrollable");
                    //            $("#rsltsgrpdefnview").removeData("resultsgroupdefn");

                    //                    this.options.pcmidpgnumbers = null;
                    this.options.nxtPgURL = null;
                    //                    this.options.pcmidpgnumbersUrl = null;
                    this.options.mymainpanel = null;
                    this.options.mysurveypanel = null;
                    this.options.scrllpgspanel = null;
                    //                    this.element.unbind().empty();
                }
                catch (ex) {
                    alert("prweb.surveyview.dispose reports error " + ex.Message);
                    ex = null;
                }
                finally {
                    this.options.isDisposed = true;
                }
            }
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.surveyview.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));

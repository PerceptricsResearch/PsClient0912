/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.marketinghome', {
        //#region Options
        options: {
            isDisposed: false,
            pagesCount: 3,
            nxtPgURL: false,
            id: 0
        },

        xevent: "click.marketinghome",

        _create: function () {
            var myclass = "marketinghome";
            this.xevent = "click.marketinghome";
            //            this._setUpDebugConsole();
            if (prweb.IsTouch) {
                try {
                    this.xevent = "tap.marketinghome";
                    //                    this._widgetizePinchPanZoom();
                    this._populateSwipeGestureHandler();
                }
                catch (ex) {
                    alert("prweb.marketinghome.creat.touch reports " + ex.Message);
                }
            }
            prweb.setUpKOImageBinding();
            this._setUpScrollApi();
            this._populatePrevNextBtnHandlers();
            prweb.mktmgr.RetrieveMarketingResources();
        },
        _setUpDebugConsole: function () {
            try {
                var konode = $("#debugcontainer");
                ko.applyBindings(prweb.debugsvc.Vmx, konode[0]);
                konode = null;
                prweb.debugsvc.Write("setup complete...");
            }
            catch (ex) {
                alert("marketinghome.setUpDebugConsole reports " + ex.Message);
            }

        },
        _setUpScrollApi: function () {
            try {
                this.scrollapi = this._newScrollApi();
                this.scrollapi.prwcurrentndx = 0;
                this.scrollapi.prwcurrentpage = 1;
                this.scrollapi.isscrollto = false;
                this.scrollapi.isPrev = false;
                this.scrollapi.isNext = false;
                this.scrollapi.nxtpgurl = this.options.nxtPgURL;
                this.scrollapi.prwpgcount = this.options.pagesCount;
                this.scrollapi.prwnxtbtn = $("#hisatopnext");
                this.scrollapi.prwprevbtn = $("#hisatopprev");
                if (this.scrollapi.prwpgcount == 1) {
                    this.scrollapi.prwnxtbtn.hide();
                };
                prweb.marketingsvc.MyPages = $(".hisatoppage", this.element);
                prweb.marketingsvc.NxtPgUrl = this.options.nxtPgURL;
                prweb.marketingsvc.Initialize(this.options.pagesCount);
                this.scrollapi.sizethePagesPanel();
                this.scrollapi.addWindowResizeHandler();
                var konode = $("#homeindexcontentscrollableareatop");
                ko.applyBindings(prweb.marketingsvc.Vmx, konode[0]);
                konode = null;
            }
            catch (ex) {
                alert("prweb.marketinghome.setUpScrollApi reports " + ex.Message);
            }
        },

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
                return prweb.marketingsvc.ToNdx(sapi.myimpliedpgnum);
            }
            sapi.sizethePagesPanel = function () {
                var fixleft = 0;
                try {
                    var itemndx = sapi.getIndex();
                    var itemslctor = "#hisatoppage" + itemndx;

                    var $panel = $("#homeindexcontentscrollableareatop");
                    var pw = $panel.innerWidth();
                    var $item = $(itemslctor);
                    if ($item.length == 1) {
                        $item.parent().css("width", pw + "px");
                        var xt = $panel[0].getBoundingClientRect();
                        var xd = $item[0].getBoundingClientRect();
                        var diffleft = xd.left - xt.left;
                        var isleft = $panel.scrollLeft();
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
                    alert("prweb.marketinghome.sizethePagesPanel reports " + ex.Message);
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
                            if (curndx == 2 && i == 0) {
                                sapi.isNext = true;
                                sapi.isPrev = false;
                            }
                            else if (curndx == 0 && i == 2) {
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
                        var xxrslt = prweb.marketingsvc.PopulateCurrentPageNumber(sapi.prwcurrentpage);
                        xxrslt = null;
                    }
                    catch (ex) {
                        alert("prweb.marketinghome.beforeSeekHandler reports " + ex.Message);
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
                        prweb.marketingsvc.ConfigureSurroundingPages(sapi.prwcurrentpage)
                    }
                    if (sapi.prwcurrentpage !== sapi.prwpgcount) {
                        sapi.prwnxtbtn.css("display", "");
                    }
                    else {
                        sapi.prwnxtbtn.css("display", "none");
                    }
                    if (sapi.prwcurrentpage == 1) {
                        sapi.prwprevbtn.css("display", "none");
                    }
                    else {
                        sapi.prwprevbtn.css("display", "");
                    }
                    prweb.marketingsvc.PublishPageChangeEvents();
                }
                catch (ex) {
                    alert("prweb.marketinghome.scollapi.afterseekhandler reports " + ex.Message);
                }

                return rslt;
            };
            sapi.isResizing = false;
            sapi.resizeAction = function () {
                var fixleft = sapi.sizethePagesPanel();
                $("#homeindexcontentscrollableareatop").animate({ scrollLeft: -fixleft }, { duration: 10, easing: 'easeInQuad' });
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
                    alert("prweb.marketinghome.sapi.dispose reports " + ex.Message);
                }
            };
            return sapi;
        },
        //#endregion

        //#region AnimatePageChange
        _animatePageChange: function (direction) {
            try {
                var fixleft = this.scrollapi.sizethePagesPanel();
                $("#homeindexcontentscrollableareatop").animate({ scrollLeft: -fixleft }, { duration: 400, easing: 'easeInQuad', complete: this.scrollapi.afterSeekHandler });
            }
            catch (ex) {
                alert("prweb.homeindex.animatepagechange reports " + ex.Message);
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
            var scrndx = prweb.marketingsvc.ToNdx(pgnum);
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
            this.scrollapi.prwnxtbtn.on(this.xevent, function () {
                prweb.showClick(this);
                self._navigateNext();
            });
            this.scrollapi.prwprevbtn.on(this.xevent, function () {
                prweb.showClick(this);
                self._navigatePrev();
            });
        },

        //#endregion

        //#region WidgetizePinchZoom
        _widgetizePinchPanZoom: function () {
            try {
                $("#hisatopitems", this.element).pinchpanzoom({ ppztargetslctor: ".ppztargetitem", issurveyviewpagepanelhost: false });
            }
            catch (ex) {
                alert("marketinghome.widgetizePinchPanZoom reports " + ex.Message);
            }

        },
        //#endregion

        //#region SwipeGestureHandler
        xswipeevent: "swipe.homeindex",
        _populateSwipeGestureHandler: function () {
            var self = this;
            //            this.element.css('-webkit-transform', ' translate3d(0,0,0)');
            //            $("#homeindexcontentscrollableareatop").css('-webkit-transform', ' translate3d(0,0,0)');
            try {
                //                alert("adding swipe");
                $(".hisatopitem", this.element).bind(this.xswipeevent, function (e) {
                    //                    alert("hisatop sees swipe");
                    switch (true) {
                        case (e.direction == "left"):
                            self._navigateNext();
                            break;
                        case (e.direction == "right"):
                            self._navigatePrev();
                            break;
                    }
                });
            }
            catch (ex) {
                alert("marketinghome.populateSwipeGestureHandler reports " + ex.Message);
            }

        },
        //#endregion

        //        _addHisaTopScroller: function () {
        //            $(".hisatopitem", "#homeindexcontentscrollableareatop").css("display", "");
        //            if (prweb.IsTouch) {
        //                $("#homeindexcontentscrollableareatop").scroller({
        //                    vertical: false,
        //                    touch: true,
        //                    items: ".hisatopitemscontainer",
        //                    item: ".hisatopitem",
        //                    inertialbtns: true
        //                });
        //            }
        //            else {
        //                $("#homeindexcontentscrollableareatop").css("overflow", "auto");
        //            }
        //        },



        //        _populateNavigateBtns: function (myclass, xevent) {
        //            var self = this;
        //            $("#prwebloginbtn").bind(this.xevent, function () {
        //                var logonurl = prweb.getRelativeEndpointUrl(self.options.logonurl);
        //                window.location = logonurl;
        //            })

        //        },


        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    this.scrollapi.prwnxtbtn.off();
                    this.scrollapi.prwprevbtn.off();
                    this.scrollapi.dispose();
                    this.scrollapi = null;
                    $(".hisatopitem", this.element).unbind();
                    var konode = $("#homeindexcontentscrollableareatop");
                    ko.cleanNode(konode[0]);
                    konode = null;
                }
                catch (ex) {
                    alert("prweb.marketinghome.dispose reports error " + ex.Message);
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
                alert("prweb.marketinghome.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
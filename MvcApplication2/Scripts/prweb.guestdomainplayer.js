(function (prweb, $) {
    $.widget('prweb.guestdomainplayer', {

        //#region Options
        options: {
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion

        playersvc: false,

        //#region Create
        xevent: "click.guestdomainplayer",

        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.guestdomainplayer";
                    //                    this._populateSwipeGestureHandler();
                    //                    this._widgetizePinchPanZoom();
                }

                this._populateBtnHandler();
            }
            catch (ex) {
                alert("prweb.guestdomainplayer.create reports " + ex.Message);
            }
        },
        //#endregion

        //#region populatePrevNextBtnHandlers
        _populatePrevNextBtnHandlers: function () {
            var self = this;
            this.playersvc.scrollapi.prwnxtbtn.on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                self.playersvc.navigateNext();
                return false;
            });
            this.playersvc.scrollapi.prwprevbtn.on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                self.playersvc.navigatePrev();
                return false;
            });
        },
        //#endregion


        //#region SelectedPagesListScrollers

        _addIndividualPageScrollers: function ($this) {
            try {
                //                if (prweb.IsTouch) {
                //                    var scrinit = {
                //                        vertical: true,
                //                        usePrevNext: false,
                //                        touch: true,
                //                        items: false,
                //                        item: false,
                //                        stoptouchpropagation: false,
                //                        inertialbtns: true
                //                    };
                //                    //have to do keep propagation on the scroller...so that the pinch pan zoom can work on pages...
                //                    $(".guestdppagecontent", this.element).scroller(scrinit);
                //                    //                        alert("scroller added to resultsgrpdefn.selectedpageslist");
                //                }
                $(".guestdppagecontent", this.element).css('-webkit-transform', ' translate3d(0,0,0)').css("overflow", "auto");
            }
            catch (ex) {
                alert("prweb.guestdomainplayer.addIndividualPageScrollers reports " + ex.Message);
            }

        },

        //#endregion

        //#region WidgetizePinchZoom
        _widgetizePinchPanZoom: function () {
            try {
                $(".guestdomainplayerpage").pinchpanzoom({
                    ppztargetslctor: ".droppztargetable",
                    isswipeable: false,
                    issurveyviewpagepanelhost: false
                });
            }
            catch (ex) {
                alert("guestdomainplayer.widgetizePinchPanZoom reports " + ex.Message);
            }
        },
        //#endregion

        //#region SwipeGestureHandler
        xswipeevent: "swipe.guestdomainplayer",
        _populateSwipeGestureHandler: function () {
            var self = this;
            try {
                $(".guestdomainplayerpage", "#guestdomainplayerscrollable").css('-webkit-transform', ' translate3d(0,0,0)');
                $(".guestdomainplayerpage", "#guestdomainplayerscrollable").on(this.xswipeevent, function (e) {
                    //                    prweb.debugsvc.Write("examples.swipe");
                    e.cancelBubble = true;
                    switch (true) {
                        case (e.direction == "left"):
                            self.playersvc.navigateNext();
                            break;
                        case (e.direction == "right"):
                            self.playersvc.navigatePrev();
                            break;
                    }
                });
            }
            catch (ex) {
                alert("guestdomainplayer.populateSwipeGestureHandler reports " + ex.Message);
            }

        },
        //#endregion

        //#region myBtnClick and panel animation
        isDocked: true,
        animwidthzero: { width: 0 },
        animwidthwide: { width: "20em" },
        animdur: { duration: 300, easing: 'easeInQuad' },

        _mybtnclick: function (domain) {
            //            $("#guestdomainplayeritems").clearQueue().stop(true, false).css("left", 0);
            //            $("#guestdomainplayerscrollable").clearQueue().stop(true, false).scrollLeft(0);
            if (!this.isDocked) {

                $("#guestdomainpanel").css("overflow", "hidden");
                $("#guestdomainpanel").clearQueue().stop(true, false).animate(this.animwidthzero, { duration: 300, easing: 'easeInQuad' });
                this.isDocked = true;
            }
            //            prweb.panelsmgr.ReportIsDocked("navpanel", this.isDocked);
            return;
        },

        _showDomainPlayer: function (domain) {
            $("#guestdomainplayeritems").clearQueue().stop(true, false).css("left", 0);
            //            $("#guestdomainplayerscrollable").clearQueue().stop(true, false).scrollLeft(0);
            if (this.isDocked) {
                var self = this;

                $("#guestdomainpanel").clearQueue().stop(true, false)
                                       .removeClass("prwslideouthide")
                                       .animate(this.animwidthwide, { duration: 300, easing: 'easeInQuad', complete: function () {
                                           try {
                                               self.isDocked = false;
                                               //                                               $("#guestdomainpanel").stop(true, true);
                                               //                                               $("#guestdomainpanel").css("overflow", "auto");
                                               if (self.playersvc == false) {
                                                   self.playersvc = prweb.domainplayersvc.NewPlayerSvc($("#domainplayerrootcontainer"));
                                                   self.playersvc.setUpScrollApi({
                                                       konode: ".domainplayercontainer",
                                                       next: "#guestdomainplayernext",
                                                       prev: "#guestdomainplayerprev",
                                                       container: "#guestdomainplayercontainer",
                                                       panelscrollable: "#guestdomainplayerscrollable",
                                                       items: "#guestdomainplayeritems",
                                                       pagecontent: "#guestdomainplayercontent"
                                                   });
                                                   if (prweb.IsTouch) {
                                                       //                                                       self._populateSwipeGestureHandler();
                                                       //                                                       self._widgetizePinchPanZoom();
                                                       self._addIndividualPageScrollers();
                                                   }
                                                   self._populatePrevNextBtnHandlers();

                                               }
                                               //                                               var domain = $(this).attr("data-prwebdomain");
                                               if (domain) {
                                                   self.playersvc.RetrieveDomainPageZero(domain);
                                               }

                                           }
                                           catch (ex) {
                                               alert("prweb.guestdomainplayer.animate complete reports error " + ex.Message);
                                           }
                                           return;
                                       }
                                       });
            }
            else {
                if (domain) {
                    this.playersvc.RetrieveDomainPageZero(domain);
                }
            }
            return;
        },
        _populateBtnHandler: function () {
            var self = this;
            $(".dpbtn", "#guestactionslistitemscontainer").on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.cancelBubble = true;
                    e.stopPropagation();
                    prweb.showClick(this);
                    var domain = $(this).attr("data-prwebdomain");
                    if (domain !== "comment") {
                        self._showDomainPlayer(domain);
                    }
                    else {
                        $('#textentrybottompanel').textentry({ slidoutselctor: "#textentrybottompanel" });
                    }
                }
                catch (ex) {
                    alert("prweb.guestdomainplayer.dpbtn reports error " + ex.Message);
                }

                return false;
            });
            $("#guestdomaindonebtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                e.stopPropagation();
                self._mybtnclick(false);
                return false;
            });
            $("#guestprwhelpbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                e.stopPropagation();
                if (self.isDocked) {
                    var domain = $(this).attr("data-prwebdomain");
                    if (domain !== "comment") {
                        self._showDomainPlayer(domain);
                    }
                    else {
                        $('#textentrycontainerwrapper').textentry();
                    }
                }
                else {
                    self._mybtnclick(false);
                }
                return false;
            });
        },
        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    this.playersvc.scrollapi.prwnxtbtn.off(this.xevent);
                    this.playersvc.scrollapi.prwprevbtn.off(this.xevent);
                    $(".dpbtn", "#guestactionslistitemscontainer").off(this.xevent);
                    $("#guestdomaindonebtn").off(this.xevent);
                    $("#guestprwhelpbtn").on(this.xevent);
                    this.playersvc.Dispose();
                    this.playersvc = null;
                }
                catch (ex) {
                    alert("prweb.guestdomainplayer.dispose reports error " + ex.Message);
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
                alert("prweb.guestdomainplayer.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }
        //#endregion
    });
} (this.prweb, jQuery));
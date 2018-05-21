/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.domainplayer', {
        //#region Options
        options: {
            domainlist: false,
            domainlistURL: false,
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion
        xevent: "click.domainplayer",

        //#region Create
        _create: function () {
            try {
                this.playersvc = prweb.domainplayersvc.NewPlayerSvc(this.element);
                this.playersvc.setUpScrollApi();
                if (prweb.IsTouch) {
                    this.xevent = "tap.domainplayer";

                    this._populateSwipeGestureHandler();
                    this._widgetizePinchPanZoom();
                }
                this._populatePrevNextBtnHandlers();
                //this method needs to send some list of domain items...needs at least 1 member...
                if (this.options.domainlist) {
                    this.playersvc.populateDomainList();
                    this.playersvc.DomainSelect();
                }

            }
            catch (ex) {
                alert("prweb.domainplayer.create reports " + ex.Message);
            }
        },

        //#endregion

        playersvc: false,

        //#region populatePrevNextBtnHandlers
        _populatePrevNextBtnHandlers: function () {
            var self = this;
            prweb.domainplayersvc.scrollapi.prwnxtbtn.on(this.xevent, function (e) {
                e.cancelBubble = true;
                prweb.showClick(this);
                self.playersvc.navigateNext();
            });
            prweb.domainplayersvc.scrollapi.prwprevbtn.on(this.xevent, function (e) {
                e.cancelBubble = true;
                prweb.showClick(this);
                self.playersvc.navigatePrev();
            });
        },

        //#endregion

        //#region WidgetizePinchZoom
        _widgetizePinchPanZoom: function () {
            try {
                $(".domainplayersurveycontainerwrapper", this.element).pinchpanzoom({
                    ppztargetslctor: ".domainplayersurveycontainer",
                    isswipeable: false,
                    issurveyviewpagepanelhost: false
                });
            }
            catch (ex) {
                alert(".domainplayer.widgetizePinchPanZoom reports " + ex.Message);
            }
        },
        //#endregion

        //#region SwipeGestureHandler
        xswipeevent: "swipe.domainplayer",
        _populateSwipeGestureHandler: function () {
            var self = this;
            try {
                $(".domainplayersurveyscrollable", this.element).css('-webkit-transform', ' translate3d(0,0,0)');
                $(".domainplayersurveyscrollable", this.element).bind(this.xswipeevent, function (e) {
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
                alert("domainplayer.populateSwipeGestureHandler reports " + ex.Message);
            }

        },
        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    //                    $(".examplesgalleryitem", this.element).off(this.xevent);
                    this.playersvc.scrollapi.prwprevbtn.off(this.xevent);
                    this.playersvc.scrollapi.prwnxtbtn.off(this.xevent);
                    this.playersvc.scrollapi.dispose();
                    this.playersvc.scrollapi = null;
                    if (prweb.IsTouch) {
                        $(".domainplayersurveycontainerwrapper", this.element).data("pinchpanzoom").dispose();
                    }
                }
                catch (ex) {
                    alert("prweb.domainplayer.dispose reports error " + ex.Message);
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
                alert("prweb.domainplayer.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
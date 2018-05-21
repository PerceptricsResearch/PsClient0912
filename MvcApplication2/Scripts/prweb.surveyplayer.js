/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.surveyplayer', {
        //#region Options
        options: {
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion
        xevent: "click.surveyplayer",

        //#region Create
        _create: function () {
            try {
                prweb.playersvc = prweb.surveyplayersvc.NewPlayerSvc(this.element);
                prweb.playersvc.setUpScrollApi();
                if (prweb.IsTouch) {
                    this.xevent = "tap.surveyplayer";

                    this._populateSwipeGestureHandler();
                    this._widgetizePinchPanZoom();
                }
                this._populatePrevNextBtnHandlers();
                prweb.playersvc.SurveySelect();
            }
            catch (ex) {
                alert("prweb.surveyplayer.create reports " + ex.Message);
            }
        },

        //#endregion

        //#region populatePrevNextBtnHandlers
        _populatePrevNextBtnHandlers: function () {
            var self = this;
            prweb.playersvc.scrollapi.prwnxtbtn.on(this.xevent, function (e) {
                e.cancelBubble = true;
                prweb.showClick(this);
                prweb.playersvc.navigateNext();
            });
            prweb.playersvc.scrollapi.prwprevbtn.on(this.xevent, function (e) {
                e.cancelBubble = true;
                prweb.showClick(this);
                prweb.playersvc.navigatePrev();
            });
        },

        //#endregion

        //#region WidgetizePinchZoom
        _widgetizePinchPanZoom: function () {
            try {
                $("#surveyplayersurveycontainerwrapper").pinchpanzoom({
                    ppztargetslctor: "#surveyplayersurveyscrollable",
                    isswipeable: false,
                    issurveyviewpagepanelhost: false
                });
            }
            catch (ex) {
                alert("surveyplayer.widgetizePinchPanZoom reports " + ex.Message);
            }
        },
        //#endregion

        //#region SwipeGestureHandler
        xswipeevent: "swipe.surveyplayer",
        _populateSwipeGestureHandler: function () {

            try {
                $("#surveyplayersurveyscrollable").css('-webkit-transform', ' translate3d(0,0,0)');
                $("#surveyplayersurveyscrollable").bind(this.xswipeevent, function (e) {
                    //                    prweb.debugsvc.Write("examples.swipe");
                    e.cancelBubble = true;
                    switch (true) {
                        case (e.direction == "left"):
                            prweb.playersvc.navigateNext();
                            break;
                        case (e.direction == "right"):
                            prweb.playersvc.navigatePrev();
                            break;
                    }
                });
            }
            catch (ex) {
                alert("surveyplayer.populateSwipeGestureHandler reports " + ex.Message);
            }

        },
        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    //                    $(".examplesgalleryitem", this.element).off(this.xevent);
                    prweb.playersvc.scrollapi.prwprevbtn.off(this.xevent);
                    prweb.playersvc.scrollapi.prwnxtbtn.off(this.xevent);
                    prweb.playersvc.scrollapi.dispose();
                    prweb.playersvc.scrollapi = null;
                    if (prweb.IsTouch) {
                        $("#surveyplayersurveycontainerwrapper").data("pinchpanzoom").dispose();
                    }
                    prweb.playersvc = null;
                    if (prweb.surveypagenavisvc !== undefined) {
                        prweb.surveypagenavisvc.Shutdown();
                    }
                }
                catch (ex) {
                    alert("prweb.surveyplayer.dispose reports error " + ex.Message);
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
                alert("prweb.surveyplayer.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.rdentsurveyplayer', {
        //#region Options
        options: {
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion
        xevent: "click.rdentsurveyplayer",

        //#region Create
        _create: function () {
            try {
                prweb.rdentsurveyplayersvc.setUpScrollApi();
                if (prweb.IsTouch) {
                    this.xevent = "tap.rdentsurveyplayer";
                    prweb.gestureizer.DesignInitialize();
                    this._populateSwipeGestureHandler();
                    this._widgetizePinchPanZoom();
                }
                this._populatePrevNextBtnHandlers();
                prweb.rdentsurveyplayersvc.SurveySelect();
            }
            catch (ex) {
                alert("prweb.rdentsurveyplayer.create reports " + ex.Message);
            }
        },

        //#endregion

        //#region populatePrevNextBtnHandlers
        _populatePrevNextBtnHandlers: function () {
            var self = this;
            prweb.rdentsurveyplayersvc.scrollapi.prwnxtbtn.on(this.xevent, function (e) {
                e.cancelBubble = true;
                prweb.showClick(this);
                prweb.rdentsurveyplayersvc.navigateNext();
            });
            prweb.rdentsurveyplayersvc.scrollapi.prwprevbtn.on(this.xevent, function (e) {
                e.cancelBubble = true;
                prweb.showClick(this);
                prweb.rdentsurveyplayersvc.navigatePrev();
            });
        },

        //#endregion

        //#region WidgetizePinchZoom
        _widgetizePinchPanZoom: function () {
            try {
                $("#surveyplayersurveycontainerwrapper").pinchpanzoom({
                    ppztargetslctor: "#surveyplayersurveycontainer",
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
        xswipeevent: "swipe.rdentsurveyplayer",
        _populateSwipeGestureHandler: function () {

            try {
                $("#surveyplayersurveyscrollable").css('-webkit-transform', ' translate3d(0,0,0)');
                $("#surveyplayersurveyscrollable").bind(this.xswipeevent, function (e) {
                    //                    prweb.debugsvc.Write("examples.swipe");
                    e.cancelBubble = true;
                    switch (true) {
                        case (e.direction == "left"):
                            prweb.rdentsurveyplayersvc.navigateNext();
                            break;
                        case (e.direction == "right"):
                            prweb.rdentsurveyplayersvc.navigatePrev();
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
                    prweb.rdentsurveyplayersvc.scrollapi.prwprevbtn.off(this.xevent);
                    prweb.rdentsurveyplayersvc.scrollapi.prwnxtbtn.off(this.xevent);
                    prweb.rdentsurveyplayersvc.scrollapi.dispose();
                    prweb.rdentsurveyplayersvc.scrollapi = null;
                    if (prweb.IsTouch) {
                        $("#surveyplayersurveycontainerwrapper").data("pinchpanzoom").dispose();
                    }
                }
                catch (ex) {
                    alert("prweb.rdentsurveyplayer.dispose reports error " + ex.Message);
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
                alert("prweb.rdentsurveyplayer.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
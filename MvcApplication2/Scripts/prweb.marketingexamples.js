/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.marketingexamples', {
        //#region Options
        options: {
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion
        
        

        //#region Create
        xevent: "click.marketingexamples",
        _create: function () {
            try {

                prweb.marketingexamplessvc.setUpScrollApi();
                if (prweb.IsTouch) {
                    this.xevent = "tap.marketingexamples";

                    this._populateSwipeGestureHandler();
                    this._widgetizePinchPanZoom();
                }
                this._populatePrevNextBtnHandlers();
                this._retrieveGallery();

            }
            catch (ex) {
                alert("prweb.marketingexamples.create reports " + ex.Message);
            }
        },
//#endregion


        _showExample: function () {
            try {

            }
            catch (ex) {
                alert("prweb.marketingexamples.showExample reports " + ex.Message);
            }
        },

        _showGallery: function () {
            try {

            }
            catch (ex) {
                alert("prweb.marketingexamples.showExample reports " + ex.Message);
            }
        },

//#region Gallery retrieve and PopulateGallerItemHandlers

        _populateGalleryItemHandlers: function () {
            var self = this;
            $(".examplesgalleryitem", this.element).on(this.xevent, function (e) {
                e.cancelBubble = true;
                prweb.showClick(this);
                var kodata = ko.dataFor(this);
                prweb.marketingexamplessvc.GalleryItemSelectAction(kodata);
            });
        },


        _retrieveGallery: function () {
            var self = this;
            try {
                var myurl = prweb.mktmgr.MktResources.templateslistURL;
                prweb.dataManager.sendRequest({
                    url: myurl,
                    success: function (gallerydata) {
                        try {
                            prweb.marketingexamplessvc.populateGalleryVmx(gallerydata);
                            var konode = $("#marketingexamplesgallerykonode");
                            ko.applyBindings(prweb.marketingexamplessvc.galleryVmx, konode[0]);
                            konode = null;
                            self._populateGalleryItemHandlers();
                            prweb.marketingexamplessvc.GallerySelect();
                        }
                        catch (ex) {
                            alert("prweb.marketingexamples.RetrieveGallery.successhandler reports " + ex.Message);
                        }
                    },
                    error: function (e) {
                        alert('prweb.marketingexamples.RetrieveGallery reports error...' + e.toString());
                    }
                });
            }
            catch (ex) {
                alert("prweb.marketingexamples.RetrieveGallery reports " + ex.Message);
            }
        },

//#endregion


        //#region populatePrevNextBtnHandlers
        _populatePrevNextBtnHandlers: function () {
            var self = this;
            prweb.marketingexamplessvc.scrollapi.prwnxtbtn.on(this.xevent, function (e) {
                e.cancelBubble = true;
                prweb.showClick(this);
                prweb.marketingexamplessvc.navigateNext();
            });
            prweb.marketingexamplessvc.scrollapi.prwprevbtn.on(this.xevent, function (e) {
                e.cancelBubble = true;
                prweb.showClick(this);
                prweb.marketingexamplessvc.navigatePrev();
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
        xswipeevent: "swipe.surveyplayer",
        _populateSwipeGestureHandler: function () {

            try {
                $("#surveyplayersurveyscrollable").css('-webkit-transform', ' translate3d(0,0,0)');
                $("#surveyplayersurveyscrollable").bind(this.xswipeevent, function (e) {
                    //                    prweb.debugsvc.Write("examples.swipe");
                    e.cancelBubble = true;
                    switch (true) {
                        case (e.direction == "left"):
                            prweb.marketingexamplessvc.navigateNext();
                            break;
                        case (e.direction == "right"):
                            prweb.marketingexamplessvc.navigatePrev();
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
                    $(".examplesgalleryitem", this.element).off(this.xevent);
                    prweb.marketingexamplessvc.scrollapi.prwprevbtn.off(this.xevent);
                    prweb.marketingexamplessvc.scrollapi.prwnxtbtn.off(this.xevent);
                    prweb.marketingexamplessvc.scrollapi.dispose();
                    prweb.marketingexamplessvc.scrollapi = null;
                    if (prweb.IsTouch) {
                        $("#surveyplayersurveycontainerwrapper").data("pinchpanzoom").dispose();
                    }
                }
                catch (ex) {
                    alert("prweb.marketingexamples.dispose reports error " + ex.Message);
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
                alert("prweb.marketingexamples.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
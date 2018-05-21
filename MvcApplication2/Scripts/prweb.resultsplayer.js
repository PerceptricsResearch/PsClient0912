/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.resultsplayer', {
        //#region Options
        options: {
            domainlist: false,
            domainlistURL: false,
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion
        xevent: "click.resultsplayer",

        //#region Create
        _create: function () {
            try {
                //                this.playersvc = prweb.resultsplayersvc.NewPlayerSvc(this.element);
                prweb.playersvc = prweb.resultsplayersvc.NewPlayerSvc(this.element);
                prweb.playersvc.setUpScrollApi();
                //                prweb.playersvc.SurveySelect();

                //                prweb.surveymodelsvc.PageCount = this.options.pagesCount;
                //                prweb.actionContext.currentpgnumber = 1;
                $("#surveycurrentgrplabel").html("All Respondents");
                //                prweb.rfmsvc.ShowPieCharts();

                //                prweb.rfmsvc.InitializeGroupsSlideoutPanel();
                //                prweb.surveymetadatasvc.LaunchSurveyMetaDataView();
                if (prweb.IsTouch) {
                    this.xevent = "tap.resultsplayer";

                    this._populateSwipeGestureHandler();
                    this._widgetizePinchPanZoom();
                }
                var ps = prweb.pubsub.subscribe;
                this._manageVSMEvents(ps);
                ps = null;
                this._populatePrevNextBtnHandlers();
                prweb.playersvc.SurveySelect();
            }
            catch (ex) {
                alert("prweb.resultsplayer.create reports " + ex.Message);
            }
            return;
        },

        //#endregion

        //        playersvc: false,

        //#region populatePrevNextBtnHandlers
        _populatePrevNextBtnHandlers: function () {
            //            var self = this;
            prweb.playersvc.scrollapi.prwnxtbtn.on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                prweb.playersvc.navigateNext();
                return false;
            });
            prweb.playersvc.scrollapi.prwprevbtn.on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                prweb.playersvc.navigatePrev();
                return false;
            });
        },
        //#endregion

        //#region NavigateToPageNumber
        //is EventHandler for pagelistpageiconselected...
        _navigateToPageNumber: function (pgnum) {
            prweb.playersvc.seekTo(parseInt(pgnum));
            return;
        },
        //#endregion

        //#region WidgetizePinchZoom
        _widgetizePinchPanZoom: function () {
            try {
                $("#resultsplayersurveycontainerwrapper").pinchpanzoom({
                    ppztargetslctor: "#resultsplayersurveyscrollable",
                    isswipeable: false,
                    issurveyviewpagepanelhost: false
                });
            }
            catch (ex) {
                alert(".resultsplayer.widgetizePinchPanZoom reports " + ex.Message);
            }
            return;
        },
        //#endregion

        //#region SwipeGestureHandler
        xswipeevent: "swipe.resultsplayer",
        _populateSwipeGestureHandler: function () {
            var self = this;
            try {
                $(".surveyplayersurveypage", "#resultsplayersurveyscrollable").css('-webkit-transform', ' translate3d(0,0,0)');
                $(".surveyplayersurveypage", "#resultsplayersurveyscrollable").on(this.xswipeevent, function (e) {
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
                    return;
                });
            }
            catch (ex) {
                alert("resultsplayer.populateSwipeGestureHandler reports " + ex.Message);
            }
            return;
        },
        //#endregion

        //#region GroupDefnPageIconSelected
        _moveToVisualstategrpdefnpageiconselected: function (e) {
            try {
                if (prweb.rfmsvc.pcmidpgnumbers) {
                    var pgnumkvp = Enumerable.From(prweb.rfmsvc.pcmidpgnumbers).Where(function (xpcm) { return xpcm.Key == e.pcmid }).FirstOrDefault();
                    var pgnum = pgnumkvp.Valu;
                    pgnumkvp = null;
                    this._navigateToPageNumber(pgnum);
                }
            }
            catch (ex) {
                alert("prweb.resultsplayer.moveToVisualstategrpdefnpageiconselected reports " + ex.Message);
            }
            return;
        },
        //#endregion

        //#region AnimateSurveyPanel
        _animateSurveyPanel: function (panelconfig) {
            var leftwidth = 0;
            var newwidth = 0;
            var open = false;
            try {
                if (panelconfig) {
                    switch (true) {
                        case (panelconfig.open):
                            leftwidth = panelconfig.leftwidth;
                            open = true;
                            break;
                    }
                }
                else {
                    open = false;
                }
                var resizething = prweb.playersvc.scrollapi.resizeAction;
                switch (true) {
                    case (open):
                        //newwidth = $("#resultssurveyviewroot").parent().innerWidth() - leftwidth;
                        $(".resultssurveypanelresizable").animate({
                            marginLeft: leftwidth
                        }, { duration: 200,
                            easing: 'easeInQuad',
                            complete: resizething
                        });
                        break;
                    case (!open):
                        var $this = this.element;
                        var tvo = setTimeout(function () {
                            $(".resultssurveypanelresizable").animate({ marginLeft: "" }, { duration: 100, easing: 'easeInQuad', complete: resizething });
                            clearTimeout(tvo);
                            return;
                        }, 200);
                        break;
                };
            }
            catch (ex) {
                alert("resultsplayer.animateSurveyPanel reports " + ex.Message);
            }
            leftwidth = null;
            newwidth = null;
            return;
        },
        //#endregion

        //#region RsltsGroupsButtonClick
        _moveToVisualstatersltsgroupsbtnclick: function () {
            try {
                prweb.actionContext.isrsltsgrpdefnactive = false;
                prweb.rfmsvc.ShowPieCharts();
                //                this.options.grpdefncntnrvisibility = false;
                //                this.options.smddtlsbtnvisibility = false; //prweb.panelsmgr closes the surveymetadatapanel...
                var rsltsgrpIsOpen = prweb.panelsmgr.GetPanelIsOpen("groupsslideoutpanel");
                if (rsltsgrpIsOpen) {
                    //                    this.options.rsltsgrpsbtnvisibiliy = false;
                    this._animateSurveyPanel(false);
                }
                else {
                    //                    this.options.rsltsgrpsbtnvisibiliy = true;
                    this._animateSurveyPanel({
                        leftwidth: "17.5em",
                        open: true
                    });
                }
            }
            catch (ex) {
                alert("resultsplayer.movetoVisualrsltsgroupsbtnclick reports " + ex.Message);
            }
            return;
        },

        //#endregion

        //#region DetailsButtonClick SurveyMetaData
        _moveToVisualstatesmddetailsbtnclick: function (smddtlsbtnvisibility) {
            try {
                prweb.actionContext.isrsltsgrpdefnactive = false;
                prweb.rfmsvc.ShowPieCharts();
                //                this.options.grpdefncntnrvisibility = false;
                //                this.options.rsltsgrpsbtnvisibiliy = false; //prweb.panelsmgr closes the groupsslideoutpanel...
                var smdisOpen = prweb.panelsmgr.GetPanelIsOpen("surveymetadata"); //this happens before the widget reportsIsDocked...so use opposite of what you would think.
                if (smdisOpen) {
                    //                    this.options.smddtlsbtnvisibility = false;
                    this._animateSurveyPanel(false);
                }
                else {
                    //                    this.options.smddtlsbtnvisibility = true;
                    this._animateSurveyPanel({
                        leftwidth: "13em",
                        open: true
                    });
                }
            }
            catch (ex) {
                alert("resultsplayer.movetoVisualrsltsgroupsbtnclick reports " + ex.Message);
            }
            return;
        },

        //#endregion

        //#region ActionsButtonClick
        _moveToVisualStateActionsBtnClick: function () {
            this._animateSurveyPanel(false);
        },
        //#endregion

        //#region SurveysButtonClick
        _moveToVisualstateSurveysbtnclick: function () {
            this._animateSurveyPanel(false);
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
                alert("prweb.resultsplayer.manageVSMEvents reports " + ex.Message);
            }
        },
        //#endregion


        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    var ps = prweb.pubsub.unsubscribe;
                    this._manageVSMEvents(ps);
                    ps = null;
                    prweb.surveymetadatasvc.RemoveSurveyMetaDataView();
                    prweb.playersvc.scrollapi.prwprevbtn.off(this.xevent);
                    prweb.playersvc.scrollapi.prwnxtbtn.off(this.xevent);
                    prweb.playersvc.scrollapi.dispose();
                    prweb.playersvc.scrollapi = null;
                    prweb.playersvc.Dispose();
                    prweb.playersvc = false;
                    if (prweb.IsTouch) {
                        $("#resultsplayersurveycontainerwrapper").data("pinchpanzoom").dispose();
                        $(".surveyplayersurveypage", "#resultsplayersurveyscrollable").off(this.xswipeevent);
                    }
                    if (prweb.surveypagenavisvc !== undefined) {
                        prweb.surveypagenavisvc.Shutdown();
                    }
                }
                catch (ex) {
                    alert("prweb.resultsplayer.dispose reports error " + ex.Message);
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
                alert("prweb.resultsplayer.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
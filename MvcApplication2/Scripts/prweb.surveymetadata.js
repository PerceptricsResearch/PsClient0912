/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {

    $.widget('prweb.surveymetadata', {
        options: {
            surveycontext: -1,
            isDisposed: false
        },

        _create: function () {
            try {
                //dindings to surveymetadatasvc.vmx are done when the widget is openned/viewed for the first time...
                //see _surveyDetailsButtonClick below...in the 'isdDocked == empty' case...
                if (prweb.IsTouch) {
                    $("#surveymetadatacontainer").css("-webkit-transform", "translate3d(0,0,0)");
                }
                this._subscribeToVSMEvents();
            }
            catch (ex) {
                alert("surveymetadata.js.create reports " + ex.Message);
            }
        },


        //#region AnimationObjects and IsDocked
        animwidthzero: { width: 0 },
        animwidthwide: { width: "13em" },
        animdur: { duration: 300, easing: 'easeInQuad' },
        animduropen: { duration: 300, easing: 'easeInQuad' },
        isDocked: "empty",
        //#endregion

        //#region DetailsButtonClick

        _surveyDetailsButtonClick: function () {
            switch (true) {
                case (this.isDocked == "empty"):
                    {
                        $("#surveymetadatacontainer").removeClass("prwslideouthide").stop(true, false).animate(this.animwidthwide, this.animduropen);
                        this.isDocked = false;
                        prweb.surveymetadatasvc.RegisterSMDConsumer();
                        var konode = $("#prwsmdkobindingpoint");
                        ko.applyBindings(prweb.surveymetadatasvc.viewModelx, konode[0]);
                        konode = null;
//                        if (prweb.IsTouch) {
//                            $("#prwsmditemsset").scroller({
//                                vertical: true,
//                                touch: true,
//                                prev: ".smdprev",
//                                next: ".smdnext",
//                                items: ".itemssmd",
//                                item: ".prwsmditemcontainer",
//                                inertialbtns: true
//                            });
//                        }

                        break;
                    };
                case (this.isDocked):
                    {
                        $("#surveymetadatacontainer").stop(true, false).animate(this.animwidthwide);
                        this.isDocked = false;
                        break;
                    };
                case (!this.isDocked):
                    {
                        $("#surveymetadatacontainer").stop(true, false).animate(this.animwidthzero, this.animdur);
                        this.isDocked = true;
                        break;
                    };
            };
            prweb.panelsmgr.ReportIsDocked("surveymetadata", this.isDocked);
            return true;
        },

        //#endregion

        _myCloseList: function () {
            if (this.isDocked != "empty" && !(this.isDocked)) {
                $("#surveymetadatacontainer").stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
                prweb.panelsmgr.ReportIsDocked("surveymetadata", this.isDocked);
            }
            return true;
        },

        _moveToVisualStateSMDDetailsBtnClick: function () {
            this._surveyDetailsButtonClick();
            return true;
        },
        _moveToVisualStateCloseList: function () {
            this._myCloseList();
            return true;
        },

        //VSM visualstate methods...
        _surveyOpenedHandler: function () {
            prweb.surveymetadatasvc.OpenSurvey();
        },

        _surveyClosedHandler: function () {
            prweb.surveymetadatasvc.CloseSurvey();
            this._moveToVisualStateCloseList();
        },

        _subscribeToVSMEvents: function () {
            prweb.pubsub.subscribe(prweb.events.appsvc.surveycontextchanged, this._moveToVisualStateCloseList, this);
            prweb.pubsub.subscribe(prweb.events.subscriberplatform.surveyopened, this._surveyOpenedHandler, this);
            prweb.pubsub.subscribe(prweb.events.subscriberplatform.surveyclosed, this._surveyClosedHandler, this);
            //            prweb.pubsub.subscribe(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateCloseList, this);
            //            prweb.pubsub.subscribe(prweb.events.subscriberplatform.pagesbtnclick, this._moveToVisualStateCloseList, this);
            //            prweb.pubsub.subscribe(prweb.events.subscriberplatform.rsltsgroupsbtnclick, this._moveToVisualStateCloseList, this);
            prweb.pubsub.subscribe(prweb.events.subscriberplatform.smddetailsbtnclick, this._moveToVisualStateSMDDetailsBtnClick, this);
            prweb.pubsub.subscribe(prweb.events.subscriberplatform.publishsurveyiconclick, this._moveToVisualStateCloseList, this);
        },

        //#region Dispose Destroy

        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    var ps = prweb.pubsub.unsubscribe;
                    ps(prweb.events.appsvc.surveycontextchanged, this._moveToVisualStateCloseList, this);
                    ps(prweb.events.subscriberplatform.surveyopened, this._surveyOpenedHandler, this);
                    ps(prweb.events.subscriberplatform.surveyclosed, this._surveyClosedHandler, this);
                    //                    ps(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateCloseList, this);
                    //                    ps(prweb.events.subscriberplatform.pagesbtnclick, this._moveToVisualStateCloseList, this);
                    //                    ps(prweb.events.subscriberplatform.rsltsgroupsbtnclick, this._moveToVisualStateCloseList, this);
                    ps(prweb.events.subscriberplatform.smddetailsbtnclick, this._moveToVisualStateSMDDetailsBtnClick, this);
                    ps(prweb.events.subscriberplatform.publishsurveyiconclick, this._moveToVisualStateCloseList, this);
                    ps = null;

                    if (this.isDocked != "empty") {
                        this._myCloseList(); //if panel is open, close it...
                        var konode = $("#prwsmdkobindingpoint");
                        ko.cleanNode(konode[0]);
                        konode = null;
                        var scr = $("#prwsmditemsset").data('scroller') || false;
                        if (scr) {
                            scr.dispose();
                            scr = null;
                        }
                        $("#prwsmditemsset").remove();
                    }
                }
                catch (ex) {
                    alert("prweb.surveymetadata.dispose reports error " + ex.Message);
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
                alert("prweb.surveymetadata.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }


        //#endregion

    }); //end of widget defn...

} (this.prweb, jQuery));


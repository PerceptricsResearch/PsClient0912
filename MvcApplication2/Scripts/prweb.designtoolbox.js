/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.6.4-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designtoolbox', {
        options: {
            melayoutElement: null,
            medetached: null,
            appendto: null,
            myDOMNode: null,
            lastone: null
        },

        xevent: "click.designtoolbox",

        _create: function () {
            //this.element is $("#designertoolboxslideoutpanel")...widget applied by designerhome.create...
            if (prweb.IsTouch) {
                //                $("#dsgntlbxpartsppzparent").pinchpanzoom({ ppztargetslctor: "#dsgntlbxpartsppztarget" });
            }
            //            $("#dtlbxmenu").scroller({
            //                vertical: false,
            //                touch: true,
            //                prev: ".prevdsgntlbx",
            //                next: ".nextdsgntlbx",
            //                items: ".dtlbxmenu",
            //                item: ".dtlbxmenuitem",
            //                inertialbtns: true
            //            });
            //            $("#dsgntlbxscrollable").scroller({
            //                vertical: false,
            //                touch: true,
            //                items: ".itemsdsgntlbx",
            //                item: ".dsgntlbxitemcontainer" 
            //            });
            var myclass = "designtoolbox";
            if (prweb.IsTouch) {
                this.xevent = "tap.designtoolbox";
            }
            this._bindcollapsablepanels();
            this._populateBtnClickHandlers(myclass, this.xevent);
            //            this._populateoptionsrowbtnhandler(myclass, xevent);
            //            this._populateoptionscolumnbtnhandler(myclass, xevent);
            //            this._populateoptionsbtnhandler(myclass, xevent);
            $("#dsgnarrangepanel").designarrange();
            //            $("#dsgntextpanel").designtext();
            //            $("#dsgnbxsbtnspanel").designboxsbtns();

            myclass = null;
            xevent = null;
        },

        Vmx: {
            collapsablesdxnry: [],
            populatecollapsables: function () {
                try {
                    for (var i = 0; i <= 3; i++) {
                        try {
                            var entry = {
                                isexpanded: ko.observable(false)
                            };
                            this.collapsablesdxnry.push(entry);
                        }
                        catch (ex) {
                            alert("prweb.designtoolbox.Vmx.populatecollapsablesentry reports error " + ex.Message);
                        }
                    };
                    this.collapsablesdxnry[0].isexpanded(true);
                }
                catch (ex) {
                    alert("prweb.designtoolbox.Vmx.populatecollapsable reports error " + ex.Message);
                }
                return;
            },
            collapseany: function () {
                try {
                    for (var i = 0; i <= 3; i++) {
                        try {
                            if (this.collapsablesdxnry[i].isexpanded()) {
                                this.collapsablesdxnry[i].isexpanded(false);
                            }
                        }
                        catch (ex) {

                        }
                    };
                }
                catch (ex) {
                    alert("prweb.designtoolbox.Vmx.collapseany reports error " + ex.Message);
                }
                return;
            },
            methods: {
                dispose: function () {
                    return;
                }
            }
        },

        _bindcollapsablepanels: function () {
            try {
                this.Vmx.populatecollapsables();
                var konode = $("#designertoolboxslideoutpanel")[0];
                ko.applyBindings(this.Vmx, konode);
                konode = null;
                $(".dtlbxmenuitem").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        e.cancelBubble = true;
                        e = null;
                        var kodata = ko.dataFor(this);
                        ko.contextFor(this).$root.collapseany();
                        kodata.isexpanded(!kodata.isexpanded());
                        kodata = null;
                    }
                    catch (ex) {
                        alert("prweb.designtoolbox.bindcollapsablepanels.clickhandler reports error " + ex.Message);
                    }
                    return false;
                });
            }
            catch (ex) {
                alert("prweb.designtoolbox.bindcollapsablepanels reports error " + ex.Message);
            }
            return;
        },

        //#region PopulateBtnClickHandlers

        _populateBtnClickHandlers: function (myclass, xevent) {
            //            var self = this;
            //            var menuscr = $("#dtlbxmenu").data("scroller");
            //            var scrmethods = $("#dsgntlbxscrollable").data("scroller");
            //            $("#dtlbxmenuxbtn").addClass(myclass).on(xevent, function (e) {
            //                //                alert("sees click");
            //                e.preventDefault();
            //                e.stopPropagation();
            //                e.cancelBubble = true;
            //                prweb.showClick(this);
            //                //                if (!menuscr.wasMove()) {
            //                //                scrmethods.seekTo(0);
            //                //                }

            //                e = null;
            //                return false;
            //            });
            //            $("#dtlbxmenuclipboardbtn").addClass(myclass).on(xevent, function (e) {
            //                //                alert("sees click");
            //                e.preventDefault();
            //                e.stopPropagation();
            //                e.cancelBubble = true;
            //                prweb.showClick(this);
            //                //                if (!menuscr.wasMove()) {
            //                //                scrmethods.seekTo(1);
            //                //                }

            //                e = null;
            //                return false;
            //            });
            //            $("#dtlbxmenupagesbtn").addClass(myclass).on(xevent, function (e) {
            //                e.preventDefault();
            //                e.stopPropagation();
            //                e.cancelBubble = true;
            //                //                if (!menuscr.wasMove()) {
            //                //                scrmethods.seekTo(2);
            //                //                }

            //                e = null;
            //                return false;
            //            });
            //            $("#dtlbxmenuarrangebtn").addClass(myclass).on(xevent, function (e) {
            //                e.preventDefault();
            //                e.stopPropagation();
            //                e.cancelBubble = true;
            //                //                if (!menuscr.wasMove()) {
            //                //                scrmethods.seekTo(3);
            //                //                }

            //                e = null;
            //                return false;
            //            });
            //            $("#dtlbxmenutextbtn").addClass(myclass).on(xevent, function (e) {
            //                e.preventDefault();
            //                e.stopPropagation();
            //                //                if (!menuscr.wasMove()) {
            //                scrmethods.seekTo(4);
            //                //                }

            //                e = null;
            //                return false;
            //            });
            //            $("#dtlbxmenuoptionsbtn").addClass(myclass).on(xevent, function (e) {
            //                e.preventDefault();
            //                e.stopPropagation();
            //                //                if (!menuscr.wasMove()) {
            ////                scrmethods.seekTo(5);
            //                //                }

            //                e = null;
            //                return false;
            //            });
            //            $("#dtlbxmenuchecksbtn").addClass(myclass).on(xevent, function (e) {
            //                e.preventDefault();
            //                e.stopPropagation();
            //                //                if (!menuscr.wasMove()) {
            ////                scrmethods.seekTo(6);
            //                //                }

            //                e = null;
            //                return false;
            //            });
            this._subscribeToVSMEvents();
            $("#prwTIgnatzBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.PCelemColxnAddT("prwTIgnatz");
                return false;
                //higlight the button...
            });
            //            this.options.prwTIgnatzBtn = null;

            $("#prwtimagebtn").on(xevent, function (e) {
                //                alert("sees click");
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.PCelemColxnAddT("prwTImage");
                return false;
                //higlight the button...
            });

            //            this.options.prwTImageBtn = null;
            $("#prwTOptionRowBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.PCelemColxnAddT("prwTQuestOptionSet");
                return false;
                //higlight the button...
            });
            //            //            this.options.prwTOptionRowBtn = null;
            $("#prwTOptionColmBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                var elemprops = {
                    UniGridRows: 3,
                    UniGridColumns: 1
                };
                prweb.designersvc.PCelemColxnAddT("prwTQuestOptionSet", elemprops);
                return false;
                //higlight the button...
            });
            //            this.options.prwTOptionRowBtn = null;
            $("#prwdsgnCopyBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.PCelemCopyElement();
                return false;
            });
            $("#prwdsgnCutBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.PCElemCutElement();
                return false;
            });
            $("#prwdsgnPasteBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                var pd = prweb.designersvc.PCElemPasteElement();
                //                pd();
                pd = null;
                return false;
            });
            $("#prwdsgnRemoveBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                var pd = prweb.designersvc.PCelemColxnRemove();
                //                pd();
                pd = null;
                return false;
            });
            $("#prwdsgnUndoBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.UndoPCelemColxnAction();
                return false;
            });
            //            this.options.prwdsgnRemoveBtn = null;
            $("#prwdsgnNewPageBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                //                var pd = prweb.designersvc.PCMColxnInsertNewPage;
                prweb.designersvc.PCMColxnInsertNewPage();
                //                pd = null;
                return false;
            });
            $("#prwdsgnCopyPageBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.PCMColxnCopyPage();
                return false;
            });
            $("#prwdsgnPastePageBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.PCMColxnPastePage();
                return false;
            });
            $("#prwdsgnCutPageBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.PCMColxnCutPage();
                return false;
            });
            $("#prwdsgnRemovePageBtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.PCMColxnRemovePage();
                return false;
            });
            return;
        },

        //#endregion

        //#region ToolboxBtnClick HideShow

        animwidthzero: { width: 0 },
        animwidthwide: { width: "100%" },
        animdur: { duration: 300, easing: 'easeInQuad' },
        animduropen: { duration: 300, easing: 'easeInQuad', complete: function () {
            //            var ow = $("#dsgntlbxscrollable").innerWidth();
            //            var tw = (ow * 1) + "px";
            $(".dsgntlbxitemcontainer").removeClass("prwslideouthide"); //.width(tw)
            //            ow = null;
            //            tw = null;
        }
        },
        isDocked: "empty",


        _myDesginToolboxbtnClick: function () {
            switch (true) {
                case (this.isDocked == "empty"):
                    {
                        $("#designtoolscontainer").removeClass("prwslideouthide").stop(true, false).animate(this.animwidthwide, this.animduropen);
                        //animduropen has an animation complete callback that sizes items in the scrollable to the width of the container...
                        //happens only once...when the control is first undocked...
                        this.isDocked = false;
                        break;
                    };
                case (this.isDocked):
                    {
                        $("#designtoolscontainer").stop(true, false).animate(this.animwidthwide);
                        this.isDocked = false;
                        break;
                    };
                case (!this.isDocked):
                    {
                        $("#designtoolscontainer").stop(true, false).animate(this.animwidthzero, this.animdur);
                        this.isDocked = true;
                        break;
                    };
            };
            prweb.designerpanelsmgr.ReportIsDocked("designtoolbox", this.isDocked);
            return true;
        },

        _myCloseList: function () {
            if (!this.isDocked) {
                $("#designtoolscontainer").stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
                prweb.designerpanelsmgr.ReportIsDocked("designtoolbox", this.isDocked);
            }

            return true;
        },

        _moveToVisualStateDesignToolboxBtnClick: function () {
            this._myDesginToolboxbtnClick();
            return true;
        },

        _moveToVisualStateCloseList: function () {
            this._myCloseList();

            return true;
        },

        //#endregion

        //#region Subscriptions
        //VSM visualstate methods...
        //        _surveyOpenedHandler: function () {
        //            //            prweb.surveymetadatasvc.OpenSurvey();
        //        },

        //        _surveyClosedHandler: function () {
        //            //            prweb.surveymetadatasvc.CloseSurvey();
        //            //            this._moveToVisualStateCloseList();
        //        },
        _subscribeToVSMEvents: function () {
            var ps = prweb.pubsub.subscribe;
            ps(prweb.events.subscriberplatform.prwdesigntoolsbtn, this._moveToVisualStateDesignToolboxBtnClick, this);
            ps(prweb.events.appsvc.surveycontextchanged, this._moveToVisualStateCloseList, this);
            //            prweb.pubsub.subscribe(prweb.events.subscriberplatform.surveyopened, this._surveyOpenedHandler, this);
            //            prweb.pubsub.subscribe(prweb.events.subscriberplatform.surveyclosed, this._surveyClosedHandler, this);
            //            ps(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateCloseList, this);
            //            ps(prweb.events.subscriberplatform.pagesbtnclick, this._moveToVisualStateCloseList, this);
            ps = null;
            return true;
        },


        //#endregion


        //#region Dispose Destroy

        dispose: function () {
            try {
                $(".dtlbxmenuitem").off(this.xevent).remove();
                $("#dsgnarrangepanel").data("designarrange").dispose();
                $("#dsgnarrangepanel").remove();
                //                $("#dsgntextpanel").data("designtext").dispose();
                //                $("#dsgntextpanel").remove();
                //                $("#dsgnbxsbtnspanel").data("designboxsbtns").dispose();
                //                $("#dsgnbxsbtnspanel").remove();
                this.scrmethods = null;
                this.animwidthzero = null;
                this.animwidthwide = null;
                this.animdur = null;
                this.isDocked = null;
                //                this.options.medetached = null;
                //                this.options.melayoutElement = null;
                //                this.options.appendto = null;
                //                this.options.myDOMNode = null;
                var ps = prweb.pubsub.unsubscribe;
                ps(prweb.events.subscriberplatform.prwdesigntoolsbtn, this._moveToVisualStateDesignToolboxBtnClick, this);
                ps(prweb.events.appsvc.surveycontextchanged, this._moveToVisualStateCloseList, this);
                //                ps(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateCloseList, this);
                //                ps(prweb.events.subscriberplatform.pagesbtnclick, this._moveToVisualStateCloseList, this);
                ps = null;
                $(".designtoolbox", this.element).off(".designtoolbox").remove();
                //                $("#prwTIgnatzBtn").remove(); //these all have svg objects in them...make sure they go away completely...
                //                $("#prwTImageBtn").remove();
                //                $("#prwTOptionRowBtn").remove();
                //                $("#prwdsgnRemoveBtn").remove();
                //                $("#prwdsgnNewPageBtn").remove();
                //                this._destroyScrollable();
                //                $("#dtlbxmenu", this.element).data('scroller').dispose();
                //                $("#dtlbxmenu", this.element).remove();
                //                $(".scrollabledtlbx", this.element).data('scroller').dispose();
                $(".scrollabledtlbx", this.element).remove();
                //                $(".scrollabledtlbx", this.element).removeData('scroller');
                if (this.options.subscrid) {
                    this.options.subscrid = null;
                }

                //                this.element.children().unbind().empty().remove();
                //                this.element.empty();
                //                this.element.empty();

            }
            catch (ex) {
                alert("prweb.designtoolbox.dispose reports error " + ex.Message);
                ex = null;
            }
            return;
        },

        destroy: function () {
            //            this._dispose();
            //            this.element.remove();
            $.Widget.prototype.destroy.call(this);
            //            this.element = null;
        }

        //#endregion

        //end of widget defn...
    });
} (this.prweb, jQuery));
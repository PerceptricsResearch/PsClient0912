(function (prweb, $) {

    // pagescount....if pagescount was available for each survey(without having to retrieve the pages...) we could support a really quick image based view of any survey...
    // this is pageslist for designers...there is a different version for RDents to do pagelevelnavigation with...rdsurveypageslist...different because 
    // RDent stuff uses fewer prweb objects...only has a single survey datacontext...

    $.widget('prweb.designerpageslist', {

        //#region Options, Variables and Create 

        options: {
            medetached: null,
            appendto: null,
            hasAppliedBindings: false,
            subscrid: null,
            lastone: null,
            isDisposed: false
        },

        pagemenu: false,
        pageicons: false,
        myclass: "designerpageslist",
        xevent: "click.designerpageslist",
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.designerpageslist";
                }
                this.pagemenu = $("#dplpagemenu").html();
                $("#dplpagemenu").remove();
                //                prweb.surveymodelsvc.populatepageslistVMx();
                var mydmn = $("#dplpul")[0];
                ko.applyBindings(prweb.surveymodelsvc.pageslistViewModelx, mydmn);
                mydmn = null;
                //            this.options.hasAppliedBindings = true;
                this._subscribeToPubSubEvents();
                this._subscribeToPageNumberChange();
                this._populatePagesListButtonHandlers();
                this._populateAppPagesBtnHandler();
                //            this.scrmethods = $("#dplpul").scroller({ vertical: true, touch: true });
            }
            catch (ex) {
                alert("prweb.designerpageslist.create reports error" + ex.Message);
            }
            return;
        },


        //#endregion

        //        _pagesClickHandler: function () {

        //        },

        _pageNumberChangedHandler: function (e) {
            try {
                var pgicons = $(".prwdpageicon", "#designerpageslistpanel").removeClass("dplbtnselected");
                $(".prwdpageiconrect", pgicons).attr("fill", "url(#plg1)");
                var pgnumfilter = '[data-prwpgnum=' + e + ']';
                var onbtnpar = pgicons.filter(pgnumfilter).addClass("dplbtnselected");
                var onbtn = $(".prwdpageiconrect", onbtnpar).attr("fill", "url(#plg0)");
//                prweb.scrollTo(onbtnpar, "#designerpageslistpanel");
                onbtn = null;
                onbtnpar = null;
                pgnumfilter = null;
                pgicons = null;
                e = null;
                
            }
            catch (ex) {
                alert("prweb.designerpageslist.pageNumberChangedHandler reports error" + ex.Message);
            }
            return;
        },

        _subscribeToPageNumberChange: function () {
            try {
                prweb.designersvc.VMXSubscriptions["designerpageslist"] = prweb.designersvc.Vmx.currentpagenumber.subscribe(this._pageNumberChangedHandler);
            }
            catch (ex) {
                alert("prweb.designerpageslist.subscribeToPageNumberChange reports error" + ex.Message);
            }
            return;
        },

        touchable: false,

        //#region ShowPagesMenuDialogue and handlers

        DialogueCompleteHandler: function () {
            $("#dplrectpgmenuinsertbeforenewpagebtn").unbind("mousedown");
            $("#dplrectpgmenuinsertafternewpagebtn").unbind("mousedown");
            $("#dplrectpgmenucopypagebtn").unbind("mousedown");
            $("#dplrectpgmenucutpagebtn").unbind("mousedown");
            $("#dplrectpgmenuremovepagebtn").unbind("mousedown");
            $("#dplrectpgmenuUndobtn").unbind("mousedown");
            $("#dplrectpgmenuinsertbeforepastepagebtn").unbind("mousedown");
            $("#dplrectpgmenuinsertafterpastepagebtn").unbind("mousedown");
            $("#designerdialoguecontainer").unbind("dialogopen");
            $("#designerdialoguecontainer").unbind("blur");
            $("#designerdialoguecontainer").unbind("dialogclose");
            $("#designerdialoguecontainer").html("").dialog("destroy");
            return;
        },

        DialogueOpenHandler: function () {
            $("#dplrectpgmenuinsertbeforenewpagebtn").bind("mousedown", function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                $("#designerdialoguecontainer").dialog("close");
                prweb.designersvc.PageInsertPointManager("before");
                prweb.designersvc.PCMColxnInsertNewPage("before");
                return false;
            });
            $("#dplrectpgmenuinsertafternewpagebtn").bind("mousedown", function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                $("#designerdialoguecontainer").dialog("close");
                prweb.designersvc.PageInsertPointManager("after");
                prweb.designersvc.PCMColxnInsertNewPage("after");
                return false;
            });
            $("#dplrectpgmenucopypagebtn").bind("mousedown", function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                $("#designerdialoguecontainer").dialog("close");
                prweb.designersvc.PCMColxnCopyPage();
                return false;
            });
            $("#dplrectpgmenucutpagebtn").bind("mousedown", function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                $("#designerdialoguecontainer").dialog("close");
                prweb.designersvc.PCMColxnCutPage();
                return false;
            });
            $("#dplrectpgmenuremovepagebtn").bind("mousedown", function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                $("#designerdialoguecontainer").dialog("close");
                //this needs to do a model dialogue...
                prweb.designersvc.PCMColxnRemovePage();
                return false;
            });
            $("#dplrectpgmenuUndobtn").bind("mousedown", function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                $("#designerdialoguecontainer").dialog("close");

                prweb.designersvc.UndoPageAction();
                return false;
            });
            $("#dplrectpgmenuinsertbeforepastepagebtn").bind("mousedown", function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                $("#designerdialoguecontainer").dialog("close");
                prweb.designersvc.PageInsertPointManager("before");
                prweb.designersvc.PCMColxnPastePage("before");
                return false;
            });
            $("#dplrectpgmenuinsertafterpastepagebtn").bind("mousedown", function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                $("#designerdialoguecontainer").dialog("close");
                prweb.designersvc.PageInsertPointManager("after");
                prweb.designersvc.PCMColxnPastePage("after");
                return false;
            });
            $("#designerdialoguecontainer").bind("blur", function () {
                //blur will execute before click events....so create a delay to allow the other events to fire...
                //maybe use defer/promise..?
                //use mousedown..it fires before blur...
                //                setTimeout(function () {
                //                    $("#designerdialoguecontainer").dialog("close");
                //                }, 1000);
                $("#designerdialoguecontainer").dialog("close");
                return false;
            });
            $("#designerdialoguecontainer").focus();
        },

        _showPageToolsDialogue: function () {
            try {
                $("#designerdialoguecontainer").html(this.pagemenu).dialog({
                    modal: false,
                    title: "<div style='overflow:hidden;font-size:10px;'>Pages Actions</div>",
                    height: 300,
                    width: 400,
                    zIndex: 3000,
                    open: this.DialogueOpenHandler

                });
                $("#designerdialoguecontainer").bind("dialogclose", this.DialogueCompleteHandler);
            }
            catch (ex) {
                alert("prweb.designerpageslist.showPageToolsDialogue reports error" + ex.Message);
            }
            return;
        },


        //#endregion

        _pagesClickHandler: function () {
            this._showPageToolsDialogue();
            return;
        },

        _populatePagesListButtonHandlers: function () {
            var self = this;
            //            $("#dplpul").scroller({ 
            //                    vertical: true,
            //                     touch: true
            //                });
            //            this.touchable = $("#dplpul").data("scroller").getTouchable();
            //            $("#dplrectbackbtn").addClass("designerpageslist").bind(this.xevent, function (e) {
            //                e.preventDefault();
            //                e.stopPropagation();
            //                e = null;
            //                self.touchable.MoveMe(-10);
            //            });
            //            $("#dplrectmorebtn").addClass("designerpageslist").bind(this.xevent, function (e) {
            //                e.preventDefault();
            //                e.stopPropagation();
            //                e = null;
            //                //                var tx = $("#dplpul").data("scroller").getTouchable();
            //                //                if (tx) {
            //                //                    tx.MoveMe(10);
            //                //                };
            //                self.touchable.MoveMe(10);
            //            });
            $("#dplrectpagesbtn").addClass("designerpageslist").bind(this.xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                self._pagesClickHandler();
                return false;
            });
        },

        //#region PageIcon Click Handlers and Lights Methods

        //this handles subscriberplatform.pageslistpagecountchanged event....is raised by designerserv.PagesCountChangedHandler
        _resetPageIcons: function () {
            if (this.pageicons) {
                this.pageicons.unbind(this.xevent);
                this.pageicons = null;
                this._populatePageIconClickHandlers();
                //                this._populatePageIconLights(prweb.designersvc.CurrentPageNumber);
            }
            else {
                this._populatePageIconClickHandlers();
                //                this._pageNumberChangedHandler(1); // look at appcontext...if designer use the designersvc.currentpage
            }
            return true;
        },

        _populatePageIconClickHandlers: function () {
            var self = this;
            if (this.pageicons) {
                this.pageicons.unbind(this.xevent);
                this.pageicons = null;
            }
            this.pageicons = $(".prwdpageicon", this.element);
            this.pageicons.addClass("designerpageslist").bind(this.xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                var mythis = $(this);
                var pgnum = mythis.attr("data-prwpgnum");
                self.pageicons.not(mythis).removeClass("dplbtnselected");

                var cbtns = $(".prwdpageiconrect", self.pageicons).attr("fill", "url(#plg1)");
                cbtns = null;
                var thisbtn = $(".prwdpageiconrect", mythis).attr("fill", "url(#plg0)");

                if (mythis.hasClass("dplbtnselected")) {
                    self._showPageToolsDialogue();
                }
                else {
                    mythis.addClass("dplbtnselected");
                    prweb.pubsub.publish(prweb.events.subscriberplatform.pagelistpageiconselected, pgnum);
                }
                pgnum = null;
                mythis = null;
                thisbtn = null;
                return false;
            });
            return true;
        },


        //        _populatePageIconLights: function (e) {
        //            //            var e = prweb.actionContext.currentpgnumber;
        //            try {
        //                if (this.pageicons) {
        //                    this.pageicons.removeClass("dplbtnselected");
        //                    $(".prwdpageiconrect", this.pageicons).attr("fill", "url(#plg1)");
        //                    var pgnumfilter = '[data-prwpgnum=' + e + ']';
        //                    var onbtnpar = this.pageicons.filter(pgnumfilter).addClass("dplbtnselected");
        //                    var onbtn = $(".prwdpageiconrect", onbtnpar).attr("fill", "url(#plg0)");
        //                    onbtn = null;
        //                    onbtnpar = null;
        //                    pgnumfilter = null;
        //                    e = null;
        //                }
        //            }
        //            catch (ex) {
        //                alert("prweb.designerpageslist.populatePageIconLights reports error" + ex.Message);
        //            }
        //            return true;
        //        },
        //#endregion


        //#region SurveyOpenClosedHandlers

        //when a surveyview is loaded..pagecounts will change...if surveymodelsvc repopulates the pageslistVmx, ko takes care of alot...
        //but the pageicons need to be unbound/rebound...will be done by ko we use a clickbinding on the pageicon inner div.... 
        //otherwise we need to unbind/repopulatepageIconHandlers...
        _surveyOpenedHandler: function () {
            try {
                if (!this.pageicons) {
                    prweb.surveymodelsvc.populatepageslistVMx();
                    this._populatePageIconClickHandlers();
                    this._pageNumberChangedHandlers(1);
                }
                else {
                    alert("designerpageslist.surveyOpenedHandler says it has pageicons....")
                }
            }
            catch (ex) {
                alert("prweb.designerpageslist.surveyOpenedHandler reports error" + ex.Message);
            }
            return true;
        },

        _surveyClosedHandler: function () {
            try {
                if (this.pageicons) {
                    this.pageicons.unbind(this.xevent); //.remove();
                    this.pageicons = null;
                }
                this._myCloseList();
            }
            catch (ex) {
                alert("prweb.designerpageslist.surveyClosedHandler reports error" + ex.Message);
            }
            return true;
        },


        //#endregion

        //#region PagesListOpenCloseAnimations

        animwidthzero: { width: 0 },
        animwidthwide: { width: 220 },
        animdur: { duration: 300, easing: 'easeInQuad' },
        isDocked: true,

        _myPagesBtnClick: function () {
            //Detaching this from the DOM keeps Ko binding from working....has to be in DOM for Ko to do its binding thing...creating new pageicons...
            //            var self = this;
            //            self.options.melayoutElement.stop();
            //            var le = $("#shomepagespanel");
            if (!this.isDocked) {
                $("#shomepagespanel").stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
            }
            else {
                if (this.isDocked) {
                    //                    if (self.options.medetached) {
                    //                        self.options.appendto.append(self.options.medetached);
                    //                        self.options.medetached = null;
                    //                    }
                    //                    this.options.melayoutElement.css("display", "");
                    $("#shomepagespanel").removeClass("prwslideouthide").stop(true, false).animate(this.animwidthwide);
                    this.isDocked = false;
                }
            }
            prweb.designerpanelsmgr.ReportIsDocked("designerpageslist", this.isDocked);
            return true;
        },

        _myCloseList: function () {
            //            var self = this;
            //            self.options.melayoutElement.stop();
            //            var le = null;
            if (!this.isDocked) {
                //                le = $("#shomepagespanel");
                $("#shomepagespanel").stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
                prweb.designerpanelsmgr.ReportIsDocked("designerpageslist", this.isDocked);
            }
            //            le = null;
            return true;
        },

        //        _moveToVisualStatePagesBtnClick: function () {
        //            this._myPagesBtnClick();
        //            return true;
        //        },

        _moveToVisualStateCloseList: function () {
            this._myCloseList();
            return true;
        },


        //#endregion

        //#region AppPagesBtnClickHandler

        _populateAppPagesBtnHandler: function () {
            var self = this;
            $("#prwpagesbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                self._myPagesBtnClick();
                //                prweb.pubsub.publish(prweb.events.subscriberplatform.pagesbtnclick);
                return false;
            });

        },

        //#endregion

        //#region PubSub Event Subscriptions

        _subscribeToPubSubEvents: function () {
            var pss = prweb.pubsub.subscribe;
            pss(prweb.events.subscriberplatform.surveyopened, this._surveyOpenedHandler, this);
            pss(prweb.events.subscriberplatform.surveyclosed, this._surveyClosedHandler, this);
            pss(prweb.events.subscriberplatform.pageslistpagecountchanged, this._resetPageIcons, this);
            //            pss(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateCloseList, this);
            //            pss(prweb.events.subscriberplatform.pagesbtnclick, this._moveToVisualStatePagesBtnClick, this);
            pss(prweb.events.subscriberplatform.scrolltopage, this._pageNumberChangedHandler, this);
            pss = null;
            return true;
        },

        //#endregion

        //#region Dispose Destroy

        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    prweb.designersvc.VMXSubscriptions["designerpageslist"].dispose(); //this is a ko subscription being disposed...
                    $("#prwpagesbtn").off(this.xevent);
                    var ps = prweb.pubsub.unsubscribe;
                    //                    ps(prweb.events.subscriberplatform.pagesbtnclick, this._moveToVisualStatePagesBtnClick, this);
                    //                ps(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateCloseList, this);
                    ps(prweb.events.subscriberplatform.scrolltopage, this._pageNumberChangedHandler, this);
                    ps(prweb.events.subscriberplatform.surveyopened, this._surveyOpenedHandler, this);
                    ps(prweb.events.subscriberplatform.surveyclosed, this._surveyClosedHandler, this);
                    ps(prweb.events.subscriberplatform.pageslistpagecountchanged, this._resetPageIcons, this);
                    ps = null;

                    this.touchable = null;
                    //                var xx = $("#dplpul").data("scroller");
                    //                $("#dplpul").data("scroller").dispose();
                    this.pageicons = null;
                    $(".designerpageslist", this.element).unbind(".designerpageslist"); //.remove();
                    this.isDocked = null;
                    var mydmn = $("#dplpul");
                    ko.cleanNode(mydmn[0]);
                    mydmn = null;

                    //                $("#dplpul").html("").remove();

                    var psmd = prweb.surveymodelsvc.DisposePagesListVmx();
                    //                psmd();
                    psmd = null;
                    this.options.hasAppliedBindings = null;

                    this.options.subscrid = null; ;
                }
                catch (ex) {
                    alert("prweb.designerpageslist.dispose reports error" + ex.Message);
                    ex = null;
                }
                finally {
                    this.options.isDisposed = true;
                }
            }
            return;
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.designerpageslist.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
            return;
        }

        //#endregion

        //end of widget defn...

    }); // end of .widget function...

} (this.prweb, jQuery));
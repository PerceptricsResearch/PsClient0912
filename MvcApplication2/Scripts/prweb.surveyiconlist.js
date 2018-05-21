(function (prweb, $) {

    $.widget('prweb.surveyiconlist', {

        options: {
            isDisposed: false,
            actnewRsltUrl: null,
            surveyiconsmodelurl: null,
            melayoutElement: null,
            medetached: null,
            appendto: null,
            vwModelsil: {},
            hasAppliedBindings: false,
            listinDOM: null,
            selectbtns: null
        },

        dataUrl: null,

        surveyiconwdigets: null,
        xevent: "click.surveyiconlist",

        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.surveyiconlist";
                }
                this.element.css("width", 0);
                ko.applyBindings(prweb.surveyiconlistsvc.viewModelx, $("#siconlistview")[0]); //this.element.children('div')[1]);
                // I want this guy to subscribe to prweb.surveyiconlistsvc.viewModelx.myrows changes...
                // the change handler will populatetheViewPagesBtns click handlers...
                this._populateViewPagesBtns();
                this._subscribeToIconListChange();
                this._subscribeToVSMEvents();
                if (prweb.IsTouch) {
                    $("#surveyiconlistitems").css("overflow", "auto");
                    //                    $(".scrollablesiconlist").scroller({
                    //                        vertical: true,
                    //                        mousewheel: true,
                    //                        items: ".surveyiconlistitems",
                    //                        prev: ".prevsiconlist",
                    //                        next: ".nextsiconlist"
                    //                    });
                }
                else {
                    $("#surveyiconlistitems").css("overflow", "auto");
                    //                    $(".surveyprevnextbtns").css("display", "none");
                }
                this._populateSurveysbtnclickhandler();
            }
            catch (ex) {
                alert("prweb.surveyiconlist._create reports " + ex.Message);
            }
            return;
        },

        siconlistitems: null,
        currentbtn: null,

        iconclickhander: false,

        _onSurveyIconListChange: function () {
            this.siconlistitems = $(".siconlistitem", this.element);
            $(".viewpagesbtn", this.element).off(this.xevent, this.iconclickhandler);
            $(".viewpagesbtn", this.element).on(this.xevent, this.iconclickhandler);
        },

        _subscribeToIconListChange: function () {
            prweb.surveyiconlistsvc.viewModelx.myrows.subscribe(this._onSurveyIconListChange, this);
        },

        _populateViewPagesBtns: function () {
            var self = this;
            //            var selectedbtn = this.currentbtn;
            this.iconclickhandler = function (event) {
                try {
                    event.preventDefault();
                    event.stopPropagation();
                    event.cancelBubble = true;
                    event = null;
                    self.currentbtn = $(this);
                    prweb.showClick(self.currentbtn.parent()[0]);
                    var kodata = ko.dataFor(this);
                    prweb.appsvc.EvaluateSurveyContextChange(kodata.SurveyID, kodata);//this ultimately causes surveymodelsvc.Vmx to get a surveymodel...
                    kodata = null;
                }
                catch (ex) {
                    alert("prweb.surveyiconlist.sbtnclick reports " + ex.Message);
                    ex = null;
                }
                finally {
                    event = null;
                    return false;
                }
            };
            this.siconlistitems = $(".siconlistitem", this.element); // this.element.find('[data-prwtype="surveyiconview"]');
            //click event handler for surveyiconbutton....requests resultsdata, loads surveyview in homecenterpanel...
            $(".viewpagesbtn", this.element).on(this.xevent, this.iconclickhandler);
            return true;
        },

        _movetoVisualStatePopulateSelectedLights: function (sid) {
            if (this.currentbtn && sid) {
                $(".viewpagesbtn", this.element).css("background", "");
                this.currentbtn.css("background", "rgba(255,165,0,1)");
            }
            else {
                $(".viewpagesbtn", this.element).css("background", "");
                if (this.currentbtn) {
                    this.currentbtn.css("background", "rgba(255,165,0,0.4)");
                }
                this.currentbtn = null;
            }
            sid = null;
            return true;
        },

        _surveyContextChangedHandler: function (e) {
            this._movetoVisualStatePopulateSelectedLights(e.newcontext); //this is just the button...not the whole element...
            this._moveToVisualStateCloseList();
        },

        _navigatetoDefaultSurveyContext: function (defsvycntxt) {
            this._moveToVisualStateOpenList();
            if (defsvycntxt) {
                // i think listposition should already be here...should not have been changed....so maybe just higlight it on click...
                //                alert("scroll move to surveyid = " + defsvycntxt);
            };
            defsvycntxt = null;
            return true;
            //get the sapi...moveto the index that contains the defaultsurveycontext...
        },

        animwidthzero: { width: 0 },
        animwidthwide: { width: 240 },
        animdur: { duration: 300, easing: 'easeInQuad' },

        isDocked: true,



        _myCloseList: function () {
            if (!this.isDocked) {
                this.element.stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
                prweb.panelsmgr.ReportIsDocked("surveyiconlist", this.isDocked);
            }
            return true;
        },

        _myOpenList: function () {
            if (this.isDocked) {
                this.element.stop(true, false).animate(this.animwidthwide);
                this.isDocked = false;
                prweb.panelsmgr.ReportIsDocked("surveyiconlist", this.isDocked);
            }
            return true;
        },

        //VSM visualstate methods...
        _moveToVisualStateSurveysBtnClick: function () {
            this._myVSMSurveysBtnClick();
            return true;
        },

        _moveToVisualStateCloseList: function () {
            this._myCloseList();
            return true;
        },

        _moveToVisualStateOpenList: function () {
            this._myOpenList();
            return true;
        },

        _subscribeToVSMEvents: function () {
            //            var that = this;
            var ps = prweb.pubsub.subscribe;
            //            ps(prweb.events.subscriberplatform.surveysbtnclick, this._moveToVisualStateSurveysBtnClick, this);
            ps(prweb.events.subscriberplatform.appcontextchanged, this._navigatetoDefaultSurveyContext, this);
            ps(prweb.events.appsvc.surveycontextchanged, this._surveyContextChangedHandler, this);
            //            ps(prweb.events.subscriberplatform.smddetailsbtnclick, this._moveToVisualStateCloseList, this);
            //            ps(prweb.events.subscriberplatform.rsltsgroupsbtnclick, this._moveToVisualStateCloseList, this);
            //            ps(prweb.events.subscriberplatform.pagesbtnclick, this._moveToVisualStateCloseList, this);
            ps = null;
            return;
        },

        //#region populateSurveysbtnclickhandler is the SurveysBtn on actions bar...
        _myVSMSurveysBtnClick: function () {
            if (!this.isDocked) {
                this.element.stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
            }
            else {
                if (this.isDocked) {
                    this.element.stop(true, false).animate(this.animwidthwide);
                    this.isDocked = false;
                }
            }
            prweb.panelsmgr.ReportIsDocked("surveyiconlist", this.isDocked);
            return true;
        },

        _populateSurveysbtnclickhandler: function () {
            var self = this;
            $("#prwsurveysbtn").toggle().on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    e = null;
                    self._myVSMSurveysBtnClick();
                    //                prweb.pubsub.publish(prweb.events.subscriberplatform.surveysbtnclick);
                }
                catch (ex) {
                    alert("prweb.surveyiconlist.surveysbtnhandler reports " + ex.Message);
                }
                return false;
            });
            return true;
        },

        //#endregion
        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    //all of these handlers are populated in a ko.CustomBinding...see surveysinfosvc.PopulateCustomBindings
                    $("#prwsurveysbtn").off(this.xevent);
                }
                catch (ex) {
                    alert("prweb.surveyiconlist.dispose reports error " + ex.Message);
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
                alert("prweb.surveyiconlist.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
        //#endregion
    }); // end of .widget function...

} (this.prweb, jQuery));
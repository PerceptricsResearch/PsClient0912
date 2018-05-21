/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.6.4-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.resultsgroupdefn', {
        //#region Options
        options: {
            id: 0,
            subscribe: null,
            publish: null,
            title: '',
            displayName: '',
            resultsFilterModel: null,
            grprsltsURL: null,
            hasAppliedBindings: false,
            edbtns: null,
            pgbtns: null,
            pgnum: 1,
            setnumber: 0,
            sendRequest: null,
            isAdvanced: false,
            isHelpDisplayed: true,
            isHelpHandler: false,
            isDisposed: false
            //end comment...surveyID: -1,dataURL: null,viewModelx: null,
        },
        //#endregion
        //#region Create
        xevent: "click.resultsgroupdefn",

        // if this guy makes any changes to results filter model...need to replace the rfm in prweb.data.cache with the one here...what about ResultsGroupList..his rfm ?
        _create: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.resultsgroupdefn";
            }
            //            this.options.myDOMNode = this.element[0]; //.find('[data-prwtype=rgroupdefnroot]')[0];
            this.options.publish = prweb.pubsub.publish;
            //            this.options.subscribe = prweb.pubsub.subscribe;
            prweb.rfmsvc.IsPreviewResults = false;
            //            this.options.rsltsbtn = $("#previewrsltsbtn");
            $("#previewrsltsbtn").on(this.xevent, this._previewRsltsBtnClickHandler);
            $("#grpdenfsavebtn").on(this.xevent, this._saveGrpDefnClickHandler);
            this._populateDiscardGrpDefnClickHandler();
            this._populateAdvancedBtnHandler();
            this._populateHelpBtnHandler();
            this._addRdentSetListScroller();
            this._addHelpListScroller();
            var ps = prweb.pubsub.subscribe;
            this._manageVSMSubscriptions(ps);
            ps = null;
            this._populateAddRdentSetButtonHander();
            this._populateLayoutManager();
        },

        //#endregion

        //#region LayoutManager

        _layoutManager: false,

        _populateLayoutManager: function () {
            var lmapi = {};
            lmapi.configStates = {
                help: {
                    state: "showhelp",
                    showhelp: {
                        applystate: function () {
                            $("#rsltsgrpdefnhelppanel").css("display", "");
                            $("#grpdefncontentroot").css("bottom", "61%");
                            $("#grpheaderpanel").css("top", "42%").css("bottom", "44%");
                            $("#grpdefnheadername").css("top", "58%").css("bottom", "37%");
                            $("#rdentsetbtncontainer").css("top", "63%").css("bottom", "30%");
                            $("#rsltsgrpdefnhelpcontainer").css("top", "71%");
                            $("#grpsrdentsetheader").css("top", "80%");
                        }
                    },
                    hidehelp: {
                        applystate: function () {
                            $("#rsltsgrpdefnhelppanel").css("display", "none");
                            $("#grpdefncontentroot").css("bottom", "41%");
                            $("#grpheaderpanel").css("top", "60%").css("bottom", "25%"); //at 75
                            $("#grpdefnheadername").css("top", "76%").css("bottom", "16%"); // at 84
                            $("#rdentsetbtncontainer").css("top", "85%").css("bottom", "7%");
                            $("#rsltsgrpdefnhelpcontainer").css("top", "93%");
                            $("#grpsrdentsetheader").css("top", "1px");
                        }
                    },
                    defaultstate: {
                        applystate: function () {

                        }
                    },
                    movetostate: function (targetstate) {
                        var me = lmapi.configStates.help;
                        me[targetstate].applystate();
                        me.state = targetstate;
                    },
                    selectstate: function (targetstate) {
                        var me = lmapi.configStates.help;
                        if (!targetstate) {
                            var me = lmapi.configStates.help;
                            var mystate = me.state;
                            switch (true) {
                                case (mystate == "showhelp"):
                                    targetstate = "hidehelp";
                                    break;
                                case (mystate == "hidehelp"):
                                    targetstate = "showhelp";
                                    break;
                                case (true):
                                    targetstate = "defaultstate";
                                    break;
                            }
                        }
                        me.movetostate(targetstate);
                    }

                }
            };
            lmapi.ManageState = function (contextstate) {
                lmapi.configStates[contextstate].selectstate();
            };

            this._layoutManager = lmapi;
        },
        //#endregion

        //#region RDentSet Scroller and Buttons

        _showRdentSetButtonContainer: function () {
            $("#rdentsetbtncontainer").css("display", "");
        },

        _hideRdentSetButtonContainer: function () {
            $("#rdentsetbtncontainer").css("display", "none");
        },

        _addRdentSetListScroller: function () {
            //            if (prweb.IsTouch) {
            //                $("#grpdefnlist").scroller({
            //                    vertical: true,
            //                    touch: true,
            //                    items: ".itemsgrpdefn",
            //                    item: ".grpdefngroupitemcontainer",
            //                    inertialbtns: true
            //                });
            //            }
            //            else {
            $("#grpdefnlist").css("overflow", "auto");
            //            }
        },
        _populateAddRdentSetButtonHander: function () {
            var self = this;
            $("#addrdentsetbtn").bind(this.xevent, function () {
                try {
                    //add new rfe...
                    prweb.rfmsvc.AddNewRDentSet();
                    self._populateEditPageDefnbtn();
                    self._addSelectedPagesListScrollers();
                    self._scollToRDentSet(true); //scrolls to bottom...
                    //scroller to bottom...
                }
                catch (ex) {
                    alert("prweb.resultsgroupdenf.AddRDentSetButtonHandler reports " + ex.Message);
                }

            });
        },



        _populateRemoveThisRDentSetHandler: function () {
            var self = this;
            $(".removethisrdentsetbtn", this.element).on(this.xevent, function () {
                try {
                    self._removeSelectedPagesListScrollers();
                    prweb.rfmsvc.RemoveRDentSet();
                    self._populateEditPageDefnbtn();
                }
                catch (ex) {
                    alert("prweb.resultsgroupdenf.RemoveThisRDentSetHandler reports " + ex.Message);
                }
            });
        },

        _showRemoveRDentSetUi: function () {
            $(".removethisrdentsetbtn", this.element).css("display", "");
        },

        _populateRemoveRdentSetButtonHander: function () {
            var self = this;
            $("#removerdentsetbtn").bind(this.xevent, function () {
                try {
                    self._showRemoveRDentSetUi();
                    self._populateRemoveThisRDentSetHandler();
                }
                catch (ex) {
                    alert("prweb.resultsgroupdenf.RemoveRdentSetButtonHander reports " + ex.Message);
                }

            });
        },
        //#endregion

        //#region HelpList Scroller

        _addHelpListScroller: function () {
            //            if (prweb.IsTouch) {
            //                $("#rsltsgrpdefnhelppanel").scroller({
            //                    vertical: true,
            //                    touch: true,
            //                    items: ".rsltsgrpdefnhelpitems",
            //                    item: ".rsltsgrpdefnhelpitem",
            //                    inertialbtns: true
            //                });
            //            }
            //            else {
            $("#rsltsgrpdefnhelppanel").css("overflow", "auto");
            //            }
        },

        //#endregion

        //#region SelectedPagesListScrollers

        _addSelectedPagesListScrollers: function ($this) {
            try {
                //                if (prweb.IsTouch) {
                //                    var scrinit = {
                //                        vertical: true,
                //                        touch: true,
                //                        stoptouchpropagation:true,
                //                        items: ".grpdefnselectedpageslist",
                //                        item: ".grpdefnselectedpageitem",
                //                        inertialbtns: true
                //                    };
                //                    if ($this) {
                //                        $(".grpdefnpageslistscollerroot", $this).scroller(scrinit);
                //                        //                        alert("scroller added to resultsgrpdefn.selectedpageslist");
                //                    }
                //                    else {
                //                        $(".grpdefnpageslistscollerroot", this.element).scroller(scrinit);
                //                        //                        alert("scroller added to resultsgrpdefn.selectedpageslist");
                //                    }
                //                }
                //                else {
                $(".grpdefnpageslistscollerroot").css("overflow", "auto");
                //                }
            }

            catch (ex) {
                alert("prweb.resultsgroupdefn.addSelectedPagesListScrollers reports " + ex.Message);
            }

        },

        //#endregion

        //#region Help Buttons and Handlers

        _showGroupDefnHelpIcon: function () {
            $("#showgrpshelpbtn").css("display", "");
            //            this._populateHelpBtnHandler();
        },

        _minimizeBasicView: function () {
            $("#rsltsgrpdefnhelpbasic").css("display", "none");
            this._showGroupDefnHelpIcon();
        },

        _minimizeAdvancedView: function () {
            $("#rsltsgrpdefnhelpadvanced").css("display", "none");
            this._showGroupDefnHelpIcon();
        },

        _minimizeHelp: function () {
            $("#rsltsgrpdefnhelppanel").css("display", "none");
        },

        _showBasicView: function () {

            $("#rsltsgrpdefnhelpadvanced").css("display", "none");
            $("#rsltsgrpdefnhelpbasic").css("display", "");
            //            this.options.isHelpDisplayed = true;
            this._hideRdentSetButtonContainer();
        },

        _showAdvancedView: function () {

            $("#rsltsgrpdefnhelpbasic").css("display", "none");
            $("#rsltsgrpdefnhelpadvanced").css("display", "");
            //            this.options.isHelpDisplayed = true;
            this._showRdentSetButtonContainer();
        },

        _populateAdvancedBtnHandler: function () {
            var self = this;
            $("#rsltgrpdefnadvancedbtn").bind(this.xevent, function (e) {
                try {
                    //                    $("#rsltgrpdefnadvancedbtn").css("background", "rgb(1,1,255)");
                    e.preventDefault();
                    e.cancelBubble = true;
                    //                    var $this = $(this);
                    switch (true) {
                        case (self.options.isAdvanced):
                            self.options.isAdvanced = false;
                            self._showBasicView();
                            //                            $("#rsltgrpdefnadvancedbtnlabel", $this).html("Advanced");
                            $("#rsltgrpdefnadvancedbtnlabel").html("Advanced").css("background", "hsl(290, 100%, 23%)");
                            break;
                        case (!self.options.isAdvanced):
                            self.options.isAdvanced = true;
                            self._showAdvancedView();
                            //                            $("#rsltgrpdefnadvancedbtnlabel", $this).html("Basic");
                            $("#rsltgrpdefnadvancedbtnlabel").html("Basic").css("background", "hsl(290, 100%, 23%)");
                            break;
                    }
                }
                catch (ex) {
                    alert(ex.Message);
                }
                return;
            });
        },

        _populateHelpBtnHandler: function () {
            var self = this;
            if (!this.options.isHelpHandler) {
                this.options.isHelpHandler = true;
                $("#showgrpshelpbtn").bind(this.xevent, function (e) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    self._layoutManager.ManageState("help");
                    switch (true) {
                        case (self.options.isHelpDisplayed):
                            self.options.isHelpDisplayed = false;
                            self._minimizeHelp();
                            break;
                        case (!self.options.isHelpDisplayed):
                            $("#rsltsgrpdefnhelppanel").css("display", "");
                            self.options.isHelpDisplayed = true;
                            switch (true) {
                                case (self.options.isAdvanced):
                                    self._showAdvancedView();
                                    //                                    $("#rsltgrpdefnadvancedbtn").css("background", "rgb(255,255,1)");
                                    break;
                                case (!self.options.isAdvanced):
                                    self._showBasicView();
                                    //                                    $("#rsltgrpdefnadvancedbtn").css("background", "rgb(1,255,255)");
                                    break;
                            }

                            break;
                    }

                    return;
                });
            }

        },

        //#endregion


        _myEditBtnsColxn: function () {
            return this.options.edbtns;
        },

        _myPageIconsColxn: function () {
            return this.options.pgbtns;
        },

        _myCurrentPgNumber: function () {
            return prweb.actionContext.currentpgnumber;
        },

        //#region SaveButton

        _saveGrpDefnClickHandler: function () {
            var rfmparam = ko.dataFor(this);
            //            var xrfm = ko.contextFor(this);
            prweb.rfmsvc.saveRFM(rfmparam.rfelemlist);
        },

        //#endregion

        //#region DiscardGrpDefnClickHandler Cancel Button

        _populateDiscardGrpDefnClickHandler: function () {
            var self = this;
            var rslt = false;
            var discardclickhandler = function () {
                try {
                    var rfmparam = ko.dataFor(this);
                    //                alert("Cancel btn clicked on GrpDefn...going to RFMSvc.CancelChangesRFM...")
                    rslt = prweb.rfmsvc.CancelChangesGrpDefnBtnAction(rfmparam.rfelemlist);
                    if (rslt) {
                        self._moveToVisualstategrpdefnselected(prweb.rfmsvc.rsltsGrpRFM);
                        //                        alert('changes discarded...');
                    }
                    else {
                        alert('prweb.rsltsgrpdefn.DiscardDefn oops...unable to discard changes...sorry, please logoff and login again...a report of the error has been sent.')
                    }
                    rfmparam = null;
                }
                catch (ex) {
                    alert("prweb.rfmsvc.DiscardGroupDefn.discardclickhandler reports " + ex.Message);
                }
            };
            $("#grpdenfcancelbtn").bind(this.xevent, discardclickhandler);

        },


        //#endregion

        //#region ResultButton Preview

        _previewRsltsBtnClickHandler: function (e) {
            try {
                e.preventDefault();
                e.cancelBubble = true;
                e.returnValue = false;
                if (prweb.rfmsvc.IsPreviewResults) {
                    prweb.rfmsvc.IsPreviewResults = false;
                    $(this).css("border-color", "transparent");
                    prweb.pcvmodesvc.GrpSelectorsTo(false);
                    //                prweb.pubsub.publish(prweb.events.subscriberplatform.grpoptionselectorschange, false)
                }
                else {
                    prweb.rfmsvc.IsPreviewResults = true;
                    $(this).css("border-color", "#ff9900");
                    prweb.rfmsvc.previewResults();
                }
            }
            catch (ex) {
                alert("prweb.resultsgroupdefn.RsltsBtnClickHandler reports error " + ex.Message);
            }
            return false;
        },


        //#endregion

        _populateDonebuttonHelpmessages: function () {

        },

        //#region Cancel Save Container

        _showSaveCancelContainer: function () {
            $("#grpdefnsavecancelcontainer").css("display", "");
        },

        _hideSaveCancelContainer: function () {
            $("#grpdefnsavecancelcontainer").css("display", "none");
        },

        _manageSaveCancelContainerVisibility: function (isdirty) {
            if (isdirty) {
                this._showSaveCancelContainer();
                //                prweb.rfmsvc.rsltsGrpRFM.IsRFMDirty.valueHasMutated();
            }
            else {
                this._hideSaveCancelContainer();
            }
        },

        //#endregion

        //#region Results Header Visibility

        _showResultsHeader: function () {
            $("#grpheaderpanel").css("display", "");
            $("#previewrsltsbtn").css("display", "");
        },
        _hideResultsHeader: function () {
            $("#grpheaderpanel").css("display", "");
            $("#previewrsltsbtn").css("display", "none");
        },
        _manageResultsHeaderVisibility: function (isrfmadequate) {
            //            var isrfmadequate = prweb.rfmsvc.IsRFMAdequatelyDefined();
            if (isrfmadequate) {
                this._showResultsHeader();
            }
            else {
                this._hideResultsHeader();
            }
            return isrfmadequate;
        },

        //#endregion

        _populateEditPageDefnbtn: function () {
            var self = this;
            //            $("#rsltsgrpdefnhelpbasic").html("in populate editbtndefn");
            if (this.options.edbtns) {
                //                $("#rsltsgrpdefnhelpbasic").append(" unbinding options.edbtns" + this.options.edbtns.length);
                this.options.edbtns.unbind(this.xevent);
            }
            this.options.edbtns = $(".xrfelembtn", this.element); // this.element.find('[data-prwtype="xrfelembtn"]');
            this.options.edbtns.bind(this.xevent, function (e) {
                try {
                    //                    $("#rsltsgrpdefnhelpbasic").append("<p>sees tap</p>");
                    e.preventDefault();
                    e.returnValue = false;
                    e.cancelBubble = true;
                    self.options.edbtns.css("background", "hsla(290, 100%, 37%,1)").find('[data-prweditbtnlabel]').html("Edit");
                    //                    mylabels.html("Edit");
                    prweb.rfmsvc.IsPreviewResults = false;
                    $("#previewrsltsbtn").css("border-color", "transparent");
                    var thisbtn = $(this);
                    if (thisbtn.attr("data-prweditbtnstate") == "edit") {
                        // if anybtns with state="done" 
                        if (self.options.edbtns.filter('[data-prweditbtnstate="done"]').length > 0) {
                            prweb.rfmsvc.PopulateCurrentRDentSetHelpMessage("Use the Edit button to select respondents. See the help section below for more.");
                            self._manageResultsHeaderVisibility(prweb.rfmsvc.GrpDefnDoneBtnAction());

                        }
                        self.options.edbtns.attr("data-prweditbtnstate", "edit");
                        thisbtn.css("background", "#0000a0").attr("data-prweditbtnstate", "done").find('[data-prweditbtnlabel]').html("Done");

                        prweb.actionContext.current = "GroupOptionsSelect"; // active optionsselectors on PCV's/set
                        prweb.rfmsvc.currentrdentset = ko.dataFor(this);
                        prweb.rfmsvc.PopulateCurrentRDentSetHelpMessage("Press Done when finished choosing answers.");
                        self.options.setnumber = prweb.rfmsvc.currentrdentsetnumber();
                        prweb.pcvmodesvc.GrpSelectorsTo(true);
                        self._manageResultsHeaderVisibility(false);
                        self._hideSaveCancelContainer();
                        $("#backtogroupsbtn").css("display", "none");
                    }
                    else if (thisbtn.attr("data-prweditbtnstate") == "done") {
                        thisbtn.attr("data-prweditbtnstate", "edit");
                        prweb.rfmsvc.PopulateCurrentRDentSetHelpMessage("Use the Edit button to select respondents. See the help section below for more.");
                        self._manageResultsHeaderVisibility(prweb.rfmsvc.GrpDefnDoneBtnAction());
                        self._manageSaveCancelContainerVisibility(prweb.rfmsvc.rsltsGrpRFM.IsRFMDirty());
                        $("#backtogroupsbtn").css("display", "");
                    }
                    thisbtn = null;
                    //                    $("#rsltsgrpdefnhelpbasic").append("<p>going to populatePageIconLights</p>");
                    self._populatePageIconLights(false);
                }
                catch (ex) {
                    alert("prweb.resultsgroupdefn.edbtnhandler reports " + ex.Message);
                }

                return false;
            });
            //            }
        },

        //#region PageIConLights

        _populatePageIconLights: function (me) {
            var rslt = false;
            try {
                var csn = 0;
                if (prweb.rfmsvc.currentrdentset) {
                    csn = prweb.rfmsvc.currentrdentsetnumber();
                }
                var e = prweb.actionContext.currentpgnumber;
                if (this.options.pgbtns) {
                    var pgnumfilter = '[data-prwpgnum=' + e + ']';
                    var setnumfilter = '[data-prwsetnum=' + csn + ']';
                    var onbtn = this.options.pgbtns.filter(pgnumfilter).filter(setnumfilter).css("background", "#ff9900");
                    if (onbtn.length == 1) {
                        var paroffset = onbtn.parent().position();
                        var onbtnoffset = onbtn.position();
                        rslt = { offset: paroffset.top + onbtnoffset.top };
                    }
                    this.options.pgbtns.not(onbtn).css("background", "hsla(290, 100%, 37%,1)");
                    //                var xdbg = 2;
                }
            }
            catch (ex) {
                alert("prweb.resultsgroupdefn.populatePageIconLights reports error " + ex.Message);
                ex = null;
            }

            return rslt; //offset is used by this.scrollToPageIcon...
        },

        //#endregion

        //#region SelectFirstPageIcon

        _selectFirstPageIconbtn: function () {
            prweb.actionContext.isrsltsgrpdefnactive = true;
            prweb.pcvmodesvc.GrpSelectorsTo(false);
            var pagebtns = this._myPageIconsColxn();
            var firstpagebtn = null;
            if (pagebtns.length > 0) {
                firstpagebtn = pagebtns.eq(0);
            }
            if (firstpagebtn) {
                try {
                    prweb.rfmsvc.currentrdentset = ko.contextFor(firstpagebtn[0]).$parent
                    var elemdataContext = ko.dataFor(firstpagebtn[0]);
                    var eventargs = { pcmid: elemdataContext.PCM_ID(), optionlist: elemdataContext.SelectedOptionIDList() };
                    prweb.pubsub.publish(prweb.events.subscriberplatform.grpdefnpageiconselected, eventargs);

                    this._populatePageIconLights(false);
                    elemdataContext, eventargs = null;
                }
                catch (ex) {
                    alert("prweb.resultsgroupdefn.selectFirstPageIconbtn.firstpagebtn reports " + ex.Message);
                }
            }
            pagebtns, firstpagebtn = null;
            return;
        },

        //#endregion

        //#region IncludedPageBtns
        _populateIncludedPageBtns: function () {
            var self = this;
            if (this.options.pgbtns) {
                this.options.pgbtns.unbind(this.xevent);
            }
            this.options.pgbtns = this.element.find('[data-prwtype="includedpageicon"]');
            //            var pgbtns = this.options.pgbtns;
            //            var setpageiconlights = this._populatePageIconLights;
            //            $('[data-prwtype="includedpageicon"]').unbind("click");
            //click event handler for pageiconbutton....requests surveyviewjs to navigate to page...show grpdfnview of page
            this.options.pgbtns.bind(this.xevent, function (event) {
                try {
                    event.preventDefault();
                    event.cancelBubble = true;
                    var mydollarthis = $(this);
                    mydollarthis.css("background", "#ff9900")// make it lightup really fast....
                    self.options.pgbtns.not(mydollarthis).css("background", "hsla(290, 100%, 37%,1)");
                    mydollarthis = null;
                    prweb.rfmsvc.IsPreviewResults = false;
                    $("#previewrsltsbtn").css("border-color", "transparent");
                    //                prweb.actionContext.pcvmode = "grpdefnmarks";// important....anytime a pageicon is clicked in this widget, pcvmode is grpdefnmarks...desired behavior.
                    prweb.actionContext.isrsltsgrpdefnactive = true;
                    prweb.rfmsvc.currentrdentset = ko.contextFor(this).$parent;
                    var selectedsetnum = prweb.rfmsvc.currentrdentsetnumber();
                    var issetchange = false;
                    if (self.options.setnumber !== selectedsetnum) {
                        issetchange = true;
                    }
                    var elemdataContext = ko.dataFor(this);
                    var eventargs = { pcmid: elemdataContext.PCM_ID(),
                        optionlist: elemdataContext.SelectedOptionIDList()
                    };
                    elemdataContext = null;
                    prweb.pubsub.publish(prweb.events.subscriberplatform.grpdefnpageiconselected, eventargs);
                    if (issetchange) {
                        self._rDentSetNumberChangedHandler(selectedsetnum);
                        prweb.pcvmodesvc.GrpSelectorsTo(false);
                        //                    prweb.pubsub.publish(prweb.events.subscriberplatform.grpoptionselectorschange, false);
                    }
                    else {
                        prweb.pcvmodesvc.GrpSelectorsTo(prweb.pcvmodesvc.IsGrpSelectorsOn);
                    }
                }
                catch (ex) {
                    alert("prweb.resultsgroupdefn.IncludedPageBtnsHandler reports error " + ex.Message);
                    ex = null;
                }

                return false;
            });
        },

        //#endregion

        //#region UpdateModel and ApplyBindings

        _myApplybindings: function (adata) {
            try {
                prweb.rfmsvc.populateVmx(adata);
                var konode = this.element[0];
                ko.applyBindings(prweb.rfmsvc.viewModelx, konode);
                konode = null;
                this.options.hasAppliedBindings = true;
                prweb.rfmsvc.populatePriorPreviewList();
                this._manageResultsHeaderVisibility(prweb.rfmsvc.IsRFMAdequatelyDefined());
            }
            catch (ex) {
                alert("prweb.resultsgroupdefn.myApplybindings reports error " + ex.Message);
                ex = null;
            }
            return;
        },

        //update ko stuff...
        _myUpdatemodel: function (udata) {
            try {
                prweb.rfmsvc.populateVmx(udata);
                //end of updatemodel...
                prweb.rfmsvc.populatePriorPreviewList();
                this._manageResultsHeaderVisibility(prweb.rfmsvc.IsRFMAdequatelyDefined());
            }
            catch (ex) {
                alert("prweb.resultsgroupdefn.myUpdatemodel reports error " + ex.Message);
                ex = null;
            }
            return;
        },

        //#endregion


        //#region VSME Subscription Handlers

        //#region GroupsButtonClick

        _moveToVisualstatersltsgroupsbtnclick: function () {
            try {
                prweb.rfmsvc.IsPreviewResults = false;
                $("#previewrsltsbtn").css("border-color", "transparent");
                if (this.options.edbtns) {
                    this.options.edbtns.unbind(this.xevent);
                    this.options.edbtns.css("background", "hsl(290, 100%, 37%)").attr("data-prweditbtnstate", "edit").find('[data-prweditbtnlabel]').html("Edit");
                    this.options.edbtns = false;
                }
                if (this.options.pgbtns) {
                    this.options.pgbtns.unbind(this.xevent);
                    this.options.pgbtns = false;
                }
            }
            catch (ex) {
                alert("prweb.resultsgroupdefn.moveToVisualstatersltsgroupsbtnclick reports error " + ex.Message);
                ex = null;
            }
        },

        //#endregion

        //#region GroupDefnSelected

        _moveToVisualstategrpdefnselected: function (rfmdata) {
            try {
                prweb.rfmsvc.IsPreviewResults = false;
                $("#previewrsltsbtn").css("border-color", "transparent");
                this._manageSaveCancelContainerVisibility(rfmdata.IsRFMDirty());
                if (this.options.edbtns) {
                    this.options.edbtns.unbind(this.xevent);
                    this.options.edbtns = false;
                }
                if (this.options.pgbtns) {
                    this.options.pgbtns.unbind(this.xevent);
                    this.options.pgbtns = false;
                }
                //                if (prweb.IsTouch) {
                //                    //                    $("#grpdefnlist").data("scroller").dispose();
                //                    //                    $("#rsltsgrpdefnhelppanel").data("scroller").dispose();
                //                    var pscroll = $(".grpdefnpageslistscollerroot", this.element).data("scroller");
                //                    if (pscroll) {
                //                        pscroll.dispose();
                //                    }
                //                    pscroll = null;
                //                }
                var self = this;
                if (self.options.hasAppliedBindings) {
                    self._myUpdatemodel(rfmdata); // creates an instance of viewmodel...and replaces it in the rfmsvc.viewmodel...ko sees the new viewmodel and binds to it..
                    self._populateEditPageDefnbtn();
                    self._populateIncludedPageBtns();
                    self._selectFirstPageIconbtn();
                    self._addSelectedPagesListScrollers();
                }
                if (!self.options.hasAppliedBindings) {
                    self._myApplybindings(rfmdata);
                    self._populateEditPageDefnbtn();
                    self._populateIncludedPageBtns();
                    self._selectFirstPageIconbtn();
                    self._addSelectedPagesListScrollers();
                }
            }
            catch (ex) {
                alert("prweb.resultsgroupdefn.moveToVisualstategrpdefnselected reports error " + ex.Message);
                ex = null;
            }
        },

        //#endregion

        _scrollpageicontimeout: false,

        _scrollToPageIcon: function (addedNew, pageiconoffset) {
            try {
                clearTimeout(this._scrollpageicontimeout);
                if (prweb.rfmsvc.currentrdentset && addedNew) {
                    var selectedsetnum = prweb.rfmsvc.currentrdentsetnumber();
                    var setnumfilter = '[data-prwsetnum=' + selectedsetnum + ']';
                    var $rdentset = $(".grpdefngroupitemcontainer", "#grpdefnlist").filter(setnumfilter);
                    var $scrlldiv = $(".grpdefnpageslistscollerroot", $rdentset);
                    $scrlldiv.clearQueue().stop(true, false).animate({ scrollTop: $scrlldiv[0].scrollHeight }, 800); //scroll to end..
                    $rdentset, setnumfilter, selectedsetnum = null;
                }
                else {
                    if (pageiconoffset) {
                        var tooffset = pageiconoffset.offset; //pageiconoffset.top;
                        clearTimeout(this._scrollpageicontimeout);
                        this._scrollpageicontimeout = setTimeout(function () {
                            var selectedsetnumx = prweb.rfmsvc.currentrdentsetnumber();
                            var setnumfilterx = '[data-prwsetnum=' + selectedsetnumx + ']';
                            var $rdentsetx = $(".grpdefngroupitemcontainer", "#grpdefnlist").filter(setnumfilterx);
                            var $scrlldivx = $(".grpdefnpageslistscollerroot", $rdentsetx);
                            $scrlldivx.clearQueue().stop(true, false).animate({ scrollTop: tooffset }, 200); //scroll to top if zero, otherwise to icon...
                            $scrlldivx, $rdentsetx, setnumfilterx, selectedsetnumx = null;
                            clearTimeout(this._scrollpageicontimeout);
                            this._scrollpageicontimeout = null;
                        }, 600);
                    }
                }
                pageiconoffset = null;
            }
            catch (ex) {
                alert("prweb.resultsgroupdefn.scrollToPageIcon reports error " + ex.Message);
                ex = null;
            }

        },

        _currentPageChangedHandler: function (e) {
            this.options.pgnum = e;
            var pageiconoffset = this._populatePageIconLights(false);
            this._scrollToPageIcon(false, pageiconoffset);
            pageiconoffset = null;
        },

        _scollToRDentSet: function (addedNew) {
            try {
                if (prweb.rfmsvc.currentrdentset) {
                    var $scrlldiv = $("#grpdefnlist");
                    if (addedNew) {
                        $scrlldiv.clearQueue().stop(true, false).animate({ scrollTop: $scrlldiv[0].scrollHeight }, 800); //scroll to end..
                    }
                    else {
                        //                        var selectedsetnum = prweb.rfmsvc.currentrdentsetnumber();
                        //                        var setnumfilter = '[data-prwsetnum=' + selectedsetnum + ']';
                        //                        var $rdentset = $(".grpdefngroupitemcontainer", "#grpdefnlist").filter(setnumfilter);
                        //                        var rdentoffset = $rdentset.offset();
                        $scrlldiv.clearQueue().stop(true, false).animate({ scrollTop: 0 }, 800); //scroll to top..
                    }
                    $scrlldiv = null;
                }
            }
            catch (ex) {
                alert("prweb.resultsgroupdefn.scollToRDentSet reports error " + ex.Message);
                ex = null;
            }

        },

        _rDentSetNumberChangedHandler: function (selectedsetnum) {
            prweb.rfmsvc.IsPreviewResults = false;
            $("#previewrsltsbtn").css("border-color", "transparent");
            this._resetAllEditBtns();
            this.options.setnumber = selectedsetnum;
            if (selectedsetnum == 0) {
                this._scollToRDentSet(false); //scrolls to top... 
            }

        },

        _resetAllEditBtns: function () {
            if (this.options.edbtns) {
                this.options.edbtns.css("background", "hsla(290, 100%, 37%,1)").attr("data-prweditbtnstate", "edit").find('[data-prweditbtnlabel]').html("Edit");
            }
            //prweb.rfmsvc.set helpmessage in every RDentSet to use edit btn...

        },

        _surveyClosedHandler: function () {
            if (this.options.pgbtns) {
                this.options.pgbtns.unbind(this.xevent);
                this.options.pgbtns = false;
            }
            if (this.options.edbtns) {
                this.options.edbtns.unbind(this.xevent);
                this.options.edbtns = false;
            }
            this.options.resultsFilterModel = null;
            prweb.actionContext.isrsltsgrpdefnactive = false;
        },



        //rfmsvc.ManageRDentSetOptionsChanged raises prweb.events.subscriberplatform.rsltsfilteremelementschanged
        _resultsFilterElementsChangeHandler: function (addedNew) {
            try {
                this._populateIncludedPageBtns();
                this._scrollToPageIcon(addedNew, 0);
            }
            catch (ex) {
                alert("prweb.resultsgroupdefn.resultsFilterElementsChangeHandler reports error " + ex.Message);
                ex = null;
            }
            return;
        },

        //#endregion

        //#region Subscriptions VSME

        _manageVSMSubscriptions: function (ps) {
            //            var that = this;
            ps(prweb.events.subscriberplatform.surveyclosed, this._surveyClosedHandler, this);
            ps(prweb.events.subscriberplatform.grpdefnselected, this._moveToVisualstategrpdefnselected, this);
            ps(prweb.events.subscriberplatform.rsltsgroupsbtnclick, this._moveToVisualstatersltsgroupsbtnclick, this);
            ps(prweb.events.subscriberplatform.grprsltsselected, this._resetAllEditBtns, this);
            ps(prweb.events.subscriberplatform.surveycurrentpagechanged, this._currentPageChangedHandler, this);
            ps(prweb.events.subscriberplatform.rsltsfilteremelementschanged, this._resultsFilterElementsChangeHandler, this);
        },

        //#endregion

        //#region Dispose Destroy

        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    var ps = prweb.pubsub.unsubscribe;
                    this._manageVSMSubscriptions(ps);
                    ps = null;
                    prweb.actionContext.isrsltsgrpdefnactive = false;
                    prweb.actionContext.current = "Results";
                    if (this.options.edbtns) {
                        this.options.edbtns.unbind();
                    }
                    if (this.options.pgbtns) {
                        this.options.pgbtns.unbind();
                    }
                    $("#previewrsltsbtn").off(this.xevent, this._previewRsltsBtnClickHandler);
                    $("#grpdenfsavebtn").off(this.xevent, this._saveGrpDefnClickHandler);
                    $("#grpdenfcancelbtn").unbind(this.xevent, this._cancelGrpDefnClickHandler);
                    $("#rsltgrpdefnadvancedbtn").unbind(this.xevent);
                    $("#showgrpshelpbtn").unbind(this.xevent);
                    if (prweb.IsTouch) {
                        //                        $("#grpdefnlist").data("scroller").dispose();
                        //                        $("#rsltsgrpdefnhelppanel").data("scroller").dispose();
                        var pscroll = $(".grpdefnpageslistscollerroot", this.element).data("scroller");
                        if (pscroll) {
                            pscroll.dispose();
                        }
                        pscroll = null;
                    }
                    this.options.resultsFilterModel = null;
                    this.options.sendReset = null;
                    this.options.edbtns = null;
                    this.options.pgbtns = null;
                }
                catch (ex) {
                    alert("prweb.resultsgroupdefn.dispose reports error " + ex.Message);
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
                alert("prweb.resultsgroupdefn.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }

        //#endregion

        //end of widget defn...
    });
} (this.prweb, jQuery));
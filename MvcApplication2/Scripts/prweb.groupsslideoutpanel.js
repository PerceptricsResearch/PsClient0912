// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.groupsslideoutpanel', {

        xevent: "click.groupsslideoutpanel",

        options: {
            title: '',
            displayName: '',
            melayoutElement: null,
            isDocked: true,
            hasAppliedBindings: false,
            myDOMNode: null,
            surveyID: -1,
            rsltsgrpscontainer: null,
            rsltsgrpscontainervis: false,
            grpdefncntnr: null,
            grpdefncntnrvisibility: false,
            resultsgrplistviewURL: false,
            resultsgrpdefnviewURL: false,
            grpdefnwidgetized: false,
            isDisposed: false
        },
        // these views embedded here were orginally designed and tested to be loaded brand new each time with a surveyview...
        // now they will rely on databinding to reflect current surveymodel datacontext...need to look at the way they get data...
        // everything was probably done in the create method....may not be responding to changes in prweb.rfmsvc...and appsvc events...
        _create: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.groupsslideoutpanel";
                $("#groupsslideoutcontainer").css("-webkit-transform", "translate3d(0,0,0)");
            }
            this.options.rsltsgrpscontainer = $("#rsltsgroupscontainer");
            this.options.grpdefncntnr = $("#grpdefncontainer");
            this._populateBackToGroupsButtonHandler();
            this._subscribeToVSMEvents();
            return;
        },



        //#region RetrieveGroupListView
        _retrieveGroupListView: function (groupslisturl) {
            var self = this;
            //            var rsltsgrpdefnviewURL = this.options.resultsgrpdefnviewURL;
            try {
                if (prweb.appmessagesvc !== undefined) {
                    prweb.appmessagesvc.PopulateViewMessage("retrieving Groups list...please wait.");
                }
                $("#rsltsgroupscontainer").load(groupslisturl, function () {
                    try {
                        //widgetize the grpdefnview....
                        if (!self.options.grpdefnwidgetized) {
                            //                        self.options.grpdefncntnr.find(".scrollablegrpdefnlist").scrollable({ vertical: false, mousewheel: false });
                            $("#rsltsgrpdefnview").resultsgroupdefn(); // creates a rsltsgrpdefn widget...{ surveyID: self.options.surveyID }
                            self.options.grpdefnwidgetized = true;
                        }
                        if (prweb.appmessagesvc !== undefined) {
                            prweb.appmessagesvc.PopulateViewMessage(prweb.rfmsvc.GroupNameandSize + " Page " + prweb.actionContext.currentpgnumber.toString());
                        }
                    }
                    catch (ex) {
                        if (prweb.appmessagesvc !== undefined) {
                            prweb.appmessagesvc.PopulateViewMessage("Sorry...could not retrieve Groups list...please try again.");
                        }
                    }

                    return;
                });
            }
            catch (ex) {
                alert("GroupSlideoutPanel.RetrieveGroupListView reports error loading grouplistview..." + ex.Message);
            }
            return;
        },

        //#endregion



        //#region Show Hide GroupList and GroupDefn
        _targetContainerwidth: "17em",

        _openContainer: function (isdefn) {

            $("#rsltgrpscontainers").stop(true, false).animate({ width: this._targetContainerwidth }, { duration: 300, easing: 'easeInQuad', complete: function () {
                //                $("#rsltgrpscontainers").css("margin", "auto");
                if (isdefn) {
                    $("#backtogroupsbtn").css("display", "");
                    $("#showgrpshelpbtn").css("display", "");
                }
                else {
                    prweb.actionContext.isrsltsgrpdefnactive = false;
                    prweb.rfmsvc.ShowPieCharts();
                }
                return;
            }
            });
            return;
        },

        _hideGroupListContainer: function () {
            $("#rsltsgroupscontainer").css("display", "none");
            this.options.rsltsgrpscontainervis = false;
            return;
        },

        _showGroupDefnContainer: function () {
            var self = this;
            $("#rsltgrpscontainers").stop(true, false).css("margin", "").animate({ width: 0 }, { duration: 300, easing: 'easeInQuad', complete: function () {
                self._hideGroupListContainer();
                $("#grpdefncontainer").css("display", "");

                self._openContainer(true);
                return;
            }
            });
            this.options.grpdefncntnrvisibility = true;
            return;
        },

        _hideGroupDefnContainer: function () {
            $("#grpdefncontainer").css("display", "none");
            $("#showgrpshelpbtn").css("display", "none");
            this.options.grpdefncntnrvisibility = false;
        },

        _showGroupListContainer: function () {
            var self = this
            //            this._targetContainerwidth = $("#rsltgrpscontainers").width();
            $("#rsltgrpscontainers").stop(true, false).css("margin", "").animate({ width: 0 }, { duration: 300, easing: 'easeInQuad', complete: function () {
                self._hideGroupDefnContainer();
                $("#backtogroupsbtn").css("display", "none");

                $("#rsltsgroupscontainer").css("display", "");
                self._openContainer(false);
                return;
            }
            });
            this.options.rsltsgrpscontainervis = true;
            return;
        },


        //#endregion

        //#region GroupDefnSelected Swap GroupList for GroupDefn
        //this just swaps the visibility of the groupslistcontainer and the groupdefncontainer
        _moveToVisualstategrpdefnselected: function () {
            //            this._hideGroupListContainer();
            this._showGroupDefnContainer();
            return;
        },
        //#endregion


        //#region AnimationObjects and IsDocked
        animwidthzero: { width: 0 },
        animwidthwide: { width: "17.5em" },
        animdur: { duration: 300, easing: 'easeInQuad' },
        animduropen: { duration: 300, easing: 'easeInQuad', complete: function () {
            return;
        }
        },
        isDocked: "empty",
        //#endregion

        //#region Close 
        _myCloseList: function () {
            if (this.isDocked != "empty" && !(this.isDocked)) {
                var self = this;
                $("#rsltgrpscontainers").stop(true, false).css("margin", "").animate({ width: 0 }, { duration: 300, easing: 'easeInQuad', complete: function () {
                    self._hideGroupDefnContainer();
                    self._hideGroupListContainer();
                    $("#groupsslideoutcontainer").stop(true, false).animate(self.animwidthzero, { duration: 10, easing: 'easeInQuad' });
                    return;
                }
                });
                //                $("#groupsslideoutcontainer").stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
                prweb.panelsmgr.ReportIsDocked("groupsslideoutpanel", this.isDocked);
            }
            return true;
        },

        _moveToVisualStateCloseList: function () {
            this._myCloseList();
            return;
        },
        //#endregion

        //#region Open
        _myOpenList: function () {
            if (this.options.isDocked || this.isDocked == "empty") {
                $("#groupsslideoutcontainer").stop(true, false).animate(this.animwidthwide);

                this.isDocked = false;
                prweb.panelsmgr.ReportIsDocked("groupsslideoutpanel", this.isDocked);
                this._showGroupListContainer();
            }
            return true;
        },

        _moveToVisualStateOpenList: function () {
            this._myOpenList();
            return;
        },
        //#endregion

        _populateBackToGroupsButtonHandler: function () {
            var self = this;
            $("#backtogroupsbtn").bind(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.rfmsvc.BackToGroupsAction();
                self._showGroupListContainer();
                return false;
            });
            return;
        },

        //#region Survey Open and Closed Handlers
        _surveyOpenedHandler: function () {
            this.options.surveyID = prweb.surveymodelsvc.CurrentSurveyID();
            this.options.resultsgrplistviewURL = prweb.surveymodelsvc.ResultsGrpListViewURL();
            if (this.options.resultsgrplistviewURL) {
                $("#rsltsgroupscontainer").unbind().empty();
                this._retrieveGroupListView(this.options.resultsgrplistviewURL);
            }
            else {
                alert("GroupSlideoutPanel.surveyOpenedHandler reports resultsgrplistviewURL is false...");
            }
        },

        _surveyClosedHandler: function () {
            this._moveToVisualStateCloseList();
            this.options.resultsgrplistviewURL = false;
        },
        //#endregion

        //#region GroupsButtonClick
        _resultsGroupsButtonClick: function () {
            switch (true) {
                case (this.isDocked == "empty"):
                    {
                        $("#groupsslideoutcontainer").removeClass("prwslideouthide").stop(true, false).animate(this.animwidthwide, this.animduropen);
                        this.isDocked = false;
                        this._surveyOpenedHandler();
                        //only subscribe to surveyopenned once this widget has been viewed once...
                        prweb.pubsub.subscribe(prweb.events.subscriberplatform.surveyopened, this._surveyOpenedHandler, this);
                        prweb.panelsmgr.ReportIsDocked("groupsslideoutpanel", this.isDocked);
                        this._showGroupListContainer();
                        break;
                    };
                case (this.isDocked):
                    {
                        $("#groupsslideoutcontainer").stop(true, false).animate(this.animwidthwide);
                        this.isDocked = false;
                        prweb.panelsmgr.ReportIsDocked("groupsslideoutpanel", this.isDocked);
                        this._showGroupListContainer();
                        break;
                    };
                case (!this.isDocked):
                    {
                        var self = this;
                        $("#rsltgrpscontainers").stop(true, false).css("margin", "").animate({ width: 0 }, { duration: 200, easing: 'easeInQuad', complete: function () {
                            self._hideGroupDefnContainer();
                            self._hideGroupListContainer();
                            $("#groupsslideoutcontainer").stop(true, false).animate(self.animwidthzero, { duration: 10, easing: 'easeInQuad' });
                        }
                        });
                        //                        $("#groupsslideoutcontainer").stop(true, false).animate(this.animwidthzero, { duration: 100, easing: 'easeInQuad', complete: function () {
                        //                            self._hideGroupDefnContainer();
                        //                            self._hideGroupListContainer();
                        //                        }
                        //                        });
                        this.isDocked = true;
                        //                        this._hideGroupDefnContainer();
                        //                        this._hideGroupListContainer();
                        prweb.panelsmgr.ReportIsDocked("groupsslideoutpanel", this.isDocked);
                        break;
                    };
            };
            //            prweb.panelsmgr.ReportIsDocked("groupsslideoutpanel", this.isDocked);
            return true;
        },
        _moveToVisualStateGroupsBtnClick: function () {
            this._resultsGroupsButtonClick();
            return;
        },

        //#endregion

        //#region Subscribe VSM Events
        //VSM handler will apply css classes to implement various visual attributes associated with the particular VisualState….
        _subscribeToVSMEvents: function () {
            //            prweb.pubsub.subscribe(prweb.events.subscriberplatform.surveyopened, this._surveyOpenedHandler, this);
            prweb.pubsub.subscribe(prweb.events.subscriberplatform.surveyclosed, this._surveyClosedHandler, this);
            //            prweb.pubsub.subscribe(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateCloseList, this);
            //            prweb.pubsub.subscribe(prweb.events.subscriberplatform.smddetailsbtnclick, this._moveToVisualStateCloseList, this);
            prweb.pubsub.subscribe(prweb.events.subscriberplatform.rsltsgroupsbtnclick, this._moveToVisualStateGroupsBtnClick, this);
            prweb.pubsub.subscribe(prweb.events.subscriberplatform.grpdefnselected, this._moveToVisualstategrpdefnselected, this);
        },

        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    var ps = prweb.pubsub.unsubscribe;
                    //                    ps(prweb.events.subscriberplatform.pagesbtnclick, this._moveToVisualStatePagesBtnClick, this);
                    //                    ps(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateCloseList, this);
                    ps(prweb.events.subscriberplatform.rsltsgroupsbtnclick, this._moveToVisualStateGroupsBtnClick, this);
                    ps(prweb.events.subscriberplatform.grpdefnselected, this._moveToVisualstategrpdefnselected, this);
                    //                    ps(prweb.events.subscriberplatform.surveyopened, this._surveyOpenedHandler, this);
                    ps(prweb.events.subscriberplatform.surveyclosed, this._surveyClosedHandler, this);
                    ps = null;
                    var gdefnw = $("#rsltsgrpdefnview").data("resultsgroupdefn");
                    if (gdefnw) {
                        gdefnw.dispose();
                    }
                    gdefnw = null;
                    var glistw = $("#rsltgrplistview").data("resultsgrouplist");
                    if (glistw) {
                        glistw.dispose();
                        //no subscription if this widget was never viewed.
                        prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.surveyopened, this._surveyOpenedHandler, this);
                    }
                    glistw = null;
                    $("#rsltgrpscontainers").html("").remove();
                    var dbgx = 2;
                }
                catch (ex) {
                    alert("prweb.groupsslideoutpanel.dispose reports error " + ex.Message);
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
                alert("prweb.groupsslideoutpanel.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }

        //#endregion

        //end of widget defn...

    }); // end of .widget function...

} (this.prweb, jQuery));
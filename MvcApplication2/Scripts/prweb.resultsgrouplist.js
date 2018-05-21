/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />


(function (prweb, $) {

    $.widget('prweb.resultsgrouplist', {
        //#region Options
        options: {
            id: 0,
            eventID: null,
            dataURL: null,
            saveRfmURL: null,
            pcmidpgnumbersUrl: null,
            nextnewrfmid: -1,
            newrfm: null,
            newrfe: null,
            newrfgo: null,
            grprsltsURL: null,
            subscribe: null,
            publish: null,
            title: '',
            displayName: '',
            surveyID: -1,
            myDOMNode: null,
            viewModelx: null,
            hasAppliedBindings: false,
            rsltsbtns: null,
            editbtns: null,
            savebtns: null,
            cancelbtns: null,
            sendRequest: null,
            isDisposed: false
            //end comment...
        },

        //#endregion

        //#region Create
        xevent: "click.resultsgrouplist",

        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.resultsgrouplist";
                }
                prweb.rfmsvc.pcmidpgnumbersUrl = this.options.pcmidpgnumbersUrl;
                //            this.options.myDOMNode = $("#rsltsgrplistitemsrfgo")[0];
                this.options.publish = prweb.pubsub.publish;
                //            this.options.sendRequest = prweb.dataManager.sendRequest;
                this.options.sendReset = prweb.dataManager.resetData;
                this.options.viewModelx = { rfgoitems: null };
                prweb.rfmsvc.rfmListURL = this.options.dataURL;
                prweb.rfmsvc.newrfeobject = this.options.newrfe;
                prweb.rfmsvc.newRFGObject = this.options.newrfgo;
                prweb.rfmsvc.grpRsltsUrl = this.options.grprsltsURL;
                prweb.rfmsvc.saveRfmURL = this.options.saveRfmURL;
                this._subscribeToVSMEvents();
                this._addHelpListScroller();
                this._populateHelpBtnsHandlers();
                this._populateLayoutManager();
                this._retrieveRFGOListModel();
            }
            catch (ex) {
                alert("prweb.resultsgrouplist.create reports error " + ex.Message);
            }
            return;
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
                            $("#rsltsgrplistviewhelppanel").css("display", "");
                            $("#rsltsgrplistviewhelpcontainer").css("top", "72%");
                            $("#rsltsgrplistviewhelpfooter").css("top", "80%");
                            $("#rsltgrplistviewgrplistcontainer").css("bottom", "30%");
                            //                            $(".rfgoitemcontainer", "#rsltgrplistviewgrplistcontainer").css("height", "49%");
                            $("#rsltsgrplistviewhelfooterbtnlabel").html("Hide");
                        }
                    },
                    hidehelp: {
                        applystate: function () {
                            $("#rsltsgrplistviewhelppanel").css("display", "none");
                            $("#rsltsgrplistviewhelpcontainer").css("top", "92%");
                            $("#rsltsgrplistviewhelpfooter").css("top", "0px");
                            $("#rsltgrplistviewgrplistcontainer").css("bottom", "8%");
                            //                            $(".rfgoitemcontainer", "#rsltgrplistviewgrplistcontainer").css("height", "25%");
                            $("#rsltsgrplistviewhelfooterbtnlabel").html("Show");
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
                },
                removegroup: {
                    state: "hide",
                    show: {
                        applystate: function () {
                            $(".rsltsgrplistdeletable").css("display", "");
                            $(".rsltsgrplistdeletable").eq(0).css("background", "rgba(10,1,1,0.2)");
                            $(".rsltsgrplistdeletablebtn").eq(0).css("display", "none");
                            //                            $(".rfgoitemcontainer", "#rsltgrplistviewgrplistcontainer").css("height", "25%");
                        }
                    },
                    hide: {
                        applystate: function () {
                            $(".rsltsgrplistdeletable").css("display", "none");
                            var itemheight = "49%"; //is help.show state..
                            switch (true) {
                                case (lmapi.GetState("help") == "hidehelp"):
                                    itemheight = "25%";
                                    break;
                            }
                            //                            $(".rfgoitemcontainer", "#rsltgrplistviewgrplistcontainer").css("height", itemheight);
                        }
                    },
                    defaultstate: {
                        applystate: function () {

                        }
                    },
                    movetostate: function (targetstate) {
                        var me = lmapi.configStates.removegroup;
                        me[targetstate].applystate();
                        me.state = targetstate;
                    },
                    selectstate: function (targetstate) {
                        var me = lmapi.configStates.removegroup;
                        if (!targetstate) {
                            var mystate = me.state;
                            switch (true) {
                                case (mystate == "show"):
                                    targetstate = "hide";
                                    break;
                                case (mystate == "hide"):
                                    targetstate = "show";
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
                return lmapi.configStates[contextstate].state;
            };
            lmapi.GetState = function (contextstate) {
                return lmapi.configStates[contextstate].state;
            };
            this._layoutManager = lmapi;
            return;
        },

        _manageLayoutChanges: function () {
            //this could be add/remove Css classes...
            //probably want the css properties animated...
        },

        //#endregion

        //#region HelpBtns and HelpScroller
        _populateHelpBtnsHandlers: function () {
            var self = this;
            $("#rsltsgrplistviewhelpfooterbtn").bind(this.xevent, function () {
                e.preventDefault();
                e.cancelBubble = true;
                self._layoutManager.ManageState("help");
                return false;
            });
            return;
        },

        _addHelpListScroller: function () {
            //            if (prweb.IsTouch) {
            //                $("#rsltsgrplistviewhelppanel").scroller({
            //                    vertical: true,
            //                    touch: true,
            //                    items: ".rsltsgrplistviewhelpitems",
            //                    item: ".rsltsgrplistviewhelpitem",
            //                    inertialbtns: true
            //                });
            //            }
            //            else {
            //                $("#rsltsgrplistviewhelppanel").css("overflow", "auto");
            //            }
        },

        //#endregion

        //#region AddGroupBtn

        _populateAddGroupBtn: function () {
            var self = this;
            var mynewrfm = this.options.newrfm;
            mynewrfm.RFEM_List.push(prweb.rfmsvc.newrfeplease());
            var newurlplease = function (oldurl) {
                var rslt = oldurl;
                var parts = oldurl.split("rfmid=");
                rslt = parts[0] + "rfmid=" + self.options.nextnewrfmid.toString();
                self.options.nextnewrfmid -= 1;
                parts = null;
                return rslt;
            };

            $('#addgrpbtn').bind(this.xevent, function () {
                try {
                    mynewrfm.IsAddedNew = true;
                    mynewrfm.MessageOnGroupIcon = "Use Edit to define this group."
                    mynewrfm.IsShowRsltsBtn = false;
                    mynewrfm.Guid = prweb.NewGuid();
                    var newrsltsURL = newurlplease(mynewrfm.GroupResultsURL);
                    mynewrfm.GroupResultsURL = newrsltsURL;
                    var nwrfm = ko.mapping.fromJS(JSON.parse(JSON.stringify(mynewrfm)));
                    self.options.viewModelx.rfgoitems.mappedCreate(nwrfm);
                    self._populateGroupEditBtns();
                    self._populateGroupResultsBtns();
                    self._populateSaveCancelBtns();
                    var $rgrplstvw = $("#rsltsgrplistrfgolistview");
                    var scr = $rgrplstvw.data("scroller") || false;
                    if (scr) {
                        scr.scrolltoend(); //                        scr("scrolltoend");
                    }
                    else {
                        $rgrplstvw.stop(true, false).animate({ scrollTop: $rgrplstvw[0].scrollHeight }, 800);
                    }
                    $rgrplstvw, newrsltsURL, nwrfm, scr = null;
                }
                catch (ex) {
                    alert("prweb.resultsgrouplist.AddGroupBtnHandler reports " + ex.Message);
                }
            });

        },

        //#endregion

        //#region RemoveGroupBtn
        _populateRemoveGroupBtn: function () {
            var self = this;
            $('#removegrpbtn').bind(this.xevent, function () {
                var rsltstate = self._layoutManager.ManageState("removegroup");
                switch (true) {
                    case (rsltstate == "show"):
                        $(".rsltsgrplistdeletablebtn").bind(self.xevent, function () {
                            var rfmparam = ko.dataFor(this);
                            rfmparam.IsDeleted(true);
                            rfmparam.IsDisplayable(false);
                            prweb.rfmsvc.RemoveGrpListBtnAction(rfmparam);
                            self._layoutManager.ManageState("removegroup");
                            $(".rsltsgrplistdeletablebtn").unbind(self.xevent);
                        });
                        break;
                    case (rsltstate == "hide"):
                        $(".rsltsgrplistdeletablebtn").unbind(self.xevent);
                        break;
                }
            });
        },

        //#endregion

        //#region GroupEditBtns

        _populateGroupEditBtns: function () {
            var self = this;
            this.options.editbtns = this.element.find('[data-prwtype="editgroupbtn"]');
            this.options.editbtns.unbind(this.xevent);
            //click event handler for surveyiconbutton....requests resultsdata, loads surveyview in homecenterpanel...
            this.options.editbtns.bind(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.rfmsvc.GroupEditBtnAction(ko.dataFor(this));
                return false;
            });
            return;
        },

        //#endregion

        //#region GroupResultsBtns
        _populateGroupResultsBtns: function () {
            //            var self = this;
            this.options.rsltsbtns = this.element.find('[data-prwtype="activategroupbtn"]');
            this.options.rsltsbtns.unbind(this.xevent);
            var rsltsbtns = this.options.rsltsbtns;
            //click event handler for resultsgroupbtn....requests groupresult data...pagecontentviews update their resultspiecharts....how does this get unbound...
            this.options.rsltsbtns.bind(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.returnValue = false;
                    e.cancelBubble = true;
                    var thisbtn = $(this);
                    thisbtn.css("background", "#ff9900").addClass("activeresults"); //.attr("data-prwactivegroupresults", "true").attr("data-prwgrprsltsurl");
                    rsltsbtns.not(thisbtn).css("background", "hsl(290, 100%, 21%)").removeClass("activeresults");
                    thisbtn = null;
                    prweb.rfmsvc.GroupResultsBtnSelectedAction(ko.dataFor(this));
                }
                catch (ex) {
                    alert("prweb.resultsgrouplist.GroupResultsBtnhandler reports error " + ex.Message);
                }

                return false;
            });
            return;
        },

        //#endregion

        //#region Save Cancel Buttons

        _populateSaveCancelBtns: function () {
            var self = this;
            this.options.savebtns = $(".grplistsavebtn", this.element);
            this.options.cancelbtns = $(".grplistcancelbtn", this.element);
            this.options.savebtns.unbind(this.xevent);
            this.options.cancelbtns.unbind(this.xevent);
            $(".grplistsavebtn", this.element).bind(this.xevent, function () {
                try {
                    e.preventDefault();
                    e.returnValue = false;
                    e.cancelBubble = true;
                    prweb.rfmsvc.SaveChangesGrpListBtnAction(ko.dataFor(this));
                }
                catch (ex) {
                    alert("prweb.ResultGrpList.SaveBtnHandler reports " + ex.Message);
                }
                return false;
            });
            $(".grplistcancelbtn", this.element).bind(this.xevent, function () {
                try {
                    e.preventDefault();
                    e.returnValue = false;
                    e.cancelBubble = true;
                    prweb.rfmsvc.CancelChangesGrpListBtnAction(ko.dataFor(this));
                }
                catch (ex) {
                    alert("prweb.ResultGrpList.CancelBtnHandler reports " + ex.Message);
                }
                return false;
            });
            return;
        },

        //#endregion


        //#region ApplyBinding and UpdateModel

        _myApplybindings: function (data) {
            try {
                this.options.viewModelx.rfgoitems = ko.mapping.fromJS(data);
                data = null;
                prweb.rfmsvc.RFMList = this.options.viewModelx;
                var konode = $("#rsltsgrplistitemsrfgo")[0];
                ko.applyBindings(this.options.viewModelx, konode);
                konode = null;
                this.options.hasAppliedBindings = true;
            }
            catch (ex) {
                alert("prweb.resultsgrouplist.Applybindings reports error " + ex.Message);
            }
            return;
        },

        //update ko stuff...
        _myUpdatemodel: function (data) {
            try {
                ko.mapping.fromJS(data, {}, this.options.viewModelx.rfgoitems);
            }
            catch (ex) {
                alert("prweb.resultsgrouplist.Applybindings reports error " + ex.Message);
            }
            return;
        },

        //#endregion

        _createRequestUrl: function () {
            return this.options.dataUrl;
        },

        //#region retrieveRFGOListModel
        _retrieveRFGOListModel: function () {
            var that = this;
            try {
                $("#rsltsgrplistrfgolistview").css("background", "rgba(180,180,180,0.2)");
                $("#rsltsgrplistitemsrfgo").css("display", "none");
                prweb.dataManager.sendRequest({
                    url: that.options.dataURL,
                    success: function (data) {
                        try {
                            var rfms = data.rfmlist;
                            var pcms = data.pcmlist;
                            prweb.rfmsvc.pcmidpgnumbers = pcms;
                            $("#rsltsgrplistrfgolistview").css("background", "rgba(180,180,180,1)");
                            $("#rsltsgrplistitemsrfgo").css("display", "").css('-webkit-transform', ' translate3d(0,0,0)');
                            if (that.options.hasAppliedBindings) {
                                that._myUpdatemodel(rfms);
                            }
                            if (!that.options.hasAppliedBindings) {
                                that._myApplybindings(rfms);
                                that._populateGroupResultsBtns();
                                that._populateGroupEditBtns();
                                that._populateAddGroupBtn();
                                that._populateRemoveGroupBtn();
                                that._populateSaveCancelBtns();
                            }
                            //                        if (prweb.IsTouch) {
                            //                            $("#rsltsgrplistrfgolistview").scroller({
                            //                                vertical: true,
                            //                                touch: true,
                            //                                prev: ".rsltgrplstprev",
                            //                                next: ".rsltgrplstnext",
                            //                                items: ".itemsrfgo",
                            //                                item: ".rfgoitemcontainer",
                            //                                inertialbtns: true
                            //                            });
                            //                        }

                            rfms = null;
                            pcms = null;
                            data = null;
                            prweb.rfmsvc.ShowPieCharts(); //this selects the all respondents group...the first one in the list..
                        }
                        catch (ex) {
                            alert('ResultsGroupList retrieve ResultsGroupsList.successhandler reports ' + ex.Message);
                            ex = null;
                        }
                        return;
                    },
                    error: function () {
                        alert('ResultsGroupList retrieve ResultsGroupsList error...');
                    }
                });
            }
            catch (ex) {
                alert("prweb.resultsgrouplist.retrieveRFGOListModel reports error " + ex.Message);
            }

            return;
        },

        //#endregion

        //#region ResultsBtnsSelectedLights

        _populateRsltsBtnsSelectedLights: function (selecteditem) {
            //            var xx = selecteditem;
            var selectedfilter = ('[data-prwrfmguid="' + selecteditem + '"]');
            var onbtn = this.options.rsltsbtns.filter(selectedfilter).css("background", "#ff9900").addClass("activeresults");
            this.options.rsltsbtns.not(onbtn).css("background", "hsl(290, 100%, 21%)").removeClass("activeresults");
            var kodata = ko.dataFor(onbtn[0]);
            onbtn = null;
            selectedfilter = null;
            //            $('[data-prwrfmguid="' + selecteditem + '"]').css("background", "#ff9900");
        },

        //#endregion

        //#region subscriptionsVSM

        _subscribeToVSMEvents: function () {
            prweb.pubsub.subscribe(prweb.events.subscriberplatform.grprsltsselected, this._populateRsltsBtnsSelectedLights, this);
        },

        //#endregion

        //#region Dispose Destroy

        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    this.options.sendRequest = null;
                    prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.grprsltsselected, this._populateRsltsBtnsSelectedLights, this);
                    if (this.options.sendReset) {
                        this.options.sendReset(this.options.dataURL);
                        this.options.sendReset = null;
                    };
                    this.options.rsltsbtns.unbind(this.xevent);
                    this.options.editbtns.unbind(this.xevent);
                    this.options.rsltsbtns = null;
                    this.options.editbtns = null;
                    var scr = $("#rsltsgrplistrfgolistview").data("scroller") || false;
                    if (scr) {
                        scr.dispose();
                        scr = null;
                    }
                    if (this.options.viewModelx) {
                        if (this.options.viewModelx.rfgoitems) {
                            var rsltsgrpurllist = ko.toJS(this.options.viewModelx.rfgoitems);
                            prweb.rfmsvc.DisposeCurrentSurveyResults(rsltsgrpurllist);
                            //                    this.options.viewModelx.rfgoitems.mappedRemoveAll();
                            //                    this.options.viewModelx.rfgoitems.removeAll();
                            rsltsgrpurllist = null;
                            this.options.viewModelx.rfgoitems = null;
                        }
                        prweb.rfmsvc.RFMList = null;
                        this.options.viewModelx = null;
                    };
                    this.options.dataURL = null;
                    //$("#rsltsgrplistitemsrfgo")[0]
                    if (this.options.hasAppliedBindings) {
                        ko.cleanNode($("#rsltsgrplistitemsrfgo")[0]);
                    };
                    //                    this.options.myDOMNode = null;
                }
                catch (ex) {
                    alert("prweb.resultsgrouplist.dispose reports error " + ex.Message);
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
                alert("prweb.resultsgrouplist.destroy reports error " + ex.Message);
                ex = null;
            }
            $.Widget.prototype.destroy.call(this);
        }

        //#endregion

        //end of widget defn...
    });
} (this.prweb, jQuery));
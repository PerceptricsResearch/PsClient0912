/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />


(function (prweb, $) {

    $.widget('prweb.pagecontentview', {
        options: {
            id: 0,
            eventID: null,
            questID: null,
            mypgnumber: null,
            pcmid: null,
            qoimidList: null,
            qoiPaths: null,
            qoiDivs: null,
            myselectors: null,
            selectorsOn: false,
            hasactiveeventhandlers: false,
            currentmode: null,
            sdsresponsemodelUrl: null,
            subscribe: null,
            publish: null,
            title: '',
            displayName: '',
            surveyID: -1,
            dataUrl: null,
            myDOMNode: null,
            viewModelx: null,
            hasAppliedBindings: false,
            sendRequest: null
        },
        xevent: "click.pagecontentview",
        _create: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.pagecontentview";
            }
            this.options.qoiPaths = this.element.find('[data-prwpathrmkey1]');
            this.options.qoiDivs = this.element.find('[data-prwdivrmkey1]');
            this.options.myselectors = this.element.find('[data-prwtype="qoimrsltsitem"]');
            this.options.subscribe = prweb.pubsub.subscribe;
            this.options.eventID = this.options.pcmid;
            this._populateQoiPathsSDSRespMdlID();
            this._populateInitialLastEventOperation();
            this._subscribeToVSMEvents();
            if (this._iamCurrentPage()) {
                if (!this.options.hasactiveeventhandlers) {
                    this._addEventSubscriptions();
                    this.options.hasactiveeventhandlers = true;
                }
            }
            else if (this.options.mypgnumber > 1) {
                this.element.hide();
            }
        },


        _pcvModeChangeHandler: function (targetmode) {
            if (this._iamCurrentPage()) {
                this._populateInitialLastEventOperation();
            }
        },

        _isDataContextChanged: function () {
            return true; //prweb.pcvmodesvc.IsDataContextChanged();
        },

        _isModeChange: function (targetmode) {
            if (this.options.currentmode == targetmode) {
                return true;
            }
            else {
                return false;
            }
        },

        _populateInitialLastEventOperation: function () {
            if (prweb.pcvmodesvc.pcvmode) {
                switch (true) {
                    case prweb.pcvmodesvc.pcvmode == "computepaths":
                        prweb.pcvmodesvc.IsGrpSelectorsOn = false;
                        if (this._isModeChange(prweb.pcvmodesvc.pcvmode) || this._isDataContextChanged()) {
                            this._computePathsforqoimodels();
                        }
                        break;
                    case prweb.pcvmodesvc.pcvmode == "grpdefnmarksfalse":
                        this._showGrpDefnMarks(false);
                        break;
                    case prweb.pcvmodesvc.pcvmode == "grpdefnmarkstrue":
                        this._showGrpDefnMarks(true);
                        break;
                };
            }
            else {
                // default configuration for pcv is show a piechart....
                prweb.pcvmodesvc.pcvmode = "computepaths";
            }
        },



        _iamCurrentPage: function () {
            if (prweb.actionContext.currentpgnumber == this.options.mypgnumber) {
                return true;
            }
            else {
                return false;
            }
        },


        _myonPageNumberChangedhandler: function (e) {
            if (this._iamCurrentPage()) {
                // this could add the event subscriptions for everything except PageNumberChanged...which never gets removed...until destroy...
                // then lasteventoperation could based on populateInitialLastEventOperation
                this.element.css("display", "");
                this._populateInitialLastEventOperation();
                if (!this.options.hasactiveeventhandlers) {
                    this._addEventSubscriptions();
                    this.options.hasactiveeventhandlers = true;
                }
            }
            else {
                // this could also remove the event subscriptions for everything except PageNumberChanged...
                this.element.hide();
                if (this.options.hasactiveeventhandlers) {
                    this._revoveEventSubscriptions();
                    this.options.hasactiveeventhandlers = false;
                }
            }
        },

        _addEventSubscriptions: function () {
            this.options.subscribe(prweb.events.subscriberplatform.pcvmodechange, this._pcvModeChangeHandler, this);
        },

        _revoveEventSubscriptions: function () {
            prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.pcvmodechange, this._pcvModeChangeHandler, this);
        },


        // pcvs.pcelems/qoimodels don't come from the server with an SDSResponseModelId....that is populated when we showresults in _computePathsbelow..
        // that method sets an attribute on the pcelem/qoium/path to bind it to an SDSResponseModelId...
        // if we never do computePaths, that attribute is never set...and none of the showGrpDefnMarksStuff will work....
        // so this method sets the attribute on pcvs that have never had results shown on them(ie, qoimPaths was never executed,thus the attr not set...)
        // IMPORTANT...it is possible that new resultsrows can have previously unselected responses...need to rebind pcelem/qoims every time we encounter new results data...
        // so that we can recognize newly encountered sdsresponsemodelids...
        _populateQoiPathsSDSRespMdlID: function () {
            var resultsData = prweb.dataStore.get(prweb.actionContext.currentrsltsurl) || false,
                qoiPaths = this.options.qoiPaths,
                questid = this.options.questID;
            if (!resultsData) {
                resultsData = prweb.dataStore.get(prweb.rfmsvc.DefaultResultsURL) || false;
            }
            if (resultsData) {
                var populateattr = function (rjobj) {
                    var qoipath = Enumerable.From(qoiPaths).Where(function (x) { return rjobj.RMKey1.toString() == (x.getAttribute("data-prwpathrmkey1")) }).FirstOrDefault();
                    if (qoipath) {
                        qoipath.setAttribute("data-prwrmid", rjobj.SDSRespModelID); // this is ESSENTIAL FOR this._showGrpDefnMarks....below...
                    }
                };

                Enumerable.From(resultsData.RsltsDetailsDxnry[questid]).ForEach(function (xrjobj) {
                    return populateattr(xrjobj);
                });
            }
            else {
                var url = prweb.actionContext.currentrsltsurl || "no URL present";
                alert("prweb.pagecontentview.populateQoiPathsSDSRespMdlID says resultsdata is empty for resultsURL= " + url);
            }
            resultsData = null;
            qoiPaths = null;
            questid = null;
        },

        _computePathsforqoimodels: function () {
            // this url is the address of the resultsdata - rpso that this method will use to populate piechart slices...
            // IMPORTANT...it is possible that new resultsrows can have previously unselected responses...need to rebind pcelem/qoims every time we encounter new results data...
            //            var self = this;
            if (this.options.selectorsOn) {
                this._turnMySelectorsOff();
            }
            var resultsData = prweb.dataStore.get(prweb.actionContext.currentrsltsurl),
                qoiPaths = this.options.qoiPaths,
                pathmaker = this._qoiPathMaker,
                qoiDivs = this.options.qoiDivs,
                questid = this.options.questID;
            if (resultsData) {
                qoiDivs.css("display", "").html("0%");
                qoiPaths.attr("d", "m0,0");
                var toPct = function (xpct) {
                    return ((Math.round(xpct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                };
                var myresultsmath = function (rjobj) {
                    var rcount = rjobj.RespDentCount,
                        mypct = 0,
                        allcount = resultsData.RPSO.AllSurveyRDENTSCount;
                    if (allcount > 0) {
                        mypct = (rcount / allcount) * 100;
                        qoiPaths.filter('[data-prwpathrmkey1=' + rjobj.RMKey1 + ']').attr("d", pathmaker(mypct));
                        qoiDivs.filter('[data-prwdivrmkey1=' + rjobj.RMKey1 + ']').html(toPct(mypct));
                    }
                };
                var rsltsrows = resultsData.RsltsDetailsDxnry[questid];
                Enumerable.From(rsltsrows).ForEach(function (xrjobj) {
                    return myresultsmath(xrjobj);
                });
                rsltsrows = null;
                resultsData = null;
                qoiPaths = null;
                qoiDivs = null;
                pathmaker = null;
            }
            else {
                qoiDivs.css("display", "").html("0%");
                qoiPaths.attr("d", "m0,0");
                rsltsrows = null;
                resultsData = null;
                qoiPaths = null;
                qoiDivs = null;
                pathmaker = null;
                //                alert("prweb.pagecontentview.computePathsforqoimodels says resultsdata is false.");
            }
        },

        _optionSelectionChangedHandler: function (event) {
            // this is gonna put a groupdefnmark on the selected item...it does it by updating datacontext..
            // update the datacontext...rfelem selectedoptionidlist...for the rfm ....prweb.actionContext.currentrsltsgrpdatacontext
            // then calls showGrpDefnMarks()....can't do...the this that showGrpDefnMarks expects is a pagecontentview...if called from here, this is a resultsitem div..
            try {
                event.preventDefault();
                if (prweb.IsTouch) {
                    event.cancelBubble = true;
                    event.handled = true;
                }
                else {
                    event.stopPropagation();
                }
            }
            catch (ex) {
                alert("pagecontentview.optionSelectionChangedHandler reports " + ex.Message);
            }
            var mythis = $(this);
            var optionlist = null;
            var mypath = mythis.find('[data-prwpathrmkey1]');
            var optionid = parseInt(mypath.attr("data-prwrmid"));
            var mypcmid = mythis.attr("data-prwpcmid");
            var grpcontext = Enumerable.From(prweb.rfmsvc.currentrdentset.RFElemList()).Where(function (rfe) { return rfe.PCM_ID() == mypcmid }).FirstOrDefault();
            if (grpcontext) {
                optionlist = grpcontext.SelectedOptionIDList();
                if (optionid) {
                    if (Enumerable.From(optionlist).Contains(optionid)) {
                        mypath.attr("d", "m0,0");
                        //  this removes the selectedoptionid  optionlist = Enumerable.From(optionlist).Except(optionid).ToArray();
                        grpcontext.SelectedOptionIDList(Enumerable.From(optionlist).Except(optionid).ToArray());
                    }
                    else {
                        mypath.attr("d", event.data());
                        optionlist.push(optionid); // Enumerable.From(optionlist).Union(optionid).ToArray();

                    }
                    if (grpcontext.SelectedOptionIDList().length == 0) {
                        if (prweb.rfmsvc.removeEmptyRFEfromCurrentRDentSet(parseInt(mypcmid))) {
                            prweb.pubsub.publish(prweb.events.subscriberplatform.rsltsfilteremelementschanged);
                        }
                    }
                }
            }
            else {
                mypath.attr("d", event.data());
                var newrfe = prweb.rfmsvc.addnewrfetocurrentrdentset(mypcmid, optionid);
                prweb.pubsub.publish(prweb.events.subscriberplatform.rsltsfilteremelementschanged);
            }
        },

        _turnMySelectorsOff: function () {
            this.options.selectorsOn = false;
            this.options.myselectors.css("background", "rgba(1,1,1,0.1)").unbind(this.xevent, this._optionSelectionChangedHandler);
            //            this._showGrpDefnMarks();
        },

        _turnMySelectorsOn: function () {
            if (!this.options.selectorsOn) {
                this.options.selectorsOn = true;
                this.options.myselectors.css("background", "hsla(290, 100%, 37%,1)")
                                        .attr("data-prwpcmid", this.options.pcmid)
                                        .bind(this.xevent, this._checkPathMaker, this._optionSelectionChangedHandler);
            }
        },

        _groupActionSelectorsChangeHandler: function (e) {
            // this needs to adds/removes click handlers to all of the qoimSelectedDivs...depending on e...is a boolean...true=isSelectingEnabled, false=notSelectingEnabled
            if (e) {
                this._prevwSelectorsOn();
            }
            else {
                this._prevwSelectorsOff();
            }
        },

        _showGrpDefnMarks: function (grpselectors) {
            this._hideResultsUx();
            if (grpselectors) {
                this._turnMySelectorsOn();
            }
            else {
                this._turnMySelectorsOff();
            }
            var checkmaker = null;
            if (prweb.actionContext.current !== "GroupOptionsSelect") {
                checkmaker = this._xPathMaker();
            }
            else if (prweb.actionContext.current == "GroupOptionsSelect") {
                checkmaker = this._checkPathMaker();
            }
            var mypcmid = this.options.pcmid;
            var grpcontext = Enumerable.From(prweb.rfmsvc.currentrdentset.RFElemList()).Where(function (rfe) { return rfe.PCM_ID() == mypcmid }).FirstOrDefault();
            if (grpcontext) {
                var optionids = Enumerable.From(grpcontext.SelectedOptionIDList());
                Enumerable.From(this.options.qoiPaths).Where(function (x) {
                    return optionids.Contains(parseInt(x.getAttribute("data-prwrmid")))
                }).ForEach(function (q) {
                    return q.setAttribute("d", checkmaker)
                });
            }
        },

        _hideResultsUx: function () {
            this.options.qoiDivs.css("display", "none");
            this.options.qoiPaths.attr("d", "m0,0");
        },

        _qoiPathMaker: function (pct) {
            var rad = Math.PI / 180,
            angleplus = ((360 * (100 - pct) / 100.1)),
            sangleplus = ((360 * (pct + 25) / 100.1)),
            endAngle = (90 + angleplus),
            startAngle = (angleplus + sangleplus),
            cx = 20,
            cy = 20,
            r = 10,
            isLargArc = 0,
            x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);

            if ((endAngle - startAngle) < -180.0) {
                isLargArc = 1;
            }
            return ("M" + " " + cx + " " + cy + " " + "L" + " " + x1 + " " + y1 + " " + "A" + " " + r + " " + r + " " + 0 + " " + isLargArc + " " + 1 + " " + x2 + " " + y2 + " " + "Z");
        },

        _checkPathMaker: function () {
            return "m16.87726,25.20772l9.81974,-13.38821l3.87712,-1.34433c-4.50958,4.03466 -7.90801,8.51384 -13.38482,19.80573c-2.74747,-4.55849 -2.99637,-4.11011 -7.17336,-8.56704l3.93182,0.1319l2.92949,3.36194l0.00001,0z";
        },
        _xPathMaker: function () {
            return "m15.03299,13.68228l-4.55532,-1.95398l8.12775,7.26344l-6.90647,6.49621l-1.03119,3.80434l9.41249,-8.82996l9.69406,9.25973l-1.78945,-3.59354l-6.63456,-7.07854l5.04383,-4.78923l2.02658,-3.55437l-8.37862,7.16337"
        },
        // xpathmaker d=d="m15.03299,13.68228l-4.55532,-1.95398l8.12775,7.26344l-6.90647,6.49621l-1.03119,3.80434l9.41249,-8.82996l9.69406,9.25973l-1.78945,-3.59354l-6.63456,-7.07854l5.04383,-4.78923l2.02658,-3.55437l-8.37862,7.16337"


        _subscribeToVSMEvents: function () {
            prweb.pubsub.subscribe("pcv_iscurrentpage_" + this.options.mypgnumber, this._myonPageNumberChangedhandler, this);
            prweb.pubsub.subscribe("pcv_notcurrentpage_" + this.options.mypgnumber, this._myonPageNumberChangedhandler, this);
            //            this.options.subscribe(prweb.events.subscriberplatform.surveycurrentpagechanged, this._myonPageNumberChangedhandler, this);
        },


        destroy: function () {
            prweb.pubsub.unsubscribe("pcv_iscurrentpage_" + this.options.mypgnumber, this._myonPageNumberChangedhandler, this);
            prweb.pubsub.unsubscribe("pcv_notcurrentpage_" + this.options.mypgnumber, this._myonPageNumberChangedhandler, this);
            //            prweb.pubsub.accurateunsub(prweb.events.subscriberplatform.surveycurrentpagechanged, this._myonPageNumberChangedhandler, this);
            prweb.pubsub.accurateunsub(prweb.events.subscriberplatform.pcvmodechange, this._pcvModeChangeHandler, this);
            this.options.subscribe = null;
            this._turnMySelectorsOff();
            this.options.sendRequest = null;
            this.options.myDOMNode = null;
            this.options.qoiPaths = null;
            this.options.qoiDivs = null;
            this.options.qoimidList = null;
            this.options.myselectors.unbind().empty();
            this.options.myselectors = null;
            this.options.resultsmodelUrl = null;
            //            this.element.unbind().empty();
            $.Widget.prototype.destroy.call(this);
        }
    });
} (this.prweb, jQuery));

//            var normalizedUrl = prweb.getRelativeEndpointUrl(this.options.resultsmodelUrl),
//                sdsnormUrl = prweb.getRelativeEndpointUrl(this.options.sdsresponsemodelUrl),

//                sdsData = prweb.dataStore.get(sdsnormUrl),
//                qrmkeys = Enumerable.From(this.options.qoimidList),

//                var rdtls = Enumerable.From(resultsData.ResultsDetailsList).ToArray();
//                var jrows = Enumerable.From(sdsData).Join(qrmkeys, "$.Key1.toString()", "", function (outer, inner) { return outer }).ToArray();
//                var rjrows = Enumerable.From(resultsData.ResultsDetailsList).Join(jrows, "$.SDSRespModelID", "$.SDSRespModelID", function (outer, inner) { return { rsltdtl: outer, sdsmodel: inner} }).ToArray();
//                var smallrds = Enumerable.From(resultsData.ResultsDetailsList).Where(function (x) { return x.QuestID == questid }).ToArray();


//                var sdsidrows = Enumerable.From(sdsData).Where(function (x) { return qrmkeys.Contains(x.Key1.toString()) }).Select("$.SDSRespModelID");
//                var rsltsrows = Enumerable.From(resultsData.ResultsDetailsList).Where(function(x) { return sdsidrows.Contains(x.SDSRespModelID)}).ToArray();
//                var sdsidrows = Enumerable.From(sdsData).Join(qrmkeys, "$.Key1.tostring", "", "outer,inner=>outer + ':' + inner").ToArray();

//                var jjrows = Enumerable.From(sdsData).Join(qrmkeys, "$.Key1.toString()", "", function (outer, inner) { return  { myouter: outer, myinner: inner } }).ToArray();
//                var xdumm = 2;

//                    var jqoidiv = qoiDivs.toEnumerable().Where(function (x) { return rjobj.sdsmodel.Key1.toString() == (x.getAttribute("data-prwdivrmkey1")) }).ToArray();
//                    var qoipath = Enumerable.From(qoiPaths).Where(function (x) { return rjobj.sdsmodel.Key1.toString() == (x.getAttribute("data-prwpathrmkey1")) }).FirstOrDefault();
//                    var qoidiv = Enumerable.From(qoiDivs).Where(function (x) { return rjobj.sdsmodel.Key1.toString() == (x.getAttribute("data-prwdivrmkey1")) }).FirstOrDefault();

// Take over link navigation in the widget to enable a
// single page interface.  This will keep all links point to the dashboard
// with the proper url hash set for the action.
//        _adjustNavigation: function () {
//            var that = this;

//            this.element.find('[data-action]').each(function () {
//                var $this = $(this),
//                    action = $this.data('action'),
//                    surveyiconId = that.options.id,
//                    state = $.bbq.getState() || {},
//                    newUrlBase = prweb.getBaseUrl();

//                state.id = surveyiconId;
//                switch (action) {
//                    case 'survey-metadataview-selected':
//                        state.layout = 'survey-metadataview';
//                        break;
//                    case 'xxx':
//                        state.layout = 'survey-metadataview';
//                        break;
//                };
//                $this.attr('href', $.param.fragment(newUrlBase, state));
//            });
//        },
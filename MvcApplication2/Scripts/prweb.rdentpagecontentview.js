(function (prweb, $) {

    $.widget('prweb.rdentpagecontentview', {

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
            resultsmodelUrl: null,
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

        _create: function () {
            this.options.qoiPaths = this.element.find('[data-prwpathrmkey1]');
            //            this.options.qoiDivs = this.element.find('[data-prwdivrmkey1]');
            this.options.myselectors = this.element.find('[data-prwtype="qoimrsltsitem"]');
            this.options.subscribe = prweb.pubsub.subscribe;
            this.options.eventID = this.options.pcmid;
            //            this._populateQoiPathsSDSRespMdlID();
            this._populateInitialLastEventOperation();
            //            this._subscribeToVSMEvents();
            if (this._iamCurrentPage()) {
                if (!this.options.hasactiveeventhandlers) {
                    //                    this._addEventSubscriptions();
                    this.options.hasactiveeventhandlers = true;
                }
            }
            //            else if (this.options.mypgnumber > 1) {
            //                this.element.hide();
            //            }
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
                    case prweb.pcvmodesvc.rdentpcvmode == "activeresponse":
                        this._turnMySelectorsOn();
                        break;
                };
            }
            else {
                // default configuration for rdentpcv is activeresponse....
                prweb.pcvmodesvc.rdentpcvmode = "activeresponse";
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
                    //                    this._addEventSubscriptions();
                    this.options.hasactiveeventhandlers = true;
                }
            }
            else {
                // this could also remove the event subscriptions for everything except PageNumberChanged...
                this.element.hide();
                if (this.options.hasactiveeventhandlers) {
                    //                    this._revoveEventSubscriptions();
                    this.options.hasactiveeventhandlers = false;
                }

            }
        },

//        _addEventSubscriptions: function () {
//            this.options.subscribe(prweb.events.subscriberplatform.pcvmodechange, this._pcvModeChangeHandler, this);
//        },

//        _revoveEventSubscriptions: function () {
//            prweb.pubsub.accurateunsub(prweb.events.subscriberplatform.pcvmodechange, this._pcvModeChangeHandler, this);
//        },

        _optionSelectionChangedHandler: function (event) {
            var mythis = $(this);
            var optionlist = null;
            var mypath = mythis.find('[data-prwpathrmkey1]');
            var myrespmodel = JSON.parse(mythis.attr("data-prwrespmodel"));
            //event.data is a function preweb.responsesvc.EvaluateResponseModel...parameter is responseModel...adds or removesifpresent responseModel...
            if (event.data(myrespmodel)) {
                mypath.attr("d", prweb.responsesvc.IsCheckedCheckBoxToPath(true));
            }
            else {
                mypath.attr("d", prweb.responsesvc.IsCheckedCheckBoxToPath(false));
            }
            var xdbg = 2;
        },

        _turnMySelectorsOff: function () {
            this.options.selectorsOn = false;
            this.options.myselectors.css("background", "rgba(1,1,1,0.1)").unbind("click", this._optionSelectionChangedHandler);
        },

        _turnMySelectorsOn: function () {
            if (!this.options.selectorsOn) {
                this.options.selectorsOn = true;
                this.options.myselectors.attr("data-prwpcmid", this.options.pcmid)
                                        .click(prweb.responsesvc.EvaluateResponseModel, this._optionSelectionChangedHandler);
            }
        },


//        _checkPathMaker: function () {
//            return "m16.87726,25.20772l9.81974,-13.38821l3.87712,-1.34433c-4.50958,4.03466 -7.90801,8.51384 -13.38482,19.80573c-2.74747,-4.55849 -2.99637,-4.11011 -7.17336,-8.56704l3.93182,0.1319l2.92949,3.36194l0.00001,0z";
//        },
//        _xPathMaker: function () {
//            return "m15.03299,13.68228l-4.55532,-1.95398l8.12775,7.26344l-6.90647,6.49621l-1.03119,3.80434l9.41249,-8.82996l9.69406,9.25973l-1.78945,-3.59354l-6.63456,-7.07854l5.04383,-4.78923l2.02658,-3.55437l-8.37862,7.16337"
//        },
        _subscribeToVSMEvents: function () {
            //            var that = this;
            //            this.options.subscribe(prweb.events.subscriberplatform.surveycurrentpagechanged, this._myonPageNumberChangedhandler, this);
        },


        destroy: function () {
            //            prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.surveycurrentpagechanged, this._myonPageNumberChangedhandler, this);
            //            prweb.pubsub.accurateunsub(prweb.events.subscriberplatform.pcvmodechange, this._pcvModeChangeHandler, this);
            this.options.subscribe = null;
            this._turnMySelectorsOff();
            this.options.sendRequest = null;
            this.options.myDOMNode = null;
            this.options.qoiPaths = null;
            this.options.qoiDivs = null;
            this.options.qoimidList = null;
            this.element.unbind().empty();
            this.element[0].innerHTML = "";
            $.Widget.prototype.destroy.call(this);
        }
    });
} (this.prweb, jQuery))


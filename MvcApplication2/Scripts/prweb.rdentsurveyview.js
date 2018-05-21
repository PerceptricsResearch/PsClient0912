/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.6.4-vsdoc.js" />


(function (prweb, $) {

    $.widget('prweb.rdentsurveyview', {
        options: {
            id: 0,
            surveyGuidstring: null,
            rdentmodel: null,
            rdenthearbeatURL: null,
            pcmidpgnumbersUrl: null,
            pcmidpgnumbers: null,
            resultsmodelUrl: null,
            sdsresponsemodelUrl: null,
            pagesCount: 0,
            nxtPgURL: null,
            nxtPage: null,
            rsltsgrpsbtn: null,
            rsltsgrpsbtnvisibiliy: false,
            smddtlsbtn: null,
            smddtlsbtnvisibility: false,
            grpdefncntnr: null,
            grpdefncntnrvisibility: false,
            scrllpgspanel: null,
            scrllapi: null,
            subscribe: null,
            publish: null,
            title: '',
            displayName: '',
            surveyID: -1,
            myDOMNode: null,
            defaultRPSO: null,
            hasAppliedBindings: false,
            sendRequest: null
        },



        _create: function () {
            prweb.pcvmodesvc.rdentpcvmode = "activeresponse"
            prweb.responsesvc.RDentModel = this.options.rdentmodel;
            prweb.responsesvc.PageCount = this.options.pagesCount;
            prweb.actionContext.currentpgnumber = 1;
            prweb.rdentheartbeatsvc.rdentheartbeatURL = this.options.rdenthearbeatURL;
            prweb.rdentheartbeatsvc.sendActiveHeartBeattoServer();
            $(".rdscrollablepagespanel").scrollable({ vertical: false, mousewheel: false });
            this.options.scrllapi = $(".rdscrollablepagespanel").data("scrollable");
            this.options.scrllapi.prwcurrentndx = 0;
            this.options.scrllapi.prwcurrentpage = 1;//6
            this.options.scrllapi.isscrollto = false;
            this.options.scrllapi.nxtpgurl = this.options.nxtPgURL;
            this.options.scrllapi.prwpgcount = this.options.pagesCount;
            this.options.scrllapi.prwnxtbtn = $("#rdpagespanelactions").find('a.next');
            this.options.scrllapi.prwprevbtn = $("#rdpagespanelactions").find('a.prev');
            var self = this;
            this.options.scrllapi.prwpopulatenxtpgurl = self._populateNextPageURL;
            this.options.scrllapi.prwretrievenxtpage = self._retrieveNextPage;
            if (this.options.scrllapi.prwpgcount == 1) {
                this.options.scrllapi.prwnxtbtn.hide();
            };
            this._populateScrollablebeforeSeekHandler();
            this._populateScrollabeonSeekHandler();

            $("#rdpagespanel").rdentsurveypageslist();
            $("#rdnavpanel").rdactionslist();
            //                        this._sizethePagesPanel();
            //            this.options.publish = prweb.pubsub.publish;
            //            this.options.subscribe = prweb.pubsub.subscribe;
            this._subscribeToRDentEvents();
            this.options.sendRequest = prweb.dataManager.sendRequest;
            $(window).resize(this.options.scrllapi, this._sizethePagesPanel);
            //            this.options.scrllapi.seekTo(0, 800);
            //            this._sizethePagesPanel();
            if (this.options.pagesCount > 1) {
                this._retrieveNextPage(1, this.options.nxtPgURL);
            }
            if (this.options.pagesCount > 2) {
                var pg3URL = this._populateNextPageURL(2, this.options.nxtPgURL);
                this._retrieveNextPage(2, pg3URL);
            }
            this._populateSurveyFinishBtnHandler();
            this._populateSurveyPagesBtnHandler();
            this._populateSurveyActionsBtnHandler();

            prweb.rdentheartbeatsvc.StartHeartBeat();
            //            this.options.scrllapi.seekTo(0);
        },

        _populateSurveyFinishBtnHandler: function () {
            $("#rdprwfinishbtn").click(function () {
                prweb.responsesvc.SendRDentModelToServer();
            });
        },
        _populateSurveyPagesBtnHandler: function () {
            var self = this;
            $("#rdprwpagesbtn").click(function () {
                self._managePagesSlideOutClick();
            });
        },
        _populateSurveyActionsBtnHandler: function () {
            var self = this;

            $("#rdprwactionsbtn").click(function () {
                self._manageActionsSlideOutClick();
            });
        },

        _populateScrollablebeforeSeekHandler: function () {
            var self = this;
            this.options.scrllapi.beforeseekHandler = function (event, i) {
                //                self.options.scrllapi.getItems(i).find(".rdpcvpg").css("display", ""); //display the item we are about to scroll to...
                var currentndx = this.prwcurrentndx;
                var currentpage = this.prwcurrentpage;
                if (i > currentndx || (currentndx == 4 && i == 0)) {
                    if (this.isscrollto) {
                        if (currentpage == this.prwpgcount) {
                            return true;
                        }
                    }
                    else if (currentpage == this.prwpgcount) {
                        return false;
                    }
                }
            }
            this.options.scrllapi.onBeforeSeek(this.options.scrllapi.beforeseekHandler);
        },

        _populateScrollabeonSeekHandler: function () {
            var self = this;
            this.options.scrllapi.seektoHandler = function (event, i) {
                var currentndx = this.prwcurrentndx; // this - should be the scrllapi....
                var isnext = false;
                var isprev = false;
                var targetscrlndx = 0;
                var targetpgnum = 0;
                var targetURL = "";
                var curpgplusone = 0;
                if (i > currentndx) {
                    isnext = true;
                    isprev = false;
                }
                else if (i < currentndx) {
                    isnext = false;
                    isprev = true;
                }
                if (currentndx == 4 && i == 0) {
                    isnext = true;
                    isprev = false;
                }
                else if (currentndx == 0 && i == 4) {
                    isnext = false;
                    isprev = true;
                }
                if (isnext) {
                    if (!this.isscrollto) {
                        this.prwcurrentpage = Math.min((this.prwcurrentpage + 1), this.prwpgcount);
                    }
                    targetpgnum = Math.min((this.prwcurrentpage + 2), this.prwpgcount);
                    targetscrlndx = ((targetpgnum - 1) % 5);
                    targetURL = this.prwpopulatenxtpgurl((targetpgnum - 1), this.nxtpgurl);
                    var itemid = "#rdscrpgitem" + targetscrlndx;
                    var itempgUrl = $(itemid).attr("data-rdpgUrl");
                    if (targetURL.localeCompare(itempgUrl) !== 0) {
                        this.prwretrievenxtpage(targetscrlndx, targetURL);
                    }
                    if (this.prwcurrentpage == this.prwpgcount) {
                        this.prwnxtbtn.hide();
                    }
                    if (this.prwcurrentpage > 1) {
                        this.prwprevbtn.css("display", "");
                    }
                }
                else if (isprev) {
                    if (!this.isscrollto) {
                        this.prwcurrentpage = Math.max((this.prwcurrentpage - 1), 1);
                    }
                    targetpgnum = Math.max((this.prwcurrentpage - 2), 0);
                    targetscrlndx = ((Math.max((targetpgnum - 1), 0)) % 5);
                    var tgturlpgnum = Math.max((targetpgnum - 1), 0);
                    targetURL = this.prwpopulatenxtpgurl(tgturlpgnum, this.nxtpgurl);
                    var itemid = "#rdscrpgitem" + targetscrlndx;
                    var itempgUrl = $(itemid).attr("data-rdpgUrl");
                    var xxcompare = targetURL.localeCompare(itempgUrl);
                    if (xxcompare !== 0) {
                        this.prwretrievenxtpage(targetscrlndx, targetURL);
                    }
                    if (this.prwcurrentpage !== this.prwpgcount) {
                        this.prwnxtbtn.css("display", "");
                    }
                    if (this.prwcurrentpage == 1) {
                        this.prwprevbtn.hide();
                    }
                }
                this.prwcurrentndx = i;
                curpgplusone = this.prwcurrentpage + 1;
                if (this.prwpgcount > 5 && curpgplusone > 5) {
                    //                sapiconf.circular = true;
                }
                else if (this.prwpgcount > 5) {
                    //                sapiconf.circular = false;
                }
                this.isscrollto = false;
                if (prweb.actionContext.currentpgnumber !== this.prwcurrentpage) {
                    prweb.actionContext.currentpgnumber = this.prwcurrentpage;
                    var newpgnum = this.prwcurrentpage;
                    prweb.pubsub.publish(prweb.events.rdentplatform.scrolltopage, newpgnum);
                }
                //                self.options.scrllapi.getItems(i).find(".rdpcvpg").css("display", "");
                var xpages = self.options.scrllapi.getItems().find(".rdpcvpg");
                //                var xpages = xitems.find(".rdpcvpg");
                //                var curitem = self.options.scrllapi.getIndex();
                var thisitem = xpages.eq(i).css("display", "");
                xpages.not(thisitem).hide();
            }
            this.options.scrllapi.onSeek(this.options.scrllapi.seektoHandler);
        },


        _sizethePagesPanel: function (xevent) {
            var xapi = xevent.data;
            var panel = xapi.getRoot();
            var panelwidth = panel.innerWidth();
            var xitems = xapi.getItems().css("width", panelwidth);
            //            var nextitem = xitems.eq(xapi.getIndex() + 1);
            //            nextitem.hide();
            //            var xsppwidth = $(".rdscrollablepagespanel").innerWidth();
            //            var xadjpgwidth = (xsppwidth); //* 0.995);
            //            var pis = $(".rdpagespanelitems .rdprwpage");
            //            $(".rdpagespanelitems .rdprwpage").css("width", panelwidth); //xadjpgwidth);
            //$(".rdscrollablepagespanel").data("scrollable");
            var itemwr = xapi.getItemWrap();
            var nleft = panelwidth * (xapi.getIndex());
            itemwr.css("left", "-" + nleft + "px");

            //            var cindx = xapi.getIndex();
            //            if (cindx > 0) {
            //                xapi.seekTo(cindx, 0);
            //            }
            xapi = null;
        },

        _populateNextPageURL: function (tpgnum, npURL) {
            var arrpgn = npURL.split("pgNumber=");
            var pgn = arrpgn[1];
            var oldpgparm = "pgNumber=" + pgn;
            //            var newndx = nxtpgnum;
            var newpgparm = "pgNumber=" + (tpgnum.toString());
            var retstring = npURL.replace(oldpgparm, newpgparm);
            return retstring;
        },


        _retrieveNextPage: function (itemndx, tgtURL) {
            //            var that = this;
            prweb.dataManager.sendRequest({
                url: tgtURL,
                dataType: "html",
                success: function (data) {
                    var itemid = "#rdscrpgitem" + itemndx
                    var theitem = $(itemid)
                    theitem.empty().append(data);
                    theitem.attr("data-rdpgUrl", tgtURL);
                },
                error: function (e) {
                    alert('RDentSurveyView.js Retrieve NextPage error...');
                }
            });
        },

        _retrievePCMIDpgNumbers: function () {
            var that = this;
            this.options.sendRequest({
                url: that.options.pcmidpgnumbersUrl,
                success: function (pcmdata) {
                    that.options.pcmidpgnumbers = pcmdata;
                    //                    prweb.rfmsvc.pcmidpgnumbers = pcmdata;
                    //                    that.options.publish(prweb.events.status, {
                    //                        type: 'saving',
                    //                        message: 'SurveyView PCMIDpgNumbers Retrieved...',
                    //                        duration: 8000
                    //                    });
                },
                error: function (e) {
                    alert('RDentSurveyView retrieve PCMIDpgNumbers error...');
                }
            });
        },


        _subscribeToRDentEvents: function () {
            prweb.pubsub.subscribe(prweb.events.rdentplatform.surveycurrentpagechanged, this._navigateToPageNumber, this);
            //            this.options.subscribe(prweb.events.subscriberplatform.rsltsgroupsbtnclick, this._moveToVisualstatersltsgroupsbtnclick, this);
            //            this.options.subscribe(prweb.events.subscriberplatform.smddetailsbtnclick, this._moveToVisualstatesmddetailsbtnclick, this);
            //            this.options.subscribe(prweb.events.subscriberplatform.grpdefnselected, this._moveToVisualstategrpdefnselected, this);
            //            this.options.subscribe(prweb.events.subscriberplatform.grpdefnpageiconselected, this._moveToVisualstategrpdefnpageiconselected, this);
        },

        _navigateToPageNumber: function (pcmid) {
            this.options.scrllapi.isscrollto = true;
            this.options.scrllapi.prwcurrentpage = parseInt(pcmid);
            if (this.options.pagesCount < 6) {
                this.options.scrllapi.seekTo(parseInt(pcmid) - 1, 0);
            }
        },

        _managePagesSlideOutClick: function () {
            prweb.pubsub.publish(prweb.events.rdentplatform.pagesbtnclick);
        },

        _manageActionsSlideOutClick: function () {
            prweb.pubsub.publish(prweb.events.rdentplatform.actionsbtnclick)
        },


        //        _moveToVisualstatersltsgroupsbtnclick: function () {
        //            prweb.actionContext.isrsltsgrpdefnactive = false;
        //            prweb.actionContext.current = "Results";
        //            if (prweb.pcvmodesvc.pcvmode !== "computepaths") {
        //                prweb.pcvmodesvc.ModeTo("computepaths");
        //            }
        //            this.options.grpdefncntnr.hide();
        //            this.options.grpdefncntnrvisibility = false;
        //            if (this.options.rsltsgrpsbtnvisibiliy) {
        //                this.options.rsltsgrpsbtn.hide();
        //                this.options.rsltsgrpsbtnvisibiliy = false;
        //                this._animateSurveyPanel("full");
        //            }
        //            else {
        //                this.options.rsltsgrpsbtn.css("display", "");
        //                this.options.rsltsgrpsbtnvisibiliy = true;
        //                this._animateSurveyPanel("partial");
        //            }
        //            if (!this.options.pcmidpgnumbers) { this._retrievePCMIDpgNumbers(); }
        //        },

        _animateSurveyPanel: function (mymode) {
            var mysurveypanel = $("#pagesbucket");
            var mysurveyheader = $("#headerbucket");
            var mysurveyinfocontainer = $("#surveyinfocontainer");
            var resizething = this._sizethePagesPanel;
            if (mymode == "full") {
                mysurveyinfocontainer.animate({ height: "35%" });
                mysurveyheader.animate({ width: "15%" }, { duration: 0, easing: 'easeInQuad', complete: function () { mysurveypanel.animate({ width: "85%" }, { duration: 50, easing: 'easeInQuad', complete: function () { resizething() } }); } })


            }
            else if (mymode == "partial") {

                mysurveyheader.animate({ width: "35%" });
                mysurveypanel.animate({ width: "65%" }, { duration: 0, easing: 'easeInQuad', complete: function () { resizething() } });
                mysurveyinfocontainer.animate({ height: "10%" });
            }
        },

        //        _moveToVisualstatesmddetailsbtnclick: function () {
        //            if (this.options.smddtlsbtnvisibility) {
        //                this.options.smddtlsbtn.hide();
        //                this.options.smddtlsbtnvisibility = false;
        //            }
        //            else {
        //                this.options.smddtlsbtn.css("display", "");
        //                this.options.smddtlsbtnvisibility = true;
        //            }
        //        },

        destroy: function () {
            //            prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.surveycurrentpagechanged, this._myonPageNumberChangedhandler, this);
            //            prweb.pubsub.accurateunsub(prweb.events.subscriberplatform.pcvmodechange, this._pcvModeChangeHandler, this);
            //            prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.rsltsgroupsbtnclick, this._moveToVisualstatersltsgroupsbtnclick, this);
            //            prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.smddetailsbtnclick, this._moveToVisualstatesmddetailsbtnclick, this);
            //            prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.grpdefnselected, this._moveToVisualstategrpdefnselected, this);
            //            prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.grpdefnpageiconselected, this._moveToVisualstategrpdefnpageiconselected, this);
            //            $(window).unbind('resize', this._sizethePagesPanel)
            this._sizethePagesPanel = null;
            this.options.rsltsgrpsbtn = null;
            this.options.smddtlsbtn = null;
            this.options.grpdefncntnr = null;
            this.options.publish = null;
            this.options.subscribe = null;
            this.options.sendRequest = null;
            this.options.myDOMNode = null;
            this.options.surveyGuidstring = null;
            this.options.resultsmodelUrl = null;
            this.options.resultsModel = null;
            this.options.scrllapi.prwnxtbtn.unbind();
            this.options.scrllapi.prwprevbtn.unbind();
            this.options.scrllapi.prwnxtbtn = null;
            this.options.scrllapi.prwprevbtn = null;
            this.options.scrllapi.prwcurrentndx = null;
            this.options.scrllapi.prwcurrentpage = null;
            this.options.scrllapi.nxtpgurl = null;
            this.options.scrllapi.prwpopulatenxtpgurl = null;
            this.options.scrllapi.prwretrievenxtpage = null;
            this.options.scrllapi.beforeseekHandler = null
            this.options.scrllapi.seektoHandler = null;
            this.options.scrllapi.onSeek = null;
            this.options.scrllapi.onBeforeSeek = null;
            this._retrieveNextPage = null;
            //            this._myseektoHandler = null;
            this.options.scrllapi = null;
            $(".rdscrollablepagespanel").unbind().empty();

            $(".rdscrollablepagespanel").removeData("scrollable");
            this.element.unbind().empty();
            $.Widget.prototype.destroy.call(this);
        }
    });
} (this.prweb, jQuery));
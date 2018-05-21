/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {
    $.widget('prweb.subscriberplatform', {

        //#region options
        options: {
            id: 0,
            prwappviewroot: null,
            prwebappbtnbar: null,
            hcp: null,
            actionsbtn: null,
            surveysbtn: null,
            pagesbtn: null,
            rsltsgroupsbtn: null,
            smddetailsbtn: null,
            prwdesigntoolsbtn: null,
            prwdesignstylesbtn: null,
            prwdesignimagesmgrbtn: null,
            appdesignnewsurveybtn: null,
            sharehomeUrl: null,
            subscriptionhomeUrl: null,
            settingshomeUrl: null,
            surveymetadataviewUrl: null,
            groupsslideoutviewUrl: null,
            designerhomeUrl: null,
            designerresourcesUrl: null,
            dsgnrimgmgrguildstrlisturl: null,
            surveypagenaviUrl: null,
            retrieveurllistURL: null,
            retrieveglinfoUrl: null,
            retrievesurveysinfoUrl: null,
            retrievesettingsinfoUrl: null,
            retrievesubscriptioninfoUrl: null,
            tinymceurl: null,
            rsltssurveyselected: null,
            ignatzmodel: null,
            actnewRsltUrl: null,
            surveyiconsmodelurl: null,
            subscribe: null,
            publish: null,
            title: '',
            displayName: '',
            surveyID: -1,
            dataUrl: null,
            hasAppliedBindings: false,
            navpanel: null,
            siconlistpanel: null,
            shomepagespanel: null,
            groupsslideoutcontainer: null,
            smdcontainter: null,
            designtoolscontainer: null,
            appcontexthtml: null,
            logoffurl: null,
            slideouts: null,
            isDisposed: false,
            sendRequest: null
        },
        //#endregion

        xevent: "click.subscriberplatform",

        //#region create
        _create: function () {
            try {
                prweb.Platform = "subscriber";
                if (prweb.IsTouch) {
                    prweb.gestureizer.DesignInitialize();
                    this.xevent = "tap.subscriberplatform";
                    $("#prwebcontentroot").on("touchstart", function () { });
                }
                $("#homecenterpanel").appcntxtviewmgr();
                prweb.logoffurl = this.options.logoffurl;
                this.options.rsltssurveyselected = $(".prwrsltssurveyselected");
                prweb.designersvc.designerresourcesUrl = this.options.designerresourcesUrl;
                this.options.designerresourcesUrl = null;
                prweb.imagesmgrsvc.ImgsMgrGuidStrListURL = this.options.dsgnrimgmgrguildstrlisturl;
                this.options.dsgnrimgmgrguildstrlisturl = null;
                prweb.surveypagenavisvc.SvcOptions.viewhtmlurl = this.options.surveypagenaviUrl;
                prweb.surveymetadatasvc.SurveyMetaDataViewUrl = this.options.surveymetadataviewUrl;
                prweb.rfmsvc.GroupsSlideoutViewUrl = this.options.groupsslideoutviewUrl;
                prweb.sharesurveysvc.retrieveglinfoUrl = this.options.retrieveglinfoUrl;
                prweb.surveysinfosvc.retrievesurveysinfoUrl = this.options.retrievesurveysinfoUrl;
                prweb.settingssvc.settingshomeUrl = this.options.settingshomeUrl;
                prweb.settingssvc.retrievesettingsinfoUrl = this.options.retrievesettingsinfoUrl;
                prweb.subscriptionsvc.subscriptionhomeUrl = this.options.subscriptionhomeUrl;
                prweb.subscriptionsvc.retrievesubscriptioninfoUrl = this.options.retrievesubscriptioninfoUrl;
                this.options.surveymetadataviewUrl = null;
                prweb.surveyiconlistsvc.surveyiconsmodelurl = this.options.surveyiconsmodelurl;
                $('#navpanel').animate({ width: 0 }, { duration: 300, easing: 'easeInQuad' });
                prweb.pubsub.subscribe(prweb.events.appsvc.appsvcinitialized, this._appsvcInitializedHandler, this);
                prweb.appsvc.InitializeAppSvc(); //this ultimately calls surveyiconlistsvc.Initialize...when it is done, then appsvcinit event is raised...
            }
            catch (ex) {
                alert("prweb.subscriberplatform.create reports " + ex.Message);
            }
            return;
        },
        //#endregion

        prwappviewdetached: null,

        //#region subscribeToVSMEvents
        _subscribeToVSMEvents: function () {
            var ps = prweb.pubsub.subscribe;
            ps(prweb.events.appsvc.appcontextchanged, this._appContextChangedHandler, this);
            ps(prweb.events.appsvc.surveycontextchanged, this._surveyContextChangedHandler, this);
            //            ps(prweb.events.appsvc.appsvcinitialized, this._appsvcInitializedHandler, this);
            ps = null;
            return true;
        },
        //#endregion

        //#region appInitializedStuff
        _appInitializedStuff: function () {
            try {
                prweb.panelsmgr.Initialize();
                $('#siconlistpanel').surveyiconlist().css("display", "");
                $('#navpanel').navpanel();
                prweb.flex.viewresizer.resizeAction();
            }
            catch (ex) {
                alert("prweb.subscriberplatform.appInitializedStuff reports " + ex.Message);
            }
            return true;
        },
        //#endregion

        //#region appStartHeartBeat
        _appStartHeartBeat: function () {
            try {
                prweb.subscriberheartbeatsvc.subscriberheartbeatURL = this.options.actnewRsltUrl;
                prweb.subscriberheartbeatsvc.StartHeartBeat();
            }
            catch (ex) {
                alert("prweb.subscriberplatform.appStartHeartBeat reports " + ex.Message);
            }
            return true;
        },
        //#endregion

        //#region populateAppBarBtnHandlers

        _populateAppBarBtnHandlers: function () {
            try {
                //                $("#prwactionsbtn").on(this.xevent, function (e) {
                //                    try {
                //                        e.preventDefault();
                //                        e.stopPropagation();
                //                        e.cancelBubble = true;
                //                        e = null;
                //                        prweb.pubsub.publish(prweb.events.subscriberplatform.actionsbtnclick);
                //                        return false;
                //                    }
                //                    catch (ex) {
                //                        alert("prweb.subscriberplatform.actionsbtnclick reports error..." + ex.Message);
                //                        ex = null;
                //                    }
                //                });

                //                $("#prwpagesbtn").on(this.xevent, function (e) {
                //                    e.preventDefault();
                //                    e.stopPropagation();
                //                    e.cancelBubble = true;
                //                    e = null;
                //                    prweb.pubsub.publish(prweb.events.subscriberplatform.pagesbtnclick);
                //                    return false;
                //                });

                $("#prwmygroupsbtn").on(this.xevent, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    e = null;
                    prweb.pubsub.publish(prweb.events.subscriberplatform.rsltsgroupsbtnclick);
                    return false;
                });

                $("#prwsurveydetailsbtn").on(this.xevent, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    e = null;
                    prweb.pubsub.publish(prweb.events.subscriberplatform.smddetailsbtnclick);
                    return false;
                });

                $("#prwdesigntoolsbtn").on(this.xevent, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    e = null;
                    prweb.pubsub.publish(prweb.events.subscriberplatform.prwdesigntoolsbtn);
                    return false;
                });





                if (prweb.IsTouch) {
                    $("#prwebappbtnbar").scroller({
                        vertical: true,
                        touch: true,
                        items: ".appbarmenu",
                        item: ".appbarmenuitem",
                        inertialbtns: true
                    });
                }
            }
            catch (ex) {
                alert("prweb.subscriberplatform.populateAppBarBtnHandlers reports " + ex.Message);
            }
            return;
        },

        //#endregion

        //#region appsvcInitializedHandler
        _appsvcInitializedHandler: function () {
            try {
                prweb.pubsub.unsubscribe(prweb.events.appsvc.appsvcinitialized, this._appsvcInitializedHandler, this);
                ko.applyBindings(prweb.appsvc.ViewModelx, $("#prwebappbtnbar")[0]);
                //                $("#homecenterpanel").appcntxtviewmgr();
                this._appInitializedStuff();
                this._subscribeToVSMEvents();
                prweb.panelsmgr.OpenPanel("surveyiconlist");
                this._populateAppBarBtnHandlers();
                this._appStartHeartBeat();
                prweb.panelsmgr.CloseAllDelayed();
                $("#prwappviewloading").css("display", "none");
            }
            catch (ex) {
                alert("prweb.subscriberplatform.appsvcInitializedHandler reports " + ex.Message);
            }
            return true;
        },
        //#endregion

        //#region appContextChangedHandler
        _appContextChangedHandler: function (e) {
            var st = setTimeout(function () {
                $("#homecenterpanel").appcntxtviewmgr("manageview");
                e = null;
                clearTimeout(st);
                st = null;
                return true;
            }, 350);

        },
        //#endregion

        //#region populateHcp

        //e.newcontext at this point is an integer,surveyid....suppose e.targeturl could be included...
        //could also do the bbq state.layout stuff here too...
        _populateHcp: function (e) {
            try {
                var appcontext = prweb.appsvc.CurrentAppContext;
                if (e.newcontext) {
                    switch (true) {
                        case (appcontext == 'Results'):
                            prweb.subscriberheartbeatsvc.StopHeartBeat();
                            this._loadResultsSurveyView(e.newcontext); //needs two urls...loads the surveyurl in the callback from the results url...
                            break;
                        case (appcontext == 'Design'):
                            prweb.subscriberheartbeatsvc.StopHeartBeat();
                            //                        prweb.designertextsvc.tinymceurl = this.options.tinymceurl;
                            var isDesignerLoaded = $('#prwdesignerhomeroot').length;
                            if (isDesignerLoaded) {
                                prweb.designersvc.ChangeSurveyContext(e);
                            }
                            else {
                                this._loadDesignerHomeView(e);
                            }
                            isDesignerLoaded = null;
                            break;
                        case (appcontext == "Publish"):
                            this._loadPublishHomeView();
                            break;
                        case (appcontext == "Surveys" || appcontext == "Subscriberhome"):
                            this._loadSurveysHomeView();
                            break;
                        case (appcontext == "Share"):
                            this._loadShareHomeView();
                            break;
                    }
                }
                else {
                    $("#homecenterpanel").appcntxtviewmgr("manageview");
                }
                appcontext = null;
                e = null;
            }
            catch (ex) {
                alert("prweb.subscriberplatform.populateHcp reports " + ex.Message);
            }
            return true;
        },


        //#endregion

        //#region surveyContextChangedHandler
        _surveyContextChangedHandler: function (e) {
            this._populateHcp(e);
            e = null;
            return true;
        },

        //#endregion

        //#region loadDesignerHomeView

        _loadDesignerHomeView: function (newcontext) {
            //            try {
            //                if (prweb.IsTouch) {

            //                    var scr = $("#hcpwrapper").data("scroller");
            //                    if (scr) {
            //                        scr.dispose();
            ////                        alert("subscriberplatform.disposehcpscroller");
            //                    }
            //                    scr = null;
            //                }
            //            }
            //            catch (ex) {
            //                alert("prweb.appcntxtviewmgr.disposehcpscroller reports " + ex.Message);
            //            }
            var myurl = this.options.designerhomeUrl;
            prweb.dataManager.sendRequest({
                url: myurl,
                dataType: 'html',
                type: 'GET',
                success: function (designerhomeviewhtml) {
                    try {
                        $("#homecenterpanel").html("").html(designerhomeviewhtml);
                        designerhomeviewhtml = null;
                        $('#prwdesignerhomeroot').designerhome({ surveycontext: newcontext });
                        newcontext = null;
                    }
                    catch (ex) { alert("prweb.subscriberplatform.loadDesignerHomeView.sendRequest.successhandler reports ... " + ex.toString()); }
                    finally {
                        return true;
                    }
                },
                error: function (ex) {
                    alert("prweb.subscriberplatform.loadDesignerHomeView sendRequest reports ... " + ex.toString());
                    ex = null;
                }
            });
            return true;
        },


        //#endregion

        //#region loadPublishHomeView

        _loadPublishHomeView: function () {
            try {
                var myurl = prweb.surveymodelsvc.PublishViewURL();
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        dataType: 'html',
                        type: 'GET',
                        success: function (viewhtml) {
                            try {
                                $("#homecenterpanel").html("").html(viewhtml);
                                viewhtml = null;
                                myurl = null;
                            }
                            catch (ex) {
                                alert("prweb.subscriberplatform.loadPublishHomeView.successhandler reports ... " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.subscriberplatform.loadPublishHomeView sendRequest reports ... " + e.error().toString());
                            myurl = null;
                            e = null;
                        }
                    });
                }
            }
            catch (ex) {
                alert("prweb.subscriberplatform.loadPublishHomeView reports ... " + ex.Message);
            }
            return true;
        },

        //#endregion

        //#region loadResultsSurveyView

        _loadResultsSurveyHtml: function () {
            try {
                var myurl = prweb.surveymodelsvc.SurveyViewURL();
                prweb.dataManager.sendRequest({
                    url: myurl,
                    dataType: 'html',
                    type: 'GET',
                    success: function (viewhtml) {
                        $("#homecenterpanel").html("").html(viewhtml);
                        viewhtml = null;
                        $("#resultssurveyviewroot").wrap('<div id="subscribersurveyhost"></div>');
                        $("#resultssurveyviewroot").resultsplayer();
                        //                    myhcp = null;
                        myurl = null;
                        return true;
                    },
                    error: function (e) {
                        alert("prweb.subscriberplatform.loadResultsSurveyHtml sendRequest reports ... " + e.toString());
                        myurl = null;
                        e = null;
                    }
                });
            }
            catch (ex) {
                alert("prweb.subscriberplatform.loadSurveysHomeView reports ... " + ex.Message);
            }
            return true;
        },

        _loadResultsSurveyView: function () {
            try {
                prweb.rfmsvc.DisposeResultsViews(); //dispose of results views 
                prweb.rfmsvc.rsltsGrpRFM = false;
                prweb.rfmsvc.CurrentRPSOData = false;
                prweb.actionContext.currentpgnumber = 1;
                prweb.actionContext.currentrsltsallrdentscount = 0;
                prweb.actionContext.currentrsltsurl = 'None';
                prweb.actionContext.currentsurveyname = 'None';
                //            var svyurl = prweb.surveymodelsvc.SurveyViewURL(); //mydollarthis.attr("data-surveyurl"); //all of this should be present in the viewmodel...
                var rsltsurl = prweb.surveymodelsvc.ResultsDataURL(); //mydollarthis.attr("data-rsltsurl"); //all of this should be present in the viewmodel...
                prweb.actionContext.currentrsltsurl = rsltsurl;
                prweb.actionContext.currentsurveyname = prweb.surveymodelsvc.SurveyName()//mydollarthis.attr("data-surveyname"); //all of this should be present in the viewmodel...
                $("#homecenterpanel").html("<div style='margin-left:45%;margin-top:25%;'><p>Loading " + prweb.actionContext.currentsurveyname + "</p></div>");
                var viewhtmlloader = this._loadResultsSurveyHtml;
                prweb.dataManager.sendRequest({
                    url: rsltsurl,
                    success: function (rsltsmodeldata) {
                        try {
                            if (rsltsmodeldata.RPSO) {
                                prweb.actionContext.currentrsltsallrdentscount = rsltsmodeldata.RPSO.AllSurveyRDENTSCount;
                                prweb.rfmsvc.CurrentRPSOData = rsltsmodeldata;
                                prweb.rfmsvc.CurrentRPSOData.RFMGuid = false;
                                prweb.rfmsvc.DefaultResultsURL = prweb.actionContext.currentrsltsurl;
                                prweb.rfmsvc.SdsRespIdDxnry = {};
                                prweb.rfmsvc.populateSDSRespIdDxnry();
                            }
                            else {
                                alert("No Results for This Survey...");
                            }
                            viewhtmlloader();
                        }
                        catch (e) {
                            alert("No Results for This Survey...");
                        }
                        rsltsmodeldata = null;
                        viewhtmlloader = null;

                        return true;
                    },
                    error: function (ex) {
                        alert("prweb.subscriberplatform.loadResultsSurveyView sendRequest reports ... " + ex.toString());
                    }
                });
                rsltsurl = null;
                prweb.pubsub.publish(prweb.events.subscriberplatform.rsltssurveyselected);
            }
            catch (ex) {
                alert("prweb.subscriberplatform.loadResultsSurveyView  reports error " + ex.Message);
                ex = null;
            }

            return true;
        },


        //#endregion

        //#region loadSurveysHomeView

        _loadSurveysHomeView: function () {
            try {
                var myurl = prweb.surveymodelsvc.SurveysInfoViewURL();
                prweb.dataManager.sendRequest({
                    url: myurl,
                    dataType: 'html',
                    type: 'GET',
                    success: function (viewhtml) {
                        $("#homecenterpanel").html("").html(viewhtml);
                        viewhtml = null;
                        $('#surveysinfohomeroot').surveysinfoview();
                        myurl = null;
                        return true;
                    },
                    error: function (e) {
                        alert("prweb.subscriberplatform.loadSurveysHomeView sendRequest reports ... " + e.toString());
                        myurl = null;
                        e = null;
                    }
                });
            }
            catch (ex) {
                alert("prweb.subscriberplatform.loadSurveysHomeView reports ... " + ex.Message);
            }
            return true;
        },

        //#endregion

        //#region loadShareHomeView

        _loadShareHomeView: function () {
            try {
                var myurl = this.options.sharehomeUrl;
                prweb.dataManager.sendRequest({
                    url: myurl,
                    dataType: 'html',
                    type: 'GET',
                    success: function (sharehomeviewhtml) {
                        $("#homecenterpanel").html("").html(sharehomeviewhtml);
                        sharehomeviewhtml = null;
                        $("#sharehomeroot").sharesurveyview();
                        return true;
                    },
                    error: function (e) {
                        alert("prweb.subscriberplatform.loadShareHomeView sendRequest reports ... " + e.toString());
                        myurl = null;
                        e = null;
                    }
                });
            }
            catch (ex) {

            }

            return true;
        },


        //#endregion

        //#region loadSubscriptionHomeView

        _loadSubscriptionHomeView: function () {
            var myurl = this.options.subscriptionhomeUrl;
            //            var myhcp = $("#homecenterpanel");
            //            var dhr = null;
            //            myhcp.unbind().empty();
            prweb.dataManager.sendRequest({
                url: myurl,
                dataType: 'html',
                type: 'GET',
                success: function (viewhtml) {
                    $("#homecenterpanel").html("").html(viewhtml);
                    viewhtml = null;
                    //                    dhr = $('#prwdesignerhomeroot', myhcp).designerhome();
                    //                    dhr = null;
                    //                    myhcp = null;
                    myurl = null;
                    return true;
                },
                error: function (e) {
                    alert("prweb.subscriberplatform.loadSubscriptionHomeView sendRequest reports ... " + e.toString());
                    //                    myhcp = null;
                    myurl = null;
                    e = null;
                }
            });
            return true;
        },

        //#endregion


        _moveToVisualStateRsltsSurveySelected: function () {
            this.options.rsltssurveyselected.css("display", "");
        },

        _moveToVisualStatePublishSurveyIconClick: function () {
            this.options.smddetailsbtn.css("display", "").attr("data-prwlineargradientbrush", "red");
        },

        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    var ps = prweb.pubsub.unsubscribe;
                    ps(prweb.events.appsvc.appcontextchanged, this._appContextChangedHandler, this);
                    ps(prweb.events.appsvc.surveycontextchanged, this._surveyContextChangedHandler, this);
                    ps = null;
                    prweb.panelsmgr.Shutdown();
                    $("#prwebcontentroot").off("touchstart");
                }
                catch (ex) {
                    alert("prweb.subscriberplatform.dispose reports error " + ex.Message);
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
                alert("prweb.subscriberplatform.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
    });
} (this.prweb, jQuery));

//newcontext at this point is an integer,surveyid....suppose this paramobject could include a targeturl...
//        _loadSurveyContextView: function (appcontext, newcontext) {
//            //determine the viewURL to load...and loadit...
//            var targetviewurl = this._findViewUrl(appcontext, newcontext); //figure it out here...
//            //do i always need to load the url...if its the same viewurl...and the view does databinding, shouldn't need to reload the viewurl...if not have findViewUrl return false...
//            if (targetviewurl) {
//                this.options.hcp.unbind().empty();
//                this.options.hcp.load(targetviewurl);
//            }
//            targetviewurl = null;
//            return true;
//        },

//        _findViewUrl: function (appcontext, surveyid) {
//            var rslturl = false;
//            //if there is a xxxviewurldxnry, go to the dxnry with appcontext...get a basurl...add the surveyid to it...
//            // or get urls from surveyiconmodel in surveymodelsvc...
//            //do i always need to load the url...if its the same viewurl...and the view does databinding
//            //maybe...need to look at what stuff the View @model is populating...especially jobjects...they aren't data-bound...
//            //especially jobjects that go back to the server...or retrieve stuff could be a problem...because they have stuff in them already...typically surveyid...
//            switch (true) {
//                case (appcontext == 'Publish'):
//                    rslturl = prweb.surveymodelsvc.PublishViewURL();
//                    break;
////                case (appcontext == 'Surveys'):
////                    rslturl = prweb.surveymodelsvc.SurveysInfoViewURL();
////                    break;
//            }
//            appcontext = null;
//            surveyid = null;
//            return rslturl;
//        },


//        _populateAppViewRootClickHandlers: function () {
//            //            var btn = $("#appdesignnewsurveybtn", this.options.hcp);
//            //            btn.click(function (e) {
//            //                e.stopPropagation();
//            //                e.preventDefault();
//            //                var t = $(this).unbind();
//            //                t = null;
//            //                e = null;
//            //                var papp = prweb.appsvc;
//            //                papp.PopulateSurveyModelContext(-1);
//            //                papp = null;
//            //                return true;
//            //            });
//            //            btn = null;
//            return true;
//        },
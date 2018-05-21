/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.6.4-vsdoc.js" />
(function (prweb, $) {
    prweb.appsvc = (function () {
        var that = {};

        that.IsTouch = false;

        that.renamesurveyurl = null;

        that.SubscriberPlatform = false; //is a reference to the SubscriberPlatform widget...can call widget methods with this...

        //called by surveyiconlistsvc.successhandler for RetrieveSurveyIconModels..
        that.SurveyIconListSvcReady = function () {
            try {
                prweb.pubsub.publish(prweb.events.appsvc.appsvcinitialized); //when this event is published, subscriberplatform does its thing...
            }
            catch (ex) {
                alert("prweb.appsvc.SurveyIconListSvcReady reports " + ex.Message);
            }
            return true;
        };

        that.DesignerSvcReady = function () {
            //            if (that.SubscriberPlatform) {
            //                that.SubscriberPlatform.designersvcInitializedHandler();
            //            }
            return true;
        };

        that.DesignerSvcShutdown = function () {
            //            if (that.SubscriberPlatform) {
            //                that.SubscriberPlatform.designersvcShutdownHandler();
            //            }
            that.populateDesignerItemContext(false);
            that.populateDesignSurveyContext(false);
            return true;
        };

        that.IsReady = false;

        that.InitWindowFrame = function () {
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = (function () {
                    return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                    function ( /* function FrameRequestCallback */callback, /* DOMElement Element */element) {
                        window.setTimeout(callback, 1000 / 60);
                    };
                } ());
            }
        };

        that.InitializeAppSvc = function () {
            try {
                prweb.setUpKOImageBinding();
                that.CurrentAppContext = "Subscriberhome";
                that.InitWindowFrame();
                that.IsTouch = ("ontouchend" in document);
                that.populateVmx();
                that.SubscribetoVmxChanges();
                that.IsReady = true;
                prweb.surveymodelsvc.Initialize();
                that.subscribeToHashChange();
                prweb.surveyiconlistsvc.Initialize();
            }
            catch (ex) {
                alert("prweb.appsvc.InitializeAppSvc reports " + ex.Message);
            }

            return true;
        };

        that.ChangeLayout = function (state) {
            if (!state.layout) {
                that.PopulateAppContext("Subscriberhome");
            }
            else {
                switch (state.layout) {
                    case 'subscriberhome':
                        that.PopulateAppContext("Subscriberhome");
                        break;
                    case 'design':
                        that.PopulateAppContext("Design");
                        that.PopulateSurveyModelContext(state.sid);
                        prweb.actionContext.current = 'Design';
                        break;
                    case 'publish':
                        that.PopulateAppContext("Publish");
                        that.PopulateSurveyModelContext(state.sid);
                        prweb.actionContext.current = 'Publish';
                        break;
                    case 'results':
                        that.PopulateAppContext("Results");
                        that.PopulateSurveyModelContext(state.sid);
                        prweb.actionContext.current = 'Results';
                        break;
                    case 'surveys':
                        that.PopulateAppContext("Surveys");
                        that.PopulateSurveyModelContext(state.sid);
                        prweb.actionContext.current = 'Surveys';
                        break;
                    case 'share':
                        that.PopulateAppContext("Share");
                        that.PopulateSurveyModelContext(state.sid);
                        prweb.actionContext.current = 'Share';
                        break;
                    case 'subscription':
                        that.PopulateAppContext("Subscription");
                        that.PopulateSurveyModelContext(state.sid);
                        prweb.actionContext.current = 'Subscription';
                        break;
                    case 'settings':
                        that.PopulateAppContext("Settings");
                        that.PopulateSurveyModelContext(state.sid);
                        prweb.actionContext.current = 'Settings';
                        break;
                    case 'logoff':
                        that.PopulateAppContext("Logoff");
                        that.PopulateSurveyModelContext(state.sid);
                        prweb.actionContext.current = 'Logoff';
                        break;
                }
            }
        };



        that.requestedState = null;
        that.requestedSurveyContext = null;

        // this method is called by prweb.dialoguemanager.DesignerSaveOnlyHandler....
        that.UnsubscribeToDialogueComplete = function () {

        };
        that.DialogueCompleteHandler = function (dlgrslt) {
            prweb.pubsub.unsubscribe(prweb.events.dialoguemanager.dialoguecomplete, that.DialogueCompleteHandler, that);
            if (dlgrslt != 'cancel') {
                if (that.requestedState) {
                    that.ChangeLayout(that.requestedState);
                }
                else {
                    //i want to this call surveymodelsvc.populateVmx(kodata) if there is kodata...
                    if (that.requestedSurveyContext.skodata) {
                        prweb.surveymodelsvc.populateVmx(that.requestedSurveyContext.skodata);
                    }
                    that.PopulateSurveyModelContext(that.requestedSurveyContext.sid);
                }
            }
            that.requestedState = null;
        };

        that.EvaluateSurveyContextChange = function (surveyid, kodata) {
            var rslt = prweb.dialoguemanager.ShowRequiredDialogues();
            if (rslt) {
                that.requestedSurveyContext = { sid: surveyid, skodata: kodata };
                prweb.pubsub.subscribe(prweb.events.dialoguemanager.dialoguecomplete, that.DialogueCompleteHandler, that);
            }
            else {
                //surveymodelsvc.populateVmx(kodata) if there is kodata...kodata comes from surveyiconlist.surveyiconclickhandler
                if (kodata) {
                    prweb.surveymodelsvc.populateVmx(kodata);
                }
                that.PopulateSurveyModelContext(surveyid); //this causes surveycontextchangedhanler to do its thing...
            }
            return rslt; //prweb.dialoguemanager.ShowRequiredDialogues();
        };

        that.EvaluateContextChangeRequest = function (state) {
            if (prweb.dialoguemanager.ShowRequiredDialogues()) {
                //subscribe to dlgcomplete...if dlgrslt not cancelled, call ChangeLayout(state)
                that.requestedState = state;
                prweb.pubsub.subscribe(prweb.events.dialoguemanager.dialoguecomplete, that.DialogueCompleteHandler, that);
            }
            else {
                that.ChangeLayout(state);
            }
        };

        that.HashchangeHandler = function (e) {
            var state = $.deparam.fragment(true);
            that.EvaluateContextChangeRequest(state);
            return;
        };

        that.subscribeToHashChange = function (e) {
            $(window).on('hashchange.appsvc', that.HashchangeHandler);
        };

        that.populateActiveRDentLight = function (ison) {
            that.ViewModelx.activerdentlight(ison);
            ison = null;
            return true;
        };

        that.populateNewResultsLight = function (ison) {
            that.ViewModelx.newresultslight(ison);
            ison = null;
            return true;
        };

        that.PopulateAppContext = function (newcontext) {
            if (that.IsReady) {
                that.ViewModelx.appcontext(newcontext);
            }
            newcontext = null;
            return true;
        };
        // this method is called by prweb.surveyiconlist.js...in the viewPagesBtnClickHandler...
        that.PopulateSurveyModelContext = function (newsurveyid) {
            if (that.IsReady) {
                that.ViewModelx.surveymodelcontext(newsurveyid);
            }
            newsurveyid = null;
            return true;
        };

        that.CurrentAppContext = "Subscriberhome";
        that.CurrentSurveyContext = false;

        that.DefaultSurveyContext = false;

        that.LastAppContext = "Subscriberhome";
        that.LastSurveyContext = false;

        that.HasSurveyContext = function () {
            var rslt = false;
            if (that.CurrentSurveyContext) {
                var cac = that.CurrentAppContext;
                if (cac == "Results" || cac == "Publish" || cac == "Share" || cac == "Surveys") {
                    rslt = true
                }
                cac = null;
            }
            return rslt;
        };

        that.HasSurveyPagesContext = function () {
            var rslt = false;
            if (that.CurrentSurveyContext) {
                var cac = that.CurrentAppContext;
                if (cac == "Results" || cac == "Design") {
                    rslt = true
                }
                cac = null;
            }
            return rslt;
        };

        that.HasResultsContext = function () {
            var rslt = false;
            if (that.CurrentSurveyContext) {
                var cac = that.CurrentAppContext;
                if (cac == "Results") {
                    rslt = true
                }
                cac = null;
            }
            return rslt;
        };

        that.populateDesignSurveyContext = function (dsc) {
            that.ViewModelx.hasdesignsurveycontext(dsc);
            dsc = null;
            return true;
        };

        that.HasDesignSurveyContext = function () {
            var rslt = false;
            if (prweb.designersvc.CurrentSurveyContext) {
                var cac = that.CurrentAppContext;
                if (cac == "Design") {
                    rslt = true
                }
                cac = null;
            }
            return rslt;
        };



        that.populateDesignerItemContext = function (dic) {
            that.ViewModelx.hasdesigneritemcontext(dic);
            dic = null;
        };

        that.HasDesignerItemContext = function () {
            var rslt = false;
            if (prweb.designersvc.CurrentDesignerItemContext) {
                var cac = that.CurrentAppContext;
                if (cac == "Design") {
                    rslt = true
                }
                cac = null;
            }
            return rslt;
        };


        that.IsPublishContext = function (appcontext) {
            var rslt = false;
            if (appcontext == "Publish") {
                rslt = true
            }
            appcontext = null;
            return rslt;
        };
        that.IsDesignContext = function (appcontext) {
            var rslt = false;
            if (appcontext == "Design") {
                rslt = true
            }
            appcontext = null;
            return rslt;
        };
        that.IsResultsContext = function (appcontext) {
            var rslt = false;
            if (appcontext == "Results") {
                rslt = true
            }
            appcontext = null;
            return rslt;
        };
        that.IsSurveysContext = function (appcontext) {
            var rslt = false;
            if (appcontext == "Surveys") {
                rslt = true
                //                prweb.pubsub.publish(prweb.events.subscriberplatform.appcontextpublish);
            }
            appcontext = null;
            return rslt;
        };


        that.AppContextChangeHandler = function (newvalue) {
            try {
                if (newvalue !== that.CurrentAppContext) {
                    var e = {
                        previouscontext: that.CurrentAppContext,
                        newcontext: newvalue
                    };
                    that.LastAppContext = that.CurrentAppContext;
                    that.CurrentAppContext = newvalue; //before the event is raised for subscribers...
                    if (that.CurrentSurveyContext) {
                        that.DefaultSurveyContext = that.CurrentSurveyContext; //leave the defaultsurvey set to the lastsurvey worked with...regardless of how many times we change appcontext..
                    }
                    that.PopulateSurveyModelContext(false);
                    prweb.pubsub.publish(prweb.events.appsvc.appcontextchanged, e);
                    e = null;
                }
                else {
                    //                alert("appsvc.AppContextChangeHandler sees appcontextChange...but newvalu equals CurrentAppContext...");
                }
                newvalue = null;
                prweb.panelsmgr.ClosePanel("navpanel");
            }
            catch (ex) {
                alert("prweb.appsvc.AppContextChangedHandler reports " + ex.Message);
            }
            return;
        };

        that.SurveyContextChangeHandler = function (newvalue) {
            try {
                if (newvalue !== that.CurrentSurveyContext) {
                    var e = {
                        newcontext: newvalue
                    };
                    that.LastSurveyContext = that.CurrentSurveyContext;
                    that.CurrentSurveyContext = newvalue;
                    that.ViewModelx.hassurveycontext(that.HasSurveyContext());
                    that.ViewModelx.hassurveypagescontext(that.HasSurveyPagesContext());
                    that.ViewModelx.hasresultscontext(that.HasResultsContext());
                    that.ViewModelx.hasdesignsurveycontext(that.HasDesignSurveyContext());
                    that.ViewModelx.hasdesigneritemcontext(that.HasDesignerItemContext());
                    $.bbq.pushState({
                        layout: that.CurrentAppContext.toLowerCase(),
                        sid: that.CurrentSurveyContext,
                        siddf: that.DefaultSurveyContext
                    }, 2);
                    if (newvalue) {
                        //populate survemodelsvc.Vmx with the corresponding surveyiconmodel...
                        prweb.surveyiconlistsvc.PopulateSurveyModelSvcVmx(newvalue);
                    }
                    prweb.pubsub.publish(prweb.events.appsvc.surveycontextchanged, e);
                    e = null;
                }
                newvalue = null;
            }
            catch (ex) {
                alert("prweb.appsvc.AppContextChangedHandler reports " + ex.Message);
            }
            return;
        };

        that.SubscribetoVmxChanges = function () {
            that.ViewModelx.appcontext.subscribe(that.AppContextChangeHandler);
            that.ViewModelx.surveymodelcontext.subscribe(that.SurveyContextChangeHandler);
        };



        that.populateVmx = function () {
            that.ViewModelx = {
                appcontext: ko.observable("SubscriberHome"), // is a string...like Results, Publish etc..
                surveymodelcontext: ko.observable(), //prweb.surveymodelsvc.viewModelx().mysurveymodel,
                myrdentlink: ko.observable(), //prweb.surveymodelsvc.viewModelx().myrdentlink,
                msgfromserver: ko.observable(), //populated in callbacks for ajax calls....
                hassurveycontext: ko.observable(false),
                hassurveypagescontext: ko.observable(false),
                hasresultscontext: ko.observable(false),
                hasdesignsurveycontext: ko.observable(false),
                hasdesigneritemcontext: ko.observable(false),
                activerdentlight: ko.observable(false),
                newresultslight: ko.observable(false),
                ispublishcontext: ko.observable(false),
                isresultscontext: ko.observable(false),
                isdesigncontext: ko.observable(false),
                issurveyscontext: ko.observable(false)
            };
            that.isNewVmx = true;
            //            that.ViewModelx(newvm);
            //            prweb.pubsub.publish(prweb.events.publishsvc.datacontextchanged)
        };

        that.isNewVmx = false; // used by publishsurveyview.js to manage animation visual state...

        that.ViewModelx = {}; // ko.observable();

        that.Shutdown = function () {
            $(window).off('hashchange.appsvc', that.HashchangeHandler);
        };

        //        that.sendChangeSurveyStatusToServer = function (tgtstate, chgpkg, chngstateURL) {
        //            var chngsvystatusurl = chngstateURL; // was populated in view on the server...passed as an option...
        //            var dataToSend = {
        //                changesurveystatepkg: "empty"
        //            };
        //            dataToSend.changesurveystatepkg = chgpkg; // was populated in view on the server...passed as an option...
        //            dataToSend.changesurveystatepkg.TargetState = tgtstate;
        //            dataToSend.changesurveystatepkg.SurveyGuid = that.ViewModelx().mysurveymodel.SurveyGuidString();
        //            dataToSend.changesurveystatepkg.CurrentState = that.ViewModelx().mysurveymodel.SurveyStateID().toString();
        //            var testhis = JSON.stringify(dataToSend);
        //            var dbg = 2;
        //            prweb.dataManager.sendRequest({
        //                url: chngsvystatusurl,
        //                data: testhis,
        //                dataType: 'json',
        //                contentType: 'application/json',
        //                cache: false,
        //                success: function (msgserver) {
        //                    //                    that.ViewModelx().mysurveymodel.SurveyStateID(tgtstate);
        //                    //                    that.ViewModelx().msgfromserver(msgserver);
        //                    //                    prweb.pubsub.publish(prweb.events.publishsvc.datacontextchanged)//do this in the success handler for the ajax call...
        //                },
        //                error: function () {
        //                    alert("prweb.publishsvc.js reports sendChangeSurveyStatusToServer Error ");
        //                }
        //            });
        //        };

        //        that.SendEmailwithRDentLink = function (sendemurl) {
        //            var sendemailurl = sendemurl; //was populated in view on the server...passed as an option..
        //            var dataToSend = {
        //                surveyname: "empty",
        //                linktext: "empty"
        //            };
        //            dataToSend.surveyname = this.ViewModelx().mysurveymodel.SurveyName();
        //            dataToSend.linktext = this.ViewModelx().myrdentlink();
        //            //            prweb.dataManager.sendRequest({
        //            //                url: sendemailurl,
        //            //                data: JSON.stringify(dataToSend),
        //            //                dataType: 'json',
        //            //                contentType: 'application/json',
        //            //                cache: false,
        //            //                success: function (msgserver) {
        //            //                    that.ViewModelx().msgfromserver(msgserver);
        //            //                },
        //            //                error: function () {
        //            //                    alert("prweb.publishsvc.js reports SendEmailwithRDentLink Error ");
        //            //                }
        //            //            });
        //        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
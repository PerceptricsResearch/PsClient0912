(function (prweb, $) {

    $.widget('prweb.vsm', {
        options: {
            layout: 'subscriberhome',
            subscribe: function () { prweb.log('The subscribe option on VSM has not been set'); },
            publish: function () { prweb.log('The publish option on VSM has not been set'); },
            header: null
            //            pinnedSite: null,
            //            charts: null,
            //            header: null,
            //            infoPane: null,
            //            summaryPane: null,
            //            vehicleList: null
        },

        _create: function () {
            //            var state = $.bbq.getState() || {};
            //            state.layout = prweb.appsvc.CurrentAppContext.toLowerCase() || 'subscriberhome';
            //            state.sid = prweb.appsvc.CurrentSurveyContext || false;
            //            state.siddf = prweb.appsvc.DefaultSurveyContext || false;

            // add on helper methods for invoking public methods on widgets...the last parameter is a list of widget names....
//            prweb.setupWidgetInvocationMethods(this, this.options, ['header']);

//            this._subscribeToAppSvcChangeEvents();
//            this._subscribeToHashChange();

            //            if (state && state.layout) {
            //                this._setOption('layout', state.layout);
            //            }
            //            $.bbq.pushState(state, 2);
            //            this._changeLayout(state);
        },

        _subscribeToAppSvcChangeEvents: function () {
            prweb.pubsub.subscribe(prweb.events.appsvc.surveycontextchanged, this._surveyContextChangedHandler, this);
        },

        _surveyContextChangedHandler: function () {

            //            var state = { layout: papp.CurrentAppContext.toLowerCase(),
            //                          sid: papp.CurrentSurveyContext,
            //                          siddf: papp.DefaultSurveyContext
            //            };
            //            state.layout = prweb.appsvc.CurrentAppContext.toLowerCase();
            //            state.sid = prweb.appsvc.CurrentSurveyContext;
            //            state.siddf = prweb.appsvc.DefaultSurveyContext;
            //            var papp = prweb.appsvc;
            var appcntxt = prweb.appsvc.CurrentAppContext.toLowerCase();
            var csmcntxt = prweb.appsvc.CurrentSurveyContext;
            var dsmcntxt = prweb.appsvc.DefaultSurveyContext;
            $.bbq.pushState({
                layout: appcntxt,
                sid: csmcntxt,
                siddf: dsmcntxt
            }, 2);
            appcntxt = null;
            csmcntxt = null;
            dsmcntxt = null;
//            papp = null;
            return true;
        },

        _changeLayout: function (state) {
            //            this._setOption('layout', state.layout || 'subscriberhome');
            //            var papp = prweb.appsvc;
            var popappcntxt = prweb.appsvc.PopulateAppContext;
            var popsmcntxt = prweb.appsvc.PopulateSurveyModelContext;
            if (!state.layout) {
                //                prweb.appsvc.PopulateSurveyModelContext(false);
                popappcntxt("Subscriberhome");
                //                this._header('option', 'title', 'Subscriber Home');
                //                alert("prweb.vsm _changeLayout reports !state.layout.. ");
            }
            else {
                switch (state.layout) {
                    case 'subscriberhome':
                        //                        prweb.appsvc.PopulateSurveyModelContext(state.sid);
                        popappcntxt("Subscriberhome");
                        //                        this._header('option', 'title', 'Subscriber Home');
                        //                    this.options.header.header("_setOption('title', 'New Subscriber Home')");
                        //                    prweb.appsvc.PopulateAppContext("SubscriberHome");
                        //                    this._goToSubscriberHomeLayout();
                        break;
                    case 'design':
                        popappcntxt("Design");
                        popsmcntxt(state.sid);
                        prweb.actionContext.current = 'Design';
                        //                        this._header('option', 'title', 'Design');
                        //                    this._goToDesignLayout();
                        break;
                    case 'publish':
                        popappcntxt("Publish");
                        popsmcntxt(state.sid);
                        prweb.actionContext.current = 'Publish';
                        //                        this._header('option', 'title', 'Publish Home');
                        //                    this._goToPublishLayout();
                        break;
                    case 'results':
                        popappcntxt("Results");
                        popsmcntxt(state.sid);

                        prweb.actionContext.current = 'Results';
                        //                        this._header('option', 'title', 'Results Home');
                        //                    this._goToResultsLayout();
                        break;
                    case 'surveys':
                        popappcntxt("Surveys");
                        popsmcntxt(state.sid);

                        //                        this._header('option', 'title', 'Surveys Home');
                        //                    this._goToSurveysLayout();
                        break;
                    case 'share':
                        popappcntxt("Share");
                        popsmcntxt(state.sid);

                        //                        this._header('option', 'title', 'Share Home');
                        //                    this._goToShareLayout();
                        break;
                    case 'subscription':
                        popappcntxt("Subscription");
                        popsmcntxt(state.sid);

                        //                        this._header('option', 'title', 'Subscription Home');
                        //                    this._goToSubscriptionLayout();
                        break;
                    case 'survey-metatdataview':
                        break;
                }
            }
            state = null;
            popappcntxt = null;
            popsmcntxt = null;
//            papp = null;
            return true;
        },

        _subscribeToHashChange: function () {
            //            var that = this;
            var clf = this._changeLayout;
            $(window).bind('hashchange.vsm', function () {
                //                var state = $.deparam.fragment(true);
                //                that._changeLayout($.deparam.fragment(true));
                clf($.deparam.fragment(true));
                //                state = null;
                return true;
            });
        },


        destroy: function () {
            // will unbind event handlers namespaced with the widget's name
            $.Widget.prototype.destroy.call(this);
        }
    });

} (this.prweb = this.prweb || {}, jQuery));
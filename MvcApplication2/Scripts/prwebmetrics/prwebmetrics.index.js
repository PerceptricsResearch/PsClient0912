/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.index', {

        options: {
            logonurl: false,
            logoffurl: false,
            mktresourceurl: false,
            acctresourceurl: false,
            id: 0
        },

        xevent: "click.index",

        _create: function () {
            var myclass = "index";
            try {
                if (prweb.IsTouch) {
                    try {
                        prweb.gestureizer.DesignInitialize();
                        this.xevent = "tap.index";
                        //                    this._widgetizePinchPanZoom();
                        //                    this._populateSwipeGestureHandler();
                    }
                    catch (ex) {
                        alert("prwebmetrics.index.create.touch reports " + ex.Message);
                    }
                }
                this._populateNavigateBtns(myclass, this.xevent);
                prweb.flex.viewresizer.resizeAction();
                //            prweb.mktmgr.MktResourcesURL = this.options.mktresourceurl;
                //            prweb.mktmgr.AcctResourcesURL = this.options.acctresourceurl;
                //            this._widgetizeMarketingHome();
                //            this._subscribeToHashChange();
            }
            catch (ex) {
                alert("prwebmetrics.index.create reports " + ex.Message);
            }
            return;
        },

        _widgetizeMarketingHome: function () {
            //widgetize what is next from here...
        },



        _populateNavigateBtns: function (myclass, xevent) {
            //            var self = this;
            //            var state = { layout: null };
            //            var newUrlBase = prweb.getBaseUrl();
            var logonurl = this.options.logonurl;
            
            $("#metricscontinuebtn").on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.cancelBubble = true;
                    prweb.showClick(this);
                    //                state.layout = "logon";
                    //                prweb.mktmgr.domaincontext = "logon";
                    var tx = setTimeout(function () {
                        try {
                            window.location = logonurl; //$.param.fragment(newUrlBase, state);
                        }
                        catch (ex) {
                            alert("prwebmetrics.metricsindex.continue.handler reports " + ex.Message);
                        }
                        clearTimeout(tx);
                        tx = null;
                        return;
                    }, 200);
                }
                catch (ex) {
                    alert("prwebmetrics.metricsindex.continue.click reports " + ex.Message);
                }

                return false;
            });
        },

        _changeLayout: function () {
            try {
                var state = $.deparam.fragment(true);
                if (!state.layout) {
                    //                prweb.mktmgr.domaincontext = "home";
                    //                $("#homeindexcontentarea").html(prweb.mktmgr.GetPageHtml(1));
                    //                $("#marketinghometoproot").marketinghome();
                }
                else {
                    //                $("#homeindexcontentarea").html(prweb.mktmgr.GetPageHtml(1));
                    //                switch (state.layout) {
                    //                    case 'home':
                    //                        $("#marketinghometoproot").marketinghome();
                    //                        break;
                    //                    //                    case 'pricing':   
                    //                    ////                        $("#marketingpricingtoproot").marketingpricing();   
                    //                    //                        break;   
                    //                    case 'examples':
                    //                        $("#marketingexamplescontainer").marketingexamples();
                    //                        break;
                    //                }
                }
            }
            catch (ex) {
                alert("prwebmetrics.metricsindex.changeLayout reports " + ex.Message);
            }
            return;

        },

        _subscribeToHashChange: function (e) {
            $(window).on('hashchange.index', this._changeLayout);
        },

        //#region Dispose Destroy

        dispose: function () {
            try {
                $("#metricscontinuebtn").off(this.xevent).html("").remove();
                //                $("#prwebloginbtn").off(this.xevent);
                //                $("#prwebexamplesbtn").off(this.xevent);
            }
            catch (e) {
                alert("prwebmetrics.index.dispose reports error...");
            }
            finally {
                return;
            }
        },

        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }

        //#endregion
    });
} (this.prweb, jQuery));
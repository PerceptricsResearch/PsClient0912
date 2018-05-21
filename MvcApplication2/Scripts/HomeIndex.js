/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.homeindex', {

        options: {
            tinymceurl: false,
            mytextselector: "testmyta99",
            logonurl: false,
            logoffurl: false,
            mktresourceurl: false,
            acctresourceurl: false,
            id: 0
        },

        xevent: "click.homeindex",

        _create: function () {
            var myclass = "homeindex";
            this.xevent = "click.homeindex";
            if (prweb.IsTouch) {
                try {
                    prweb.gestureizer.DesignInitialize();
                    this.xevent = "tap.homeindex";
                    $("#prwebcontentroot").on("touchstart", function () { }); //fixes ios scrolling touch problem that screws with tap events on descendants.
                    //                    this._widgetizePinchPanZoom();prwebcontentroot
                    //                    this._populateSwipeGestureHandler();
                }
                catch (ex) {
                    alert("prweb.homeindex.creat.touch reports " + ex.Message);
                }
            }
            this._populateNavigateBtns(myclass, this.xevent);
            prweb.flex.viewresizer.resizeAction();
            prweb.mktmgr.MktResourcesURL = this.options.mktresourceurl;
            prweb.mktmgr.AcctResourcesURL = this.options.acctresourceurl;
            this._widgetizeMarketingHome();
            this._subscribeToHashChange();
        },

        _widgetizeMarketingHome: function () {
            prweb.mktmgr.DomainPageDxnry.home["1"] = $("#homeindexcontentarea").html(); //save a copy of this html.
            $("#marketinghometoproot").marketinghome();
        },


        //        _addHisaTopScroller: function () {
        //            $(".hisatopitem", "#homeindexcontentscrollableareatop").css("display", "");
        //            if (prweb.IsTouch) {
        //                $("#homeindexcontentscrollableareatop").scroller({
        //                    vertical: false,
        //                    touch: true,
        //                    items: ".hisatopitemscontainer",
        //                    item: ".hisatopitem",
        //                    inertialbtns: true
        //                });
        //            }
        //            else {
        //                $("#homeindexcontentscrollableareatop").css("overflow", "auto");
        //            }
        //        },
        //        _showClick: function (btn) {
        //            var $btn = $(btn);
        //            $btn.css("background", "rgba(180,120,1,0.8)");
        //            var xbtn = function () {
        //                $btn.css("background", "");
        //            };
        //            var tov = setTimeout(xbtn, 200);

        //        },

        _populateNavigateBtns: function (myclass, xevent) {
            //            var self = this;
            var state = { layout: null };
            var newUrlBase = prweb.getBaseUrl();
            $("#prwebhomebtn").on(this.xevent, function (e) {
                e.originalEvent.cancelBubble = true;
                prweb.showClick(this);
                state.layout = "home";
                prweb.mktmgr.domaincontext = "home";
                window.location = $.param.fragment(newUrlBase, state);
                return false;
            });
            $("#prwebpricingbtn").on(this.xevent, function (e) {
                e.originalEvent.cancelBubble = true;
                prweb.showClick(this);
                state.layout = "pricing";
                prweb.mktmgr.domaincontext = "pricing";
                window.location = $.param.fragment(newUrlBase, state);
                return false;
            });
            $("#prwebcasestudiewbtn").on(this.xevent, function (e) {
                e.originalEvent.cancelBubble = true;
                prweb.showClick(this);
                state.layout = "cases";
                prweb.mktmgr.domaincontext = "cases";
                window.location = $.param.fragment(newUrlBase, state);
                return false;
            });
            $("#prwebexamplesbtn").on(this.xevent, function (e) {
                e.originalEvent.cancelBubble = true;
                prweb.showClick(this);
                state.layout = "examples";
                prweb.mktmgr.domaincontext = "examples";
                window.location = $.param.fragment(newUrlBase, state);
                return false;
            });
            $("#prwebsignupbtn").on(this.xevent, function (e) {
                e.originalEvent.cancelBubble = true;
                prweb.showClick(this);
                state.layout = "signup";
                prweb.mktmgr.domaincontext = "signup";
                window.location = $.param.fragment(newUrlBase, state);
                return false;
            });
            $("#prwebloginbtn").on(this.xevent, function (e) {
                e.originalEvent.cancelBubble = true;
                prweb.showClick(this);
                state.layout = "logon";
                prweb.mktmgr.domaincontext = "logon";
                var uri = $.param.fragment(newUrlBase, state);
//                var nurl = window.location.toString().replace("http", "https");
                window.location.href = uri; //nurl + "Account/Logon"; // +uri;
                return false;
            });
        },

        _changeLayout: function () {
            var state = $.deparam.fragment(true);
            if (!state.layout) {
                prweb.mktmgr.domaincontext = "home";
                $("#homeindexcontentarea").html(prweb.mktmgr.GetPageHtml(1));
                $("#marketinghometoproot").marketinghome();
            }
            else {
                $("#homeindexcontentarea").html(prweb.mktmgr.GetPageHtml(1));
                switch (state.layout) {
                    case 'home':
                        $("#marketinghometoproot").marketinghome();
                        break;
                    //                    case 'pricing':    
                    ////                        $("#marketingpricingtoproot").marketingpricing();    
                    //                        break;    
                    case 'examples':
                        $("#marketingexamplescontainer").marketingexamples();
                        break;
                }
            }
            return;
        },

        //        _hashChangeHandler: function (e) {
        //            var state = $.deparam.fragment(true);
        //            this._changeLayout(state);
        //            return true;
        //        },

        _subscribeToHashChange: function (e) {
            $(window).on('hashchange.homeindex', this._changeLayout);
        },

        //#region Dispose Destroy

        dispose: function () {
            try {
                $(".homeindex").unbind().html("").remove();
                $("#prwebloginbtn").off(this.xevent);
                $("#prwebexamplesbtn").off(this.xevent);
                $("#prwebcontentroot").off("touchstart");
            }
            catch (e) {
                alert("prweb.homeindex.dispose reports error...");
            }
            finally {
                return true;
            }
        },

        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }

        //#endregion
    });
} (this.prweb, jQuery));

//$(function (prweb) {
//    // initialize scrollable with mousewheel support
////    $(".scrollable").scrollable({ vertical: true, mousewheel: true });

//});



 
   

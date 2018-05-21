/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.mktmgr = (function () {
        var that = {};

        that.domaincontext = "home";

        that.DomainURLColxn = {};


        //used by marketingsvc to get some html...for the current domaincontext...
        //the actual html is in prweb.data.dataManager...at a url...
        that.RetrieveDomainURLs = function () {
            var rslt = false;
            // use that.domaincontext to get to the DomainURLColxn[that.domaincontext]
            //set prweb.marketingsvc.NxtPgURL to domainurl for firstpage...

            return rslt;
        };

        that.MktResourcesURL = false;
        that.MktResources = {
            templateslistURL: false
        };

        that.AcctResourcesURL = false;

        that.DomainPageDxnry = {
            home: {},
            examples: {},
            cases: {},
            about: {},
            pricing: {},
            signup: {},
            passwdchng: {},
            logon: {}
        };

        that.MarketingHomeHtml = false;

        that.GetPageHtml = function (pgnum) {
            var rslt = "<p>loading page...</p>";
            try {
                var dc = that.domaincontext;
                var pghtml = that.DomainPageDxnry[dc][pgnum] || false;
                if (pghtml) {
                    rslt = pghtml;
                }
                pghtml = null;
                dc = null;
            }
            catch (ex) {
                alert("prweb.mktmgr.GetPageHtml reports " + ex.Message)
            }
            return rslt;
        }

        that.RetrieveAcctResources = function () {
            //gets a bunch of html just like appcontextviewmanager...
            try {
                var mktrscurl = that.AcctResourcesURL;
                prweb.dataManager.sendRequest({
                    url: mktrscurl,
                    success: function (jsonresources) {
                        that.DomainPageDxnry.signup["1"] = jsonresources.signup;
                        that.DomainPageDxnry.passwdchng["1"] = jsonresources.passwdchng;
                        that.DomainPageDxnry.logon["1"] = jsonresources.logon;
                        $("#prwebloginbtn").css("display", "");
                        $("#prwebsignupbtn").css("display", "");
                    },
                    error: function (e) {
                        alert('prweb.mktmgr.RetrieveAcctResources.sendRequest reports error...' + e.toString());
                    }
                });
            }
            catch (ex) {
                alert("prweb.mktmgr.RetrieveAcctResources reports " + ex.Message);
            }
        };

        that.RetrieveMarketingResources = function () {
            //gets a bunch of html just like appcontextviewmanager...
            try {
                var mktrscurl = that.MktResourcesURL;
                prweb.dataManager.sendRequest({
                    url: mktrscurl,
                    success: function (jsonresources) {
                        that.DomainPageDxnry.home["2"] = jsonresources.homepage1;
                        that.DomainPageDxnry.home["3"] = jsonresources.homepage2;
                        that.DomainPageDxnry.examples["1"] = jsonresources.examples;
                        that.DomainPageDxnry.about["1"] = jsonresources.about;
                        that.DomainPageDxnry.pricing["1"] = jsonresources.pricing;
                        that.DomainPageDxnry.cases["1"] = jsonresources.cases;
                        $("#prwebpricingbtn").css("display", "");
                        $("#prwebcasestudiewbtn").css("display", "");
                        $("#prwebexamplesbtn").css("display", "");
                        that.MktResources.templateslistURL = jsonresources.templatesUrl;
                        that.RetrieveAcctResources();
                    },
                    error: function (e) {
                        alert('prweb.mktmgr.RetrieveMarketingResources.sendRequest reports error...' + e.toString());
                    }

                });
            }
            catch (ex) {
                alert("prweb.mktmgr.RetrieveMarketingResources reports " + ex.Message);
            }
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
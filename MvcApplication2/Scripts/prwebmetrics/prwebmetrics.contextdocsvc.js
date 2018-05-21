/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.contextdocsvc = (function () {
        var that = {};

        that.Dashboard = false;

        that.Vmx = {
            message: ko.observable(),
            dbxisAuthenticated: ko.observable(false),
            dbxclient: new Dropbox.Client({
                key: "28qj9b5c81p7tuq"
            }),
            authenticate: function () {
                var rslt = false;
                try {
                    this.dbxclient.authenticate({
                        interactive: false
                    },
                    function (error) {
                        if (error) {
                            //?whats this here..
                            alert("Dropbox could not authenticate your account.");
                            //                            that.Vmx.message("Dropbox could not authenticate your account.");
                        }
                        //                        return;
                    });
//                    rslt = this.dbxclient.isAuthenticated();
                }
                catch (ex) {
                    alert("prwebmetrics.contextdocsvc..Vmx.authenticate reports " + ex.Message);
                }
                return rslt;
            },
            dispose: function () {
                try {

                }
                catch (ex) {
                    alert("prwebmetrics.contextdocsvc.Vmx.dispose reports " + ex.Message);
                }
                return;
            }
        };


        that.SaveContextDoc = function () {
            var rslt = false;
            try {
                rslt = true;
            }
            catch (ex) {
                alert("prwebmetrics.contextdocsvc.SaveContextDoc reports " + ex.Message);
            }
            return rslt;
        };

        that.RetrieveAvailableContextInfos = function (contextselbmsk) {
            var rslt = [];
            try {
                if (that.Vmx.dbxisAuthenticated()) {
                    //populate Vmx.colxns from dbx tables queries....
                    //this svc has ContextDocInfos and ContextDocDataStreams...this method returns Infos...
                    //rslt gets a bunch of stuff pushed here?
                }
            }
            catch (ex) {
                alert("prwebmetrics.contextdocsvc.RetrieveAvailableContextInfos reports " + ex.Message);
            }
            return rslt;
        };

        that.Initialize = function () {
            try {
                that.Vmx.authenticate(); //var authrslt = 
//                var rslt = that.Vmx.dbxclient.isAuthenticated();
//                that.Vmx.dbxisAuthenticated(authrslt);
//                var testthis = 2;
            }
            catch (ex) {
                alert("prwebmetrics.contextdocsvc.Initialize reports " + ex.Message);
            }
            return;
        };

        return that;

    } ());
} (this.prweb = this.prweb || {}, jQuery));
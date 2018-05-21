/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.marketingsvc = (function () {
        var that = {};

        that.actionContext = {
            currentpgnumber: 0
        };

        that.PriorPageNumber = 0;

        that.PageCount = 3;

        that.MyPages = false;

        that.NxtPgUrl = false;

        that.Vmx = {
            sdxnry: null,
            currentpgnum: ko.observable(1)
        };

        that.ToNdx = function (pgNumber) {
            var rslt = ((pgNumber - 1) % 3); // 3 could sapiindexdxnry.lengthcount...
            return rslt;
        };

        that.CurrentNdx = function () {
            var pgnum = that.actionContext.currentpgnumber;
            var ndx = that.ToNdx(parseInt(pgnum));
            return ndx;
        };

        // associative dxnry of SapiNdx and PageNumber...
        that.SapiIndexDxnry = ko.observableArray(); //{ "0": 1, "1": false, "2": false, "3": false, "4": false };

        // asociate dxnry of PageNumber and SapiNdxObject...is populated by the sendRequest:callback that loads html into sapi.prwpageitem...
        // if there is a 
        that.PageNumberDxnry = ko.observableArray();

        that.PutPageHTMLinSapiItem = function (pageumber, sentry) {
            var rslt = false;
            try {
//                var pgnstr = pageumber.toString();
//                var piorpgnum = sentry.priorpgnum; //pgnumber of what is in sapiItem(sndx) now...
//                if (piorpgnum) {
//                    // if there is a page in sapitiem, detach the pageobj from MyPages and put it in PageNumberDxnry pageobj...
//                    //only do this if the PageDxnry.pageobj is false/empty...gets set to false when intialized and when put in the SapiItem...
//                    if (!(that.PageNumberDxnry[piorpgnum].pgobj())) {
//                        var sentrypriopageobj = sentry.pgobj()//this is an unwrapped object...use it...don't need detach...
//                        if (sentrypriopageobj) {
//                            sentry.pgobj = ko.observable(false); //could do the insert stuff here...
//                            var pgentry = that.PageNumberDxnry[piorpgnum]();
//                            pgentry.pgobj = ko.observable(sentrypriopageobj);
//                            that.PageNumberDxnry[piorpgnum] = pgentry; //the unwrapped pgentry object with a a new pgobj observable with html...
//                        }
//                    }
//                }
                //put PageDxnry(pagenumber).pageobj() in sapitem(sndx)
                var pgobjisloaded = that.PageNumberDxnry[pageumber].isloaded(); // this is unwrapped pgobj...the result from jquery.detach...or html from server...
                if (pgobjisloaded) {
                    sentry.pgobj(that.PageNumberDxnry[pageumber].pgobj());
                }
                else {
                    //pgobj is not yet loaded...subscribe to that.PageNumberDxnry[PageNumber].pgobj change...
                    var pgobjsubscription = null;
                    pgobjsubscription = that.PageNumberDxnry[pageumber].pgobj.subscribe(function (pgcontent) {
                        sentry.pgobj(pgcontent);
                        pgobjsubscription.dispose();
                    });
                    sentry.pgobj("<p>...loading...</p>");
                }
            }
            catch (ex) {
                alert("prweb.marketingsvc.PutPageHTMLinSAPiItem reports " + ex.Message);
            }
            return rslt;
        };

        that.InitializeSapiItemsDxnry = function () {
            var makedxnryrow = function (kvp) {
                var sapientry = {
                    pgnum: ko.observable(false),
                    pgobj: ko.observable(false),
                    onpgnumchange: null,
                    changepgnum: null,
                    priorpgnum: false
                };
                that.SapiIndexDxnry[kvp] = sapientry;
                var self = sapientry;
                sapientry.onpgnumchange = function (newpgnum) {
                    that.PutPageHTMLinSapiItem(newpgnum, self);
                    //                    var dbx = self.pgobj();
                    return true;
                };
                sapientry.changepgnum = function (newpgnum) {
                    self.priorpgnum = self.pgnum();
                    self.pgnum(newpgnum);
                    return true
                };
                self.pgnum.subscribe(self.onpgnumchange);
                return true // this gives me a viewmodel with properties named 1, 2, 3, 4...for each 
            };
            var rslt = false;
            try {
                Enumerable.RangeTo(0, 2).ForEach(function (kvp) { return makedxnryrow(kvp.toString()) });
                that.Vmx.sdxnry = that.SapiIndexDxnry;
                rslt = true;
            }
            catch (ex) {
                alert("prweb.marketingsvc.InitializeSapiItemsDxnry reports " + ex.Message);
            }
            return rslt;
        };


        that.InitializePageDxnry = function () {
            var makedxnryrow = function (kvp) {
                var pageentry = {
                    isloaded: ko.observable(false), //isloaded is true for testing...
                    pgobj: ko.observable(false),
                    pgnum: kvp,
                    retrievePage: null
                };
                var self = pageentry;
                //                var pgurl = that.CraftPageUrl(kvp); //this has to go to prweb.mktmgr to find a url
                pageentry.retrievePage = function () {
                    var rslt = false;
                    if (!self.isloaded()) {
                        var pghtml = prweb.mktmgr.GetPageHtml(self.pgnum);
                        self.pgobj(pghtml);
                        self.isloaded(true);
                        rslt = true;
                        //                        var myurl = pgurl;
                        //                        var xdbg = 2;
                        //                        if (myurl) {
                        //                            prweb.dataManager.sendRequest({
                        //                                url: myurl,
                        //                                dataType: "html",
                        //                                success: function (htmldata) {
                        //                                    self.pgobj(htmldata);
                        //                                    self.isloaded(true);
                        //                                    rslt = true;
                        //                                },
                        //                                error: function (e) {
                        //                                    alert('prweb.marketingsvc.pageentry.retrievepage reports error...' + e.toString());
                        //                                }
                        //                            });
                        //                        }
                    }
                    else {
                        rslt = true;
                    }
                    return rslt;
                };
                that.PageNumberDxnry[kvp] = pageentry;
                return true // this gives me a viewmodel PageNumberDxnry[x].isloaded(), .pgobj()......
            };
            if (that.PageCount > 0) {
                Enumerable.RangeTo(1, that.PageCount).ForEach(function (kvp) { return makedxnryrow(kvp.toString()) });
            }
            return true
        };

        that.PopulatePgEntryPageObj = function (pgnum) {
            //this is called by ConfigureCurrentSapiItem...
            var rslt = false
            try {
                if (pgnum <= that.PageCount) {
                    if (that.PageNumberDxnry[pgnum].retrievePage()) {
                        rslt = true;
                    }
                }
                else {
                    rslt = true;
                }
            }
            catch (ex) {
                alert("prweb.marketingsvc.PopulatePgEntryPageObj reports " + ex.Message);
            }
            return rslt;
        };

        that.Initialize = function (pgcount) {
            try {
                that.PageCount = pgcount;
                that.InitializeSapiItemsDxnry();
                that.InitializePageDxnry();
                if (pgcount > 1) {
                    that.PopulatePgEntryPageObj(1);
                };
            }
            catch (ex) {
                alert("prweb.marketingsvc.Initialize reports " + ex.Message);
            }
        };

        that.PublishPageChangeEvents = function () {
            var newpgnum = that.actionContext.currentpgnumber;
            var priorpgnumber = that.PriorPageNumber;
        };

        that.ConfigureCurrentSapiItem = function (curpgnum) {
            //this is called by PopulateCurrentPageNumber...
            // changing SapiDxnry[ndx].pgnum causes it onpgnumchangehandler to fire...configures its pgobj....see InitializeSapiItemsDxnry and PutPageHTMLinSapiItem
            var rslt = false;
            try {
                rslt = that.PopulatePgEntryPageObj(curpgnum);
                rslt = that.SapiIndexDxnry[that.ToNdx(curpgnum)].changepgnum(curpgnum);
            }
            catch (ex) {
                alert("prweb.marketingsvc.ConfigureCurrentSapiItem reports " + ex.Message);
            }
            return rslt;
        };

        that.ConfigureSurroundingPages = function (curpgnum) {
            that.PopulatePgEntryPageObj(curpgnum + 1)
        };

        that.PopulateCurrentPageNumber = function (newpgnum) {
            //this is called by OnBeforeSeekHAndler...
            var rslt = that.ConfigureCurrentSapiItem(newpgnum);
            var priorpgnumber = that.actionContext.currentpgnumber;
            that.PriorPageNumber = priorpgnumber;
            that.actionContext.currentpgnumber = newpgnum;
            return rslt;
        };


        //that.NxtPgUrl needs to already reflect the domaincontext...
        that.CraftPageUrl = function (pgnum) {
            var rslt = false;
            try {
                var adjustpgnum = pgnum - 1
                var npURL = that.NxtPgUrl;
                if (npURL) {
                    var arrpgn = npURL.split("pgNumber=");
                    var pgn = arrpgn[1];
                    var oldpgparm = "pgNumber=" + pgn;
                    var newpgparm = "pgNumber=" + (adjustpgnum.toString());
                    rslt = npURL.replace(oldpgparm, newpgparm);
                }
            }
            catch (ex) {
                alert("prweb.marketingsvc.CraftPageUrl reports " + ex.Message);
            }

            return rslt;
        };



        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
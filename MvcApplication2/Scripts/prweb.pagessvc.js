/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.pagessvc = (function () {
        var that = {};

        that.Vmx = {
            sdxnry: null,
            currentpgnum: ko.observable(1)
        };

        that.CurrentNdx = function () {
            var pgnum = prweb.actionContext.currentpgnumber;
            var ndx = that.ToNdx(parseInt(pgnum));
            return ndx;
        };

        that.PageCount = 1;
        that.MyPages = false;

        that.Initialize = function (pgcount) {
            that.PageCount = pgcount;
            that.InitializeSapiItemsDxnry();
            that.InitializePageDxnry();
            if (pgcount > 1) {
                that.PopulatePgEntryPageObj(2);
            }
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
            Enumerable.RangeTo(0, 4).ForEach(function (kvp) { return makedxnryrow(kvp.toString()) });
            that.Vmx.sdxnry = that.SapiIndexDxnry;
            return true
        };

        that.InitializePageDxnry = function () {
            var makedxnryrow = function (kvp) {
                var pageentry = {
                    isloaded: ko.observable(false),
                    pgobj: ko.observable(false),
                    retrievePage: null
                };
                var self = pageentry;
                var pgurl = that.CraftPageUrl(kvp);
                pageentry.retrievePage = function () {
                    var rslt = false;
                    if (!self.isloaded()) {
                        var myurl = pgurl;
                        var xdbg = 2
                        prweb.dataManager.sendRequest({
                            url: myurl,
                            dataType: "html",
                            success: function (htmldata) {
                                self.pgobj(htmldata);
                                self.isloaded(true);
                                rslt = true;
                            },
                            error: function (e) {
                                alert('prweb.pagessvc.pageentry.retrievepage reports error...' + e.toString());
                            }
                        });
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

        // associative dxnry of SapiNdx and PageNumber...
        that.SapiIndexDxnry = ko.observableArray(); //{ "0": 1, "1": false, "2": false, "3": false, "4": false };

        // asociate dxnry of PageNumber and SapiNdxObject...is populated by the sendRequest:callback that loads html into sapi.prwpageitem...
        // if there is a 
        that.PageNumberDxnry = ko.observableArray();

        that.ToNdx = function (pgNumber) {
            var rslt = ((pgNumber - 1) % 5); // 5 could sapiindexdxnry.lengthcount...
            return rslt;
        };

        // I want this to be fire and forget...put the right pgobj in the sentry....and when it gets populated by ajax.success callback, all is ok...
        // so replace the sentry.pgobj observable with PageDxnry.pgobj observable with the...don't set the observable, replace it...so now the sentry
        // is looking for the stuff that the pgobj was looking for if it was being asynch loaded somewhere... 
        that.PutPageHTMLinSapiItem = function (PageNumber, sentry) {
            //this is the onchangepgnum eventhandler in sapientry...sentry is the passed object instance...
            // is only called when sentry.pgnum changes...
            var rslt = false;
            var pgnstr = PageNumber.toString();
            //            var sndx = that.ToNdx(PageNumber);
            var piorpgnum = sentry.priorpgnum; //pgnumber of what is in sapiItem(sndx) now...
            if (piorpgnum) {
                // if there is a page in sapitiem, detach the pageobj from MyPages and put it in PageNumberDxnry pageobj...
                //only do this if the PageDxnry.pageobj is false/empty...gets set to false when intialized and when put in the SapiItem...
                if (!(that.PageNumberDxnry[piorpgnum].pgobj())) {
                    var sentrypriopageobj = sentry.pgobj()//this is an unwrapped object...use it...don't need detach...
                    if (sentrypriopageobj) {
                        // detach the page from the sentry, and put it back in the PageDxnry....
                        //                        var detachedpgobj = that.MyPages.eq(sndx).children().eq(0).detach(); //this may need to be a different function...not sure we have that...
                        sentry.pgobj = ko.observable(false); //could do the insert stuff here...
                        var pgentry = that.PageNumberDxnry[piorpgnum]();
                        pgentry.pgobj = ko.observable(sentrypriopageobj);
                        that.PageNumberDxnry[piorpgnum] = pgentry; //the unwrapped pgentry object with a a new pgobj observable with html...
                    }
                }
            }
            //put PageDxnry(pagenumber).pageobj() in sapitem(sndx)
            var pgobjisloaded = that.PageNumberDxnry[PageNumber].isloaded(); // this is unwrapped pgobj...the result from jquery.detach...or html from server...
            if (pgobjisloaded) {
                sentry.pgobj(that.PageNumberDxnry[PageNumber].pgobj());
                // this may require 
                //                var pgentry = that.PageNumberDxnry[pgnstr];
                //                pgentry.pgobj = ko.observable(false);
                //                that.PageNumberDxnry[pgnstr] = pgentry;
                //                    that.PageNumberDxnry[pgnstr].pageobj = ko.observable(false); //don't want the pgobj in two places...replaces observable with a brand new one...
            }
            else {
                //pgobj is not yet loaded...subscribe to that.PageNumberDxnry[PageNumber].pgobj change...
                var pgobjsubscription = null;
                pgobjsubscription = that.PageNumberDxnry[PageNumber].pgobj.subscribe(function (pgcontent) {
                    sentry.pgobj(pgcontent);
                    pgobjsubscription.dispose();
                });
                sentry.pgobj("<p>...loading...</p>");
            }
            return rslt;
        }

        that.ChangeSapiEntryPgNum = function (sendx, pgnumber) {
            that.SapiIndexDxnry[sendx].changepgnum(pgnumber);
            return true;
        };

        that.NxtPgUrl = false;
        that.CraftPageUrl = function (pgnum) {
            var rslt = false;
            var adjustpgnum = pgnum - 1
            var npURL = that.NxtPgUrl;
            var arrpgn = npURL.split("pgNumber=");
            var pgn = arrpgn[1];
            var oldpgparm = "pgNumber=" + pgn;
            var newpgparm = "pgNumber=" + (adjustpgnum.toString());
            rslt = npURL.replace(oldpgparm, newpgparm);
            return rslt;
        };

        that.PriorPageNumber = 0;

        that.PublishPageChangeEvents = function () {
            var newpgnum = prweb.actionContext.currentpgnumber;
            var priorpgnumber = that.PriorPageNumber;
            prweb.pubsub.publish("pcv_iscurrentpage_" + newpgnum, newpgnum);
            prweb.pubsub.publish(prweb.events.subscriberplatform.surveycurrentpagechanged, newpgnum);
            prweb.pubsub.publish(prweb.events.subscriberplatform.scrolltopage, newpgnum);
            prweb.pubsub.publish("pcv_notcurrentpage_" + priorpgnumber, priorpgnumber);
        };

        that.PopulateCurrentPageNumber = function (newpgnum) {
            //this is called by OnBeforeSeekHAndler...
            var rslt = that.ConfigureCurrentSapiItem(newpgnum);
            //            that.Vmx.currentpgnum(newpgnum);//for showing currentpagenumber with a binding....
            var priorpgnumber = prweb.actionContext.currentpgnumber;
            that.PriorPageNumber = priorpgnumber;
            prweb.actionContext.currentpgnumber = newpgnum;
            //            prweb.pubsub.publish("pcv_iscurrentpage_" + newpgnum, newpgnum);
            //            prweb.pubsub.publish(prweb.events.subscriberplatform.surveycurrentpagechanged, newpgnum);
            //            prweb.pubsub.publish(prweb.events.subscriberplatform.scrolltopage, newpgnum);
            //            prweb.pubsub.publish("pcv_notcurrentpage_" + priorpgnumber, priorpgnumber);
            return rslt;
        };

        that.ConfigureCurrentSapiItem = function (curpgnum) {
            //this is called by PopulateCurrentPageNumber...
            // changing SapiDxnry[ndx].pgnum causes it onpgnumchangehandler to fire...configures its pgobj....see InitializeSapiItemsDxnry and PutPageHTMLinSapiItem
            var rslt = that.PopulatePgEntryPageObj(curpgnum);
            rslt = that.SapiIndexDxnry[that.ToNdx(curpgnum)].changepgnum(curpgnum);
            return rslt;
        };

        that.PopulatePgEntryPageObj = function (pgnum) {
            //this is called by ConfigureCurrentSapiItem...
            var rslt = false
            if (pgnum <= that.PageCount) {
                if (that.PageNumberDxnry[pgnum].retrievePage()) {
                    rslt = true;
                }
            }
            else {
                rslt = true;
            }
            return rslt;
        };


        //        that.BeforeSeekHandler = function (event, i) {
        //            var rslt = false;
        //            //I am an eventhandler in scrllapi...this = scrllapi..
        //            if (this.isscrollto) {
        //                //the issscrollto method...surveyview.navigatetopgnumber...sets scrolltoTargetPgNum..
        //                this.isscrollto = false;
        //                if (this.scrolltoTargetPgNum <= this.prwpgcount) {
        //                    rslt = true;
        //                    this.prwcurrentpage = this.scrolltoTargetPgNum;
        //                }
        //            }
        //            else {
        //                var curndx = this.getIndex(); //is the position of scrllapi
        //                this.isPrev = (i < curndx);
        //                this.isNext = (i > curndx);
        //                if (curndx == 4 && i == 0) {
        //                    this.isNext = true;
        //                    this.isPrev = false;
        //                }
        //                else if (curndx == 0 && i == 4) {
        //                    this.isNext = false;
        //                    this.isPrev = true;
        //                }
        //                if (this.isNext) {
        //                    if (this.prwcurrentpage < this.prwpgcount) {
        //                        rslt = true;
        //                    }
        //                    this.prwcurrentpage = Math.min(this.prwpgcount, this.prwcurrentpage + 1);
        //                }
        //                else if (this.isPrev) {
        //                    if (this.prwcurrentpage > 0) {
        //                        rslt = true;
        //                    }
        //                    this.prwcurrentpage = Math.max(1, this.prwcurrentpage - 1);
        //                }
        //            }
        //            var xxrslt = prweb.pagessvc.PopulateCurrentPageNumber(this.prwcurrentpage);
        //            return rslt;
        //        };

        that.ConfigureSurroundingPages = function (curpgnum) {
            that.PopulatePgEntryPageObj(curpgnum + 1)
        };

        //        that.AfterSeekHandler = function (event, i) {
        //            var rslt = true;
        //            //I am an eventhandler in scrllapi...this = scrllapi..
        //            //change surrounding SapiEntryPgNums...
        //            if (this.isPrev) {
        //                //change surrounding SapiEntryPgNums...
        //            }
        //            else if (this.isNext) {
        //                //change surrounding SapiEntryPgNums...
        //                that.ConfigureSurroundingPages(this.prwcurrentpage)
        //            }
        //            if (this.prwcurrentpage !== this.prwpgcount) {
        //                this.prwnxtbtn.css("display", "");
        //            }
        //            else {
        //                this.prwnxtbtn.hide();
        //            }
        //            if (this.prwcurrentpage == 1) {
        //                this.prwprevbtn.hide();
        //            }
        //            else {
        //                this.prwprevbtn.css("display", "");
        //            }
        //            return rslt;
        //        };

        //        that.NavigateNext = function () {

        //        };

        //        that.NavigatePrev = function () {

        //        };

        //        that.NavigateToPgNum = function (pgnum) {

        //        };


        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
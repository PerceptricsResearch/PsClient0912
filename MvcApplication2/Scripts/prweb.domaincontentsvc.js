/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.domaincontentsvc = (function () {
        var that = {};

        //is populated by  rdentplatform.create...dxnry comes in on the view as a json object...
        that.DomainDxnry = false;

        that.NewDRObservablePage = function (name, pagenum) {
            var pageentry = {
                html: ko.observable("<div>Loading...</div>"),
                retrievePage: null,
                IsUrl: false,
                Url: false,
                Dispose: null
            };
            pageentry.retrievePage = function () {
                try {
                    var myurl = pageentry.Url;
                    if (myurl) {
                        prweb.dataManager.sendRequest({
                            url: myurl,
                            cache: false,
                            success: function (pagehtml) {
                                try {
                                    pageentry.html(pagehtml);
                                    pageentry.IsUrl = false;
                                }
                                catch (ex) {
                                    alert("prweb.domaincontentsvc.pageentry.retrievePage.successhandler reports " + ex.Message);
                                }
                            },
                            error: function (e) {
                                alert("prweb.domaincontentsvc.pageentry.retrievePage.sendRequest reports error..." + e.toString());
                            }
                        });
                    }

                }
                catch (ex) {
                    alert("prweb.domaincontentsvc.pageentry.retrievePage reports " + ex.Message);
                }
                return;
            };
            pageentry.Dispose = function () {

            };
            return pageentry;
        };

        that.RetrieveDROforDomain = function (name) {
            try {
                var myurl = that.DomainDxnry[name].DROUrl || false;
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        cache: false,
                        success: function (droobject) {
                            try {
                                //populate domainDxnry[name].DRO from the droobject 
                                that.DomainDxnry[name].ItemCount = droobject.ItemCount;
                                for (var i = 0; i < droobject.ItemCount; i++) {
                                    if (!that.DomainDxnry[name].DRO[i]) {
                                        that.DomainDxnry[name].DRO[i] = that.NewDRObservablePage(name, i);
                                    }
                                    if (droobject.DROItemList[i].IsUrl) {
                                        that.DomainDxnry[name].DRO[i].Url = droobject.DROItemList[i].ResourceItem;
                                        that.DomainDxnry[name].DRO[i].IsUrl = true;
                                    }
                                    else {
                                        //DRO[i] is an observable page already..populate its html with the resourceitem that is html
                                        that.DomainDxnry[name].DRO[i].html(droobject.DROItemList[i].ResourceItem);
                                    }
                                };
                                that.DomainDxnry[name].ItemCountSubscribable(that.DomainDxnry[name].ItemCount);//subscribers will see change event...
                            }
                            catch (ex) {
                                alert("prweb.domaincontentsvc.RetrieveDROforDomain.successhandler reports " + ex.Message);
                            }
                        },
                        error: function (e) {
                            alert("prweb.domaincontentsvc.RetrieveDROforDomain.sendRequest reports error..." + e.toString());
                        }
                    });
                }
            }
            catch (ex) {
                alert("prweb.domaincontentsvc.RetrieveDROforDomain reports " + ex.Message);
            }
        };

        that.DomainPagePlease = function (name, pgnum) {
            var rslt = false;
            //this returns html or a subscription to an observable that will fire when the html is available...
            try {
                if (that.DomainDxnry[name].DRO[pgnum]) {
                    rslt = that.DomainDxnry[name].DRO[pgnum];
                    that.DomainDxnry[name].CurrentPageNum = parseInt(pgnum);
                    if (that.DomainDxnry[name].DRO[pgnum].IsUrl) {
                        that.DomainDxnry[name].DRO[pgnum].retrievePage();
                    }
                }
                else {
                    that.DomainDxnry[name].DRO[pgnum] = that.NewDRObservablePage(name, pgnum);
                    rslt = that.DomainDxnry[name].DRO[pgnum];
                    that.DomainDxnry[name].CurrentPageNum = parseInt(pgnum);
                    //this needs to create an observable that the calling method can subscribe to...so it can see when itemCount is populated...
                    that.CreateItemCountSubscribable(name);
                    that.RetrieveDROforDomain(name);
                }
            }
            catch (ex) {
                alert("prweb.domaincontentsvc.DomainPagePlease reports " + ex.Message);
            }
            return rslt;
        };

        that.PageCountforDomain = function (name) {
            var rslt = 0;
            if (that.DomainDxnry[name]) {
                rslt = that.DomainDxnry[name].ItemCount;
            }
            return rslt;
        };


        that.CreateItemCountSubscribable = function (name) {
            var rslt = false;
            try {
                that.DomainDxnry[name].ItemCountSubscribable = ko.observable(0);
                rslt = true;
            }
            catch (ex) {
                alert("prweb.domaincontentsvc.CreateItemCountSubscription reports " + ex.Message);
            }
            return rslt;

        };

        that.DomainEntirePlease = function (name) {
            //this returns a list of all the html pages for a domain or a list of subscriptions to an observables that fire when each page is available
        };

        that.NextPagePlease = function (name) {
            var rslt = false;
            try {
                var crntpagenum = that.DomainDxnry[name].CurrentPageNum;
                if (crntpagenum + 1 < that.DomainDxnry[name].ItemCount) {
                    rslt = that.DomainPagePlease(name, crntpagenum + 1);
                }
            }
            catch (ex) {
                alert("prweb.domaincontentsvc.NextPagePlease reports " + ex.Message);
            }
            return rslt;
        };

        that.PrevPagePlease = function (name) {
            var rslt = false;
            try {
                var crntpagenum = that.DomainDxnry[name].CurrentPageNum;
                if (crntpagenum - 1 > -1) {
                    rslt = that.DomainPagePlease(name, crntpagenum - 1);
                }
            }
            catch (ex) {
                alert("prweb.domaincontentsvc.PrevPagePlease reports " + ex.Message);
            }
            return rslt;
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
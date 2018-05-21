/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.imagesmgrsvc = (function () {
        var that = {};

        // want this to have a virtualized page behavior just like designersvc...
        //  ko shows imgs for the imgurls associated with the current virtualpage...
        that.IsReady = false;

        that.PageSize = 12; //number of img tags on a virtualpage...

        that.PagesCount = function () {
            var rslt = 0;
            rslt = that.VPageColxnLength();
            return rslt;
        };

        that.PagesCountChangedHandler = function (pgcountnewvalue) {
            //            prweb.surveymodelsvc.PageCount = that.VPageColxnLength();
        };

        that.CurrentPageNumber = 0;

        that.PageNumberChangedHandler = function (newpgnumvalue) {
            that.CurrentPageNumber = newpgnumvalue;
        };

        that.NavigateToPageNumber = function (newpgnum) {
            that.Vmx.currentpagenumber(newpgnum); // causes call to PageNumberChangedHandler...
        };

        that.CurrentGuidStr = false;

        that.VPageColxn = {};

        that.VPageColxnLength = function () {
            var rslt = 0;
            for (var k in that.VPageColxn) {
                rslt++;
            };
            return rslt;
        };

        that.ImgVPageEntry = function () {
            var rslt = {
                vpageID: that.VPageColxnLength() + 1,
                imgurlcolxn: [] //ko.observableArray()
            };
            return rslt;
        };

        that.NewVPage = function () {
            var rslt = false;
            try {
                rslt = that.ImgVPageEntry();
                that.VPageColxn[rslt.vpageID.toString()] = rslt;
            }
            catch (e) {
                alert("imagesmgrsvc.js.NewVPage reports error .." + e.Message);
            };
            return rslt;
        };

        that.AddGuidStr = function (gstr) {
            var gstrlistcnt = that.GuidStrListLength() + 1;
            that.GuidStrList[gstrlistcnt.toString()] = gstr;
            var impliedpgnum = gstrlistcnt / that.PageSize;
            var tempimgurlcolxn = false;
            if (that.VPageColxnLength() < impliedpgnum) {
                var newpage = that.NewVPage();
                tempimgurlcolxn = newpage.imgurlcolxn;
            }
            else {
                tempimgurlcolxn = that.VPageColxn[that.VPageColxnLength().toString()].imgurlcolxn; // is that last VPage
            }
            tempimgurlcolxn.push(gstr);
            that.Vmx.currentimgurlcolxn(tempimgurlcolxn);
            that.Vmx.currentguidstr(gstr);
            that.Vmx.pagescount(that.VPageColxnLength());
            //            that.NavigateToPageNumber(that.VPageColxnLength());
        };

        that.GuidStrList = {}; //this gets populated by an sendRequest(imgmgrguidlistURL...)

        that.GuidStrListLength = function () {
            var rslt = 0;
            for (var k in that.GuidStrList) {
                rslt++;
            };
            return rslt;
        };

        that.MoveToImgVpageNext = function () {
            var curr = that.Vmx.currentpagenumber();
            var nxtpgnum = curr + 1;
            var vpgcolxnlength = that.VPageColxnLength();
            if (nxtpgnum <= vpgcolxnlength) {
                var myvmx = that.Vmx;
                myvmx.currentimgurlcolxn(that.VPageColxn[nxtpgnum].imgurlcolxn);
                myvmx.currentpagenumber(nxtpgnum);
                myvmx = null;
            }
            curr = null;
            nxtpgnum = null;
            vpgcolxnlength = null;
            return true;
        },

        that.MoveToImgVPagePrev = function () {
            var curr = that.Vmx.currentpagenumber();
            var prevpgnum = Math.max(curr - 1, 1);
            //            var vpgcolxnlength = that.VPageColxnLength();
            if (prevpgnum !== curr) {
                var myvmx = that.Vmx;
                myvmx.currentimgurlcolxn(that.VPageColxn[prevpgnum].imgurlcolxn);
                myvmx.currentpagenumber(prevpgnum);
                myvmx = null;
            }
            curr = null;
            prevpgnum = null;
            return true;
        },

        that.MoveToImgVPage = function (vpgnum) {
            var vpgcolxnlength = that.VPageColxnLength();
            var newpgnum = Math.max(Math.min(vpgnum, vpgcolxnlength), 1);
            that.Vmx.currentimgurlcolxn(that.VPageColxn[newpgnum].imgurlcolxn);
            that.Vmx.currentpagenumber(newpgnum);
            newpgnum = null;
            vpgnum = null;
            vpgcolxnlength = null;
        },

        that.ImgsMgrGuidStrListURL = false;

        that.populateVmx = function () {
            var myurl = that.ImgsMgrGuidStrListURL;
            that.GuidStrList = {};
            if (myurl) {
                prweb.dataManager.sendRequest({
                    url: myurl,
                    success: function (imgguiddata) {
                        var gscount = 0;
                        var crntvpage = that.NewVPage();
                        var myvmx = that.Vmx;
                        var populateguidlist = function (gstr) {
                            if (gstr) {
                                gscount++;
                                that.GuidStrList[gscount.toString()] = gstr;
                                crntvpage.imgurlcolxn.push(gstr);
                                var isnewpg = gscount % that.PageSize;
                                if (isnewpg == 0) {
                                    crntvpage = that.NewVPage();
                                }
                            }
                            gstr = null;
                            isnewpg = null;
                        };
                        Enumerable.From(imgguiddata).ForEach(function (x) { return populateguidlist(x) }); //"url(" + x + ")"
                        myvmx.pagescount(that.VPageColxnLength());
                        //                        myvmx.currentimgurlcolxn(that.VPageColxn[1].imgurlcolxn); this happens only if designimgsmgr.js widget is displayed
                        imgguiddata = null;
                        myvmx = null;
                        crntvpage = null;
                        myurl = null;
                        populateguidlist = null;
                        return true;
                        //                        that.Vmx.currentimgurlcolxn.valueHasMutated();
                        //                        var dbx = that.Vmx.currentimgurlcolxn();
                    },
                    error: function () {
                        alert('ImagesMgrSvc.js populateVmx.ImgsMgrGuidStrList error...');
                    }
                });
            }
        };

        that.imgMgrClass = false;
        that.imgMgrEvent = false;

        that.BindClickHandlerToImage = function (elem) {
            $(elem).addClass(that.imgMgrClass).addClass("dsgnimgclickable").bind(that.imgMgrEvent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                var gsrc = ko.dataFor(this); //e.target.src; //attr("src");
                if ($(this).hasClass("removingimage")) {
                    that.Vmx.currentimgurlcolxn.remove(gsrc);
                } else {
                    prweb.pubsub.publish(prweb.events.imagesmgrsvc.selectedimgurlchanged, gsrc);
                }

                gsrc = null;
                e = null;
                return false;
            });
        };

        that.Vmx = {};

        that.InitializeVMX = function () {
            that.imgMgrClass = "designimagesmgr";
            that.imgMgrEvent = "click.designimagesmgr";
            if (prweb.IsTouch) {
                that.imgMgrEvent = "mouseup.designimagesmgr";
            }
            that.Vmx = {
                pagescount: ko.observable(1),
                currentpagenumber: ko.observable(1),
                currentimgurlcolxn: ko.observableArray([]),
                currentguidstr: ko.observable(),
                widgetizeAddedImage: function (elem) {
                    if (elem.nodeType === 1) {
                        that.BindClickHandlerToImage(elem);
                        return;
                    }
                }
            };
            return true;
        };

        that.PopulateImagesColxn = function () {
            that.populateVmx();
        };

        that.VMXSubscriptions = {};

        that.DestroyVMX = function () {
            if (that.Vmx) {
                try {
                    that.Vmx.widgetizeAddedImage = null;
                    //                    that.Vmx.currentimgurlcolxn.removeAll();
                    //                    that.Vmx.currentimgurlcolxn(null);
                    that.Vmx.currentimgurlcolxn = null;
                    //                    that.Vmx.pagescount(null);
                    that.Vmx.pagescount = null;
                    //                    that.Vmx.currentpagenumber(null);
                    that.Vmx.currentpagenumber = null;

                    //                    that.Vmx.currentguidstr(null);
                    that.Vmx.currentguidstr = null;
                    delete that.Vmx.widgetizeAddedImage;
                    delete that.Vmx.currentimgurlcolxn;
                    delete that.Vmx.pagescount;
                    delete that.Vmx.currentpagenumber;
                    delete that.Vmx.currentguidstr;
                    //                    that.Vmx = null;
                }
                catch (e) {
                    alert("prweb.imagesmgrssvc.DestroyVMX encountered error...");
                }
                finally {
                    that.Vmx = null;
                    delete that.Vmx;
                }
            }
            return true;
        };

        that.VPageColxnDispose = function () {
            for (var vp in that.VPageColxn) {
                if (that.VPageColxn[vp]) {
                    //this could be dispose in VPageEntry...
                    that.VPageColxn[vp].imgurlcolxn = null;
                    delete that.VPageColxn[vp].imgurlcolxn;
                    //                    that.VPageColxn[vp].vpageID = null;
                    delete that.VPageColxn[vp].vpageID;
                    that.VPageColxn[vp] = null;
                    delete that.VPageColxn[vp];
                }
            };
            //            that.VPageColxn = null;
            delete that.VPageColxn;
            return true;
        };

        that.Shutdown = function () {
            try {
                that.IsReady = false;
                for (var s in that.VMXSubscriptions) {
                    that.VMXSubscriptions[s].dispose();
                    //                    that.VMXSubscriptions[s] = null;
                    delete that.VMXSubscriptions[s];
                };
                //            that.VMXSubscriptions["currentpagenumber"].dispose();
                //            that.VMXSubscriptions["currentpagenumber"] = null;
                //            that.VMXSubscriptions["pagescount"].dispose();
                //            that.VMXSubscriptions["pagescount"] = null;
                //                that.VMXSubscriptions = null;
                delete that.VMXSubscriptions;
                //                that.GuidStrList = null;
                delete that.GuidStrList;
                that.DestroyVMX();
                //                that.VPageColxnDispose();
                that.VPageColxnDispose();
                //                that.DestroyVMX();

            }
            catch (e) { alert("prweb.imagesmgrsvc.Shutdown reports error..."); }
            finally {
                return true;
            }


        };

        that.InitializeImagesMgrSvc = function () {
            that.GuidStrList = {};
            that.VMXSubscriptions = {};
            that.VPageColxn = {};
            that.InitializeVMX();
            //            that.populateVmx();
            that.IsReady = true;
            that.VMXSubscriptions["currentpagenumber"] = that.Vmx.currentpagenumber.subscribe(that.PageNumberChangedHandler);
            that.VMXSubscriptions["pagescount"] = that.Vmx.pagescount.subscribe(that.PagesCountChangedHandler);
            return true;
        };



        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
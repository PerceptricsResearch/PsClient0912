/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.flex = (function () {
        var that = {};

        that.deviceAdjWidth = 1;
        that.deviceAdjHeight = 1;

        that.deviceAdjustment = function () {
            var rslt = {
                width: that.deviceAdjWidth,
                height: that.deviceAdjHeight
            };
            return rslt;
        };

        that.IsLandscape = false;

        that.IsEditableOverflow = function (el) {
            var rslt = true;
            try {
                var curoverflow = el.style.overflow;
                if (!curoverflow || curoverflow === "visible") {
                    el.style.overflow = "hidden";
                }
                //            $(el).css("font-size", "1em").css("line-height", "1.45em");el.clientWidth < el.scrollWidth ||

                var toobig = el.clientHeight < el.scrollHeight || el.clientWidth < el.scrollWidth;
                var $el = $(el);
                var szcount = 0;
                if (toobig) {
                    while (toobig && szcount < 5) {
                        toobig = that.ScaleEditableContent($el, szcount);
                        szcount++;
                    }

                }
                else {
                    //does it need to be bigger...
                    var currfs = parseFloat($el.css("font-size"));
                    var currem = currfs / 16;
                    if (currem < 1) {
                        $el.css("font-size", 1 + "em").css("line-height", (1.45) + "em");
                        toobig = el.clientHeight < el.scrollHeight || el.clientWidth < el.scrollWidth;
                        while (toobig && szcount < 5) {
                            toobig = that.ScaleEditableContent($el, szcount);
                            szcount++;
                        }
                    }

                }
                $el = null;
                el.style.overflow = curoverflow;
                curoverflow = null;
            }
            catch (ex) {
                alert("prweb.flex.IsEditableOverflow reports " + ex.Message);
            }

            return rslt;
        };
        that.ScaleEditableContent = function ($el, szcount) {
            var rslt = true;
            try {
                // apply some transform to this elements content??? or apply a different font-size em value here...
                // compute the scale required...
                // create a transform string with the computed scale...
                // $(el).wrap('<div style="tstring"></div>')??? set the scale transform here...???
                //            if (el.clientHeight < el.scrollHeight) {
                var exs = Math.max(($el[0].scrollHeight - $el[0].clientHeight), ($el[0].scrollWidth - $el[0].clientWidth));
                //            var sy = (el.clientHeight / el.scrollHeight);
                //            var sx = (el.clientWidth / el.scrollWidth);
                var currfs = parseFloat($el.css("font-size"));
                var currem = currfs / 16;
                var scoeff = 0.1;
                var gappct = (exs / $el[0].scrollHeight);
                //            if (exs > 0) {
                var sp = (currem - (gappct * scoeff)) - ((szcount * .1) * (gappct)); //up to a max of 1...
                //                var currlh = parseFloat($el.css("line-height"));
                var lh = Math.max(1, (1.45 - (gappct * scoeff)));
                $el.css("font-size", sp.toFixed(3) + "em").css("line-height", lh.toFixed(3) + "em");
                //            }

                //            sy = (el.clientHeight / el.scrollHeight);
                //            sx = (el.clientWidth / el.scrollWidth);
                //            el.style.overflow = "visible";
                //            var tstring = "translate(0,0)" + " scale(" + sx + "," + sy + ")";
                //            $(el).css("transform", tstring)
                //                     .css("-webkit-transform", tstring)
                //                     .css("msTransform", tstring);
                //                el.style.overflow = "hidden";
                //            }
                rslt = ($el[0].scrollHeight - $el[0].clientHeight) > 0 || ($el[0].scrollWidth - $el[0].clientWidth) > 0;
            }
            catch (ex) {
                alert("prweb.flex.ScaleEditableContent reports " + ex.Message);
                rslt = false;
            }

            return rslt;
        };

        that.ScaleEditables = function (scope) {
            try {
                var edtbls = false;
                if (scope !== undefined) {
                    edtbls = $(".prwdesignereditable", scope);
                }
                else {
                    edtbls = $(".prwdesignereditable");
                }
                if (edtbls.length > 0) {
                    for (var i = 0; i < edtbls.length; i++) {
                        that.IsEditableOverflow(edtbls[i]);
                    };
                }
                edtbls = null;
            }
            catch (ex) {
                alert("prweb.flex reports " + ex.Message);
            }
            return;
        };

        //#region ViewResizer
        that.viewresizer = false;

        that.makeviewresizer = function () {
            var rszr = {
                isResizing: false,
                resizeEditables: null,
                setappfontsize: null,
                resizeAction: null,
                resizeHandler: null,
                addResizeHandler: null,
                dispose: null
            };
            rszr.resizeEditables = function () {
                var edtbls = $(".prwdesignereditable");
                if (edtbls.length > 0) {
                    for (var i = 0; i < edtbls.length; i++) {
                        that.IsEditableOverflow(edtbls[i]);
                        //                        if (that.IsEditableOverflow(edtbls[i])) {
                        //                            that.ScaleEditableContent(edtbls[i]);
                        //                        }
                    };
                }
            };
            rszr.setappfontsize = function () {
                var appfontsize = 1.0;
                var ww = $(window).width();
                var wh = $(window).height();
                that.IsLandscape = (ww > wh);
                switch (true) {
                    case (ww > 550 && wh > 350):
                        appfontsize = 1.0;
                        break;
                    case (ww > 330 && wh > 230):
                        appfontsize = 0.7;
                        break;
                    case (ww < 331 && wh < 231):
                        appfontsize = 0.25;
                        break;
                    case (wh > 350):
                        appfontsize = 1.0;
                        break;
                    case (wh > 230):
                        appfontsize = 0.7;
                        break;
                    case (wh < 231):
                        appfontsize = 0.25;
                        break;
                }
                ww = null;
                wh = null;
                return appfontsize + "em";
            };
            rszr.resizeAction = function () {
                try {
                    var afs = rszr.setappfontsize();
                    //                    if (afs != prweb.appfontsize) {
                    //                    prweb.appfontsize = afs;
                    //                    var hcp = $("#prwebcontentroot");
                    //                    if (hcp.length == 1) {
                    //                        hcp.css("font-size", prweb.appfontsize); //.html(this.viewColxn[appcontext.toLowerCase()]);
                    //                    }
                    //                    hcp = null;
                    rszr.resizeEditables();
                    //                    }
                }
                catch (ex) {
                    alert("prweb.flex.resizeAction reports " + ex.Message);
                }

                //                    clearTimeout(wrszr.isResizing);
                //                    wrszr.isResizing = false;
            };
            rszr.resizeHandler = function (e) {
                clearTimeout(rszr.isResizing);
                rszr.isResizing = setTimeout(rszr.resizeAction, 800);

            };
            rszr.addResizeHandler = function () {
                $(window).bind("resize.flex", rszr.resizeHandler);
            };
            rszr.dispose = function () {
                try {
                    $(window).unbind("resize.flex", rszr.resizeHandler);
                    clearTimeout(rszr.isResizing);
                    rszr.isResizing = false;
                }
                catch (ex) {
                    alert("prweb.flex.rszr.dispose reports " + ex.Message);
                }

            };
            return rszr;
        };

        //#endregion
        that.Initialize = function () {
            if (!that.viewresizer) {
                that.viewresizer = this.makeviewresizer();
                that.viewresizer.resizeAction();
                that.viewresizer.addResizeHandler();
            }
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
(function (prweb, $) {

    var prwebUrl = '';

    try {
        prweb.Platform = false,
        prweb.IsTouch = ("ontouchend" in document);
        prweb.rootUrl = false;
        prweb.actionContext = {
            current: 'subscriberhome',
            pcvmode: false,
            currentsurveyname: 'None',
            currentpgnumber: 1,
            defaultrsltsurl: 'None',
            currentrsltsurl: 'None',
            isrsltsgrpdefnactive: false,
            currentrsltsgroupname: 'None',
            currentrsltsgrprfm: 'None',
            currentrsltsgrprdentset: 'None',
            currentrsltsallrdentscount: 0
        };


        prweb.scrollTo = function (target, panel) {
            try {
                var $panel = null;
                if (panel !== undefined) {
                    $panel = $(panel);
                }
                else {
                    $panel = $("#prwebcontentroot");
                }
                if (target.length > 0 && $panel.length > 0) {
                    var offtop = target.offset().top + $panel.scrollTop() - 100;
                    $panel.animate({
                        scrollTop: offtop
                    }, 400);
                }

            }
            catch (ex) {
                alert("prweb.scrollTo reports " + ex.Message);
            }
            return;
        };

        prweb.ShowMail = function (mailparts) {
            var rslt = "mailto:?";
            try {
                rslt = "mailto:" + mailparts.to + "subject=" + mailparts.subject + "&body=" + mailparts.body;

                window.location.replace(rslt);
            }
            catch (ex) {
                alert("prweb.base.ShowMail reports " + ex.Message);
            }
            return;
        };

        prweb.showClick = function (btn) {
            try {
                var $btn = $(btn);
                btn = null;
                $btn.css("background", "rgba(210,160,1,0.8)");
                //            var xbtn = function () {
                //                $btn.css("background", "");
                //                $btn = null;
                //            };
                var tov = setTimeout(function () {
                    try {
                        $btn.css("background", "");
                        $btn = null;
                        clearTimeout(tov);
                        tov = null;
                    }
                    catch (ex) {
                        var xxx = 2;
                    }

                    return;
                }, 200);
            }
            catch (ex) {
                var xx = 2;
            }

            return;
        };

        prweb.scrollhandler = false;
        prweb.ScrollWindowTop = function () {
            if (prweb.IsTouch) {
                clearTimeout(prweb.scrollhandler);
                prweb.scrollhandler = setTimeout(function () {
                    $('html, body').clearQueue().animate({ scrollTop: 0 }, 200);
                    clearTimeout(prweb.scrollhandler);
                    prweb.scrollhandler = null;
                    return;
                }, 100);
            }
            return;
        };

        prweb.InitWindowFrame = function () {
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = (function () {
                    return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                    function ( /* function FrameRequestCallback */callback, /* DOMElement Element */element) {
                        window.setTimeout(callback, 1000 / 60);
                    };
                } ());
            }
        };

        prweb.setUpKOImageBinding = function () {
            try {
                if (!ko.bindingHandlers.xlinkHref) {
                    ko.bindingHandlers.xlinkHref = {
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                            var xxval = valueAccessor();
                            var rslt = false;
                            if (typeof xxval === 'function') {
                                var rstring = xxval();
                                if (rstring == "False" || rstring == "false") {
                                    rslt = false;
                                }
                                else {
                                    rslt = rstring;
                                }
                            }
                            else {
                                rslt = xxval;
                            }
                            xxval = null;
                            if (rslt) {
                                element.style.visibility = "visible";
                                element.href.baseVal = rslt;
                            }
                            else {
                                element.style.visibility = "hidden";
                            }
                            rslt = null;
                        }
                    };
                };
            }
            catch (ex) {
                alert("prweb.base.setUpKOImageBinding reports " + ex.Message);
            }
        };

        prweb.playersvc = false;

        //#region NewGuid and guid generator
        //this is Guid stuff...
        prweb.fourDigits = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toLowerCase();
        };
        prweb.NewGuid = function () {
            return prweb.fourDigits() + prweb.fourDigits()
                     + prweb.fourDigits()
                     + prweb.fourDigits()
                     + prweb.fourDigits()
                     + prweb.fourDigits() + prweb.fourDigits() + prweb.fourDigits();
        };
        //#endregion

        prweb.appfontsize = "1.0em";

        prweb.log = function (args) {
            if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
                console.log(args);
            }
        };
        prweb.strings = {
            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            lastDay: ['31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31']
        };
        $.ajaxSetup({
            cache: false,
            headers: { "cache-control": "no-cache" }
        });

        // setup default error handler for redirects due to session timeout.
        $(document).ajaxError(function (ev, jqXHR, settings, errorThrown) {
            alert("prweb.base reports ajax error.. " + errorThrown.toString());
        });
    }
    catch (ex) {
        alert("prweb.base reports could not do ajaxSetup...");
    };
    
    prweb.metricslogonurl = false;
    prweb.logoffurl = false;

    prweb.LogMeOff = function () {
        var logoffurl = prweb.getRelativeEndpointUrl(prweb.logoffurl);
        window.location = logoffurl;
    };
    /**
    * Recieves a JSON encoded date and returns a formatted string in the following format: "18 Dec 2010"
    *
    * @param {String} dt  A JSON encoded date string in the format: /Date(123456789)/
    */
    prweb.makeDate = function (dt) {
        var dateStr = dt.replace(/^\/Date\(/, '').replace(/\)\//, ''),
            dateObj = new Date(Number(dateStr)),
            day = dateObj.getDate().toString(),
            month = prweb.strings.shortMonths[dateObj.getMonth()],
            year = dateObj.getFullYear().toString();
        return day + ' ' + month + ' ' + year;
    };


    prweb.getRelativeEndpointUrl = function (endpoint) {
        //        alert('in base.getRelativeEndpointURL');
        var i,
            splitString = function (string) {
                if ((string === null) || (string === undefined)) {
                    return '';
                }
                return string.split('/');
            },
            createUrl = function (newUrl, stringArray) {
                for (i = 0; i < stringArray.length; i += 1) {
                    if (stringArray[i].length > 0) {
                        newUrl += '/' + stringArray[i];
                    }
                }
                return newUrl;
            },
            splitRoot = splitString(prweb.rootUrl),
            splitUrl = splitString(endpoint),
            result = '';

        if (!endpoint) {
            return '';
        }

        if (endpoint.indexOf(prweb.rootUrl || '') === 0) {
            return endpoint;
        }

        result = createUrl(result, splitRoot);
        result = createUrl(result, splitUrl);

        return result;
    };

    prweb.getBaseUrl = function () {
        return prweb.getRelativeEndpointUrl(prwebUrl);
    };


} (this.prweb = this.prweb || {}, jQuery));
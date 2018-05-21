/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.redactorplugins = (function () {
        var that = {};
        that.editor = false;
        that.fontclass = "editorfont9";

        that.anyspans = function ($sn) {
            var $aspans = $sn.find("span");
            return $aspans;
        };

        that.wrapwithfontspan = function ($sn) {
            $sn.wrap("<span></span>").parent().addClass(that.fontclass);
        };

        that.fontclosestparentspan = function ($selhtml, $sn) {
            var $parentspans = $selhtml.closest("span", $sn);
            return $parentspans;
        };
        that.fontspans = function ($sn) {
            var $spans = $sn.filter("[class^='editorfont']");
            if ($spans.length > 0) {
                var classes = $spans.attr("class").split(" ").filter(function (item) {
                    return item.indexOf("editorfont") === -1 ? item : "";
                });
                $spans.attr("class", classes.join(" ")).addClass(that.fontclass);
            }
            else {
                $sn.addClass(that.fontclass);
            }
            return $spans;
        };

        that.selectedRange = function () {
            var sel = that.editor.getSelection();
            var seltext = sel.toString();
            if (sel.rangeCount == 1) {
                try {
                    var $sel = $(sel);

                    var rng = sel.getRangeAt(0);
                    var scont = rng.startContainer;
                    var soffset = rng.startOffset;
                    var econt = rng.endContainer;
                    var eoffset = rng.endOffset;
                    var $rngcancntr = $(rng.commonAncestorContainer);
                    $rngcancntrcontents = $rngcancntr.contents();
                    if (scont == econt) {

                    }
                    else {
                        if (scont.firstChild) {
                            var startleaf = scont.childNodes[soffset];
                        }
                        else {

                        }
                        if (econt.firstChild) {
                            if (eoffset > 0) {
                                var endleaf = econt.childNodes[eoffset - 1]
                            }

                        }
                        else {

                        }
                    }
                    var xdxdx = 2;
                }
                catch (ex) {
                    var zzz = 2;
                }
            }
        };

        that.fonttextnode = function ($sn, sh) {
            var rslt = false;

            if ($sn[0].nodeType == 3) {
                var sel = that.editor.getSelection();
                var seltext = sel.toString();
                if (sh == seltext || seltext == $sn[0].textContent) {
                    var iseq = true;
                }
                else {
                    var noteq = true;
                }
                if (sh == $sn[0].textContent) {
                    $sn.wrap("<span></span>").parent().addClass(that.fontclass);
                    rslt = true;
                }
                else {
                    var ndxsh = -1;
                    ndxsh = $sn[0].textContent.search(sh);
                    if (ndxsh > -1) {
                        var nssh = '<span class="' + that.fontclass + '">' + sh + '</span>';
                        var newhtml = "";
                        var nsarray = $sn[0].textContent.split(sh);
                        $sn[0].textContent = ""; //st;
                        if (ndxsh == 0) {
                            newhtml = nssh;
                        }
                        else {
                            newhtml = '<span>' + nsarray[0] + '</span>' + nssh;
                        }
                        if (nsarray.length == 2) {
                            newhtml = newhtml + '<span>' + nsarray[1] + '</span>';
                        }
                        //                        var st = $sn[0].textContent.replace(sh, "");
                        that.editor.insertHtml(newhtml);
                        //                        var st = $sn[0].textContent.replace(sh, "");

                        rslt = true;
                    }
                }
            }
            else {
                var notatextnode = true;
            }

            return rslt;
        };
        that.fontdescendants = function ($sn, sh) {
            var $snchilds = $sn.find("*").filter(function () {
                var cprslt = false;
                var cph = $(this)[0].outerHTML;
                var cphi = $(this)[0].innerHTML;
                if (cph == sh || cphi == sh) {
                    cprslt = true;
                }
                return cprslt;
            });
            return $snchilds;
        };
        that.fontcontents = function ($sn, sh) {
            var started = false;
            var shscratch = sh;
            var $sncontents = false;
            var sel = that.editor.getSelection();
            var seltext = sel.toString();
            var wastext = false;
            if (sh == seltext || seltext == $sn[0].textContent) {
                var iseq = true;
                wastext = that.fonttextnode($sn, shscratch);
            }
            if (!wastext) {
                var noteq = true;
                $sncontents = $sn.contents().filter(function () {
                    var cprslt = false;
                    if ($(this)[0].nodeType == 3) {
                        if (started) {
                            that.fonttextnode($(this), shscratch);
                            cprslt = true;
                        }
                    }
                    if (!cprslt) {
                        var $this = $(this);
                        var cph = $this[0].outerHTML;
                        var cphi = $this[0].innerHTML;
                        if (shscratch.search(cph) > -1 || shscratch.search(cphi) > -1) {
                            started = true;
                            cprslt = true;
                            shscratch = sh.replace(cph, "");
                            var thistext = $this.text();
                            var parentspans = that.fontclosestparentspan($this, $sn);
                            var anyspans = that.anyspans($this);
                            if (parentspans.length > 0) {
                                that.fontspans(parentspans);
                            }
                            else {
                                if (anyspans.length > 0) {
                                    that.fontspans(anyspans);
                                }
                                else {
                                    $(this).wrapInner('<span class="' + that.fontclass + '"/>');
                                }
                            }
                            if (anyspans.length > 0) {
                                that.fontspans(anyspans);
                            }
                        }
                    }

                    return cprslt;
                });
            }

            return $sncontents;
        };
        that.get$selectedhtml = function ($sn, sh) {
            return that.fontdescendants($sn.parent(), sh);
        };
        that.FontKeyMatch = function (key) {
            var rslt = false;
            if (key.match(/^fontsize(\d+)$/)) {
                var rerslt = RegExp.$1;
                that.fontclass = "editorfont" + rerslt
                rslt = true;
            }
            else {
                that.fontclass = "editorfont9";
            }
            return rslt;
        };

        that.fontbtn = false;
        that.FontSizeBtnCB = function (e) {

            //            var fto = setTimeout(function () {
            //                var dd = $(".redactor_dropdown");
            //                if (dd.length > 0) {
            //                    dd.css("left", "7em")
            //                        .css("position", "absolute")
            //                      .css("top", "7em")
            //                      .css("width", "6em");
            //                }

            //            }, 0);
            return;
        };

        that.Install = function () {
            RedactorPlugins.fontsize = {

                init: function () {
                    var dropdown = {
                        fontsize10: {
                            title: '<div style="10px">10</div>',
                            callback: this.fontSize
                        },
                        fontsize18: {
                            title: '<div style="18px">18</div>',
                            callback: this.fontSize
                        },
                        fontsize24: {
                            title: '<div style="24px">24</div>',
                            callback: this.fontSize
                        }
                    };
                    var isfontbtn = this.addBtnAfter('bold', 'fontsize', 'FONTSIZE', function () { }, dropdown);

                    var dd = $(".redactor_dropdown");
                    if (dd.length > 0) {
                        dd.css("left", "8em")
                          .css("position", "absolute")
                          .css("top", "4em")
                          .css("width", "12em");
                    }
                },

                fontSize: function (obj, event, key) {
                    try {
                        var ismatch = that.FontKeyMatch(key);
                        if (ismatch) {
                            that.editor = obj;
                            var sh = obj.getSelectedHtml();
                            var sn = obj.getSelectedNode();

                            var $sn = $(sn);
                            that.fontcontents($sn, sh);
                            //                            var $selhtml = that.get$selectedhtml($sn, sh);

                        }
                        else {
                            alert("fonsizeplugin.fontSize says nomatch");
                        }
                    }
                    catch (ex) {
                        alert("prweb.redactorplugins.fontsize.fontSize method reports " + ex.Message);
                    }
                    return;
                }

            };

        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));

if (typeof RedactorPlugins === 'undefined') {
    var RedactorPlugins = {};
}
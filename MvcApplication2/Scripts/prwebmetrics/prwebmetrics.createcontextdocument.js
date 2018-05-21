/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.createcontextdocument', {

        options: {
            dashboard: null,
            domains: null,
            components: null,
            isDisposed: false,
            id: 0
        },

        xevent: "click.createcontextdocument",


        _create: function () {
            var myclass = "createcontextdocument";
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.createcontextdocument";
                }
                this._populatecreatecontextdocumentXeventBindings();
                //                this._populateCopyFromHandler();
                this._populateEditDoneHandler();
                this._populateBackCancelHandler();
                prweb.scrollTo(this.element, "#metricscontent");
            }
            catch (ex) {
                alert("prwebmetrics.createcontextdocument.create reports " + ex.Message);
            }
            return;
        },
        _populateEditDoneHandler: function () {
            try {
                $("#createcontextdocumentdoneedit").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        xthis = this;
                        var tx = setTimeout(function () {
                            try {
                                prweb.dashboardsvc.CreateContextDocumentEditDoneAction();
                            }
                            catch (ex) {
                                alert("prwebmetrics.createcontextdocument.EditDone.click reports " + ex.Message);
                            }
                            clearTimeout(tx);
                            tx = null;
                            return;
                        }, 200);
                        //navigate to selected thing...
                    }
                    catch (ex) {
                        alert("prwebmetrics.createcontextdocument.EditDone.addclickhandler reports " + ex.Message);
                    }
                    return false;

                });
            }
            catch (ex) {
                alert("prwebmetrics.createcontextdocument.EditDone.populateclickhandler reports " + ex.Message);
            }
            return;
        },
        _populateBackCancelHandler: function () {
            try {
                $("#createcontextdocumentbackcancel").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        xthis = this;
                        var tx = setTimeout(function () {
                            try {
                                prweb.dashboardsvc.CreateContextDocumentBackCancelAction();
                            }
                            catch (ex) {
                                alert("prwebmetrics.createcontextdocument.BackCancel.click reports " + ex.Message);
                            }
                            clearTimeout(tx);
                            tx = null;
                            return;
                        }, 200);
                        //navigate to selected thing...
                    }
                    catch (ex) {
                        alert("prwebmetrics.createcontextdocument.BackCancel.addclickhandler reports " + ex.Message);
                    }
                    return false;
                });
            }
            catch (ex) {
                alert("prwebmetrics.createcontextdocument.BackCancel.populateclickhandler reports " + ex.Message);
            }
            return;
        },

        _populateCopyFromHandler: function () {
            try {
                $("#createcontextdocumentitemselector").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        xthis = this;
                        var tx = setTimeout(function () {
                            try {
                                var kodata = ko.dataFor(xthis);
                                var kocontext = ko.contextFor(xthis);
                                var ischeckednow = kodata.IsSelected;
                                if (!ischeckednow) {
                                    kodata.CopyBrushStr("url(#createcontextcopyonbrush)");
                                    kodata.IsSelected = true;
                                    prweb.dashboardsvc.RetrieveAvailableContexts();
                                }
                                else {
                                    kodata.IsSelected = false;
                                    kodata.CopyBrushStr("url(#createcontextcopyoffbrush)");
                                }
                            }
                            catch (ex) {
                                alert("prwebmetrics.createcontextdocument.CopyFrom.click reports " + ex.Message);
                            }
                            clearTimeout(tx);
                            tx = null;
                            return;
                        }, 200);
                        //navigate to selected thing...
                    }
                    catch (ex) {
                        alert("prwebmetrics.createcontextdocument.metricsselectbtn.clickhandler reports " + ex.Message);
                    }
                    return false;

                });
            }
            catch (ex) {
            }
            return;
        },

        _populatecreatecontextdocumentXeventBindings: function () {
            var myxevent = this.xevent;
            var turnOffAllRadioButtons = function (grpcolxn, offstr) {
                for (var n = 0; n < grpcolxn.length; n++) {
                    grpcolxn[n].BrushStr(offstr);
                    grpcolxn[n].IsSelected = false;
                };
                return;
            };
            var computeContextSelectionBitmask = function (seginfocolxn) {
                var csel = 0; //is a bitmask...using AND below...
                for (var k = 0; k < seginfocolxn.length; k++) {
                    for (var j = 0; j < seginfocolxn[k].OptionColxn.length; j++) {
                        if (seginfocolxn[k].OptionColxn[j].IsSelected) {
                            csel = csel | seginfocolxn[k].OptionColxn[j].EnumValue; //logical OR
                        };
                    };
                };
                return csel;
            };
            try {
                if (ko.bindingHandlers.availablecontextsxevent == undefined) {
                    ko.bindingHandlers.availablecontextsxevent = {
                        init: function (element, valueAccessor) {
                            var $eelem = $(element);
                            switch (true) {
                                case ($eelem.hasClass("activecontextsitemselector")):
                                    $eelem.on(myxevent, function (e) {
                                        try {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.cancelBubble = true;
                                            prweb.showClick(this);
                                            xthis = this;
                                            var tx = setTimeout(function () {
                                                try {
                                                    var kodata = ko.dataFor(xthis);
                                                    var kocontext = ko.contextFor(xthis);
                                                    var ischeckednow = kodata.IsSelected;
                                                    if (!ischeckednow) {
                                                        turnOffAllRadioButtons(kocontext.$parent.availablecontexts(), "url(#createcontextcopyoffbrush)");
                                                        kodata.BrushStr("url(#createcontextcopyonbrush)");
                                                    }
                                                    else {
                                                        kodata.BrushStr("url(#createcontextcopyoffbrush)");
                                                        kodata.IsSelected = false;
                                                    }
                                                }
                                                catch (ex) {
                                                    alert("prwebmetrics.createcontextdocument.availablecontextsitemselector.click reports " + ex.Message);
                                                }
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                            //navigate to selected thing...
                                        }
                                        catch (ex) {
                                            alert("prwebmetrics.availablecontexts.metricsselectbtn.clickhandler reports " + ex.Message);
                                        }
                                        return false;
                                    });
                                    break;
                                case ($eelem.hasClass("createcontextdocumentcollapseable")):
                                    $eelem.on(myxevent, function (e) {
                                        try {
                                            e.preventDefault();
                                            e.cancelBubble = true;
                                            prweb.showClick(this);
                                            var $this = $(this);
                                            var tx = setTimeout(function () {
                                                try {
                                                    $this.children(".createcontextdocumentmetricscolxnregion").toggle();
                                                }
                                                catch (ex) {
                                                    alert("prwebmetrics.createcontextdocument.createcontextdocumentcollapseable.click reports " + ex.Message);
                                                }
                                                $this = null;
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                            //navigate to selected thing...
                                        }
                                        catch (ex) {
                                            alert("prwebmetrics.createcontextdocument.metricsselectbtn.clickhandler reports " + ex.Message);
                                        }
                                        return false;
                                    });
                                    break;
                                case ($eelem.hasClass("createcontextdocumentmetricscollapse")):
                                    $eelem.on(myxevent, function (e) {
                                        try {
                                            e.preventDefault();
                                            e.cancelBubble = true;
                                            prweb.showClick(this);
                                            var $this = $(this);
                                            var tx = setTimeout(function () {
                                                try {
                                                    $this.siblings().toggle();
                                                }
                                                catch (ex) {
                                                    alert("prwebmetrics.createcontextdocument.createcontextdocumentmetricscollapse.click reports " + ex.Message);
                                                }
                                                $this = null;
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                        }
                                        catch (ex) {
                                            alert("prwebmetrics.createcontextdocument.createcontextdocumentmetricscollapse.clickhandler reports " + ex.Message);
                                        }
                                        return false;
                                    });
                                    break;
                            };
                            return;
                        },
                        update: function (element, valueAccessor) {
                            return;
                        }
                    };
                }
            }
            catch (ex) {
                alert("prwebmetrics.createcontextdocument.PopulatecreatecontextdocumentXeventBindings  reports " + ex.Message);
            }
            return;
        },

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#createcontextdocumentdoneedit").off(this.xevent);
                    $("#createcontextdocumentbackcancel").off(this.xevent);
                    $(".createcontextdocumentitemselector").off(this.xevent);
                    $(".createcontextdocumentcollapseable").off(this.xevent);
                    $(".createcontextdocumentmetricscollapse").off(this.xevent);
                    ko.bindingHandlers.availablecontextsxevent = null;
                }
                catch (ex) {
                    alert("prwebmetrics.createcontextdocument.dispose reports error " + ex.Message);
                    ex = null;
                }
                finally {
                    this.options.isDisposed = true;
                }
            }
            return;
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prwebmetrics.createcontextdocument.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
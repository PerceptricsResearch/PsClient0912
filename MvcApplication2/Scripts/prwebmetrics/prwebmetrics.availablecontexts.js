/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.availablecontexts', {

        options: {
            dashboard: null,
            domains: null,
            components: null,
            isDisposed: false,
            id: 0
        },

        xevent: "click.availablecontexts",


        _create: function () {
            var myclass = "availablecontexts";
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.availablecontexts";
                }
                this._populateavailablecontextsXeventBindings();
                this._populateEditDoneHandler();
                this._populateBackCancelHandler();
                prweb.scrollTo(this.element, "#metricscontent");
            }
            catch (ex) {
                alert("prwebmetrics.availablecontexts.create reports " + ex.Message);
            }
            return;
        },

        _populateEditDoneHandler: function () {
            try {
                $("#availablecontextsdoneedit").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        xthis = this;
                        var tx = setTimeout(function () {
                            try {
                                prweb.dashboardsvc.AvailableContextDocumentsEditDoneAction();
                            }
                            catch (ex) {
                                alert("prwebmetrics.availablecontexts.EditDone.click reports " + ex.Message);
                            }
                            clearTimeout(tx);
                            tx = null;
                            return;
                        }, 200);
                        //navigate to selected thing...
                    }
                    catch (ex) {
                        alert("prwebmetrics.availablecontexts.EditDone.addclickhandler reports " + ex.Message);
                    }
                    return false;

                });
            }
            catch (ex) {
                alert("prwebmetrics.availablecontexts.EditDone.populateclickhandler reports " + ex.Message);
            }
            return;
        },
        _populateBackCancelHandler: function () {
            try {
                $("#availablecontextsbackcancel").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        xthis = this;
                        var tx = setTimeout(function () {
                            try {
                                prweb.dashboardsvc.AvailableContextDocumentsBackCancelAction();
                            }
                            catch (ex) {
                                alert("prwebmetrics.availablecontexts.BackCancel.click reports " + ex.Message);
                            }
                            clearTimeout(tx);
                            tx = null;
                            return;
                        }, 200);
                        //navigate to selected thing...
                    }
                    catch (ex) {
                        alert("prwebmetrics.availablecontexts.BackCancel.addclickhandler reports " + ex.Message);
                    }
                    return false;

                });
            }
            catch (ex) {
                alert("prwebmetrics.availablecontexts.BackCancel.populateclickhandler reports " + ex.Message);
            }
            return;
        },

        _populateavailablecontextsXeventBindings: function () {
            var myxevent = this.xevent;
            var turnOffAllRadioButtons = function (grpcolxn, offstr) {
                for (var n = 0; n < grpcolxn.length; n++) {
                    grpcolxn[n].BrushStr(offstr);
                    grpcolxn[n].IsSelected = false;
                };
                return;
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
                                                        turnOffAllRadioButtons(kocontext.$parent.availablecontexts(), "url(#acrboffbrush)");
                                                        kodata.BrushStr("url(#acrbonbrush)");
                                                    }
                                                    else {
                                                        kodata.BrushStr("url(#acrbonbrush)");
                                                        kodata.IsSelected = true;
                                                    }
                                                    //this is the newcontextdocument row...
                                                    if (kodata.ContextSelection == 0) {
                                                        //                                                        prweb.dashboardsvc.Vmx.createcontextdocument(kodata);
                                                        prweb.dashboardsvc.NewContextDocumentAction();
                                                    }

                                                }
                                                catch (ex) {
                                                    alert("prwebmetrics.availablecontexts.availablecontextsitemselector.click reports " + ex.Message);
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
                                case ($eelem.hasClass("newcontextcopyitemselector")):
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
                                                        //                                                        turnOffAllRadioButtons(kocontext.$parent.availablecontexts(), "url(#newcontextcopyoffbrush)");
                                                        kodata.CopyBrushStr("url(#newcontextcopyonbrush)");
                                                        kodata.IsSelected = true;
                                                    }
                                                    else {
                                                        kodata.CopyBrushStr("url(#newcontextcopyoffbrush)");
                                                        kodata.IsSelected = false;
                                                    }
                                                }
                                                catch (ex) {
                                                    alert("prwebmetrics.availablecontexts.availablecontextsitemselector.click reports " + ex.Message);
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
                                case ($eelem.hasClass("availablecontextscollapseable")):
                                    $eelem.on(myxevent, function (e) {
                                        try {
                                            e.preventDefault();
                                            e.cancelBubble = true;
                                            prweb.showClick(this);
                                            var $this = $(this);
                                            var tx = setTimeout(function () {
                                                try {
                                                    $this.children(".availablecontextsmetricscolxnregion").toggle();
                                                }
                                                catch (ex) {
                                                    alert("prwebmetrics.availablecontexts.availablecontextscollapseable.click reports " + ex.Message);
                                                }
                                                $this = null;
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
                                case ($eelem.hasClass("availablecontextsmetricscollapse")):
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
                                                    alert("prwebmetrics.availablecontexts.availablecontextsmetricscollapse.click reports " + ex.Message);
                                                }
                                                $this = null;
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                        }
                                        catch (ex) {
                                            alert("prwebmetrics.availablecontexts.availablecontextsmetricscollapse.clickhandler reports " + ex.Message);
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
                alert("prwebmetrics.availablecontexts.PopulateavailablecontextsXeventBindings  reports " + ex.Message);
            }
            return;
        },

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#availablecontextsbackcancel").off(this.xevent);
                    $("#availablecontextsdoneedit").off(this.xevent);
                    $(".activecontextsitemselector").off(this.xevent);
                    $(".availablecontextsrefresh").off(this.xevent);
                    $(".availablecontextscollapseable").off(this.xevent);
                    ko.bindingHandlers.availablecontextsxevent = null;
                }
                catch (ex) {
                    alert("prwebmetrics.availablecontexts.dispose reports error " + ex.Message);
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
                alert("prwebmetrics.availablecontexts.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
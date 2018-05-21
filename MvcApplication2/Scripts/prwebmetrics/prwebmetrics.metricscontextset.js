/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.metricscontextset', {

        options: {
            dashboard: null,
            domains: null,
            components: null,
            isDisposed: false,
            id: 0
        },

        xevent: "click.metricscontextset",


        _create: function () {
            var myclass = "metricscontextset";
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.metricscontextset";
                }
                this._populatemetricscontextsetXeventBindings();
            }
            catch (ex) {
                alert("prwebmetrics.metricscontextset.create reports " + ex.Message);
            }
            return;
        },
        _populatemetricscontextsetXeventBindings: function () {
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
                if (ko.bindingHandlers.metricscontextsetxevent == undefined) {
                    ko.bindingHandlers.metricscontextsetxevent = {
                        init: function (element, valueAccessor) {
                            var $eelem = $(element);
                            switch (true) {
                                case ($eelem.hasClass("metricscontextitemselector")):
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
                                                        //turn off all of its siblings..
                                                        turnOffAllRadioButtons(kocontext.$parent.OptionColxn, kocontext.$parent.DefaultBrushStr);
                                                        kodata.BrushStr(kocontext.$parent.SelectedBrushStr);
                                                        kodata.IsSelected = true;
                                                        kocontext.$root.availabledocumentstemplate("availablecontexts");
                                                        var contextselbmsk = computeContextSelectionBitmask(kocontext.$root.dashboard.SegmentInfoColxn);
                                                        $("#availablecontextsroot").availablecontexts();
                                                        prweb.dashboardsvc.RetrieveAvailableContexts(contextselbmsk);
                                                    }
                                                    else {
                                                        kodata.BrushStr(kocontext.$parent.SelectedBrushStr);
                                                        kodata.IsSelected = true;
                                                        kocontext.$root.availabledocumentstemplate("");
                                                    }
                                                }
                                                catch (ex) {
                                                    alert("prwebmetrics.metricscontextset.metricscontextitemselector.click reports " + ex.Message);
                                                }
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                            //navigate to selected thing...
                                        }
                                        catch (ex) {
                                            alert("prwebmetrics.metricscontextset.metricsselectbtn.clickhandler reports " + ex.Message);
                                        }
                                        return false;
                                    });
                                    break;
                                case ($eelem.hasClass("metricscontextsetcollapseable")):
                                    $eelem.on(myxevent, function (e) {
                                        try {
                                            e.preventDefault();
                                            e.cancelBubble = true;
                                            prweb.showClick(this);
                                            var $this = $(this);
                                            var tx = setTimeout(function () {
                                                try {
                                                    $this.children(".metricscontextsetmetricscolxnregion").toggle();
                                                }
                                                catch (ex) {
                                                    alert("prwebmetrics.metricscontextset.metricscontextsetcollapseable.click reports " + ex.Message);
                                                }
                                                $this = null;
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                            //navigate to selected thing...
                                        }
                                        catch (ex) {
                                            alert("prwebmetrics.metricscontextset.metricsselectbtn.clickhandler reports " + ex.Message);
                                        }
                                        return false;
                                    });
                                    break;
                                case ($eelem.hasClass("metricscontextsetmetricscollapse")):
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
                                                    alert("prwebmetrics.metricscontextset.metricscontextsetmetricscollapse.click reports " + ex.Message);
                                                }
                                                $this = null;
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                        }
                                        catch (ex) {
                                            alert("prwebmetrics.metricscontextset.metricscontextsetmetricscollapse.clickhandler reports " + ex.Message);
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
                alert("prwebmetrics.metricscontextset.PopulatemetricscontextsetXeventBindings  reports " + ex.Message);
            }
            return;
        },

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $(".metricscontextsetcollapseable").off(this.xevent);
                    $(".metricscontextsetmetricscollapse").off(this.xevent);
                    $(".metricscontextsetrefresh").off(this.xevent);
                }
                catch (ex) {
                    alert("prwebmetrics.metricscontextset.dispose reports error " + ex.Message);
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
                alert("prwebmetrics.metricscontextset.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
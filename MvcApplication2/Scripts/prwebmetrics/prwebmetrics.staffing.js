/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.staffing', {

        options: {
            dashboard: null,
            domains: null,
            components: null,
            isDisposed: false,
            id: 0
        },

        xevent: "click.staffing",


        _create: function () {
            var myclass = "staffing";
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.staffing";
                    $("#staffingsvgroot").on("touchstart", function () { });
                    //                    $("#staffingsvgroot").css('-webkit-transform', 'translate3d(0,0,0)')
                }
                this._populateStaffingXeventBindings();
                this._populateStaffingDerivedBindings();
            }
            catch (ex) {
                alert("prwebmetrics.staffing.create reports " + ex.Message);
            }
            return;
        },

        _computeStaffModel: function () {
            try {
                var cdxnry = prweb.dashboardsvc.Vmx.domaininfos[0].ComponentInfoColxn;
                var mdxnry = {};
                for (var i = 0; i < cdxnry.length; i++) {
                    if (i == 0) {
                        var micolxn = cdxnry[i].MetricInfoColxn;
                        for (var im = 0; im < micolxn.length; im++) {
                            var dkey = micolxn[k].MetricInfoID.toString();
                            if (mdxnry[dkey] == undefined) {
                                mdxnry[dkey] = [];
                            }
                        }
                    }
                    var hcolxn = cdxnry[i].HorizonItemColxn();
                    for (var j = 0; j < hcolxn.length; j++) {
                        var mvcolxn = hcolxn[j].MetricValueColxn;
                        for (var k = 0; k < mvcolxn.length; k++) {
                            var dkey = mvcolxn[k].MetricInfoID.toString();
                            mdxnry[dkey].push(mvcolxn[k].Value);
                        };
                    };
                };
            }
            catch (ex) {
                alert("prwebmetrics.staffing.computeStaffModel reports " + ex.Message);
            }
            return;
        },

        _populateStaffingDerivedBindings: function () {
            try {
                var self = this;
                if (ko.bindingHandlers.staffingderived == undefined) {
                    ko.bindingHandlers.staffingderived = {
                        init: function (element, valueAccessor) {
                            return;
                        },
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                            try {
                                var value = valueAccessor();
                                var valplain = ko.unwrap(value);
                                if (valplain !== undefined) {
                                    var mydomain = viewModel.domaininfos[0];
                                    mydomain.computederived();
                                    var totalstaffcost = mydomain.DomainMetricColxn[1].MetricInfo.MetricValueItem.Value;
                                    var totalstaffcount = mydomain.DomainMetricColxn[0].MetricInfo.MetricValueItem.Value;
                                    var maxstaffcount = mydomain.DomainMetricColxn[2].MetricInfo.MetricValueItem.Value;
                                    var $staffbars = $(".staffcountbar", self.element);
                                    for (var i = 0; i < $staffbars.length; i++) {
                                        var kodata = ko.dataFor($staffbars[i]);
                                        var mvc = kodata.currenthorizonitem(); //HorizonItemColxn()[0]; //should be metricvaluecolxn
                                        var mvi = mvc.MetricValueColxn[0];
                                        var count = ko.unwrap(mvi.Value); //should be count metric...
                                        var pct = (parseFloat(count) / maxstaffcount) * 100;
                                        var pctstr = parseFloat(pct).toString() + "%"
                                        $staffbars.eq(i).css("width", pctstr);
                                    };
                                    prweb.dashboardsvc.Vmx.realizeobjects.cost(totalstaffcost);
                                    var totaldeployablehrs = mydomain.DomainMetricColxn[3].MetricInfo.MetricValueItem.Value;
                                    var deployablernd = Math.round(totaldeployablehrs / 1000) * 1000;
                                    prweb.dashboardsvc.Vmx.realizeobjects.totaldeployable(deployablernd);
                                    var rnded = Math.ceil(totaldeployablehrs / 10000) * 10000;
                                    prweb.dashboardsvc.Vmx.realizeobjects.axisranges.y(rnded);
                                }
                            }
                            catch (ex) {
                                alert("prwebmetrics.staffing.staffderived.update  reports " + ex.Message);
                            }
                            return;
                        }
                    };
                }
            }
            catch (ex) {
                alert("prwebmetrics.staffing.populateStaffingDerivedBindings  reports " + ex.Message);
            }
            return;

        },
        _populateStaffingXeventBindings: function () {
            var myxevent = this.xevent;
            try {
                if (ko.bindingHandlers.staffingxevent == undefined) {
                    ko.bindingHandlers.staffingxevent = {
                        init: function (element, valueAccessor) {
                            var $eelem = $(element);
                            switch (true) {
                                //                                case ($eelem.hasClass("staffingrefresh")):         
                                //                                    $eelem.on(myxevent, function (e) {         
                                //                                        try {         
                                //                                            e.preventDefault();         
                                //                                            e.stopPropagation();         
                                //                                            e.cancelBubble = true;         
                                //                                            prweb.showClick(this);         
                                //                                            var tx = setTimeout(function () {         
                                //                                                try {         
                                //                                                    prweb.dashboardsvc.Vmx.updatestaffingchange();         
                                //                                                }         
                                //                                                catch (ex) {         
                                //                                                    alert("prwebmetrics.staffing.staffingrefresh.click reports " + ex.Message);         
                                //                                                }         
                                //                                                clearTimeout(tx);         
                                //                                                tx = null;         
                                //                                                return;         
                                //                                            }, 200);         
                                //                                            //navigate to selected thing...         
                                //                                        }         
                                //                                        catch (ex) {         
                                //                                            alert("prwebmetrics.staffing.metricsselectbtn.clickhandler reports " + ex.Message);         
                                //                                        }         
                                //                                        return false;         
                                //                                    });         
                                //                                    break         
                                case ($eelem.hasClass("staffingrootcollapseable")):
                                    $eelem.on(myxevent, function (e) {
                                        try {
                                            e.preventDefault();
                                            e.cancelBubble = true;
                                            prweb.showClick(this);
                                            var tx = setTimeout(function () {
                                                try {
                                                    $("#realizationstaffingroot").toggleClass("realizerootminimize").toggleClass("dashboardregionlefthalf");
                                                    $("#realizationrenticleroot").toggleClass("dashboardregionwide").toggleClass("dashboardfillright");
                                                }
                                                catch (ex) {
                                                    alert("prwebmetrics.staffing.staffingallcollapseable.click reports " + ex.Message);
                                                }
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                            //navigate to selected thing...
                                        }
                                        catch (ex) {
                                            alert("prwebmetrics.staffing.staffingallcollapseable.clickhandler reports " + ex.Message);
                                        }
                                        return false;
                                    });
                                    break;
                                case ($eelem.hasClass("staffingcollapseable")):
                                    $eelem.on(myxevent, function (e) {
                                        try {
                                            e.preventDefault();
                                            e.cancelBubble = true;
                                            var $this = $(this);
                                            prweb.showClick($this.parent()[0]);
                                            var tx = setTimeout(function () {
                                                try {
                                                    $this.siblings(".staffingmetricscolxnregion").toggle();
                                                }
                                                catch (ex) {
                                                    alert("prwebmetrics.staffing.staffingcollapseable.click reports " + ex.Message);
                                                }
                                                $this = null;
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                            //navigate to selected thing...
                                        }
                                        catch (ex) {
                                            alert("prwebmetrics.staffing.metricsselectbtn.clickhandler reports " + ex.Message);
                                        }
                                        return false;
                                    });
                                    break;
                                case ($eelem.hasClass("staffingmetricscollapse")):
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
                                                    alert("prwebmetrics.staffing.staffingmetricscollapse.click reports " + ex.Message);
                                                }
                                                $this = null;
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                        }
                                        catch (ex) {
                                            alert("prwebmetrics.staffing.staffingmetricscollapse.clickhandler reports " + ex.Message);
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
                alert("prwebmetrics.staffing.PopulateStaffingXeventBindings  reports " + ex.Message);
            }
            return;
        },

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $(".staffingcollapseable").off(this.xevent);
                    $(".staffingmetricscollapse").off(this.xevent);
                    $(".staffingrefresh").off(this.xevent);
                    ko.bindingHandlers.staffingderived = null;
                    if (prweb.IsTouch) {
                        $("#staffingsvgroot").off("touchstart", function () { });
                    };
                }
                catch (ex) {
                    alert("prwebmetrics.staffing.dispose reports error " + ex.Message);
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
                alert("prwebmetrics.staffing.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
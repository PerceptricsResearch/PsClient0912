/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.realizeddashbd', {

        options: {
            isDisposed: false,
            id: 0
        },

        xevent: "click.realizeddashbd",


        _create: function () {
            var myclass = "realizeddashbd";
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.realizeddashbd";
                    $("#metricscontent").on("touchstart", function () { }); //fixes ios scrolling touch problem that screws with tap events on descendants.
                }
                $("#metricscontextsetroot").metricscontextset(); //these widgets set up custom bindings for their event handlers...have to be active before applyBindings...
                $("#staffingroot").staffing(); //these widgets set up custom bindings for their event handlers...have to be active before applyBindings...
                $("#realizationrenticalroot").realize(); //these widgets set up custom bindings for their event handlers...have to be active before applyBindings...
                prweb.dashboardsvc.Initialize(ko.contextFor(this.element[0]).$data.dashboard);
                var konode = this.element;
                ko.applyBindings(prweb.dashboardsvc.Vmx, konode[0]);
                konode = null;
                this._populateBackCancelHandler();
                this._populateEditDoneHandler();
            }
            catch (ex) {
                alert("prwebmetrics.realizeddashbd.create reports " + ex.Message);
            }
            return;
        },

        _populateBackCancelHandler: function () {
            try {
                $("#realizedashboardbackcancel").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        var tx = setTimeout(function () {
                            try {
                                prweb.dashboardsvc.RealizeDashboardBackCancelAction();
                            }
                            catch (ex) {
                                alert("prwebmetrics.realizeddashbd.backcancel.click reports " + ex.Message);
                            }
                            clearTimeout(tx);
                            tx = null;
                            return;
                        }, 200);
                    }
                    catch (ex) {
                        alert("prwebmetrics.realizeddashbd.create reports " + ex.Message);
                    }
                    return false;
                });
            }
            catch (ex) {
                alert("prwebmetrics.realizeddashbd.create reports " + ex.Message);
            }
            return;
        },

        _populateEditDoneHandler: function () {
            try {
                $("#realizedashboarddoneedit").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        var tx = setTimeout(function () {
                            try {
                                prweb.dashboardsvc.RealizeDashboardEditDoneAction();
                            }
                            catch (ex) {
                                alert("prwebmetrics.realizeddashbd.doneedit.click reports " + ex.Message);
                            }
                            clearTimeout(tx);
                            tx = null;
                            return;
                        }, 200);
                    }
                    catch (ex) {
                        alert("prwebmetrics.realizeddashbd.create reports " + ex.Message);
                    }
                    return false;
                });
            }
            catch (ex) {
                alert("prwebmetrics.realizeddashbd.create reports " + ex.Message);
            }
            return;
        },

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#realizedashboardbackcancel").off(this.xevent);
                    $("#realizedashboarddoneedit").off(this.xevent);
                    prweb.dashboardsvc.Vmx.dispose();
                    if (prweb.IsTouch) {
                        $("#metricscontent").off("touchstart");
                    }
                }
                catch (ex) {
                    alert("prwebmetrics.realizeddashbd.dispose reports error " + ex.Message);
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
                alert("prwebmetrics.realizeddashbd.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
            return;
        }

        //#endregion
    });
} (this.prweb, jQuery));
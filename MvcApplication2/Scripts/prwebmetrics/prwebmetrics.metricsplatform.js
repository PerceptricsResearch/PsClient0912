/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.metricsplatform', {

        options: {
            dashboardcolxnUrl: false,
            metricsservice: false,
            subscriberemail: false,
            pgzeroURL: false,
            domaindxnry: false,
            baseurlcolxn: false,
            commentUrl: false,
            metricshearbeatURL: false,
            isDisposed: false,
            domain: false,
            id: 0
        },

        xevent: "click.metricsplatform",

        _create: function () {
            var myclass = "metricsplatform";
            try {
                prweb.Platform = "metrics";
                prweb.appmessagesvc.Initialize();
                prweb.setUpKOImageBinding();
                prweb.InitWindowFrame();
                prweb.metricsplatformsvc.DashboardResourcesDxnry["dashboardcolxnroot"] = $("#metricshomecenterpanel").html();
                if (prweb.IsTouch) {
                    try {
                        prweb.gestureizer.DesignInitialize();
                        this.xevent = "tap.metricsplatform";
                        //                    this._widgetizePinchPanZoom();
                        //                    this._populateSwipeGestureHandler();
                    }
                    catch (ex) {
                        alert("prwebmetrics.metricsplatform.create.touch reports " + ex.Message);
                    }
                }
                this._populateAppBarBtns();
                prweb.flex.viewresizer.resizeAction();
                prweb.metricsplatformsvc.xevent = this.xevent;
                prweb.metricsplatformsvc.dashboardcolxnUrl = this.options.dashboardcolxnUrl;
                prweb.metricsplatformsvc.RetrieveDashboardColxn();

            }
            catch (ex) {
                alert("prwebmetrics.metricsplatform.create reports " + ex.Message);
            }
            return;
        },





        _populateAppBarBtns: function () {
            try {
                var client = new Dropbox.Client({
                    key: "28qj9b5c81p7tuq"
                });
                client.authenticate({
                    interactive: false
                },
                            function (error) {
                                if (error) {
                                    //?whats this here..
                                    alert("Dropbox could not authenticate your account.");
                                    //                            that.Vmx.message("Dropbox could not authenticate your account.");
                                }
                                //                        return;
                            });
                $("#metricsprwuploadbtn").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        var tx = setTimeout(function () {
                            try {
                                prweb.metricsplatformsvc.ManageUploadView();
                            }
                            catch (ex) {
                                alert("prwebmetrics.metricsplatform.uploadbtn.click reports " + ex.Message);
                            }
                            clearTimeout(tx);
                            tx = null;
                            return;
                        }, 200);
                    }
                    catch (ex) {
                        alert("prwebmetrics.metricsplatform.create reports " + ex.Message);
                    }
                    return false;
                });
                $("#metricsprwdbxlinkbtn").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        e.cancelBubble = true;
                        prweb.showClick(this);

                        var tx = setTimeout(function () {
                            try {
                                client.authenticate();
                                //                                prweb.contextdocsvc.Vmx.authenticate(); //Initialize();
                            }
                            catch (ex) {
                                alert("prwebmetrics.metricsplatform.dropboxlink.click reports " + ex);
                            }
                            clearTimeout(tx);
                            tx = null;
                            return;
                        }, 200);
                    }
                    catch (ex) {
                        alert("prwebmetrics.metricsplatform.dropboxlink.create reports " + ex.Message);
                    }
                    return false;

                });
            }
            catch (ex) {
                alert("prwebmetrics.metricsplatform.populateAppBarBtns reports " + ex.Message);
            }
            return;
        },



        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {

                }
                catch (ex) {
                    alert("prwebmetrics.metricsplatform.dispose reports error " + ex.Message);
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
                alert("prwebmetrics.metricsplatform.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
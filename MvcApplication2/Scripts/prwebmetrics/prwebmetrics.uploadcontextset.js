/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.uploadcontextset', {

        options: {
            isDisposed: false,
            id: 0
        },

        xevent: "click.uploadcontextset",

        _create: function () {
            try {
                if (prweb.IsTouch) {
                    try {
                        this.xevent = "tap.uploadcontextset";
//                        $("#uploadcontextbrowsesubmitarea").css("display", "none");
                    }
                    catch (ex) {
                        alert("prwebmetrics.uploadcontextset.create.touch reports " + ex.Message);
                    }
                }

                var isendb = Dropbox.isBrowserSupported();
                this._populateNavigateBtns();
                this._populateUploadTargetLoadHandler();
                this._populateDropBoxChooserHandler();
                prweb.scrollTo(this.element, "#metricscontent");

            }
            catch (ex) {
                alert("prwebmetrics.uploadcontextset.create reports " + ex.Message);
            }
            return;
        },

        _populateDropBoxChooserHandler: function () {

            if (Dropbox.isBrowserSupported()) {
                try {
                    var button = Dropbox.createChooseButton({
                        success: function (files) {
                            try {
                                $("#db-chooser").val(files[0].link);
                            }
                            catch (ex) {

                            }
                            return;
                        },
                        linkType: "direct",
                        extensions: [".xls", ".xlsx"]
                    });
                    $("#dropboxexceluploadform").append(button)
                        .append('<input id="dropboxuploadbtn" type="submit" value="Upload Dropbox" style="margin-left:0.5em;margin-top:0.5em;width:8em;height:3em;"/> ');
                }
                catch (ex) {

                }
            }
            return;
        },

        _populateNavigateBtns: function () {
            try {
                $("#uploadcontextbackcancelbtn").on(this.xevent, function (e) {
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
                                alert("prwebmetrics.uploadcontextset.backcancel.click reports " + ex.Message);
                            }
                            clearTimeout(tx);
                            tx = null;
                            return;
                        }, 200);
                    }
                    catch (ex) {
                        alert("prwebmetrics.uploadcontextset.create reports " + ex.Message);
                    }
                    return false;
                });
                $("#uploadcontextdonebtn").on(this.xevent, function (e) {
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
                                alert("prwebmetrics.uploadcontextset.done.click reports " + ex.Message);
                            }
                            clearTimeout(tx);
                            tx = null;
                            return;
                        }, 200);
                    }
                    catch (ex) {
                        alert("prwebmetrics.uploadcontextset.done reports " + ex.Message);
                    }
                    return false;
                });
            }
            catch (ex) {
                alert("prwebmetrics.uploadcontextset.done reports " + ex.Message);
            }
            return;
        },

        //#region UploadTargetLoadHandler
        _populateUploadTargetLoadHandler: function () {
            var kodata = ko.dataFor(this.element[0]);
            $("#metricsexceluploadtarget").addClass("uploadcontextset").on("load.uploadcontextset", function (e) {
                var thething = false;
                try {
                    thething = $("#metricsexceluploadtarget").contents().find("#uploadedjsonresult").text();
                    if (thething) {
                        var msg = $.parseJSON(thething).ServerMessage;
                        kodata.message(msg);
                        var success = $.parseJSON(thething).Success;
                        var cntxtdoc = $.parseJSON(thething).ContextDoc;
                        if (success && prweb.dashboardsvc.Vmx.dashboard.ID !== undefined) {
                            prweb.dashboardsvc.MetricsDataContextRetrieveHandler(cntxtdoc);
                        }

                        msg = null;
                    }
                }
                catch (ex) {
                    alert("prwebmetrics.uploadcontextset.UploadTargetLoadHandler reports " + ex.Message);
                }
                e = null;
                thething = null;
                return true;
            });
            //            this.options.dsgnrimagesuploadtarget = null;
        },

        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#uploadcontextbackcancelbtn").off(this.xevent);
                    $("#uploadcontextdonebtn").off(this.xevent);
                    $("#metricsexceluploadtarget").off("load.uploadcontextset");
                }
                catch (ex) {
                    alert("prwebmetrics.uploadcontextset.dispose reports error " + ex.Message);
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
                alert("prwebmetrics.uploadcontextset.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.metricsplatformsvc = (function () {
        var that = {};


        that.logonurl = false;
        that.RestartMetricsPortal = function () {
            try {
                var newUrlBase = prweb.getBaseUrl();
                //could be add region...
                window.location = $.param.fragment(newUrlBase, {});
            }
            catch (ex) {

            }
            return;
        };

        that.DashboardResourcesDxnry = {

        };

        that.NewDomainItem = function () {
            var item = null;
            try {

            }
            catch (ex) {
                alert("prweb.metricsplatformsvc.NewDomainItem reports " + ex.Message);
            }
            return item;
        };

        that.DashboardInfoDxnry = [];

        that.InitializeDashboardInfoDxnry = function (dashboardinfodata) {
            try {
                that.DashboardInfoDxnry = dashboardinfodata.DashboardInfoColxn; //this is an array of JS objects...one for each Dashboard.
            }
            catch (ex) {
                alert("prweb.metricsplatformsvc.InitializeDashboardInfoDxnry  reports " + ex.Message);
            }
            return;
        };



        that.Vmx = {
            regioncolxn: ko.observableArray([]),
            hasregion: function (regionid) {
                var rslt = false;
                try {
                    rslt = Enumerable.From(this.regioncolxn()).Where(function (r) { return r.regionid == regionid }).Any();
                }
                catch (ex) {
                    alert("prweb.metricsplatformsvc.vmx.hasregion reports " + ex.Message);
                }
                return rslt;
            },
            addregion: function (item) {
                try {
                    this.regioncolxn.push(item);
                }
                catch (ex) {
                    alert("prweb.metricsplatformsvc.vmx.addregion reports " + ex.Message);
                }
                return;
            },
            clearregions: function () {
                try {
                    var rc = this.regioncolxn();
                    for (var i = 0; i < rc.length; i++) {
                        rc[i].dispose();
                        rc[i] = null;
                    };
                    rc = [];
                    this.regioncolxn(rc);
                }
                catch (ex) {
                    alert("prweb.metricsplatformsvc.vmx.clearregions reports " + ex.Message);
                }
                return;
            },
            removeregion: function (regionid) {
                var rslt = false;
                try {
                    var reg = this.regioncolxn.remove(function (r) { return r.regionid == regionid });
                    if (reg.length > 0) {
                        reg[0].dispose();
                        rslt = true;
                    }
                }
                catch (ex) {
                    alert("prweb.metricsplatformsvc.vmx.removeregion reports " + ex.Message);
                }
                return rslt;
            },
            populate: function () {
                return;
            },
            dispose: function () {
                return;
            }
        };

        that.SelectDashboard = function (dbdguid) {
            try {
                var state = {
                    layout: "dashboard",
                    gid: dbdguid
                };
                var newUrlBase = prweb.getBaseUrl();
                //could be add region...
                window.location = $.param.fragment(newUrlBase, state);
            }
            catch (ex) {
                alert("prweb.metricsplatformsvc.SelectDashboard reports " + ex.Message);
            }
            return;
        };

        that.ManageUploadView = function () {
            try {
                if (!that.Vmx.hasregion("uploadcontextset")) {
                    that.Vmx.addregion({
                        dispose: function () {
                            return;
                        },
                        regionid: "uploadcontextset",
                        title: "Upload Excel Context Set Documents",
                        message: ko.observable("Browse your files for the Excel document you want to upload to the Metrics Portal. Press Done when you have selected your Excel document and are ready to send it."),
                        editcontext: {
                            isediting: ko.observable(false),
                            isdirty: ko.observable(false)
                        },
                        buttons: {
                            backcancel: ko.observable("Back"),
                            editdone: ko.observable("Done")
                        },
                        dropboxfile: ko.observable(),
                        displayTemplate: "uploadcontextset"
                    });
                    //                    prweb.appmessagesvc.PopulateViewMessage("Upload Excel based context set documents.");
                    $("#uploadcontextsetroot").uploadcontextset();
                }
                else {
                    that.Vmx.removeregion("uploadcontextset");
                }
            }
            catch (ex) {
                alert("prweb.metricsplatformsvc.ShowUploadView reports " + ex.Message);
            }
            return;
        };

        that.ShowDashboardsColxn = function () {
            try {
                that.Vmx.clearregions();
                that.Vmx.addregion({
                    dispose: function () {
                        this.dashboards = null;
                        return;
                    },
                    regionid: "dashboardcolxn",
                    title: "Available Dashboards",
                    displayTemplate: "dashboardcolxn",
                    isattached: true,
                    dashboards: that.DashboardInfoDxnry
                });
                $(document).attr("title", "Metrics Home ");
                prweb.appmessagesvc.PopulateViewMessage("Select a dashboard using the Select button.");
            }
            catch (ex) {
                alert("prweb.metricsplatformsvc.ShowDashboardsColxn reports " + ex.Message);
            }
            return;
        };

        that.ShowSegmentsColxn = function () {
            var segments = that.DashboardInfoDxnry[0].SegmentInfoColxn;
            for (var i = 0; i < segments.length; i++) {
                that.Vmx.addregion({
                    regionid: segments[i].Name,
                    title: segments[i].Name,
                    displayTemplate: "segmentcolxn",
                    segmentoptions: segments[i].OptionColxn
                })
            }
            segments = null;
            return;
        };

        that.ShowDashboard = function (dashboardid) {
            try {
                var dshbd = Enumerable.From(that.DashboardInfoDxnry).Where(function (d) {
                    return d.Guid == dashboardid
                }).FirstOrDefault();
                if (dshbd !== undefined) {
                    var myurl = dshbd.ViewUrl || false;
                    if (myurl) {
                        prweb.appmessagesvc.PopulateViewMessage(dshbd.Name + " is loading...please wait.");
                        prweb.dataManager.sendRequest({
                            url: myurl,
                            dataType: 'html',
                            type: 'GET',
                            success: function (dashboardhtml) {
                                try {
                                    that.Vmx.addregion({
                                        dispose: function () {
                                            this.dashboard = null;
                                            return;
                                        },
                                        regionid: "dashboardactive",
                                        title: dshbd.Name,
                                        displayTemplate: "dashboardplaceholder",
                                        isattached: true,
                                        html: dashboardhtml,
                                        dashboard: dshbd
                                    });
                                    $(document).attr("title", "Metrics: " + dshbd.Name);
                                    prweb.appmessagesvc.PopulateViewMessage(dshbd.Name + " displaying default metrics set.");
                                }
                                catch (ex) {
                                    alert("prweb.metricsplatformsvc.ShowDashboard.viewhtml.successhandler reports " + ex.Message);
                                }
                                return;
                            },
                            error: function (e) {
                                alert("prweb.metricsplatformsvc.RetrieveDashboardColxn.sendRequest reports error..." + e.error().toString());
                            }
                        });
                    }
                    else {
                        var newUrlBase = prweb.getBaseUrl();
                        //could be add region...
                        window.location = $.param.fragment(newUrlBase, {});
                    }
                }
                else {
                    var newUrlBase = prweb.getBaseUrl();
                    //could be add region...
                    window.location = $.param.fragment(newUrlBase, {});
                }
            }
            catch (ex) {
                alert("prweb.metricsplatformsvc.ShowDashboard reports " + ex.Message);
            }
            return;
        };

        that.ChangeLayout = function () {
            try {
                var state = $.deparam.fragment(true);
                if (!state.layout) {
                    that.ShowDashboardsColxn();
                }
                else {
                    that.Vmx.clearregions();
                    switch (true) {
                        case (state.layout == "dashboard" && state.gid !== undefined):
                            that.ShowDashboard(state.gid);
                            break;
                        case (true):
                            that.ShowDashboardsColxn();
                            break;
                    }
                }
            }
            catch (ex) {
                alert("prweb.metricsplatformsvc.ChangeLayout reports " + ex.Message);
            }
            return;
        };

        that.SubscribetoHashChange = function (e) {
            $(window).on('hashchange.metricsplatform', that.ChangeLayout);
        };

        //#region RetrieveDomainColxn and Url
        that.xevent = false;
        that.PopulateMetricsXeventBindings = function () {
            try {
                if (ko.bindingHandlers.metricsxevent == undefined) {
                    ko.bindingHandlers.metricsxevent = {
                        init: function (element, valueAccessor) {
                            var $eelem = $(element);
                            switch (true) {
                                case ($eelem.hasClass("metricsselectbtn")):
                                    $eelem.on(that.xevent, function (e) {
                                        try {
                                            e.preventDefault();
                                            e.cancelBubble = true;
                                            prweb.showClick(this);
                                            var dbdguid = ko.dataFor(this).Guid; //.methods.edit();
                                            var tx = setTimeout(function () {
                                                try {
                                                    prweb.metricsplatformsvc.SelectDashboard(dbdguid);
                                                }
                                                catch (ex) {
                                                    alert("prweb.metricsplatformsvc.metricsselectbtn.click.navigate reports " + ex.Message);
                                                }
                                                dbdguid = null;
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                            //navigate to selected thing...
                                        }
                                        catch (ex) {
                                            alert("prweb.metricsplatformsvc.metricsselectbtn.clickhandler reports " + ex.Message);
                                        }
                                        return false;
                                    });
                                    break;
                            };
                            return;
                        },
                        update: function (element, valueAccessor) {
                            var rslt = 2;
                            return;
                        }
                    };
                }
            }
            catch (ex) {
                alert("prweb.metricsplatformsvc.PopulateMetricsXeventBindings  reports " + ex.Message);
            }
            return;
        };

        that.dashboardcolxnUrl = false;

        that.RetrieveDashboardColxn = function () {
            try {
                var konode = $("#dashboardcolxnregionscontainer");
                ko.applyBindings(that.Vmx, konode[0]);
                konode = null;
                var myurl = that.dashboardcolxnUrl;
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        success: function (dashboardinfodata) {
                            try {
                                that.DashboardInfoDxnry = [];
                                that.InitializeDashboardInfoDxnry(dashboardinfodata); //.domaininfopkg.DomainInfoColxn);
                                //                                that.Vmx.addregion("dashboardcolxn");
                                that.PopulateMetricsXeventBindings();
                                that.ShowDashboardsColxn();
                                if (prweb.IsTouch) {
                                    //                                    $("#notecommenthomeroot").css('-webkit-transform', ' translate3d(0,0,0)');
                                }
                                that.SubscribetoHashChange();
                                dashboardinfodata = null;
                            }
                            catch (ex) {
                                alert("prweb.metricsplatformsvc.RetrieveDashboardColxn.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.metricsplatformsvc.RetrieveDashboardColxn.sendRequest reports error..." + e.error().toString());
                        }
                    });
                }
                else {
                    alert("prweb.metricsplatformsvc.RetrieveDashboardColxn reports retrieve url is false.");
                }
            }
            catch (ex) {
                alert("prweb.metricsplatformsvc.RetrieveDashboardColxn  reports " + ex.Message);
            }
            return;
        };
        //#endregion

        return that;

    } ());
} (this.prweb = this.prweb || {}, jQuery));
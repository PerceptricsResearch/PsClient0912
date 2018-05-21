/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.dashboardsvc = (function () {
        var that = {};

        that.Dashboard = false;

        //        that.MetricsContextDataDxnry = [];

        that.DerivedMetricsSvc = {
            computederived: function () {
                var rslt = 0;
                try {
                    this.MetricsObs([]);
                    //set all the domainmetrics to zero..
                    for (var x = 0; x < this.DomainMetricColxn.length; x++) {
                        this.DomainMetricColxn[x].MetricInfo.MetricValueItem.Value = 0;
                    }
                    //spin thru all the mvi's in the componentinforcolxn
                    var cdxnry = this.ComponentInfoColxn;
                    for (var i = 0; i < cdxnry.length; i++) {
                        var hcolxn = cdxnry[i].currenthorizonitem(); //HorizonItemColxn();
                        if (hcolxn.MetricValueColxn !== undefined) {
                            var mvcolxn = hcolxn.MetricValueColxn; //hcolxn[j].MetricValueColxn;
                            for (var k = 0; k < mvcolxn.length; k++) {
                                var dkey = mvcolxn[k].MetricInfoID.toString();
                                for (var d = 0; d < this.DomainMetricColxn.length; d++) {
                                    var includediddxnry = this.DomainMetricColxn[d].IncludedMetricInfoColxn[dkey];
                                    if (includediddxnry !== undefined) {
                                        var method = this.DomainMetricColxn[d].Method;
                                        this[method](this.DomainMetricColxn[d].MetricInfo, ko.unwrap(mvcolxn[k].Value));
                                    }
                                }
                            };
                        }
                    };
                    var mobs = [];
                    for (var m = 0; m < this.DomainMetricColxn.length; m++) {
                        if (this.DomainMetricColxn[m].IsVisible) {
                            mobs.push(this.DomainMetricColxn[m]);
                        }
                    }
                    this.MetricsObs(mobs); //this.DomainMetricColxn);
                    //                    this.MetricsObs.valueHasMutated();
                }
                catch (ex) {
                    var x = 2;
                }
                return rslt;
            },
            sum: function (metricinfoitem, mvivalue) {
                var rslt = 0;
                try {
                    //i want to know what this is each time this gets called
                    metricinfoitem.MetricValueItem.Value += parseFloat(mvivalue);
                    rslt = metricinfoitem.MetricValueItem.Value;
                }
                catch (ex) {
                    var x = 2;
                }
                return rslt;
            },
            max: function (metricinfoitem, mvivalue) {
                var rslt = 0;
                try {
                    //i want to know what this is each time this gets called
                    if (metricinfoitem.MetricValueItem.Value < parseFloat(mvivalue)) {
                        metricinfoitem.MetricValueItem.Value = parseFloat(mvivalue);
                    }
                    rslt = metricinfoitem.MetricValueItem.Value;
                }
                catch (ex) {
                    var x = 2;
                }
                return rslt;
            },
            avg: function () {
                var rslt = 0;
                try {
                    //i want to know what this is each time this gets called
                    var mythis = this;
                }
                catch (ex) {
                    var x = 2;
                }
                return rslt;
            }
        };

        that.NewPeriod = function (nm, per) {
            var rslt = {
                periodname: nm,
                period: per
            };
            return rslt;
        };

        that.Vmx = {
            toobservable: function (horizitem) {
                if (horizitem !== undefined) {
                    for (var m = 0; m < horizitem.MetricValueColxn.length; m++) {
                        if (typeof horizitem.MetricValueColxn[m].Value !== "function") {
                            var value = ko.unwrap(horizitem.MetricValueColxn[m].Value);
                            horizitem.MetricValueColxn[m].Value = ko.observable(value);
                        }
                    };
                    if (typeof horizitem.IsEdit !== "function") {
                        horizitem.IsEdit = ko.observable(that.Vmx.editcontext.isediting());
                    }
                    horizitem.IsEdit(that.Vmx.editcontext.isediting());
                }
                return horizitem;
            },
            currenthorizonitemstoobservable: function (isediting) {
                try {
                    var spincolxn = function (cicolxn) {
                        for (var i = 0; i < cicolxn.length; i++) {
                            that.Vmx.toobservable(cicolxn[i].currenthorizonitem());
                        };
                        return true;
                    };
                    var xjunk = Enumerable.From(this.domaininfos).Select(function (di) {
                        return spincolxn(di.ComponentInfoColxn)
                    }).ToArray();
                    xjunk = null;
                }
                catch (ex) {

                }
                return;
            },
            editcontext: {
                isediting: ko.observable(false),
                isdirty: ko.observable(false)
            },
            iseditingchanged: function (newval) {
                try {
                    //                    if (newval) {
                    this.currenthorizonitemstoobservable();
                    if (newval) {
                        this.buttons.editdone("Done");
                        this.buttons.backcancel("Cancel");
                    }
                    else {
                        this.buttons.editdone("Edit");
                        this.buttons.backcancel("Back");
                    }
                    //                    }
                }
                catch (ex) {
                    alert("prwebmetrics.dashboardsvc.Vmx.iseditingchanged reports " + ex.Message);
                }
                return;
            },
            isdirtychanged: function (newval) {
                try {

                }
                catch (ex) {
                    alert("prwebmetrics.dashboardsvc.Vmx.isdirtychanged reports " + ex.Message);
                }
                return;
            },
            buttons: {
                editdone: ko.observable("Edit"),
                backcancel: ko.observable("Back")
            },
            regioncolxn: ko.observableArray([]),
            dashboard: {},
            domaininfos: {},
            periodmanager: {
                newperiod: function (per) {
                    var ndx = Math.floor(per / 2);
                    var nm = prweb.strings.shortMonths[ndx];
                    if (per % 2 == 0) {
                        nm = nm + " 15 ";
                    }
                    else {
                        nm = nm + " " + prweb.strings.lastDay[ndx];
                    }
                    var rslt = {
                        periodname: nm,
                        period: per
                    };
                    return rslt;
                },
                availableperiods: ko.observableArray([]),
                currentperiod: ko.observable(),
                initialize: function (prdinfo) {
                    var periods = [];
                    for (var i = 0; i < prdinfo.PeriodsCount; i++) {
                        periods.push(this.newperiod(i))
                    }
                    this.availableperiods(periods);
                    return;
                },
                dispose: function () {
                    this.availableperiods([]);
                }
            },

            currentperiodchanged: function (newval) {
                try {
                    var updatestaffing = false;
                    var spincolxn = function (cicolxn) {
                        for (var i = 0; i < cicolxn.length; i++) {
                            var ndx = 0;
                            var hicolxn = cicolxn[i].HorizonItemColxn();
                            for (var j = 0; j < hicolxn.length; j++) {
                                if (hicolxn[j].Period <= newval.period) {
                                    ndx = j;
                                    updatestaffing = true;
                                }
                            };
                            cicolxn[i].currenthorizonitem(that.Vmx.toobservable(hicolxn[ndx]));
                        };
                        return true;
                    };
                    Enumerable.From(this.domaininfos).Select(function (di) {
                        return spincolxn(di.ComponentInfoColxn)
                    }).ToArray();
                    if (updatestaffing) {
                        this.updatestaffingchange();
                        this.updaterealizechange();
                    }
                }
                catch (ex) {
                    alert("prwebmetrics.dashboardsvc.Vmx.currentperiodchanged reports " + ex.Message);
                }
                return;
            },
            currentmetricscontext: ko.observable(),
            currentmetricscontextchanged: function (newval) {
                var csel = newval.ContextSelection; //is a bitmask...using AND below...
                for (var k = 0; k < this.dashboard.SegmentInfoColxn.length; k++) {
                    var bstr = this.dashboard.SegmentInfoColxn[k].DefaultBrushStr;
                    for (var j = 0; j < this.dashboard.SegmentInfoColxn[k].OptionColxn.length; j++) {
                        this.dashboard.SegmentInfoColxn[k].OptionColxn[j].IsSelected = false;
                        bstr = this.dashboard.SegmentInfoColxn[k].DefaultBrushStr;
                        if (csel & (this.dashboard.SegmentInfoColxn[k].OptionColxn[j].EnumValue)) {
                            this.dashboard.SegmentInfoColxn[k].OptionColxn[j].IsSelected = true;
                            bstr = this.dashboard.SegmentInfoColxn[k].SelectedBrushStr;
                        }
                        this.dashboard.SegmentInfoColxn[k].OptionColxn[j].BrushStr(bstr);
                    };
                };
                return;
            },
            createcontextdocument: {},
            availabledocumentstemplate: ko.observable(),
            availablecontexts: ko.observableArray([]),
            addregion: function (item) {
                try {
                    this.regioncolxn.push(item);
                }
                catch (ex) {
                    alert("prweb.metricsplatformsvc.vmx.addregion reports " + ex.Message);
                }
                return;
            },
            staffing: true,
            realize: true,
            metricscontextset: true,
            computederived: function () {

            },
            staffingchange: ko.observable(),
            updatestaffingchange: function () {
                var d = new Date();
                var ds = d.toLocaleTimeString();
                d = null;
                this.staffingchange(ds); //this makes a custom binding on  staffing.js fire...
                return;
            },
            realizeobjects: {
                cost: ko.observable(),
                totaldeployable: ko.observable(0),
                axisranges: {
                    x: ko.observable(500),
                    y: ko.observable(50000)
                },
                revenueobject: {
                    xdisplayvalue: ko.observable(0),
                    ydisplayvalue: ko.observable(0),
                    contributiondisplayvalue: ko.observable(0),
                    revenuedisplayvalue: ko.observable(0),
                    impliedutilization: ko.observable(0),
                    compute: function (rev, cost, util) {
                        var contr = Math.round((rev - cost) / 1000) * 1000;
                        this.revenuedisplayvalue(rev / 1000);
                        this.contributiondisplayvalue(contr / 1000);
                        if (util !== undefined) {
                            this.impliedutilization(util);
                        }
                    }
                },
                axisxmarker: {
                    currentposition: ko.observable(200),
                    visible: ko.observable(true)
                },
                axisymarker: {
                    currentposition: ko.observable(1200),
                    visible: ko.observable(true)
                },
                xaxislabels: ko.observableArray([]),
                yaxislabels: ko.observableArray([]),
                testlines: ko.observableArray([]),
                testparms: ko.observableArray([]),
                parameters: ko.observableArray([]),
                plots: ko.observableArray([]),
                points: ko.observableArray([]),
                controlpoints: ko.observableArray([]),
                renticleposition: ko.observable("translate(0,0)"),
                paths: ko.observableArray([]),
                pathd: ko.observable("m200,200 C200 800, 600 1200, 1200 1200")
            },
            realizechange: ko.observable(),
            updaterealizechange: function () {
                var d = new Date();
                var ds = d.toLocaleTimeString();
                d = null;
                this.realizechange(ds); //this makes a custom binding on  staffing.js fire...
                return;
            },
            subscriptions: [],
            populate: function (dboard) {
                try {
                    this.dashboard = dboard;
                    this.periodmanager.initialize(dboard.PeriodInfo);
                    this.subscriptions.push(this.periodmanager.currentperiod.subscribe(this.currentperiodchanged, this));
                    this.domaininfos = dboard.DomainInfoColxn;
                    for (var i = 0; i < this.domaininfos.length; i++) {
                        for (var m in that.DerivedMetricsSvc) {
                            this.domaininfos[i][m] = that.DerivedMetricsSvc[m];
                        }
                        this.domaininfos[i].MetricsObs = ko.observableArray(this.domaininfos[i].DomainMetricColxn);
                    };
                    //Make ComponentInfos.HorizonItemColxn an ObservableArray
                    //Make ComponentInfos.Name observable
                    var spincolxn = function (cicolxn) {
                        for (var i = 0; i < cicolxn.length; i++) {
                            var nm = cicolxn[i].Name;
                            cicolxn[i].Name = ko.observable(nm);
                            cicolxn[i].HorizonItemColxn = ko.observableArray([]);
                            cicolxn[i].currenthorizonitem = ko.observable();
                        }
                        return true;
                    };
                    var componentdxnry = Enumerable.From(this.domaininfos).Select(function (di) {
                        return spincolxn(di.ComponentInfoColxn)
                    }).ToArray();
                    componentdxnry = null;
                    spincolxn = null;
                    for (var k = 0; k < this.dashboard.SegmentInfoColxn.length; k++) {
                        //                        this.dashboard.SegmentInfoColxn[i].metricscontextTemplate = ko.observable();
                        for (var j = 0; j < this.dashboard.SegmentInfoColxn[k].OptionColxn.length; j++) {
                            var bstr = this.dashboard.SegmentInfoColxn[k].OptionColxn[j].BrushStr;
                            this.dashboard.SegmentInfoColxn[k].OptionColxn[j].BrushStr = ko.observable(bstr);
                        };
                    };
                    that.Vmx.editcontext.isediting(false);
                    that.Vmx.editcontext.isdirty(false);
                    this.subscriptions.push(this.editcontext.isediting.subscribe(this.iseditingchanged, this));
                    this.subscriptions.push(this.editcontext.isdirty.subscribe(this.isdirtychanged, this));
                    this.subscriptions.push(this.currentmetricscontext.subscribe(this.currentmetricscontextchanged, this));
                    this.periodmanager.currentperiod(this.dashboard.PeriodInfo.DefaultPeriod);
                }
                catch (ex) {
                    alert("prwebmetrics.dashboardsvc.Vmx.populate reports " + ex.Message);
                }
                return;
            },
            dispose: function () {
                try {
                    for (var j = 0; j < this.subscriptions.length; j++) {
                        this.subscriptions[j].dispose();
                    };
                    this.subscriptions = [];
                    that.Vmx.editcontext.isediting(false);
                    that.Vmx.editcontext.isdirty(false);
                    this.regioncolxn([]);
                    this.dashboard = {
                    };
                    this.domaininfos = {
                    };
                    this.createcontextdocument = {
                    };
                    this.availablecontexts([]);
                    this.periodmanager.dispose();
                }
                catch (ex) {
                    alert("prwebmetrics.dashboardsvc.Vmx.dispose reports " + ex.Message);
                }
                return;
            }
        };

        //#region RetrieveMetricsDataContext
        that.PopulateComponentInfoswithHorizonItems = function (metricscontextdata) {
            try {
                var spincolxn = function (cicolxn) {
                    for (var i = 0; i < cicolxn.length; i++) {
                        var dxnrykey = cicolxn[i].ID.toString();
                        cicolxn[i].HorizonItemColxn(metricscontextdata[dxnrykey].HorizonItemColxn);
                        cicolxn[i].Name(metricscontextdata[dxnrykey].Name);
                    };
                    return true;
                };
                var componentdxnry = Enumerable.From(that.Vmx.domaininfos).Select(function (di) {
                    return spincolxn(di.ComponentInfoColxn)
                }).ToArray();
            }
            catch (ex) {
                alert("prwebmetrics.dashboardsvc.PopulateComponentInfoswithHorizonItems reports " + ex.Message);
            }
            return;
        };
        that.metricsdatacontextUrl = false;

        that.MetricsDataContextRetrieveHandler = function (metricscontextdata) {
            try {
                //                that.MetricsContextDataDxnry = [];
                that.PopulateComponentInfoswithHorizonItems(metricscontextdata.ComponentSeriesDxnry);

                that.Vmx.currentmetricscontext(metricscontextdata.ContextInfo);
                var defperiod = that.Vmx.periodmanager.availableperiods()[that.Vmx.dashboard.PeriodInfo.DefaultPeriod - 1];
                that.Vmx.periodmanager.currentperiod(defperiod);

                prweb.appmessagesvc.PopulateViewMessage(metricscontextdata.ContextInfo.Description);
                metricscontextdata = null;
            }
            catch (ex) {
                alert("prwebmetrics.dashboardsvc.RetrieveMetricsDataContext.successhandler reports " + ex.Message);
            }
            return;
        };
        that.RetrieveMetricsDataContext = function () {
            try {
                var myurl = that.metricsdatacontextUrl;
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        success: that.MetricsDataContextRetrieveHandler,
                        error: function (e) {
                            alert("prwebmetrics.dashboardsvc.RetrieveMetricsDataContext.sendRequest reports error..." + e.error().toString());
                        }
                    });
                }
                else {
                    alert("prweb.metricsplatformsvc.RetrieveDashboardColxn reports retrieve url is false.");
                }
            }
            catch (ex) {
                alert("prwebmetrics.dashboardsvc.RetrieveMetricsDataContext reports " + ex.Message);
            }
            return;
        };
        //#endregion

        that.availablecontextsUrl = false;
        that.RetrieveAvailableContexts = function (contextselbmsk) {
            try {
                var myurl = that.availablecontextsUrl;
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        success: function (availcontextdata) {
                            try {
                                var selectedContextInfos = []; //selectedContextInfos should come from contextdocsvc...
                                //contextselbmsk is a bitmask of contextsegmentoptions....
                                if (contextselbmsk !== undefined) {
                                    //this is for testing add newcontextdocument...AddedContextDocuments would be retrieved from server..
                                    for (var a = 0; a < that.AddedContextDocuments.length; a++) {
                                        if (contextselbmsk == that.AddedContextDocuments[a].ContextSelection) {
                                            that.AddedContextDocuments[a].contextdocumenttemplate = "selectablecontextdocument";
                                            that.AddedContextDocuments[a].IsSelected = false;
                                            that.AddedContextDocuments[a].BrushStr = ko.observable("url(#acrbonbrush)");
                                            selectedContextInfos.push(that.AddedContextDocuments[a]);
                                        }
                                    };
                                    for (var j = 0; j < availcontextdata.ContextInfoColxn.length; j++) {
                                        var csbm = (availcontextdata.ContextInfoColxn[j].ContextSelection);
                                        if (contextselbmsk == csbm || csbm == 0) {
                                            var templatestr = "selectablecontextdocument";
                                            var bstr = "url(#acrboffbrush)";
                                            if (csbm == 0) {
                                                templatestr = "newcontextdocument";
                                                availcontextdata.ContextInfoColxn[j].CopyBrushStr = ko.observable("url(#newcontextcopyoffbrush)");
                                                availcontextdata.ContextInfoColxn[j].ContextNamesColxn = ko.observableArray(that.ComputeContextSelectionNamesColxn());
                                                availcontextdata.ContextInfoColxn[j].AsOfDate = "";
                                                availcontextdata.ContextInfoColxn[j].Description = "New Document";
                                            }
                                            availcontextdata.ContextInfoColxn[j].contextdocumenttemplate = templatestr;
                                            availcontextdata.ContextInfoColxn[j].IsSelected = false;
                                            availcontextdata.ContextInfoColxn[j].BrushStr = ko.observable(bstr);
                                            selectedContextInfos.push(availcontextdata.ContextInfoColxn[j]);
                                            if (csbm == 0) {
                                                that.Vmx.createcontextdocument = availcontextdata.ContextInfoColxn[j];
                                            }
                                        }
                                    };
                                    that.Vmx.availablecontexts([]);//selectedContextInfos should come from contextdocsvc...
                                    that.Vmx.availablecontexts(selectedContextInfos);
                                }
                                else {
                                    for (var j = 0; j < availcontextdata.ContextInfoColxn.length; j++) {
                                        var csbm = (availcontextdata.ContextInfoColxn[j].ContextSelection);
                                        if (csbm !== 0) {
                                            var templatestr = "selectablecontextdocument";
                                            var bstr = "url(#createcontextcopyoffbrush)";
                                            availcontextdata.ContextInfoColxn[j].contextdocumenttemplate = templatestr;
                                            availcontextdata.ContextInfoColxn[j].IsSelected = false;
                                            availcontextdata.ContextInfoColxn[j].BrushStr = ko.observable(bstr);
                                            selectedContextInfos.push(availcontextdata.ContextInfoColxn[j]);
                                        }
                                    };
                                    that.Vmx.availablecontexts([]); //selectedContextInfos should come from contextdocsvc...
                                    that.Vmx.availablecontexts(selectedContextInfos);
                                }

                            }
                            catch (ex) {
                                alert("prwebmetrics.dashboardsvc.RetrieveAvailableContexts.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prwebmetrics.dashboardsvc.RetrieveAvailableContexts.sendRequest reports error..." + e.error().toString());
                        }
                    });
                }
                else {
                    alert("prweb.metricsplatformsvc.RetrieveAvailableContexts reports retrieve url is false.");
                }
            }
            catch (ex) {
                alert("prwebmetrics.dashboardsvc.RetrieveAvailableContexts reports " + ex.Message);
            }
            return;
        };

        that.ComputeContextSelectionBitmask = function () {
            var seginfocolxn = that.Vmx.dashboard.SegmentInfoColxn;
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
        that.ComputeContextSelectionNamesColxn = function () {
            var seginfocolxn = that.Vmx.dashboard.SegmentInfoColxn;
            var ncolxn = []; //is a bitmask...using AND below...
            for (var k = 0; k < seginfocolxn.length; k++) {
                for (var j = 0; j < seginfocolxn[k].OptionColxn.length; j++) {
                    if (seginfocolxn[k].OptionColxn[j].IsSelected) {
                        ncolxn.push(seginfocolxn[k].OptionColxn[j].Name);
                    };
                };
            };
            return ncolxn;
        };
        that.NewContextDocumentAction = function () {
            try {
                that.Vmx.availabledocumentstemplate("createcontextdocument");
                $("#createcontextdocumentroot").createcontextdocument();
                that.Vmx.createcontextdocument.ContextNamesColxn(that.ComputeContextSelectionNamesColxn());
                that.Vmx.createcontextdocument.ContextSelection = that.ComputeContextSelectionBitmask();
                that.Vmx.createcontextdocument.CopyBrushStr("url(#createcontextcopyonbrush)");
                that.Vmx.createcontextdocument.IsSelected = true;
                that.RetrieveAvailableContexts();//calling with no selectionbitmask...retrieves all infos...
            }
            catch (ex) {
                alert("prwebmetrics.dashboardsvc.NewContextDocumentAction reports " + ex.Message);
            }
            return;
        };

        that.AddedContextDocuments = [];
        that.CreateContextDocumentEditDoneAction = function () {
            try {
                var newcontextdoc = ko.toJS(that.Vmx.createcontextdocument);
                newcontextdoc.AsOfDate = Date().toString();
                newcontextdoc.Description = "Created context document...";
                that.AddedContextDocuments.push(newcontextdoc);
                that.Vmx.createcontextdocument.ContextSelection = 0;
                that.Vmx.createcontextdocument.AsOfDate = "";
                that.Vmx.createcontextdocument.Description = "New Document";
                that.Vmx.availabledocumentstemplate("availablecontexts");
                var contextselbmsk = that.ComputeContextSelectionBitmask();
                $("#availablecontextsroot").availablecontexts();
                that.RetrieveAvailableContexts(contextselbmsk);
            }
            catch (ex) {
                alert("prwebmetrics.dashboardsvc.CreateContextDocumentBackCancelAction reports " + ex.Message);
            }
            return;
        };
        that.CreateContextDocumentBackCancelAction = function () {
            try {
                that.Vmx.createcontextdocument.ContextSelection = 0;
                that.Vmx.createcontextdocument.AsOfDate = "";
                that.Vmx.createcontextdocument.Description = "New Document";
                that.Vmx.availabledocumentstemplate("availablecontexts");
                var contextselbmsk = that.ComputeContextSelectionBitmask();
                $("#availablecontextsroot").availablecontexts();
                that.RetrieveAvailableContexts(contextselbmsk);
            }
            catch (ex) {
                alert("prwebmetrics.dashboardsvc.CreateContextDocumentBackCancelAction reports " + ex.Message);
            }
            return;
        };

        that.AvailableContextDocumentsEditDoneAction = function () {
            try {
                that.Vmx.availabledocumentstemplate("");
                //retrieve the new metricscontextset...using a ContextSelection computed from
                var bmsk = that.ComputeContextSelectionBitmask(); //this one will be the key to go to the server method...
                var orig = that.Vmx.currentmetricscontext().ContextSelection;
                var thatwasatest = true;
            }
            catch (ex) {
                alert("prwebmetrics.dashboardsvc.AvailableContextDocumentsBackCancelAction reports " + ex.Message);
            }
            return;
        };
        that.AvailableContextDocumentsBackCancelAction = function () {
            try {
                //restore the metricscontextsetview to original state...
                //calling that.vmx.currentmetricscontextchanged()will do that...
                var orig = that.Vmx.currentmetricscontext();
                that.Vmx.currentmetricscontextchanged(orig);
                that.Vmx.availabledocumentstemplate("");
            }
            catch (ex) {
                alert("prwebmetrics.dashboardsvc.AvailableContextDocumentsBackCancelAction reports " + ex.Message);
            }
            return;
        };

        that.RealizeDashboardBackCancelAction = function () {
            try {
                switch (true) {
                    case (that.Vmx.editcontext.isediting()):
                        that.Vmx.editcontext.isediting(false);
                        break;
                    case (that.Vmx.editcontext.isdirty()):
                        break;
                    case (true):
                        prweb.metricsplatformsvc.RestartMetricsPortal();
                        break;
                };
            }
            catch (ex) {
                alert("prwebmetrics.dashboardsvc.RealizeDashboardBackCancelAction reports " + ex.Message);
            }
            return;
        };
        that.RealizeDashboardEditDoneAction = function () {
            try {
                if (that.Vmx.editcontext.isediting() && that.Vmx.editcontext.isdirty()) {
                    prweb.contextdocsvc.SaveContextDoc();
                }
                var newval = !that.Vmx.editcontext.isediting();
                that.Vmx.editcontext.isediting(newval);

            }
            catch (ex) {
                alert("prwebmetrics.dashboardsvc.RealizeDashboardEditDoneAction reports " + ex.Message);
            }
            return;
        };

        that.Initialize = function (dashboard) {
            try {
                that.availablecontextsUrl = dashboard.AvailableContextsURL || false;
                that.metricsdatacontextUrl = dashboard.DefaultDataContextURL || false;
                that.Vmx.populate(dashboard);
                //                that.PopulateDerivedCompuationObject();
                that.RetrieveMetricsDataContext();
            }
            catch (ex) {
                alert("prwebmetrics.dashboardsvc reports " + ex.Message);
            }
            return;
        };

        return that;

    } ());
} (this.prweb = this.prweb || {}, jQuery));
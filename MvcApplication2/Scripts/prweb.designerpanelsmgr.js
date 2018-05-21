/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.designerpanelsmgr = (function () {

        var that = {};

        that.Panels = {};

        //#region ClosePanel and ManageOpenedPanel

        that.ClosePanel = function (wdgtname) {
            try {
                var xselctor = that.Panels[wdgtname].selctor;
                $(xselctor).data(wdgtname)._myCloseList();
                xselctor = null;
                wdgtname = null;
            }
            catch (ex) {
                alert("prweb.designerpanelsmgr.ClosePanel reports... " + ex.Message);
            }
        };

        that.ManageOpenedPanel = function (wdgtname) {
            var widgetnamestoclose = that.Panels[wdgtname].closeThese;
            for (var nm in widgetnamestoclose) {
                var tgtwdgt = widgetnamestoclose[nm];
                if (that.Panels[tgtwdgt].isOpen) {
                    that.ClosePanel(tgtwdgt);
                }
                tgtwdgt = null;
                nm = null;
            };
            widgetnamestoclose = null;
        };

        //#endregion



        that.ReportIsDocked = function (wdgtname, isdocked) {
            if (that.Panels[wdgtname]) {
                that.Panels[wdgtname].isOpen = !isdocked;
                if (!isdocked) {
                    that.ManageOpenedPanel(wdgtname);
                }
            }
            wdgtname = null;
            isdocked = null;
        };
        that.CloseAnyDiEditor = function () {
            that.ManageOpenedPanel("anydieditor");
            return;
        };

        that.CloseAnyExToolbox = function () {
            that.ManageOpenedPanel("anyextoolbox");
            return;
        };

        that.CloseAny = function () {
            that.ManageOpenedPanel("any");
            return;
        };

        that.CloseDesignerPanelsRequiringDIContext = function () {
            //            if (that.Panels["designimagesmgr"].isOpen) {
            //                that.ClosePanel("designimagesmgr");
            //            }
            //            if (that.Panels["designstyles"].isOpen) {
            //                that.ClosePanel("designstyles");
            //            }
            //            if (that.Panels["designoptions"].isOpen) {
            //                that.ClosePanel("designoptions");
            //            }
            //            if (that.Panels["designtoolbox"].isOpen) {
            //                that.ClosePanel("designtoolbox");
            //            }
        };

        that.ExpandDesignerItemEditorLeftPanel = function () {

        };

        that.CollapseDesignerItemEditorLeftPanel = function () {

        };
        //#region Initialize and Shutdown

        that.Initialize = function () {
            prweb.panelsmgr.IsDesignerActive = true;
            that.Panels = {
                navpanel: {
                    isOpen: false,
                    selctor: "#navpanel",
                    closeThese: { x1: "designtoolbox", x2: "designerpageslist", x3: "surveyiconlist" }
                },
                surveyiconlist: {
                    isOpen: false,
                    selctor: "#siconlistpanel",
                    closeThese: { x1: "navpanel", x2: "designerpageslist", x3: "designtoolbox" }
                },
                designerpageslist: {
                    isOpen: false,
                    selctor: "#designerpageslistpanel",
                    closeThese: { x1: "designimagesmgr", x2: "navpanel", x3: "surveyiconlist" }
                },
                designtoolbox: {
                    isOpen: false,
                    selctor: "#designertoolboxslideoutpanel",
                    closeThese: { x1: "navpanel", x2: "designerpageslist", x3: "surveyiconlist" }
                },
                designstyles: {
                    isOpen: false,
                    selctor: "#designerstylesslideoutpanel",
                    closeThese: { x1: "designimagesmgr", x2: "designoptions" }
                },
                designimagesmgr: {
                    isOpen: false,
                    selctor: "#dsgnrimagesmgrpanel",
                    closeThese: { x1: "designstyles", x2: "designoptions" }
                },
                designoptions: {
                    isOpen: false,
                    selctor: "#designeroptionsslideoutpanel",
                    closeThese: { x1: "designimagesmgr", x2: "designstyles" }
                },
                anydieditor: {
                    isOpen: false,
                    selctor: false,
                    closeThese: { x1: "designstyles", x2: "designimagesmgr", x3: "designoptions" }
                },
                anyextoolbox: {
                    isOpen: false,
                    selctor: false,
                    closeThese: { x1: "surveyiconlist", x2: "navpanel", x3: "designerpageslist" }
                },
                any: {
                    isOpen: false,
                    selctor: false,
                    closeThese: { x1: "surveyiconlist", x2: "navpanel", x3: "designtoolbox", x4: "designerpageslist" }
                }
            };
        };

        that.ShutDown = function () {
            prweb.panelsmgr.IsDesignerActive = false;
            that.Panels = {};
        };

        //#endregion

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
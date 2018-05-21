/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.panelsmgr = (function () {

        var that = {};

        that.Panels = {};

        that.IsDesignerActive = false;

        //#region OpenPanel
        that.OpenPanel = function (wdgtname) {
            try {
                var xselctor = that.Panels[wdgtname].selctor;
                var $panelwidget = $(xselctor).data(wdgtname);
                if ($panelwidget) {
                    try {
                        $panelwidget._myOpenList();
                    }
                    catch (ex) {
                        alert("prweb.panelsmgr.OpenPanel.$panelwidget reports... " + wdgtname + ".myOpenList  " + ex.Message);
                    }
                }
                $panelwidget = null;
                xselctor = null;
                wdgtname = null;
            }
            catch (ex) {
                alert("prweb.panelsmgr.OpenPanel reports... " + wdgtname + " encountered  " + ex.Message);
            }
        };

        //#region ClosePanel and ManageOpenedPanel

        that.ClosePanel = function (wdgtname) {
            try {
                var xselctor = that.Panels[wdgtname].selctor;
                var $panelwidget = $(xselctor).data(wdgtname);
                if ($panelwidget) {
                    try {
                        $panelwidget._myCloseList();
                    }
                    catch (ex) {
                        alert("prweb.panelsmgr.$panelwidget reports... " + wdgtname + ".myCloseList  " + ex.Message);
                    }
                }
                $panelwidget = null;
                xselctor = null;
                wdgtname = null;
            }
            catch (ex) {
                alert("prweb.panelsmgr.ClosePanel reports... " + wdgtname + " encountered  " + ex.Message);
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

        //#region CloseAllPanels
        that.CloseAllPanels = function () {
            that.ManageOpenedPanel("allbasic");
            return;
        };
        //#endregion

        that.ReportIsDocked = function (wdgtname, isdocked) {
            if (that.Panels[wdgtname]) {
                that.Panels[wdgtname].isOpen = !isdocked;
                if (!isdocked) {
                    that.ManageOpenedPanel(wdgtname);
                }
            }
            if (that.IsDesignerActive) {
                try {
                    prweb.designerpanelsmgr.ReportIsDocked(wdgtname, isdocked);
                }
                catch (ex) {
                    // don't care...
                }
            }
            wdgtname = null;
            isdocked = null;
        };

        that.GetPanelIsOpen = function (wdgtname) {
            var rslt = false;
            try {
                if (that.Panels[wdgtname]) {
                    rslt = that.Panels[wdgtname].isOpen;
                }
            }
            catch (ex) {
                alert("prweb.panelsmgr.GetPanelIsOpen reports " + ex.Message);
            }
            return rslt;
        };

        that.TogglePanel = function (wdgtname) {
            if (that.Panels[wdgtname].isOpen) {
                that.ClosePanel(wdgtname);
            }
            else {
                that.OpenPanel(wdgtname);
            }
            return;
        };

        that.CloseAllDelayed = function () {
            setTimeout(function () {
                that.CloseAllPanels();
                return;
            }, 1200)
            return;
        };

        //#region Initialize and Shutdown

        that.Initialize = function () {
            that.Panels = {
                navpanel: {
                    isOpen: false,
                    selctor: "#navpanel",
                    closeThese: { x1: "surveymetadata", x2: "groupsslideoutpanel", x3: "surveypageslist", x4: "surveyiconlist", x5: "surveypagenavigator" }
                },
                surveypageslist: {
                    isOpen: false,
                    selctor: "#surveypagenavirootcontainer",
                    closeThese: { x1: "navpanel", x2: "surveyiconlist", x3: "groupsslideoutpanel", x4: "surveymetadata", x5: "guestactionslist" }
                },
                surveypagenavigator: {
                    isOpen: false,
                    selctor: "#guestpagespanel",
                    closeThese: { x1: "navpanel", x2: "surveyiconlist", x5: "guestactionslist", x6: "textentry" }
                },
                surveyiconlist: {
                    isOpen: false,
                    selctor: "#siconlistpanel",
                    closeThese: { x1: "navpanel", x2: "surveypageslist", x3: "groupsslideoutpanel", x4: "surveymetadata" }
                },
                groupsslideoutpanel: {
                    isOpen: false,
                    selctor: "#groupsslideoutpanel",
                    closeThese: { x1: "surveymetadata", x2: "surveypageslist", x3: "navpanel", x4: "surveyiconlist", x5: "guestactionslist", x6: "textentry" }
                },
                surveymetadata: {
                    isOpen: false,
                    selctor: "#prwsmdroot",
                    closeThese: { x1: "groupsslideoutpanel", x2: "surveypageslist", x3: "navpanel", x4: "surveyiconlist", x5: "guestactionslist", x6: "surveypagenavigator", x7: "textentry" }
                },
                guestactionslist: {
                    isOpen: false,
                    selctor: "#guestnavpanel",
                    closeThese: { x1: "groupsslideoutpanel", x3: "surveymetadata", x5: "surveypagenavigator", x6: "textentry" }
                },
                textentry: {
                    isOpen: false,
                    selctor: "#textentrybottompanel",
                    closeThese: { x1: "groupsslideoutpanel", x3: "surveymetadata", x5: "surveypagenavigator", x6: "guestactionslist" }
                },
                allbasic: {
                    isOpen: false,
                    selctor: false,
                    closeThese: { x1: "surveyiconlist", x2: "navpanel", x3: "surveymetadata", x4: "surveypageslist" }
                }
            };

        };

        that.ShutDown = function () {
            that.Panels = {};
        };

        //#endregion

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
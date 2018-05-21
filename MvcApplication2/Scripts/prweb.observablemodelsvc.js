﻿/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.observablemodelsvc = (function () {

        //#region Class Variables

        var that = {};


        that.uid = 0;

        that.UniqueID = function () {
            that.uid++;
            return Math.max(1, that.uid);
        };




        //#region JSData JSValuorDefault Utility methods

        that.JSData = null;

        that.JSValorDefault = function (dflt, prop) {
            var rslt = dflt;
            if (that.JSData) {
                if (undefined != that.JSData[prop]) {
                    rslt = that.JSData[prop];
                }
            }
            dflt = null;
            prop = null;
            return rslt;
        };

        //#endregion



        //#region ModelCoreofT
        //#region Default Brushes
        that.BackgroundDefault = ["hsla(179,70%,57%,1)",
                                  "hsla(173,70%,28%,1)",
                                  "hsla(173,70%,20%,1)",
                                  "hsla(179,70%,15%,1)"];

        that.CBBackgroundDefault = ["hsla(129, 20%, 32%, 1)",
                                    "hsla(129, 40%, 22%, 1)",
                                    "hsla(132, 100%, 2%, 1)",
                                    "hsla(130, 49%, 20%, 1)"];
        that.CBForegroundDefault = ["hsla(135, 100%, 80%, 1)",
                                    "hsla(130, 100%, 75%, 1)",
                                    "hsla(130, 100%, 35%, 1)",
                                    "hsla(132, 100%, 2%, 1)",
                                    "hsla(130, 100%, 20%, 1)"];
        //#endregion

        that.ModelCoreofT = function (T, uniqid) {
            var rslt = {
                presenterT: T,
                html: ko.observable(),
                DI_CanvasTop: ko.observable(that.JSValorDefault(30, "DI_CanvasTop")),
                DI_CanvasLeft: ko.observable(that.JSValorDefault(30, "DI_CanvasLeft")),
                DI_CanvasZindex: ko.observable(that.JSValorDefault(800, "DI_CanvasZindex")),
                Scale: ko.observable(that.JSValorDefault(1, "Scale")),
                Rotation: ko.observable(that.JSValorDefault(0, "Rotation")),
                DesignerItemHeight: ko.observable(that.JSValorDefault(30, "DesignerItemHeight")),
                DesignerItemWidth: ko.observable(that.JSValorDefault(30, "DesignerItemWidth")),
                DesignerItemSize: {
                    width: null,
                    height: null
                },
                BackgroundBrushID: ko.observable("mcbackid" + uniqid),
                BackgroundBrushUrl: ko.observable("url(#mcbackid" + uniqid + ")"),
                BackgroundStr: ko.observable(that.JSValorDefault(that.BackgroundDefault, "BackgroundStr")),
                BackgroundOpacity: ko.observable(that.JSValorDefault("1", "BackgroundOpacity")),
                BackgroundVisibility: ko.observable(that.JSValorDefault("visible", "BackgroundVisibility")),
                ForegroundStr: ko.observable(that.JSValorDefault("rgba(255,255,255, 1)", "ForegroundStr")),
                ImageUriString: ko.observable(that.JSValorDefault(false, "ImageUriString")),
                ImageOpacity: ko.observable(that.JSValorDefault("1", "ImageOpacity")),
                ImageVisibility: ko.observable(that.JSValorDefault("hidden", "ImageVisibility")),
                BorderBrushStr: ko.observable(that.JSValorDefault("rgba(255,255,255, 0.1)", "BorderBrushStr")),
                RTBHtml: ko.observable(that.JSValorDefault("Enter Text here", "RTBHtml")),
                CheckBoxBackgroundStr: ko.observable(that.JSValorDefault(that.CBBackgroundDefault, "CheckBoxBackgroundStr")),
                CheckBoxBackgroundOpacity: ko.observable(that.JSValorDefault("1", "CheckBoxBackgroundOpacity")),
                CheckBoxForegroundStr: ko.observable(that.JSValorDefault(that.CBForegroundDefault, "CheckBoxForegroundStr")),
                CheckBoxBorderBrushStr: ko.observable(that.JSValorDefault("rgba(25,25,25, 1)", "CheckBoxBorderBrush")),
                CheckBoxBorderThickness: ko.observable(that.JSValorDefault("rgba(25,25,25, 1)", "CheckBoxBorderThickness")),
                CheckBoxSize: ko.observable(that.JSValorDefault("20", "CheckBoxSize")),
                CheckBoxOnOffUrlStr: ko.observable("url(#rboffid" + uniqid + ")"),
                Dispose: null
            };
            rslt.DesignerItemSize.width = function () {
                return rslt.DesignerItemWidth();
            };
            rslt.DesignerItemSize.height = function () {
                return rslt.DesignerItemHeight();
            };
            rslt.Dispose = function () {
                rslt.presenterT = null;
                rslt.html = null;
                rslt.DI_CanvasTop = null;
                rslt.DI_CanvasLeft = null;
                rslt.DI_CanvasZindex = null;
                rslt.DesignerItemHeight = null;
                rslt.DesignerItemWidth = null;
                rslt.DesignerItemSize = null;
                rslt.BackgroundStr = null;
                rslt.ForegroundStr = null;
                rslt.ImageUriString = null;
                rslt.RTBHtml = null;
                delete rslt.presenterT;
                delete rslt.html;
                delete rslt.DI_CanvasTop;
                delete rslt.DI_CanvasLeft;
                delete rslt.DI_CanvasZindex;
                delete rslt.DesignerItemHeight;
                delete rslt.DesignerItemWidth;
                delete rslt.DesignerItemSize;
                delete rslt.BackgroundStr;
                delete rslt.ForegroundStr;
                delete rslt.ImageUriString;
                delete rslt.RTBHtml;
                return;
            };

            return rslt;
        };
        //#endregion


        //#region QoimUtility Methods
        that.JSQoimData = null; //this is a colxn of qoim items...

        that.JSQoimRow = null; //this is a single qoim item...

        that.JSQoimValorDef = function (dflt, prop) {
            var rslt = dflt;
            if (that.JSQoimRow) {
                if (that.JSQoimRow[prop]) {
                    rslt = that.JSQoimRow[prop];
                }

            }
            dflt = null;
            prop = null;
            return rslt;
        };
        //#endregion

        that.GeneratePageQoimColxn = false;
        that.AllQoimsInPCElemColxn = {};

        //#region QuestOptionItem
        that.QuestOptionItemModel = function (opttext, pcmid) {
            if (!opttext) {
                opttext = "Option Text";
            }
            //
            var rslt = {
                QOptionItemText: ko.observable(opttext),
                modelcore: that.ModelCoreofT("QOptItem"),
                RespONSEModel: that.JSQoimValorDef(false, "RespONSEModel"),
                Pct: ko.observable(0),
                PctString: ko.observable("0%"),
                PctPath: ko.observable("m0,0"),
                SelectedState: ko.observable(false),
                SelectedStatePath: ko.observable("m0,0"),
                GroupDefnActive: ko.observable(false),
                GroupDefnSelectorPath: ko.observable("m0,0"),
                xxheight: ko.observable(that.JSQoimValorDef("100%", "xxheight")),
                xxwidth: ko.observable(that.JSQoimValorDef("33.3%", "xxwidth")),
                netborderH: ko.observable(that.JSQoimValorDef("97%", "netborderH")),
                netborderW: ko.observable(that.JSQoimValorDef("98%", "netborderW")),
                xxborderlr: ko.observable(that.JSQoimValorDef("1%", "xxborderlr")),
                xxbordertb: ko.observable(that.JSQoimValorDef("1%", "xxbordertb")),
                xxcheckbxheight: ko.observable(that.JSQoimValorDef("50%", "xxcheckbxheight")),
                xxcheckbxwidth: ko.observable(that.JSQoimValorDef("20%", "xxcheckbxwidth")),
                xxcheckbxmarginright: ko.observable(that.JSQoimValorDef("80%", "xxcheckbxmarginright")),
                xxcheckbxmargins: ko.observable(that.JSQoimValorDef("25%", "xxcheckbxmargins")),
                checkboxvisibility: ko.observable(that.JSQoimValorDef("hidden", "checkboxvisibility")),
                xxoptiontextleft: ko.observable(that.JSQoimValorDef("25%", "xxoptiontextleft")),
                xxoptiontextwidth: ko.observable(that.JSQoimValorDef("75%", "xxoptiontextwidth")),
                Dispose: null
            }
            rslt.RespONSEModel.QuestID = pcmid;
            rslt.modelcore.html = null; // for qoiptitems...get rid of the ko.observable that is set by modelcoreT...
            //            rslt.modelcore.RTBHtml(opttext);
            rslt.Dispose = function () {
                rslt.modelcore.Dispose();
                rslt.modelcore = null;
                rslt.QOptionItemText = null;
                rslt.xxheight = null;
                rslt.xxwidth = null;
                rslt.netborderH = null;
                rslt.netborderW = null;
                rslt.xxborderlr = null;
                rslt.xxbordertb = null;
                rslt.xxcheckbxheight = null;
                rslt.xxcheckbxwidth = null;
                rslt.xxcheckbxmarginright = null;
                rslt.xxcheckbxmargins = null;
                rslt.checkboxvisibility = null;
                rslt.xxoptiontextleft = null;
                rslt.xxoptiontextwidth = null;
                return true;
            };
            return rslt;
        };

        that.QoimColxnDefault = function () {
            return [that.QuestOptionItemModel("Option 1", 0), that.QuestOptionItemModel("Option 2", 0), that.QuestOptionItemModel("Option 3", 0)];
        };

        that.PopulateQOIMColxn = function (pcmid) {
            var rslt = null;
            if (that.JSQoimData) {
                rslt = [];
                for (var p in that.JSQoimData) {
                    that.JSQoimRow = that.JSQoimData[p];
                    that.JSData = that.JSQoimData[p].modelcore;
                    var obsqoim = that.QuestOptionItemModel(that.JSQoimData[p].QOptionItemText, pcmid);
                    rslt.push(obsqoim);
                    if (that.GeneratePageQoimColxn) {
                        var rmkey = obsqoim.RespONSEModel.Key1;
                        that.AllQoimsInPCElemColxn[rmkey] = obsqoim; //if iwanted to make a dictionary of these this would be the place...
                    }
                    that.JSQoimRow = null;
                    that.JSData = null;
                }
            }
            else {
                rslt = that.QoimColxnDefault();
            }
            return rslt;
        };



        //#endregion

        //#region QuestionOptionSet

        that.QuestionOptionSetModel = function (uniqid, pcmid) {
            var rslt = {
                SelectedOptionsList: ko.observableArray([]),
                AnswerRequired: ko.observable(that.JSValorDefault(false, "AnswerRequired")),
                RsBackID: ko.observable("rsbackid" + uniqid),
                RsBackURL: ko.observable("url(#rsbackid" + uniqid + ")"),
                RsForeID: ko.observable("rsforeid" + uniqid),
                RsForeURL: ko.observable("url(#rsforeid" + uniqid + ")"),
                ResultsVisible: ko.observable(that.JSValorDefault("hidden", "ResultsVisible")),
                SelectorsVisible: ko.observable(true),
                UniGridColumns: ko.observable(that.JSValorDefault(3, "UniGridColumns")),
                UniGridRows: ko.observable(that.JSValorDefault(1, "UniGridRows")),
                ItemsObservableColxn: ko.observableArray(),
                SelectorHeight: ko.observable(that.JSValorDefault("98%", "SelectorHeight")),
                SelectorWidth: ko.observable(that.JSValorDefault("20%", "SelectorWidth")),
                SelectorMarginTopBottom: ko.observable(that.JSValorDefault("1%", "SelectorMarginTopBottom")),
                SelectorMarginRight: ko.observable(that.JSValorDefault("80%", "SelectorMarginRight")),
                OptionTextMarginLeft: ko.observable(that.JSValorDefault("25%", "OptionTextMarginLeft")),
                OptionTextWidth: ko.observable(that.JSValorDefault("75%", "OptionTextWidth")),
                SvgDivClass: ko.observable("qoimsvgdiv" + uniqid),
                QosprwtID: ko.observable("questoptsetprwt" + uniqid),
                BoxBackgroundBrushID: ko.observable("boxbackid" + uniqid),
                BoxBackgroundBrushUrl: ko.observable("url(#boxbackid" + uniqid + ")"),
                RadioBtnOnBrushID: ko.observable("rbonid" + uniqid),
                RadioBtnOffBrushID: ko.observable("rboffid" + uniqid),
                RadioBtnVisible: ko.observable(that.JSValorDefault("visible", "RadioBtnVisible")),
                BoxVisible: ko.observable(that.JSValorDefault("hidden", "BoxVisible")),
                CheckVisible: ko.observable(that.JSValorDefault("hidden", "CheckVisible")),
                BehaviorsList: that.JSValorDefault([], "BehaviorsList"),
                Subscriptions: {},
                Dispose: null
            };
            rslt.ItemsObservableColxn(that.PopulateQOIMColxn(pcmid));
            rslt.ManageSelectedOptionList = function () {
                try {
                    var lst = rslt.SelectedOptionsList(); //is a jsobject now...
                    var ioc = rslt.ItemsObservableColxn();
                    var ln = ioc.length;
                    //                    lst.length = 0;
                    var tmp = [];
                    for (var i = 0; i < ln; i++) {
                        if (ioc[i].SelectedState()) {
                            var rm = ioc[i].RespONSEModel;
                            tmp.push(rm.Key1); // = ioc[i].RespONSEModel;
                            rm = null;
                        }
                    }
                    if (tmp.length != lst.length) {
                        rslt.SelectedOptionsList(tmp);
                    }
                    else {
                        var isequal = Enumerable.From(tmp).Intersect(lst).Count();
                        if (isequal != tmp.length) {
                            rslt.SelectedOptionsList(tmp);
                        }
                    }

                    tmp = null;
                }
                catch (ex) {
                    alert("QuestionOptionSetModel.ManageSelectedOptionList reports " + ex.Message);
                }
            };
            rslt.Dispose = function () {
                try {
                    for (var s in rslt.Subscriptions) {
                        rslt.Subscriptions[s].dispose();
                        rslt.Subscriptions[s] = null;
                        delete rslt.Subscriptions[s];
                    };
                    rslt.Subscriptions = null;
                    var iocolxn = rslt.ItemsObservableColxn.removeAll();
                    for (var xq in iocolxn) {
                        iocolxn[xq].Dispose();
                        iocolxn[xq] = null;
                        delete iocolxn[xq];
                    };
                    iocolxn = null;
                    rslt.ItemsObservableColxn = null;
                    rslt.UniGridColumns = null;
                    rslt.UniGridRows = null;
                    delete rslt.ItemsObservableColxn;
                    delete rslt.Subscriptions;
                    delete rslt.UniGridColumns;
                    delete rslt.UniGridRows;
                }
                catch (ex) {
                    alert("QuestionOptionSetModel.Dispose reports " + ex.Message);
                }

                return true;
            };
            return rslt;
        };


        //#endregion


        //#region PCElementOfT

        that.pcElementofT = function (T) {
            var uniqid = that.UniqueID();
            var rslt = {
                MyGuid: false,
                MyGuidStr: false,
                pcelemNdx: 0,
                pcelemID: uniqid,
                pcelemSdsID: 0,
                pcmID: 0,
                PresenterTypeName: T,
                modelcore: that.ModelCoreofT(T, uniqid),
                QuestOptSetModel: null,
                BehaviorsList: [],
                Dispose: null
            };
            if (T == "prwTQuestOptionSet") {
                rslt.QuestOptSetModel = that.QuestionOptionSetModel(uniqid, 0);
            }
            rslt.Dispose = function () {
                rslt.modelcore.Dispose();
                rslt.modelcore = null;
                if (rslt.QuestOptSetModel) {
                    rslt.QuestOptSetModel.Dispose();
                    rslt.QuestOptSetModel = null;
                }
                rslt.pcelemNdx = null;
                rslt.pcelemID = null;
                rslt.pcmID = null;
                delete rslt.modelcore;
                delete rslt.QuestOptSetModel;
                delete rslt.pcelemID;
                delete rslt.pcelemNdx;
                delete rslt.pcmID;
            };
            return rslt;
        };


        //#endregion

        //#region PCElemFromJSData Utility Method

        that.PCElemFromJSData = function (pcelem, pcmid) {
            that.JSData = pcelem.modelcore;
            var uniqid = that.UniqueID();
            var rslt = {
                MyGuid: pcelem.MyGuidStr || false,
                MyGuidStr: pcelem.MyGuidStr,
                pcelemNdx: pcelem.pcelemNdx || 0,
                pcelemID: uniqid,
                pcelemSdsID: pcelem.pcelemSdsID || 0,
                pcmID: pcmid,
                PresenterTypeName: pcelem.PresenterTypeName,
                modelcore: that.ModelCoreofT(pcelem.modelcore.presenterT, uniqid),
                QuestOptSetModel: null,
                BehaviorsList: pcelem.BehaviorsList,
                Dispose: null
            };
            that.JSData = null;
            if (pcelem.modelcore.presenterT == "prwTQuestOptionSet") {
                that.JSData = pcelem.QuestOptSetModel;
                that.JSQoimData = pcelem.QuestOptSetModel.ItemsObservableColxn;
                rslt.QuestOptSetModel = that.QuestionOptionSetModel(uniqid, rslt.pcmID);
                that.JSData = null;
                that.JSQoimData = null;
                that.JSQoimRow = null;
            }
            rslt.Dispose = function () {
                rslt.modelcore.Dispose();
                rslt.modelcore = null;
                if (rslt.QuestOptSetModel) {
                    rslt.QuestOptSetModel.Dispose();
                    rslt.QuestOptSetModel = null;
                }
                rslt.pcelemNdx = null;
                rslt.pcelemID = null;
                rslt.pcmID = null;
                delete rslt.modelcore;
                delete rslt.QuestOptSetModel;
                delete rslt.pcelemID;
                delete rslt.pcelemNdx;
                delete rslt.pcmID;
            };
            return rslt;
        };

        //#endregion

        that.DefaultPagePCM = function () {

        };
        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
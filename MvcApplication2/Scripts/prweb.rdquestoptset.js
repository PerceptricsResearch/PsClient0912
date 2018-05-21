/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.rdquestoptset', {
        //#region Options
        options: {
            model: false,
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion
        xevent: "click.rdquestoptset",

        //#region Create
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.rdquestoptset";
                }
                if (this.options.model.QuestOptSetModel.AnswerRequired) {
                    this._registerAnswerRequiredBehavior();
                }
                var isbox = (this.options.model.QuestOptSetModel.BoxVisible() == "visible");
                var isradio = (this.options.model.QuestOptSetModel.RadioBtnVisible() == "visible");
                if (isbox) {
                    this._prepareModelCheckBox();
                }
                else {
                    this._prepareModelRadioButton();
                }

                var konode = this.element.children().eq(0);
                ko.applyBindings(this.options.model, konode[0]);
                konode = null;
                if (isbox) {
                    this._addCheckBoxHandler();
                }
                else {
                    this._addRadioButtonHandler();
                }

            }
            catch (ex) {
                alert("prweb.rdquestoptset.create reports " + ex.Message);
            }
        },
        //#endregion

        //#region AnswerRequired Behavior

        _registerAnswerRequiredBehavior: function () {
            //this means something must be selected
            //once at least one rm IsChecked, then remove the behavior
            //the behaviors could be just show visual stuff on the object...once satisfied, remove the visual stuff...
            //maybe warn on navigate
            //maybe prevent navigate
            //maybe cancel response...end the survey...
            //
        },

        //#endregion

        //#region CheckBox Behaviors

        _prepareModelCheckBox: function () {
            //this needs to look at responsesvc...for each of this guys rmkeys, needs to see if on, 
            var qoimcolxn = this.options.model.QuestOptSetModel.ItemsObservableColxn();
            for (var n in qoimcolxn) {
                var ison = prweb.responsesvc.IsChecked(qoimcolxn[n].RespONSEModel);
                if (ison) {
                    qoimcolxn[n].checkboxvisibility("visible");
                }
                else {
                    qoimcolxn[n].checkboxvisibility("hidden");
                }
            }
        },

        _addCheckBoxHandler: function () {
            var slctor = this.options.model.QuestOptSetModel.SvgDivClass();
            var $ix = $("." + slctor, this.element);
            var self = this;
            $ix.on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.cancelBubble = true;
                    var xitem = ko.dataFor(this);
                    var ischeckednow = prweb.responsesvc.EvaluateResponseModel(xitem.RespONSEModel);
                    if (ischeckednow) {
                        xitem.checkboxvisibility("visible");
                    }
                    else {
                        xitem.checkboxvisibility("hidden");
                    }
                    prweb.responsesvc.EvaluateSurveyComplete();
                }
                catch (ex) {
                    alert("prweb.rdquestoptset.addCheckBoxHandler.on reports " + ex.Message);
                }
                return false;
            });
        },

        //#endregion

        //#region RadioButtonBehaviors
        _prepareModelRadioButton: function () {
            //this needs to look at responsesvc...for each of this guys rmkeys, needs to see if on, 
            var offstr = this.options.model.QuestOptSetModel.RadioBtnOffBrushID();
            var onstr = this.options.model.QuestOptSetModel.RadioBtnOnBrushID();
            var qoimcolxn = this.options.model.QuestOptSetModel.ItemsObservableColxn();
            for (var n in qoimcolxn) {
                qoimcolxn[n].checkboxvisibility("hidden");
                var ison = prweb.responsesvc.IsChecked(qoimcolxn[n].RespONSEModel);
                if (ison) {
                    qoimcolxn[n].modelcore.CheckBoxOnOffUrlStr("url(#" + onstr + ")");
                }
                else {
                    qoimcolxn[n].modelcore.CheckBoxOnOffUrlStr("url(#" + offstr + ")");
                }
            }
        },

        _turnOffAllRadioButtons: function () {
            var offstr = this.options.model.QuestOptSetModel.RadioBtnOffBrushID();
            var qoimcolxn = this.options.model.QuestOptSetModel.ItemsObservableColxn();
            for (var n in qoimcolxn) {
                qoimcolxn[n].modelcore.CheckBoxOnOffUrlStr("url(#" + offstr + ")");
                prweb.responsesvc.RemoveRMKey(qoimcolxn[n].RespONSEModel);
            }
        },

        _addRadioButtonHandler: function () {
            var slctor = this.options.model.QuestOptSetModel.SvgDivClass();
            var $ix = $("." + slctor, this.element);
            var self = this;
            $ix.on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.cancelBubble = true;
                    var xitem = ko.dataFor(this);
                    var ischeckednow = prweb.responsesvc.EvaluateResponseModel(xitem.RespONSEModel);
                    self._turnOffAllRadioButtons();
                    if (ischeckednow) {
                        //if radiobtn turn off all of its siblings..get the other responsemodels in this qoptset.qoimcolxn...
                        //turn this on
                        prweb.responsesvc.EvaluateResponseModel(xitem.RespONSEModel);
                        var btnonbrshid = self.options.model.QuestOptSetModel.RadioBtnOnBrushID();
                        xitem.modelcore.CheckBoxOnOffUrlStr("url(#" + btnonbrshid + ")");
                        prweb.responsesvc.EvaluateSurveyComplete();
                    }
                }
                catch (ex) {
                    alert("prweb.rdquestoptset.addSelectorHandler.on reports " + ex.Message);
                }
                return false;
            });
        },
        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    var slctor = this.options.model.QuestOptSetModel.SvgDivClass();
                    var $ix = $("." + slctor);
                    $ix.off(this.xevent);
                }
                catch (ex) {
                    alert("prweb.rdquestoptset.dispose reports error " + ex.Message);
                    ex = null;
                }
                finally {
                    this.options.isDisposed = true;
                }
            }
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.rdquestoptset.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
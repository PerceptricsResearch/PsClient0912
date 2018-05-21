/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.rdentmanager', {
        //#region Options
        options: {
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion

        //#region Create
        xevent: "click.rdentmanager",
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.rdentmanager";
                }
                prweb.responsesvc.populateButtonBarVmx();
                var konode = this.element;
                ko.applyBindings(prweb.responsesvc.ButtonBarVmx, konode[0]);
                konode = null;

                prweb.responsesvc.populateMsgAreaVmx();
                var msgkonode = $("#rdmessagepanelwrapper");
                ko.applyBindings(prweb.responsesvc.MessageAreaVmx, msgkonode[0]);
                msgkonode = null;

                this.populateSurveyFinishBtnHandler();
                this.populateSurveyQuitBtnHandler();
                this.populateSurveyPagesBtnHandler();
                $("#rdnavpanel").rdactionslist(); //also handles actionsbtn click/tap..
                //                $("#rdpagespanel").rdentsurveypageslist();.
            }
            catch (ex) {
                alert("prweb.rdentmanager.create reports " + ex.Message);
            }
        },
        //#endregion

        //i want this widget to manage its visual via ko.viewmodel...that sits in responsesvc
        //that Vmx will have visible bindings in it to show finish and cancel btns...
        //also, i'd like to have a "contentplayer" as a right side slideout...
        //when there is stuff to show, like about Perceptrics, or Author Info etc...
        //this guy shows it...slides out and displays a page...
        //i'd like it to be like a little browser...has a history of pages that have been previously been displayed?


        //#region Finish and Pages Btns Handlers

        hasBeenClicked: false,
        populateSurveyFinishBtnHandler: function () {
            var self = this;
            $("#rdprwfinishbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                if (!self.hasBeenClicked) {
                    self.hasBeenClicked = true;
                    prweb.responsesvc.FinishBtnClickAction();
                }

            });
        },


        populateSurveyQuitBtnHandler: function () {
            var self = this;
            $("#rdprwquitbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                if (!self.hasBeenClicked) {
                    self.hasBeenClicked = true;
                    prweb.responsesvc.QuitBtnClickAction();
                }

            });
        },
        populateSurveyPagesBtnHandler: function () {

        },
        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#rdprwfinishbtn").off(this.xevent);
                }
                catch (ex) {
                    alert("prweb.rdentmanager.dispose reports error " + ex.Message);
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
                alert("prweb.rdentmanager.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }
        //#endregion
    });
} (this.prweb, jQuery));
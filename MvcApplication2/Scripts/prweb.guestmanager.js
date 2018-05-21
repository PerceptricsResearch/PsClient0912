/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.guestmanager', {
        //#region Options
        options: {
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion

        //#region Create
        xevent: "click.guestmanager",
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.guestmanager";
                }
                prweb.guestplatformsvc.populateButtonBarVmx();
                var konode = this.element;
                ko.applyBindings(prweb.guestplatformsvc.ButtonBarVmx, konode[0]);
                konode = null;

                prweb.guestplatformsvc.populateMsgAreaVmx();
                var msgkonode = $("#guestmessagepanelwrapper");
                ko.applyBindings(prweb.guestplatformsvc.MessageAreaVmx, msgkonode[0]);
                msgkonode = null;

                this.populateGroupsBtnHandler();
                this.populateDetailsBtnHandler();
                this.populateSurveyPagesBtnHandler();
                this.populateHelpBtnHandler();
                $("#guestnavpanel").guestactionslist(); //also handles actionsbtn click/tap..
                $("#guestpagespanel").surveypagenavigator();
            }
            catch (ex) {
                alert("prweb.guestmanager.create reports " + ex.Message);
            }
        },
        //#endregion

        //#region Finish and Pages Btns Handlers

        hasBeenClicked: false,
        populateGroupsBtnHandler: function () {
            var self = this;
            $("#guestprwgroupsbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                prweb.pubsub.publish(prweb.events.subscriberplatform.rsltsgroupsbtnclick);
                //                if (!self.hasBeenClicked) {
                //                    self.hasBeenClicked = true;
                //                prweb.guestplatformsvc.GroupsBtnClickAction();
                //                }

            });
        },


        populateDetailsBtnHandler: function () {
            var self = this;
            $("#guestprwdetailsbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                prweb.pubsub.publish(prweb.events.subscriberplatform.smddetailsbtnclick);
                //                if (!self.hasBeenClicked) {
                //                    self.hasBeenClicked = true;
                //                prweb.guestplatformsvc.DetailsBtnClickAction();
                //                }

            });
        },
        populateSurveyPagesBtnHandler: function () {

        },

        populateHelpBtnHandler: function () {
            var self = this;
            $("#guestprwhelpbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                //                if (!self.hasBeenClicked) {
                //                    self.hasBeenClicked = true;
                //                    prweb.guestplatformsvc.DetailsBtnClickAction();
                //                }

            });
        },
        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#guestprwgroupsbtn").off(this.xevent);
                    $("#guestprwdetailsbtn").off(this.xevent);
                }
                catch (ex) {
                    alert("prweb.guestmanager.dispose reports error " + ex.Message);
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
                alert("prweb.guestmanager.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }
        //#endregion
    });
} (this.prweb, jQuery));
/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {
    $.widget('prweb.guestactionslist', {
        //#region Options
        options: {
            melayoutElement: null,
            isDocked: true,
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion

        //#region Create
        xevent: "click.guestactionslist",
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.guestactionslist";
                }
                prweb.guestplatformsvc.populateActionListVmx();
                var konode = this.element; //is $("#guestnavpanel")
                ko.applyBindings(prweb.guestplatformsvc.ActionListVmx, konode[0]);
                konode = null;

                this._populateActionsBtnHandler();
                $("#guestdomainpanel").guestdomainplayer();
            }
            catch (ex) {
                alert("prweb.guestactionslist.create reports " + ex.Message);
            }
        },
        //#endregion

        //#region ActionsBtnClick and panel animation

        isDocked: true,
        animwidthzero: { width: 0 },
        animwidthwide: { width: "14em" },
        animdur: { duration: 300, easing: 'easeInQuad'},

        _myActionsbtnclick: function () {
            if (!this.isDocked) {
//                $("#guestactionslistpanel").css("overflow", "hidden");
                this.element.stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
            }
            else {
                if (this.isDocked) {
                    this.element.stop(true, false).removeClass("prwslideouthide").animate(this.animwidthwide);
                    this.isDocked = false;
//                    $("#guestactionslistpanel").css("overflow", "auto");
                }
            }
            prweb.panelsmgr.ReportIsDocked("guestactionslist", this.isDocked);
            prweb.pubsub.publish(prweb.events.subscriberplatform.actionsbtnclick);
            return true;
        },

        _populateActionsBtnHandler: function () {
            var self = this;
            $("#guestprwactionsbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                self._myActionsbtnclick();
                return false;
            });
        },

        //#endregion

        //#region Close FOR PANELSMGR to work...
        _myCloseList: function () {
            if (this.isDocked != "empty" && !(this.isDocked)) {
                $("#guestactionslistitemscontainer").css("overflow", "hidden");
                this.element.stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
                prweb.panelsmgr.ReportIsDocked("guestactionslist", this.isDocked);
            }
            return true;
        },
        //#endregion
        
        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                }
                catch (ex) {
                    alert("prweb.guestactionslist.dispose reports error " + ex.Message);
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
                alert("prweb.guestactionslist.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
        //#endregion
    });
} (this.prweb, jQuery));
(function (prweb, $) {
    $.widget('prweb.rdactionslist', {

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
        xevent: "click.rdactionslist",

        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.rdactionslist";
                }
                prweb.responsesvc.populateActionListVmx();
                var konode = this.element; //is $("#rdnavpanel")
                ko.applyBindings(prweb.responsesvc.ActionListVmx, konode[0]);
                konode = null;

                this._populateActionsBtnHandler();
                $("#rddomainpanel").rddomainplayer();
            }
            catch (ex) {
                alert("prweb.rdactionslist.create reports " + ex.Message);
            }
        },
        //#endregion

        _widgetizeNavtiles: function () {
            //rdactionsbtnvwrslts
            //rdactionsbtnprivacy
            //rdactionsbtnauthinfo
            //rdactionsbtnprsch
            return true;
        },



        //#region ActionsBtnClick and panel animation

        isDocked: true,
        animwidthzero: { width: 0 },
        animwidthwide: { width: "220px" },
        animdur: { duration: 300, easing: 'easeInQuad' },

        _myActionsbtnclick: function () {
            if (!this.isDocked) {
                $("#rdactionslistitemscontainer").css("overflow", "hidden");
                this.element.stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
            }
            else {
                if (this.isDocked) {
                    this.element.stop(true, false).removeClass("prwslideouthide").animate(this.animwidthwide);
                    this.isDocked = false;
                    $("#rdactionslistitemscontainer").css("overflow", "auto");
                }
            }
            //            prweb.panelsmgr.ReportIsDocked("navpanel", this.isDocked);
            return true;
        },



        _populateActionsBtnHandler: function () {
            var self = this;
            $("#rdprwactionsbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                self._myActionsbtnclick();
                return false;
            });
        },

        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                }
                catch (ex) {
                    alert("prweb.rdactionslist.dispose reports error " + ex.Message);
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
                alert("prweb.rdactionslist.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }
        //#endregion
    });
} (this.prweb, jQuery));
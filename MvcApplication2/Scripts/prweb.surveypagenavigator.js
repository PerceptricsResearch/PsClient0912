/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {
    $.widget('prweb.surveypagenavigator', {
        //#region Options
        options: {
            isDocked: true,
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion

        //#region Create
        xevent: "click.surveypagenavigator",
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.surveypagenavigator";
                    $("#surveypagenaviscrollable").css("overflow", "hidden");
                }
                prweb.surveymodelsvc.populatepageslistVMx();
                var konode = this.element; //is $("#guestpagespanel")
                ko.applyBindings(prweb.surveymodelsvc.pageslistViewModelx, konode[0]);
                konode = null;

                this._populateActionsBtnHandler();
                this._populatePageIconBtnHandlers();
            }
            catch (ex) {
                alert("prweb.surveypagenavigator.create reports " + ex.Message);
            }
        },
        //#endregion


        _populatePageIconBtnHandlers: function () {
            //            var self = this;
            $(".prwpageiconcontent", this.element).on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                $(this).removeClass("defaultpageicon").addClass("selectedpageicon");
                //                $(this).css("background", "rgba(210,160,1,0.8)"); //see prweb.base.showClick...
                //can't do showclick here...is bound through a ko css binding....so it makes it a little slow to react...not good...oh well..
                var pgnum = ko.dataFor(this).pgnumber;

                prweb.playersvc.seekTo(parseInt(pgnum));
                prweb.surveymodelsvc.ManagePageChange(parseInt(pgnum));
                pgnum = null;
                return false;
            });
        },

        //#region ActionsBtnClick and panel animation

        isDocked: true,
        animwidthzero: { width: 0 },
        animwidthwide: { width: "7em" },
        animdur: { duration: 300, easing: 'easeInQuad' },

        _myActionsbtnclick: function () {
            if (!this.isDocked) {
                $("#surveypagenavicontainer").css("overflow", "hidden");
                this.element.stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
            }
            else {
                if (this.isDocked) {
                    this.element.stop(true, false).removeClass("prwslideouthide").animate(this.animwidthwide);
                    this.isDocked = false;
                    $("#surveypagenavicontainer").css("overflow", "auto");
                }
            }
            prweb.panelsmgr.ReportIsDocked("surveypagenavigator", this.isDocked);

            return true;
        },

        _populateActionsBtnHandler: function () {
            var self = this;
            $("#guestprwpagesbtn").on(this.xevent, function (e) {
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
                $("#surveypagenavicontainer").css("overflow", "hidden");
                this.element.stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
                prweb.panelsmgr.ReportIsDocked("surveypagenavigator", this.isDocked);
            }
            return true;
        },

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#guestprwpagesbtn").off(this.xevent);
                    $(".prwpageiconcontent", this.element).on(this.xevent);
                }
                catch (ex) {
                    alert("prweb.surveypagenavigator.dispose reports error " + ex.Message);
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
                alert("prweb.surveypagenavigator.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
        //#endregion
    });
} (this.prweb, jQuery));
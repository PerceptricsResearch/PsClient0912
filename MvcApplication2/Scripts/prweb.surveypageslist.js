(function (prweb, $) {

    // pagescount....if pagescount was available for each survey(without having to retrieve the pages...) we could support a really quick image based view of any survey...
    // this is pageslist for subscribers...there is a different version for RDents to do pagelevelnavigation with...rdsurveypageslist...different because 
    // RDent stuff uses fewer prweb objects...only has a single survey datacontext...

    $.widget('prweb.surveypageslist', {
        //#region Options
        options: {
            isDocked: true,
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion

        //#region Create
        xevent: "click.surveypageslist",
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.surveypageslist";
//                    $("#surveypagenaviscrollable").css("overflow", "hidden");
                }
                prweb.surveymodelsvc.populatepageslistVMx();
                var konode = this.element; //is $("#guestpagespanel")
                ko.applyBindings(prweb.surveymodelsvc.pageslistViewModelx, konode[0]);
                konode = null;

                this._populateActionsBtnHandler();
                this._populatePageIconBtnHandlers();
            }
            catch (ex) {
                alert("prweb.surveypageslist.create reports " + ex.Message);
            }
        },
        //#endregion


        _populatePageIconBtnHandlers: function () {
            //            var self = this;
            $(".prwpageiconcontent", this.element).on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    $(this).removeClass("defaultpageicon").addClass("selectedpageicon");
                    //                $(this).css("background", "rgba(210,160,1,0.8)"); //see prweb.base.showClick...
                    //can't do showclick here...is bound through a ko css binding....so it makes it a little slow to react...not good...oh well..
                    var pgnum = ko.dataFor(this).pgnumber;

                    prweb.playersvc.seekTo(parseInt(pgnum));
                    prweb.surveymodelsvc.ManagePageChange(parseInt(pgnum));
                    pgnum = null;
                }
                catch (ex) {
                    alert("prweb.surveypageslist.pageiconcontent.clickhandler reports " + ex.Message);
                }
                return false;
            });
            return;
        },

        //#region ActionsBtnClick and panel animation

        isDocked: true,
        animwidthzero: { width: 0 },
        animwidthwide: { width: "11em" },
        animdur: { duration: 300, easing: 'easeInQuad' },

        _myActionsbtnclick: function () {
            if (!this.isDocked) {
                //                $("#shomesurveypagenavipanel").css("overflow", "hidden");
                $("#shomesurveypagenavipanel").stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
            }
            else {
                if (this.isDocked) {
                    $("#shomesurveypagenavipanel").stop(true, false).removeClass("prwslideouthide").animate(this.animwidthwide);
                    this.isDocked = false;
                    //                    $("#shomesurveypagenavipanel").css("overflow", "auto");
                }
            }
            prweb.panelsmgr.ReportIsDocked("surveypageslist", this.isDocked);

            return true;
        },

        _populateActionsBtnHandler: function () {
            var self = this;
            $("#prwpagesbtn").on(this.xevent, function (e) {
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
                //                $("#shomesurveypagenavipanel").css("overflow", "hidden");
                $("#shomesurveypagenavipanel").stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
                prweb.panelsmgr.ReportIsDocked("surveypageslist", this.isDocked);
            }
            return true;
        },

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#prwpagesbtn").off(this.xevent);
                    $(".prwpageiconcontent", this.element).on(this.xevent);
                    $("#shomesurveypagenavipanel").stop(true, false).css("width", "0em").addClass("prwslideouthide");
                    this.isDocked = true;
                }
                catch (ex) {
                    alert("prweb.surveypageslist.dispose reports error " + ex.Message);
                    ex = null;
                }
                finally {
                    this.options.isDisposed = true;
                }
            }
            return;
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.surveypageslist.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
            return;
        }
        //#endregion

    }); // end of .widget function...

} (this.prweb, jQuery));
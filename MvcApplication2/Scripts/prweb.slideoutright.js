/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.slideoutright', {
        options: {
            surveycontext: -1,
            isDocked: true,
            isDisposed: false
        },

        _create: function () {
            try {
                //dindings to surveymetadatasvc.vmx are done when the widget is openned/viewed for the first time...
                //see _surveyDetailsButtonClick below...in the 'isdDocked == empty' case...
                if (prweb.IsTouch) {
                    $("#slideoutrightcontainer").css("-webkit-transform", "translate3d(0,0,0)");
                }
                this._subscribeToVSMEvents();
            }
            catch (ex) {
                alert("slideoutright.js.create reports " + ex.Message);
            }

        },


        animwidthzero: { width: 0 },
        animwidthwide: { width: 220 },
        animdur: { duration: 300, easing: 'easeInQuad' },
        animduropen: { duration: 300, easing: 'easeInQuad', complete: function () {

        }
        },
        isDocked: "empty",

        _surveyDetailsButtonClick: function () {
            switch (true) {
                case (this.isDocked == "empty"):
                    {
                        $("#slideoutrightcontainer").removeClass("prwslideouthide").stop(true, false).animate(this.animwidthwide, this.animduropen);
                        this.isDocked = false;

                        prweb.slideoutrightsvc.RegisterContentResource();
                        var konode = $("#prwslideoutrightkobindingpoint");
                        ko.applyBindings(prweb.slideoutrightsvc.Vmx, konode[0]);
                        konode = null;
                        $("#prwslideoutrightitemsset").scroller({
                            vertical: true,
                            touch: true,
                            prev: ".slideoutrightprev",
                            next: ".slideoutrightnext",
                            items: ".itemsslideoutright",
                            item: ".prwslideoutrightitemcontainer",
                            inertialbtns: true
                        });
                        break;
                    };
                case (this.isDocked):
                    {
                        $("#slideoutrightcontainer").stop(true, false).animate(this.animwidthwide);
                        this.isDocked = false;
                        break;
                    };
                case (!this.isDocked):
                    {
                        $("#slideoutrightcontainer").stop(true, false).animate(this.animwidthzero, this.animdur);
                        this.isDocked = true;
                        break;
                    };
            };
            prweb.panelsmgr.ReportIsDocked("slideoutright", this.isDocked);
            return true;
        },

        _myCloseList: function () {
            if (this.isDocked != "empty" && !(this.isDocked)) {
                $("#slideoutrightcontainer").stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
                prweb.panelsmgr.ReportIsDocked("slideoutright", this.isDocked);
            }
            return true;
        },



        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    if (this.isDocked != "empty") {
                        this._myCloseList(); //if panel is open, close it...
                        var konode = $("#prwslideoutrightkobindingpoint");
                        ko.cleanNode(konode[0]);
                        konode = null;
                        $("#prwslideoutrightitemsset").data('scroller').dispose();
                        $("#prwslideoutrightitemsset").remove();
                    }
                }
                catch (ex) {
                    alert("prweb.slideoutright.dispose reports error " + ex.Message);
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
                alert("prweb.slideoutright.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }

        //end of widget defn...
    });
} (this.prweb, jQuery));
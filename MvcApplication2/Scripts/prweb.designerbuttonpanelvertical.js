/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designerbuttonpanelvertical', {
        options: {
            vertical: false
        },

        //#region Create and populateColorChanged internal
        myclass: "designerbuttonpanelvertical",
        xevent: "click.designerbuttonpanelvertical",
        _create: function () {
            this._populateDeviceControl();
            $(this.element).scroller({ vertical: false, touch: true, prev: ".prevtextbtnpnl", next: ".nexttextbtnpnl", inertialbtns: true });
        },



        _populateDeviceControl: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.designerbuttonpanelvertical";
                $("#dtextbtnpnlbackmorebtns").attr("visibility", "hidden");
                $("#dsgntextbtnpnl").css("height", "92%").css("margin-top", "7%");
            }
        },

        //#region Dispose Destroy

        dispose: function () {
            try {
                $(this.element).data('scroller').dispose();
                $(".designerbuttonpanelvertical", this.element).unbind(".designerbuttonpanelvertical").remove();

            }
            catch (ex) {
                alert("prweb.designerbuttonpanelvertical.dispose reports error " + ex.Message);
                ex = null;
            }
            finally {
                //                return true;
            }
        },

        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }

        //#endregion

        //end of widget defn...
    });
} (this.prweb, jQuery));
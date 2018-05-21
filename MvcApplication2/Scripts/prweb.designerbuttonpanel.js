/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designerbuttonpanel', {
        options: {
            vertical: false
        },

        //#region Create and populateColorChanged internal
        myclass: "designerbuttonpanel",
        xevent: "click.designerbuttonpanel",
        _create: function () {
            this._populateDeviceControl();
            $(this.element).scroller({ vertical: false, touch: true, prev: ".prevdsgnbtnpnl", next: ".nextdsgnbtnpnl", inertialbtns: true });
        },



        _populateDeviceControl: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.designerbuttonpanel";
                $("#dstylesbtnpnlbackmorebtns").attr("visibility", "hidden");
                $("#dsgnstylesbtnpnl").css("height", "92%").css("margin-top", "7%");
            }
            //            if (navigator.platform == "iPad") {
            //                this._makeIpad(this.element[0]);
            //            }
            //            else {
            //                this._makeDraggableResizable();
            //            }
        },

        //#region Dispose Destroy

        dispose: function () {
            try {
                $(this.element).data('scroller').dispose();
                $(".designerbuttonpanel", this.element).unbind(".designerbuttonpanel").remove();

            }
            catch (ex) {
                alert("prweb.designerbuttonpanel.dispose reports error " + ex.Message);
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
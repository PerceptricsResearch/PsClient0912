/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designerfontsize', {
        options: {
            vertical: false
        },

        //#region Create and populateColorChanged internal
        myclass: "designerfontsize",
        xevent: "click.designerfontsize",
        _create: function () {
            this._populateDeviceControl();
            $(this.element).scroller({
                vertical: true,
                touch: true,
                item: ".fontsizeitem",
                prev: ".prevfontsize",
                next: ".nextfontsize",
                scrollalignToItem: true,
                inertialsize: 4,
                publishSelectedValue: true,
                movecompletehandler: this.fontSizePublishHandler,
                inertialbtns: true
            });
        },

        fontSizePublishHandler: function ($selected) {
            var xnew = $selected.text();
            $selected = null;
            prweb.designertextsvc.ExecuteFontSize(xnew + "pt");
        },

        _populateDeviceControl: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.designerfontsize";
                $("#fontsizespinner").unbind().attr("visibility", "hidden").remove();
                $(this.element).css("width", "25%").css("height", "75%").css("margin-right", "1%");
            }
        },

        //#region Dispose Destroy

        dispose: function () {
            try {
                $(this.element).data('scroller').dispose();
                $(".designerfontsize", this.element).unbind(".designerfontsize").remove();

            }
            catch (ex) {
                alert("prweb.designerfontsize.dispose reports error " + ex.Message);
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
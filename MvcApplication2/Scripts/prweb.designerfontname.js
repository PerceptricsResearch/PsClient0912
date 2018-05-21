/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designerfontname', {
        options: {
            vertical: false
        },

        //#region Create and populateColorChanged internal
        myclass: "designerfontname",
        xevent: "click.designerfontname",
        _create: function () {
            this._populateDeviceControl();
            $(this.element).scroller({
                vertical: true,
                touch: true,
                item: ".fontnameitem",
                prev: ".prevfontname",
                next: ".nextfontname",
                scrollalignToItem: true,
                inertialsize: 4,
                publishSelectedValue: true,
                movecompletehandler: this.fontNamePublishHandler,
                inertialbtns: true });
        },

        fontNamePublishHandler: function ($selected) {
            var xnew = $selected.text();
            $selected = null;
            prweb.designertextsvc.ExecuteFontName(xnew);
        },

        _populateDeviceControl: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.designerfontname";
                $("#fontnamespinner").unbind().attr("visibility", "hidden").remove();
                $(this.element).css("width", "70%").css("height", "75%").css("margin-right", "2%");
            }
        },

        //#region Dispose Destroy

        dispose: function () {
            try {
                $(this.element).data('scroller').dispose();
                $(".designerfontname", this.element).unbind(".designerfontname").remove();

            }
            catch (ex) {
                alert("prweb.designerfontname.dispose reports error " + ex.Message);
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
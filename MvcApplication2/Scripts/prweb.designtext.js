/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designtext', {

        options: {
            id: 0
        },

        _create: function () {
            var myclass = "designtext";
            var xevent = "click.designtext";
            if (prweb.IsTouch) {
                xevent = "tap.designtext";
                // keep this thing from scrolling left and right when people miss the fontsize name selectors...
                $("#textbtncontainer").bind("touchstart", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    e = null;
                    return false;
                });
            }
//            $("#dsgntextbtnpnl").designerbuttonpanelvertical();
            $("#dsgnrfontsizeselector").designerfontsize();
            $("#dsgnrfontselector").designerfontname();
            this._populateTextBtns(myclass, xevent);
        },

        _populateTextBtns: function (myclass, xevent) {

            $("#dsgnrtextboldbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designertextsvc.ExecuteBold();
                return false;
            });
            $("#dsgnrtextitalicbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designertextsvc.ExecuteItalic();
                return false;
            });
            $("#dsgnrtextcolorbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designertextsvc.ExecuteColor();
                return false;
            });
            $("#dsgnrtextunderlinebtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designertextsvc.ExecuteUnderline();
                return false;
            });
            $("#dsgnrtextjustifyleftbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designertextsvc.ExecuteJustifyLeft();
                return false;
            });
            $("#dsgnrtextjustifyrightbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designertextsvc.ExecuteJustifyRight();
                return false;
            });
            $("#dsgnrtextjustifycenterbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designertextsvc.ExecuteJustifyCenter();
                return false;
            });
            $("#dsgnrtextjustifyfullbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designertextsvc.ExecuteJustifyFull();
                return false;
            });
        },


        dispose: function () {
            try {
                $(".designtext").unbind().html("").remove();

            }
            catch (e) {
                alert("prweb.designtext.dispose reports error...");
            }
            finally {
                return true;
            }
        },

        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });
} (this.prweb, jQuery));
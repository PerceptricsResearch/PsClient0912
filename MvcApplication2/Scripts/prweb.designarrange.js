/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designarrange', {

        options: {
            id: 0
        },

        _create: function () {
            var myclass = "designarrange";
            var xevent = "click.designarrange";
            if (prweb.IsTouch) {
                xevent = "tap.designarrange";
            }
            //            this._setUpSizeTouchable();
            //            this._populateSizeBtns(myclass, xevent);
            this._populateAlignmentBtns(myclass, xevent);
        },

        _populateAlignmentBtns: function (myclass, xevent) {
            $("#bringtofrontbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.BringToFront();
                return false;
            });
            $("#sendtobackbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.SendToBack();
                return false;
            });
            $("#bringforwardbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.BringForward();
                return false;
            });
            $("#sendbackwardbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.SendBackward();
                return false;
            });
            $("#prwdsgnArrangeUndoBtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.UndoArrangement();
                return false;
            });
        },


        dispose: function () {
            try {
                $(".designarrange").unbind().html("").remove();

            }
            catch (e) {
                alert("prweb.designalignment.dispose reports error...");
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
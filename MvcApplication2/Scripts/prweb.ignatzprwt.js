/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.ignatzprwt', {
        options: {
            id: 0,
            designeritemcontroloptions: {
                clickallow: true,
                dragallow: true,
                resizeallow: true
            },
            isDisposed: false
        },
        myclass: "ignatzprwt",
        xevent: "click.ignatzprwt",
        _create: function () {
            var mymodel = ko.dataFor(this.element[0]);
            if (mymodel.hasOwnProperty("modelcore")) {
                ko.applyBindings(mymodel, this.element[0]);
            }
            else {
                var dbgx = 2;
            }
            mymodel = null;
            this._populateDeviceControl();
        },

        _populateDeviceControl: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.ignatzprwt";
            }
        },

        _showEditableButtons: function () {
            var myxevent = this.xevent;
            $(".prwdesignereditable", this.element).bind(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                $(this).unbind(myxevent)
                    .addClass("activeeditable")
                    .designereditable({
                        myprwT: "prwTIgnatz"
                    });
                return false;
            });
            return;
        },

        _destroyEditables: function () {
            $(".prwdesignereditable", this.element).unbind(this.xevent);
            $(".activeeditable", this.element).unbind(this.xevent).each(function () {
                $(this).removeClass("activeeditable").data("designereditable").dispose().destroy();
            });
            //            eds = null;
        },

        //#region EditStart EditEnd

        AllowClick: function () {
            return this.options.designeritemcontroloptions.clickallow;
        },

        DragAllowed: function () {
            return this.options.designeritemcontroloptions.dragallow;
        },

        _populateDragAllowed: function (newval) {
            this.options.designeritemcontroloptions.dragallow = newval;
            return;
        },

        _populateClickAllowed: function (newval) {
            this.options.designeritemcontroloptions.clickallow = newval;
            return;
        },

        EditStart: function () {
            var self = this;
            this._populateDragAllowed(false); //test this for now...only really do this when in textEditable...
            this._populateClickAllowed(false);
            this._showEditableButtons();
            //            $("#dsgnreditdonebtnbackground").attr("fill", "url(#dblg1)");
            //            $("#dsgnreditdonebtntextedit").attr("visibility", "hidden");
            //            $("#dsgnreditdonebtntextdone").attr("visibility", "visible");
            //            $("#dsgnreditdonebtn")
            //                .bind(this.xevent, function (e) {
            //                    e.preventDefault();
            //                    e.stopPropagation();
            //                    e.cancelBubble = true;
            //                    self.EditEnd();
            //                    return false;
            //                });
        },

        EditEnd: function () {
            this._destroyEditables();
            //            $("#dsgnreditdonebtnbackground").attr("fill", "url(#dblg2)");
            //            //            $("#dsgnreditdonebtn").unbind(this.xevent);
            //            $("#dsgnreditdonebtntextedit").attr("visibility", "visible");
            //            $("#dsgnreditdonebtntextdone").attr("visibility", "hidden");
            $(".editinprogress").removeClass("editinprogress").addClass("activedesigneritem");
            this._populateDragAllowed(true); //test this for now...only really do this when in textEditable...
            this._populateClickAllowed(true);
        },

        //#endregion

        _makeIpad: function (ix) {
        },

        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $(".ignatzprwt", this.element).unbind().html("").remove();
                }
                catch (ex) {
                    alert("prweb.ignatzprwt.dispose reports error " + ex.Message);
                    ex = null;
                }
                finally {
                    this.options.isDisposed = true;
                }
            };
            return this;
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.ignatzprwt.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
    });
} (this.prweb, jQuery));
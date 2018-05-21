/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.imageprwt', {
        //#region Create and Options

        options: {
            designeritemcontroloptions: { clickallow: true, dragallow: true, resizeallow: true },
            isDisposed: false
        },

        myclass: "imageprwt",
        xevent: "click.imageprwt",
        _create: function () {
            var mymodel = ko.dataFor(this.element[0]);
            if (mymodel.hasOwnProperty("modelcore")) {
                ko.applyBindings(mymodel, this.element[0]); 
            }
            mymodel = null;
            this._populateDeviceControl();
        },

        //#endregion

        _populateDeviceControl: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.imageprwt";
            }
            //            if (navigator.platform == "iPad") {
            //                this._makeIpad(this.element[0]);
            //            }
            //            else {
            //                this._makeDraggableResizable();
            //            }
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
            //            this._showEditableButtons();
//            $("#dsgnreditdonebtnbackground").attr("fill", "url(#dblg1)");
//            $("#dsgnreditdonebtntextedit").attr("visibility", "hidden");
//            $("#dsgnreditdonebtntextdone").attr("visibility", "visible");
//            $("#dsgnreditdonebtn")
//                .bind(this.xevent, function (e) {
//                    e.preventDefault();
//                    e.stopPropagation();
//                    self.EditEnd();
//                });
        },

        EditEnd: function () {
            //            this._destroyEditables();
//            $("#dsgnreditdonebtnbackground").attr("fill", "url(#dblg2)");
//            $("#dsgnreditdonebtn").unbind(this.xevent);
//            $("#dsgnreditdonebtntextedit").attr("visibility", "visible");
//            $("#dsgnreditdonebtntextdone").attr("visibility", "hidden");
            $(".editinprogress").removeClass("editinprogress").addClass("activedesigneritem");
            this._populateDragAllowed(true);
            this._populateClickAllowed(true);
        },

        //#endregion

        //#region Dispose Destroy

        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $(".imageprwt", this.element).unbind().html("").remove();
                }
                catch (ex) {
                    alert("prweb.imageprwt.dispose reports error " + ex.Message);
                }
                finally {
                    this.options.isDisposed = true;
                }
            }
            return this;
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.imageprwt.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }

        //#endregion
    });
} (this.prweb, jQuery));
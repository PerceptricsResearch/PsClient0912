/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.editablecontainer', {
        options: {
            id: 0,
            designeritemcontroloptions: { clickallow: false, dragallow: false, resizeallow: true },
            isDisposed: false,
            mystyle: false
        },


        _create: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.editablecontainer";
            }

            this._inheritPropertiesFromRelatedDesignerItem();
            $(".prweditablecontainercontent", this.element).html(prweb.designersvc.editablecontent);
            this._createRedactor();
            $("#prwedcntnrdonebtn").on(this.xevent, function () {
                try {
                    //                    var myta = $("#" + prweb.designersvc.editableselector);
                    var html = $(".prweditablecontainercontent").getCode();
                    var redtblewidget = prweb.designertextsvc.CurrentEditable.data("designereditable");
                    if (redtblewidget) {
                        //                        prweb.designertextsvc.CurrentEditable.css("padding-left", "15px").css("padding-right", "15px").css("padding-bottom", "15px");
                        redtblewidget.populateEditedHtml(html);
                    }
                    redtblewidget = null;
                    //                    myta = null;
                    html = null;
                }
                catch (ex) {
                    alert("editablecontainer.donebtnhandler reports " + ex.Message);
                }
                prweb.ScrollWindowTop();
            });
            $("#prwedcntnrcancelbtn").on(this.xevent, function () {
                try {
                    var redtblewidget = prweb.designertextsvc.CurrentEditable.data("designereditable");
                    redtblewidget.revertToLockbox();
                    redtblewidget = null;
                }
                catch (ex) {
                    alert("editablecontainer.cancelbtnhandler reports " + ex.Message);
                }
                prweb.ScrollWindowTop();
            });
        },

        myclass: "editablecontainer",

        xevent: "click.editablecontainer",

        _computeWrapperSizes: function () {
            try {
                var $redtble = prweb.designertextsvc.CurrentEditable; //related editable as jquery object
                //                var relatedEditablemodel = ko.dataFor(redtble[0]);
                //                $redtble.css("padding-left", "0").css("padding-right", "0").css("padding-top", "0").css("padding-bottom", "0");
                var rh = $redtble.height();
                var rw = $redtble.width();
                var $rpar = $redtble.parent();
                var $rparmargin = $rpar.css("margin-left");
                var rparh = $rpar.outerHeight();
                var rparw = $rpar.outerWidth();
                var rparih = $rpar.innerHeight();
                var $rparpar = $rpar.parent();
                var rparparh = $rparpar.outerHeight();
                var rparparw = $rparpar.outerWidth();

                $(".prweditablecontainerbckgrnd", this.element).css("width", rparparw).css("height", rparparh);
                $(".prweditablecontainercontentwrapper", this.element).css("height", rparh); //.css("width", rparw)
                $(".prweditablecontainercontent", this.element).css("left", $rparmargin).css("height", rparih); //.css("width", rw)
                //                $(".prweditablecontainercontent", this.element).css("width", rw).css("height", rh).css("left", $rparmargin);
                $redtble, rh, rw, rparh, rparw, rparparh, rparparw = null;
            }
            catch (ex) {
                alert("editablecontainer.computeWrapperSizes reports " + ex.Message);
            }
            return;
        },

        _inheritPropertiesFromRelatedDesignerItem: function () {
            var mymodel = ko.dataFor(this.element[0]);
            var rdimdl = null;
            if (mymodel.hasOwnProperty("modelcore")) {
                ko.applyBindings(mymodel, this.element[0]);
                rdimdl = prweb.designersvc.CurrentPCElemModel; //relateddesigneritem model
                mymodel.modelcore.BackgroundBrushUrl(rdimdl.modelcore.BackgroundBrushUrl());
                mymodel.modelcore.BackgroundOpacity(rdimdl.modelcore.BackgroundOpacity());
                this._computeWrapperSizes();
            }
            mymodel = null;
            rdimdl = null;
        },




        _createRedactor: function () {
            var rslt = false;
            var self = this;
            //            var taselector = "#" + prweb.designersvc.editableselector;
            //            var myta = $("#" + prweb.designersvc.editableselector);
            var myta = $(".prweditablecontainercontent", this.element);
            if (myta.length == 1) {
                try {
                    //                    myta.css("display", "");
                    //myta should be sized here...before the redactor call...
                    //make it the size of the text space inside of the svg that is being edited...
                    //also want to make the $prweditablecontainerbckgrnd the size of the svg that is being edited...
                    myta.redactor({
                        toolbarExternal: "#prwecpanel",
                        autoresize: true,
                        plugins: ['fontsize'],
                        focus: true
                    }
                    );
                    if (prweb.IsTouch) {
                        $(document).on("scroll", prweb.ScrollWindowTop);
                    }

                    rslt = true;
                }
                catch (ex) {
                    alert("prweb.designereditable.createRedactor reports.. " + ex.Message);
                }
            }
            myta = null;
            prweb.ScrollWindowTop();
            return rslt;
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
            //            var self = this;
            //            this._populateDragAllowed(false); //test this for now...only really do this when in textEditable...
            //            this._populateClickAllowed(false);
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
            //            $(".editinprogress").removeClass("editinprogress").addClass("activedesigneritem");
            //            this._populateDragAllowed(true); //test this for now...only really do this when in textEditable...
            //            this._populateClickAllowed(true);
            prweb.ScrollWindowTop();
        },

        //#endregion



        //#region Dispose and Destroy

        dispose: function () {
            try {
                this.element.unbind().html("").remove();
                $("#prwedcntnrdonebtn").off(this.xevent);
                $("#prwedcntnrcancelbtn").off(this.xevent);
                if (prweb.IsTouch) {
                    $(document).off("scroll", prweb.ScrollWindowTop);
                }
            }
            catch (ex) {
                alert("prweb.editablecontainer.dispose reports error..." + ex.Message);
                ex = null;
            }
            finally {
                this.options.isDisposed = true;
            }
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.editablecontainer.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }

        //#endregion
    });
} (this.prweb, jQuery));
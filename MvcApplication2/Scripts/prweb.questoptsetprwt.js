/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.questoptsetprwt', {
        //#region Options and Create and DeviceControl

        options: {
            id: 0,
            designeritemcontroloptions: { clickallow: true, dragallow: true, resizeallow: true },
            mydesignereditables: false,
            iamactive: false,
            hasinactivehandler: false,
            myidnumber: null,
            mysvgcontent: null,
            mymainpanel: null,
            title: '',
            displayName: '',
            melayoutElement: null,
            isDocked: true,
            hasAppliedBindings: false,
            myDOMNode: null,
            lastone: null,
            ismymainpanelpartial: false,
            sendRequest: null,
            isDisposed: false
        },

        myclass: "questoptsetprwt",
        xevent: "click.questoptsetprwt",

        _create: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.questoptsetprwt";
            }
            var mymodel = ko.dataFor(this.element[0]);
            if (mymodel.hasOwnProperty("modelcore")) {
                ko.applyBindings(mymodel, this.element[0]);
            }
            mymodel = null;
            //            this._populateDeviceControl();
        },

        //        _populateDeviceControl: function () {
        //            if (prweb.IsTouch) {
        //                this.xevent = "tap.questoptsetprwt";
        //            }
        //            //            if (navigator.platform == "iPad") {
        //            //                this._makeIpad(this.element[0]);
        //            //            }
        //            //            else {
        //            //                this._makeDraggableResizable();
        //            //            }
        //        },
        //#endregion

        _manageVisibility: function () {

        },

        //#region Deletables show and remove

        showDeletables: function () {
            var self = this;
            var mymodel = ko.dataFor(this.element[0]);
            $(".qoimdeletableitem", this.element).removeClass("prwhide");
            $(".qoimdeletableitem", this.element).on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.cancelBubble = true;
                    var row = ko.dataFor(this);
                    //                var rowdata = row();
                    mymodel.QuestOptSetModel.ItemsObservableColxn.remove(row);
                    row.Dispose();
                    row = null;
                    self.removeDeletables();
                    //this needs to recompute layout of qoims after a remove...leaves a blank qoim in the layout...
                    //should probably be a generallized method for qoims to redo layout sizing...put this method in the model...
                    //should be a model based method because its gonna update a bunch of size related observables...
                    //some of this happens already when we do remove column row, add column row...
                    //see designoptions widget...button click handlers...they call a designersvc.action method...
                }
                catch (ex) {
                    alert("prweb.questoptsetprwt.showDeletables.removehandler reports error " + ex.Message);
                }
                return false;
            });
        },

        removeDeletables: function () {
            //            var mymodel = ko.dataFor(this.element[0]);
            $(".qoimdeletableitem", this.element).off(this.xevent).addClass("prwhide");
        },


        //#endregion

        //#region EditableButtons show destroy manage

        _manageEditables: function () {
            //            var mprwT = this.options.myprwT;
            //            this.options.mydesignereditables = $(".prwdesignereditable", this.element).designereditable({ myprwT: mprwT });
            //            mprwT = null;
        },

        _showEditableButtons: function () {
            var myxevent = this.xevent;
            $(".prwdesignereditable", this.element).on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                $(this).off(myxevent).addClass("activeeditable").designereditable({ myprwT: "prwTQuestOptionSet" });
                return false;
            });
        },

        _destroyEditables: function () {
            $(".prwdesignereditable", this.element).off(this.xevent);
            $(".activeeditable", this.element).off(this.xevent).each(function () {
                $(this).removeClass("activeeditable").data("designereditable").dispose().destroy();
            });
            //            eds = null;
        },

        //#endregion

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
            //                    prweb.designertextsvc.ApplyEditableChanges();
            //                    self.EditEnd();
            //                    return false;
            //                });
        },

        EditEnd: function () {
            this._destroyEditables();
            //            $("#dsgnreditdonebtnbackground").attr("fill", "url(#dblg2)");
            //            $("#dsgnreditdonebtn").unbind(this.xevent);
            //            $("#dsgnreditdonebtntextedit").attr("visibility", "visible");
            //            $("#dsgnreditdonebtntextdone").attr("visibility", "hidden");
            $(".editinprogress").removeClass("editinprogress").addClass("activedesigneritem");
            this._populateDragAllowed(true); //test this for now...only really do this when in textEditable...
            this._populateClickAllowed(true);
        },

        //#endregion

        _isAnyDesignerEditableActive: function () {
            var rslt = false;
            //            if (this.options.mydesignereditables) {
            //                this.options.mydesignereditables.each(function (i, domelem) {
            //                    rslt = rslt || $(domelem).data("designereditable")._isActive();
            //                    domelem = null;
            //                    if (rslt) {
            //                        return false; //this breaks the .each() iteration...so we don't do any more work than necessary...once rslt is true, quit...
            //                    }
            //                });
            //            }
            return rslt;
        },

        _makeIpad: function (ix) {
        },

        //#region Dispose Destroy

        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $(".questoptsetprwt", this.element).off().html("").remove();
                }
                catch (ex) {
                    alert("prweb.questoptsetprwt.dispose reports error " + ex.Message);
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
                alert("prweb.questoptsetprwt.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }

        //#endregion
    });
} (this.prweb, jQuery));
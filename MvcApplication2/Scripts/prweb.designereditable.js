/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designereditable', {
        options: {
            eventID: 0,
            autoedit: false,
            myprwT: null,
            myoriginalbackground: null,
            iamcurrenteditable: false,
            lockbox: null,
            mytextarea: null,
            mytextselector: null,
            iamactive: false,
            hasinactivehandler: false,
            melayoutElement: null,
            isDisposed: false
        },
        myclass: "designereditable",
        xevent: "click.designereditable",
        _create: function () {
            try {
                this.options.eventID = prweb.designersvc.UniqueID();
                this.options.mytextselector = "myta" + this.options.eventID.toString();
                if (prweb.IsTouch) {
                    this.xevent = "tap.designereditable";
                }
                if (!this.options.autoedit) {
                    this._populateHandlers();
                }
            }
            catch (ex) {
                alert("prweb.designereditable.create reports " + ex.Message);
            }
            return;
        },

        _init: function () {
            try {
                if (this.options.autoedit) {
                    this._doubleclickbehavior();
                }
            }
            catch (ex) {
                alert("prweb.designereditable.init reports " + ex.Message);
            }
            return;
        },

        _isActive: function () {
            var rslt = false;
            if (this.options.mytextarea) {
                rslt = true;
            }
            return rslt;
        },


        //#region makeMeCurrentEditable
        //is called by this.doubleclickbehavior
        //gets designeritem editable html, creates a <textarea>htmlstring and causes the designersvc to AddEditableContainer...
        _makeMeCurrentEditable: function () {
            var rslt = false;
            try {
                prweb.designertextsvc.CurrentEditable = this.element;
                var ih = this.element.html();
                this.options.lockbox = ih;
                //                var tstring = " background:rgb(0,0,200); -webkit-transform: translate(0,0) scale(1.5);";
                var oestyle = this.element.attr("style") + "background:rgba(200,1,1,0.8);"; // + tstring;
                prweb.designertextsvc.OrginalElemStyle = oestyle;
                var taid = this.options.mytextselector;
                //                var ta = "<textarea id='" + taid + "' class='" + taid + "' name='" + taid + "' style='" + oestyle + "display:none;' >" + ih + "</textarea>";
                var ta = ih;
                this.element.addClass("activeeditable"); //.html(ta);.empty()
                prweb.designeritemeditorsvc.AddEditableContainer({
                    editablecontent: ta,
                    editableselector: taid
                });
                //                prweb.designersvc.AddEditableContainer(ta, taid);
                ih = null;
                ta = null;
                oestyle = null;
                taid = null;
                rslt = true;
            }
            catch (ex) {
                alert("prweb.designereditable.makeMeCurrentEditable reports... " + ex.Message);
            }
            return rslt;
        },
        //#endregion

        //#region doubleclick
        _doubleclickbehavior: function () {
            var rslt = false;
            try {
                prweb.designertextsvc.CurrentSelection = false;
                if (prweb.designertextsvc.GetRidofCurrentEditable()) {
                    rslt = this._makeMeCurrentEditable();
                }
                this.options.iamcurrenteditable = rslt;
            }
            catch (ex) {
                alert("prweb.designereditable.doubleclickbehavior reports " + ex.Message);
            }

            return rslt;
        },

        //#endregion

        populateEditedHtml: function (html) {
            try {
                if (this.options.iamcurrenteditable && html) {
                    //                    this.element.html(html); //.empty()
                    ko.dataFor(this.element[0]).modelcore.RTBHtml(html);
                    //                    prweb.designeritemeditorsvc.RemoveEditableContainer();
                    this.options.iamcurrenteditable = false;
                    //                this._populateHandlers();
                    //                    prweb.flex.IsEditableOverflow(this.element[0]);
                }
                html = null;
            }
            catch (ex) {
                alert("prweb.designereditable.populateEditedHtml reports " + ex.Message);
            }
            return;
        },

        revertToLockbox: function () {
            try {
                if (this.options.iamcurrenteditable) {
                    this.element.html(this.options.lockbox); //.empty()
                    //                ko.dataFor(this.element[0]).modelcore.RTBHtml(this.options.lockbox);
                    prweb.designeritemeditorsvc.RemoveEditableContainer();
                    this.options.iamcurrenteditable = false;
                    //                this._populateHandlers();
                }
            }
            catch (ex) {
                alert("prweb.designereditable.revertToLockbox reports " + ex.Message);
            }
            return;
        },


        //#region turnmyselectedlightsoff
        //retrieves the edited html and puts back in the related designeritem
        _turnmyselectedlightsoff: function (eventid) {
            var rslt = false;
            if (eventid !== this.options.eventID) {
                //                if (this.options.mytextarea) {
                //                    if (this.options.mytextarea.length == 1) {
                //                        this.options.mytextarea = null; //remove the reference to the textarea...so it disposes...
                //                        try {
                //                            var hastmce = tinymce || false;
                //                            if (hastmce) {
                //                                if (tinymce.get(this.options.mytextselector)) {
                //                                    hastmce = null;
                //                                    var tmcehtml = null;
                //                                    try {
                //                                        tmcehtml = tinymce.get(this.options.mytextselector).getContent();
                //                                        tinymce.execCommand('mceRemoveControl', false, this.options.mytextselector);
                //                                        prweb.designersvc.RemoveEditableContainer();
                //                                        this.element.empty().html(tmcehtml);
                //                                        ko.dataFor(this.element[0]).modelcore.RTBHtml(tmcehtml);
                //                                        tmcehtml = null;
                //                                    }
                //                                    catch (ex) {
                //                                        alert("prweb.designereditable.turnselectedlightsoff reports error " + ex.Message);
                //                                    }
                //                                    finally {
                //                                        this.options.mytextarea = false;
                //                                        tmcehtml = null;
                //                                        rslt = true;
                //                                    }
                //                                }
                //                            }
                //                            else {
                //                                alert("hastmce is false...");
                //                            }
                //                        }
                //                        catch (ex) {
                //                            alert("prweb.designereditable.turnmyselectedlightsoff.hastmce = false " + ex.Message);
                //                        }
                //                    }
                //                }
                //                this._populateHandlers();
            }
            eventid = null;
            return rslt;
        },

        //#endregion

        //#region populateHandlers
        _populateHandlers: function () {
            try {
                var self = this;
                this.element.addClass("designereditableselectable").bind(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        e.cancelBubble = true;
                        e = null;
                        self._doubleclickbehavior();
                    }
                    catch (ex) {
                        alert("prweb.designereditable.populateHandlers reports error " + ex.Message);
                    }
                    return false;
                });
            }
            catch (ex) {
                alert("prweb.designereditable.populateHandlers.xeventhandler reports error " + ex.Message);
            }
            return;
        },
        //#endregion


        //#region Dispose Destroy
        dispose: function () {
            try {
                if (this.options.iamcurrenteditable) {
                    //this happens when the current editable is being disposed and done btn has not been clicked anywhere...
                    //disposes of the editablecontainer/redactor and leaves the text unchanged in this editable.
                    //                    alert("designereditable.dispose reports iamcurrentedible");
//                    this.revertToLockbox();
                }
                //                this._turnmyselectedlightsoff(-1);
                this.element.unbind(this.xevent); //"click.designereditable");

                this.options.myDOMNode = null;
                this.options.melayoutElement = null;
                this.options.mytextarea = null;
                this.options.eventID = null;
            }
            catch (ex) {
                alert("prweb.designereditable.dispose reports error..." + ex.Message);
            }
            finally {
                return this;
            }
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.designereditable.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }

        //#endregion
    });
} (this.prweb, jQuery));
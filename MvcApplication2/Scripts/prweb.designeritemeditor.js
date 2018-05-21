/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designeritemeditor', {
        options: {
            id: 0,
            onbacktoggle: false,
            isnew: false,
            notecommentdata: false,
            isDisposed: false
        },

        xevent: "click.designeritemeditor",

        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.designeritemeditor";
                }
                this._populateButtonHandlers();
            }
            catch (ex) {
                alert("prweb.designeritemeditor.create reports " + ex.Message);
            }
            return;
        },

        _populateButtonHandlers: function () {
            try {
                $("#ditemeditoreditdonebtn").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        prweb.designeritemeditorsvc.DesignerItemEditDoneButtonAction();
                    }
                    catch (ex) {
                        alert("prweb.designeritemeditor.editdonebtnHandler reports " + ex.Message);
                    }
                    return false;
                });
                $("#ditemeditorbackcancelbtn").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        prweb.designeritemeditorsvc.DesignerItemBackCancelButtonAction();
                    }
                    catch (ex) {
                        alert("prweb.designeritemeditor.backcancelbtnHandler reports " + ex.Message);
                    }
                    return false;
                });
                $("#prwdesigntextbtn").on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        prweb.designeritemeditorsvc.DesignerItemTextButtonAction();
                    }
                    catch (ex) {
                        alert("prweb.designeritemeditor.textbtnHandler reports " + ex.Message);
                    }
                    return false;
                
                });
            }
            catch (ex) {
                alert("prweb.designeritemeditor.PopulateButtonHandlers reports " + ex.Message);
            }
            return;
        },


        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    //                    prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.smddetailsbtnclick, this._moveToVisualStateShiftMainPanel, this);
                    $("#ditemeditoreditdonebtn").off(this.xevent);
                    $("#ditemeditorbackcancelbtn").off(this.xevent);
                    $("#prwdesigntextbtn").off(this.xevent);
                    //                    var tedata = $('#textentrycontainerwrapper').data("textentry") || false;
                    //                    if (tedata != false) {
                    //                        tedata.destroy();
                    //                    }
                    //                    else {
                    //                        alert("prweb.designeritemeditor.dispose reports textentry is null...not disposed.");
                    //                    }
                    //                    tedata = null;
                    prweb.designeritemeditorsvc.Shutdown();
                }
                catch (ex) {
                    alert("prweb.designeritemeditor.dispose reports error " + ex.Message);
                    ex = null;
                }
                finally {
                    this.options.isDisposed = true;
                }
            }
            return;
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.designeritemeditor.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
        //#endregion

    });
} (this.prweb, jQuery));
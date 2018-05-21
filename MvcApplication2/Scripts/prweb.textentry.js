/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.textentry', {
        //#region Options
        options: {
            autoedit: true,
            sendbtn: true,
            slidoutselctor: false,
            textcontainerselctor: false,
            currenttext: false,
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion

        //#region Create
        xevent: "click.textentry",
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.textentry";
                    this.element.css('-webkit-transform', ' translate3d(0,0,0)');
                }
                this.populateSendCancelBtnHandler();
            }
            catch (ex) {
                alert("prweb.textentry.create reports " + ex.Message);
            }
            return;
        },
        _init: function () {
            if (this.options.autoedit) {
                this.hideEditBtn();
                if (this.options.currenttext != false) {
                    $("#textentryeditorplaceholder").html(this.options.currenttext());
                }
                this.loadredactor();
                this.manageSlideout();
            }
            else {
                this.populateEditBtnHandler();
            }
            if (!this.options.sendbtn) {
                this.hideSendBtn();
            }
            return;
        },
        //#endregion

        hideSendBtn: function () {
            $("#textentrysendbtn").css("display", "none");
        },

        hideEditBtn: function () {
            $("#textentryeditbtn").css("display", "none");
        },

        buttonscolxn: {
            comment: ['fontcolor', 'alignment', 'underline', 'backcolor', 'bold', 'italic']

        },
        loadredactor: function () {
            try {
                $("#textentryeditorcontainer").css("padding-left", "0").css("padding-right", "0");
                $("#textentryeditorplaceholder").redactor(
                {
                    toolbarExternal: "#textentrytoolbar",
                    buttons: this.buttonscolxn.comment,
                    focus: true
                });
            }
            catch (ex) {
                alert("prweb.textentry.loadredactor reports  " + ex.Message);
                ex = null;
            }
            return;
        },

        //#region Edit Btn Handler

        populateEditBtnHandler: function () {
            var self = this;
            $("#textentryeditbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                self.loadredactor();
                return false;
            });
            return;
        },

        //#endregion

        sendComment: function () {
            try {
                if (prweb.guestplatformsvc) {
                    var html = $("#textentryeditorplaceholder").getText(); //.getCode();
                    prweb.guestplatformsvc.SendComment(html);
                    $("#textentryeditorplaceholder").html("<p></p>");
                }
                else if (prweb.notecommentsvc) {
                    var html = $("#textentryeditorplaceholder").getCode();
                    this.options.currenttext(html); //this is an observable...cnc.body()...subscription in notecommentssvc sets isdirty...
                }
            }
            catch (ex) {
                alert("prweb.textentry.sendbtn.getCode reports  " + ex.Message);
                ex = null;
            }
            return;
        },
        clearChanges: function (original) {
            $("#textentryeditorplaceholder").html(original);
        },

        //#region Send and Cancel Btns Handlers
        populateSendCancelBtnHandler: function () {
            var self = this;
            $("#textentrysendbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                try {
                    self.sendComment();
                    self.manageSlideout();
                }
                catch (ex) {
                    alert("prweb.textentry.sendbtn.getCode reports  " + ex.Message);
                    ex = null;
                }
                return false;
            });
            $("#textentrycancelbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                try {
                    if (prweb.notecommentsvc) {
                        self.clearChanges(self.options.currenttext());
                    }
                    else {
                        $("#textentryeditorplaceholder").destroyEditor();
                        $("#textentryeditorplaceholder").html("<p></p>").unbind().off();
                        $("#textentryeditorcontainer").css("padding-left", "8px").css("padding-right", "12px");
                        self.manageSlideout();
                    }
                }
                catch (ex) {
                    alert("prweb.textentry.cancelbtn.destroyEditor reports  " + ex.Message);
                    ex = null;
                }
                return false;
            });
        },
        //#endregion


        //#region myBtnClick and panel animation
        isDocked: true,
        animwidthzero: { width: 0 },
        animwidthwide: { width: "20em" },
        animdur: { duration: 300, easing: 'easeInQuad' },

        closepanel: function ($slout) {
            if (!this.isDocked) {
                $slout.css("overflow", "hidden");
                $slout.clearQueue().stop(true, false).animate(this.animwidthzero, { duration: 300, easing: 'easeInQuad' });
                this.isDocked = true;
            }
            prweb.panelsmgr.ReportIsDocked("textentry", this.isDocked);
            return;
        },

        openpanel: function ($slout) {
            if (this.isDocked) {
                var self = this;
                $slout.clearQueue().stop(true, false)
                                       .removeClass("prwslideouthide")
                                       .animate(this.animwidthwide, {
                                           duration: 300,
                                           easing: 'easeInQuad',
                                           complete: function () {
                                               try {
                                                   self.isDocked = false;
                                                   prweb.panelsmgr.ReportIsDocked("textentry", self.isDocked);
                                               }
                                               catch (ex) {
                                                   alert("prweb.textentry.animate complete reports error " + ex.Message);
                                               }
                                               return;
                                           }
                                       });
            }
            return;
        },

        manageSlideout: function () {
            if (this.options.slidoutselctor) {
                var $slout = $(this.options.slidoutselctor);
                if ($slout.length == 1) {
                    switch (true) {
                        case (this.isDocked):
                            this.openpanel($slout);
                            break;
                        case (!this.isDocked):
                            this.closepanel($slout);
                            break;
                    }
                }
            }
            return;
        },
        //#endregion
        //#region Close FOR PANELSMGR to work...
        _myCloseList: function () {
            if (!this.isDocked) {
                this.manageSlideout();
            }
            return true;
        },
        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#textentryeditbtn").off(this.xevent);
                    $("#textentrysendbtn").off(this.xevent);
                    $("#textentrycancelbtn").off(this.xevent);
                    $("#textentryeditorplaceholder").destroyEditor();
                    $("#textentryeditorplaceholder").off();
                }
                catch (ex) {
                    alert("prweb.textentry.dispose reports error " + ex.Message);
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
                alert("prweb.textentry.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }
        //#endregion
    });
} (this.prweb, jQuery));
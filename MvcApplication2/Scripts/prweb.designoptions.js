/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designoptions', {
        options: {
            id: 0,
            isDisposed: false
        },

        xevent: "click.designoptions",

        //#region Create
        _create: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.designoptions";
                //                this.element.pinchpanzoom({ ppztargetslctor: "#publishsurveyviewkodomnode" });
            }
            var myclass = "designoptions";
            this._populateButtonHandlers(); //edit and back buttons...
            this._populateoptionsrowbtnhandler(myclass, this.xevent);
            this._populateoptionscolumnbtnhandler(myclass, this.xevent);
            this._populateoptionsbtnhandler(myclass, this.xevent);
        },
        //#endregion

        //#region Options Handlers

        _populateoptionsrowbtnhandler: function (myclass, xevent) {
            $("#dsgnroptionsaddrowbtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.AddOptionsRow();
                return false;
            });
            $("#dsgnrtoptionsremoverowbtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.RemoveOptionsRow();
                return false;
            });
            //            this.options.dsgnroptionsaddrowbtn = null;
            //            this.options.dsgnrtoptionsremoverowbtn = null;
        },

        _populateoptionscolumnbtnhandler: function (myclass, xevent) {
            $("#dsgnroptionsaddcolumnbtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.AddOptionsColumn();
                return false;
            });
            $("#dsgnroptionsremovecolumnbtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.RemoveOptionsColumn();
                return false;
            });
            //            this.options.dsgnroptionsaddcolumnbtn = null;
            //            this.options.dsgnroptionsremovecolumnbtn = null;
        },

        _populateoptionsbtnhandler: function (myclass, xevent) {
            $("#dsgnroptionsaddbtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.AddQuestOption();
                return false;
            });
            $("#dsgnroptionsremovebtn").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.designersvc.RemoveQuestOption();
                return false;
            });

            $("#requireanswercbx").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                var isvis = $("#requireanswerchkmrk").attr("visibility") == "visible";
                if (isvis) {
                    $("#requireanswerchkmrk").attr("visibility", "hidden");
                    isvis = false;
                }
                else {
                    $("#requireanswerchkmrk").attr("visibility", "visible");
                    isvis = true;
                }
                prweb.designersvc.ApplyRequireAnswerToOptions(isvis);
                isvis = null;
                return false;
            });

            $("#singleanswerrb").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                $("#multipleanswerrb").attr("fill", "url(#dtblxrg2)");
                $(this).attr("fill", "url(#dtblxrg1)");
                prweb.designersvc.ApplyCheckBoxesToOptions();
                return false;
            });
            $("#multipleanswerrb").addClass(myclass).on(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                $("#singleanswerrb").attr("fill", "url(#dtblxrg2)");
                $(this).attr("fill", "url(#dtblxrg1)");
                prweb.designersvc.ApplyRadioButtonsToOptions();
                return false;
            });
            //            this.options.dsgnroptionsaddbtn = null;
            //            this.options.dsgnroptionsremovebtn = null;
        },

        //#endregion

        //$("#dsgnbxsbtnspanel").designboxsbtns();

        _populateButtonHandlers: function () {
            try {
                var self = this;
                $("#prwdesignoptionsbtn").on(this.xevent, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    e = null;
                    self._myDesignOptionsClick();
                    return false;
                });
            }
            catch (ex) {
                alert("prweb.designoptions.PopulateButtonHandlers reports " + ex.Message);
            }
            return;
        },


        //#region Hide Close on App Bar Click  animation

        animwidthzero: { width: 0 },
        animwidthwide: { width: "100%" },
        animdur: { duration: 300, easing: 'easeInQuad', complete: function () {
            $("#designoptionscontainer").css("overflow", "hidden").css("height", 0);
            return;
        }
        },
        animduropen: { duration: 300, easing: 'easeInQuad', complete: function (ev) {
            //            $("#designeroptionsslideoutpanel").data("designstyles").touchAble.LastIndx();
            ev = null;
        }
        },
        isDocked: "empty",

        _myDesignOptionsClick: function () {
            //            var w = $("#homecenterpanel").innerWidth();
            //            this.animwidthwide.width = w;
            switch (true) {
                case (this.isDocked == "empty"):
                    {
                        $("#designoptionscontainer").removeClass("prwslideouthide").stop(true, false).animate(this.animwidthwide, this.animduropen);
                        //animduropen has an animation complete callback that moves the touchable opacity element to the far right...1.0
                        //happens only once...when the control is first undocked...
                        this.isDocked = false;
                        break;
                    };
                case (this.isDocked):
                    {
                        $("#designoptionscontainer").css("overflow", "").css("height", "auto").stop(true, false).animate(this.animwidthwide);
                        this.isDocked = false;
                        break;
                    };
                case (!this.isDocked):
                    {
                        $("#designoptionscontainer").stop(true, false).animate(this.animwidthzero, this.animdur);
                        this.isDocked = true;
                        break;
                    };
            };
            prweb.designerpanelsmgr.ReportIsDocked("designoptions", this.isDocked);
            return true;
        },

        _moveToVisualStateDesignStylesBtnClick: function () {
            this._myDesignOptionsClick();
            return true;
        },



        _myCloseList: function () {
            if (!this.isDocked) {
                $("#designoptionscontainer").css("overflow", "hidden").stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
                prweb.designerpanelsmgr.ReportIsDocked("designoptions", this.isDocked);
            }
            return true;
        },

        _moveToVisualStateCloseList: function () {
            this._myCloseList();
            return true;
        },

        _subscribeToVSMEvents: function () {
            var pss = prweb.pubsub.subscribe;
            //            pss(prweb.events.designersvc.designeritemcontextchanged, this._evaluateDesignerItemContext, this);
            //            pss(prweb.events.designereditable.hasfocus, this._designerEditableHasFocusHandler, this);
            //            pss(prweb.events.designereditable.textselected, this._designerEditableHasFocusHandler, this);
            //            pss(prweb.events.subscriberplatform.prwdesignstylesbtn, this._moveToVisualStateDesignStylesBtnClick, this);
            pss(prweb.events.appsvc.surveycontextchanged, this._moveToVisualStateCloseList, this);
            //            pss(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateCloseList, this);
            //            pss(prweb.events.subscriberplatform.pagesbtnclick, this._moveToVisualStateCloseList, this);
            pss = null;
        },

        //#endregion


        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {

                }
                catch (ex) {
                    alert("prweb.designoptions.dispose reports error " + ex.Message);
                    ex = null;
                }
                finally {
                    this.options.isDisposed = true;
                }
            }
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.designoptions.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
        //#endregion

    });
} (this.prweb, jQuery));
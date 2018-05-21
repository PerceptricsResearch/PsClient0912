/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designstyles', {
        options: {
            vertical: false,
            isDisposed: false
        },

        //#region Create and populateColorChanged internal

        xevent: "click.designstyles",

        _create: function () {
            var myclass = "designstyles";
            if (prweb.IsTouch) {
                this.xevent = "tap.designstyles";
            }
            $("#colorscontrol").colorscontrol();
            //            $("#dsgnstylesbtnpnl").designerbuttonpanel();
            this._setUpOpacityTouchable();
            this._populateOpacityBtns(myclass, this.xevent);
            //            this._populatecolorchangedhandler();
            this._subscribeToVSMEvents();
            prweb.colorssvc.designstylesOpacityGetter = this.touchAble.SelectedValue;
            this._populateButtonsHandlers(myclass, this.xevent);
        },

        colorsvcsubscription: null,

        //this is a subscription to colorssvc colorchanged...changes the colors on the buttons...
        _populatecolorchangedhandler: function () {
            this.colorsvcsubscription = prweb.colorssvc.SubscribeToColorChanged(function (newcolorstring) {
                $("#colorsbackgroundpath").attr("fill", newcolorstring);
                //                $("#colorsborderpath").attr("stroke", newcolorstring);
                //                $("#colorstextfill").attr("fill", newcolorstring);
            });
        },

        //#endregion

        publishOpacity: function (opacityrslt) {
            prweb.colorssvc.OpacityChange(opacityrslt);
        },

        _highlightButton: function ($target) {
            var sel = $(".selectedcolorscntlbtn");
            if (sel.length > 0) {
                sel.attr("stroke", "hsla(179,70%,57%,1)").attr("stroke-width", "1").attr("class", "");
            }
            sel = null;
            $target.attr("class", "selectedcolorscntlbtn").attr("stroke", "hsla(37,100%,48%,1)").attr("stroke-width", "3");
        },
        _populateButtonsHandlers: function (myclass, xevent) {
            var self = this;
            $("#prwdesignstylesbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.showClick(this);
                self._myDesignStylesClick();
                //                prweb.pubsub.publish(prweb.events.subscriberplatform.prwdesignstylesbtn);
                return false;
            });

            var highlight = this._highlightButton;
            $("#dsgnrcolorsbackgroundbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                highlight($(e.originalEvent.target));
                e = null;
                prweb.designersvc.IdentifyTargetPropertyOnModel("colorssvc", "BackgroundStr");
                return false;
            });
            $("#dsgnrcolorstextbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                highlight($(e.originalEvent.target));
                e = null;
                prweb.designersvc.IdentifyTargetPropertyOnModel("colorssvc", "ForegroundStr");
                return false;
            });
            $("#dsgnrcolorsborderbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                highlight($(e.originalEvent.target));
                e = null;
                prweb.designersvc.IdentifyTargetPropertyOnModel("colorssvc", "BorderBrushStr");
                return false;
            });
            $("#dsgnrcolorsnocolorbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                highlight($(e.originalEvent.target));
                e = null;
                prweb.designersvc.MakeNoColor();
                return false;
            });
            $("#dsgnrcolorsradiooffbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (prweb.designersvc.ShowRadioButtonsOffState()) {
                    highlight($(e.originalEvent.target));
                    prweb.designersvc.IdentifyTargetPropertyOnModel("colorssvc", "RadioButtonOffStr");
                } //tells the svg to use the "on" linearGradient...
                e = null;
                return false;
            });
            $("#dsgnrcolorsradioonbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (prweb.designersvc.ShowRadioButtonsOnState()) {
                    highlight($(e.originalEvent.target));
                    prweb.designersvc.IdentifyTargetPropertyOnModel("colorssvc", "RadioButtonOnStr");
                } //tells the svg to use the "on" linearGradient..
                e = null;
                return false;
            });
            $("#dsgnrcolorsboxbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                //                if (prweb.designersvc.ApplyCheckBoxesToOptions()) {
                highlight($(this));
                prweb.designersvc.IdentifyTargetPropertyOnModel("colorssvc", "CheckBoxBackgroundStr");
                //                };

                return false;
            });
            $("#dsgnrcolorscheckbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (prweb.designersvc.ShowCheck()) {
                    highlight($(this));
                    prweb.designersvc.IdentifyTargetPropertyOnModel("colorssvc", "CheckBoxForegroundStr");
                }
                e = null;

                return false;
            });
        },


        //#region Touchable implementation
        touchAble: false,
        populateTouchable: function (theElem) {
            var self = this;
            var $this = theElem;
            //#region touchable definition

            this.touchAble = (function () {
                var me = {};
                //#region Class Variables
                var mouseDown = false;
                var elementFocused = false;
                var lastMove = false;
                var throttleTimeout = 1000 / 60;
                var prevXPos = false;
                var prevYPos = false;
                var xpos;
                var ypos;
                me.decelerate = false;
                me.velocity = 0;
                me.velocityY = 0;
                me.scrollLeft = false;
                me.scrollTop = false;
                me.maxvelocity = 60;
                me.slowdown = 0.65;
                me.x = !self.options.vertical;
                me.y = self.options.vertical;
                me.itemsdimension = 0;
                me.itemscount = 20;
                me.itemndx = 0;
                //#endregion

                me.wasHandledAsMove = false;

                me.SelectedValue = function () {
                    return (me.itemndx / me.itemscount);
                };

                me.UpdateItemNdxonTouchMove = function () {
                    var rslt = me.scrollLeft / 18; // this is itemsdimension...sort of...its the clickable moveNext/Prev amt...
                    me.itemndx = Math.floor(rslt);
                    self.publishOpacity(me.SelectedValue());
                };

                //#region Utility Functions...Vector

                me.decelerateVelocity = function (xvelocity, xslowdown) {
                    return Math.floor(Math.abs(xvelocity)) === 0 ? 0 // is velocity less than 1?               
                                : xvelocity * xslowdown; // reduce slowdown    
                };

                me.capVelocity = function (xvelocity, max) {
                    var newVelocity = xvelocity;
                    if (xvelocity > 0) {
                        if (xvelocity > max) {
                            newVelocity = max;
                        }
                    }
                    else {
                        if (xvelocity < (0 - max)) {
                            newVelocity = (0 - max);
                        }
                    }
                    return newVelocity;
                };

                me.calculateVelocities = function () {
                    me.velocity = me.capVelocity(prevXPos - xpos, me.maxvelocity);
                    me.velocityY = me.capVelocity(prevYPos - ypos, me.maxvelocity);
                };

                //#endregion

                //#region Move

                me.Move = function ($scroller) {
                    var scroller = $scroller[0];
                    // set scrollLeft 
                    if (me.x && scroller.scrollWidth > 0) {
                        scroller.scrollLeft = me.scrollLeft = scroller.scrollLeft + me.velocity;
                        if (Math.abs(me.velocity) > 0) {
                            me.velocity = me.decelerate ? me.decelerateVelocity(me.velocity, me.slowdown) : me.velocity;
                        }
                    }
                    else {
                        me.velocity = 0;
                    }
                    // set scrollTop        
                    if (me.y && scroller.scrollHeight > 0) {
                        scroller.scrollTop = me.scrollTop = scroller.scrollTop + me.velocityY;
                        if (Math.abs(me.velocityY) > 0) {
                            me.velocityY = me.decelerate ? me.decelerateVelocity(me.velocityY, me.slowdown) : me.velocityY;
                        }
                    }
                    else {
                        me.velocityY = 0;
                        //                        $this.parent().css("background", "rgba(1,255,1,0.4)");
                    }
                    //                    setMoveClasses.call($scroller, settings, settings.deceleratingClass);
                    //                                 if (typeof settings.moved === 'function') {
                    //                                     settings.moved.call($scroller, settings);        
                    //                                 }        
                    if (Math.abs(me.velocity) > 0 || Math.abs(me.velocityY) > 0) {

                        // tick for next movement            
                        window.requestAnimationFrame(function () {
                            //                            $this.parent().css("background", "rgba(255,1,255,0.4)");
                            me.Move($scroller);

                        });
                    }
                    else {
                        me.decelerate = false;
                        me.UpdateItemNdxonTouchMove(); // when this thing finishes spinning...
                    }
                    //                    $this.parent().css("background", "rgba(1,1,255,0.4)");  
                    //                    else {
                    //                        stop($scroller);
                    //                    }
                };

                //#endregion

                //#region ToucHandlers

                //#region TouchStart

                me.Start = function (clx, cly) {
                    mouseDown = true;
                    me.velocity = prevXPos = 0;
                    me.velocityY = prevYPos = 0;
                    xpos = clx;
                    ypos = cly;

                };
                me.touchStart = function (e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }

                    var touch;
                    me.wasHandledAsMove = false;
                    touch = e.originalEvent.touches[0];
                    me.Start(touch.clientX, touch.clientY);
                    e.stopPropagation();
                };

                //#endregion

                //#region TouchMove

                me.inputMove = function (clx, cly) {
                    if (!lastMove || new Date() > new Date(lastMove.getTime() + throttleTimeout)) {
                        lastMove = new Date();
                        if (mouseDown && (xpos || ypos)) {
                            me.wasHandledAsMove = true;
                            if (elementFocused) {
                                $(elementFocused).blur();
                                elementFocused = null;
                                $this.focus();
                            }
                            me.decelerate = true;
                            me.velocity = me.velocityY = 0;
                            $this[0].scrollLeft = me.scrollLeft = me.x ? $this[0].scrollLeft - (clx - xpos) : $this[0].scrollLeft;
                            $this[0].scrollTop = me.scrollTop = me.y ? $this[0].scrollTop - (cly - ypos) : $this[0].scrollTop;
                            prevXPos = xpos;
                            prevYPos = ypos;
                            xpos = clx;
                            ypos = cly;
                            me.calculateVelocities();
                            //                            me.UpdateItemNdxonTouchMove();
                        }
                    }
                };

                me.touchMove = function (e) {
                    var touch;

                    if (mouseDown) {
                        try {
                            touch = e.originalEvent.touches[0];
                            me.inputMove(touch.clientX, touch.clientY);
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                        }
                        catch (ex) {
                            alert("designstyles.touchable.touchmove reports " + ex.message);
                        }
                    }
                    me.decelerate = false;
                };

                //#endregion

                //#region TrouchEnd
                me.End = function () {
                    if (xpos && prevXPos && me.decelerate === false) {
                        me.decelerate = true;
                        me.calculateVelocities();
                        xpos = prevXPos = mouseDown = false;
                        try {
                            me.Move($this);

                        }
                        catch (ex) {
                            alert("designstyles.touchable.end.move reports " + ex.Message);
                        }
                    }
                    xpos = false;
                    ypos = false;
                    mouseDown = false;
                };

                me.touchEnd = function (e) {
                    me.End();
                    elementFocused = null;
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                };

                //#endregion

                //#endregion

                //#region Attach/Detach

                me.attachEvents = function () {
                    //                    $this.parent().css("background", "rgba(255,1,255,0.4)");
                    $this.css('-webkit-transform', 'translate3d(0,0,0)').css("overflow", "hidden");
                    $this.bind("touchstart", me.touchStart)
                        .bind("touchend", me.touchEnd)
                        .bind("touchmove", me.touchMove);
                    //                    var el = $this[0];
                    //                    el.addEventListener("touchstart", me.touchStart, false);
                    //                    el.addEventListener("touchend", me.touchEnd, false);
                    //                    el.addEventListener("touchmove", me.touchMove, false);
                    //                    el = null;
                };

                me.detachEvents = function () {
                    var el = $this[0];
                    el.removeEventListener("touchstart", me.touchStart, false);
                    el.removeEventListener("touchend", me.touchEnd, false);
                    el.removeEventListener("touchmove", me.touchMove, false);
                    el = null;
                };

                //#endregion




                //#region Next Prev Button Related Methods...MoveNext,Prev MoveMe...LastIndx

                me.MoveMe = function (howmuch, decel) {
                    me.decelerate = decel;
                    if (me.y) {
                        me.velocityY = howmuch;
                    };
                    if (me.x) {
                        me.velocity = howmuch;
                    };
                    me.Move($this);
                };

                me.LastIndx = function () {
                    var x1 = $this[0].scrollWidth;
                    var x2 = $this.width();
                    if (!prweb.IsTouch) {
                        me.slowdown = 0;
                    }
                    me.MoveMe(360, true); //this is 20 clicks times 18...
                    me.itemndx = me.itemscount;
                    //                    me.itemsdimension = x1 / me.itemscount; //$("#touchabletextitems").attr("textLength") / me.itemscount;
                    x1 = null;
                    x2 = null;
                };

                me.PrevIndx = function () {

                };

                me.NextIndx = function () {
                    rslt = 0;

                    return rslt;
                };

                me.MoveNext = function () {
                    me.itemndx = Math.min(me.itemscount, me.itemndx + 1);
                    if ($this[0].scrollWidth > 0) {
                        me.MoveMe(18, true);
                    }
                    return me.SelectedValue();
                };

                me.MovePrev = function () {
                    me.itemndx = Math.max(0, me.itemndx - 1);
                    if ($this[0].scrollLeft > 0) {
                        me.MoveMe(-18, true);
                    }
                    return me.SelectedValue();
                };


                //#endregion


                //#region Dispose

                me.Dispose = function () {
                    //                    alert("designstyles.touchAble sees Dispose...");
                    me.detachEvents();
                    self = null;
                    $this = null;
                    me = null;
                };

                //#endregion

                return me;
            } ());

            //#endregion
            if (prweb.IsTouch) {
                this.touchAble.attachEvents();
            }
        },

        //#endregion

        //#region OpacityControl

        retrieveOpacity: function () {
            return this.touchAble.SelectedValue();
        },

        _populateOpacityBtns: function (myclass, xevent) {
            var self = this;
            $("#dstylesrectbackbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                var opacityrslt = self.touchAble.MovePrev();
                self.publishOpacity(opacityrslt);
                return false;
            });
            $("#dstylesrectmorebtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                var opacityrslt = self.touchAble.MoveNext();
                self.publishOpacity(opacityrslt);
                return false;
            });
            myclass = null;
            xevent = null;
        },

        _setUpOpacityTouchable: function () {
            this.populateTouchable($("#testspinnernumeric"));
        },
        //#endregion

        //VSM visualstate methods...
        _surveyOpenedHandler: function () {
            //            prweb.surveymetadatasvc.OpenSurvey();
        },

        _surveyClosedHandler: function () {
            //            prweb.surveymetadatasvc.CloseSurvey();
            //            this._moveToVisualStateCloseList();
        },

        //        _scrollToItem: function (scrollableitemname) {
        //            var scr = $(".scrollabledstyles", this.element).data('scroller');
        //            if (scr) {
        //                switch (true) {
        ////                    case scrollableitemname == "options":
        ////                        scr.seekTo(2);
        ////                        break;
        ////                    case scrollableitemname == "text":
        ////                        scr.seekTo(1);
        ////                        break;
        //                    case scrollableitemname == "colors":
        //                        scr.seekTo(0);
        //                        break;
        //                }
        //            }
        //            scr = null;
        //        },

        //        _designerEditableHasFocusHandler: function () {
        //            this._scrollToItem("text");
        //            //            scrollableitemname = null;
        //        },



        //        _evaluateDesignerItemContext: function (e) {
        //            if (e) {
        ////                this._moveToVisualStateOpenList();
        //                var dimodel = prweb.designersvc.CurrentPCElemModel;
        //                if (dimodel) {
        //                    //dimodel.modelcore.presenterT tells us what kind of prwT is active...
        //                    switch (true) {
        ////                        case dimodel.modelcore.presenterT == "prwTQuestOptionSet":
        ////                            this._scrollToItem("options");
        ////                            break;
        ////                        case dimodel.modelcore.presenterT == "prwTIgnatz":
        ////                            this._scrollToItem("text");
        ////                            break;
        //                        case dimodel.modelcore.presenterT == "prwTImage":
        //                            this._scrollToItem("colors");
        //                            break;
        //                    }
        //                }
        //                dimodel = null;
        //            }
        //            else {
        //                this._moveToVisualStateCloseList();
        //            }
        //            e = null;
        //            return true;
        //        },


        //#region Hide Close on App Bar Click  animation

        animwidthzero: { width: 0 },
        animwidthwide: { width: "100%" },
        animdur: { duration: 300, easing: 'easeInQuad', complete: function () {
            $("#designstylescontainer").css("overflow", "hidden").css("height", 0);
            return;
        }
        },
        animduropen: { duration: 300, easing: 'easeInQuad', complete: function (ev) {
            try {
                $("#designerstylesslideoutpanel").data("designstyles").touchAble.LastIndx();
                ev = null;
            }
            catch (ex) {
                alert("prweb.designestyles.animduropen reports " + ex.Message);
            }

        }
        },
        isDocked: "empty",

        _myDesignStylesClick: function () {
            //            var w = $("#homecenterpanel").innerWidth();
            //            this.animwidthwide.width = w;
            switch (true) {
                case (this.isDocked == "empty"):
                    {
                        $("#designstylescontainer").removeClass("prwslideouthide").stop(true, false).animate(this.animwidthwide, this.animduropen);
                        //animduropen has an animation complete callback that moves the touchable opacity element to the far right...1.0
                        //happens only once...when the control is first undocked...
                        this.isDocked = false;
                        break;
                    };
                case (this.isDocked):
                    {
                        $("#designstylescontainer").css("overflow", "").css("height", "auto").stop(true, false).animate(this.animwidthwide);
                        this.isDocked = false;
                        break;
                    };
                case (!this.isDocked):
                    {
                        $("#designstylescontainer").stop(true, false).animate(this.animwidthzero, this.animdur);
                        this.isDocked = true;
                        break;
                    };
            };
            prweb.designerpanelsmgr.ReportIsDocked("designstyles", this.isDocked);
            return true;
        },

        _moveToVisualStateDesignStylesBtnClick: function () {
            this._myDesignStylesClick();
            return true;
        },



        _myCloseList: function () {
            if (!this.isDocked) {
                $("#designstylescontainer").css("overflow", "hidden").stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
                prweb.designerpanelsmgr.ReportIsDocked("designstyles", this.isDocked);
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
            pss(prweb.events.subscriberplatform.prwdesignstylesbtn, this._moveToVisualStateDesignStylesBtnClick, this);
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
                    prweb.colorssvc.designstylesOpacityGetter = false;
                    this.touchAble.Dispose();
                    this.touchAble = null;
                    this.animwidthzero = null;
                    this.animwidthwide = null;
                    this.animduropen = null;
                    this.animdur = null;
                    this.isDocked = null;
                    var psu = prweb.pubsub.unsubscribe;
                    //                psu(prweb.events.designersvc.designeritemcontextchanged, this._evaluateDesignerItemContext, this);
                    //                psu(prweb.events.designereditable.hasfocus, this._designerEditableHasFocusHandler, this);
                    //                psu(prweb.events.designereditable.textselected, this._designerEditableHasFocusHandler, this);
                    psu(prweb.events.subscriberplatform.prwdesignstylesbtn, this._moveToVisualStateDesignStylesBtnClick, this);
                    psu(prweb.events.appsvc.surveycontextchanged, this._moveToVisualStateCloseList, this);
                    psu(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateCloseList, this);
                    psu(prweb.events.subscriberplatform.pagesbtnclick, this._moveToVisualStateCloseList, this);
                    psu = null;
                    if (this.colorsvcsubscription) {
                        this.colorsvcsubscription.dispose();
                    };
                    this.colorsvcsubscription = null;
                    $("#colorscontrol").data('colorscontrol').dispose();
                    $("#colorscontrol").html("").remove();
                    $(".designstyles", this.element).unbind(".designstyles").remove();
                }
                catch (ex) {
                    alert("prweb.designstyles.dispose reports error " + ex.Message);
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
                alert("prweb.designerstyles.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }

        //#endregion

        //end of widget defn...
    });
} (this.prweb, jQuery));
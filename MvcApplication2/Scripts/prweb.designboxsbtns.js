/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designboxsbtns', {

        options: {
            id: 0
        },

        _create: function () {
            var myclass = "designboxsbtns";
            var xevent = "click.designboxsbtns";
            if (prweb.IsTouch) {
                xevent = "tap.designboxsbtns";
            }
            this._setUpSizeTouchable();
            this._populateSizeBtns(myclass, xevent);
            this._populateColorControlBtns(myclass, xevent);
        },

        _highlightButton: function () {
//            $(".selectedcolorscntlbtn").removeClass("selectedcolorscntlbtn").addClass("notselectedcolorscntlbtn");
//            $(this).addClass("selectedcolorscntlbtn");
        },

        _populateColorControlBtns: function (myclass, xevent) {
            var highlight = this._highlightButton;
            $("#dsgnrboxbtncolorbackgroundbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                if (prweb.designersvc.ShowRadioButtonsOffState()) {
                    prweb.designersvc.IdentifyTargetPropertyOnModel("colorssvc", "RadioButtonOffStr");
                    highlight();
                } //tells the svg to use the "on" linearGradient...
                return false;
            });
            //            $("#dsgnrboxbtncolorbackgroundbtn").addClass(myclass).bind(xevent, function (e) {
            //                e.preventDefault();
            //                e.stopPropagation();
            //                e = null;
            //                prweb.designersvc.IdentifyTargetPropertyOnModel("colorssvc", "CheckBoxBackgroundStr"); RadioButtonOffStr
            //                prweb.designersvc.BoxsBtnsColorBackgroundChange();
            //                return true;
            //            });
            $("#dsgnrboxbtncolorborderbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                prweb.designersvc.IdentifyTargetPropertyOnModel("colorssvc", "CheckBoxBorderBrushStr");
                highlight();
                return false;
            });
            $("#dsgnrboxbtncolorcheckbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                prweb.designersvc.IdentifyTargetPropertyOnModel("colorssvc", "CheckBoxForegroundStr");
                highlight();
                return false;
            });
            $("#dsgnrboxbtncolorbuttonbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                if (prweb.designersvc.ShowRadioButtonsOnState()) {
                    prweb.designersvc.IdentifyTargetPropertyOnModel("colorssvc", "RadioButtonOnStr");
                    highlight();
                } //tells the svg to use the "on" linearGradient...
                return false;
            });
        },

        publishSelectedValue: function (sizerslt) {
            prweb.designersvc.BoxsBtnsSizeChange(sizerslt);
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
                    self.publishSelectedValue(me.SelectedValue());
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
                            alert("designboxsbtns.touchable.end.move reports " + ex.Message);
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
                    $this.bind("dragstart.designboxsbtns", me.touchStart)
                        .bind("dragend.designboxsbtns", me.touchEnd)
                        .bind("drag.designboxsbtns", me.touchMove);
                    //                    var el = $this[0];
                    //                    el.addEventListener("touchstart", me.touchStart, false);
                    //                    el.addEventListener("touchend", me.touchEnd, false);
                    //                    el.addEventListener("touchmove", me.touchMove, false);
                    //                    el = null;
                };

                me.detachEvents = function () {
//                    var el = $this[0];
                    $this.unbind("dragstart.designboxsbtns", me.touchStart)
                            .unbind("dragend.designboxsbtns", me.touchEnd)
                            .unbind("drag.designboxsbtns", me.touchMove);
//                    el = null;
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
                    me.MoveMe(180, true); //this is 20 clicks times 18...
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
            this.touchAble.LastIndx(); //initializes position of touchable...
        },

        //#endregion

        //#region SizeSpinnerControl

        retrieveSize: function () {
            return this.touchAble.SelectedValue();
        },
        _setUpSizeTouchable: function () {
            this.populateTouchable($("#sizespinnernumeric"));
        },

        _populateSizeBtns: function (myclass, xevent) {
            var self = this;
            $("#dboxsbtnsrectbackbtn").addClass(myclass).bind(xevent, function () {
                var sizerslt = self.touchAble.MovePrev();
                //                self.publishSelectedValue(sizerslt);
            });
            $("#dboxsbtnsrectmorebtn").addClass(myclass).bind(xevent, function () {
                var sizerslt = self.touchAble.MoveNext();
                //                self.publishSelectedValue(sizerslt);
            });
            myclass = null;
            xevent = null;
        },


        //#endregion


        dispose: function () {
            try {
                $(".designboxsbtns", this.element).unbind().html("").remove();
                this.touchAble.Dispose();
                this.touchAble = null;
            }
            catch (ex) {
                alert("prweb.designboxsbtns.dispose reports error..." + ex.Message);
                ex = null;
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
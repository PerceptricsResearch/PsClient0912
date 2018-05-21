/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.scroller', {
        options: {
            activeClass: 'active',
            circular: false,
            clonedClass: 'cloned',
            disabledClass: 'disabled',
            easing: 'swing',
            initialIndex: 0,
            item: '> *',
            items: '.items',
            keyboard: true,
            mousewheel: false,
            next: '.next',
            prev: '.prev',
            size: 1,
            speed: 200,
            vertical: false,
            touch: false,
            inertialbtns: false,
            inertialsize: 10,
            wheelSpeed: 0,
            usePrevNext: true,
            publishSelectedValue: false,
            scrollalignToItem: false,
            movecompleteparm: 0,
            movecompletehandler: false,
            swipable: true,
            touchAble: false,
            stoptouchpropagation: true,
            isDisposed: false
        },

        //#region Create and Variables
        myclass: "scroller",
        xevent: "click.scroller",
        _create: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.scroller";
            }
            var self = this;
            this.itemWrap = this.element.children();
            if (this.itemWrap.length > 1) {
                this.itemWrap = $(this.options.items, this.element);
            }
            var myparent = this.element.parent();
            if (prweb.IsTouch || this.options.touch) {
                this.populateTouchable();
            };
            if (this.options.usePrevNext) {
                $(this.options.prev, myparent).addClass("scroller").bind(this.xevent, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    prweb.showClick(this);
                    self.prev();
                    return false;
                });
                $(this.options.next, myparent).addClass("scroller").bind(this.xevent, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    prweb.showClick(this);
                    self.next();
                    return false;
                });
            }
            myparent = null;
            if (prweb.IsTouch && this.options.swipable) {
                this._poulateSwipeHandler();
            }
        },

        _poulateSwipeHandler: function () {
            var self = this;
            this.element.on("swipe.scroller", function (e) {
                switch (true) {
                    case ((e.direction == "top" && self.options.vertical) || (e.direction == "left" && !self.options.vertical)):
                        self.options.touchAble.MoveMe(self.options.touchAble.swipevelocity);
                        break;
                    case ((e.direction == "down" && self.options.vertical) || (e.direction == "right" && !self.options.vertical)):
                        self.options.touchAble.MoveMe(-self.options.touchAble.swipevelocity);
                        break;
                }

            });
        },

        index: 0,
        itemWrap: null,

        MoveComplete: function (time) {
            if (this.options.scrollalignToItem) {
                this.seekTo(this.options.movecompleteparm, time);
            }
            if (this.options.publishSelectedValue) {
                if (typeof this.options.movecompletehandler == 'function') {
                    this.options.movecompletehandler($(this.options.item, this.element).eq(this.index));
                }
            }

        },

        wasMove: function () {
            return this.options.touchAble.wasHandledAsMove;
        },

        getTouchable: function () {
            return this.options.touchAble;
        },
        //#endregion

        scrolltoend: function () {
            try {
                var scrollamt = 0;
                if (this.options.vertical) {
                    scrollamt = this.element[0].scrollHeight;
                }
                else {
                    scrollamt = this.element[0].scrollWidth;
                }
                this.options.touchAble.MoveMe(Math.round(scrollamt * 0.1));
            }
            catch (ex) {
                alert("prweb.scroller.scrolltoend reports " + ex.Message);
            }
        },

        //#region Scrollable Methods

        getConf: function () {
            return this.options;
        },

        getIndex: function () {
            return this.index;
        },

        getSize: function () {
            var rslt = this.getItems().size();
            return rslt;
        },

        getItems: function () {
            return this.itemWrap.find(this.options.item); //.not("." + this.options.clonedClass);
        },

        move: function (offset, time) {
            return this.seekTo(this.index + offset, time);
        },

        next: function (time) {
            var cnt = $(this.options.item, this.element).length;
            switch (true) {
                case (this.options.inertialbtns && this.options.scrollalignToItem):
                    {

                        if (cnt > 0 && this.options.vertical) {
                            this.options.inertialsize = $(this.options.item, this.element).eq(0).height() * 0.25;
                            this.options.touchAble.slowdown = 1 / 1.25;
                            this.options.speed = 100;
                        }
                        break;
                    };
            }
            if (this.options.inertialbtns) {
                this.index = Math.min(this.index + 1, cnt - 1);
                this.options.movecompleteparm = this.index;
                this.options.touchAble.MoveMe(this.options.inertialsize);
                //                return this.move(this.options.size, time);

            }
            else {
                return this.move(this.options.size, time);
            }
            //            return this.move(this.options.size, time);
        },

        prev: function (time) {
            var cnt = $(this.options.item, this.element).length;
            switch (true) {
                case (this.options.inertialbtns && this.options.scrollalignToItem):
                    {
                        if (cnt > 0 && this.options.vertical) {
                            this.options.inertialsize = $(this.options.item, this.element).eq(0).height() * 0.25;
                            this.options.touchAble.slowdown = 1 / 1.25;
                            this.options.speed = 100;
                        }
                        break;
                    };
            }
            if (this.options.inertialbtns) {
                this.index = Math.max(this.index - 1, 0);
                this.options.movecompleteparm = this.index;
                return this.options.touchAble.MoveMe(-this.options.inertialsize);
                //                return this.move(-this.options.size, time);
            } else {
                return this.move(-this.options.size, time);
            }
        },

        seekTo: function (i, time) {
            var item = null;
            var props = null;
            var isscrollok = true;
            if (time === undefined) {
                time = this.options.speed;
            }
            // ensure numeric index				
            //            if (!i.jquery) {
            //                i *= 1;
            //            }
            i = parseInt(i);
            if (this.options.circular && i === 0 && this.index == -1 && time !== 0) {
                isscrollok = false;
            }
            else if (!this.options.circular && i < 0 || !this.options.circular && i > this.getSize() - 1 || i > this.getSize() || i < -1) {
                isscrollok = false;
            }
            if (isscrollok) {
                //                item = i;
                item = this.getItems().eq(i);
                //                if (i.jquery) {
                //                    i = this.getItems().index(i);
                //                }
                //                else {
                //                    item = this.getItems().eq(i);
                //                }
                var xt = this.element[0].getBoundingClientRect();
                //                var xr = this.itemWrap[0].getBoundingClientRect();
                var xd = item[0].getBoundingClientRect();
                //                var peritemleft = xd.left / i;
                //                var peritemtop = xd.top/ i;
                var difftop = xd.top - xt.top;
                var diffleft = xd.left - xt.left;
                //                var shouldbeleft = i * diffleft;
                //                var shouldbetop = i * difftop;
                var isleft = this.element.scrollLeft();
                var istop = this.element.scrollTop();
                var fixleft = -diffleft - isleft;
                var fixtop = -difftop - istop;
                props = this.options.vertical ? { scrollTop: -fixtop} : { scrollLeft: -fixleft };
                //                this.itemWrap.scrollTop(Math.max(-(istop + fixtop), 0));
                //                xr = null;
                xd = null;
                difftop = null;
                diffleft = null;
                //                if (!(item[0].viewportElement == undefined)) {
                //                    //                    var xe = item[0].getBBox();
                //                    //                    var xr = this.itemWrap[0].getBoundingClientRect();
                //                    //                    var xd = item[0].getBoundingClientRect();
                //                    var difftop = xd.top - xr.top;
                //                    var diffleft = xd.left - xr.left;
                //                    xr = null;
                //                    xd = null;
                //                    //                    props = this.options.vertical ? { top: -difftop} : { left: -diffleft };
                //                    difftop = null;
                //                    diffleft = null;
                //                }
                //                else {
                //                    //                    props = this.options.vertical ? { top: -item.position().top} : { left: -item.position().left };
                //                }

                this.index = i;
                this.element.animate(props, time, this.options.easing);
            }
            var item = null;
            var props = null;
            var isscrollok = null;
            return true;
        },

        //#endregion

        //#region Touchable implementation
        populateTouchable: function () {
            var self = this;
            var $this = this.element;
            this.options.touchAble = (function () {
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
                me.maxvelocity = 80;
                me.swipevelocity = 20;
                me.slowdown = 0.95;
                me.x = !self.options.vertical;
                me.y = self.options.vertical;
                //#endregion

                me.wasHandledAsMove = false;

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

                //#region Me.Move
                // $scroller is $this....
                me.Move = function ($scroller) {
                    var scroller = $scroller[0];
                    // set scrollLeft 
                    if (me.x && scroller.scrollWidth > 0) {
                        scroller.scrollLeft = me.scrollLeft = scroller.scrollLeft + me.velocity;
                        //                        $scroller.scrollLeft(me.scrollLeft);
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
                        self.MoveComplete();
                    }
                    //                    $this.parent().css("background", "rgba(1,1,255,0.4)");  
                    //                    else {
                    //                        stop($scroller);
                    //                    }
                };

                //#endregion

                //#region Me.MoveME
                me.MoveMe = function (howmuch) {
                    me.decelerate = true;
                    if (me.y) {
                        me.velocityY = howmuch;
                    };
                    if (me.x) {
                        me.velocity = howmuch;
                    };
                    me.Move($this);
                };
                //#endregion

                //#region Me.End
                me.End = function () {
                    if (xpos && prevXPos && me.decelerate === false) {
                        me.decelerate = true;
                        me.calculateVelocities();
                        xpos = prevXPos = mouseDown = false;
                        try {
                            me.Move($this);

                        }
                        catch (ex) {
                            alert("scroller.touchable.end.move reports " + ex.Message);
                        }
                    }
                    xpos = false;
                    ypos = false;
                    mouseDown = false;
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
                    e.preventDefault();
                    if (self.options.stoptouchpropagation) {
                        e.stopPropagation(); //guestdomainplayr.IndividualPageScrollers sets this false...for pinchpanzoom.drag to work...
                    }
                    //                    e.stopPropagation();
                    //                    $this.parent().css("background", "rgba(255,1,255,0.4)");
                    //                    alert("scroller.me.touchStart ");
                    var touch;
                    me.wasHandledAsMove = false;
                    touch = e.originalEvent.touches[0];
                    me.Start(touch.clientX, touch.clientY);
                    //                    e.stopPropagation();
                };

                //#endregion

                //#region InputMove TouchMove

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

                        }
                    }
                };

                me.touchMove = function (e) {
                    var touch;
                    e.preventDefault();
                    if (self.options.stoptouchpropagation) {
                        e.stopPropagation();
                    }
                    //                    e.stopPropagation();
                    if (mouseDown) {
                        try {
                            touch = e.originalEvent.touches[0];
                            me.inputMove(touch.clientX, touch.clientY);
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                        }
                        catch (ex) {
                            alert("scroller.touchable.touchmove reports " + ex.message);
                        }
                    }
                    me.decelerate = false;
                };

                //#endregion

                //#region TrouchEnd
                me.touchEnd = function (e) {
                    e.preventDefault();
                    if (self.options.stoptouchpropagation) {
                        e.stopPropagation();
                    }
                    //                    e.stopPropagation();
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
                    $this.css('-webkit-transform', ' translate3d(0,0,0)').css("overflow", "hidden");
                    if (prweb.IsTouch) {
                        $this.bind("dragstart.scroller", me.touchStart)
                        .bind("drag.scroller", me.touchMove).bind("dragend.scroller", me.touchEnd);
                    }
                    //                    var el = $this[0];
                    //                    el.addEventListener("touchstart", me.touchStart, false);
                    //                    el.addEventListener("touchend", me.touchEnd, false);
                    //                    el.addEventListener("touchmove", me.touchMove, false);
                    //                    el = null;
                };

                me.detachEvents = function () {
                    if (prweb.IsTouch) {
                        $this.unbind("dragstart.scroller", me.touchStart)
                        .unbind("dragend.scroller", me.touchEnd)
                        .unbind("drag.scroller", me.touchMove);
                    }
                    //                    var el = $this[0];
                    //                    el.removeEventListener("touchstart", me.touchStart, false);
                    //                    el.removeEventListener("touchend", me.touchEnd, false);
                    //                    el.removeEventListener("touchmove", me.touchMove, false);
                    //                    el = null;
                };

                //#endregion

                //#region Dispose
                me.Dispose = function () {
                    //                    alert("scroller.touchAble sees Dispose...");
                    if (prweb.IsTouch) {
                        me.detachEvents();
                    }
                    self = null;
                    $this = null;
                    me = null;
                };
                //#endregion

                return me;
            } ());

            //Make sure you see this...touchevents only when prweb.IsTouch...
            this.options.touchAble.attachEvents();
        },
        //#endregion

        //#region Dispose Destroy

        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    if (this.options.touchAble) {
                        this.options.touchAble.Dispose();
                        this.options.touchAble = null;
                    }
                    $(".scroller", this.element.parent()).unbind(".scroller").remove();
                    if (this.itemWrap) {
                        this.itemWrap.remove();
                        this.itemWrap = null;
                    }
                    if (prweb.IsTouch) {
                        this.element.off("swipe.scroller");
                    }
                }
                catch (ex) {
                    alert("prweb.scoller.dispose reports error..." + ex.Message);
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
                alert("prweb.scoller.destroy reports error..." + ex.Message);
                ex = null;
            }
            $.Widget.prototype.destroy.call(this);
        }

        //#endregion

        //end of widget defn...
    });
} (this.prweb, jQuery));
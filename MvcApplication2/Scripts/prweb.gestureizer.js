/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.gestureizer = (function () {
        //#region ClassVariables

        var that = {};

        //#region Util

        that.util = {};

        /**
        * tries to get the touches from a jQuery(!) touch event
        * @param event
        * @return {TouchEvent[]}
        */
        that.util.getTouches = function (event) {
            return event.originalEvent.touches.length > 0 ?
                    $.extend(true, {}, event.originalEvent.touches) :
                        (event.originalEvent.changedTouches.length > 0 ?
                            $.extend(true, {}, event.originalEvent.changedTouches) :
                                []
                        );
        };
        /**
        *
        * @param $target
        * @param {String} event event name which should be tested against $target
        * @return {Boolean}
        */
        that.util.hasEvent = function ($target, event) {
            return $target.data('events') ? $target.data('events')[event] : 0;
        };
        //#endregion
        //#region Calc

        that.calc = {};

        /**
        * angle to direction define, getDirectionFromAngle
        * @param  float    angle
        * @return string   direction
        */
        that.calc.getDirection = function (angle) {
            if (angle < -45 && angle > -135) {
                return 'top';
            } else if (angle >= -45 && angle <= 45) {
                return 'right';
            } else if (angle >= 45 && angle < 135) {
                return 'down';
            } else if (angle >= 135 || angle <= -135) {
                return 'left';
            }
        };

        /**
        * @param {Object} pos1
        * @param {Number} pos1.pageX
        * @param {Number} pos1.pageY
        * @param {Object} pos2
        * @param {Number} pos2.pageX
        * @param {Number} pos2.pageY
        * @return {Number} angle between pos1 and pos2
        */
        that.calc.getAngle = function (pos1, pos2) {
            return Math.atan2(pos2.pageY - pos1.pageY, pos2.pageX - pos1.pageX) * 180 / Math.PI;
        };

        /**
        * @param {Object[]} start must contain the position of two fingers
        * @param {Number} start[].pageX
        * @param {Number} start[].pageY
        * @param {Object[]} move must contain the position of two fingers
        * @param {Number} move[].pageX
        * @param {Number} move[].pageY
        * @return {Number} scale size between two fingers
        */
        that.calc.getScale = function (start, move) {
            if (start.length === 2 && move.length === 2) { // needs to have the position of two fingers
                return (Math.sqrt(Math.pow(move[0].pageX - move[1].pageX, 2) + Math.pow(move[0].pageY - move[1].pageY, 2)) / Math.sqrt(Math.pow(start[0].pageX - start[1].pageX, 2) + Math.pow(start[0].pageY - start[1].pageY, 2)));
            }

            return 0;
        };

        /**
        * @param {Object[]} start must contain the position of two fingers
        * @param {Number} start[].pageX
        * @param {Number} start[].pageY
        * @param {Object[]} move must contain the position of two fingers
        * @param {Number} move[].pageX
        * @param {Number} move[].pageY
        * @return {Number} rotation degrees between two fingers
        */
        that.calc.getRotation = function (start, move) {
            if (start.length === 2 && move.length === 2) {
                return ((Math.atan2(move[0].pageY - move[1].pageY, move[0].pageX - move[1].pageX) * 180 / Math.PI) - (Math.atan2(start[0].pageY - start[1].pageY, start[0].pageX - start[1].pageX) * 180 / Math.PI));
            }

            return 0;
        };

        /**
        * @param {TouchEvent} startTouch
        * @param {TouchEvent} moveTouch
        * @return {Number} maximum distance the finger moved
        */
        that.calc.getDistance = function (startTouch, moveTouch) {
            return Math.sqrt(Math.pow(moveTouch.pageX - startTouch.pageX, 2) + Math.pow(moveTouch.pageY - startTouch.pageY, 2));
        };

        that.calc.getPosition = function (startTouch, moveTouch) {
            var position = {
                left: 0,
                top: 0
            };
            try {
                if (startTouch && moveTouch) {

                    position.left = moveTouch.pageX - startTouch.pageX;
                    position.top = moveTouch.pageY - startTouch.pageY;

                }
            }
            catch (ex) {
                alert("gesturizer.calc.getPosition reports " + ex.Message);
            }


            return position;
        };
        //#endregion
        //#region State

        /**
        * current state of the runnign gesture
        *
        * @type {Object}
        * @type {Object} touches touches contains the TouchList objects of touchstart, touchmove and touchend
        * @type {TouchList[]} touches.start
        * @type {TouchList[]} touches.move
        * @type {TouchList[]} touches.end
        * @type {Object} events contains the TouchEvents of the current gestures
        * @type {TouchEvent} events.start
        * @type {TouchEvent} events.move
        * @type {TouchEvent} events.end
        * @type {Number} timestamp the time when the gesture started (ontouchstart)
        * @type {Object} offset the document offset of the current event target
        * @type {Number} offset.top
        * @type {Number} offset.left
        */
        that.state = {
            touches: {},
            events: {},
            timestamp: false,
            $target: false,
            prevGesture: null,

            offset: {}
        };

        /**
        * resets the gesture the inital values
        */
        that.state.clearState = function () {
            that.state.touches = {};
            that.state.events = {};
            that.state.timestamp = false;
            that.state.$target = false;
        };

        //#endregion


        //#region gestures
        that.gestures = {
            start: [],
            move: [],
            end: [],
            subscribedgestures: {},
            none: []
        };

        that.gestures.add = function (timing, gesture, func, priority) {
            var i,
		        tmp,
		        inserted = false;

            if (priority) {
                for (i = 0; i < that.gestures[timing].length; i++) {
                    tmp = that.gestures[timing][i];

                    if (tmp.priority && tmp.priority < priority) {
                        continue;
                    }

                    that.gestures[timing].splice(i, 0, {
                        gesture: gesture,
                        func: func,
                        priority: false
                    });
                    inserted = true;
                }
            }

            if (!priority || !inserted) {
                that.gestures[timing].push({
                    gesture: gesture,
                    func: func,
                    priority: false
                });
            }

            that.registerSpecialEvent(gesture);
        };

        //looks through all of the gestures in a timing bucket and executes each registered function...
        //each registered function will trigger events on the dom element $this that is being touched...
        //presuming the gestures conditions are satisfied...
        //would like to break out of this for loop when we have identified a gesture..dont execute any more gestures 
        // and only execute gestures if the dom element has a handler attached for this gesture
        // every dom elem that registers for a swipe tap rotate etc could add a swipe class
        // if elem.hasClass(that.gestures[timing][i].gesture) execute gestures[timing][i].func(event)
        that.gestures.exec = function (timing, event) {
            var i;
            var cl;
            var subscrcnt;
            //            if (that.state.$target) {
            for (i = 0; i < that.gestures[timing].length; i++) {
                cl = that.gestures[timing][i].gesture;
                subscrcnt = that.gestures.subscribedgestures[cl] || false;
                if (subscrcnt) {
                    that.gestures[timing][i].func(event);
                    //                    alert("he executed " + cl + " subcrcnt=" + subscrcnt);
                }
                //                else {
                //                    alert($(event.target)[0].toString() + "   gestures.exec says $this.data(" + cl + ") is " + dcl);
                //                }
            }
            //            }
            //            else {
            //                alert("gestures.exec says state.$target is nogo...")
            //            }
            i = null;
            cl = null;
            dcl = null;
            return;
        };

        //#endregion

        //#region $proxyStart,Move,End

        that.$proxyStart = false;
        that.$proxyMove = false;
        that.$proxyEnd = false;

        //#endregion

        //#region touchstart
        /**
        *
        * @param {jQuery.Event} event
        */
        that.touchstart = function (event) {
            event.preventDefault();
            //            event.cancelBubble = true;
            //            event.returnValue = false;
            //            event.stopPropagation();
            var $target = $(event.target);

            that.state.clearState();
            that.state.$target = $(event.target);
            that.state.touches.start = that.util.getTouches(event);
            that.state.events.start = event;
            that.state.timestamp = new Date().getTime();

            //            that.state.events.start = event;

            that.state.offset = $target.offset();
            $target = null;
            that.gestures.exec('start', event);
            return;
        };

        //#endregion
        //#region touchmove and touchend

        /**
        *
        * @param {jQuery.Event} event
        */
        that.touchmove = function (event) {
            event.preventDefault();
            //            event.cancelBubble = true;
            //            event.returnValue = false;
            //            event.stopPropagation();
            if (that.state.timestamp) {
                that.state.touches.move = that.util.getTouches(event);
                that.state.events.move = event;
                //            alert("gesturizer.touchmove");
                that.gestures.exec('move', event);
            }

            return;
        };

        /**
        *
        * @param {jQuery.Event} event
        */
        that.touchend = function (event) {
            event.preventDefault();
            //            event.cancelBubble = true;
            //            event.returnValue = false;
            //            event.stopPropagation();
            if (that.state.timestamp) {
                that.state.touches.end = that.util.getTouches(event);
                that.state.events.end = event;

                that.gestures.exec('end', event);

                that.state.prevGesture = that.state.gesture;
                that.state.clearState();
            }

            return;
        };

        //#endregion

        that.$proxyStart = $.proxy(that.touchstart, this);
        that.$proxyMove = $.proxy(that.touchmove, this);
        that.$proxyEnd = $.proxy(that.touchend, this);

        //#region eventSetup and eventTeardown
        //is executed the first time a dom element attaches an event handler to xxxevent e.g, swipe, tap etc...
        that.eventSetup = function (data, namespaces, eventHandler) {
            var $this = $(this);
            //            alert("eventSetup " + this.toString());
            var prwgstrzr = $this.data('prwgstrzr') || 0;

            if (prwgstrzr === 0) {
                $this.on('touchstart', that.$proxyStart);
                $this.on('touchmove', that.$proxyMove);
                $this.on('touchend touchcancel', that.$proxyEnd);
            }

            $this.data('prwgstrzr', ++prwgstrzr);
        };

        that.eventTeardown = function (namespace) {
            var $this = $(this);

            var prwgstrzr = $this.data('prwgstrzr') || 0;

            $this.data('prwgstrzr', --prwgstrzr);

            if (prwgstrzr === 0) {
                $this.off('touchstart', that.$proxyStart);
                $this.off('touchmove', that.$proxyMove);
                $this.off('touchend touchcancel', that.$proxyEnd);
            }
        };

        that.addGestureSubscription = function (handleObj) {
            try {
                var cl = handleObj.type;
                var subscr = that.gestures.subscribedgestures[cl] || false;
                if (!subscr) {
                    that.gestures.subscribedgestures[cl] = 1;
                }
                else {
                    that.gestures.subscribedgestures[cl] = subscr + 1;
                }
                cl = null;
                subscr = null
            }
            catch (ex) {
                alert("prweb.gesturizer.removeGestureSubscription reports " + ex.Message);
            }
        };
        that.removeGestureSubscription = function (handleObj) {
            try {
                var cl = handleObj.type;
                var subscr = that.gestures.subscribedgestures[cl] || false;
                if (subscr) {
                    that.gestures.subscribedgestures[cl] = Math.max(subscr - 1, 0);
                }
                cl = null;
                subscr = null;
            }
            catch (ex) {
                alert("prweb.gesturizer.removeGestureSubscription reports " + ex.Message);
            }
        };


        //#endregion

        //called by gestures.add....
        that.registerSpecialEvent = function (eventName) {
            if (prweb.IsTouch) { // event binding will just work on touch devices
                //                alert("registerSpecialEvent " + eventName);
                $.event.special[eventName] = {
                    setup: that.eventSetup,
                    teardown: that.eventTeardown,
                    add: that.addGestureSubscription,
                    remove: that.removeGestureSubscription
                };
                //                alert("register special event");
            }
        };


        that.SuspendGesturizer = function () {

        };
        //#region Drag and AddDragGesture
        that.dragStarted = false;

        that.dragConfig = {
            drag_time: 400,
            drag_min_distance: 30
        };

        that.dragstart = function (event) {
            try {
                var duration = new Date().getTime() - that.state.timestamp;
                if (that.state.touches.move.length == 1 && (that.dragConfig.drag_time <= duration)) {
                    var distance = that.calc.getDistance(that.state.touches.start[0], that.state.touches.move[0]);
                    if ((!that.dragStarted) && (distance >= that.dragConfig.drag_min_distance)) {
                        //                        prweb.debugsvc.Write("gesturizer.dragstart");
                        that.state.gesture = 'dragstart';
                        $(event.target).trigger($.Event('dragstart', {
                            originalEvent: event.originalEvent,
                            point: {
                                pagex: that.state.touches.start[0].pageX,
                                pagey: that.state.touches.start[0].pageY,
                                clientx: that.state.touches.start[0].clientX,
                                clienty: that.state.touches.start[0].clientY
                            }
                        }));
                        that.dragStarted = true;
                    }
                }
                else {
                    that.dragStarted = false;
                }
            }
            catch (ex) {
                that.dragStarted = false;
                alert("gesturizer.dragstart reports " + ex.Message);
            }

        };

        that.drag = function (event) {
            try {
                if (that.dragStarted) {
                    if (that.state.touches.move && that.state.touches.move.length == 1) {
                        //                        prweb.debugsvc.Write("gesturizer.drag");
                        that.state.gesture = 'drag';
                        var pos = that.calc.getPosition(that.state.touches.start[0], that.state.touches.move[0]);
                        $(event.target).trigger($.Event('drag', {
                            originalEvent: event.originalEvent,
                            position: pos,
                            touches: $.extend(true, {}, that.state.touches)
                        }));
                    }
                    else {
                        //                        prweb.debugsvc.Write("gesturizer.drag triggers dragend");
                        $(event.target).trigger($.Event('dragend', {
                            originalEvent: event.originalEvent,
                            point: {
                                pagex: event.originalEvent.changedTouches[0].pageX,
                                pagey: event.originalEvent.changedTouches[0].pageY,
                                clientx: event.originalEvent.changedTouches[0].clientX,
                                clienty: event.originalEvent.changedTouches[0].clientY
                            },
                            touches: $.extend(true, {}, that.state.touches)
                        }));
                        that.dragStarted = false;
                    }
                }
            }
            catch (ex) {
                alert("gesturizer.drag reports " + ex.Message);
            }
            return;
        };

        that.dragend = function (event) {
            try {
                if (that.state.gesture === 'drag' || that.state.gesture === 'dragstart') {
                    //                    prweb.debugsvc.Write("gesturizer.dragend");
                    $(event.target).trigger($.Event('dragend', {
                        originalEvent: event.originalEvent,
                        point: {
                            pagex: event.originalEvent.changedTouches[0].pageX,
                            pagey: event.originalEvent.changedTouches[0].pageY,
                            clientx: event.originalEvent.changedTouches[0].clientX,
                            clienty: event.originalEvent.changedTouches[0].clientY
                        },
                        touches: $.extend(true, {}, that.state.touches)
                    }));
                    that.dragStarted = false;
                }
            }
            catch (ex) {
                that.dragStarted = false;
                alert("gesturizer.dragend reports " + ex.Message);
            }
            return;
        };

        that.AddDragGesture = function () {
            that.gestures.add('move', 'dragstart', that.dragstart);
            that.gestures.add('move', 'drag', that.drag);
            that.gestures.add('end', 'dragend', that.dragend);
        };

        //#endregion


        //#region Swipe config and AddSwipeGesture
        that.swipeconfig = {
            swipe_time: 300,
            swipe_min_distance: 20
        };

        that.swipe = function (event) {
            //            event.preventDefault();
            //            event.stopPropagation();
            try {
                //                prweb.debugsvc.Write("gesturizer.swipe try dragStarted= " + that.dragStarted);
                if (!that.dragStarted && that.state.touches.move && that.state.touches.move.length == 1) {
                    //                    prweb.debugsvc.Write("gesturizer.swipe touches.move and length ok");
                    var duration = new Date().getTime() - that.state.timestamp;
                    var angle = 0;
                    var direction = false;
                    var distance = 0;
                    distance = that.calc.getDistance(that.state.touches.start[0], that.state.touches.move[0]);
                    if ((that.swipeconfig.swipe_time > duration) && (distance > that.swipeconfig.swipe_min_distance)) {

                        angle = that.calc.getAngle(that.state.touches.start[0], that.state.touches.move[0]);
                        direction = that.calc.getDirection(angle);
                        //                        prweb.debugsvc.Write("gesturizer.swipe");
                        that.state.gesture = 'swipe';
                        $(event.target).trigger($.Event('swipe', {
                            originalEvent: event.originalEvent,
                            direction: direction,
                            touches: $.extend(true, {}, that.state.touches)
                        }));
                        that.omniscaleconfig.started = false;
                        that.dragStarted = false;
                    }
                    event = null;
                    duration = null;
                    angle = null;
                    direction = null;
                    distance = null;
                }
            }
            catch (ex) {
                alert("gesturizer.swipe reports " + ex.Message);
            }

            return true;
        };

        that.AddSwipeGesture = function (swipetime, swipemindistance) {
            //add config values here...optionally...
            if (swipetime) {
                that.swipeconfig.swipe_time = swipetime;
            }
            if (swipemindistance) {
                that.swipeconfig.swipe_min_distance = swipemindistance;
            }
            //            alert("add swipe gesture");
            that.gestures.add('end', 'swipe', that.swipe);
        };

        //#endregion

        //#region Tap config and AddTapGesture

        that.tapconfig = {
            //            tap_double_max_interval: 300,
            tap_max_distance: 10,
            //            tap_distance: 20,

            hold_timeout: 700
        };

        that.tap = function (event) {
            try {
                var timestamp = new Date().getTime();
                var duration = timestamp - that.state.timestamp;
                var distance = 0;
                if (that.tapconfig.hold_timeout > duration) {
                    if (that.state.touches.move) {
                        distance = that.calc.getDistance(that.state.touches.start[0], that.state.touches.move[0]);
                    }
                    if (distance < that.tapconfig.tap_max_distance && that.state.touches.start.length == 1) {
                        //                var $target = $(event.target);
                        //ignores doubletap and taphold
                        //                alert("tap says " + $(event.target)[0].toString());
                        $(event.target).trigger($.Event('tap', {
                            originalEvent: event.originalEvent,
                            point: {
                                pagex: that.state.touches.start[0].pageX,
                                pagey: that.state.touches.start[0].pageY,
                                clientx: that.state.touches.start[0].clientX,
                                clienty: that.state.touches.start[0].clientY
                            }
                        }));
                        that.omniscaleconfig.started = false;
                        that.dragStarted = false;
                    }
                    //                else {
                    //                    alert("touches.start.length = " + that.state.touches.start.length)
                    //                }

                }
            }
            catch (ex) {
                alert("prweb.gesturizer.tap reports " + ex.Message);
            }

        };

        that.AddTapGesture = function () {
            that.gestures.add('end', 'tap', that.tap);
        };

        //#endregion

        //#region OmniScale
        that.getEffectiveRotation = function (rot) {
            var rslt = 0;
            rslt = rot; //* 0.5; //Math.abs(rot) - that.omniscaleconfig.effrotation_threshold;
            //            if (rot < 0) {
            //                rslt = rslt * -1;
            //            }
            return rslt;
        };

        that.getEffectiveScale = function (scale) {
            var rslt = 1;
            rslt = scale; //scale - that.omniscaleconfig.effscale_threshold;
            return rslt;
        };

        that.omniscaleconfig = {
            scale_treshold: 0.1,
            rotation_treshold: 25,
            effscale_threshold: 0.1,
            effrotation_threshold: 15,
            started: false,
            center: 0
        };

        that.omniscalestart = function (event) {
            //distinguishthisguy from dragstart....
            //            alert("gesturizer does omniscalestart");
            try {
                if (that.state.touches.move.length == 2 && !that.omniscaleconfig.started) {
                    //                alert("gesturizer says touches.length = 2");
                    try {
                        var rotation = false;
                        var scale = false;
                        var effscale = 0;
                        var effrot = 0;
                        var $target = $(event.target);

                        rotation = that.calc.getRotation(that.state.touches.start, that.state.touches.move);
                        scale = that.calc.getScale(that.state.touches.start, that.state.touches.move);
                        if (that.state.gesture === 'omniscale' || Math.abs(1 - scale) > that.omniscaleconfig.scale_treshold || Math.abs(rotation) > that.omniscaleconfig.rotation_treshold) {
                            that.state.gesture = 'omniscalestart';

                            that.omniscaleconfig.center = { pageX: ((that.state.touches.move[0].pageX + that.state.touches.move[1].pageX) / 2) - that.state.offset.left,
                                pageY: ((that.state.touches.move[0].pageY + that.state.touches.move[1].pageY) / 2) - that.state.offset.top
                            };
                            effscale = that.getEffectiveScale(scale);
                            effrot = that.getEffectiveRotation(rotation);
                            if (!that.omniscaleconfig.started) {
                                $target.trigger($.Event('omniscalestart', {
                                    originalEvent: event.originalEvent,
                                    center: that.omniscaleconfig.center,
                                    scale: effscale,
                                    rotation: effrot
                                }));
                                that.omniscaleconfig.started = true;
                            }
                        }
                        $target = null;
                        scale = null;
                        rotation = null;
                    }
                    catch (ex) {
                        alert("gesturizer.omniscalestart reports " & ex.Message);
                    }
                }
            }
            catch (ex) {
                alert("prweb.gesturizer.omniscalestart reports " + ex.Message);
            }

        };

        that.omniscalemove = function (event) {
            try {
                var rotation = false;
                var scale = false;
                var $target = false;
                var effscale = 0;
                var effrot = 0;
                if (that.omniscaleconfig.started == true) {
                    if (that.state.touches.move && that.state.touches.move.length == 2) {
                        $target = $(event.target);
                        rotation = that.calc.getRotation(that.state.touches.start, that.state.touches.move);
                        scale = that.calc.getScale(that.state.touches.start, that.state.touches.move);
                        effscale = that.getEffectiveScale(scale);
                        effrot = that.getEffectiveRotation(rotation);
                        if (effscale != 1 || effrot != 0) {
                            that.state.gesture = 'omniscale';
                            $target.trigger($.Event('omniscale', {
                                originalEvent: event.originalEvent,
                                center: that.omniscaleconfig.center,
                                scale: effscale,
                                rotation: effrot
                            }));
                        }
                    }
                    else {
                        $target = $(event.target);
                        $target.trigger($.Event('omniscaleend', {
                            originalEvent: event.originalEvent
                        }));
                        that.omniscaleconfig.started = false;
                    }
                    $target = null;
                }
            }
            catch (ex) {
                alert("prweb.gesturizer.omniscalemove reports " & ex.Message);
            }

        };

        that.omniscaleend = function (event) {
            try {
                var $target = false;
                if (that.state.gesture == 'omniscale' || that.state.gesture == 'omniscalestart') {
                    $target = $(event.target);
                    $target.trigger($.Event('omniscaleend', {
                        originalEvent: event.originalEvent
                    }));
                }
                that.omniscaleconfig.started = false;
            }
            catch (ex) {
                alert("prweb.gesturizer.omniscaleend reports " + ex.Message);
            }

        };

        that.AddOmniScaleGesture = function () {
            that.gestures.add("move", "omniscalestart", that.omniscalestart);
            that.gestures.add("move", "omniscale", that.omniscalemove);
            that.gestures.add("end", "omniscaleend", that.omniscaleend);
        };

        //#endregion

        that.horizscalestart = function () {
        };
        that.horizscale = function () {
        };
        that.horizscaleend = function () {
        };

        that.DesignInitialize = function () {


            that.AddDragGesture();
            that.AddOmniScaleGesture();
            that.AddTapGesture();
            that.AddSwipeGesture();
        };

        that.DesignDispose = function () {

        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
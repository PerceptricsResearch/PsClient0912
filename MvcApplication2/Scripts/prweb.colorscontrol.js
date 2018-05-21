/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.colorscontrol', {
        //#region Class Variables and Create

        options: {
            id: 0,
            //            colorsubscr: null,
            //            colors: null,
            //            colorPicker: null,
            //            huePicker: null,
            //            huePosition: null,
            mycolorhex: null
            //            hsb: null,
            //            colorstylesheader: null
        },

        _create: function () {
            var myclass = "colorscontrol";
            var xevent = {
                leave: "mouseleave.colorscontrol",
                up: "mouseup.colorscontrol",
                down: "mousedown.colorscontrol",
                move: "mousemove.colorscontrol"
            };
            if (prweb.IsTouch) {
                xevent.up = "touchend.colorscontrol";
                xevent.down = "touchstart.colorscontrol";
                xevent.move = "touchmove.colorscontrol";
            }
            this.colors = $('#miniColors-colors');
            this.hues = $("#miniColors-hues");
            this.colorbackground = $("#colorsbackgroundrect");
            //            this.colorPicker = $('.miniColors-colorPicker', this.element);
            //            this.huePicker = $('.miniColors-huePicker', this.element);
            this.xcolorPicker = $('#colorpicker');
            this.xhuePicker = $('#huepicker');
            this.options.mycolorhex = 'ff0000';
            this.hueonlyhsb = prweb.colorssvc.hex2hsb(this.options.mycolorhex);
            this.hueonlyhsb.s = 100;
            this.hueonlyhsb.b = 100;
            this.hueonlyhsb.a = 1;
            this.hsb = prweb.colorssvc.hex2hsb(this.options.mycolorhex);
            this._populateInitialPositionColorandHue(this.hsb);
            this._populateEventHandlersForColorsandHues(xevent);
            //test subscription to colorssvc.subscribetocolorchanged
            //            this._populatetestcolorchangedhandler();
        },


        colors: null,
        hues: null,
        colorbackground: null,
        //        colorPicker: null,
        xcolorPicker: null,
        //        huePicker: null,
        xhuePicker: null,
        huePosition: null,
        colorPosition: null,
        hueonlyhsb: null,
        hsb: null,
        colorsubscr: null,

        //#endregion

        _setColor: function (hsb) {
            //            var hex = prweb.colorssvc.hsb2hex(hsb);
            var rslt = prweb.colorssvc.PopulateChangedColor(hsb);
            hsb = null;
            return rslt;
        },


        //#region populatEInitialPosition for ColorPicker and HuesPicker

        _populateInitialPositionColorandHue: function (hsb) {
            var huePosition = prweb.colorssvc.getHuePositionFromHSB(hsb); // also this.options.huePosition...
            //            this.huePicker.css('top', huePosition.y + 'px');
            this.xhuePicker.attr("y", huePosition.y);
            var colorPosition = prweb.colorssvc.getColorPositionFromHSB(hsb);
            //            this.colorPicker.css('top', colorPosition.y + 'px')
            //					                .css('left', colorPosition.x + 'px');
            this.xcolorPicker.attr("y", colorPosition.y).attr("x", colorPosition.x);
            huePosition = null;
            colorPosition = null;
        },

        //#endregion

        //#region MoveHue

        _moveHue: function (event) {
            //            var huePicker = this.huePicker;
            //            this.huePicker.hide();
            try {
                var position = {
                    y: event.clientY
                };


                // Touch support
                if (prweb.IsTouch) {
                    if (event.originalEvent.changedTouches) {
                        position.y = event.originalEvent.changedTouches[0].pageY;
                    }
                }


                position.y = position.y - this.colors.offset().top;

                if (position.y < 0) {
                    position.y = 0;
                }
                if (position.y > 150) {
                    position.y = 150;
                }
                //            this.xhuePicker.attr("y", position.y);

                this.huePosition = position;

                // Calculate hue
                var h = Math.round((150 - position.y) * 2.4);
                if (h < 0) h = 0;
                if (h > 360) h = 360;

                // Update HSB values
                this.hsb.h = h;
                this.hueonlyhsb.h = h;
                //            hsb.h = h;
                h = null;
                position = null;
                // Set color...colorbackground is a rect in the svg...
                this._setColor(this.hsb);
                this.colorbackground.attr('fill', prweb.colorssvc.ToHslaColorStr(prweb.colorssvc.hsb2hsl(this.hueonlyhsb)));
                //            hsb = null;

                //            this._setColor(hsb);
                //            huePicker = null;
            }
            catch (ex) {

            }
            return;
        },

        //#endregion

        //#region MoveColor

        _moveColor: function (event) {
            //            this.colorPicker.hide();
            try {
                var position = {
                    x: event.clientX,
                    y: event.clientY
                };
                // Touch support
                if (prweb.IsTouch) {
                    if (event.originalEvent.changedTouches) {
                        position.x = event.originalEvent.changedTouches[0].clientX;
                        position.y = event.originalEvent.changedTouches[0].clientY;
                    }
                }
                position.x = position.x - this.colors.offset().left;
                position.y = position.y - this.colors.offset().top;
                if (position.x < 0) position.x = 0;
                if (position.x >= 144) position.x = 144;
                if (position.y < 0) position.y = 0;
                if (position.y >= 144) position.y = 144;


                this.colorPosition = position;
                // Calculate saturation
                var s = Math.round((position.x) * 0.67);
                if (s < 0) s = 0;
                if (s > 100) s = 100;

                // Calculate brightness
                var b = 100 - Math.round((position.y) * 0.67);
                if (b < 0) b = 0;
                if (b > 100) b = 100;

                // Update HSB values
                var hsb = this.hsb;
                hsb.s = s;
                hsb.b = b;

                // Set color
                this._setColor(hsb);
                position = null;
                hsb = null;
            }
            catch (ex) {

            }
            return false;
        },

        //#endregion

        //#region EventHandlers Hues and Colors

        _populateEventHandlersForColorsandHues: function (xevent) {
            var self = this;
            var handle = {
                moving: false,
                mousebutton: false
            };
            this.colors.on(xevent.down, function (e) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    handle.mousebutton = 1;
                    //                e.preventDefault();
                    handle.moving = 'colors';
                    self._moveColor(e);
                    e = null;
                }
                catch (ex) {
                    alert("prweb.colorscontrol.colors.down reports " + ex.Message);
                }
                return false;
            });

            this.hues.on(xevent.down, function (e) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    handle.mousebutton = 1;
                    //                event.preventDefault();
                    handle.moving = 'hues';
                    self._moveHue(e);
                    e = null;
                }
                catch (ex) {
                    alert("prweb.colorscontrol.hues.down reports " + ex.Message);
                }
                return false;
            });

            //            this.element.bind('mousedown.colorscontrol touchstart.colorscontrol', function (event) {
            //                handle.mousebutton = 1;
            //                //                if ($(event.target).parents().andSelf().hasClass('miniColors-colors')) {
            //                //                    event.preventDefault();
            //                //                    handle.moving = 'colors';
            //                //                    self._moveColor(event);
            //                //                    //                    mvcolor(event); //self._moveColor(event);
            //                //                }

            //                //                if ($(event.target).parents().andSelf().hasClass('miniColors-hues')) {
            //                //                    event.preventDefault();
            //                //                    handle.moving = 'hues';
            //                //                    self._moveHue(event);
            //                //                    //                    mvhue(event); //self._moveHue(event);
            //                //                }

            //                if ($(event.target).parents().andSelf().hasClass('miniColors-selector')) {
            //                    event.preventDefault();
            //                    return;
            //                }

            //                if ($(event.target).parents().andSelf().hasClass('miniColors')) return;

            //            });
            this.element
					.on(xevent.up, function (event) {
					    try {
					        handle.mousebutton = 0;
					        event.preventDefault();
					        event.stopPropagation();
					        event.cancelBubble = true;
					        $(this).blur();

					        switch (true) {
					            case (handle.moving === 'colors'):
					                {
					                    self.xcolorPicker.attr("y", self.colorPosition.y).attr("x", self.colorPosition.x);
					                    break;
					                }
					            case (handle.moving === 'hues'):
					                {
					                    self.xhuePicker.attr("y", self.huePosition.y);
					                    break;
					                }
					        };
					        handle.moving = false;
					        event = null;
					    }
					    catch (ex) {
					        alert("prweb.colorscontrol.up reports " + ex.Message);
					    }
					    return false;
					})
					.on(xevent.move, function (event) {
					    try {
					        event.preventDefault();
					        event.stopPropagation();
					        event.cancelBubble = true;
					        $(this).blur();
					        if (handle.mousebutton === 1) {
					            switch (true) {
					                case (handle.moving === 'colors'):
					                    {
					                        self._moveColor(event);
					                        break;
					                    }
					                case (handle.moving === 'hues'):
					                    {
					                        self._moveHue(event);
					                        break;
					                    }
					            };
					        }
					        event = null;
					    }
					    catch (ex) {
					        alert("prweb.colorscontrol.move reports " + ex.Message);
					    }
					    return false;
					});
            return;
        },

        //#endregion

        //#region Dispose Destroy

        dispose: function () {
            try {
                //                this.colorsubscr.dispose();
                this.colorsubscr = null;
                this.element.off();
                this.colors.off(".colorscontrol");
                this.hues.off(".colorscontrol");
                //                this.element.unbind(".colorscontrol");//widget dispose gets rid of these...
                this.options.mycolorhex = null;
                this.colorstylesheader = null;
                this.huePosition = null;
                this.colorbackground = null;
                this.colors = null;
                this.hues = null;
                //                this.colorPicker = null;
                //                this.huePicker = null;
                this.xcolorPicker = null;
                this.xhuePicker = null;
                this.hsb = null;
            }
            catch (e) {
                alert("prweb.colorscontrol.dispose reports error...");
            }
            finally {
                return true;
            }
        },

        destroy: function () {
            //            prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.smddetailsbtnclick, this._moveToVisualStateSMDDetailsBtnClick, this);
            //            this._dispose();
            $.Widget.prototype.destroy.call(this);
            //            this.element = null;
        }

        //#endregion
    });
} (this.prweb, jQuery));
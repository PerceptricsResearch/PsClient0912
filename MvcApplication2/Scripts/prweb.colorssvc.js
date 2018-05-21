/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.colorssvc = (function () {
        var that = {};

        //#region NewColorObservable and Subscription Method

        that.NewColor = ko.observable("rgba(255,255,255,1)");


        that.SubscribeToColorChanged = function (subscribercallback) {
            return that.NewColor.subscribe(subscribercallback); //subscribers need to use this return value to dispose of their subscription...xxx.dispose()
        };

        //#endregion

        //#region CurrentColor and ToHsla/Rbga methods

        that.ToRgbaColorStr = function (rgbcolor) {
            return "rgba(" + rgbcolor.r + ", " + rgbcolor.g + ", " + rgbcolor.b + ", " + rgbcolor.a.toString() + ")";
        };
        that.ToHslaColorStr = function (hsla) {
            return "hsla(" + hsla.h + ", " + hsla.s + "%, " + hsla.xl + "%, " + hsla.a.toString() + ")";
        };
        that.CurrentColorRgba = {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        };

        that.CurrentColorHsla = {
            h: 1,
            s: 100,
            xl: 50,
            a: 1
        };

        //#endregion



        //#region RadioButton radialGradient and Background LinearGradient Methods
        that.defltBackgroundColorColxn = {
            0: { h: 6, s: 70, xl: 49, maxxl: 95, minxl: 5 },
            1: { h: 0, s: 70, xl: 35, maxxl: 85, minxl: 5 },
            2: { h: 3, s: 70, xl: 20, maxxl: 75, minxl: 2 },
            3: { h: 6, s: 70, xl: 15, maxxl: 75, minxl: 5 }

        }

        that.GetBackgroundColorColxn = function () {
            var rslt = [];
            var tbrush = { h: 0, s: 0, xl: 0, a: 1 };
            //            var xladj = Math.max((that.CurrentColorHsla.xl / 10), .1);
            for (var ndx in that.defltBackgroundColorColxn) {
                var hsla = that.defltBackgroundColorColxn[ndx];
                tbrush.h = Math.min((hsla.h + that.CurrentColorHsla.h), 360);
                tbrush.s = that.CurrentColorHsla.s;
                tbrush.xl = (that.CurrentColorHsla.xl / 35) * hsla.xl;
                //                tbrush.xl = Math.max(hsla.minxl, (Math.min((hsla.xl * xladj), hsla.maxxl)));
                rslt.push(that.ToHslaColorStr(tbrush));
                hsla = null;
            };
            tbrush = null;
            return rslt;
        };


        that.defaultOnhslacolxn = {
            0: { h: 5, s: 100, xl: 80, maxxl: 90, minxl: 65 },
            1: { h: 0, s: 100, xl: 75, maxxl: 65, minxl: 45 },
            2: { h: 0, s: 100, xl: 35, maxxl: 45, minxl: 10 },
            3: { h: 2, s: 100, xl: 2, maxxl: 10, minxl: 1 },
            4: { h: 0, s: 100, xl: 20, maxxl: 25, minxl: 15 }
        };

        that.GetRBForegroundColorColxn = function () {
            var rslt = [];
            var tbrush = { h: 135, s: 100, xl: 80, a: 1 };
            var xladj = Math.max((that.CurrentColorHsla.xl / 50), .1);
            for (var ndx in that.defaultOnhslacolxn) {
                var hsla = that.defaultOnhslacolxn[ndx];
                tbrush.h = Math.min((hsla.h + that.CurrentColorHsla.h), 360);
                tbrush.s = that.CurrentColorHsla.s;
                tbrush.xl = Math.max(hsla.minxl, (Math.min((hsla.xl * xladj), hsla.maxxl)));
                rslt.push(that.ToHslaColorStr(tbrush));
                hsla = null;
            };
            tbrush = null;
            return rslt;
        };

        that.defaultOffhslacolxn = {
            0: { h: 0, s: 20, xl: 32, maxxl: 35, minxl: 20 },
            1: { h: 0, s: 40, xl: 22, maxxl: 27, minxl: 12 },
            2: { h: 3, s: 100, xl: 2, maxxl: 5, minxl: 1 },
            3: { h: 1, s: 49, xl: 20, maxxl: 25, minxl: 10 }
        };

        that.GetRBBackgroundColorColxn = function () {
            var rslt = [];
            var tbrush = { h: 135, s: 100, xl: 80, a: 1 };
            var xladj = Math.max((that.CurrentColorHsla.xl / 50), .1);
            for (var ndx in that.defaultOffhslacolxn) {
                var hsla = that.defaultOffhslacolxn[ndx];
                tbrush.h = Math.min((hsla.h + that.CurrentColorHsla.h), 360);
                tbrush.s = that.CurrentColorHsla.s;
                tbrush.xl = Math.max(hsla.minxl, (Math.min((hsla.xl * xladj), hsla.maxxl)));
                rslt.push(that.ToHslaColorStr(tbrush));
                hsla = null;
            };
            tbrush = null;
            return rslt;
        };

        //#endregion
        
        //#region PopulateColorChanged and OpacityChange methods

        that.OpacityChange = function (newval) {
            //            that.CurrentColorRgba.a = newval;
            that.CurrentColorHsla.a = newval;
            if (that.IsBackgroundGradientTarget) {
                prweb.designersvc.UpdateGradientOpacity(newval);
            }
            else {
                that.NewColor(that.ToHslaColorStr(that.CurrentColorHsla));
            }
        };


        that.designstylesOpacityGetter = false;
        that.IsBackgroundGradientTarget = false;
        that.IsRadioButtonTarget = false;
        that.IsDesignerItemContext = false;
        that.PopulateChangedColor = function (hsb) {
            switch (true) {
                case (that.IsBackgroundGradientTarget && that.IsDesignerItemContext):
                    {
                        var opacity = that.designstylesOpacityGetter();
                        that.CurrentColorHsla = that.hsb2hsl(hsb);
                        prweb.designersvc.UpdateGradientBrush(opacity);
                        opacity = null;
                        break;
                    }
                case (that.IsRadioButtonTarget && that.IsDesignerItemContext):
                    {
                        that.CurrentColorHsla = that.hsb2hsl(hsb);
                        prweb.designersvc.UpdateGradientBrush();
                        break;
                    }
                case (that.IsDesignerItemContext):
                    {
                        hsb.a = that.designstylesOpacityGetter(); //is the designstyles.retrieveOpacity function....
                        that.CurrentColorHsla = that.hsb2hsl(hsb);
                        that.NewColor(that.ToHslaColorStr(that.CurrentColorHsla));
                    }
            };

        };


        //#endregion

        //#region Utility xxx2yyy methods

        that.getColorPositionFromHSB = function (hsb) {
            var x = Math.ceil(hsb.s / 0.67);
            if (x < 0) x = 0;
            if (x > 150) x = 150;
            var y = 150 - Math.ceil(hsb.b / 0.67);
            if (y < 0) y = 0;
            if (y > 150) y = 150;
            return { x: x - 5, y: y - 5 };
        };

        that.getHuePositionFromHSB = function (hsb) {
            var y = 150 - (hsb.h / 2.4);
            if (y < 0) h = 0;
            if (y > 150) h = 150;
            hsb = null;
            return { y: y - 1 };
        };

        that.hsb2rgb = function (hsb) {
            var rgb = {};
            var h = Math.round(hsb.h);
            var s = Math.round(hsb.s * 255 / 100);
            var v = Math.round(hsb.b * 255 / 100);
            if (s === 0) {
                rgb.r = rgb.g = rgb.b = v;
            } else {
                var t1 = v;
                var t2 = (255 - s) * v / 255;
                var t3 = (t1 - t2) * (h % 60) / 60;
                if (h === 360) h = 0;
                if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3; }
                else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3; }
                else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3; }
                else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3; }
                else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3; }
                else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3; }
                else { rgb.r = 0; rgb.g = 0; rgb.b = 0; }
            }
            rgb.a = hsb.a;
            hsb = null;
            return {
                r: Math.round(rgb.r),
                g: Math.round(rgb.g),
                b: Math.round(rgb.b),
                a: rgb.a
            };
        };

        that.rgb2hex = function (rgb) {
            var hex = [
					rgb.r.toString(16),
					rgb.g.toString(16),
					rgb.b.toString(16)
				];
            $.each(hex, function (nr, val) {
                if (val.length === 1) hex[nr] = '0' + val;
            });
            rgb = null;
            return hex.join('');
        };

        that.hex2rgb = function (hex) {
            hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);

            return {
                r: hex >> 16,
                g: (hex & 0x00FF00) >> 8,
                b: (hex & 0x0000FF),
                a: 1
            };
        };

        that.rgb2hsb = function (rgb) {
            var hsb = { h: 0, s: 0, b: 0, a: 1 };
            var min = Math.min(rgb.r, rgb.g, rgb.b);
            var max = Math.max(rgb.r, rgb.g, rgb.b);
            var delta = max - min;
            hsb.b = max;
            hsb.s = max !== 0 ? 255 * delta / max : 0;
            if (hsb.s !== 0) {
                if (rgb.r === max) {
                    hsb.h = (rgb.g - rgb.b) / delta;
                } else if (rgb.g === max) {
                    hsb.h = 2 + (rgb.b - rgb.r) / delta;
                } else {
                    hsb.h = 4 + (rgb.r - rgb.g) / delta;
                }
            } else {
                hsb.h = -1;
            }
            hsb.h *= 60;
            if (hsb.h < 0) {
                hsb.h += 360;
            }
            hsb.s *= 100 / 255;
            hsb.b *= 100 / 255;
            hsb.a = rgb.a;
            rgb = null;
            return hsb;
        };

        that.hex2hsb = function (hex) {
            var hsb = that.rgb2hsb(that.hex2rgb(hex));
            // Zero out hue marker for black, white, and grays (saturation === 0)
            if (hsb.s === 0) hsb.h = 360;
            hex = null;
            return hsb;
        };

        that.hsb2hsl = function (xhsb) {
            var rslt = { h: 0, s: 0, xl: 0, a: 1 };
            var hs = Math.max(0, Math.min(100, xhsb.s));
            var hb = Math.max(0, Math.min(100, xhsb.b));
            rslt.h = (xhsb.h % 360 + 360) % 360;
            rslt.xl = (2 - hs / 100) * hb / 2;
            rslt.s = hs * hb / (rslt.xl < 50 ? rslt.xl * 2 : 200 - rslt.xl * 2);
            hs = null;
            hb = null;
            xhsb = null;
            return rslt;
        };

        that.hsb2hex = function (hsb) {
            return that.rgb2hex(that.hsb2rgb(hsb));
        };

        //#endregion



        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));

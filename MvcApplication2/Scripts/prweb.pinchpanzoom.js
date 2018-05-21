/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.pinchpanzoom', {
        //#region Options
        options: {
            id: 0,
            eventID: null,
            issurveyviewpagepanelhost: false,
            scrpgitemselector: "#scrpgitem",
            currentndxsource: "pagessvc",
            ppztargetslctor: "false",
            isdragged: false,
            scale: 1,
            maxscale: 5,
            attemptedscale: 0,
            rotation: 0,
            isdraggable: false,
            istformed: false,
            isswipeable: true,
            isDisposed: false
        },

        //#endregion
        xevent: "click.pinchpanzoom",
        //#region Create
        _create: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.pinchpanzoom";
                if (this.options.issurveyviewpagepanelhost) {
                    this.identifytarget = this._surveyviewPagePpzTarget;
                }
                else {
                    this.identifytarget(this);
                }

                this._makeTappable();
                this._makeTouchTransformable();
                this._makeTouchDraggable();
                if (this.options.isswipeable) {
                    this._makeSwipeable();
                }

            }
        },
        //#endregion

        $ppztarget: null,

        //#region IdentifyTarget
        identifytarget: function (myself) {
            try {
                if (myself.options.ppztargetslctor) {
                    myself.$ppztarget = $(myself.options.ppztargetslctor, myself.element);
                }

            }
            catch (ex) {
                alert("pinchpanzoom reports " + ex.Message);
            }

        },
        //#endregion

        _surveyviewPagePpzTarget: function (myself) {
            try {
                var ppzt = false;
                var crntndx = 0;

                var scrpgselector = "";
                if (myself) {
                    scrpgselector = myself.options.scrpgitemselector;
                    crntndx = myself.options.currentndxsource();
                }
                else {
                    scrpgselector = this.options.scrpgitemselector;
                    crntndx = this.options.currentndxsource();
                }
                var itemslctor = scrpgselector + crntndx;
                var $scrpgitem = $(itemslctor);
                if ($scrpgitem.length == 1) {
                    if (myself) {
                        myself.$ppztarget = false;
                        if (myself.options.ppztargetslctor) {
                            ppzt = $(myself.options.ppztargetslctor, $scrpgitem);
                            if (ppzt.length == 1) {
                                myself.$ppztarget = ppzt;
                            }
                            else {
                                alert("pinchpanzoom.myself.identifytarget cannot find ppztarget...");
                            }
                        }
                    }
                    else {
                        this.$ppztarget = false;
                        if (this.options.ppztargetslctor) {
                            ppzt = $(this.options.ppztargetslctor, $scrpgitem);
                            if (ppzt.length == 1) {
                                this.$ppztarget = ppzt;
                            }
                            else {
                                alert("pinchpanzoom.this.identifytarget cannot find ppztarget...");
                            }
                        }
                    }
                }

            }
            catch (ex) {
                alert("pinchpanzoom.identifytarget reports " + ex.Message);
            }
        },


        _populateIdentifyTarget: function () {

        },


        //#region MakeTappable
        _removeTappable: function () {
            this.element.off(this.xevent);
        },

        _makeTappable: function () {
            var self = this;
            this.element.on(this.xevent, function (e) {
                try {
                    switch (true) {
                        case ((self.options.scale > 1 || self.options.isdragged) && !e.cancelBubble):
                            self.identifytarget(self);
                            self.options.scale = 1;
                            //var tstring = ""; // "translate(0,0)" + " scale(" + scale + ")"; //+ " rotate(" + rot + "deg)";
                            self.$ppztarget.css('-webkit-transform', ''); //css("-webkit-transform", tstring);
                            self.$ppztarget.css("top", "").css("left", "").attr("data-scale", self.options.scale);
                            self.options.isdragged = false;
                            break;
                        case (self.options.scale == 1 && !e.cancelBubble):
                            self.identifytarget(self);
                            self.options.attemptedscale = 1.5;
                            self.applyTransform();
                            self.options.isdragged = false;
                            break;
                    }
                    e.cancelBubble = true;
                }
                catch (ex) {
                    alert("prweb.pinchpanzoom.onTap reports " + ex.Message);
                }

            });
        },

        //#endregion

        //#region apply and setTransform
        applyTransform: function () {
            var maxscale = this.options.maxscale;
            var scale = this.options.scale;
            //            var rot = this.options.rotation;
            var tstring = "";
            var ascale = this.options.attemptedscale;
            //            var relsccale = 1;
            //            switch (true) {
            //                case (ascale < 1):
            //                    relsccale = 1 - ascale;
            //                    scale = relsccale * scale;
            //                    break;
            //                case (ascale > 1):
            //                    relsccale = ascale / 1;
            //                    scale = ascale;
            //                    break;
            //            }
            scale = ascale;
            this.options.scale = Math.min(Math.max(scale, 1), maxscale);
            tstring = "translate3d(0,0,0)" + " scale(" + this.options.scale + ")"; //+ " rotate(" + rot + "deg)";
            this.$ppztarget.css("-webkit-transform", tstring).attr("data-scale", this.options.scale);

            tstring = null;
            scale = null;
            //            rot = null;
        },

        _isScaling: false,
        _isRotating: false,
        _setTransform: function (tform) {
            try {
                var rot = 0;
                var scale = 1;
                var tstring = "";
                switch (true) {
                    case (Math.abs(1 - tform.scale) > 0.1 && !this._isRotating):
                        this.options.attemptedscale = tform.scale;
                        this._isScaling = true;
                        //                        this._isRotating = false;
                        //                        tstring = ' scale(' + scale + ')';
                        break;
                    //                    case (Math.abs(tform.rotation) > 1 && !this._isScaling):                                                                             
                    //                        this.options.rotation = tform.rotation;                                                                             
                    //                        this._isRotating = true;                                                                             
                    //                        this._isScaling = false;                                                                             
                    //                        //                        tstring = ' rotate(' + rot + 'deg)';                                                                             
                    //                        break;                                                                             
                }
                this.applyTransform();

            }
            catch (ex) {
                alert("pinchpanzoom.setTransform reports " + ex.Message);
            }
            //            alert("set scale and rotation");'translate3d(0, 0, 0)' + ' scale(' + this.options.scale + ')' +
        },

        //#endregion

        //#region makeTouchTransformable

        _removeTouchTransformable: function () {
            var $ix = this.element;
            $ix.off("omniscalestart.pinchpanzoom");
            $ix.off("omniscale.pinchpanzoom");
            $ix.off("omniscaleend.pinchpanzoom");
            this._isScaling = false;
            //            this._isRotating = false;
        },
        _makeTouchTransformable: function () {
            //omniscalestart

            var $ix = this.element;

            var self = this;
            var istformstart = false;
            //            var mymodel = false;
            var myscale = 1;
            var myrot = 0;
            var myomniscalemovehandler = function (event) {
                event.cancelBubble = true;
                if (istformstart) {
                    try {
                        self._setTransform(event);
                    }
                    catch (ex) {
                        alert("pinchpanzoom.omniscalemove reports " + ex.Message);
                    }
                }
            };
            var myomniscaleendhandler = function (event) {
                try {
                    //                    alert("sees omniscale end");
                    event.cancelBubble = true;
                    $ix.off("omniscale.pinchpanzoom", myomniscalemovehandler);
                    $ix.off("omniscaleend.pinchpanzoom", myomniscaleendhandler);
                    istformstart = false;
                    if (self.options.scale == 1) {
                        self.$ppztarget.css("top", "").css("left", "");
                    }
                }
                catch (ex) {
                    alert("pinchpanzoom.omniscaleend reports " + ex.Message);
                }
                finally {
                    //                    alert("sees omniscale end finally");

                    //                    mymodel = null;
                    istformstart = false;
                    self._isScaling = false;

                    //                    self._isRotating = false;
                    //                    alert("before maketouch draggable");
                    //                    if (self.options.isdraggable) {
                    //                        self._makeTouchDraggable(self);
                    //                    }

                    //                    alert("did maketouch draggable");
                };
            };
            //            alert("di add omniscalestart handler");
            $ix.on("omniscalestart.pinchpanzoom", function (event) {
                try {
                    //                    alert("di sees omniscalestart");
                    if (!event.cancelBubble) {
                        event.cancelBubble = true;
                        if (!istformstart) {
                            istformstart = true;
                            self._isScaling = false;
                            //                        self._isRotating = false;
                            self.identifytarget(self);
                            //                        self._removeSwipeable();
                            //                        self._removeTouchDraggable($ix);
                            $ix.on("omniscaleend.pinchpanzoom", myomniscaleendhandler);
                            $ix.on("omniscale.pinchpanzoom", myomniscalemovehandler);
                        }
                    }

                }
                catch (ex) {
                    alert("pinchpanzoom.omniscalestart reports " + ex.Message);
                }
            });
        },

        //#endregion

        //#region makeTouchDraggable
        _removeTouchDraggable: function (myself) {
            try {
                var $ix = false;
                if (myself) {
                    $ix = myself.element;
                }
                else {
                    $ix = this.element;
                }
                $ix.off("dragstart.pinchpanzoom");
                $ix.off("drag.pinchpanzoom");
                $ix.off("dragend.pinchpanzoom");
            }
            catch (ex) {
                alert("pinchpanzoom.removeTouchDraggable reports " + ex.Message);
            }
        },

        _makeTouchDraggable: function () {
            var self = this;
            var $ix = this.element;

            var $ixchild = false; // this.$ppztarget;
            //            var mymodel = ko.dataFor($ix[0]);
            var isdragstart = false;
            var sex = 0;
            var sey = 0;
            var curX = 0;
            var curY = 0;
            var mydragmovehandler = function (event) {
                //                alert("sees drag move");
                event.stopPropagation();
                event.cancelBubble = true;
                try {
                    curX = sex + event.position.left; // scadjpos.left; //event.position.left;
                    curY = sey + event.position.top; // scadjpos.top; // event.position.top;
                    if (curX != 0 || curY != 0) {
                        self.options.isdragged = true;
                    }
                    self.$ppztarget.css("top", ((curY * 1) + 0) + "px");
                    self.$ppztarget.css("left", ((curX * 1) + 0) + "px");
                    //                    alert("dragmove....   " + curX + "   " + curY);
                }
                catch (ex) {
                    alert("pinchpanzoom.mydragmovehandler reports " + ex.Message);
                }
            };
            var mydragendhandler = function (event) {
                try {
                    $ix.off("drag.pinchpanzoom", mydragmovehandler);
                    event.cancelBubble = true;
                    isdragstart = false;
                    $ix.off("dragend.pinchpanzoom", mydragendhandler);
                }
                catch (ex) {
                    isdragstart = false;
                    alert("pinchpanzoom.dragendhandler reports  " + ex.Message);
                }
                finally {
//                    isdragstart = false;
//                    $ix.off("dragend.pinchpanzoom", mydragendhandler);
                    //                    if (self.options.scale <= 1) {
                    //                        self._removeTouchDraggable(self);
                    //                    }
                    isdragstart = false;
                }
            };

            $ix.on("dragstart.pinchpanzoom", function (event) {
                try {
//                    prweb.debugsvc.Write("ppz.dragstart try");
                    if (!event.cancelBubble) {
//                        prweb.debugsvc.Write("ppz.dragstart not cancelBubble isdragstart= " + isdragstart);
                        if (!isdragstart && self.options.scale > 1) {
//                            prweb.debugsvc.Write("ppz.dragstart");
                            isdragstart = true;
                            self.identifytarget(self);
                            sex = parseInt(self.$ppztarget.css("left")) || 0; //scadjpos.left; //$ix.position().left;
                            sey = parseInt(self.$ppztarget.css("top")) || 0; //scadjpos.top; // $ix.position().top;
                            //                        alert("dragstart....   " + sex + "   " + sey);
                            $ix.on("dragend.pinchpanzoom", mydragendhandler);
                            $ix.on("drag.pinchpanzoom", mydragmovehandler);
                        }
                    }

                }
                catch (ex) {
                    alert("pinchpanzoom.bind.dragstart  " + ex.Message);
                }
            });

        },

        //#endregion

        //#region MakeSwipable

        xswipeevent: "swipe.pinchpanzoom",
        _removeSwipeable: function () {
            this.element.unbind(this.xswipeevent);
        },

        _makeSwipeable: function () {
            var self = this;
            this.element.bind(this.xswipeevent, function (e) {
                try {
//                    prweb.debugsvc.Write("ppz.swipe");
                    e.cancelBubble = true;
                    self.options.scale = 1;
                    self.options.rotation = 0;
                    self.options.isdragged = false;
                    //var tstring = ""; // "translate(0,0)" + " scale(" + scale + ")"; //+ " rotate(" + rot + "deg)";
                    if (self.$ppztarget) {
                        self.$ppztarget.css('-webkit-transform', ''); //css("-webkit-transform", tstring);
                        self.$ppztarget.css("top", "").css("left", "");
                        self.options.isdragged = false;
                    }
                }
                catch (ex) {
                    alert("surveyview.swipegesturehandler reports " + ex.Message);
                }
            });
        },


        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    this._removeTouchTransformable();
                    this._removeTappable();
                    this._removeTouchDraggable();
                    this._removeSwipeable();
                }
                catch (ex) {
                    alert("prweb.pinchpanzoom.dispose reports error " + ex.Message);
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
                alert("prweb.pinchpanzoom.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));


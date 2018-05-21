/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.6.4-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designeritem', {
        options: {
            id: 0,
            myprwT: null,
            hasclickhandler: false,
            iamactive: false,
            hasinactivehandler: false,
            showseditbtn: false,
            isscalable: true,
            isdraggable: true,
            isresizable: true,
            rotation: 0,
            scale: 1,
            isDisposed: false
        },

        //#region Create 

        myclass: "designeritem",
        xevent: "click.designeritem",

        _create: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.designeritem";
            }
            var mymodel = ko.dataFor(this.element[0]);
            if (mymodel.hasOwnProperty("modelcore")) {
                this.options.id = this.element.attr("id");

                // position and size the designeritem when it is created...from its model...don't rely on ko.binding...            

                this.options.scale = mymodel.modelcore.Scale();
                this.options.rotation = mymodel.modelcore.Rotation();
                //                var tstring = "translate(0,0)"; //.css("-webkit-transform", tstring)
                this.element.css("left", mymodel.modelcore.DI_CanvasLeft() + "%")
                            .css("top", mymodel.modelcore.DI_CanvasTop() + "%")
                            .css("width", mymodel.modelcore.DesignerItemWidth() + "%")
                            .css("height", mymodel.modelcore.DesignerItemHeight() + "%")
                            .css("z-index", mymodel.modelcore.DI_CanvasZindex());
                //                var $target = $(".prwgripright", this.element);
                //                if ($target.length == 1) {
                //                    $target.text(mymodel.modelcore.DesignerItemWidth());
                //                }

                this.applyTransform();
                //widgetize the T that is this designeritem's content...also adds device control depending on PrwT....
                this._widgetizePrwT(mymodel.modelcore.presenterT);
                if (mymodel.modelcore.presenterT != "prweditablecontainer") {
                    this._populateHandlers(this.myclass, this.xevent);
                }

            }
            else {
                alert("prweb.designeritem.create  sees mymodel without modelcore...");
            }
            mymodel = null;
        },

        //#endregion

        applyTransform: function () {
            var scale = this.options.scale;
            var rot = this.options.rotation;
            var tstring = "";
            if (rot != 0 || scale != 1) {
                tstring = "translate(0,0)" + " scale(" + scale + ")" + " rotate(" + rot + "deg)";
                var $elem = this.element.children().eq(0);
                $elem.css("transform", tstring)
                     .css("-webkit-transform", tstring)
                     .css("msTransform", tstring);
            }
            tstring = null;
            scale = null;
            rot = null;
        },

        //#region UpdateZindex method...Public...
        updateZindex: function () {
            var mymodel = ko.dataFor(this.element[0]);
            this.element.css("z-index", mymodel.modelcore.DI_CanvasZindex());
            mymodel = null;
        },
        //#endregion

        //#region UpdateModelwithTransform

        updateModelwithTransform: function () {
            var mymodel = ko.dataFor(this.element[0]);
            mymodel.modelcore.Scale(this.options.scale);
            mymodel.modelcore.Rotation(this.options.rotation);
            mymodel = null;
        },

        //#endregion

        //#region UpdateModelwithPosition


        getPosition: function () {
            var rslt = {
                left: 0,
                top: 0
            };
            var mymodel = ko.dataFor(this.element[0]);

            var offParentw = this.element.offsetParent().width();
            var offParenth = this.element.offsetParent().height();
            var xlft = (mymodel.modelcore.DI_CanvasLeft() / 100) * offParentw;
            var xtop = (mymodel.modelcore.DI_CanvasTop() / 100) * offParenth;


            rslt.left = xlft;
            rslt.top = xtop;
            return rslt;
        },

        updateModelwithPosition: function (posleft, postop) {
            //            var self = this;
            try {
                var offParentw = this.element.offsetParent().width();
                var offParenth = this.element.offsetParent().height();
                var maxt = offParenth - this.element.height();
                var toppct = (Math.min(postop, maxt) / offParenth) * 100;
                var maxl = offParentw - this.element.width();
                var leftpct = (Math.min(posleft, maxl) / offParentw) * 100;
                var mymodel = ko.dataFor(this.element[0]);
                mymodel.modelcore.DI_CanvasTop(toppct);
                mymodel.modelcore.DI_CanvasLeft(leftpct);
                this.element.css("left", leftpct + "%")
                                    .css("top", toppct + "%")
                                    .css("cursor", "default");
                mymodel = null;
            }
            catch (ex) {
                alert("designeritem.updateModelwithPosition reports " + ex.Message);
            }
        },

        //#endregion



        //#region UpdateModelwithResize
        resizeEditables: function () {
            var edtbls = $(".prwdesignereditable", this.element);
            if (edtbls.length > 0) {
                for (var i = 0; i < edtbls.length; i++) {
                    prweb.flex.IsEditableOverflow(edtbls[i]);
                };
            }
            edtbls = null;
            return;
        },

        updateModelwithResize: function (posleft, postop, szwidth, szheight) {
            //            var self = this;
            var mymodel = null;
            var toobj = null;
            try {
                var self = this;
                toobj = setTimeout(function () {
                    try {
                        var offParentw = self.element.offsetParent().width();
                        var offParenth = self.element.offsetParent().height();
                        var maxt = offParenth - self.element.height();
                        var toppct = (Math.min(Math.max(postop, 1), maxt) / offParenth) * 100;
                        var maxl = offParentw - self.element.width();
                        var leftpct = (Math.min(Math.max(posleft, 1), maxl) / offParentw) * 100;
                        var maxh = offParenth - Math.max(postop, 1);
                        if (postop < 0) {
                            szheight = szheight + postop;
                        }
                        var heightpct = (Math.min(szheight, maxh) / offParenth) * 100;
                        var maxw = offParentw - Math.max(posleft, 1);
                        if (posleft < 0) {
                            szwidth = szwidth + posleft;
                        }
                        var widthpct = (Math.min(szwidth, maxw) / offParentw) * 100;
                        mymodel = ko.dataFor(self.element[0]);
                        mymodel.modelcore.DI_CanvasTop(toppct);
                        mymodel.modelcore.DI_CanvasLeft(leftpct);
                        mymodel.modelcore.DesignerItemWidth(widthpct);
                        mymodel.modelcore.DesignerItemHeight(heightpct);
                        mymodel = null;
                        self.element.css("left", leftpct + "%")
                            .css("top", toppct + "%")
                            .css("width", widthpct + "%")
                            .css("height", heightpct + "%")
                            .css("cursor", "default");
                        self.resizeEditables();
                    }
                    catch (ex) {
                        alert("designeritem.updateModelwithResize.timeOutinner reports " + ex.Message);
                    }
                    clearTimeout(toobj);
                    self = null;
                }, 200);
            }
            catch (ex) {
                alert("designeritem.updateModelwithResize reports " + ex.Message);
            }
            mymodel = null;
            return;
        },

        //#endregion

        //#region Draggable Resizable
        _makeDraggableResizable: function () {
            var self = this;
            //            var mymodel = ko.dataFor(this.element[0]);
            this.element.draggable({ containment: "parent",
                start: function (e) {
                    e.stopPropagation();
                    var rslt = true; //allow the drag unless..
                    rslt = self._getChildprwT(self.options.myprwT).DragAllowed(); //childprwT can  suspend drag and resize...
                    if (!rslt) {
                        self.element.css("cursor", "default");
                    }
                    else {
                        self.element.css("cursor", "move");
                    }
                    e = null;
                    return rslt;
                },
                stop: function (e, ui) {
                    e.stopPropagation(); //don't do click behavior...
                    self.element.css("cursor", "default");
                    self.updateModelwithPosition(ui.position.left, ui.position.top);
                    e = null;
                    ui = null;
                    return true;
                }
            });
            this.element.resizable({ handles: "all", autoHide: true, containment: "parent",
                stop: function (e, ui) {
                    self.updateModelwithResize(ui.position.left, ui.position.top, ui.size.width, ui.size.height);
                    e = null;
                    ui = null;
                    return true;
                }
            }).on("resize", function (e) {
                e.stopPropagation();
            });
        },
        //#endregion

        //#region DesignerSwipeGesture Handler
        _designerSwipeGesture: function () {
            var self = this;
            var swipeHandler = function (event) {
                switch (true) {
                    case (event.direction == "left"):
                        rslt = prweb.designersvc.NavigateNextPage();
                        if (rslt) {
                            self.element.off("swipe.designeritem", swipeHandler);
                        }
                        break;
                    case (event.direction == "right"):
                        rslt = prweb.designersvc.NavigatePrevPage();
                        if (rslt) {
                            self.element.off("swipe.designeritem", swipeHandler);
                        }
                        break;
                };
                event = null;
                return;
            };
            this.element.on("swipe.designeritem", swipeHandler);
        },
        //#endregion


        //#region populateDeviceControl

        _populateDeviceControl: function () {

            if (prweb.IsTouch) {
                if (this.options.isdraggable) {
                    this._makeTouchDraggable(this);
                }
            }
            else {
                this._makeDraggableResizable();
            }
        },

        //#endregion
        //#region Widgetize PrwT GetChildPrwT, 
        _widgetizePrwT: function (myT) {
            this.options.myprwT = myT;
            switch (true) {
                case (myT == "prweditablecontainer"):
                    this.element.css("left", "0.1em")
                            .css("top", "0.1em")
                            .css("right", "0.1em")
                            .css("bottom", "0.1em")
                            .css("width", "")
                            .css("height", "");
                    $(".prweditablecontainer", this.element).editablecontainer();
                    break;
                case (myT == "prwTIgnatz"):
                    $(".ignatzprwt", this.element).ignatzprwt();
                    this._populateDeviceControl();
                    this.options.showseditbtn = true;
                    break;
                case (myT == "prwTImage"):
                    $(".imageprwt", this.element).imageprwt();
                    this._populateDeviceControl();
                    this.options.showseditbtn = true;
                    break;
                case (myT == "prwTQuestOptionSet"):
                    $(".questoptsetprwt", this.element).questoptsetprwt();
                    this._populateDeviceControl();
                    this.options.showseditbtn = true;
                    break;
                case (myT == "prwTStylablePageContentModel"):
                    if (prweb.IsTouch) {
                        this._designerSwipeGesture();
                        this.options.isdraggable = false;
                        this.options.isscalable = false;
                    }
                    $(".stylablepageprwt", this.element).stylablepageprwt(); //this guy does not get DeviceControl...
                    break;
                case (true):
                    alert("prweb.designeritem.widgetizePrwT.encounterred myT=" + myT);
                    break;
            };
        },



        _getChildprwT: function (myT) {
            var rslt = false;
            switch (true) {
                case (myT == "prweditablecontainer"):
                    rslt = $(".prweditablecontainer", this.element).data("editablecontainer");
                    break;
                case (myT == "prwTIgnatz"):
                    rslt = $(".ignatzprwt", this.element).data("ignatzprwt");
                    break;
                case (myT == "prwTImage"):
                    rslt = $(".imageprwt", this.element).data("imageprwt");
                    break;
                case (myT == "prwTQuestOptionSet"):
                    rslt = $(".questoptsetprwt", this.element).data("questoptsetprwt");
                    break;
                case (myT == "prwTStylablePageContentModel"):
                    rslt = $(".stylablepageprwt", this.element).data("stylablepageprwt");
                    break;
                case (true):
                    alert("prweb.designeritem.getChildprwT.encounterred myT=" + myT);
                    break;
            };
            return rslt;
        },
        //#endregion

        //#region EditButnHandlers

        _unbindEditBtnHandler: function () {
            $("#dsgnreditdonebtn").unbind(this.xevent);
        },

        _populateEditBtnHandler: function (myT) {
            var self = this;
            $("#dsgnreditdonebtn").bind(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                var rslt = true;
                if (self.element.hasClass("editinprogress")) {
                    rslt = false; //?????
                }
                else {
                    e.stopPropagation();
                    self.element.removeClass("activedesigneritem").addClass("editinprogress");
                    prweb.designersvc.PopulateDesignerItemContext(self.options.id);
                    //                    self._getChildprwT(myT).EditStart();
                    var mymodel = ko.dataFor(self.element[0]);
                    prweb.designeritemeditorsvc.InitializeDesignerItemData(mymodel);
                    mymodel = null;
                }
                return false;
            });
        },

        //#endregion

        //#region MakeActive InActive...
        _makeActive: function () {
            try {
                var activedi = $(".activedesigneritem, .editinprogress");
                if (activedi.length == 1) {
                    activedi.data("designeritem")._makeInActive();
                }
                activedi = null;
                this.options.iamactive = true;
                prweb.designersvc.PopulateDesignerItemContext(this.options.id);
                this.element.removeClass("notactivedesigneritem").addClass("activedesigneritem");
                if (this.options.showseditbtn) {
                    this.element.append(prweb.designersvc.donebtn);
                    this._populateEditBtnHandler(this.options.myprwT);
                }
                if (prweb.IsTouch) {
                    if (this.options.isscalable) {
                        this._makeTouchTransformable(this.element);
                    }
                    if (this.options.isresizable) {
                        this._makeTouchResizable(this.element);
                    }
                }
            }
            catch (ex) {
                alert("di.makeActive reports " + ex.Message);
            }

            return true;
        },

        _makeInActive: function () {
            try {
                this.options.iamactive = false;
                if (this.element.hasClass("editinprogress")) {
                    this._getChildprwT(this.options.myprwT).EditEnd();
                    this.element.removeClass("activedesigneritem").addClass("notactivedesigneritem");
                }
                prweb.designersvc.PopulateDesignerItemContext(false);
                this.element.removeClass("activedesigneritem");
                if (this.options.showseditbtn) {
                    $("#dsgnreditdonebtn").unbind(this.xevent).remove();
                }
                if (prweb.IsTouch) {
                    if (this.options.isscalable) {
                        this._removeTouchTransformable(this.element);
                    }
                    if (this.options.isresizable) {
                        this._removeTouchResizable(this.element);
                    }
                }
            }
            catch (ex) {
                alert("di.makeInActive reports " + ex.Message);
            }

            return true;
        },

        //#endregion

        //#region populateHandlers on Create...
        _populateHandlers: function (myclass, xevent) {
            var self = this;
            if (!this.options.hasclickhandler) {
                this.element.on(xevent, function (e) {
                    try {
                        e.preventDefault();
                        var rslt = self._getChildprwT(self.options.myprwT).AllowClick();
                        if (rslt) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.cancelBubble = true;
                            if (!$(e.target).is('.ui-resizable-handle') && !$(e.target).is('#myta')) {
                                e = null;
                                if (!self.options.iamactive) {
                                    self._makeActive();
                                }
                                else {
                                    prweb.designersvc.PopulateDesignerItemContext(false);
                                    self._makeInActive(); ;
                                }
                            }
                        }
                    }
                    catch (ex) {
                        alert("prweb.designeritem.xeventhandler reports " + ex.Message);
                    }
                    return false; //rslt; //should be return false...
                });
                this.options.hasclickhandler = true;
            }

            return true;
        },

        //#endregion


        //#region setTransform
        _makeSizeFromScale: function () {

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
                        this.options.scale = tform.scale;
                        this._isScaling = true;
                        this._isRotating = false;
                        //                        tstring = ' scale(' + scale + ')';
                        break;
                    case (Math.abs(tform.rotation) > 1 && !this._isScaling):
                        this.options.rotation = tform.rotation;
                        this._isRotating = true;
                        this._isScaling = false;
                        //                        tstring = ' rotate(' + rot + 'deg)';
                        break;
                }
                this.applyTransform();
                //                rot = this.options.rotation;
                //                scale = this.options.scale;
                //                if (rot != 0 || scale != 1) {
                //                    //                    var rot = tform.rotation; //this.options.rotation++;
                //                    //                    var scale = tform.scale || 1;
                //                    tstring = 'translate(0,0)' + ' scale(' + scale + ')' + ' rotate(' + rot + 'deg)';
                //                    //set the transform on the designeritem's first child....
                //                    this.element.children().eq(0).css("-webkit-transform", tstring);
                //                    //                alert(tstring);
                //                }

            }
            catch (ex) {
                alert("designeritem.setTransform reports " + ex.Message);
            }
            //            alert("set scale and rotation");'translate3d(0, 0, 0)' + ' scale(' + this.options.scale + ')' +
        },

        //#endregion

        //#region makeTouchTransformable

        _removeTouchTransformable: function ($ix) {
            $ix.off("omniscalestart.designeritem");
            $ix.off("omniscale.designeritem");
            $ix.off("omniscaleend.designeritem");
            this._isScaling = false;
            this._isRotating = false;
        },
        _makeTouchTransformable: function ($ix) {
            //omniscalestart
            var self = this;
            var istformstart = false;
            var mymodel = false;
            var myscale = 1;
            var myrot = 0;
            var myomniscalemovehandler = function (event) {
                if (istformstart) {
                    try {
                        self._setTransform(event);
                    }
                    catch (ex) {
                        alert("designeritem.omniscalemove reports " + ex.Message);
                    }
                }
            };
            var myomniscaleendhandler = function (event) {
                try {
                    //                    alert("sees omniscale end");
                    $ix.off("omniscale.designeritem", myomniscalemovehandler);
                    $ix.off("omniscaleend.designeritem", myomniscaleendhandler);
                    self.updateModelwithTransform();
                    istformstart = false;
                }
                catch (ex) {
                    alert("designeritem.omniscaleend reports " + ex.Message);
                }
                finally {
                    //                    alert("sees omniscale end finally");

                    //                    mymodel = null;
                    istformstart = false;
                    self._isScaling = false;
                    self._isRotating = false;
                    //                    alert("before maketouch draggable");
                    if (self.options.isdraggable) {
                        self._makeTouchDraggable(self);
                    }

                    //                    alert("did maketouch draggable");
                };
            };
            //            alert("di add omniscalestart handler");
            $ix.on("omniscalestart.designeritem", function (event) {
                try {
                    event.cancelBubble = true;
                    //                    alert("di sees omniscalestart");
                    if (!istformstart) {
                        istformstart = true;
                        self._isScaling = false;
                        self._isRotating = false;
                        self._removeTouchDraggable($ix);
                        $ix.on("omniscaleend.designeritem", myomniscaleendhandler);
                        $ix.on("omniscale.designeritem", myomniscalemovehandler);
                    }
                    //                    else {
                    //                        istformstart = false;
                    //                    }
                }
                catch (ex) {
                    alert("designeritem.omniscalestart reports " + ex.Message);
                }
            });
        },

        //#endregion

        //#region TouchResizable

        isResizing: false,

        _removeTouchResizable: function ($ix) {
            try {
                var gripright = $(".prwgripright", $ix);
                var gripbottom = $(".prwgripbottom", $ix);
                if (gripright.length == 1) {
                    gripright.off("dragstart.designeritem");
                    gripright.off("drag.designeritem");
                    gripright.off("dragend.designeritem");
                    gripright.remove();
                }
                if (gripbottom.length == 1) {
                    gripbottom.off("dragstart.designeritem");
                    gripbottom.off("drag.designeritem");
                    gripbottom.off("dragend.designeritem");
                    gripbottom.remove();
                }


                gripright = null;
                gripbottom = null;
            }
            catch (ex) {
                alert("di.removeTouchResizable reports " + ex.Message);
            }
        },

        _makeTouchResizable: function ($ix) {
            var self = this;
            var isright = false;
            var isbottom = false;
            var sew = 0;
            var seh = 0;
            var sepos = null;
            var grpx = 0;
            var grpy = 0;
            var dltaX = 0;
            var dltaY = 0;
            var resizemovehandler = function (event) {
                try {
                    event.cancelBubble = true;
                    var xpix = 0; // +"px"
                    switch (true) {
                        case (isright):
                            xpix = (sew + event.position.left);
                            $ix.css("width", xpix + "px");
                            break;
                        case (isbottom):
                            xpix = (seh + event.position.top);
                            $ix.css("height", xpix + "px");
                            break;
                    }
                }
                catch (ex) {
                    alert("di.resizemovehandler reports " + ex.Message);
                }
                finally {
                }
            };
            var resizeendhandler = function (event) {
                var $targetend = null;
                try {
                    event.cancelBubble = true;
                    var sw = $ix.width();
                    var sh = $ix.height();
                    self.updateModelwithResize(sepos.left, sepos.top, sw, sh);
                    switch (true) {
                        case (isright):
                            $targetend = $(".prwgripright", $ix);
                            break;
                        case (isbottom):
                            $targetend = $(".prwgripbottom", $ix);
                            break;
                    }
                    isbottom = false;
                    isright = false;
                    if ($targetend.length == 1) {
                        $targetend.off("drag.designeritem", resizemovehandler);

                        $targetend.off("dragend.designeritem", resizeendhandler);
                        //update modelwithResize attributes...
                    }
                }
                catch (ex) {
                    alert("di.resizeendhandler reports " + ex.Message);
                }
                finally {
                    if ($targetend.length == 1) {
                        $targetend.css("background", "hsla(22,100%,39%,0.4)");
                    }
                }
            };

            try {
                $(".prwgrip", $ix).css("display", "");
                var gripright = $(".prwgripright", $ix);
                var gripbottom = $(".prwgripbottom", $ix);
                if (gripright.length == 1) {
                    gripright.on("dragstart.designeritem", function (event) {
                        event.cancelBubble = true;
                        self.isResizing = true;
                        isright = true;
                        isbottom = false;
                        sepos = self.getPosition(); //$ix.position();
                        var $target = $(".prwgripright", $ix);
                        $target.css("background", "hsla(22,100%,39%,0.8)");
                        var pos = $target.position();
                        grpx = pos.left;
                        grpy = pos.top;
                        pos = null;
                        sew = $ix.width();
                        seh = $ix.height();
                        $target.on("dragend.designeritem", resizeendhandler);
                        $target.on("drag.designeritem", resizemovehandler);
                        $target = null;
                        event = null;
                    });
                }
                if (gripbottom.length == 1) {
                    gripbottom.on("dragstart.designeritem", function (event) {
                        event.cancelBubble = true;
                        self.isResizing = true;
                        isbottom = true;
                        isright = false;
                        sepos = self.getPosition(); //$ix.position();
                        var $target = $(".prwgripbottom", $ix);
                        $target.css("background", "hsla(22,100%,39%,0.8)");
                        var pos = $target.position();
                        grpx = pos.left;
                        grpy = pos.top;
                        pos = null;
                        sew = $ix.width();
                        seh = $ix.height();
                        $target.on("dragend.designeritem", resizeendhandler);
                        $target.on("drag.designeritem", resizemovehandler);
                    });
                }
            }
            catch (ex) {
                alert("di.makeTouchResizable reports " + ex.Message);
            }
        },

        //#endregion

        //#region makeTouchDraggable
        _removeTouchDraggable: function ($ix) {
            var $ixchild = $(".ditouchdragobj", $ix);
            $ixchild.off("dragstart.designeritem");
            $ixchild.off("drag.designeritem");
            $ixchild.off("dragend.designeritem");
        },

        //        _adjustPositionForScale: function (pleft, ptop, scale, rot, sex, sey) {
        //            var asex = 0; //(pleft - sex);
        //            var asey = 0; // (ptop - sey);
        //            var rslt = 'translate(' + asex + 'px,' + asey + 'px)' + ' scale(' + scale + ')' + ' rotate(' + rot + 'deg)';
        //            if (scale != 1 || rot != 0) {
        //                rslt = 'translate(' + asex + 'px,' + asey + 'px)' + ' scale(' + scale + ')' + ' rotate(' + rot + 'deg)';
        //            }
        //            return rslt;
        //        },

        _makeTouchDraggable: function (myself) {
            var self = myself;
            var $ix = self.element;
            var $ixchild = $(".ditouchdragobj", $ix);
            var mymodel = ko.dataFor($ix[0]);
            var isdragstart = false;
            var sex = 0;
            var sey = 0;
            var curX = 0;
            var curY = 0;
            var mydragmovehandler = function (event) {
                //                alert("sees drag move");
                event.stopPropagation();
                try {
                    //                    var scadjpos = self._adjustPositionForScale(event.position.left, event.position.top, self.options.scale);
                    curX = sex + event.position.left; // scadjpos.left; //event.position.left;
                    curY = sey + event.position.top; // scadjpos.top; // event.position.top;
                    $ix.css("top", ((curY * 1) + 0) + "px");
                    $ix.css("left", ((curX * 1) + 0) + "px");
                }
                catch (ex) {
                    alert("di.mydragmovehandler reports " + ex.Message);
                }
            };
            var mydragendhandler = function (event) {
                try {
                    $ixchild.off("drag.designeritem", mydragmovehandler);
                    //                    $ix.css("-webkit-transform", "translate(0,0)");
                    //                    var pos = $ix.position();
                    //                    var scadjpos = self._adjustPositionForScale(pos.left, pos.top, self.options.scale);
                    var iposleft = parseInt($ix.css("left")); //scadjpos.left; //$ix.position().left;
                    var ipostop = parseInt($ix.css("top")); //scadjpos.top; // $ix.position().top;
                    //                    self.updateModelwithPosition(pos.left, pos.top);
                    self.updateModelwithPosition(iposleft, ipostop);

                    pos = null;
                }
                catch (ex) {
                    isdragstart = false;
                    alert("di.dragendhandler reports  " + ex.Message);
                }
                finally {
                    $ixchild.off("dragend.designeritem", mydragendhandler);
                    isdragstart = false;
                }
            };
            //            if (self.options.myprwT !== "prwTStylablePageContentModel") {
            $ixchild.on("dragstart.designeritem", function (event) {
                try {
                    event.cancelBubble = true;
                    if (!isdragstart) {
                        //                        var pos = $ix.position();

                        //                        sex = pos.left; //scadjpos.left; //$ix.position().left;
                        //                        sey = pos.top; //scadjpos.top; // $ix.position().top;
                        var pos = self.getPosition();
                        sex = pos.left; //parseInt($ix.css("left")); //scadjpos.left; //$ix.position().left;
                        sey = pos.top; //parseInt($ix.css("top")); //scadjpos.top; // $ix.position().top;
                        isdragstart = true;
                        $ixchild.on("dragend.designeritem", mydragendhandler);
                        $ixchild.on("drag.designeritem", mydragmovehandler);
                    }
                }
                catch (ex) {
                    alert("di.bind.dragstart  " + ex.Message);
                }
            });
            //            }

            //            alert("sees makeTouchSensitive");
        },

        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    this._makeInActive();
                    switch (true) {
                        case (prweb.IsTouch):
                            this.element.off("tap.designeritem");
                            if (this.options.myprwT == "prwTStylablePageContentModel") {
                                this.element.off("swipe.designeritem");
                                //                                alert("swipe disposed");
                            }
                            else {
                                this.element.off("dragstart.designeritem");
                            }
                            break;
                        case (!prweb.IsTouch):
                            if (this.element.data("resizable")) {
                                this.element.resizable("destroy").off("resize");
                            }
                            if (this.element.data("draggable")) {
                                this.element.draggable("destroy");
                            }
                            break;
                    }
                    this.element.off(this.xevent);

                    $(".designeritem", this.element).unbind().html("").remove();
                    this._getChildprwT(this.options.myprwT).dispose();
                    this.options.myprwT = null;
                }
                catch (ex) {
                    alert("prweb.designeritem.dispose reports error " + ex.Message);
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
                alert("prweb.designeritem.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }

        //#endregion
    });
} (this.prweb, jQuery));
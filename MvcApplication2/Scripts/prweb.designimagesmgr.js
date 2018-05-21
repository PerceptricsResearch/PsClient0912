/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designimagesmgr', {
        //#region Options and Create
        options: {

        },

        _hasImgRemoveMarkers: false,
        _hasBrowseandPasteControl: false,
        _hasOpacityControl: false,

        xevent: "click.designimagesmgr",

        _create: function () {
            var myclass = "designimagesmgr";
            if (prweb.IsTouch) {
                this.xevent = "tap.designimagesmgr";
            }
            // viewmodel is populated by designerhome.sendRequest.success.js...calls imagesmgrssvc.populateVmx()
            prweb.imagesmgrsvc.populateVmx();
            var myDOMNode = $("#dsgnrimagesavailablelist")[0];
            ko.applyBindings(prweb.imagesmgrsvc.Vmx, myDOMNode);
            myDOMNode = null;

            this._populateBackMoreBtns(myclass, this.xevent);
            this._populateAddRemoveBtns(myclass, this.xevent);
            this._populateimagesinputbrowsehandler();
            this._populateSaveImageBtnHandler();
            this._populateUploadTargetLoadHandler();
            this._populatedsgnrimagesinputurlelementhandler();
            this._subscribeToVSMEvents();

            this._showOpacityControl();
            this._setUpOpacityTouchable();
            this._populateOpacityBtns(myclass, this.xevent);
            this.touchAble.LastIndx();
        },
        //#endregion

        //#region TouchableOpacity Implementation
        publishSelectedValue: function (opacityrslt) {
            prweb.designersvc.ImageOpacityChange(opacityrslt);
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
            this.touchAble.LastIndx(); //initializes position of touchable...
        },

        //#endregion

        //#region OpacitySpinnerControl

        retrieveOpacity: function () {
            return this.touchAble.SelectedValue();
        },
        _setUpOpacityTouchable: function () {
            this.populateTouchable($("#imagesspinnernumeric"));
        },

        _populateOpacityBtns: function (myclass, xevent) {
            var selftouchable = this.touchAble;
            $("#dimagesrectbackbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                var sizerslt = selftouchable.MovePrev();
                return false;
            });
            $("#dimagesrectmorebtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                var sizerslt = selftouchable.MoveNext();
                return false;
            });
            myclass = null;
            xevent = null;
        },


        //#endregion

        //#endregion

        //#region OpacityControl show hide 
        _hideOpacityControl: function () {
            $("#dsgnimgopacitycntrl").css("display", "none");
            this._hasOpacityControl = false;
        },

        _showOpacityControl: function () {
            $("#dsgnimgopacitycntrl").css("display", "inline-block");
            this._hasOpacityControl = true;
            if (this.touchAble) {
                this.touchAble.LastIndx();
            }
        },
        //#endregion

        //#region Browse and Paste Control hide show
        _hideBrowseandPasteControl: function () {
            $("#dsgnimgbrowseandpastecntrl").css("display", "none");
            this._hasBrowseandPasteControl = false;
        },

        _showBrowseandPasteControl: function () {
            $("#dsgnimgbrowseandpastecntrl").css("display", "inline-block");
            this._hasBrowseandPasteControl = true;
        },
        //#endregion

        //#region ImgRemoveMarkers hide show
        _hideImgRemoveMarkers: function () {
            $(".dsgnimgremovablemarker", this.element).attr("visibility", "hidden");
            $(".dsgnimgclickable", this.element).removeClass("removingimage");
            this._hasImgRemoveMarkers = false;
        },

        _showImgRemoveMarkers: function () {
            $(".dsgnimgremovablemarker", this.element).attr("visibility", "visible");
            $(".dsgnimgclickable", this.element).addClass("removingimage");
            this._hasImgRemoveMarkers = true;
        },
        //#endregion

        //#region Add and Remove Btns
        _populateAddRemoveBtns: function (myclass, xevent) {
            var self = this;
            $("#dsgnrimgnoimagebtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                prweb.designersvc.MakeNoImage();
                return false;
            });
            $("#dsgnrimgAddbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                if (self._hasImgRemoveMarkers) {
                    self._hideImgRemoveMarkers();
                }
                //show the browse files and paste urls complex
                if (self._hasBrowseandPasteControl) {
                    self._hideBrowseandPasteControl();
                    self._showOpacityControl();
                }
                else {
                    self._hideOpacityControl();
                    self._showBrowseandPasteControl();
                }
                return false;
            });
            $("#dsgnrimgRemovebtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                self._hideBrowseandPasteControl();

                if (self._hasImgRemoveMarkers) {
                    self._hideImgRemoveMarkers();
                    self._showOpacityControl();
                }
                else {
                    //show the remove objects on each of the img thumbnails...
                    self._showImgRemoveMarkers();
                    self._hideOpacityControl();
                }

                return false;
            });
        },
        //#endregion

        //#region UploadTargetLoadHandler
        _populateUploadTargetLoadHandler: function () {
            //            var self = this;
            $("#dsgnrimagesuploadtarget").addClass("designimagesmgr").bind("load.designimagesmgr", function (e) {
                var thething = $("#dsgnrimagesuploadtarget").contents().find("#uploadedjsonresult").text();
                if (thething) {
                    var imgpath = $.parseJSON(thething).ImagePath;
                    prweb.imagesmgrsvc.AddGuidStr(imgpath);
                    imgpath = null;
                }
                e = null;
                thething = null;
                return true;
            });
            //            this.options.dsgnrimagesuploadtarget = null;
        },

        //#endregion

        //#region Browse and SaveImage Handler
        _populateimagesinputbrowsehandler: function () {
            //            var self = this;
            //            var xstr = null;
            //            self.options.dsgnrimagesinputbrowseelement.change(function (eventparms, data) {
            //                if (window.File && window.FileReader && window.FileList && window.Blob) {
            //                    // Great success! All the File APIs are supported.
            //                    var myfiles = self.options.dsgnrimagesinputbrowseelement[0].files;
            //                    //                    myfiles = eventparms.target.files;
            //                    if (myfiles) {
            //                        if (myfiles[0]) {
            //                            xstr = myfiles[0].fileName;
            //                        }
            //                    }
            //                } else {
            //                    //                    alert('The File APIs are not fully supported in this browser.');
            //                    xstr = self.options.dsgnrimagesinputbrowseelement.val();
            //                }


            //                if (xstr) {
            //                    prweb.designersvc.ImageURIChangedHandler(xstr);
            //                    //                    self.options.canvasimageobj.src = xstr;
            //                }
            //            });
        },
        _populateSaveImageBtnHandler: function () {
            //            var self = this;
            $("#dsgnrimagessaveimagebtn").addClass("designimagesmgr").bind("click.designimagesmgr", function () {
                $("#dsgnrimagesimgform").submit();
                return true;
            });
            //            this.options.dsgnrimagessaveimagebtn = null;
        },

        //#endregion

        //#region Paste Change Handler
        _populatedsgnrimagesinputurlelementhandler: function () {
            //            var self = this;
            $("#dsgnrimagesinputurlelement").addClass("designimagesmgr").bind("change.designimagesmgr", function (eventparms) {
                var xstr = $("#dsgnrimagesinputurlelement").val();
                if (xstr) {
                    prweb.designersvc.ImageURIChangedHandler(xstr);
                    xstr = null;
                    //                    self.options.canvasimageobj.src = xstr;
                }
                eventparms = null;
                return true;
            });
            //            this.options.dsgnrimagesinputurlelement = null;
        },


        //#endregion

        //#region Back and More Btns

        _populateBackMoreBtns: function (myclass, xevent) {
            var self = this;
            $("#dsgnrimgbackbtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                prweb.imagesmgrsvc.MoveToImgVPagePrev();
                if (self._hasImgRemoveMarkers) {
                    self._showImgRemoveMarkers();
                }
                else {
                    self._hideImgRemoveMarkers();
                }
                return false;
            });
            $("#dsgnrimgmorebtn").addClass(myclass).bind(xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e = null;
                prweb.imagesmgrsvc.MoveToImgVpageNext();
                if (self._hasImgRemoveMarkers) {
                    self._showImgRemoveMarkers();
                }
                else {
                    self._hideImgRemoveMarkers();
                }
                return false;
            });
        },

        //#endregion

        //#region Open and Close Animation for AppBar Images Button
        isDocked: true,

        _myDesignImagesBtnClick: function () {
            //            var le = $("#designimagesmgrcontainer");
            if (!this.isDocked) {
                $("#designimagesmgrcontainer").stop(true, false).animate({ width: 0},
                 { duration: 300, easing: 'easeInQuad', complete: function () {
                     $("#designimagesmgrcontainer").css("overflow", "hidden").css("height", 0);
                     return;
                 }
                 });
                this.isDocked = true;
            }
            else {
                if (this.isDocked) {
                    if (prweb.imagesmgrsvc.CurrentPageNumber == 0) {
                        prweb.imagesmgrsvc.MoveToImgVPage(1);
                    }
                    $("#designimagesmgrcontainer").css("overflow", "").css("height", "auto").removeClass("prwslideouthide").stop(true, false).animate({ width: "100%" });
                    this.touchAble.LastIndx();
                    this.isDocked = false;
                }
            }
            prweb.designerpanelsmgr.ReportIsDocked("designimagesmgr", this.isDocked);
            return true;
        },

        _moveToVisualStateDesignImagesMgrBtnClick: function () {
            this._myDesignImagesBtnClick();
            return true;
        },

        _myCloseList: function () {
            //            var le = null;
            if (!this.isDocked) {
                //                le = $("#designimagesmgrcontainer");
                $("#designimagesmgrcontainer").css("overflow", "hidden").stop(true, false).animate({ width: 0},
                 { duration: 300, easing: 'easeInQuad', complete: function () {
                     $("#designimagesmgrcontainer").css("overflow", "hidden").css("height", 0);
                     return;
                 }
                 });
                this.isDocked = true;
                prweb.designerpanelsmgr.ReportIsDocked("designimagesmgr", this.isDocked);
            }
            //            le = null;
            return true;
        },

        _moveToVisualStateCloseList: function () {
            this._myCloseList();
            return true;
        },

        //#endregion

        //#region VSM Events Subscriptions
        _surveyOpenedHandler: function () {
            //            prweb.surveymetadatasvc.OpenSurvey();
        },

        _surveyClosedHandler: function () {
            //            prweb.surveymetadatasvc.CloseSurvey();
            //            this._moveToVisualStateCloseList();
        },
        _subscribeToVSMEvents: function () {
            $("#prwdesignimagesmgrbtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.pubsub.publish(prweb.events.subscriberplatform.prwdesignimagesmgrbtn);
                return false;
            });
           
            var pss = prweb.pubsub.subscribe;
            pss(prweb.events.subscriberplatform.prwdesignimagesmgrbtn, this._moveToVisualStateDesignImagesMgrBtnClick, this);
            //            pss(prweb.events.appsvc.surveycontextchanged, this._moveToVisualStateCloseList, this);
            //            prweb.pubsub.subscribe(prweb.events.subscriberplatform.surveyopened, this._surveyOpenedHandler, this);
            //            prweb.pubsub.subscribe(prweb.events.subscriberplatform.surveyclosed, this._surveyClosedHandler, this);
            //            pss(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateCloseList, this);
            //            pss(prweb.events.subscriberplatform.pagesbtnclick, this._moveToVisualStateCloseList, this);
            pss = null;
        },

        //#endregion

        //#region Dispose and Destroy

        dispose: function () {
            try {

                var psu = prweb.pubsub.unsubscribe;
                psu(prweb.events.subscriberplatform.prwdesignimagesmgrbtn, this._moveToVisualStateDesignImagesMgrBtnClick, this);
                psu(prweb.events.appsvc.surveycontextchanged, this._moveToVisualStateCloseList, this);
                //            prweb.pubsub.subscribe(prweb.events.subscriberplatform.surveyopened, this._surveyOpenedHandler, this);
                //            prweb.pubsub.subscribe(prweb.events.subscriberplatform.surveyclosed, this._surveyClosedHandler, this);
                psu(prweb.events.subscriberplatform.actionsbtnclick, this._moveToVisualStateCloseList, this);
                psu(prweb.events.subscriberplatform.pagesbtnclick, this._moveToVisualStateCloseList, this);
                psu = null;
                //                var iclbl = $(".imgsvcclickable", this.element).unbind('click');
                //                iclbl = null;
                //                prweb.imagesmgrsvc.Shutdown();
                //                this.options.dsgnrimagesinputbrowseelement = null;
                //                this.options.dsgnrimagesimgform = null;
                //                this.options.dsgnrimagessaveimagebtn = null;
                //                this.options.dsgnrimagesinputurlelement = null;
                //                this.options.dsgnrimagesuploadtarget = null;
                $(".designimagesmgr", this.element).unbind().html("").remove();
                this.touchAble.Dispose();
                this.touchAble = null;
                var dmn = $("#dsgnrimagesavailablelist")[0];
                ko.cleanNode(dmn);
                //                this.options.myDOMNode = null;
                //                dmn.remove();
                dmn = null;
                $("#dsgnrimagesavailablelist").remove();
                //                
                prweb.imagesmgrsvc.Shutdown();
                //                ko.cleanNode(this.options.myDOMNode);


                //                this.options.myDOMNode = null;
                //                $("#dsgnrimgbackbtn").remove();
                //                $("#dsgnrimgmorebtn").remove();
                //                this.options.dsgnrimagesinputbrowseelement = null;
                ////                this.options.dsgnrimagesimgform.unbind().remove();
                //                this.options.dsgnrimagesimgform = null;
                ////                this.options.dsgnrimagessaveimagebtn.unbind("click").remove();
                ////                this.options.dsgnrimagesinputurlelement.unbind("change").remove();
                ////                this.options.dsgnrimagesuploadtarget.unbind("load").remove();
                //                this.options.dsgnrimagessaveimagebtn = null;
                //                this.options.dsgnrimagesinputurlelement = null;
                //                this.options.dsgnrimagesuploadtarget = null;
                //                this.options.medetached = null;
                //                this.options.myDOMNode = null;
                //                this.options.melayoutElement = null;
                //                this.options.appendto = null;
                //                this.element.unbind().empty().remove();
                //                this.element.empty();
            }
            catch (e) { alert("prweb.designimagesmgr.dispose reports error..."); }
            finally {
                //                return true;
                //                this.destroy();
            };
        },

        destroy: function () {
            //            this._dispose();
            $.Widget.prototype.destroy.call(this);
            //            this.element = null;
        }

        //#endregion

        //end of widget defn...
    });
} (this.prweb, jQuery));
(function (prweb, $) {
    $.widget('prweb.rddomainplayer', {

        //#region Options
        options: {
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion

        playersvc: false,

        //#region Create
        xevent: "click.rddomainplayer",

        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.rddomainplayer";
                }

                this._populateBtnHandler();
            }
            catch (ex) {
                alert("prweb.rddomainplayer.create reports " + ex.Message);
            }
        },
        //#endregion

        //#region populatePrevNextBtnHandlers
        _populatePrevNextBtnHandlers: function () {
            var self = this;
            this.playersvc.scrollapi.prwnxtbtn.on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                self.playersvc.navigateNext();
                return false;
            });
            this.playersvc.scrollapi.prwprevbtn.on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                prweb.showClick(this);
                self.playersvc.navigatePrev();
                return false;
            });
        },
        //#endregion

        //#region myBtnClick and panel animation
        isDocked: true,
        animwidthzero: { width: 0 },
        animwidthwide: { width: "240px" },
        animdur: { duration: 300, easing: 'easeInQuad' },

        _mybtnclick: function (domain) {
            //            $("#rddomainplayeritems").clearQueue().stop(true, false).css("left", 0);
            //            $("#rddomainplayerscrollable").clearQueue().stop(true, false).scrollLeft(0);
            if (!this.isDocked) {

                $("#rddomainpanel").css("overflow", "hidden");
                $("#rddomainpanel").clearQueue().stop(true, false).animate(this.animwidthzero, { duration: 300, easing: 'easeInQuad' });
                this.isDocked = true;
            }
            //            prweb.panelsmgr.ReportIsDocked("navpanel", this.isDocked);
            return;
        },

        _showDomainPlayer: function (domain) {
            $("#rddomainplayeritems").clearQueue().stop(true, false).css("left", 0);
            //            $("#rddomainplayerscrollable").clearQueue().stop(true, false).scrollLeft(0);
            if (this.isDocked) {
                var self = this;

                $("#rddomainpanel").clearQueue().stop(true, false)
                                       .removeClass("prwslideouthide")
                                       .animate(this.animwidthwide, { duration: 300, easing: 'easeInQuad', complete: function () {
                                           try {
                                               self.isDocked = false;
                                               //                                               $("#rddomainpanel").stop(true, true);
                                               //                                               $("#rddomainpanel").css("overflow", "auto");
                                               if (self.playersvc == false) {
                                                   self.playersvc = prweb.domainplayersvc.NewPlayerSvc($("#domainplayerrootcontainer"));
                                                   self.playersvc.setUpScrollApi({
                                                       konode: ".domainplayercontainer",
                                                       next: "#rddomainplayernext",
                                                       prev: "#rddomainplayerprev",
                                                       container: "#rddomainplayercontainer",
                                                       panelscrollable: "#rddomainplayerscrollable",
                                                       items: "#rddomainplayeritems",
                                                       pagecontent: "#rddomainplayercontent"
                                                    });
                                                   self._populatePrevNextBtnHandlers();
                                               }
                                               //                                               var domain = $(this).attr("data-prwebdomain");
                                               if (domain) {
                                                   self.playersvc.RetrieveDomainPageZero(domain);
                                               }

                                           }
                                           catch (ex) {
                                               alert("prweb.rddomainplayer.animate complete reports error " + ex.Message);
                                           }
                                           return;
                                       }
                                       });
            }
            else {
                if (domain) {
                    this.playersvc.RetrieveDomainPageZero(domain);
                }
            }
            return;
        },
        _populateBtnHandler: function () {
            var self = this;
            $(".dpbtn", "#rdactionslistitemscontainer").on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.cancelBubble = true;
                    e.stopPropagation();
                    var domain = $(this).attr("data-prwebdomain");
                    self._showDomainPlayer(domain);
                }
                catch (ex) {
                    alert("prweb.rddomainplayer.dpbtn reports error " + ex.Message);
                }

                return false;
            });
            $("#rddomaindonebtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                e.stopPropagation();
                self._mybtnclick(false);
                return false;
            });
        },
        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    this.playersvc.scrollapi.prwnxtbtn.off(this.xevent);
                    this.playersvc.scrollapi.prwprevbtn.off(this.xevent);
                    $(".dpbtn", "#rdactionslistitemscontainer").off(this.xevent);
                    $("#rddomaindonebtn").off(this.xevent);
                    this.playersvc.Dispose();
                    this.playersvc = null;
                }
                catch (ex) {
                    alert("prweb.rddomainplayer.dispose reports error " + ex.Message);
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
                alert("prweb.rddomainplayer.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }
        //#endregion
    });
} (this.prweb, jQuery));
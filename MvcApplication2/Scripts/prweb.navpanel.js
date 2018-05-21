(function (prweb, $) {

    $.widget('prweb.navpanel', {
        options: {
            isDisposed: false
        },

        xevent: "click.navpanel",

        _create: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.navpanel";
            }
            this._widgetizeNavtiles();
            this._subscribeToVSMEvents();
            prweb.panelsmgr.ReportIsDocked("navpanel", this.isDocked);
            var self = this;
            $("#prwactionsbtn").on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    e = null;
                    self._myActionsbtnclick();
                    //                    prweb.pubsub.publish(prweb.events.subscriberplatform.actionsbtnclick);
                    
                }
                catch (ex) {
                    alert("prweb.subscriberplatform.actionsbtnclick reports error..." + ex.Message);
                    ex = null;
                }
                return false;
            });
            //            $(".scrollablenavpanel", this.element).scroller({
            //                vertical: true,
            //                mousewheel: true,
            //                items: ".navpanelitems",
            //                item: ".navtile",
            //                prev: ".prevnavpanel",
            //                next: ".nextnavpanel"
            //            });
        },

        isDocked: true,

        _widgetizeNavtiles: function () {
            $('div[data-prwtype=navtile]', this.element).navtile();
            return true;
        },

        animwidthzero: { width: 0 },
        animwidthwide: { width: "14em" },
        animdur: { duration: 300, easing: 'easeInQuad' },
        isDocked: false,

        _myActionsbtnclick: function () {
            if (!this.isDocked) {
                this.element.stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
            }
            else {
                if (this.isDocked) {
                    this.element.stop(true, false).animate(this.animwidthwide);
                    this.isDocked = false;
                }
            }
            prweb.panelsmgr.ReportIsDocked("navpanel", this.isDocked);
//            try {
//                prweb.designerpanelsmgr.ReportIsDocked("navpanel", this.isDocked);
//            }
//            catch (ex) {
//                // don't care...
//            }
            return true;
        },

        _myCloseList: function () {
            if (!this.isDocked) {
                this.element.stop(true, false).animate(this.animwidthzero, this.animdur);
                this.isDocked = true;
                prweb.panelsmgr.ReportIsDocked("navpanel", this.isDocked);
            }
            return true;
        },

        _moveToVisualStateActionsBtnClick: function () {
            this._myActionsbtnclick();
            return true;
        },

        _moveToVisualStateCloseList: function () {
            this._myCloseList();
            return true;
        },

        //VSM handler will apply css classes to implement various visual attributes associated with the particular VisualState….
        _subscribeToVSMEvents: function () {
//            var ps = prweb.pubsub.subscribe;
//            ps(prweb.events.appsvc.appcontextchanged, this._moveToVisualStateCloseList, this);
//            ps = null;
            return true;
        },

        dispose: function () {
            if (!this.options.isDisposed) {
                try {
//                    var ps = prweb.pubsub.unsubscribe;
//                    ps(prweb.events.appsvc.appcontextchanged, this._moveToVisualStateCloseList, this);
//                    ps = null;
                    $("#prwactionsbtn").off(this.xevent);
                }
                catch (ex) {
                    alert("prweb.navpanel.dispose reports error " + ex.Message);
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
                alert("prweb.navpanel.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }

    });

} (this.prweb, jQuery));
(function (prweb, $) {

    // pagescount....if pagescount was available for each survey(without having to retrieve the pages...) we could support a really quick image based view of any survey...


    $.widget('prweb.rdentsurveypageslist', {

        options: {
            title: '',
            displayName: '',
            melayoutElement: null,
            isDocked: true,
            hasAppliedBindings: false,
            myDOMNode: null,
            pageicons: null,
            isDisposed: false,
            domain: false,
            id: 0
        },

        xevent: "click.rdentsurveypageslist",

        //#region Create
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.rdentsurveypageslist";
                }
                this.options.melayoutElement = this.element;
            }
            catch (ex) {
                alert("prweb.rdentsurveypageslist.create reports " + ex.Message);
            }
//            this.options.melayoutElement = this.element;
//            this.options.myDOMNode = this.element[0];
//            prweb.responsesvc.populatepageslistVMx();
//            ko.applyBindings(prweb.responsesvc.pageslistViewModelx, this.options.myDOMNode);
//            this.options.hasAppliedBindings = true;
//            this._subscribeToRDentEvents();
//            this._populatePageIconClickHandlers();
        },
        //#endregion

        _populatePageIconClickHandlers: function () {
            var self = this;
            this.options.pageicons = this.element.find(".prwrdpageicon");
            this.options.pageicons.click(function () {
                var thisbtn = $(this).children().css("background", "#f90");
                self.options.pageicons.children().not(thisbtn).css("background", "hsla(189, 100%, 7%, 0.9)");
                var pgnum = $(this).attr("data-prwpgnum");
                prweb.pubsub.publish(prweb.events.rdentplatform.surveycurrentpagechanged, pgnum);
            });
        },


        _populatePageIconLights: function (e) {
            //            var e = prweb.actionContext.currentpgnumber;
            if (this.options.pageicons) {

                var pgnumfilter = '[data-prwpgnum=' + e + ']';
                var onbtn = this.options.pageicons.filter(pgnumfilter).children().css("background", "#ff9900");
                this.options.pageicons.children().not(onbtn).css("background", "hsla(189, 100%, 7%, 0.9)");
            }
        },

        _subscribeToRDentEvents: function () {
            var that = this;
            prweb.pubsub.subscribe(prweb.events.rdentplatform.pagesbtnclick, that._moveToVisualStatePagesBtnClick, this);
            prweb.pubsub.subscribe(prweb.events.rdentplatform.actionsbtnclick, that._moveToVisualStateCloseList, this);
            prweb.pubsub.subscribe(prweb.events.rdentplatform.scrolltopage, that._populatePageIconLights, this);
        },



        //visualstate methods...
        _moveToVisualStatePagesBtnClick: function () {
            var self = this;
            self.options.melayoutElement.stop();
            if (!self.options.isDocked) {
                self.options.melayoutElement.stop();
                var mylayoutelem = self.options.melayoutElement;
                self.options.melayoutElement.animate({ width: 0 }, { duration: 300, easing: 'easeInQuad', complete: function () { mylayoutelem.hide() } });
                self.options.isDocked = true;
            }
            else {
                if (self.options.isDocked) {
                    self.options.melayoutElement.css("display", "");
                    self.options.melayoutElement.animate({ width: 300 });
                    self.options.isDocked = false;
                }
            }
        },

        _moveToVisualStateCloseList: function () {
            var self = this;
            self.options.melayoutElement.stop();
            if (!self.options.isDocked) {
                self.options.melayoutElement.stop();
                var mylayoutelem = self.options.melayoutElement;
                self.options.melayoutElement.animate({ width: 0 }, { duration: 300, easing: 'easeInQuad', complete: function () { mylayoutelem.hide() } });
                self.options.isDocked = true;
            }
        },


        _moveToVisualStateOpenList: function () {
            var self = this;
            self.options.melayoutElement.stop();
            if (self.options.isDocked) {
                self.options.melayoutElement.css("display", "");
                self.options.melayoutElement.animate({ width: 300 });
                self.options.isDocked = false;
            }
        },



        //this should be a destroy method...
        _moveToVisualStateSubscriptionHome: function () {
//            this._moveToVisualStateCloseList();
//            $(".prwresults").hide();
        },

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                }
                catch (ex) {
                    alert("prweb.rdentsurveypageslist.dispose reports error " + ex.Message);
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
                alert("prweb.rdentsurveypageslist.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }
        //#endregion


    }); // end of .widget function...

} (this.prweb, jQuery));
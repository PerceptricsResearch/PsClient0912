(function (prweb, $) {

    $.widget('prweb.navtile', {
        options: {
            state: {
                layout: null,
                sid: null,
                siddf: null
            },
            isDisposed: false
        },

        xevent: "click.navtile",
        newUrlbase: null,

        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.navtile";
                }
                this.newUrlbase = prweb.getBaseUrl();
                this._populateHandler();
            }
            catch (ex) {
                alert("prweb.navtile.create reports " + ex.Message);
            }
        },


        _populateHandler: function () {
            try {
                var mychild = this.element.children().eq(0);
                var action = this.element.attr('data-action');
                var staticUrlbase = prweb.getBaseUrl();
                switch (action) {
                    case 'navtile-design-selected':
                        this.options.state.layout = 'design';
                        break;
                    case 'navtile-publish-selected':
                        this.options.state.layout = 'publish';
                        break;
                    case 'navtile-results-selected':
                        this.options.state.layout = 'results';
                        break;
                    case 'navtile-share-selected':
                        this.options.state.layout = 'share';
                        break;
                    case 'navtile-surveys-selected':
                        this.options.state.layout = 'surveys';
                        break;
                    case 'navtile-subscription-selected':
                        this.options.state.layout = 'subscription';
                        break;
                    case 'navtile-settings-selected':
                        this.options.state.layout = 'settings';
                        break;
                    case 'navtile-logoff-selected':
                        this.options.state.layout = 'logoff';
                        break;
                };
                var self = this;
                mychild.on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.cancelBubble = true;
                        //                    var newUrlbase = prweb.getBaseUrl();
                        self.options.state.sid = false; //prweb.appsvc.CurrentSurveyContext;
                        self.options.state.siddf = false; //prweb.appsvc.DefaultSurveyContext;
                        window.location = $.param.fragment(staticUrlbase, self.options.state);
                    }
                    catch (ex) {
                        alert("navtile.clickhandler reports " + ex.Message);
                    }
                    return false;
                });
            }
            catch (ex) {
                alert("prweb.navtile.populateHandler reports " + ex.Message);
            }
            return;
        },


        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    var mychild = this.element.children().eq(0);
                    mychild.off(this.xevent);
                    mychild = null;
                }
                catch (e) {
                    alert("prweb.appcntxtdesign.dispose reports error");
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
                alert("prweb.navtile.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
    });

} (this.prweb, jQuery));
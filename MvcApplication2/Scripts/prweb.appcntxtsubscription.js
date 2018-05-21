(function (prweb, $) {
    $.widget('prweb.appcntxtsubscription', {
        options: {
            isDisposed: false
        },
        xevent: "click.appcntxtsubscription",

        _create: function () {
            prweb.panelsmgr.CloseAllPanels();
            if (prweb.IsTouch) {
                this.xevent = "tap.appcntxtsubscription";
            }
            var self = this;
            this.element.on(this.xevent, function () {
                prweb.panelsmgr.CloseAllPanels();
                //retrieve the  subscriptionhomeview with the url from subscriberplatform.options.
                //in the success handler attach the view widget to the subscriptionhomeroot...
                self._loadSubscriptionHomeView();
                return;
            });
        },

        //#region loadSettingsHomeView

        _loadSubscriptionHomeView: function () {
            try {
                var myurl = prweb.subscriptionsvc.subscriptionhomeUrl;
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        dataType: 'html',
                        type: 'GET',
                        success: function (viewhtml) {
                            $("#homecenterpanel").html("").html(viewhtml);
                            viewhtml = null;
                            myurl = null;
                            $("#subscriptionhomeroot").subscriptionview();
                            return;
                        },
                        error: function (e) {
                            alert("prweb.appcntxtsubscription.loadSubscriptionHomeView sendRequest reports ... " + e.toString());
                            myurl = null;
                            e = null;
                        }
                    });
                }
            }
            catch (ex) {
                alert("prweb.appcntxtsubscription.loadSubscriptionHomeView reports" + ex.Message);
            }
            return true;
        },

        //#endregion

        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    this.element.off(this.xevent);
                }
                catch (e) {
                    alert("prweb.appcntxtsubscription.dispose reports error");
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
                alert("prweb.appcntxtsubscription.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
    });
} (this.prweb, jQuery));
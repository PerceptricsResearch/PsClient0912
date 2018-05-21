(function (prweb, $) {
    $.widget('prweb.appcntxtsettings', {
        options: {
            isDisposed: false
        },
        xevent: "click.appcntxtsettings",

        _create: function () {
            prweb.panelsmgr.CloseAllPanels();
            if (prweb.IsTouch) {
                this.xevent = "tap.appcntxtsettings";
            }
            var self = this;
            this.element.on(this.xevent, function () {
                prweb.panelsmgr.CloseAllPanels();
                //retrieve the  settinghomeview with the url from subscriberplatform.options.
                //in the success handler attach the settings widget to the settingshomeroot...
                self._loadSettingsHomeView();
                return;
            });
        },

        //#region loadSettingsHomeView

        _loadSettingsHomeView: function () {
            try {
                var myurl = prweb.settingssvc.settingshomeUrl;
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        dataType: 'html',
                        type: 'GET',
                        success: function (viewhtml) {
                            $("#homecenterpanel").html("").html(viewhtml);
                            viewhtml = null;
                            myurl = null;
                            $("#settingshomeroot").settingsview();
                            return;
                        },
                        error: function (e) {
                            alert("prweb.appcntxtsettings.loadSettingsHomeView sendRequest reports ... " + e.toString());
                            myurl = null;
                            e = null;
                        }
                    });
                }
            }
            catch (ex) {
                alert("prweb.appcntxtsettings.loadSettingsHomeView reports" + ex.Message);
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
                    alert("prweb.appcntxtsettings.dispose reports error");
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
                alert("prweb.appcntxtsettings.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
    });
} (this.prweb, jQuery));
(function (prweb, $) {
    $.widget('prweb.appcntxtitem', {
        options: {
            isDisposed: false
        },

        //#region Create
        xevent: "click.appcntxtitem",

        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.appcntxtitem";
                }
                this.element.on(this.xevent, function (e) {
                    try {
                        e.preventDefault();
                        e.cancelBubble = true;
                        prweb.showClick(this);
                        var appcontext = prweb.appsvc.CurrentAppContext;
                        switch (true) {
                            case (appcontext == "Subscriberhome" || appcontext == "Share" || appcontext == "Results" || appcontext == "Surveys" || appcontext == "Publish" || appcontext == "Design"):
                                prweb.panelsmgr.TogglePanel("surveyiconlist");
                                break;
                        }
                        appcontext = null;
                    }
                    catch (ex) {
                        alert("prweb.appcntxtviemgr.create reports " + ex.Message);
                    }
                    return false;
                });
            }
            catch (ex) {
                alert("prweb.appcntxtviemgr.create reports " + ex.Message);
            }

        },

        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    this.element.off(this.xevent);
                }
                catch (ex) {
                    alert("prweb.appcntxtitem.dispose reports " + ex.Message);
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
                alert("prweb.appcntxtitem.destroy reports " + ex.Message)
            }
            $.Widget.prototype.destroy.call(this);
        }
        //#endregion
    });
} (this.prweb, jQuery));
(function (prweb, $) {
    $.widget('prweb.appmessage', {
        //#region Options
        options: {
            isDocked: true,
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion

        //#region Create
        xevent: "click.appmessage",
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.appmessage";
                }
                var konode = this.element; //is $("#guestpagespanel")
                ko.applyBindings(prweb.appmessagesvc.Vmx, konode[0]);
                konode = null;
            }
            catch (ex) {
                alert("prweb.appmessage.create reports " + ex.Message);
            }
            return;
        },
        //#endregion
        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {

                }
                catch (ex) {
                    alert("prweb.appmessage.dispose reports error " + ex.Message);
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
                alert("prweb.appmessage.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
            return;
        }
        //#endregion
    });
} (this.prweb, jQuery));
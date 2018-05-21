/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.marketingcontext', {
        //#region Options
        options: {
            isDisposed: false,
            domain: false,
            id: 0
        },

        xevent: "click.marketingcontext",

        _create: function () {

        },
        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                   
                }
                catch (ex) {
                    alert("prweb.marketingcontext.dispose reports error " + ex.Message);
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
                alert("prweb.marketingcontext.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
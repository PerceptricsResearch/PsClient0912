/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.marketingpagecontentview', {
        //#region Options
        options: {
            isDisposed: false,
            domain: false,
            id: 0
        },
        xevent: "click.marketingpagecontentview",

        _create: function () {
            try {


            }
            catch (ex) {
                alert("prweb.marketingpagecontentview.create reports " + ex.Message);
            }
        },

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    
                }
                catch (ex) {
                    alert("prweb.marketingpagecontentview.dispose reports error " + ex.Message);
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
                alert("prweb.marketingpagecontentview.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
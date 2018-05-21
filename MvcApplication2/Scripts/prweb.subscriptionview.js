/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.subscriptionview', {
        //#region Options
        options: {
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion
        xevent: "click.subscriptionview",

        //#region Create
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.subscriptionview";
                };
                this._populateButtonHandlers();
                prweb.subscriptionsvc.RetrieveSubscriptionColxn();
            }
            catch (ex) {
                alert("prweb.subscriptionview.create reports " + ex.Message);
            }
        },

        _populateButtonHandlers: function () {
            try {
                $("#subscriptioneditdonebtn").on(this.xevent, function (e) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    prweb.subscriptionsvc.EditDoneButtonAction();
                    return false;
                });

                $("#subscriptionbackcancelbtn").on(this.xevent, function (e) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    prweb.subscriptionsvc.BackCancelButtonAction();
                    return false;
                });
            }
            catch (ex) {
                alert("prweb.subscriptionview.PopulateButtonHandlers reports " + ex.Message);
            }
            return;
        },

        populateDataBoundButtonHandlers: function () {
            $(".suscriptionitemglass", "#subscriptioninfocontainer").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                var kodata = ko.dataFor(this);
                if (kodata.isenabled && !(kodata.isselected())) {
//                    $(".subscriptionitemselected", "#subscriptioninfocontainer").removeClass("subscriptionitemselected");
//                    $(this).parent().addClass("subscriptionitemselected");
                    prweb.subscriptionsvc.SelectSubscriptionButtonAction(kodata);
                }
                return false;
            });
        },

        //#endregion

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#subscriptioneditdonebtn").off(this.xevent);
                    $("#subscriptionbackcancelbtn").off(this.xevent);
                    $(".suscriptionitemglass", "#subscriptioninfocontainer").off(this.xevent);
                    prweb.subscriptionsvc.Shutdown();
                }
                catch (ex) {
                    alert("prweb.subscriptionview.dispose reports error " + ex.Message);
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
                alert("prweb.subscriptionview.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
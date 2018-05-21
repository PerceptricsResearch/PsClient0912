/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.settingsview', {
        //#region Options
        options: {
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion
        xevent: "click.settingsview",

        //#region Create
        _create: function () {
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.settingsview";
                };
                this._populateButtonHandlers();
                prweb.settingssvc.RetrieveSettingsColxn();
            }
            catch (ex) {
                alert("prweb.settingsview.create reports " + ex.Message);
            }
        },
        //#endregion

        _populateButtonHandlers: function () {
            try {
                $("#settingseditdonebtn").on(this.xevent, function () {
                    prweb.settingssvc.EditDoneButtonAction();
                });
                $("#settingsbackcancelbtn").on(this.xevent, function () {
                    prweb.settingssvc.BackCancelButtonAction();
                });
            }
            catch (ex) {
                alert("prweb.settingsview.PopulateButtonHandlers reports " + ex.Message);
            }
            return;
        },

        populateDataBoundButtonHandlers: function () {
//            var self = this;
            $(".settingssectionheader").on(this.xevent, function (e) {
                e.preventDefault();
                e.cancelBubble = true;
                //                var $this = $(this);
                var kodata = ko.dataFor(this);
                //                var $content = $this.siblings(".settingssectioncontent").addClass("settingcontentcollapsed");
                switch (true) {
                    case (kodata.iscollapsed()):
                        prweb.settingssvc.CollapseAny();
                        kodata.iscollapsed(false);
                        //                        $content.animate();
                        break;
                    case (!kodata.iscollapsed()):
                        kodata.iscollapsed(true);
                        //                        $content.animate();
                        break;

                }
                //                $content = null;
                kodata = null;
                //                $this = null;
                return false;
                //                prweb.sharesurveysvc.ShowLinkButtonAction(ko.dataFor(this));
            });
            //            $(".sharesendlinkbtn").on(this.xevent, function () {
            //                prweb.sharesurveysvc.SendLinkButtonAction(ko.dataFor(this));
            //            });
        },


        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#settingseditdonebtn").off(this.xevent);
                    $("#settingsbackcancelbtn").off(this.xevent);
                    $(".settingssectionheader").off(this.xevent);
                    prweb.settingssvc.Shutdown();
                }
                catch (ex) {
                    alert("prweb.settingsview.dispose reports error " + ex.Message);
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
                alert("prweb.settingsview.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.rdentplatform', {
        //#region Options
        options: {
            pgzeroURL: false,
            domaindxnry: false,
            rdentmodel: false,
            sendresponseURL: false,
            rdenthearbeatURL: false,
            isDisposed: false,
            domain: false,
            id: 0
        },
        //#endregion
        xevent: "click.rdentplatform",

        //#region Create
        _create: function () {
            try {
                prweb.setUpKOImageBinding();
                prweb.domaincontentsvc.DomainDxnry = this.options.domaindxnry;
                prweb.rdentsurveyplayersvc.pageZeroURL = this.options.pgzeroURL;
                prweb.responsesvc.RDentModel = this.options.rdentmodel;
                prweb.responsesvc.sendRDentModelUrl = this.options.sendresponseURL;
                prweb.responsesvc.HeartBeatURL = this.options.rdenthearbeatURL;
                //                if (prweb.IsTouch) {
                //                    prweb.gestureizer.DesignInitialize();
                //                    this.xevent = "tap.rdentplatform";
                //                }
                $("#surveyplayercontainer").rdentsurveyplayer();
            }
            catch (ex) {
                alert("prweb.rdentplatform.create reports " + ex.Message);
            }
        },
        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {

                }
                catch (ex) {
                    alert("prweb.rdentplatform.dispose reports error " + ex.Message);
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
                alert("prweb.rdentplatform.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));
/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.6.4-vsdoc.js" />
(function (prweb, $) {
    prweb.pcvmodesvc = (function () {
        var that = {};

        that.pcvmode = "computepaths";
        that.rdentpcvmode = "activeresponse";

        that.datacontextchanged = false;
        that.datacontext = false;
        that.IsDataContextChanged = function () {
            return that.datacontextchanged;
        };

        that.DataContextTo = function (targetdatacontext) {
            if (that.datacontext !== targetdatacontext) {
                that.datacontext = targetdatacontext;
                that.datacontextchanged = true;
                that.ModeTo(this.pcvmode);
            }
            else {
                that.datacontextchanged = false;
            }
        };

        that.IsGrpSelectorsOn = false;

        that.GrpSelectorsTo = function (targetvalue) {
            //            if (this.IsGrpSelectorsOn !== targetvalue) {
            that.IsGrpSelectorsOn = targetvalue;
            var targetmode = "grpdefnmarks" + targetvalue.toString();
            that.pcvmode = targetmode;
//            prweb.resultplayersvc.ModeTo(targetmode);
            prweb.pubsub.publish(prweb.events.subscriberplatform.pcvmodechange, targetmode);
            //            }
        };

        that.ModeTo = function (targetmode) {
            //            if (this.pcvmode !== targetmode) {
            that.pcvmode = targetmode;
//            prweb.resultsplayersvc.ModeTo(targetmode, that.datacontextchanged);
            prweb.pubsub.publish(prweb.events.subscriberplatform.pcvmodechange, targetmode, that.datacontextchanged);
            //            }
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
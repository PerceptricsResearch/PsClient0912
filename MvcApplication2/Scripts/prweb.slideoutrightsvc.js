/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.slideoutrightsvc = (function () {
        var that = {};

        that.Vmx = false;

        that.populateVmx = function () {
            var newvmx = {
                isDocked: ko.observable(true),
                subscriptions: {},
                Dispose: null
            };

            newvmx.Dispose = function () {
                for (var n in newvmx.subscriptions) {
                    newvmx.subscriptions[n].dispose();
                    newvmx.subscriptions[n] = null;
                    delete newvmx.subscriptions[n];
                };
                that.Vmx = false;
            };

            that.Vmx = newvmx;
        };

        that.Open = function () { 
        
        };

        that.Close = function () { 
        
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
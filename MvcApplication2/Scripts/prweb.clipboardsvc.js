/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.clipboardsvc = (function () {
        var that = {};

        that.PageColxn = {};

        that.PageColxnLength = function () {
            var rslt = 0;
            for (var k in that.PageColxn) {
                rslt++;
            };
            return rslt;
        };

        // pg is a simple js object...no observables...created by ko.toJS...see designersvc.PCMColxnCopyPage
        that.AddPage = function (pg) {
            var rslt = that.PageColxnLength();
            that.PageColxn[rslt] = pg;
            return rslt;
        };

        that.RemovePage = function (ndx) {
            var rslt = false;
            var pndx = ndx || that.PageColxnLength();
            that.PageColxn[pndx] = null;
            delete that.PageColxn[pndx];
            return rslt;
        };

        that.PastePage = function (ndx) {
            var pndx = ndx || Math.max(that.PageColxnLength() - 1,0);
            return that.PageColxn[pndx];
        };

        that.ClearPageColxn = function () {
            for (var p in that.PageColxn) {
                that.PageColxn[p] = null;
                delete that.PageColxn[p];
            }
        };

        that.ElementColxn = {};

        that.ElementColxnLength = function () {
            var rslt = 0;
            for (var k in that.ElementColxn) {
                rslt++;
            };
            return rslt;
        };

        that.AddElement = function (el) {
            var rslt = that.ElementColxnLength();
            that.ElementColxn[rslt] = el;
            return rslt;
        };

        that.PasteElement = function (ndx) {
            var elndx = ndx || Math.max(that.ElementColxnLength() - 1, 0);
            return that.ElementColxn[elndx];
        };

        that.ClearElementColxn = function () {

        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
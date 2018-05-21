/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.6.4-vsdoc.js" />

(function (prweb, $) {
    /**
    * PubSub is the messaging system used by 
    * the widgets to listen for and fire events
    */
    prweb.pubsub = (function () {
        var queue = {},
            sid = 0,
            that = {};

        that.SubscrID = function () {
            var ss = sid++;
            return ss;
        };
        //moved to publish as anonymous function...
        //        that.notify = function (eventName, data) {
        //            if (queue[eventName]) {
        //                for (s in queue[eventName]) {
        //                    try {
        //                        var scontext = null;
        //                        scontext = queue[eventName][s].context || false;
        //                        if (scontext) {
        //                            queue[eventName][s].callback.call(scontext, data);
        //                            //                            scontext = null;
        //                        }
        //                    } catch (e) {
        //                        alert("prweb.pubsub.notify reports error..." + e.Message);
        //                    }
        //                }
        //            }
        //        };

        /**
        * Executes all callbacks associated with eventName using the 
        * context provided in the subscription.
        *
        * @param {string} eventName  The name of the event to publish
        *                            Uses a dot notation for consistency
        * @param {object} data       Any data to be passed to the event
        *                            handler. Custom to the event.
        */

        that.publish = function (eventName, data) {
            //            var context, intervalId, idx = 0;
            var mytimeout = null;
            if (queue[eventName]) {
                mytimeout = setTimeout(function () {
                    if (queue[eventName]) {
                        for (var s in queue[eventName]) {
                            try {
                                var scontext = null;
                                scontext = queue[eventName][s].context || false;
                                if (scontext) {
                                    queue[eventName][s].callback.call(scontext, data);
                                    scontext = null;
                                }
                            } catch (ex) {
                                alert("prweb.pubsub.publish.notify reports error..." + ex.Message);
                            }
                            finally {
                                scontext = null;
                            }
                        }
                    }
                    eventName = null;
                    data = null;
                    clearTimeout(mytimeout);
                    mytimeout = null;
                    return;
                }, 0);
                //                intervalId = setInterval(function () {
                //                                        if (queue[eventName][idx]) {
                //                                            try {
                //                                                context = queue[eventName][idx].context || this;
                //                                                queue[eventName][idx].callback.call(context, data);
                //                                                //                            context = null;
                //                                                //                            data = null;
                //                                            } catch (e) {
                //                                                // log the message for developers
                //                                                alert("prweb.pubsub.publish reports error..." + e.Message);
                //                                                prweb.log('An error occurred in one of the callbacks for the event "' + eventName + '"');
                //                                                prweb.log('The error was: "' + e + '"');
                //                                            }

                //                                            idx += 1;
                //                                        } else {
                //                                            clearInterval(intervalId);
                //                                        }
                //                }, 0);
            }
            return;
        };
        /**
        * Stores an event subscription. Subsequent event subscriptions
        * are always added (not overwritten). Use unsubscribe to remove
        * event subscriptions.
        *
        * @param {string} eventName  The name of the event to publish
        *                            Uses a dot notation for consistency
        * @param {function} callback The function to be called when the 
        *                            event is published.
        * @param {object} context    The context to execute the callback
        */
        that.subscribe = function (eventName, callback, context) {
            var rslt = false;
            if (!queue[eventName]) {
                queue[eventName] = {};
            }
            if (context.options) {
                if (!context.options.subscrid) {
                    rslt = that.SubscrID().toString();
                    context.options.subscrid = rslt;
                }
                else { rslt = context.options.subscrid.toString(); }
            }
            else {
                if (!context.subscrid) {
                    rslt = that.SubscrID().toString();
                    context.subscrid = rslt;
                }
                else { rslt = context.subscrid.toString(); }
            }
            queue[eventName][rslt] = {
                callback: callback,
                context: context
            }
            //            queue[eventName].push({
            //                callback: callback,
            //                context: context
            //            });

            eventName = null;
            callback = null;
            context = null;
            return rslt;
        };
        /**
        * Removes an event subscription.
        *
        * @param {string} eventName  The name of the event to remove
        * @param {function} callback The function associated witht the
        *                            event. Used to ensure the correct
        *                            event is being removed.
        * @param {object} context    The context associated with the 
        *                            callback. Used to ensure the correct
        *                            event is being removed.
        */
        that.unsubscribe = function (eventName, callback, context) {
            var urslt = false;
            var rslt = false;
            if (queue[eventName]) {
                for (var s in queue[eventName]) {
                    if (context.options && queue[eventName][s].context.options) {
                        rslt = (queue[eventName][s].context.options.subscrid == context.options.subscrid);
                        //                        if (rslt) {
                        //                            context.options.subscrid = null;
                        //                        }
                    }
                    else if (context.subscrid) {
                        rslt = (queue[eventName][s].context.subscrid == context.subscrid);
                        //                        if (rslt) {
                        //                            context.subscrid = null;
                        //                        }
                    }
                    if (rslt) {
                        queue[eventName][s].context = null;
                        delete queue[eventName][s].context;
                        queue[eventName][s].callback = null;
                        delete queue[eventName][s].callback;
                        queue[eventName][s] = null;
                        delete queue[eventName][s];
                    }
                    rslt = false;
                }
                urslt = true
                //                var eliminate = function (item) {
                //                    var rslt = false;
                //                    if (item.context.options && context.options) {
                //                        rslt = (item.context.options.subscrid == context.options.subscrid);
                //                        if (rslt) {
                //                            context.options.subscrid = false;
                //                        }
                //                    }
                //                    else if (item.context.subscrid && context.subscrid) {
                //                        rslt = (item.context.subscrid == context.subscrid);
                //                        if (rslt) {
                //                            context.subscrid = false;
                //                        }
                //                    }
                //                    if (rslt) {
                //                        item.context = null;
                //                        item.callback = null;
                //                        item = null;
                //                    }
                //                    return rslt;
                //                }
                //                queue[eventName] = Enumerable.From(queue[eventName]).Where(function (i) { return !eliminate(i) }).ToArray();

                //                var newq = Enumerable.From(queue[eventName]).Where(function (i) { return !eliminate(i) }).ToArray();
                //                queue[eventName].length = 0;
                //                queue[eventName] = newq;
                //                newq = null;

                //                return queue[eventName].pop({
                //                    callback: callback,
                //                    context: context
                //                });
            }
            eventName = null;
            callback = null;
            context = null;
            rslt = null;
            return urslt;
        };

        that.accurateunsub = function (eventName, callback, context) {
            var rslt = false;
            if (queue[eventName]) {
                for (s in queue[eventName]) {
                    if (context.options) {
                        rslt = (queue[eventName][s].context.options.eventID == context.options.eventID);
                        if (rslt) {
                            context.options.subscrid = null;
                        }
                    }
                    else if (context.subscrid) {
                        rslt = (queue[eventName][s].context.eventID == context.eventID);
                        if (rslt) {
                            context.subscrid = null;
                        }
                    }
                    if (rslt) {
                        queue[eventName][s].context = null;
                        queue[eventName][s].callback = null;
                        //                        queue[eventName][s] = null;
                        delete queue[eventName][s];
                    }
                    rslt = false;
                }
                //                var item = {
                //                    callback: callback,
                //                    context: context
                //                };
                //                var beforecnt = queue[eventName].length;
                //                var newlist = Enumerable.From(queue[eventName]).Where(function (i) { return i.context.options.eventID !== context.options.eventID }).ToArray();
                //                var ndx = Enumerable.From(queue[eventName]).Except(item).ToArray();
                //                var aftercnt = newlist.length;
                //queue[eventName] = Enumerable.From(queue[eventName]).Where(function (i) { return i.context.options.eventID !== context.options.eventID }).ToArray();
                //                var dbx = 2;
            }
            eventName = null;
            callback = null;
            context = null;
            rslt = null;
            return true;
        };

        return that;
    } ());

} (this.prweb = this.prweb || {}, jQuery));
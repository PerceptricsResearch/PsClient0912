(function (prweb, $) {

    var priorities = {
        saveError: 1,
        saved: 2,
        saving: 3,
        loadError: 4
    };

    $.widget('prweb.status', {
        options: {
            duration: 8000,
            subscribe: function () { prweb.log('The subscribe option on status has not been set'); }
        },

        _create: function () {
            // handle global status events
            this.options.subscribe(prweb.events.status, this._statusSubscription, this);
        },

        currentStatus: null,

        _statusSubscription: function (status) {
            var el = this.element,
                duration = status.duration || this.options.duration,
                timerid = null;
            //            current = this.currentStatus;

            //            status.priority = this._getPriority(status);

            //            // cancel displaying the current message if its priority is lower than
            //            // the new message. (the lower the int the higher priority)
            //            if (current && (status.priority < current.priority)) {
            //                clearTimeout(current.timer);
            //            }

            //            current = status;

            el.text(status.message).show();

            // set the message for the duration
            timerid = setTimeout(function () {
                el.fadeOut();
                clearTimeout(timerid);
                el = null;
                //                that.currentStatus = null;
            }, duration);
            status = null;
        },

        _getPriority: function (status) {
            return priorities[status.type];
        },

        destroy: function () {
            if (this.currentStatus) {
                clearTimeout(this.currentStatus.timer);
            }
            $.Widget.prototype.destroy.call(this);
        }

    });

} (this.prweb = this.prweb || {}, jQuery));
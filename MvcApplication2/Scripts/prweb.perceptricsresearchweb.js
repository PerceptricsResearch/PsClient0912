(function (prweb, $) {
    //        if (!window.location.pathname.match(/SubscriberMain)) {
    //            return;
    //        }

    var header;
    header = $('#header').header({
        title: 'igntaz', displayName: 'bubba'
    });

    $('#notification').status({
        subscribe: prweb.pubsub.subscribe
    });

//    $('body').vsm({
//        layout: 'subscriberhome',
//        subscribe: prweb.pubsub.subscribe,
//        publish: prweb.pubsub.publish,
//        header: header
//    });

    //    var publish;
    //    publish = prweb.pubsub.publish;
    prweb.pubsub.publish(prweb.events.status, {
        type: 'saveError',
        message: 'Complete prweb...',
        duration: 10000
    });

    // setup default error handler for redirects due to session timeout.
//    $(document).ajaxError(function (ev, jqXHR, settings, errorThrown) {
//        alert("perceptricsresearchweb.js reports ajax error.. " + errorThrown.toString());
//    });
    //    alert('xxxxxx end of prmain');
} (this.prweb = this.prweb || {}, jQuery));


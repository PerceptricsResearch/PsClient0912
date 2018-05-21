(function () {
 
    var header = '';

    // setup default error handler for redirects due to session timeout.
    $(document).ajaxError(function (ev, jqXHR, settings, errorThrown) {
        alert("perceptricsweb.js reports ajax error");
    });

//    $('#notification').status({
//        subscribe: prweb.pubsub.subscribe
//    });

    

//    if (!window.location.pathname.match(/SubscriberMain)) {
//        return; // only enable widgets on SubscriberHome???
//    }
    
    //    $(".scrollable").scrollable({ vertical: true, mousewheel: true });
//    header = $('#header').header();

//    $('body').vsm({
//        subscribe: prweb.pubsub.subscribe,
//        publish: prweb.pubsub.publish,
//        header: header
//    });
});

//        $("a").click(function () {
//            var href = $(this).attr("href"),
//                state = $.bbq.getState() || {};
//           

//            // Push this URL "state" onto the history hash.
//            $.bbq.pushState({ url: href });
//            state = $.bbq.getState() || {};
//            // Prevent the default click behavior.     
//            return false;
//        });
//        $(window).bind("hashchange", function (e) {
//            // In jQuery 1.4, use e.getState( "url" );    
//            var url = e.getState("url");
//        });



$(function (prweb) {
    $(".scrollable").scrollable({ vertical: true, mousewheel: true });

    var navpanel;
    navpanel = $('#navpanel').navpanel({
        subscribe: prweb.pubsub.subscribe,
        publish: prweb.pubsub.publish,
        title: 'ignatz'
    });

    navpanel.('option','title','redo ignatz')
});
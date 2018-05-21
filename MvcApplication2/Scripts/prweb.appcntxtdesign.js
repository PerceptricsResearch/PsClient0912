(function (prweb, $) {
    $.widget('prweb.appcntxtdesign', {
        options: {
            isDisposed: false
        },
        xevent: "click.appcntxtdesign",

        _create: function () {
            if (prweb.IsTouch) {
                this.xevent = "tap.appcntxtdesign";
            }
            $("#appdesignnewsurveybtn").on(this.xevent, function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.cancelBubble = true;
                e = null;
                prweb.showClick(this);
                prweb.appsvc.EvaluateSurveyContextChange(-1);
                return false;
            });
            //            prweb.pubsub.publish(prweb.events.subscriberplatform.surveysbtnclick); //opens the surveyiconlist with animation...
        },

        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $("#appdesignnewsurveybtn").off(this.xevent);
                }
                catch (e) {
                    alert("prweb.appcntxtdesign.dispose reports error");
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
                alert("prweb.appcntxtdesign.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }
        }
    });
} (this.prweb, jQuery));
(function (prweb, $) {
    $.widget('prweb.appcntxtviewmgr', {
        options: {
            viewhtml: null,
            viewname: null,
            isDisposed: false
        },

        viewColxn: null,

        xevent: "click.appcntxtviewmgr",
        //#region Create
        _create: function () {
            try {
                this.viewColxn = {};
                if (prweb.IsTouch) {
                    this.xevent = "tap.appcntxtviewmgr";
                }
                //this is a bunch of html for various appcontextviews...is part of the first view loaded from the server..

                this.viewColxn["design"] = $("#appvwdesignholder").html();
                $("#appvwdesignholder").html("").remove();
                this.viewColxn["publish"] = $("#appvwpublishholder").html();
                $("#appvwpublishholder").html("").remove();
                this.viewColxn["results"] = $("#appvwresultsholder").html();
                $("#appvwresultsholder").html("").remove();
                this.viewColxn["surveys"] = $("#appviewsurveysholder").html();
                $("#appviewsurveysholder").html("").remove();
                this.viewColxn["share"] = $("#appviewshareholder").html();
                $("#appviewshareholder").html("").remove();
                this.viewColxn["subscription"] = $("#appviewsubscriptionholder").html();
                $("#appviewsubscriptionholder").html("").remove();
                this.viewColxn["settings"] = $("#appvwsettingsholder").html();
                $("#appvwsettingsholder").html("").remove();
                this.viewColxn["logoff"] = $("#appvwlogoffholder").html();
                $("#appvwlogoffholder").html("").remove();

                $("#prwappviewroot").css("display", "");
                this.viewColxn["subscriberhome"] = $("#prwappviewroot").parent().html();
                $(".homecenterpanelitem", this.element).appcntxtitem();
                $("#prwappviewloading").css("display", "");
            }
            catch (ex) {
                alert("prweb.appcntxtviemgr.create reports " + ex.Message);
            }

        },

        //#endregion



        //#region ManageView

        manageview: function () {
            try {
                var appcontext = prweb.appsvc.CurrentAppContext;
                var lstappcntxt = prweb.appsvc.LastAppContext;
                var hcp = $("#homecenterpanel");
                hcp.css("font-size", prweb.appfontsize).html(this.viewColxn[appcontext.toLowerCase()]);
                hcp = null;
                $(document).attr("title", "Perceptrics " + appcontext);
                if (appcontext == "Settings") {
                    $("#appviewsettings").appcntxtsettings();
                }
                if (appcontext == "Subscription") {
                    $("#appviewsubscription").appcntxtsubscription();
                }
                if (appcontext == "Design") {
                    $("#appviewdesign").appcntxtdesign();
                }
                if (lstappcntxt == "Results") {
                    prweb.rfmsvc.DisposeResultsViews();
                }
                if (appcontext == "Logoff") {
                    $("#prweblogoffbtn").on(this.xevent, function () {
                        prweb.LogMeOff();
                    });
                }
                if (lstappcntxt == "Logoff") {
                    $("#prweblogoffbtn").off(this.xevent);
                }
                $(".homecenterpanelitem", this.element).appcntxtitem();
                //                hcp = null;
                lstappcntx = null;
                appcontext = null;
            }
            catch (ex) {
                alert("prweb.appcntxtviewmgr.manageview reports error " + ex.Message);
                ex = null;
            }
            return;
        },

        //#endregion

        disposehcpscroller: function () {
            try {
                if (prweb.IsTouch) {

                    var scr = $("#hcpwrapper").data("scroller");
                    if (scr) {
                        scr.dispose();
                        alert("appcntxtviewmgr.disposehcpscroller");
                    }
                    scr = null;
                }
            }
            catch (ex) {
                alert("prweb.appcntxtviewmgr.disposehcpscroller reports " + ex.Message);
            }
        },

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    this.viewresizer.dispose();
                    this.viewresizer = null;
                    //                    this.disposehcpscroller();
                    alert("disposing appcntxtviewmgr");
                }
                catch (ex) {
                    alert("prweb.appcntxtviewmgr.dispose reports " + ex.Message);
                }
                finally {
                    this.options.isDisposed = true;
                }
            }
            return;
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prweb.appcntxtviewmgr.destroy reports " + ex.Message)
            }


            $.Widget.prototype.destroy.call(this);
        }
        //#endregion
    });
} (this.prweb, jQuery));
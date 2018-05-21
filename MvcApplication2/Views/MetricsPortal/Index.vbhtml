@Code
    Layout = "~/Views/Shared/_LayoutMetrics.vbhtml"
    ViewData("Title") = "Perceptrics Research Metrics Portal"
    Dim jcontinueUrl = Html.Raw(Json.Encode(Url.Action("MetricsLogon", "MetricsPortal")))
    Dim jfakeurl = 2
End Code

    <script src="http://cdnjs.cloudflare.com/ajax/libs/linq.js/2.2.0.2/linq.min.js" type="text/javascript"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/knockout/2.3.0/knockout-min.js" type="text/javascript"></script>
    @*<script src="@Url.Content("~/Scripts/knockout-2.1.0.js")" type="text/javascript"></script>*@
    <script src="@Url.Content("~/Scripts/prweb.debugsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.events.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pubsub.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.status.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.data.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.gestureizer.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pinchpanzoom.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prwebmetrics/prwebmetrics.index.js")" type="text/javascript"></script>

<div id="metricsindexcontainer" 
     data-prwcornerradius="4" class="defaultshadow"
     style="position:relative;top:2em;
                margin-left:2em;margin-right:2em;
                padding:2em;
                background:rgba(225,225,225,0.8);">
                <div data-prwcornerradius="4"
                    class="defaultshadow"
                    style="padding:1.5em;
                           text-align:center;
                           background:rgba(245,245,245,1);">
                    <h3>Perceptrics Research Metrics Portal</h3>
                    <p>This is the Perceptrics Research Metrics Portal. This is a subscriber provided link.</p>
                    <p>If you are unable to access this service, please contact the subscriber to verify you have the correct link.</p>
                </div>
                <div data-prwcornerradius="4"
                     class="defaultshadow"
                     style="padding:1.5em;
                            margin:auto;
                           background:rgba(245,245,245,1);">
                    <div id="metricscontinuebtn" data-prwcornerradius="4"
                         class="defaultshadow prwnoselect"
                         style="">Continue</div>
                </div>
</div>
<script type="text/javascript">
    (function (prweb, $) {
         $('#metricsindexcontainer').index({ 
               logonurl: @(jcontinueUrl),
               mktresourceurl: @(jfakeurl),
               acctresourceurl: @(jfakeurl), 
               logoffurl: @(jfakeurl)});
           } (this.prweb, jQuery))
</script>
@Code
    Layout = "~/Views/Shared/_LayoutMetrics.vbhtml"
    Dim jdashboardcolxnUrl = Html.Raw(Json.Encode(Url.Action("JsonRetrieveDashboardColxn", "MetricsPortal")))
    Dim jfakeurl = 2
End Code

<div id="metricsplatformlayoutroot">
    <div id="metricshcpwrapper" >
        <div id="metricshomecenterpanel" class="metricshomecenterpanelitems">
        @Html.Partial("DashboardColxnPartial")
        </div>
    </div>
    <div id="prwbuttonbar" class="defaultshadow"
         data-prwcornerradius="12">
        <div id="metricsprwactionsbtn" class="metricsbuttonbaritem"
             data-prwcornerradius="12">
            <div  class="metricsbuttonbaritemtext">Actions</div>
        </div>
        <div id="metricsprwdbxlinkbtn" class="metricsbuttonbaritem"
             data-prwcornerradius="12">
            <div  class="metricsbuttonbaritemtext">Dropbox</div>
        </div>
        <div id="metricsprwuploadbtn" class="metricsbuttonbaritem"
             data-prwcornerradius="12">
            <div  class="metricsbuttonbaritemtext">Upload</div>
        </div>
        <div id="metricsprwhelpbtn" class="metricsbuttonbaritem"
             data-bind="visible: helpbtnvisible"
             data-prwebdomain="help"
             data-prwcornerradius="12">
             <div  class="metricsbuttonbaritemtext">Help</div>
        </div>
    </div>
    <iframe id="metricsexceluploadtarget" name="metricsexceluploadtarget" style="position: absolute; left: -999em; top: -999em;"></iframe>    
</div>

@section scripts 
    <script src="http://cdnjs.cloudflare.com/ajax/libs/linq.js/2.2.0.2/linq.min.js" type="text/javascript"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/knockout/2.3.0/knockout-min.js" type="text/javascript"></script>
    <script  src="https://www.dropbox.com/static/api/1/dropins.js" id="dropboxjs" data-app-key="7fsyza3svi8zaob" type="text/javascript"></script>
    <script  src="https://www.dropbox.com/static/api/dropbox-datastores-1.0-latest.js"  type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.debugsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.events.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pubsub.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.status.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.data.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.gestureizer.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pinchpanzoom.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.textentry.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.appmessage.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.appmessagesvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prwebmetrics/prwebmetrics.uploadcontextset.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prwebmetrics/prwebmetrics.createcontextdocument.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prwebmetrics/prwebmetrics.availablecontexts.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prwebmetrics/prwebmetrics.metricscontextset.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prwebmetrics/prwebmetrics.staffing.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prwebmetrics/prwebmetrics.realize.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prwebmetrics/prwebmetrics.realizedashbd.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prwebmetrics/prwebmetrics.contextdocsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prwebmetrics/prwebmetrics.dashboardsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prwebmetrics/prwebmetrics.metricsplatformsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prwebmetrics/prwebmetrics.metricsplatform.js")" type="text/javascript"></script>
<script  type="text/javascript"> 
   (function (prweb, $) {
       $('#metricsplatformlayoutroot').metricsplatform({
            dashboardcolxnUrl: @(jdashboardcolxnUrl),
            metricsservice: @(jfakeurl),
            subscriberemail: @(jfakeurl),
            pgzeroURL: @(jfakeurl),
            domaindxnry: @(jfakeurl),
            baseurlcolxn: @(jfakeurl), 
            commentUrl: @(jfakeurl),
            metricshearbeatURL: @(jfakeurl)});
   } (this.prweb, jQuery))
</script>
End Section

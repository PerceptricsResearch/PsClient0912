<div id="dashboardcolxnroot">
                <div id="dashboardcolxncontainerwrapper"
                     class="dashboardcontainerwrapper" 
                     data-prwcornerradius="4">
                    <div id="dashboardcolxncontainer"
                         class="dashboardcontainer"
                         data-prwcornerradius="4">
                        <div id="dashboardcolxntitlewrapper"
                             class="dashboardtitlewrapper" 
                             data-prwcornerradius="4">
                            <div id="dashboardcolxntitle"
                                 class="dashboardtitle" 
                                 data-prwcornerradius="4">Metrics Prototype Home</div>

                        </div>
                        <div id="appmessagewrapper" class="viewrootmessagewrapper prwnoselect" data-prwcornerradius="4" >
                             <div id="appmessage" data-prwcornerradius="4" class="viewrootmessage defaultshadow">
                             <span data-bind="text: message">loading dashboards info...</span></div>
                        </div>
@*                        <div id="uploadregioncontainer">
                        <form id="dropboxexceluploadform" encType="multipart/form-data" method="post" name="dropboxexceluploadform" 
                               action="/MetricsPortal/UploadDropboxExcelFile" target="metricsexceluploadtarget">
                              <input id="db-chooser" type="dropbox-chooser" name="excelFile" 
                                    data-link-type="direct" 
                                    style="visibility:hidden;"/>
                              <input id="dropboxuploadbtn" type="submit" value="Upload Dropbox" style="margin-left:0.5em;margin-top:0.5em;width:8em;height:3em;"/> 
                        </form>
                        </div>*@
                        <div id="dashboardcolxnregionscontainerwrapper" 
                             class="dashboardcontainerwrapper"
                             data-prwcornerradius="4">
                            <div id="dashboardcolxnregionscontainer"
                                 data-bind="foreach: regioncolxn" 
                                 class="dashboardregionscontainer"
                                 data-prwcornerradius="4">
                                 <div class="defaultshadow dashboardregionwrapper"
                                      data-bind="template: { name: displayTemplate}"
                                     data-prwcornerradius="4"></div>
                            </div>
                        </div>
                    </div>
                </div>
</div>
<script type="text/html" id="dashboardcolxn">
    <div class="dashboardregion" 
         data-prwcornerradius="4">
        <div data-prwcornerradius="4" class="dashboardtitlewrapper"><div class="dashboardtitle"><span  data-bind="text: $data.title"></span></div></div>
        <div data-prwcornerradius="4" class="ellipsis" data-bind="foreach: dashboards">
            <div class="dashboarditem ellipsis" data-prwcornerradius="4"><span data-bind="text: $data.Name"></span>
                 <div data-bind="metricsxevent: $parent.isattached"
                      data-prwcornerradius="4" class="metricsselectbtn prwbutton defaultshadow"><span>Select</span></div>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="dashboardplaceholder">
    <div data-bind="html: html"
         class="dashboardplaceholderroot" 
         data-prwcornerradius="4">DashPlaceHolderRoot</div>
</script>
<script type="text/html" id="segmentcolxn">
    <div class="dashboardregion" 
         data-prwcornerradius="4">
    <div data-prwcornerradius="4" class="dashboardtitlewrapper"><div class="dashboardtitle"><span  data-bind="text: $data.title"></span></div></div>
    <div data-prwcornerradius="4" class="ellipsis" data-bind="foreach: segmentoptions"><div><span data-bind="text: $data.Name"></span></div></div>
    </div>
</script>
<script type="text/html" id="uploadcontextset">
    @Html.Partial("UploadContextSetPartial", "MetricsPortal")
</script>
<script type="text/html" id="availablecontexts">
    @Html.Partial("AvailableContextsPartial", "MetricsPortal")
</script>
<script type="text/html" id="selectablecontextdocument">
    @Html.Partial("SelectableContextDocumentPartial", "MetricsPortal")
</script>
<script type="text/html" id="newcontextdocument">
    @Html.Partial("NewContextDocumentPartial", "MetricsPortal")
</script>
<script type="text/html" id="createcontextdocument">
    @Html.Partial("CreateContextDocumentPartial", "MetricsPortal")
</script>
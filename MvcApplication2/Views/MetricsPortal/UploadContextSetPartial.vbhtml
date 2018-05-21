<div id="uploadcontextsetroot"
     class="dashboardregion" 
     data-prwcornerradius="4">
    <div data-prwcornerradius="4" class="dashboardtitlewrapper">
         <div class="dashboardtitle">
            <span data-bind="text: $data.title"></span>
            <div class="metricsbackcanceldonecontainer prwnoselect">
                 <div id="uploadcontextbackcancelbtn" class="metricsbackcancel defaultshadow" data-prwcornerradius="4">
                      <span data-bind="text: buttons.backcancel">Back</span>
                 </div>
                 <div id="uploadcontextdonebtn"  class="metricseditdone defaultshadow" data-prwcornerradius="4">
                      <span data-bind="text: buttons.editdone">Done</span>
                 </div>
            </div>
         </div>
    </div>
    <div id="uploadcontextmessagearea" class="viewrootmessagewrapper prwnoselect" data-prwcornerradius="4">
        <div data-prwcornerradius="4" class="viewrootmessage defaultshadow">
             <span data-bind="text: message">Browse your files for the Excel document you want to upload to the Metrics Portal.</span>
        </div>
    </div>
                            <div id="uploadregioncontainer">
                        <form id="dropboxexceluploadform" encType="multipart/form-data" method="post" name="dropboxexceluploadform" 
                               action="/MetricsPortal/UploadDropboxExcelFile" target="metricsexceluploadtarget">
                              <input id="db-chooser" type="dropbox-chooser" name="excelFile" 
                                    data-link-type="direct" 
                                    style="visibility:hidden;width:0em;height:0em;"/>
                              @*<input id="dropboxuploadbtn" type="submit" value="Upload Dropbox" style="margin-left:0.5em;margin-top:0.5em;width:8em;height:3em;"/>*@ 
                        </form>
                        </div>
    <div id="uploadcontextbrowsesubmitarea" 
         class="dashboardregionwrapper" 
         data-prwcornerradius="4">
                       
         <div id="metricsexceluploadcntrl" data-prwcornerradius="4" 
           style="position:relative;
                  padding:1em;
                  border: 1px solid rgba(255,255,255,0.2);">

           <div style="position:relative;height:5em;width:15em;margin-top:1em;"> 
            @Using Html.BeginForm("UploadExcelFile", "MetricsPortal", FormMethod.Post,
                    New With {.enctype = "multipart/form-data", .id = "metricsexceluploadform",
                                .name = "metricsexceluploadform", .target = "metricsexceluploadtarget"})
                @<div id="uploadcontrolbuttons" style="height:5em;width:25em;margin:auto;">
                    <input id="metricsexceluploadbrowseelement" type="file"  name="excelFile" required="true"  style="margin-left:0.5em;width:8em;height:3em;"/>

                    <input id="metricsexceluploadbtn" type="submit" value="Upload" style="margin-left:0.5em;margin-top:0.5em;width:5em;height:3em;"/>
                    
                </div>           
            End Using

           </div>

           
         </div>
     </div>
</div>
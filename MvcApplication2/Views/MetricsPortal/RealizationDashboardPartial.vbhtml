<div id="realizationdashboardroot"
     data-prwcornerradius="4">
    <div id="realizationdashboardcontainerwrapper" 
         class="dashboardcontainerwrapper"
         data-prwcornerradius="4">
        <div id="realizationdashboardcontainer" 
             class="dashboardcontainer"
             data-prwcornerradius="4">
            <div id="realizationdashboardbackdonewrapper">
@*                 <div id="realizationdashboardeditdonebtn" class="prweditdonebtn prwbutton defaultshadow"
                      data-prwcornerradius="4"><span data-bind="text: editdonetext">Edit</span></div>
                 <div id="realizationdashboardbackcancelbtn" class="prwbackcancelbtn prwbutton defaultshadow"
                      data-prwcornerradius="4"><span data-bind="text: backcanceltext">Back</span></div>*@
            </div>
            <div id="realizationdashboardtitlewrapper" 
                 class="dashboardtitlewrapper"
                 data-prwcornerradius="4">
                <div id="realizationdashboardtitle"
                     class="dashboardtitle"
                     data-prwcornerradius="4">
                    <span>Realization Dashboard</span>
                    <div class="metricsbackcanceldonecontainer prwnoselect">
                        <div id="realizedashboardbackcancel" class="metricsbackcancel defaultshadow" data-prwcornerradius="4">
                            <span data-bind="text: buttons.backcancel">Back</span>
                        </div>
                        <div id="realizedashboarddoneedit"  class="metricseditdone defaultshadow" data-prwcornerradius="4">
                            <span data-bind="text: buttons.editdone">Edit</span>
                        </div>
                    </div>
                </div>
                <div id="periodselectorcontainerwrapper"
                     class="dashboardcontainer">
                    <span>As Of:</span><select data-bind="options: periodmanager.availableperiods, optionsText: 'periodname', value: periodmanager.currentperiod "
                                             style="margin-left:0.5em;"/>
                    <div id="periodselectorcontrol">

                    </div>
                </div>
            </div>
            <div id="realizationdashboardregionscontainerwrapper" 
                 class="dashboardcontainerwrapper"
                 data-prwcornerradius="4">
                <div id="realizationdashboardregionscontainer" 
                     class="dashboardregionscontainer"
                     data-prwcornerradius="4">
                     <div style="position:relative;padding-bottom:0.25em;">
                     <div id="realizationstaffingroot"
                          class="realizationstaffingroot dashboardregionfloatleft dashboardregionlefthalf dashboardcontainerwrapper">@Html.Partial("StaffingPartial", "MetricsPortal")</div>
                     <div id="realizationrenticleroot"
                          class="realizationrenticleroot  dashboardcontainerwrapper">@Html.Partial("RealizationRenticlePartial", "MetricsPortal")</div>
                     </div>
                     <div id="reaslizationmetricscontextsetroot"
                          class="dashboardcontainerwrapper">@Html.Partial("MetricsContextSetPartial", "MetricsPortal")</div>
                     <div id="reaslizationdocumentsroot"
                          data-bind="template: { name: $root.availabledocumentstemplate}"
                          class="dashboardcontainerwrapper"></div> 
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="realizationregionplaceholder">
    <div data-bind="html: html"
         class="dashboardregion" 
         data-prwcornerradius="4">
        </div>
    </div>
</script>
<script  type="text/javascript"> 
   (function (prweb, $) {
       $('#realizationdashboardroot').realizeddashbd();
   } (this.prweb, jQuery))
</script>
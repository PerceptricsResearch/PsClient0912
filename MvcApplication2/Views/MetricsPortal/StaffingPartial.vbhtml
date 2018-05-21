<div id="staffingroot"
     class="dashboardcontainer"
     data-prwcornerradius="4">
     <div style="position:relative;height:1px;padding:0em;margin:0em;">
     <svg  viewBox="0 0 1 1" preserveAspectRatio="none" version="1.2" baseProfile="tiny">
               <defs>
                           <linearGradient id="svgxxx" y2="0" x2="0" y1="1" x1="0">
                                <stop stop-color="hsla(229,50%,57%,1)" offset="0%" />
                                <stop stop-color="hsla(220,50%,28%,1)" offset="55%" />
                                <stop stop-color="hsla(229,50%,20%,1)" offset="92%" />
                                <stop stop-color="hsla(220,50%,57%,1)" offset="100%" />
                            </linearGradient>
                </defs>
     </svg>
     </div>
     <div id="staffingrootcontainerwrapper"
          class="dashboardcontainerwrapper"
          data-prwcornerradius="4">
                <div class="dashboardtitle" 
                     data-prwcornerradius="4">
                    <span>Staffing Model</span>
                    <div class="metricsbackcanceldonecontainer prwnoselect">
                        <div data-bind="staffingxevent: staffing"
                            class="staffingrootcollapseable metricsselectbtn prwbutton metricsbackcancel defaultshadow"
                            data-prwcornerradius="4"  
                            style="font-size:0.75em;"><span>Collapse</span></div>
                        <div id="staffingbackcancel" style="display:none;" class="metricsbackcancel defaultshadow" data-prwcornerradius="4"><span>Back</span></div>
                        <div id="staffingdoneedit" style="display:none;" class="metricseditdone defaultshadow" data-prwcornerradius="4"><span>Done</span></div>
                        @*<div data-bind="staffingxevent: staffing"
                            class="staffingrefresh metricsselectbtn prwbutton metricseditdone defaultshadow"
                            data-prwcornerradius="4"  
                            style="font-size:0.75em;"><span>Refresh</span></div>*@

                    </div>
                </div>
          <div id="staffingrootcontainer"
                class="dashboardcontainerwrapper"
                data-prwcornerradius="4">
                <div id="staffingsummarymetricscontainer" data-bind="foreach: domaininfos[0].MetricsObs"
                    class="dashboardcontainer">
                    <div data-prwcornerradius="4" 
                         class="defaultshadow ellipsis"
                         style="display:inline-block;vertical-align:top;padding:0.25em;margin-bottom:0.25em;
                                background:rgba(235,245,235,0.6);">
                         <span class="prwnoselect" data-bind="text: MetricInfo.Name"></span>
                    <div style="position:relative;margin:auto;text-align:center;">
                         <span class="prwnoselect" data-bind="text: MetricInfo.MetricValueItem.Value"></span>
                    </div>
                    </div>
                </div>
          <div id="staffingsvgroot" 
               data-bind="foreach: domaininfos[0].ComponentInfoColxn, staffingderived: staffingchange"
               class="dashboardregion" style="padding-left:1.75em;padding-right:1.75em;"
               data-prwcornerradius="4">
            <div class="staffingitemcontainer dashboardcontainer"
                 data-prwcornerradius="4">
                 <div class="prwnoselect" style="height:2em;padding:0.25em;font-size:0.75em;">
                    <span data-bind="text: $data.Name"></span>
                 </div>
                 <div class="staffcountbar"
                      data-prwcornerradius="4" 
                      style="position:relative;height:2em;width:100%;margin:auto;margin-bottom:0.5em;">
                   <svg viewBox="0 0 180 60" 
                        preserveAspectRatio="none" version="1.2" baseProfile="tiny">
                     <g>
                        <g>
                        <rect  fill="url(#svgxxx)" stroke="hsla(205,100%,29%,1)" stroke-width="1" 
                              x="0" y="0" width="100%" height="100%" rx="4"/>
                        </g>
                     </g>
                   </svg>
                 </div>
                 <div data-bind="staffingxevent: $parent.staffing"
                        class="staffingcollapseable prwnoselect" 
                        data-prwcornerradius="4">
                        </div>
                 <div class="dashboardcontainerwrapper staffingmetricscolxnregion" style="display:none;"
                      data-prwcornerradius="4">
                    <div data-prwcornerradius="4" 
                         class="dashboardcontainer">
                        <div data-bind="staffingxevent: $parent.staffing"
                             data-prwcornerradius="4" style="margin:auto;"
                             class="staffingmetricscollapse dashboardtitle">
                            <span class="prwnoselect" style="font-size:0.75em;text-align:center;margin:auto;">Metrics Details</span>
                        </div>
                        <div style="display:none;position:relative;padding:0.25em;"  
                             class="dashboardregion">
                        <div data-prwcornerradius="4" style="position:relative;display:inline-block;vertical-align:top;width:60%;margin-bottom:1em;" 
                             data-bind="foreach: MetricInfoColxn">
                            <div data-prwcornerradius="4" 
                                 class="defaultshadow ellipsis"
                                 style="padding:0.5em;margin-bottom:0.25em;
                                        font-size:0.75em;text-align:left;
                                        background:rgba(235,245,235,0.6);">
                                 <span class="prwnoselect" data-bind="text: Name"></span>
                            </div>
                        </div>
                        <div class="horizoncolxnwrapper" style="position:absolute;top:0.25em;right:0em;width:4em;height:100%;">
                        <div class="horizoncolxnplaceholder"
                             data-prwcornerradius="4" style="position:absolute;width:4em;height:100%;"
                             data-bind="with: currenthorizonitem">
                            <div data-prwcornerradius="4" style="position:relative;display:inline-block;vertical-align:top;"
                                 class="defaultshadow">
                                 <div data-prwcornerradius="4" style="position:relative;"
                                      data-bind="foreach: MetricValueColxn">
                                      <div data-prwcornerradius="4"
                                           class="defaultshadow staffingeditablemetric"
                                           style="position:relative;width:4em;padding:0.5em;margin-bottom:0.25em;
                                                  font-size:0.75em;text-align:right;
                                                  background:rgba(235,245,235,0.6);">
                                           <span class="prwnoselect"  data-bind="text: Value"></span>
                                           <input type="number" 
                                                  data-bind="value: Value, visible: $parent.IsEdit" 
                                                    style="position:absolute;top:0.5em;bottom:0.5em;left:0.1em;right:0.1em;width:4em;height:1.5em;text-align:right;font-size:1em;"/>
                                      </div>
                                 </div>
                                 <div data-prwcornerradius="4" style="position:relative;font-size:0.5em;display:none;">
                                      <span style="text-align:left;">Period</span>
                                      <span class="prwnoselect" style="margin-left:0.25em;text-align:right;" data-bind="text: Period"></span>
                                 </div>
                                 
                            </div>
                        </div>
                        </div>
                        </div>
                    </div>
                 </div>
            </div>
            
          </div>
        </div>
     </div>
</div>
@*               <svg viewBox="0 0 180 60" 
                    preserveAspectRatio="none" version="1.2" baseProfile="tiny">
                    <g >
                        <g>
                        <rect  fill="url(#svgxxx)" stroke="hsla(135,100%,79%,1)" stroke-width="1" 
                              x="0" y="0" width="180" height="60" rx="12"/>
                        <text data-bind="text: $data.Name " fill="hsla(1, 99%, 99%, 1)" stroke="#000000" 
                              stroke-width="0" x="90" y="30"  font-size="10" 
                              text-anchor="middle" />
                        <rect fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="180" height="60" rx="12"/>
                        </g>
                     </g>
               </svg>*@
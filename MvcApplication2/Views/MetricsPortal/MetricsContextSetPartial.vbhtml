<div id="metricscontextsetroot"
     class="dashboardcontainer"
     data-prwcornerradius="4">
     <div id="metricscontextsetrootcontainerwrapper"
          class="dashboardcontainer"
          data-prwcornerradius="4">
          <div style="position:relative;height:1px;padding:0em;margin:0em;">
            <svg  viewBox="0 0 1 1" preserveAspectRatio="none" version="1.2" baseProfile="tiny">
               <defs>
                            <radialGradient id="mcrbonbrush"
                                            fy="43%" fx="45%">
                                 <stop offset="0%" stop-color="hsla(229, 100%, 80%, 1)" />
                                 <stop offset="12%" stop-color="hsla(220, 100%, 55%, 1)" />
                                 <stop offset="60%" stop-color="hsla(220, 100%, 25%, 1)" />
                                 <stop offset="94%"  stop-color="hsla(222, 100%, 2%, 1)" />
                                 <stop offset="100%" stop-color="hsla(220, 100%, 20%, 1)" />
                             </radialGradient>
                             <radialGradient id="mcrboffbrush"
                                             fy="62%" fx="65%">
                                  <stop offset="0%" stop-color="hsla(229, 20%, 32%, 1)"/>
                                  <stop offset="60%" stop-color="hsla(229, 40%, 22%, 1)" />
                                  <stop offset="94%"  stop-color="hsla(232, 100%, 2%, 1)"/>
                                  <stop offset="100%" stop-color="hsla(220, 49%, 20%, 1)"/>
                              </radialGradient>
                </defs>
            </svg>
          </div>
          <div id="metricscontextsetrootcontainer"
               class="dashboardregion prwnoselect"
               data-prwcornerradius="4">
               <div class="dashboardtitle"><span>Context Set View</span></div> 
               <div id="metricscontextsetcolxncontainer" data-bind="foreach: dashboard.SegmentInfoColxn">
                    <div data-prwcornerradius="4"
                         class="dashboardcontainerwrapper metricscontextsetitem prwnoselect">
                         <div data-prwcornerradius="4" class="dashboardtitlewrapper">
                              <div class="dashboardtitle">
                                   <span  data-bind="text: $data.Name"></span>
                              </div>
                         </div>
                         <div data-bind="foreach: $data.OptionColxn"
                              class="metricscontextoptionlistcontainer"
                              data-prwcornerradius="4">
                              <div class="metricscontextoptionitemcontainerwrapper"
                                   data-prwcornerradius="4">
                                <div class="metricscontextoptionitemcontainer defaultshadow"
                                     data-prwcornerradius="4">
                                    <div data-bind="metricscontextsetxevent: $root.metricscontextset"
                                         class="metricscontextitemselector"
                                         data-prwcornerradius="4">
                                     <svg viewBox="0 0 100 100" preserveAspectRatio="xMinYMid meet" version="1.2" baseProfile="tiny" >
                                       <g class="mcselectorgrp" >
                                          <circle  data-bind="attr: { 'fill': $data.BrushStr }"
                                                   fill="url(#mcrboffbrush)"
                                                   r="45" cy="50" cx="50" stroke-width="5" stroke-opacity="1" stroke-dasharray="null" 
                                                   stroke="url(#rbfixedborder)"/>
                                       </g>
                                      </svg>
                                     </div>
                                     <div class="metricscontextitemtext" 
                                          data-prwcornerradius="4">
                                        <span class="ellipsis prwnoselect"  data-bind="text: $data.Name"></span>
                                     </div>
                                </div>
                              </div>
                         </div>
                    </div>

               </div>
          </div>
     </div>
</div>
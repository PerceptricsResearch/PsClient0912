<div id="createcontextdocumentroot"
     class="dashboardregion"
     data-prwcornerradius="4">
     <div style="position:relative;height:1px;padding:0em;margin:0em;">
            <svg  viewBox="0 0 1 1" preserveAspectRatio="none" version="1.2" baseProfile="tiny">
               <defs>
                              <radialGradient id="createcontextcopyonbrush"
                                            fy="43%" fx="45%">
                                 <stop offset="0%" stop-color="hsla(39, 100%, 80%, 1)" />
                                 <stop offset="12%" stop-color="hsla(30, 100%, 55%, 1)" />
                                 <stop offset="60%" stop-color="hsla(30, 100%, 25%, 1)" />
                                 <stop offset="94%"  stop-color="hsla(32, 100%, 2%, 1)" />
                                 <stop offset="100%" stop-color="hsla(30, 100%, 20%, 1)" />
                             </radialGradient>
                             <radialGradient id="createcontextcopyoffbrush"
                                             fy="62%" fx="65%">
                                  <stop offset="0%" stop-color="hsla(39, 20%, 32%, 1)"/>
                                  <stop offset="60%" stop-color="hsla(39, 40%, 22%, 1)" />
                                  <stop offset="94%"  stop-color="hsla(32, 100%, 2%, 1)"/>
                                  <stop offset="100%" stop-color="hsla(30, 49%, 20%, 1)"/>
                              </radialGradient>
                </defs>
            </svg>
     </div>
     <div class="dashboardcontainer" 
         data-prwcornerradius="4">
        <div class="dashboardcontainerwrapper" 
             data-prwcornerradius="4">
            <div class="dashboardtitle prwnoselect" 
                 data-prwcornerradius="4">
                 <span class="prwnoselect ellipsis">Create New Context Document</span>
                 <div class="metricsbackcanceldonecontainer prwnoselect">
                    <div id="createcontextdocumentbackcancel" class="metricsbackcancel defaultshadow" data-prwcornerradius="4"><span>Back</span></div>
                    <div id="createcontextdocumentdoneedit" class="metricseditdone defaultshadow" data-prwcornerradius="4"><span>Done</span></div>
                 </div>
            </div>
            <div id="createcontextdocumentcontent"
                 class="dashboardcontainerwrapper"
                 data-prwcornerradius="4">
                <div data-bind="with: createcontextdocument"
                    class="createdocumentheadercontainerwrapper"
                    data-prwcornerradius="4">
                   <div style="position:relative;height:3em;width:3em;display:inline-block;vertical-align:top;">
                          <div id="createcontextdocumentitemselector"
                               class="createcontextdocumentitemselector availablecontextcontentitem"
                               data-prwcornerradius="4">
                                     <svg viewBox="0 0 100 100" preserveAspectRatio="xMinYMid meet" version="1.2" baseProfile="tiny" >
                                       <g class="acselectorgrp" >
                                          <circle  data-bind="attr: { 'fill': CopyBrushStr }"
                                                   fill="url(#createcontextcopyoffbrush)"
                                                   r="45" cy="50" cx="50" stroke-width="5" stroke-opacity="1" stroke-dasharray="null" 
                                                   stroke="url(#rbfixedborder)"/>
                                       </g>
                                      </svg>
                          </div>
                          @*<div style="display:inline-block;vertical-align:top;"><span>Copy From</span></div>*@
                   </div>
                   <div id="createdocumentheadercontainer"
                        class="defaultshadow"
                        data-prwcornerradius="4">
                    <div data-bind="foreach: $root.createcontextdocument.ContextNamesColxn"
                                 class="dashboardregionscontainer availablecontextcontentitem"
                                 data-prwcornerradius="4">
                                 <span class="prwnoselect" data-bind="text: $data"></span></div>
                    <div id="createdocumentdescription">
                         <span class="prwnoselect" data-bind="text: Description">some description goes here</span>
                    </div>
                   </div>
                </div>
                 <div class="availablecontextsrootcontainer dashboardcontainerwrapper" 
                        data-prwcornerradius="4">
                    <div class="dashboardtitle" 
                        data-prwcornerradius="4"><span class="prwnoselect">Copy From</span></div>
                    <div data-bind="foreach: $root.availablecontexts"
                        class="availablecontextscolxncontainer"
                        data-prwcornerradius="4">
                        <div data-bind="template: { name: contextdocumenttemplate}"
                            class="availablecontextscolxnitemcontainerwrapper dashboardcontainerwrapper" 
                            data-prwcornerradius="4">
                        </div>
                    </div>
                 </div>
            </div>
        </div>
        </div>
</div>
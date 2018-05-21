<div id="availablecontextsroot" 
     class="dashboardregion"
     data-prwcornerradius="4">
     <div style="position:relative;height:1px;padding:0em;margin:0em;">
            <svg  viewBox="0 0 1 1" preserveAspectRatio="none" version="1.2" baseProfile="tiny">
               <defs>
                            <radialGradient id="acrbonbrush"
                                            fy="43%" fx="45%">
                                 <stop offset="0%" stop-color="hsla(129, 100%, 80%, 1)" />
                                 <stop offset="12%" stop-color="hsla(120, 100%, 55%, 1)" />
                                 <stop offset="60%" stop-color="hsla(120, 100%, 25%, 1)" />
                                 <stop offset="94%"  stop-color="hsla(122, 100%, 2%, 1)" />
                                 <stop offset="100%" stop-color="hsla(120, 100%, 20%, 1)" />
                             </radialGradient>
                             <radialGradient id="acrboffbrush"
                                             fy="62%" fx="65%">
                                  <stop offset="0%" stop-color="hsla(129, 20%, 32%, 1)"/>
                                  <stop offset="60%" stop-color="hsla(129, 40%, 22%, 1)" />
                                  <stop offset="94%"  stop-color="hsla(132, 100%, 2%, 1)"/>
                                  <stop offset="100%" stop-color="hsla(120, 49%, 20%, 1)"/>
                              </radialGradient>
                              <radialGradient id="newcontextcopyonbrush"
                                            fy="43%" fx="45%">
                                 <stop offset="0%" stop-color="hsla(39, 100%, 80%, 1)" />
                                 <stop offset="12%" stop-color="hsla(30, 100%, 55%, 1)" />
                                 <stop offset="60%" stop-color="hsla(30, 100%, 25%, 1)" />
                                 <stop offset="94%"  stop-color="hsla(32, 100%, 2%, 1)" />
                                 <stop offset="100%" stop-color="hsla(30, 100%, 20%, 1)" />
                             </radialGradient>
                             <radialGradient id="newcontextcopyoffbrush"
                                             fy="62%" fx="65%">
                                  <stop offset="0%" stop-color="hsla(39, 20%, 32%, 1)"/>
                                  <stop offset="60%" stop-color="hsla(39, 40%, 22%, 1)" />
                                  <stop offset="94%"  stop-color="hsla(32, 100%, 2%, 1)"/>
                                  <stop offset="100%" stop-color="hsla(30, 49%, 20%, 1)"/>
                              </radialGradient>
                </defs>
            </svg>
      </div>
    <div class="availablecontextsrootcontainerwrapper dashboardcontainer" 
         data-prwcornerradius="4">
        <div class="availablecontextsrootcontainer dashboardcontainerwrapper" 
             data-prwcornerradius="4">
            <div class="dashboardtitle" 
                 data-prwcornerradius="4">
                 <span class="prwnoselect">Available Context Documents</span>
                 <div class="metricsbackcanceldonecontainer prwnoselect">
                    <div id="availablecontextsbackcancel" class="metricsbackcancel defaultshadow" data-prwcornerradius="4"><span>Back</span></div>
                    <div id="availablecontextsdoneedit" class="metricseditdone defaultshadow" data-prwcornerradius="4"><span>Done</span></div>
                 </div>
            </div>
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
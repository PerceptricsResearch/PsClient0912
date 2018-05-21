<div id="prwdesignerhomeroot">
    <div id="designerhomeviewcontainer"
         data-prwcornerradius="4">
         <div id="appmessagewrapper" class="viewrootmessagewrapper prwnoselect" data-prwcornerradius="4" >
            <div id="appmessage" data-prwcornerradius="4" class="viewrootmessage defaultshadow">
                <span data-bind="text: message">loading designer...</span></div>
         </div>
                <div id="designercanvasouter"
                     data-prwcornerradius="4"">
                        <div class="sixteennine aspectratio"></div>
                        <div id="designercanvasinner" 
                             data-bind="foreach: { data: currentpcelemcolxn(), afterAdd: widgetizeAddedElement }"
                             data-prwtype="designeritemcanvas"  
                             data-prwcornerradius="4"><div data-bind="html: $data.modelcore.html, 
                                                                    attr: { 'id': $data.pcelemID } "
                                                         class="designeritem" 
                                                         data-prwtype="designeritem"   
                                                         style="position:absolute;left:20%;top:10%;
                                                                width:30%;height:30%;"></div></div>
                </div>
 
                <div id="designertoolboxpanelroot">
                    <div id="designtoolscontainer"
                         data-prwcornerradius="12" 
                         class="prwslideouthide prwdesignerslideouttlbxwide prwnoselect" 
                         style="overflow:hidden;"></div>
                </div>
    </div>
    <div id="designeritemeditorhomeroot" style="display:none;">
        <div id="designeritemeditorhomecontainer">
            <div data-prwcornerradius="4" style="position:relative;padding:1em;background:rgb(255,255,251)">
                        <div id="ditemeditoreditdonebtn" class="prweditdonebtn prwbutton defaultshadow"
                             data-prwcornerradius="4"><span data-bind="text: editdonetext">Done</span></div>
                        <div id="ditemeditorbackcancelbtn" class="prwbackcancelbtn prwbutton defaultshadow"
                             data-prwcornerradius="4"><span data-bind="text: backcanceltext">Back</span></div>
            </div>
            <div id="designeritemeditortextentryroot" style="display:none;">
                <div id="designeritemeditortextentrycontainer" data-prwcornerradius="4">
                     @Html.Partial("TextEntryViewPartial", Nothing)
                </div>
            </div>
            <div id="designeritemeditorpanelsroot">
            <div id="dieditormessagewrapper" class="viewrootmessagewrapper prwnoselect" data-prwcornerradius="4" >
            <div id="dieditormessage" data-prwcornerradius="4" class="viewrootmessage defaultshadow">
                <span data-bind="text: message">loading designer...</span></div>
         </div>
              <div id="designeritemeditorpanelsleftpanel">
                <div id="designeritemeditorpanelsbuttonbar">
                    <div id="prwdesignstylesbtn" class="designeritemeditorbutton"
                         data-prwcornerradius="12">
        <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="none"
             version="1.2" >
             <g>
               <defs>
                <linearGradient id="dhlg1" x1="0" y1="1" x2="0" y2="0">
                    <stop stop-color="hsla(175,95%,49%,1)" offset="0%"/>
                    <stop stop-color="hsla(175,95%,20%,1)" offset="45%"/>
                    <stop stop-color="hsla(175,95%,6%,1)" offset="92%"/>
                    <stop stop-color="hsla(175,95%,59%,1)" offset="100%"/>
                </linearGradient>
                </defs>
                <rect fill="url(#dhlg1)" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
                <text fill="hsla(179, 94%, 99%, 1)" stroke="#000000" 
                stroke-width="0" x="30" y="30"  font-size="14" 
                text-anchor="middle" >Colors</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
              </g>
        </svg>
                    </div>
                    <div id="prwdesignimagesmgrbtn" class="designeritemeditorbutton"
                        data-prwcornerradius="12">
        <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="none"
             version="1.2" baseProfile="tiny">
             <g>
                <rect fill="url(#dhlg1)" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
                <text fill="hsla(179, 94%, 94%, 1)" stroke="#000000" 
                stroke-width="0" x="30" y="30"  font-size="14" 
                text-anchor="middle" >Images</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
              </g>
        </svg>
                    </div>
                    <div id="prwdesignoptionsbtn" class="designeritemeditorbutton"
                         data-prwcornerradius="12">
        <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="none"
             version="1.2" >
             <g>
                <rect fill="url(#dhlg1)" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
                <text fill="hsla(179, 94%, 94%, 1)" stroke="#000000" 
                stroke-width="0" x="30" y="30"  font-size="14" 
                text-anchor="middle">Options</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
              </g>
        </svg>
                    </div> 
                    <div id="prwdesigntextbtn" class="designeritemeditorbutton"
                         data-prwcornerradius="12">
        <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="none"
             version="1.2" >
             <g>
                <rect fill="url(#dhlg1)" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
                <text fill="hsla(179, 94%, 99%, 1)" stroke="#000000" 
                stroke-width="0" x="30" y="30"  font-size="14" 
                text-anchor="middle">Text</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
              </g>
        </svg>
                    </div>               
                </div>
                <div id="designeritemeditorcanvaswrapper" data-prwcornerradius="4">
            <div id="designeritemeditorcanvas" data-prwcornerradius="4">
                 <div class="sixteennine aspectratio"></div>
                 @*<div id="designeritemeditorcanvaszoomwrapper">*@
                 <div id="designeritemeditorcanvaszoomcontainer">
                 <div id="designeritemeditorcanvasinner"
                      data-bind="foreach: { data: ditemmodel, afterAdd: methods.widgetizeT }"
                      data-prwcornerradius="4"><div id="designeritemeditorresident" 
                                                    data-bind="html: $data.modelcore.html"
                                                    class="designeritemeditorresident"></div></div>
                 <div id="designeritemeditorpanelsslideoutscontainer">
                 <div id="designstylescontainer"
                      data-prwcornerradius="12" 
                      class="prwslideouthide prwdesignerslideoutwide prwnoselect"></div>
                 <div id="designimagesmgrcontainer"
                      data-prwcornerradius="12" 
                      class="prwslideouthide prwdesignerslideoutwide prwnoselect"></div>
                 <div id="designoptionscontainer"
                      data-prwcornerradius="12" 
                      class="prwslideouthide prwdesignerslideoutwide prwnoselect"></div>
              </div> 
                 </div></div></div>
              </div>
                     
            </div>
        </div>
    </div>

</div>



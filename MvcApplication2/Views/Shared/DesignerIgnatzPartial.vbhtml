           <div data-prwcornerradius="4" 
                class="ignatzprwt defaultshadow ditouchdragobj"
                @*data-bind="style: { 'border-color': $data.modelcore.BorderBrushStr }"*@
                style="position:absolute;
                       left:0%;right:0%;top:0%;bottom:0%;">
                <svg width="100%" height="100%" viewBox="0 0 400 300"
                     preserveAspectRatio="none"  
                     data-prwcornerradius="4"   
                     version="1.2" baseProfile="tiny">
                  <g>
                         <defs>
                          <linearGradient data-bind="attr: { 'id': $data.modelcore.BackgroundBrushID }"
                                          y2="0" x2="0" y1="1" x1="0">
                            <stop stop-color="hsla(179,70%,57%,1)" offset="0%" data-bind="attr: { 'stop-color': $data.modelcore.BackgroundStr()[0] }"/>
                            <stop stop-color="hsla(173,70%,28%,1)" offset="55%" data-bind="attr: { 'stop-color': $data.modelcore.BackgroundStr()[1] }"/>
                            <stop stop-color="hsla(173,70%,20%,1)" offset="92%" data-bind="attr: { 'stop-color': $data.modelcore.BackgroundStr()[2] }"/>
                             <stop stop-color="hsla(179,70%,57%,1)" offset="100%" data-bind="attr: { 'stop-color': $data.modelcore.BackgroundStr()[3] }"/>
                           </linearGradient>
                          </defs>
                  </g>
                  <g>
                     <rect  data-bind="attr: { 'fill': $data.modelcore.BackgroundBrushUrl,
                                               'fill-opacity':  $data.modelcore.BackgroundOpacity,
                                               'visibility': $data.modelcore.BackgroundVisibility  }"
                            height="100%" width="100%" x="0" y="0" stroke-width="0"/>
                     
                     <image height="100%" width="100%" x="0" y="0" preserveAspectRatio="none"
                            data-bind="attr: { 'opacity': $data.modelcore.ImageOpacity,
                                               'visibility': $data.modelcore.ImageVisibility }, 
                                                xlinkHref: $data.modelcore.ImageUriString " />
                      @*<rect rx="2" height="100%" width="100%" x="0" y="0" stroke-width="0"  fill-opacity="0.2" fill="url(#ignatzprwttlg1)" />*@
                  </g>
                 </svg>
                 <div data-prwcornerradius="4"
                      style="text-align:left;
                             position:absolute;left:0;right:0;top:0;bottom:0;
                             
                             text-align:left;">
                      <div data-bind="html:  $data.modelcore.RTBHtml "
                           class="prwdesignereditable prwnoselect"
                           style="position:absolute;top:0;bottom:0;left:0;right:0;overflow:auto;
                                  line-height:1.45em;font-size:1em;
                                  padding-left:1em;padding-right:1em;padding-bottom:1em;
                                  margin:0;
                                  font-family:Arial, Helvetica, Verdana, Tahoma, sans-serif;
                                  white-space:normal;
                                  color:rgba(255,255,255,1);"></div>
                  </div>
            </div> 
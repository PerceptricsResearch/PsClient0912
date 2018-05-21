                              <div class="imageprwt defaultshadow ditouchdragobj" 
                                   data-prwcornerradius="4"
                                   style="position:absolute;left:2px;right:2px;top:2px;bottom:2px;
                                          margin:auto;background:rgba(0,0,0,0);">
                                 @*<div style="position:absolute;left:0;right:0;top:0;bottom:0;width:100%;height:100%;background:rgba(255,1,1,0);">*@

                                 @*</div>*@
                                 <svg  width="100%" height="100%" viewBox="0 0 400 300" style="background:rgba(0,0,0,0);"
                                      preserveAspectRatio="none"
                                      data-prwcornerradius="4"  
                                      xmlns:xlink="http://www.w3.org/1999/xlink"             
                                      version="1.2" baseProfile="tiny">
                                    <g>
                                        <defs>
                                            <linearGradient y2="0" x2="0" y1="1" x1="0" id="dimageprwtlg1">
                                                <stop stop-color="hsla(179,70%,57%,1)" offset="0%" />
                                                <stop stop-color="hsla(173,70%,28%,1)" offset="55%" />
                                                <stop stop-color="hsla(173,70%,20%,1)" offset="92%" />
                                                <stop stop-color="hsla(179,70%,57%,1)" offset="100%" />
                                            </linearGradient>
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
                                               height="100%" width="100%" x="1" y="1" stroke-width="0"/>
                                        <image height="100%" width="100%" x="1" y="1" preserveAspectRatio="none" 
                                               visibility="hidden"
                                               data-bind="attr: { 'opacity': $data.modelcore.ImageOpacity }, 
                                                                   xlinkHref: $data.modelcore.ImageUriString" />
                                        @*xlink:href='@Url.Content("~/Content/icon2.png")'*@
                                    </g>
                                 </svg>

                              </div> 

    <div class="questoptsetprwt defaultshadow ditouchdragobj" 
         data-prwcornerradius="4"
         data-bind="style: { 'border-color': $data.modelcore.BorderBrushStr },
                     attr: { 'id': $data.QuestOptSetModel.QosprwtID } "
          style="position:absolute;left:0%;right:0%;top:0%;bottom:0%;
                 height:99%;width:99%;margin:auto;
                 border:1px solid;">
           <svg  width="100%" height="100%" viewBox="0 0 400 300"
                 preserveAspectRatio="none"  
                 data-prwcornerradius="4"   
                 version="1.2" baseProfile="tiny">
                  <g>
                         <defs>
                           <radialGradient data-bind="attr: { 'id': $data.QuestOptSetModel.RsBackID }" >
                                <stop stop-color="#111122" offset="0%"/>
                                <stop stop-color="#111212" offset="93%"/>
                                <stop stop-color="#D5A500" offset="98%"/>
                                <stop stop-color="#FCAC00" offset="100%"/></radialGradient>
                            <linearGradient data-bind="attr: { 'id': $data.QuestOptSetModel.RsForeID }" 
                                            y2="0" x2="0" y1="1" x1="0">
                                <stop stop-color="#F5A500" offset="0%"/>
                                <stop stop-color="#EFA500" offset="70%"/>
                                <stop stop-color="#D5A500" offset="95%"/>
                                <stop stop-color="#E5A200" offset="100%"/></linearGradient>
                            <linearGradient id="qosprwtdefault"
                                            y2="0" x2="0" y1="1" x1="0">
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
                            <radialGradient data-bind="attr: { 'id': $data.QuestOptSetModel.RadioBtnOnBrushID }"
                                            fy="43%" fx="45%">
                                 <stop offset="0%" stop-color="hsla(135, 100%, 80%, 1)" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxForegroundStr()[0] }"/>
                                 <stop offset="12%" stop-color="hsla(130, 100%, 55%, 1)" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxForegroundStr()[1] }"/>
                                 <stop offset="60%" stop-color="hsla(130, 100%, 25%, 1)" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxForegroundStr()[2] }"/>
                                 <stop offset="94%"  stop-color="hsla(132, 100%, 2%, 1)" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxForegroundStr()[3] }"/>
                                 <stop offset="100%" stop-color="hsla(130, 100%, 20%, 1)" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxForegroundStr()[4] }"/>
                             </radialGradient>
                             <radialGradient data-bind="attr: { 'id': $data.QuestOptSetModel.RadioBtnOffBrushID }" 
                                             fy="62%" fx="65%">
                                  <stop offset="0%" stop-color="hsla(129, 20%, 32%, 1)" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxBackgroundStr()[0] }"/>
                                  <stop offset="60%" stop-color="hsla(129, 40%, 22%, 1)" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxBackgroundStr()[1] }"/>
                                  <stop offset="94%"  stop-color="hsla(132, 100%, 2%, 1)" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxBackgroundStr()[2] }"/>
                                  <stop offset="100%" stop-color="hsla(130, 49%, 20%, 1)" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxBackgroundStr()[3]}"/>
                              </radialGradient>
                              <linearGradient id="rbfixedborder"
                                              x1="0" y1="1" x2="0" y2="0">
                                   <stop stop-color="hsla(1,1%,47%,1)" offset="0%" />
                                   <stop stop-color="hsla(1,1%,24%,1)" offset="55%" />
                                   <stop stop-color="hsla(1,1%,20%,1)" offset="62%" />
                                   <stop stop-color="hsla(1,1%,42%,1)" offset="100%" />
                               </linearGradient>
                              <linearGradient data-bind="attr: { 'id': $data.QuestOptSetModel.BoxBackgroundBrushID }"
                                              x1="0" y1="1" x2="0" y2="0">
                                   <stop stop-color="hsla(1,1%,47%,1)" offset="0%" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxBackgroundStr()[0] }"/>
                                   <stop stop-color="hsla(1,1%,24%,1)" offset="55%" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxBackgroundStr()[1] }"/>
                                   <stop stop-color="hsla(1,1%,20%,1)" offset="92%" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxBackgroundStr()[2] }"/>
                                   <stop stop-color="hsla(1,1%,42%,1)" offset="100%" data-bind="attr: { 'stop-color': $data.modelcore.CheckBoxBackgroundStr()[3]}"/>
                               </linearGradient>
                          </defs>
                  </g>
                  <g>
                     <rect data-bind="attr: { 'fill': $data.modelcore.BackgroundBrushUrl,
                                              'fill-opacity':  $data.modelcore.BackgroundOpacity,
                                              'visibility': $data.modelcore.BackgroundVisibility }"
                           rx="2" height="100%" width="100%" x="0" y="0" stroke-width="0"/>
                     <image height="100%" width="100%" x="0" y="0" preserveAspectRatio="none"  
                            data-bind="attr: { 'opacity': $data.modelcore.ImageOpacity,
                                                'visibility': $data.modelcore.ImageVisibility }, 
                                       xlinkHref: $data.modelcore.ImageUriString " />
                  </g>
            </svg>
            <div data-prwcornerradius="4"
                 data-bind="foreach: $data.QuestOptSetModel.ItemsObservableColxn "
                 style="position:absolute;left:0%;right:0%;top:0%;bottom:0%;
                        margin:auto;height:100%;width:100%;">
                  <div class="qoimdeletableholder"
                       data-prwcornerradius="4" 
                       data-bind="style: { 'height': $data.xxheight, 'width': $data.xxwidth }"
                       style="float:left;overflow:hidden;" >
                       <div data-bind="style: { 'height': $data.netborderH, 'width': $data.netborderW, 
                                                'left': $data.xxborderlr, 'right': $data.xxborderlr,
                                                'top': $data.xxbordertb, 'bottom': $data.xxbordertb, 
                                                'border-color': $parent.modelcore.BorderBrushStr  },
                                        attr: { 'class': $parent.QuestOptSetModel.SvgDivClass }" 
                             style="position:relative;border: 1px solid;"
                             data-prwcornerradius="4">
                                <div 
                                     data-bind="style: { 'height': $parent.QuestOptSetModel.SelectorHeight, 
                                                         'width': $parent.QuestOptSetModel.SelectorWidth, 
                                                         'right': $parent.QuestOptSetModel.SelectorMarginRight, 
                                                         'top': $parent.QuestOptSetModel.SelectorMarginTopBottom, 
                                                         'bottom': $parent.QuestOptSetModel.SelectorMarginTopBottom }"
                                     style="left:0;position:absolute;">
                                     <svg viewBox="0 0 100 100" preserveAspectRatio="xMinYMid meet" version="1.2" baseProfile="tiny" >
                                       <g class="qosselectorgrp" data-bind="visible: $parent.QuestOptSetModel.SelectorsVisible">
                                          <path d="m1,5.53155c0,-2.46234 1.92192,-4.53155 4.20859,-4.53155l88.65686,0c2.28673,0 4.20811,2.06921 4.20811,4.53155l0,87.91361c0,2.46172 -1.92139,4.53097 -4.20811,4.53097l-88.65686,0c-2.28667,0 -4.20859,-2.06862 -4.20859,-4.53097l0,-87.91361z" 
                                                  stroke-width="3" stroke-linejoin="round" stroke-linecap="round" stroke="#aaaaaa"
                                                  data-bind="attr: { 'fill': $parent.QuestOptSetModel.BoxBackgroundBrushUrl,
                                                                     'fill-opacity': $parent.modelcore.CheckBoxBackgroundOpacity,
                                                                     'visibility': $parent.QuestOptSetModel.BoxVisible }"/>
                                            <path d="m33.87413,69.35192l46.26456,-59.36463l18.26665,-5.96076c-21.2466,17.8898 -37.25782,37.75099 -63.06121,87.82043c-12.94461,-20.21284 -14.1172,-18.22462 -33.79685,-37.98692l18.52476,0.58492l13.80208,14.90697l0,0l0,0l0,0z" 
                                                  stroke-linejoin="round" stroke-linecap="round" 
                                             data-bind="attr: { 'fill': $parent.modelcore.CheckBoxForegroundStr,
                                                                'stroke': $parent.modelcore.CheckBoxForegroundStr,
                                                                'visibility': $data.checkboxvisibility }"/>
                                            <circle  r="45" cy="50" cx="50" stroke-width="5" stroke-opacity="1" stroke-dasharray="null" 
                                                     stroke="url(#rbfixedborder)"
                                                     data-bind="attr: { 'fill': $data.modelcore.CheckBoxOnOffUrlStr,
                                                                        'visibility': $parent.QuestOptSetModel.RadioBtnVisible }"/>
                                        </g>
                                       <g class="qosrsltsitemgrp" data-bind="attr:{ 'visibility': $parent.QuestOptSetModel.ResultsVisible }">
                                            <rect fill="#A0A0A0" fill-opacity="0.3" rx="4" ry="4" height="100" width="100"/>
                                            <circle cx="50" cy="50" r="49" stroke="#444444" 
                                                    stroke-width=".1"  
                                                    opacity="0.4" 
                                                    data-bind="attr: { 'fill': $parent.QuestOptSetModel.RsBackURL }"/>
                                            <path opacity="1" fill-opacity="1"  stroke-width="1" 
                                                   d="m0,0"
                                                   data-bind="attr: { 'fill': $parent.QuestOptSetModel.RsForeURL,
                                                                      'stroke':  $parent.QuestOptSetModel.RsForeURL,
                                                                        'd': $data.PctPath }"/>
                                            <rect fill="#000000" fill-opacity="0.15" rx="4" ry="4" height="100" width="100"/>
                                            <text   font-size="32" x="10" y="50" fill="#FFFFFF"
                                                    data-bind="text: $data.PctString"/>
                                                    
                                       </g>
                                      </svg></div>
                                <div data-bind="style: { 'margin-left': $parent.QuestOptSetModel.OptionTextMarginLeft, 
                                                         'width': $parent.QuestOptSetModel.OptionTextWidth,
                                                         'color':  $parent.modelcore.ForegroundStr}"
                                      style="height:98%;padding:4;position:relative;"
                                      data-prwcornerradius="4">
                                      <div data-bind="html:  $data.modelcore.RTBHtml "
                                           class="prwdesignereditable prwnoselect"
                                           style="position:absolute;top:0;bottom:0;left:0;right:0;
                                                  line-height:1.45em;
                                                  padding-left:1em;padding-right:1em;padding-bottom:1em;
                                                  font-family:Arial, Helvetica, Verdana, Tahoma, sans-serif;
                                                  font-size:1em;"></div></div></div></div></div></div>
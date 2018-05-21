<div class="availablecontextscolxnitemcontainer" 
                         data-prwcornerradius="4">
                       <div class="availablecontextscolxnitem dashboardcontainer defaultshadow" 
                            data-prwcornerradius="4">
                          <div data-bind="availablecontextsxevent: $root.metricscontextset"
                                         class="activecontextsitemselector"
                                         data-prwcornerradius="4">
                                     <svg viewBox="0 0 100 100" preserveAspectRatio="xMinYMid meet" version="1.2" baseProfile="tiny" >
                                       <g class="acselectorgrp" >
                                          <circle  data-bind="attr: { 'fill': $data.BrushStr }"
                                                   fill="url(#acrboffbrush)"
                                                   r="45" cy="50" cx="50" stroke-width="5" stroke-opacity="1" stroke-dasharray="null" 
                                                   stroke="url(#rbfixedborder)"/>
                                       </g>
                                      </svg>
                          </div>
                          <div class="availablecontextscolxnitemcontent dashboardcontainerwrapper" 
                               data-prwcornerradius="4">
                            <div class="dashboardregionscontainer availablecontextcontentitem" 
                                 data-prwcornerradius="4">
                                 <span class="prwnoselect" data-bind="text: AsOfDate"></span>
                            </div>
                            <div data-bind="foreach: $data.ContextNamesColxn"
                                 class="dashboardregionscontainer availablecontextcontentitem"
                                 data-prwcornerradius="4">
                                 <span class="prwnoselect" data-bind="text: $data"></span>
                             </div> 
                            <div class="dashboardregionscontainer"
                                 data-prwcornerradius="4">
                                <span class="prwnoselect" data-bind="text: Description">some description goes here</span>
                            </div>
       
                          </div>
                       </div>
                    </div>
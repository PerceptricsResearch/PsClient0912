<div id="realizationrenticalroot"
     class="dashboardcontainer"
     data-prwcornerradius="4">
     <div style="position:relative;height:1px;padding:0em;margin:0em;">
            <svg  viewBox="0 0 1 1" preserveAspectRatio="none" version="1.2" baseProfile="tiny">
               <defs>
                           <linearGradient id="realsvgxxx" y2="0" x2="0" y1="1" x1="0">
                                <stop stop-color="hsla(229,50%,57%,1)" offset="0%" />
                                <stop stop-color="hsla(220,50%,28%,1)" offset="55%" />
                                <stop stop-color="hsla(229,50%,20%,1)" offset="92%" />
                                <stop stop-color="hsla(220,50%,57%,1)" offset="100%" />
                            </linearGradient>
                </defs>
            </svg>
     </div>
     <div id="realizationrenticalrootcontainerwrapper"
          class="dashboardcontainerwrapper" 
          data-prwcornerradius="4">
          <div id="realizationrenticalrootcontainer"
                class="dashboardtitle"
                data-prwcornerradius="4">
                
                    <span>Realization Model</span>
                    <div class="metricsbackcanceldonecontainer prwnoselect">
                        <div id="realizerenticlebackcancel" style="display:none;" class="metricsbackcancel defaultshadow" data-prwcornerradius="4"><span>Back</span></div>
                        <div id="realizerenticledoneedit" style="display:none;" class="metricseditdone defaultshadow" data-prwcornerradius="4"><span>Done</span></div>
@*                        <div data-bind="realizexevent: realize"
                            class="realizerefresh prwbutton metricsbackcancel defaultshadow"
                            data-prwcornerradius="4"  
                            style="position:relative;font-size:0.75em;"><span>Refresh</span></div>*@
                    </div>
                
                @*<div style="display:none;"
                    class="dashboardcontainer">
                    <div id="parameteritemsroot" data-bind="foreach: realizeobjects.parameters"
                       class="dashboardregion" style="display:none;"
                       data-prwcornerradius="4">
                       <div class="realizeparameteritem">
                            <div data-prwcornerradius="4" 
                                class="defaultshadow ellipsis"
                                style="display:inline-block;vertical-align:top;padding:0.5em;margin-bottom:0.25em;
                                    font-size:0.75em;line-height:1.25em;text-align:center;
                                    background:rgba(235,245,235,0.6);"><span data-bind="text: Name">parmname</span>
                                <div class="realizeparametervalue" 
                                     style="position:relative;margin:auto;text-align:center;">
                                     <input style="position:relative;margin:auto;text-align:center;" type="number" data-bind="value: Value"/>
                                </div>   
                            </div>
                       </div>
                  </div>
                </div>*@
       </div>
      <div id="realizesvgroot"
           data-prwcornerradius="4" 
           class="dashboardregion">
        <div id="realizesvg" 
             data-bind="realizederived: realizechange"
             class="prwnoselect"
             data-prwcornerradius="4">
         <svg id="realizechartsvg" viewBox="0 0 1400 1400" style="position:absolute;top:0em;left:0em;bottom:0em;right:0em;"
              preserveAspectRatio="xMidYMid meet" version="1.2" baseProfile="tiny">
            <g>
              <g>
                <rect fill="url(#realsvgxxx)" stroke="hsla(205,100%,29%,1)" stroke-width="1" 
                      x="0" y="0" width="100%" height="100%" rx="4"/>
               </g>
               <g id="realizeaxisgroup">
                  <polyline  points="200,1200 1200,1200" stroke="hsl(1,100%,100%)" stroke-width="10"/>
                  <polyline  points="200,1200 200,200" stroke="hsl(1,100%,100%)" stroke-width="10"/>
                  <g data-bind="foreach: realizeobjects.xaxislabels">
                    <circle data-bind="attr: {'cx': $data.x }" cx="200" cy="1200"
                        r=5 stroke-width="1" fill="hsla(35,100%,39%,1)"/>
                    <text data-bind="text: $data.value,
                                     attr: {'x': $data.x }" fill="hsla(1, 99%, 99%, 1)" 
                          y="1250"
                          stroke="#000000" 
                          stroke-width="0" font-size="38" 
                          text-anchor="middle"/>
                  </g>
                  <g data-bind="foreach: realizeobjects.yaxislabels">
                    <circle data-bind="attr: {'cy': $data.y }" cx="200" cy="900"
                        r=5 stroke-width="1" fill="hsla(35,100%,39%,1)"/>
                    <text data-bind="text: $data.value,
                                     attr: {'y': $data.y }" fill="hsla(1, 99%, 99%, 1)" 
                          x="90"
                          stroke="#000000" 
                          stroke-width="0" font-size="38" 
                          text-anchor="start"/>
                  </g>
                  <g id="realizeaxisxmarker">
                    <rect data-bind="attr: {'x': realizeobjects.axisxmarker.currentposition }"
                          fill="hsl(1,100%,45%)" stroke="hsl(1,100%,65%)" stroke-width="3" 
                          x="0" y="1180" width="5" height="40" rx="4"/>
                    <text data-bind="text: realizeobjects.revenueobject.xdisplayvalue,
                                     attr: {'x': realizeobjects.axisxmarker.currentposition }" 
                       x="0" y="1160"
                       fill="hsla(1, 99%, 99%, 1)" stroke="#000000" 
                       stroke-width="0" font-size="36" 
                       text-anchor="middle"/>
                  </g>
                  <g id="realizeaxisymarker">
                     <rect data-bind="attr: {'y': realizeobjects.axisymarker.currentposition }"
                           fill="hsl(1,100%,45%)" stroke="hsl(1,100%,65%)" stroke-width="3" 
                           x="180" y="1180" width="40" height="5" rx="4"/>
                     <text data-bind="text: realizeobjects.revenueobject.ydisplayvalue,
                                      attr: {'y': realizeobjects.axisymarker.currentposition }" 
                       x="210" y="133"
                       fill="hsla(1, 99%, 99%, 1)" stroke="#000000" 
                       stroke-width="0" font-size="36" 
                       text-anchor="start"/>
                  </g>
                <polyline id="realizeaxisx" points="200,1200 1200,1200" stroke="hsla(1,100%,100%,.01)" stroke-width="95"/>
                <polyline id="realizeaxisy" points="145,1200 145,200" stroke="hsla(1,100%,100%,.01)" stroke-width="135"/>
                <g transform="rotate(270,50,700)">
                    <text x="20"y="700"
                    fill="hsla(1, 99%, 99%, 1)"
                      stroke="#000000" 
                      stroke-width="0" font-size="38" 
                      text-anchor="middle">Deployable Hours</text>
                </g>
                 <g >
                    <text x="700"y="1350"
                    fill="hsla(1, 99%, 99%, 1)"
                      stroke="#000000" 
                      stroke-width="0" font-size="38" 
                      text-anchor="middle">Rate Per Hour</text>
                </g>

               </g>

               <g id="realizetestlinesgroup" data-bind="foreach: realizeobjects.testlines">
                <polyline data-bind="attr: {'points': points}"  points="200,1200 1200,1200" stroke="hsl(35,100%,59%)" stroke-width="4"/>
               </g>
               <g id="realizecostcurve" transform="translate(-3,3)"
                  data-bind="foreach: realizeobjects.paths">
                  <path data-bind="attr: { 'd': $data.pathd }" d="m200,200 C200 200, 1200 1200, 1200 1200" 
                        stroke="hsla(39, 100%, 50%, 1)" stroke-width="6" fill="transparent" />
@*                    <path data-bind="attr: { 'd': realizeobjects.pathd }" d="m200,200 C200 200, 1200 1200, 1200 1200" 
                          stroke="hsla(39, 100%, 50%, 1)" stroke-width="8" fill="transparent" 
                          id="realizecostcurvepath"/>*@
               </g>
               <g>
                 <text x="800" y="60"
                       fill="hsla(1, 99%, 99%, 1)" stroke="#000000" 
                       stroke-width="0" font-size="38" 
                       text-anchor="end">Implied Revenue:</text>
                 <text data-bind="text: realizeobjects.revenueobject.revenuedisplayvalue" 
                       x="900" y="60"
                       fill="hsla(1, 99%, 99%, 1)" stroke="#000000" 
                       stroke-width="0" font-size="38" 
                       text-anchor="middle"/>
                 <text x="800" y="100"
                       fill="hsla(1, 99%, 99%, 1)" stroke="#000000" 
                       stroke-width="0" font-size="38" 
                       text-anchor="end">Contribution to Profit:</text>
                 <text data-bind="text: realizeobjects.revenueobject.contributiondisplayvalue" 
                       x="900" y="100"
                       fill="hsla(1, 99%, 99%, 1)" stroke="#000000" 
                       stroke-width="0" font-size="38" 
                       text-anchor="middle"/>
                <text x="800" y="140"
                       fill="hsla(1, 99%, 99%, 1)" stroke="#000000" 
                       stroke-width="0" font-size="38" 
                       text-anchor="end">Impl Utilization:</text>
                 <text data-bind="text: realizeobjects.revenueobject.impliedutilization" 
                       x="900" y="140"
                       fill="hsla(1, 99%, 99%, 1)" stroke="#000000" 
                       stroke-width="0" font-size="38" 
                       text-anchor="middle"/>
               </g>
@*               <g data-bind="foreach: realizeobjects.plots">
                    <circle data-bind="attr: {'cx': $data.x, 'cy': $data.y }" cx="500" cy="900"
                        r=4 stroke-width="1" fill="hsla(1,100%,60%,1)"/>
               </g>*@
@*               <g data-bind="foreach: realizeobjects.points">
                    <circle data-bind="attr: {'cx': $data.x, 'cy': $data.y }" cx="500" cy="900"
                        r=25 stroke-width="1" fill="hsla(190,100%,39%,0.5)"/>
                    <text data-bind="text: $data.slope,
                                     attr: {'x': $data.x, 'y': $data.y }" fill="hsla(1, 99%, 99%, 1)" stroke="#000000" 
                          stroke-width="0" font-size="38" 
                          text-anchor="middle"/>
               </g>*@
@*               <g data-bind="foreach: realizeobjects.controlpoints">
                    <circle data-bind="attr: {'cx': $data.x, 'cy': $data.y }" cx="500" cy="900"
                        r=15 stroke-width="1" fill="hsla(150,100%,49%,0.6)"/>
               </g>
               <g data-bind="foreach: realizeobjects.testparms">
                    <circle data-bind="attr: {'cx': $data.x, 'cy': $data.y }" cx="500" cy="900"
                        r=15 stroke-width="1" fill="hsla(15,100%,59%,0.8)"/>
                    <text data-bind="text: $data.name,
                                     attr: {'x': $data.x, 'y': $data.y }" fill="hsla(1, 99%, 99%, 1)" stroke="#000000" 
                          stroke-width="0" font-size="38" 
                          text-anchor="middle"/>

               </g>*@
               <g id="realizerenticleobjectgroup" data-bind="attr: { 'transform': realizeobjects.renticleposition }" transform="translate(0,0)">
@*                    <polyline points="125,200 275,200" stroke="hsla(1,100%,60%,0.4)" stroke-width="3"/>
                    <polyline points="200,125 200,275" stroke="hsla(1,100%,60%,0.4)" stroke-width="3"/>*@
                    <circle id="renticleinnercircle"
                    cx="200" cy="200"
                    stroke="hsla(1,20%,80%,0.0)" stroke-width="1" r="2" fill="hsla(1,100%,100%,0.0)"/>
@*                    <circle 
                    cx="200" cy="200"
                    stroke="hsla(1,100%,100%,0.5)" stroke-width="5" r="95" fill="hsla(1,100%,90%,0.01)"/>*@
               </g>
               </g>
          </svg>
            <div id="renticleholder" style="position:absolute;top:2em;left:5em;width:6em;height:6em;font-size:0.75em;color:rgb(255,255,255);background:rgba(220,220,220,0.01);">
                     <svg viewBox="0 0 400 400" 
                            preserveAspectRatio="xMidYMid meet" version="1.2" baseProfile="tiny">
                    <g>
                    <polyline points="125,200 275,200" stroke="hsla(1,100%,60%,0.8)" stroke-width="3"/>
                    <polyline points="200,125 200,275" stroke="hsla(1,100%,60%,0.8)" stroke-width="3"/>
                    <circle 
                    cx="200" cy="200"
                    stroke="hsla(1,20%,80%,0.3)" stroke-width="3" r="50" fill="hsla(1,100%,100%,0.0)"/>
                    <circle 
                    cx="200" cy="200"
                    stroke="hsla(1,100%,100%,0.5)" stroke-width="5" r="95" fill="hsla(1,100%,90%,0.01)"/>
                    </g>
                </svg>
            </div>
        </div>
      </div>
     </div>
</div>
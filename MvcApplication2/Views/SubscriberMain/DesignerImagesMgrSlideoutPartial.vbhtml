<div id="dsgnrimagesmgrpanel" 
     data-prwtype="dsgnrimagesmgrpanel"
     data-prwcornerradius="12"
     style="position:relative;
            padding:0.25em;
            padding-top:0em;
            background-color: hsla(189, 100%, 2%, 0.1)">
     <div style="position:relative;padding:0em;height:2em;">
        <div style="position:relative;height:2em;width:10em;margin:auto;">
           <svg viewBox="0 0 220 40" preserveAspectRatio="none slice" 
                version="1.2" baseProfile="tiny" >
                <g>
                    <defs>
                        <linearGradient id="dimageslg1" x1="0" y1="1" x2="0" y2="0">
                            <stop stop-color="hsla(179,70%,57%,1)" offset="0%" />
                            <stop stop-color="hsla(173,70%,28%,1)" offset="55%" />
                            <stop stop-color="hsla(173,70%,20%,1)" offset="92%" />
                            <stop stop-color="hsla(179,70%,57%,1)" offset="100%" />
                        </linearGradient>
                        
                        

                    </defs>
                    <rect  fill="url(#dstyleslg3)"  x="0" y="0"
                        width="100%" height="100%" rx="12" stroke="#000000" stroke-width="0" />
                    <text fill="hsla(179, 94%, 94%, 0.9)" x="50%" y="60%"  font-size="14"
                       text-anchor="middle" alignment-baseline="middle" >Images</text>
                    <text 
                    fill="hsla(179, 94%, 94%, 0.9)"  x="15%" y="60%"
                    stroke-width="0"   font-size="14" 
                    text-anchor="middle" >Back</text>
                    <text 
                    fill="hsla(179, 94%, 94%, 0.9)"  x="85%" y="60%"
                    stroke-width="0"   font-size="14" 
                    text-anchor="middle" >More</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="100%" height="100%" rx="12"/>
                <rect id="dsgnrimgbackbtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="0" y="1%" width="30%" height="98%" rx="12"/>
                <rect id="dsgnrimgmorebtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="69%" y="1%" width="30%" height="98%" rx="12"/>
                </g>
            </svg>
        </div>
     </div>
    <div data-prwcornerradius="4"
        style="position:relative;
               padding:0.5em;min-height:15em;background:rgb(240,245,240);overflow:auto;">
        <div style="position:relative;
                    display:inline-block;
                    vertical-align:top;
                    height:15em;width:13.5em">
            <div id="dsgnrimagesavailablelist"
         data-prwcornerradius="4" 
         data-bind="foreach: { data: currentimgurlcolxn, afterAdd: widgetizeAddedImage }"
         style="position:relative;
                padding:0.25em;
                font-size:4;overflow:hidden;
                border: 1px solid rgba(255,255,255,0.2)">
                   <div data-prwcornerradius="4"
                        style="position:relative;
                               display:inline-block;
                               vertical-align:top;
                               height:3.5em;width:3.5em;
                               margin:0.25em;">
@*                        <img  data-bind="attr: { 'src': $data }"  alt=""
                            class="dsngimgsimagethumbnail"                             style="	background-repeat:no-repeat;
	                                background-size:90% 90%;
	                                background-position:center center;"data-bind="style: { 'background-image': $data} "
                            data-prwcornerradius="4" />*@
                        <div 
                             class="dsgnimgsthumbnaildeletable">
                          <svg class="dtlbxsvgpartssquare" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet" >
                          <defs>
                                <clipPath id="imgclippath">
                                    <rect x="0" y="0" width="50" height="50" rx="6" stroke="#000000" stroke-width="0"/>
                                </clipPath>
                          </defs>
                            <image   height="50" width="50" x="0" y="0"
                                  clip-path="url(#imgclippath)"
                                  preserveAspectRatio="none"
                                  data-bind="xlinkHref: $data " />
                           <g class="dsgnimgremovablemarker" visibility=hidden>
                            <ellipse ry="25" rx="25" cy="25" cx="25" stroke="#e5e5e5" fill="rgba(200,200,200,0.3)" />
                            <path d="m15.7455,10.7146l-8.7455,-3.75221l15.6039,13.94791l-13.25925,12.4747l-1.97971,7.3054l18.07036,-16.9561l18.611,17.7813l-3.4353,-6.9006l-12.7373,-13.5929l9.6832,-9.1967l3.8909,-6.8254l-16.0857,13.7558" 
                                    fill="hsla(1, 95%, 29%, 1)" />
                            </g>
                           </svg></div></div></div>
            <div style="position:relative;padding:0em;height:2em;">
                <div style="position:relative;height:2em;width:10em;margin:auto;">     
                <svg viewBox="0 0 220 40" preserveAspectRatio="none slice" 
                version="1.2" baseProfile="tiny">
                    <rect  fill="url(#dstyleslg3)"  x="0" y="0"
                        width="100%" height="100%" rx="8" stroke="#000000" stroke-width="0" />
                    <text 
                    fill="hsla(179, 94%, 94%, 0.9)"  x="15%" y="60%"
                    stroke-width="0"   font-size="14" 
                    text-anchor="middle" >Add </text>
                    <text 
                    fill="hsla(179, 94%, 94%, 0.9)"  x="50%" y="60%"
                    stroke-width="0"   font-size="14" 
                    text-anchor="middle" >No Image</text>
                    <text 
                    fill="hsla(179, 94%, 94%, 0.9)"  x="85%" y="60%"
                    stroke-width="0"   font-size="14" 
                    text-anchor="middle" >Remove</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="100%" height="100%" rx="8"/>
                <rect id="dsgnrimgAddbtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="0" y="1%" width="30%" height="98%" rx="8"/>
                <rect id="dsgnrimgnoimagebtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="34%" y="1%" width="31%" height="98%" rx="8"/>
                <rect id="dsgnrimgRemovebtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="69%" y="1%" width="30%" height="98%" rx="8"/>         
     </svg>
                </div>
            </div>
        </div>

      <div id="dsgnimgbrowseandpastecntrl" data-prwcornerradius="4" 
           style="position:relative;                  
                  display:inline-block;
                  vertical-align:top;
                  height:14.5em;width:13.5em;margin-top:6px;margin-left:1%;display: none;
                  border: 1px solid rgba(255,255,255,0.2);">

           <div style="position:relative;height:40%;width:98%;margin-top:5px;"> 
            @Using Html.BeginForm("UploadImage", "SubscriberMain", FormMethod.Post,
                    New With {.enctype = "multipart/form-data", .id = "dsgnrimagesimgform",
                                .name = "dsgnrimagesimgform", .target = "dsgnrimagesuploadtarget"})
                @<div style="height:98%;width:98%;margin:auto;">
                    <input id="dsgnrimagesinputbrowseelement" type="file"  name="imageFile"  style="margin-left:2%;width:95%;height:49%;"/>
                    <input id="dsgnrimagessaveimagebtn" type="button" value="Save" style="margin-left:24%;margin-top:5%;width:50%;height:44%;"/>
                </div>           
            End Using
            
            @*<iframe id="dsgnrimagesuploadtarget" name="dsgnrimagesuploadtarget" style="position: absolute; left: -999em; top: -999em;"></iframe>*@
           </div>

           <textarea id="dsgnrimagesinputurlelement" rows="3" cols="30"
                    style="width:80%;margin-left:9%;font-size:8px;height:15%;margin-top:5%;
                    border: 1px solid rgba(255,255,255,0.2)">Paste Image Url</textarea>
           <svg  preserveAspectRatio="none slice" 
                style="width:50%;height:15%;margin-left:25%;margin-top:2%;"
                version="1.2" baseProfile="tiny">
                    <rect  fill="url(#dstyleslg3)"  x="0" y="0"
                            width="100%" height="100%" rx="12" stroke="#000000" stroke-width="0" />
                    <text fill="hsla(179, 94%, 94%, 0.9)"  x="50%" y="60%"
                            stroke-width="0"   font-size="14" 
                            text-anchor="middle" >Go</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="100%" height="100%" rx="12"/>
                <rect id="dsgnrimagesurlgobtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="0" y="1%" width="100%" height="98%" rx="12"/>         
           </svg>

      </div>

      <div id="dsgnimgopacitycntrl" data-prwcornerradius="4" 
           style="position:relative;
                  display:inline-block;
                  vertical-align:top;
                  height:8em;width:10em;
                  padding:0.25em;display: none;
                  border: 1px solid rgba(255,255,255,0.2);">
          
            <div id="imagesspinnercontainer" 
                        data-prwcornerradius="12"
                        style='height:35%;width:60%;margin:auto;margin-top:1%;
                                background-image:url("@Url.Content("~/Content/testsvg1.svg")");'>

                        <div id="imagesspinnernumeric" data-prwcornerradius="4"
                             style="height:100%;width:100%;margin:auto;overflow:hidden;" >

                        <svg id="imagesspinnersvg" width="492px"  height="90%" viewBox="0 0 138 20" 
                                    preserveAspectRatio="none"   
                                   version="1.2" baseProfile="tiny" >
                         <g id="imagestouchabletextitemsgroup" >
                           <rect x="0" width="18" height="100%" y="0"  fill-opacity="0"></rect>
                           <use x="19" width="100"  y="50%" xlink:href="#dstyleseg1"></use>
                           <rect x="120" width="18" height="100%" y="0"  fill-opacity="0"></rect>
                         </g>

                        </svg>
                        </div>

                    </div>
                    <div data-prwcornerradius="12"
                        style='height:55%;width:80%;margin:auto;margin-top:2%;'>
                        <svg viewBox="0 0 220 80" preserveAspectRatio="none slice" 
                                version="1.2" baseProfile="tiny">
                            <g>
                                <rect rx="4" height="36.75%" width="98%" y="2" x="2" stroke-width="3" stroke="url(#dstyleslg9)" fill="url(#dstyleslg9)" />
                                <text y="25.63%" x="51.14%" text-anchor="middle" fill="hsla(178, 94%, 94%, 1)" font-size="14" >Opacity</text>
                                <rect rx="4" height="59%" width="100%" y="41%" x="0" stroke-width="0" stroke="#000000" fill="url(#dstyleslg9)" />
                                <rect rx="4" height="45%" width="27%" y="47%" x="1%" stroke-width="3" stroke="url(#dstyleslg9)" fill="url(#dstyleslg9)" />
                                <rect rx="4" height="45%" width="27%" y="47%" x="71%" stroke-width="3" stroke="url(#dstyleslg9)" fill="url(#dstyleslg9)" />
                                <text y="74%" x="15%" text-anchor="middle" fill="hsla(178, 94%, 94%, 1)" font-size="14" >Less</text>
                                <text y="74%" x="84.5%" text-anchor="middle" fill="hsla(178, 94%, 94%, 1)" font-size="14" >More</text>
                                <rect id="dimagesrectbackbtn" class="prevdsgnstyles" rx="4" height="45%" width="27%" y="47%" x="1%" stroke-width="0" fill-opacity="0" />
                                <rect id="dimagesrectmorebtn" class="nextdsgnstyles" rx="4" height="45%" width="27%" y="47%" x="71%" stroke-width="0" fill-opacity="0" />
                            </g>
                        </svg>
                    </div> 
                  
      </div>

    </div>

</div>
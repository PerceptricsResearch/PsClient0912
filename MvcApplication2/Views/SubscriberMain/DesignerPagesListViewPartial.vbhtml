<div id="designerpageslistpanel" 
     data-prwtype="designerpageslistpanel"
     data-prwcornerradius="4">
    <div id="designerpageslistpanelactions" data-prwtype="designerpageslistpanelscrollverticalactions" data-prwcornerradius="4"
            style="height:1.75em;">
                <svg   preserveAspectRatio="xMidYMid meet" 
             version="1.2" baseProfile="tiny">
             <g>
               <defs>
                <linearGradient id="dplg0" x1="0" y1="1" x2="0" y2="0">
    <stop stop-color="hsla(35,70%,47%,1)" offset="0%"/>
    <stop stop-color="hsla(29,70%,28%,1)" offset="55%"/>
    <stop stop-color="hsla(29,70%,20%,1)" offset="92%"/>
    <stop stop-color="hsla(35,70%,47%,1)" offset="100%"/>
                </linearGradient>
                                <linearGradient id="plg0" x1="0" y1="1" x2="0" y2="0">
    <stop stop-color="hsla(35,100%,57%,1)" offset="0%"/>
    <stop stop-color="hsla(29,100%,22%,1)" offset="55%"/>
    <stop stop-color="hsla(29,100%,18%,1)" offset="92%"/>
    <stop stop-color="hsla(35,100%,57%,1)" offset="100%"/>
                </linearGradient>
                                <linearGradient id="plg1" x1="0" y1="1" x2="0" y2="0">
    <stop stop-color="hsla(235,40%,37%,1)" offset="0%"/>
    <stop stop-color="hsla(235,30%,12%,1)" offset="55%"/>
    <stop stop-color="hsla(235,30%,8%,1)" offset="92%"/>
    <stop stop-color="hsla(235,40%,37%,1)" offset="100%"/>
                </linearGradient>
                </defs>
                <rect id="dplrectbackgound" fill="url(#dplg0)" stroke="#000000" stroke-width="0" x="0" y="0" width="100%" height="100%" rx="4" fill-opacity="1"/>
                <text 
                    fill="hsla(179, 94%, 100%, 1)"  x="50%" y="60%"
                    stroke-width="0"   font-size="14" 
                    text-anchor="middle" >Pages</text>
                    
                @*<rect  fill="url(#dplg1)" stroke="#000000" stroke-width="0" x="0" y="1%" width="30%" height="98%" rx="12" fill-opacity="1"/>*@
@*                    <text 
                    fill="hsla(179, 94%, 100%, 1)"  x="15%" y="60%"
                    stroke-width="0"   font-size="14" 
                    text-anchor="middle" >Back</text>*@
                @*<rect  fill="url(#dplg1)" stroke="#000000" stroke-width="0" x="69%" y="1%" width="30%" height="98%" rx="12" fill-opacity="1"/>*@
@*                    <text 
                    fill="hsla(179, 94%, 100%, 1)"  x="85%" y="60%"
                    stroke-width="0"   font-size="14" 
                    text-anchor="middle" >More</text>*@
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="100%" height="100%" rx="4"/>
                @*<rect id="dplrectbackbtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="0" y="1%" width="30%" height="98%" rx="4"/>*@
                <rect id="dplrectpagesbtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="33%" y="1%" width="33%" height="98%" rx="4"/>
                @*<rect id="dplrectmorebtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="69%" y="1%" width="30%" height="98%" rx="4"/>*@
             </g>
        </svg>
    </div>
    <div id="dplpulwrapper" data-prwcornerradius="4" >
    <ul id="dplpul" 
        data-bind="foreach: pageslist"
        style="position:relative;padding:0em;
                list-style:none;background:rgba(250,250,250,0.2);">
    <li class="prwdpageicon" data-bind="attr: {'data-prwpgnum': $data}"
        style="width:7em;margin:auto;margin-bottom:0.5em;height:2.5em" >
        @*<div style="width:19%;margin-left:96%;height:5px;background-color: hsla(20, 100%, 25%, 1)" ></div>*@
        <div class="defaultshadow"
            data-prwcornerradius="12"
            style="height:100%;width:100%;margin:0;text-align:center;padding:0;">
        <svg width="100%" height="100%"  preserveAspectRatio="none" 
             version="1.2" baseProfile="tiny">
             <g>
                <rect class="prwdpageiconrect" fill="url(#plg1)" stroke="#000000" stroke-width="0" x="0" y="0" width="100%" height="100%" rx="8" fill-opacity="1"/>
                <text data-bind="text: 'Page '+ $data"
                    fill="hsla(179, 94%, 94%, 0.9)"  x="50%" y="50%"
                    stroke-width="0"   font-size="14" 
                    text-anchor="middle" >Page 1</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="100%" height="100%" rx="8"/>
             </g>
        </svg>
        </div>
        @*<div style="width:19%;margin-left:96%;height:5px;background-color: hsla(89, 100%, 25%, 1)" ></div>*@
    </li>
    </ul>
    </div>
    
    <div id="dplpagemenu" >
    <svg  viewBox="0 0 400 200"  preserveAspectRatio="none" data-prwcornerradius="12"
             version="1.2" baseProfile="tiny" style="max-height:300px;">
             <g>
               <defs>
                <linearGradient id="dplg3" x1="0" y1="1" x2="0" y2="0">
    <stop stop-color="hsla(35,100%,57%,1)" offset="0%"/>
    <stop stop-color="hsla(29,70%,28%,1)" offset="55%"/>
    <stop stop-color="hsla(29,70%,20%,1)" offset="92%"/>
    <stop stop-color="hsla(35,100%,57%,1)" offset="100%"/>
                </linearGradient>
                </defs>
                <rect id="dplpgmenurectbackgound" fill="url(#dplg3)" stroke="#000000" stroke-width="0" x="0" y="0" width="100%" height="100%" rx="12" fill-opacity="1"/>
                <text 
                    fill="hsla(179, 94%, 99%, 1)"  x="50%" y="16%"
                    stroke-width="0"   
                    text-anchor="middle" >Copy</text>
                 <text 
                    fill="hsla(179, 94%, 99%, 1)"  x="50%" y="40%"
                    stroke-width="0"   
                    text-anchor="middle" >Cut</text>
                    <text 
                    fill="hsla(1, 100%, 49%, 1)"  x="50%" y="64%"
                    stroke-width="1"   
                    text-anchor="middle" >Remove</text>


                    <text 
                    fill="hsla(222, 100%, 39%, 1)"  x="50%" y="88%"
                    stroke-width="1"   
                    text-anchor="middle" >UnDo</text>
                @*<rect  fill="url(#dplg1)" stroke="#000000" stroke-width="0" x="0" y="1%" width="30%" height="98%" rx="12" fill-opacity="1"/>*@
                      <path d="m72.31197,32.08656c0.29832,-0.02131 -15.63261,-2.01472 -16.46072,-2.44865c0.94013,0.16245 16.75772,1.02171 17.08931,0.92134c0.2542,-0.2881 -8.61798,-8.2784 -8.65981,-8.7945c0.92591,-0.01643 10.34303,7.67977 10.67658,7.62655c0.40237,-0.20337 5.64697,-9.49584 6.3391,-10.1216c0.46263,-0.59744 -3.8159,10.43724 -4.16427,10.65212c0.28316,-0.00826 13.09243,-5.95853 13.15038,-5.71574c-0.42838,0.54591 -12.50271,7.21978 -12.19154,7.07216c-0.2654,-0.10538 20.36139,2.21137 20.44601,2.1537l-20.96559,-0.67269l12.65416,11.93636l-14.65151,-10.93512l-6.61042,13.35994l4.52679,-13.75107l-14.67456,4.75576l13.49611,-6.03856l0,0l0,0zm-29.77823,19.20767c-1.42626,-0.89045 -0.77283,-6.77164 -0.95142,-6.94748c-0.1786,-0.17583 -0.43645,-21.80698 0.01662,-32.66547c3.27317,-1.06217 7.38792,-0.11122 10.81194,-0.42284c10.23704,-0.01528 20.47403,0.03611 30.71136,0.05496c-0.31116,1.49083 0.38656,8.22286 0.1159,8.82878c-0.86269,0 -1.33881,-3.83277 -1.62165,-3.83277c0.67532,-3.20682 -10.64529,-2.03062 -9.46288,-2.06159c0.21568,0.04721 -16.7305,0.14959 -25.09454,0.26557c-2.21532,0.49529 -1.55639,2.59217 -1.67957,4.0265c0.13434,9.33712 0.44238,26.75988 0.36635,28.01266c-0.07607,1.25245 5.41382,1.46802 8.15041,1.49118c2.73663,0.02315 27.58228,-0.74152 27.55363,-0.18804c-0.02832,0.55348 -1.56042,0.43146 -2.3635,0.362c-0.80276,-0.06915 -24.34783,3.15069 -25.44018,3.2433l-3.67077,-0.01032l-7.44169,-0.15644l0,0l0,0l0.00003,0l-0.00003,0z" 
                      fill="hsla(36, 100%, 63%, 0.8)" />
                      <rect id="dplrectpgmenunewpagebtn" fill="hsla(35,70%,47%,1)" fill-opacity="0.4" stroke="#000000" stroke-width="0" x="0" y="2%" width="33%" height="96%" rx="12"/>

                    <text 
                    fill="hsla(179, 99%, 99%, 1)"  x="17%" y="16%"
                    stroke-width="0"   
                    text-anchor="middle" >New Page</text>
                    <text 
                    fill="hsla(179, 99%, 99%, 1)"  x="17%" y="42%"
                    stroke-width="0"   
                    text-anchor="middle" >Before</text>
                    <text 
                    fill="hsla(179, 99%, 99%, 1)"  x="17%" y="72%"
                    stroke-width="0"   
                    text-anchor="middle" >After</text>
                @*<rect  fill="url(#dplg1)" stroke="#000000" stroke-width="0" x="69%" y="1%" width="30%" height="98%" rx="12" fill-opacity="1"/>*@
                      <path d="m302.5,9.99998c0,13.63482 0,27.27122 0,40.90602c22.54166,0 45.08334,0 67.625,0c0,-13.6348 0,-27.2712 0,-40.90602c-22.54166,0 -45.08334,0 -67.625,0zm4.72977,2.24062c19.63,0.0269 39.26102,0.0553 58.89206,0.0821c0.06854,11.83 0.13708,23.66 0.20773,35.49c-19.66687,-0.0158 -39.33163,-0.03 -58.99747,-0.0458c-0.03375,-11.8426 -0.06854,-23.6837 -0.10233,-35.5263l0,0zm11.68478,1.5158c-3.62143,0.6032 -1.9942,4.0265 -2.57953,5.8645c-0.08224,8.5251 0.43661,17.0502 0.43344,25.5753c0.10126,1.5459 2.67233,1.0975 4.17404,1.1717c10.90646,0.0584 21.81824,0.0237 32.7226,0.1421c2.72507,0.5811 3.16797,-1.4022 2.92963,-2.798c0.04535,-9.5752 -0.12759,-18.8503 -0.13605,-28.4176c-1.14423,-2.209 -5.62512,-1.129 -8.18039,-1.5711c-9.93625,-0.0221 -19.42853,0.0663 -29.36374,0.0331l0,0l0,0l0,0l0,0zm2.81149,2.8754c10.04279,0.0948 20.08875,-0.0394 30.13361,0.0537c0.21936,8.7304 -0.26047,17.4608 -0.04007,26.1912c-9.97424,-0.1864 -19.95163,0.1058 -29.92581,-0.0805c-0.05591,-8.7225 -0.11392,-17.4434 -0.16772,-26.1644l0,0l0,0l0,0zm23.79663,4.8255c-6.31378,0.0363 -12.62543,0.0726 -18.93921,0.109c0.04849,0.9616 0.09491,1.9232 0.14236,2.8848c6.26633,-0.0079 12.53159,-0.0173 18.79684,-0.0268c0,-0.9885 0,-1.977 0,-2.967l0,0l0,0l0,0l0,0l0,0zm0,4.546c-6.31378,0.0363 -12.62543,0.0726 -18.93921,0.1089c0.04849,0.9617 0.09491,1.9233 0.14236,2.8849c6.26633,-0.0095 12.53159,-0.0189 18.79684,-0.0268c0,-0.9901 0,-1.9785 0,-2.967l0,0l0,0l0,0l0,0zm0.2215,4.4718c-6.31799,0.0363 -12.63705,0.0726 -18.95401,0.1089c0.04852,0.9617 0.09491,1.9233 0.14343,2.8849c6.27051,-0.0079 12.54108,-0.0174 18.81058,-0.0268c0,-0.9885 0,-1.977 0,-2.967l0,0l0,0l0,0l0,0zm0.10333,4.1828c-6.31693,0.0363 -12.63599,0.0726 -18.95294,0.1089c0.04639,0.9585 0.09491,1.917 0.1413,2.8754c6.27057,-0.0063 12.54108,-0.011 18.81165,-0.0173c0,-0.9885 0,-1.9785 0,-2.967l0,0l0,0z" 
                      fill="hsla(36, 100%, 63%, 0.8)" />
                      <rect id="dplrectpgmenupastepagebtn" fill="hsla(35,70%,47%,1)" fill-opacity="0.4" stroke="#000000" stroke-width="0" x="68%" y="2%" width="32%" height="96%" rx="12"/>

                    <text 
                    fill="hsla(179, 99%, 99%, 1)"  x="85%" y="16%"
                    stroke-width="0"   
                    text-anchor="middle" >Paste</text>
                    <text 
                    fill="hsla(179, 99%, 99%, 1)"  x="85%" y="42%"
                    stroke-width="0"   
                    text-anchor="middle" >Before</text>
                    <text 
                    fill="hsla(179, 99%, 99%, 1)"  x="85%" y="72%"
                    stroke-width="0"   
                    text-anchor="middle" >After</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="100%" height="100%" rx="12"/>
                <g>
                <rect id="dplrectpgmenuinsertbeforenewpagebtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="5%" y="30%" width="25%" height="20%" rx="12"/>
                </g>
                <g>
                <rect id="dplrectpgmenuinsertafternewpagebtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="5%" y="60%" width="25%" height="20%" rx="12"/>
                </g>
                                  <path d="m239.084,43.5317c-1.95399,-0.1217 -3.922,-0.1048 -3.995,-4.2027c-0.073,-4.098 -0.073,-9.0685 -0.134,-13.6019c0.015,-3.414 -0.049,-6.873 0.19099,-10.2561c0.82001,-0.2254 1.731,-0.0438 2.591,-0.1017c3.552,0 6.963,0.1071 10.515,0.1071c0.166,2.6603 0.136,5.2411 0.515,7.8825c0.77501,2.1559 3.129,1.2613 4.7,1.4871c1.77701,0.0669 3.56499,-0.012 5.33101,0.2755c0.35501,4.0792 -0.116,8.1838 0.15399,12.271c-0.04001,1.6647 0.229,3.5667 -0.629,5.0177c-1.37299,1.7121 -3.599,1.1189 -5.39799,1.1677c-4.61301,0.0351 -9.228,0.1109 -13.841,-0.0462l0,0l0,0l0,0l0,0zm-12.565,-4.8524c-0.688,-0.6095 -0.373,-4.6346 -0.459,-4.755c-0.086,-0.1203 -0.211,-14.925 0.008,-22.3567c1.57901,-0.7269 3.56401,-0.0761 5.216,-0.2894c4.93901,-0.0104 9.879,0.0247 14.81801,0.0377c-0.151,1.0203 0.41899,2.844 -0.17801,3.3658c-0.649,0 -1.29799,0 -1.948,0c0.233,-2.0878 -3.737,-1.3363 -3.166,-1.3575c0.57001,-0.0212 -8.07199,0.1024 -12.108,0.1818c-1.069,0.3389 -0.75099,1.7741 -0.81,2.7558c0.065,6.3904 0.213,18.3148 0.177,19.1722c-0.037,0.8572 2.612,1.0047 3.93201,1.0206c1.31999,0.0158 2.90199,-0.0792 2.888,0.2996c-0.013,0.3788 0.20099,2.0619 -0.18701,2.0144c-0.38699,-0.0474 -2.295,-0.0386 -2.82199,0.0248l-1.77101,-0.0071l-3.59,-0.107l0,0zm24.064,-14.5737c-0.78899,-0.0429 -0.83099,-0.878 -0.96999,-1.2633c-0.14,-0.3852 -0.466,-6.6057 -0.606,-7.1516c-0.13901,-0.5458 0.623,-0.3377 0.86499,0.0066c0.242,0.3442 7.01601,6.6186 6.98802,6.6875c-0.02802,0.0689 2.56,2.1963 1.41699,1.9885l-7.69402,-0.2677zm-0.14099,-6.8414c-1.019,-1.0537 -0.661,0.9817 -0.42101,3.0938c0.239,2.1121 0.27701,2.4723 0.73801,2.7744c0.45999,0.302 2.739,0.2282 3.67,0.3132c0.931,0.085 3.16002,0.5483 2.308,-0.1856l-2.612,-2.5161l-3.683,-3.4797l0,0z" 
                  fill="hsla(36, 100%, 63%, 0.9)" />
                  <rect id="dplrectpgmenucopypagebtn" fill="hsla(35,70%,47%,1)" fill-opacity="0.2" stroke="#000000" stroke-width="0" x="34%" y="4%" width="33%" height="20%" rx="12"/>

                    <path d="m231.119,90.0722c-2.539,-0.457 -5.41901,-2.1179 -5.619,-4.8557c-0.028,-2.692 2.7,-4.4761 5.162,-5.0145c0.791,-0.2934 1.752,-0.1304 2.494,-0.4799c2.09099,-1.6795 4.222,-3.3129 6.26199,-5.0489c-3.47099,-3.875 -7.258,-7.5026 -10.44,-11.6109c-1.12399,-1.0926 0.252,-3.7591 1.567,-1.945c4.397,3.3078 8.54201,6.9188 12.94901,10.2127c4.69,-3.4797 9.036,-7.38091 13.77998,-10.7932c1.90201,0.0759 1.00101,2.8996 -0.15399,3.6818c-3.03499,3.6091 -6.381,6.9578 -9.54999,10.45461c2.08899,1.7753 4.26999,3.4468 6.409,5.1654c2.72299,0.2286 5.798,1.1056 7.116,3.6361c1.12299,2.047 -0.27701,4.4717 -2.22601,5.4829c-3.31097,1.8632 -7.88499,1.7565 -10.92499,-0.57301c-1.569,-1.1763 -2.41701,-3.4166 -1.27901,-5.1375c0.44301,-0.5229 0.37801,-0.9711 -0.20999,-1.3425c-1.00301,-0.9814 -1.908,-2.0825 -3.06,-2.9015c-1.172,1.1447 -2.302,2.32951 -3.45,3.4971c0.715,1.2352 1.30899,2.735 0.558,4.0959c-1.418,2.6625 -4.75101,3.7832 -7.70001,3.6149c-0.56299,-0.0103 -1.12999,-0.0359 -1.68399,-0.1378l0,-0.001l0,0l0,0l0,0zm4.12799,-2.6265c1.47,-0.4909 2.552,-2.2751 1.51801,-3.6078c-1.786,-2.1057 -5.662,-2.1047 -7.40199,0.0513c-1.21001,1.6963 0.666,3.6586 2.463,3.8483c1.134,0.2426 2.34999,0.1514 3.42099,-0.2918l0,0l0,0zm20.83299,0c1.47,-0.4909 2.552,-2.2751 1.51801,-3.6078c-1.78598,-2.1057 -5.66199,-2.1047 -7.40199,0.0513c-1.21001,1.6963 0.666,3.6586 2.46201,3.8483c1.13499,0.2426 2.351,0.1514 3.42198,-0.2918l0,0l0,0zm-11.34198,-11.8671c0.89499,-1.38969 -1.757,-2.4048 -2.287,-0.8739c0.101,1.21751 1.30299,1.8057 2.287,0.8739z" 
                    fill="hsla(36, 100%, 63%, 0.9)" />
                <rect id="dplrectpgmenucutpagebtn" fill="hsla(35,70%,47%,1)" fill-opacity="0.2" stroke="#000000" stroke-width="0" x="34%" y="28%" width="33%" height="20%" rx="12"/>
                  <path d="m234.70599,114.075l-7.978,-3.032l14.235,11.274l-12.09599,10.08299l-1.806,5.905l16.485,-13.70599l16.97798,14.373l-3.13397,-5.578l-11.62001,-10.987l8.834,-7.434l3.54901,-5.517l-14.67401,11.119" 
                        fill="hsla(1, 95%, 49%, 0.9)" />
                <rect id="dplrectpgmenuremovepagebtn" fill="hsla(1, 100%, 24%, 1)" fill-opacity="0.1" stroke="#AA0000" stroke-width="1" x="34%" y="52%" width="33%" height="20%" rx="12"/>
                
                    <path d="m232.717,158.019l19.38301,-2.552l-5.53801,6.74501c-1.17799,1.435 16.666,5.771 11.73799,10.26999c-3.26698,2.98401 -21.07498,17.38901 -19.62299,15.37401l8.186,-11.364c3.185,-4.42 5.756,-2.99701 4.937,-5.59001c-0.297,-0.93799 -8.315,-3.76999 -8.42801,-3.46399l-3.19099,8.629l-7.464,-18.048l0,0l0,0l0,0l0,0z" 
                        stroke-width="0" fill-rule="nonzero" fill="hsla(222, 100%, 39%, 0.9)"/> 
               
               <rect id="dplrectpgmenuUndobtn" fill="hsla(222, 100%, 24%, 1)" fill-opacity="0.1" stroke="#0000AA" stroke-width="1" x="34%" y="76%" width="33%" height="20%" rx="12"/>
               <rect id="dplrectpgmenuinsertbeforepastepagebtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="71%" y="30%" width="25%" height="20%" rx="12"/>
                <rect id="dplrectpgmenuinsertafterpastepagebtn" fill-opacity="0.1" stroke="#000000" stroke-width="0" x="71%" y="60%" width="25%" height="20%" rx="12"/>
             </g>
                                 
        </svg>
    </div>
</div>
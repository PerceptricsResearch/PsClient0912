@ModelType  Ienumerable(of mvcapplication2.SurveyIconModel)
@Code
    Dim xrefurl = Url.Action("Index", "Survey")
    Dim activenewresultsurl = Url.Action("JsonRetrieveActiveNewResults", "SubscriberMain")
    Dim jactivenewrresulturl = Html.Raw(Json.Encode(activenewresultsurl))
    Dim jsurveyiconsmodelurl = Html.Raw(Json.Encode(Url.Action("JsonRetrieveSurveyIconModelList", "SubscriberMain")))
    Dim jdesignerhomeUrl = Html.Raw(Json.Encode(Url.Action("DesignerHomePartial", "SubscriberMain", New With {.id = 8})))
    Dim jsurveymetadataviewUrl = Html.Raw(Json.Encode(Url.Action("SurveyMetaDataViewPartial", "SubscriberMain", New With {.id = 8})))
    Dim jgroupsslideoutviewUrl = Html.Raw(Json.Encode(Url.Action("GroupsSlideoutViewPartial", "SubscriberMain", New With {.id = 8})))
    Dim jsharehomeUrl = Html.Raw(Json.Encode(Url.Action("ShareHomePartial", "SubscriberMain", New With {.id = 8})))
    Dim jsubscriptionhomeUrl = Html.Raw(Json.Encode(Url.Action("SubscriptionHomePartial", "SubscriberMain", New With {.id = 8})))
    Dim jsettingshomeUrl = Html.Raw(Json.Encode(Url.Action("SettingsHomePartial", "SubscriberMain", New With {.id = 8})))
    Dim jdsgnrimgmgrguildstrlisturl = Html.Raw(Json.Encode(Url.Action("JsonRetrieveDesignerImagesMgrGuidStrList", "SubscriberMain", Nothing)))
    Dim jdesignerresourcesUrl = Html.Raw(Json.Encode(Url.Action("JsonRetrieveDesignerResources", "SubscriberMain")))
    Dim jdesignerpageslistUrl = Html.Raw(Json.Encode(Url.Action("DesignerPagesListViewPartial", "SubscriberMain", New With {.id = 8})))
    Dim jsurveypagenaviUrl = Html.Raw(Json.Encode(Url.Action("SurveyPageNaviViewPartial", "SubscriberMain", New With {.id = 8})))
    'Dim jtinymceurl = Html.Raw(Json.Encode(Url.Content("~/Scripts/tinymce/tiny_mce_src.js")))
    Dim jretrieveurlistUrl = Html.Raw(Json.Encode(Url.Action("JsonRetrieveUrlsList", "SubscriberMain")))
    Dim jretrievesurveysinfoUrl = Html.Raw(Json.Encode(Url.Action("JsonRetrieveSurveyInfos", "SubscriberMain")))
    Dim jretrievesettingsinfoUrl = Html.Raw(Json.Encode(Url.Action("JsonRetrieveSettingsInfo", "SubscriberMain")))
    Dim jretrievesubscriptioninfoUrl = Html.Raw(Json.Encode(Url.Action("JsonRetrieveSubscriptionInfo", "SubscriberMain")))
    Dim jretrieveglinfoUrl = Html.Raw(Json.Encode(Url.Action("JsonRetrieveGLInfo", "SubscriberMain", New With {.id = 0})))
    Dim jlogoffurl = Html.Raw(Json.Encode(Url.Action("LogOff", "Account")))
End Code

<div id="shomelayoutroot"  
     data-prwtype="subscriberhomelayoutroot">
<div id="hcpwrapper" >
<div id="homecenterpanel" class="homecenterpanelitems" >@Html.Partial("AppContextLandingView", Nothing)</div></div>
<div id="navpanel" 
    class="navpanel"
    data-prwcornerradius="4"
    style="margin-left:62px;width:16em;">
 

  <div id="actions" class="listactions"
       data-prwcornerradius="4">
       <div style="text-align:center;color:rgb(250,250,250);">Actions</div>
@*        <div class="prevnavpanel prwnoselect" data-prwcornerradius="4"
             style="position:absolute;top:1px;bottom:1px;left:1%;right:68%;">
             <div style="font-size:80%;text-align:left;margin-left:0.2em;">&laquo; Back</div></div>
        <div class="nextnavpanel prwnoselect" data-prwcornerradius="4"
             style="position:absolute;top:1px;bottom:1px;left:68%;right:1%;">
             <div style="font-size:80%;text-align:center;">More &raquo;</div></div>*@
  </div>
<!-- root element for scrollable -->
    <div class="scrollablenavpanel nativescrollvertical prwnoselect" 
            data-prwcornerradius="4">
        <div class="navpanelitems" 
             data-prwtype="tileslist"
             data-prwcornerradius="4">
                 <div data-prwtype="navtile" class="defaultshadow navtile"
                      data-action="navtile-design-selected" >
                  <div id="designanchor"  
                     data-action="navtile-design-selected">
                     <div data-prwtype="navtilecontent"
                            data-prwlineargradientbrush="teal">
                         <div class="navtiletitle">Design</div>
                         <p class="navtiledescription">Design your surveys.</p>
                     </div>
                  </div>
                   <div id="designerbtns" 
                        style="display:none;">
                        <div id="designerdonebtn" class="donesavebtndone">
                             <svg id="testimgsvg" viewBox="0 0 180 120" preserveAspectRatio="xMidYMid meet" version="1.2" baseProfile="tiny">
                                    <g>
                                    <defs>
                                    <linearGradient id="ddlg4" x1="0" y1="1" x2="0" y2="0">
                                        <stop stop-color="hsla(175,95%,49%,1)" offset="0%"/>
                                        <stop stop-color="hsla(175,95%,39%,1)" offset="25%"/>
                                        <stop stop-color="hsla(196,100%,16%,1)" offset="62%"/>
                                        <stop stop-color="hsla(196,100%,13%,1)" offset="100%"/>
                                    </linearGradient>
                                    </defs>
                                    <rect fill="url(#ddlg4)" stroke="hsla(175,95%,49%,1)" stroke-width="1" x="0" y="0" width="180" height="120" rx="12"/>
                                    <text fill="hsla(179, 94%, 94%, 1)" stroke="#000000" 
                                            stroke-width="0" x="90" y="60"  font-size="24" 
                                            text-anchor="middle" >Done</text>
                                    <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="180" height="120" rx="12"/>
                                     </g>
                                </svg>
                        </div>
                        <div id="designersavebtn" class="donesavebtnsave">
                             <svg  viewBox="0 0 180 120" preserveAspectRatio="xMidYMid meet" version="1.2" baseProfile="tiny">
                                    <g>
                                    <defs>
                                    <linearGradient id="dslg4" x1="0" y1="1" x2="0" y2="0">
                                        <stop stop-color="hsla(15,95%,49%,1)" offset="0%"/>
                                        <stop stop-color="hsla(15,95%,39%,1)" offset="25%"/>
                                        <stop stop-color="hsla(36,100%,16%,1)" offset="62%"/>
                                        <stop stop-color="hsla(36,100%,13%,1)" offset="100%"/>
                                    </linearGradient>
                                    </defs>
                                    <rect fill="url(#dslg4)" stroke="hsla(175,95%,49%,1)" stroke-width="1" x="0" y="0" width="180" height="120" rx="12"/>
                                    <text fill="hsla(79, 94%, 94%, 1)" stroke="#000000" 
                                            stroke-width="0" x="90" y="60"  font-size="24" 
                                            text-anchor="middle" >Save</text>
                                    <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="180" height="120" rx="12"/>
                                     </g>
                                </svg>
                        </div>
                   </div>  
                 </div>

                 <div data-prwtype="navtile" class="defaultshadow navtile"
                      data-action="navtile-publish-selected">
                 <div data-action="navtile-publish-selected" >
                     <div  data-prwtype="navtilecontent" 
                            data-prwlineargradientbrush="red">
                         <div class="navtiletitle">Publish</div>
                         <p class="navtiledescription">Manage your surveys' availability on the web.</p>
                     </div>
                 </div>
                 </div>

                 <div data-prwtype="navtile" class="defaultshadow navtile"
                      data-action="navtile-results-selected" >
                 <div data-action="navtile-results-selected">
                     <div   data-prwtype="navtilecontent"
                            data-prwlineargradientbrush="indigo">
                         <div class="navtiletitle">Results</div>
                         <p class="navtiledescription">View survey results.</p>
                     </div>
                 </div>
                 </div>

                 <div data-prwtype="navtile"  class="defaultshadow navtile"
                      data-action="navtile-surveys-selected" >
                 <div 
                    data-action="navtile-surveys-selected">
                     <div data-prwtype="navtilecontent"
                          data-prwlineargradientbrush="forest">
                         <div class="navtiletitle">Surveys</div>
                         <p class="navtiledescription">Take a look at all your surveys.</p>
                     </div>
                 </div>
                 </div>

                 <div data-prwtype="navtile" class="defaultshadow navtile" 
                      data-action="navtile-share-selected" >
                 <div data-action="navtile-share-selected" >
                     <div data-prwtype="navtilecontent"
                          data-prwlineargradientbrush="aqua">
                         <div class="navtiletitle">Share</div>
                         <p class="navtiledescription">Share your survey results.</p>
                     </div>
                 </div>
                 </div>

                 <div data-prwtype="navtile" class="defaultshadow navtile" 
                      data-action="navtile-subscription-selected" >
                 <div data-action="navtile-subscription-selected" >
                     <div data-prwtype="navtilecontent"
                          data-prwlineargradientbrush="verdant">
                         <div class="navtiletitle">Subscription</div>
                         <p class="navtiledescription">Manage your subscription.</p>
                     </div>
                 </div>
                 </div>

                 <div data-prwtype="navtile" class="defaultshadow navtile" 
                      data-action="navtile-settings-selected" >
                 <div data-action="navtile-settings-selected">
                     <div data-prwtype="navtilecontent"
                          data-prwlineargradientbrush="ozean">
                         <div class="navtiletitle">Settings</div>
                         <p class="navtiledescription">Manage application preferences.</p>
                     </div>
                 </div>
                 </div>
                
                <div data-prwtype="navtile" class="defaultshadow navtile" 
                     data-action="navtile-logoff-selected" >
                 <div data-action="navtile-logoff-selected">
                     <div data-prwtype="navtilecontent"
                          data-prwlineargradientbrush="ozean">
                         <div class="navtiletitle">Exit / Log Off</div>
                         <p class="navtiledescription">Exit Perceptrics.</p>
                     </div>
                 </div>
                 </div>
        </div>
   </div>
   
</div><!-- end of navpanel -->

<div id="siconlistpanel" class="prwnoselect"
     data-prwtype="surveyiconlistpanel"
     data-prwcornerradius="4"
     style="display:none">
    <div id="siconlistactions"  class="listactions"
         data-prwcornerradius="4">
         <div style="text-align:center;color:rgb(250,250,250);">Surveys</div>
@*        <div class="prevsiconlist surveyprevnextbtns prwnoselect"              
             style="position:absolute;top:1px;bottom:1px;left:1%;right:68%;
                    text-align:center;"><div style="margin:auto;font-size:80%;">&laquo; Back</div></div>
        <div class="nextsiconlist surveyprevnextbtns prwnoselect"              
             style="position:absolute;top:1px;bottom:1px;left:68%;right:1%;
                    text-align:center;"><div style="margin:auto;font-size:80%;">More &raquo;</div></div>*@
@*        <div style="position:absolute;left:30%;right:30%;top:0.1em;bottom:0.1em;
                    text-align:center;margin-right: 0.5em;font-size:80%;">Surveys</div>*@

    </div>
     @Html.Partial("_SurveyIconListViewPartial")
</div>

<div id="shomepagespanel" 
          data-prwcornerradius="4" class="prwslideouthide prwslideout prwnoselect"
          style="z-index:1000;overflow:hidden;max-height:22em;">
</div>
<div id="shomesurveypagenavipanel" 
          data-prwcornerradius="4" class="prwslideouthide prwslideout prwnoselect">
</div>
<div id="groupsslideoutcontainer"
          data-prwcornerradius="12" class="prwslideouthide prwslideout">
</div>

<div id="surveymetadatacontainer"
          data-prwcornerradius="12" class="prwslideouthide prwslideout prwnoselect">
          @*@Html.Partial("SurveyMetaDataViewPartial")*@
</div>



<div id="prwebappbtnbar" data-prwcornerradius="4" class="prwnoselect"
        style="width: 65px;z-index:2000;
            position:absolute;top:1px;bottom:0;left:0;">
            <div class="appbarmenu"></div>
    <div id="prwactionsbtn" class="appbarmenuitem"
        data-prwcornerradius="12">
        <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="none"
             version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg">
             <g>
               <defs>
                <linearGradient id="lg4" x1="0" y1="1" x2="0" y2="0">
    <stop stop-color="hsla(185,100%,36%,1)" offset="0%"/>
    <stop stop-color="hsla(185,100%,8%,1)" offset="35%"/>
    <stop stop-color="hsla(185,100%,4%,1)" offset="92%"/>
    <stop stop-color="hsla(185,100%,26%,1)" offset="100%"/>
                </linearGradient>
                </defs>
                <rect fill="url(#lg4)" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
                <text fill="hsla(179, 94%, 94%, 1)" stroke="#000000" 
                stroke-width="0" x="30" y="30"  font-size="14" 
                text-anchor="middle" >Actions</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
              </g>
        </svg>
        </div>
   <div id="prwsurveysbtn" class="appbarmenuitem" style="display:none;"
        data-prwcornerradius="12">
       <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="none"
             version="1.2" baseProfile="tiny">
             <g>
               <defs>
                  <radialGradient id="rg1">
                        <stop stop-color="hsla(130,100%,75%,1)" offset="0%"/>
                        <stop stop-color="hsla(130,100%,30%,1)" offset="60%"/>
                        <stop stop-opacity="0.8" stop-color="hsla(130,100%,2%,1)" offset="94%"/>
                        <stop stop-color="hsla(130,100%,20%,1)" offset="100%"/>
                  </radialGradient>
                  <radialGradient id="rg2">
                        <stop stop-color="hsla(300,100%,75%,1)" offset="0%"/>
                        <stop stop-color="hsla(278,100%,40%,1)" offset="60%"/>
                        <stop stop-opacity="0.8" stop-color="hsla(273,100%,4%,1)" offset="94%"/>
                        <stop stop-color="hsla(273,100%,30%,1)" offset="100%"/>
                  </radialGradient>
               </defs>
                <rect fill="url(#lg4)" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
                <text fill="hsla(179, 94%, 94%, 1)" stroke="#000000" 
                stroke-width="0" x="30" y="30"  font-size="14" 
                text-anchor="middle" >Surveys</text>
                  <text fill="hsla(179, 94%, 94%, 1)" stroke="#000000" stroke-width="0"  x="30" y="12" data-bind="visible: activerdentlight"
                        font-size="8" font-family="serif" text-anchor="middle">Active</text>
                  <text fill="hsla(179, 94%, 94%, 1)" stroke="#000000" stroke-width="0"  x="25" y="47" data-bind="visible: newresultslight"
                        font-size="6" font-family="serif" text-anchor="middle" >New Results</text>
                <circle stroke="rgb(25,200,0)"  r="5" cy="10" cx="50"  stroke-width="0" fill="url(#rg1)" data-bind="visible: activerdentlight"/>
                <circle stroke="rgb(80,2,120)"  r="5" cy="45" cx="50"  stroke-width="0" fill="url(#rg2)" data-bind="visible: newresultslight"/>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
              </g>
        </svg>
    </div>
   <div id="prwpagesbtn" class="appbarmenuitem"
        data-bind="visible: hassurveypagescontext"
        data-prwcornerradius="12"
        style="border-color:hsla(35,100%,77%,1);display:none;">
        <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="none"
             version="1.2" baseProfile="tiny">
             <g>
               <defs>
                <linearGradient id="lg4x" x1="0" y1="1" x2="0" y2="0">
    <stop stop-color="hsla(35,100%,57%,1)" offset="0%"/>
    <stop stop-color="hsla(29,100%,22%,1)" offset="55%"/>
    <stop stop-color="hsla(29,100%,18%,1)" offset="92%"/>
    <stop stop-color="hsla(35,100%,57%,1)" offset="100%"/>
                </linearGradient>
                </defs>
                <rect fill="url(#lg4x)" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="8"/>
                <text fill="hsla(179, 94%, 94%, 1)" stroke="#000000" 
                stroke-width="0" x="30" y="30"  font-size="14" 
                text-anchor="middle" >Pages</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="8"/>
              </g>
        </svg>
        </div>
    <div id="prwdesigntoolsbtn" class="appbarmenuitem"
        data-bind="visible: hasdesignsurveycontext"
        data-prwcornerradius="12"
        style="display:none;
               border-color:hsla(175,95%,69%,1);">
        <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="none"
             version="1.2" baseProfile="tiny">
             <g>
               <defs>
                <linearGradient id="lg1" x1="0" y1="1" x2="0" y2="0">
                    <stop stop-color="hsla(175,95%,49%,1)" offset="0%"/>
                    <stop stop-color="hsla(175,95%,20%,1)" offset="45%"/>
                    <stop stop-color="hsla(175,95%,6%,1)" offset="92%"/>
                    <stop stop-color="hsla(175,95%,59%,1)" offset="100%"/>
                </linearGradient>
                </defs>
                <rect fill="url(#lg1)" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="8"/>
                <text fill="hsla(179, 94%, 94%, 1)" stroke="#000000" stroke-width="0" x="30" y="30"  font-size="14" text-anchor="middle" >Tool Box</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="8"/>
              </g>
        </svg>
    </div>


   <div id="prwmygroupsbtn" class="appbarmenuitem prwrsltssurveyselected" data-bind="visible: hasresultscontext"
        data-prwcornerradius="12"
        style="display:none;
                border-color:hsla(273, 100%, 56%, 1);border-style:solid;border-width:1px;">
       <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="none"
             version="1.2" baseProfile="tiny">
             <g>
               <defs>
                <linearGradient id="glg4" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="hsla(273, 100%, 76%, 1)"/>
    <stop offset="45%" stop-color="hsla(278, 100%, 18%, 1)"/>
    <stop offset="92%" stop-color="hsla(279, 100%, 4%, 1)"/>
    <stop offset="100%" stop-color="hsla(273, 100%, 86%, 1)"/>
                </linearGradient>
                </defs>
                <rect fill="url(#glg4)" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
                <text fill="hsla(179, 94%, 94%, 1)" stroke="#000000" 
                stroke-width="0" x="30" y="30"  font-size="14" 
                text-anchor="middle" >Groups</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
              </g>
        </svg>
        </div>

   <div id="prwsurveydetailsbtn" class="appbarmenuitem prwrsltssurveyselected"
        data-bind="visible: hassurveycontext"
        data-prwcornerradius="12"
        style="display:none;
               border-color:hsla(273, 100%, 56%, 1);border-style:solid;border-width:1px;">
    <svg width="100%" height="100%" viewBox="0 0 60 60" preserveAspectRatio="none"
             version="1.2" baseProfile="tiny">
             <g>
               <defs>
                <linearGradient id="dlg4" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="hsla(273, 100%, 76%, 1)"/>
    <stop offset="45%" stop-color="hsla(278, 100%, 18%, 1)"/>
    <stop offset="92%" stop-color="hsla(279, 100%, 4%, 1)"/>
    <stop offset="100%" stop-color="hsla(273, 100%, 86%, 1)"/>
                </linearGradient>
                </defs>
                <rect fill="url(#dlg4)" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
                <text fill="hsla(179, 94%, 94%, 1)" stroke="#000000" 
                stroke-width="0" x="30" y="30"  font-size="14" 
                text-anchor="middle" >Details</text>
                <rect  fill-opacity="0.0" stroke="#000000" stroke-width="0" x="0" y="0" width="60" height="60" rx="12"/>
              </g>
        </svg>
        </div>
</div>
<div id="designerdialoguecontainer"  tabindex="-1" style="display: none;z-index:3000;"></div>
<iframe id="dsgnrimagesuploadtarget" name="dsgnrimagesuploadtarget" style="position: absolute; left: -999em; top: -999em;"></iframe>
</div>

@section scripts 
    <script src="http://cdnjs.cloudflare.com/ajax/libs/linq.js/2.2.0.2/linq.min.js" type="text/javascript"></script>
    @*<script src="@Url.Content("~/Scripts/linq.min.js")" type="text/javascript"></script>*@
    <script src="http://cdnjs.cloudflare.com/ajax/libs/knockout/2.3.0/knockout-min.js" type="text/javascript"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/knockout.mapping/2.3.5/knockout.mapping.min.js" type="text/javascript"></script>
    @*<script src="@Url.Content("~/Scripts/knockout-2.1.0.js")" type="text/javascript"></script>*@
    @*<script src="@Url.Content("~/Scripts/knockout.mapping-latest.js")" type="text/javascript"></script>*@
@*    <script src="@Url.Content("~/Scripts/jquery.linq.min.js")" type="text/javascript"></script>*@
    @*<script src="@Url.Content("~/Scripts/prweb.base.js")" type="text/javascript"></script> *@
    <script src="@Url.Content("~/Scripts/prweb.brushes.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.events.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pubsub.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.data.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.status.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.header.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.dialoguemanager.js")" type="text/javascript"></script>
@*    <script src="@Url.Content("~/Scripts/prweb.vsm.js")" type="text/javascript"></script>*@
    <script src="@Url.Content("~/Scripts/prweb.appsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.appmessagesvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pagessvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.imagesmgrsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.clipboardsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designerpcmsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designerpcelementsvc.js")" type="text/javascript"></script>
    
    <script src="@Url.Content("~/Scripts/prweb.designertextsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designersavesurveysvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designerpanelsmgr.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designersvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.publishsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.subscriberheartbeatsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveymodelsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.colorssvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveymetadatasvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pcvmodesvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.rfmsvc.js")" type="text/javascript"></script>

   <script src="@Url.Content("~/Scripts/prweb.perceptricsresearchweb.js")" type="text/javascript"></script>

    @*<script src="@Url.Content("~/Scripts/jquery.unobtrusive-ajax.min.js")" type="text/javascript"></script>*@
    <script src="@Url.Content("~/Scripts/prweb.appmessage.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.editablecontainer.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designereditable.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.ignatzprwt.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.imageprwt.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.questoptsetprwt.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.stylablepageprwt.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designeritemeditor.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designeritemeditorsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designeritem.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.colorscontrol.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.scroller.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.gestureizer.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designerhome.js")" type="text/javascript"></script>
@*    <script src="@Url.Content("~/Scripts/prweb.resultsitempiechart.js")" type="text/javascript"></script>*@
    <script src="@Url.Content("~/Scripts/prweb.publishsurveyview.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pinchpanzoom.js")" type="text/javascript"></script>
    @*<script src="@Url.Content("~/Scripts/prweb.surveyview.js")" type="text/javascript"></script>*@
@*    <script src="@Url.Content("~/Scripts/prweb.pcelementview.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pagecontentview.js")" type="text/javascript"></script>*@
    <script src="@Url.Content("~/Scripts/prweb.designarrange.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designerfontsize.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designerfontname.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designtext.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designboxsbtns.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designerbuttonpanel.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designerbuttonpanelvertical.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designtoolbox.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designstyles.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designoptions.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designimagesmgr.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveymetadata.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.resultsgrouplist.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.resultsgroupdefn.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.sharesurveysvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.sharesurveyview.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.settingssvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.settingsview.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.subscriptionsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.subscriptionview.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveyicon.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveyiconlistsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.textentry.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.notecommentsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.notecomment.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveysinfosvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveysinfoview.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveyiconlist.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.groupsslideoutpanel.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveypageslist.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.designerpageslist.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveypagenavisvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.appcntxtdesign.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.appcntxtsettings.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.appcntxtsubscription.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.appcntxtitem.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.appcntxtviewmgr.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.navtile.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.navpanel.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.panelsmgr.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.observablemodelsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.activequestoptset.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveyplayersvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveyplayer.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.resultsplayersvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.resultsplayer.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.redactorplugins.js")" type="text/javascript"></script>
   <script src="@Url.Content("~/Scripts/prweb.subscriberplatform.js")" type="text/javascript"></script>
       <script type="text/javascript">
           (function (prweb, $) {
//               $.ajaxSetup({
//                   cache: false
//               });
//               $(".scrollablenavpanel").scrollable({ vertical: true, mousewheel: true });
//               $(".scrollablesiconlist").scrollable({ vertical: true, mousewheel: true });
               $('#shomelayoutroot').subscriberplatform({ actnewRsltUrl: @(jactivenewrresulturl), 
                                                          surveyiconsmodelurl: @(jsurveyiconsmodelurl),
                                                          sharehomeUrl: @(jsharehomeUrl),
                                                          subscriptionhomeUrl: @(jsubscriptionhomeUrl),
                                                          settingshomeUrl: @(jsettingshomeUrl),
                                                          groupsslideoutviewUrl: @(jgroupsslideoutviewUrl),
                                                          surveymetadataviewUrl: @(jsurveymetadataviewUrl), 
                                                          designerhomeUrl:@(jdesignerhomeUrl),
                                                          designerresourcesUrl:@(jdesignerresourcesUrl),
                                                          dsgnrimgmgrguildstrlisturl:@(jdsgnrimgmgrguildstrlisturl),
                                                          surveypagenaviUrl:@(jsurveypagenaviUrl),
                                                          retrieveurllistURL:@(jretrieveurlistUrl),
                                                          retrieveglinfoUrl:@(jretrieveglinfoUrl),
                                                          retrievesurveysinfoUrl:@(jretrievesurveysinfoUrl),
                                                          retrievesettingsinfoUrl: @(jretrievesettingsinfoUrl),
                                                          retrievesubscriptioninfoUrl: @(jretrievesubscriptioninfoUrl),
                                                          logoffurl : @(jlogoffurl) });
           } (this.prweb, jQuery))
    </script>
End Section



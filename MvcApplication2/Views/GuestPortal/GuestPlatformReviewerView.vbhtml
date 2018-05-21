@Code
    
    Layout = "~/Views/Shared/_LayoutGuest.vbhtml"
    Dim sid = ViewData("SurveyID")
    Dim jguestservice = Html.Raw(Json.Encode(ViewData("Service")))
    Dim jsubscriberemail = Html.Raw(Json.Encode(ViewData("SubscriberEmail"))) 'ViewData("User")
    'Dim jloginrslt = ViewData("LoginResult")
    Dim jdomaindxnry = Html.Raw(Json.Encode(ViewData("DomainDxnry")))
    Dim jsurveymetadataviewUrl = Html.Raw(Json.Encode(Url.Action("SurveyMetaDataViewPartial", "GuestPortal", New With {.id = 8})))
    Dim jgroupsslideoutviewUrl = Html.Raw(Json.Encode(Url.Action("GroupsSlideoutViewPartial", "GuestPortal", New With {.id = 8})))
    Dim jbaseurlcolxn = Html.Raw(Json.Encode(ViewData("BaseUrlColxn")))
    Dim jsurveyiconmodel = Html.Raw(Json.Encode(ViewData("SurveyIconModel")))
    Dim jresultsURL = Html.Raw(Json.Encode(Url.Action("JsonRetrieveResults", "GuestPortal", New With {.id = sid})))
    Dim jguesthearbeatURL = Html.Raw(Json.Encode(Url.Action("JsonSendGuestHeartbeat", "GuestPortal", New With {.id = sid})))
    Dim jpgZeroUrl = Html.Raw(Json.Encode(Url.Action("JsonRetrievePageZero", "GuestPortal", New With {.id = sid})))
    Dim jcommentUrl = Html.Raw(Json.Encode(Url.Action("JsonSendComment", "GuestPortal", New With {.id = sid})))
    'Dim x = 2
End Code

<div id="guestplatformlayoutroot">
    <div id="guesthcpwrapper" >
        <div id="guesthomecenterpanel" class="guesthomecenterpanelitems">
            <div id="guesthcpsurveyhost" class="prwslideouthide" 
                 style="position:relative;color:rgba(255,255,255,1);min-height:32em;">
                 <div id="prwslideoutscontainer">
                      <div id="guestnavpanel" class="prwslideout prwslideouthide"
                            data-prwcornerradius="4">
                            @Html.Partial("GuestActionsListView", Nothing)
                      </div>
                      <div id="groupsslideoutcontainer"
                            data-prwcornerradius="4" class="prwslideouthide prwslideout">
                      </div>
                      <div id="surveymetadatacontainer"
                           data-prwcornerradius="4" class="prwslideouthide prwslideout prwnoselect">
                      </div>
                 </div>
                 @Html.Partial("SurveyPlayerPartial")
            
                <div id="guestmessagepanelwrapper" class="resultssurveypanelresizable">
                 <div id="guestmessagepanel" class="defaultshadow"
                        data-prwcornerradius="4">
                    <div id="guestmessagepanelcontent" data-bind="html: pageentry().html">
                    @Html.Partial("GuestIntroViewPartial")
                    </div>
                 </div>
                 
                </div>
            </div>
        </div>
            <div id="textentrybottompanel" class="prwslideouthide"
                 data-prwcornerradius="4">
                 <div id="textentrybottompanelcontent"
                      data-prwcornerradius="4">
                    @Html.Partial("TextEntryViewPartial", Nothing)
                 </div>   
            </div>
    </div>
    <div id="prwbuttonbar" class="defaultshadow"
         data-prwcornerradius="12">
        <div id="guestprwactionsbtn" class="guestbuttonbaritem"
             data-prwcornerradius="12">
            <div  class="guestbuttonbaritemtext">Actions</div>
        </div>
        <div id="guestprwpagesbtn" class="guestbuttonbaritem"
            data-bind="visible: pagesbtnvisible" 
            data-prwcornerradius="12">
            <div  class="guestbuttonbaritemtext" data-bind="visible: pagesbtnvisible">Pages</div>
        </div>
@*        <div id="guestprwgroupsbtn" class="guestbuttonbaritem"
             data-bind="visible: groupsbtnvisible"
             data-prwcornerradius="12">
            <div  class="guestbuttonbaritemtext">Groups</div>
        </div>
        <div id="guestprwdetailsbtn" class="guestbuttonbaritem"
             data-bind="visible: detailsbtnvisible"
             data-prwcornerradius="12">
             <div  class="guestbuttonbaritemtext">Details</div>
        </div>*@
        <div id="guestprwhelpbtn" class="guestbuttonbaritem"
             data-bind="visible: helpbtnvisible"
             data-prwebdomain="help"
             data-prwcornerradius="12">
             <div  class="guestbuttonbaritemtext">Help</div>
        </div>
     </div>
    
    <div id="guestpagespanel" class="prwslideouthide prwnoselect"
         data-prwcornerradius="4">
         @Html.Partial("SurveyPageNaviViewPartial", Nothing)
    </div>
    <div id="guestdomainpanel" class="prwslideouthide"
         data-prwcornerradius="4">
         @Html.Partial("GuestDomainPlayerViewPartial", Nothing)
    </div>

</div>

@section scripts 
    <script src="@Url.Content("~/Scripts/linq.min.js")" type="text/javascript"></script> 
    <script src="http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js" type="text/javascript"></script>   
    @*<script src="@Url.Content("~/Scripts/knockout-2.1.0.js")" type="text/javascript"></script>*@
    <script src="@Url.Content("~/Scripts/knockout.mapping-latest.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.brushes.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.events.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pubsub.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.status.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.data.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.panelsmgr.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.scroller.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.gestureizer.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pinchpanzoom.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveymetadata.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveymodelsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.colorssvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveymetadatasvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveyiconlistsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pcvmodesvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.observablemodelsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.activequestoptset.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveyplayersvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveyplayer.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.domaincontentsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.domainplayersvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.guestdomainplayer.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.textentry.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/redactor.min.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.surveypagenavigator.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.guestactionslist.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.guestmanager.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.guestplatformsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.guestplatformreviewer.js")" type="text/javascript"></script>
<script  type="text/javascript"> 
   (function (prweb, $) {
       $('#guestplatformlayoutroot').guestplatformreviewer({
            guestservice: @(jguestservice),
            subscriberemail: @(jsubscriberemail),
            pgzeroURL: @(jpgZeroUrl),
            domaindxnry: @(jdomaindxnry),
            baseurlcolxn: @(jbaseurlcolxn),
            surveyiconmodel: @(jsurveyiconmodel),
            surveymetadataviewUrl: @(jsurveymetadataviewUrl),
            groupsslideoutviewUrl: @(jgroupsslideoutviewUrl), 
            resultsURL: @(jresultsURL),
            commentUrl: @(jcommentUrl),
            guesthearbeatURL: @(jguesthearbeatURL)});
   } (this.prweb, jQuery))
</script>
End Section
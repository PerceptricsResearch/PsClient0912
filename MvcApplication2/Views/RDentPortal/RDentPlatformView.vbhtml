@Code
    ViewData("Title") = "Your Survey"
    Layout = "~/Views/Shared/_LayoutRDent.vbhtml"
    Dim sid = ViewData("SurveyID")
    'Dim jloginrslt = ViewData("LoginResult")
    Dim jdomaindxnry = Html.Raw(Json.Encode(ViewData("DomainDxnry")))
    Dim jrdentmodel = Html.Raw(Json.Encode(ViewData("RDentModel")))
    Dim jsendresponseURL = Html.Raw(Json.Encode(Url.Action("JsonSendResponsePkgToServer", "RDentPortal", New With {.id = sid, .responsePkg = Nothing})))
    'Dim jpcmidpgnumbersURL = Html.Raw(Json.Encode(Url.Action("JsonRetrieveSurveyPCMIDPgNumberList", "SubscriberMain", New With {.id = sid})))
    Dim jrdenthearbeatURL = Html.Raw(Json.Encode(Url.Action("JsonSendRDentHeartbeat", "RDentPortal", New With {.id = sid})))
    Dim jpgZeroUrl = Html.Raw(Json.Encode(Url.Action("JsonRetrievePageZero", "RDentPortal", New With {.id = sid})))
End Code

<div id="rdplatformlayoutroot">
    <div id="rdhcpwrapper" >
        <div id="rdhomecenterpanel" class="rdhomecenterpanelitems">
            <div style="position:relative;">
                @Html.Partial("SurveyPlayerPartial")
            </div>
            <div id="rdmessagepanelwrapper" >
                 <div id="rdmessagepanel" class="defaultshadow"
                 data-prwcornerradius="4">
                    @*<div id="rdmessagepanelsimpletext" data-bind="html: simpletext"></div>*@
                    <div id="rdmessagepanelcontent" data-bind="html: pageentry().html"></div>
                 </div>
                 
            </div>
        </div>
    </div>
    <div id="prwbuttonbar" class="defaultshadow"
         data-prwcornerradius="12">
        <div id="rdprwactionsbtn" class="rdbuttonbaritem"
             data-prwcornerradius="12">
            <div  class="rdbuttonbaritemtext">Actions</div>
        </div>
        <div id="rdprwpagesbtn" class="rdbuttonbaritem"
            data-bind="visible: pagesbtnvisible" 
            data-prwcornerradius="12">
            <div  class="rdbuttonbaritemtext" data-bind="visible: pagesbtnvisible">Pages</div>
        </div>
        <div id="rdprwfinishbtn" class="rdbuttonbaritem"
             data-bind="visible: finishbtnvisible"
             data-prwcornerradius="12">
            <div  class="rdbuttonbaritemtext">Finish </div>
        </div>
        <div id="rdprwquitbtn" class="rdbuttonbaritem"
             data-bind="visible: quitbtnvisible"
             data-prwcornerradius="12">
             <div  class="rdbuttonbaritemtext">Quit</div>
        </div>


     </div>
     <div id="rdnavpanel" class="prwslideout prwslideouthide"
          data-prwcornerradius="12">
        @Html.Partial("RDActionsListView", Nothing)
     </div>
     <div id="rddomainpanel" class="prwslideouthide"
          data-prwcornerradius="12">
          <div id="rddomaindonebtnwrapper" data-prwcornerradius="12">
            <div id="rddomaindonebtn" data-prwcornerradius="4" class="prwnoselect">Done</div>
          </div>
          
          @Html.Partial("RDentDomainPlayerViewPartial", Nothing)
     </div>
@*     <div id="rdpagespanel" class="prwslideout prwslideouthide"
          data-prwcornerradius="12"
          style="left:65px;right:0;top:0;bottom:0;position:relative;display:none;
                 padding:0;
                 height:100%;width:20%;
                 border: 1px solid hsla(179, 54%, 64%, 0.3);
	             background-color: hsla(189, 100%, 2%, 0.2);">
         @Html.Partial("SurveyPagesListViewPartial", Nothing)
     </div>*@

</div>
@section scripts 
    <script src="@Url.Content("~/Scripts/linq.min.js")" type="text/javascript"></script>    
    <script src="@Url.Content("~/Scripts/knockout-2.1.0.js")" type="text/javascript"></script>
    @*<script src="@Url.Content("~/Scripts/knockout.mapping-latest.js")" type="text/javascript"></script>*@
    <script src="@Url.Content("~/Scripts/prweb.brushes.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.events.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pubsub.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.status.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.data.js")" type="text/javascript"></script>
    @*<script src="@Url.Content("~/Scripts/prweb.pcvmodesvc.js")" type="text/javascript"></script>*@
    <script src="@Url.Content("~/Scripts/prweb.rddomainplayer.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.rdactionslist.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.rdentmanager.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.responsesvc.js")" type="text/javascript"></script>

    <script src="@Url.Content("~/Scripts/prweb.gestureizer.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pinchpanzoom.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.rdquestoptset.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.observablemodelsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.rdentsurveyplayersvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.rdentsurveyplayer.js")" type="text/javascript"></script>
    @*<script src="@Url.Content("~/Scripts/prweb.rdentsurveypageslist.js")" type="text/javascript"></script>*@
    <script src="@Url.Content("~/Scripts/prweb.domaincontentsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.domainplayersvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.rdentplatform.js")" type="text/javascript"></script>
<script  type="text/javascript"> 
   (function (prweb, $) {
       $('#rdplatformlayoutroot').rdentplatform({
            pgzeroURL:@(jpgZeroUrl),
            domaindxnry: @(jdomaindxnry),
            rdentmodel: @(jrdentmodel),
            sendresponseURL: @(jsendresponseURL), 
            rdenthearbeatURL: @(jrdenthearbeatURL)});
   } (this.prweb, jQuery))
</script>
End Section


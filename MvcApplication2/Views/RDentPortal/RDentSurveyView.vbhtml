@imports MvcApplication2.RespProviderSvcNS
@ModelType MvcApplication2.PageContentModel
@Code
    Layout = "~/Views/Shared/_LayoutRDent.vbhtml"
    
    
    Dim surveyiconmodel = Model.SurveyGuidString
    Dim jsurveyGuidstring = Html.Raw(Json.Encode(Model.SurveyGuidString))
    Dim sid = ViewData("SurveyID")
    Dim jrdentmodel = Html.Raw(Json.Encode(ViewData("RDentModel")))
    Dim jpcmidpgnumbersURL = Html.Raw(Json.Encode(Url.Action("JsonRetrieveSurveyPCMIDPgNumberList", "SubscriberMain", New With {.id = sid})))
    Dim jrdenthearbeatURL = Html.Raw(Json.Encode(Url.Action("JsonSendRDentHeartbeat", "RDentPortal", New With {.id = sid})))
    Dim pgZeroUrl = Url.Action("PageContentViewPartial", "RDentPortal", New With {.id = ViewData("SurveyID"), .pgNumber = 0})
    Dim nextpagenumber = (Model.PgNumber - 1) + 1
    Dim prevpagenumber = Math.Max(0, (Model.PgNumber - 1) - 1)
    Dim pagesCount = Model.PagesCount
    Dim jpagesCount = Html.Raw(Json.Encode(pagesCount))
    Dim nxtPgURL = Url.Action("PageContentViewPartial", "RDentPortal", New With {.id = ViewData("SurveyID"), .pgNumber = nextpagenumber})
    Dim jnxtPgURL = Html.Raw(Json.Encode(nxtPgURL))
    Dim x = 2
End Code

<div id="rdentsurveyview" data-prwtype="rdentsurveyview"
     data-prwcornerradius="4"
     style="left:0;right:0;top:0;bottom:0;position:relative;padding:0;
            height:100%;width:100%;
            margin-right:2px;
            margin-top:0;
            margin-bottom:0;
            background-color:rgba(140,255,140,0.0);">

     <div id="prwbuttonbar" 
             data-prwcornerradius="4" 
             data-prwtype="prwbuttonbar"
             style="width:65px;z-index:2000;position:absolute;
                    top:0;bottom:0;left:0;height:100%; 
                    background-color:rgba(1,30,40,1)">
        <div id="rdprwactionsbtn"
        data-prwcornerradius="12"
        style="background-color:rgba(1,50,62,1);height:60px;margin:2px;border-color:hsla(179, 54%, 64%, 0.4);border-style:solid;border-width:1px;">
        <label data-prwcornerradius="4"
            style="background-color:rgba(1,40,58,0.7);
                color:hsla(179, 94%, 94%, 1);
                position:relative;
                left:4px;right:1px;top:25%;bottom:0;">Actions</label>
        </div>
        <div id="rdprwpagesbtn" data-prwlineargradientbrush="ozean"
        data-prwcornerradius="12"
        style="background-color:rgba(0,50,62,1);height:60px;margin:2px;margin-top:8px;border-color:hsla(179, 54%, 64%, 0.4);border-style:solid;border-width:1px;">
        <label data-prwcornerradius="4"
            style="background-color:rgba(1,40,58,0.7);
                color:hsla(179, 94%, 94%, 1);
                position:relative;
                left:2px;right:1px;top:25%;bottom:0;">Pages</label>
        </div>
        <div id="rdprwfinishbtn" class="rdprwrsltssurveyselected"
        data-prwcornerradius="12"
        data-prwlineargradientbrush="teal"
        style="height:60px;margin:2px;margin-top:8px;border-color:hsla(179, 54%, 64%, 0.4);border-style:solid;border-width:1px;">
        <label data-prwcornerradius="4"
            style="background-color:rgba(40,0,88,0.5);
                color:hsla(179, 94%, 94%, 1);
                position:relative;
                left:2px;right:1px;top:25%;bottom:0;">Finish </label>
        </div>
        <div id="rdprwcancelbtn" class="rdprwrsltssurveyselected"
        data-prwcornerradius="12"
        data-prwlineargradientbrush="red"
        style="height:60px;margin:2px;margin-top:8px;border-color:hsla(179, 54%, 64%, 0.4);border-style:solid;border-width:1px;">
        <label data-prwcornerradius="4"
            style="background-color:rgba(40,0,88,0.5);
                color:hsla(179, 94%, 94%, 1);
                position:relative;
                left:2px;right:1px;top:25%;bottom:0;">Cancel </label>
        </div>


     </div>

     <div data-prwcornerradius="4"
            style="margin-right:1px;margin-top:0px;padding:0px;
                 height:100%;width:100%;margin:auto;
                 overflow:auto;
                 top:0;bottom:0;left:0;right:0;position:absolute; 
                 background:rgba(0,0,200,0.0)">
        <div data-prwcornerradius="4"
              style="top:0;bottom:0;left:70px;right:5px;
                    position:absolute;
                    height:97%;margin:auto;
                    background:rgba(200,0,0,0.0)">
            <div id="rdsurveycontainer" data-prwcornerradius="4"
                 style="position:absolute;
                        top:0;bottom:0;left:0;right:0;
                        height:99%;width:99%;
                        margin:auto;
                        background:rgba(2,200,2,0.00)">
        <div id="@Model.SurveyGuidString" 
             data-prwcornerradius="4"
             style="left:0;right:0;top:0;bottom:0;
                height:100%;width:100%;position:relative;background:rgba(2,2,2,0.0)"
                data-prwtype="rdxpagecontentviewholder">
            <div id="rdpagespanelactions" data-prwtype="rdpagesscrollactions"
                data-prwcornerradius="4"
                style="height:5%;width:100%;background-color:rgba(1,5,10,0.1);">
                 <a class="prev browse left" style="margin-left:1%;display:none;">
                    <label>&laquo; Previous</label></a>
                 <a class="next browse right" style="margin-right:1%;right:0;position:absolute;"><label>Next &raquo;</label></a>
            </div>
            <div class="rdscrollablepagespanel" 
                 data-prwcornerradius="4" 
                 style="top:0;bottom:0;position:relative;height:95%;width:100%;overflow:hidden;background:rgba(2,2,2,0.2)">
                <div class="rdpagespanelitems" 
                     data-prwtype="rdpageslist"
                     data-prwcornerradius="4"
                     style="position:relative;width:500%;height:99%;border: 1px solid rgba(25,25,25,0.0);">
                     <div class="rdprwpage" data-prwcornerradius="4"
                            style="float:left;height:100%;width:20%;border: 1px solid rgba(25,25,25,0.0);">
                            <div id="rdscrpgitem0" class="rdpcvpg" data-rdpgUrl="@(pgZeroUrl)" data-prwcornerradius="4"
                            style="height:100%;width:100%;overflow:hidden;border: 1px solid rgba(25,25,25,0.0);">
                                @Html.Partial("PageContentViewPartial", Model)
                            </div>
                     </div>
                     <div class="rdprwpage"  data-prwcornerradius="4"
                            style="float:left;height:100%;width:20%;border: 1px solid rgba(255,255,255,0.0);">
                            <div id="rdscrpgitem1" class="rdpcvpg" data-prwcornerradius="4"
                            data-rdpgUrl="" style="height:100%;width:100%;overflow:hidden;border: 1px solid rgba(255,255,255,0.0);">
                            </div>
                     </div>
                     <div class="rdprwpage" data-prwcornerradius="4"
                            style="float:left;height:100%;width:20%;border: 1px solid rgba(255,255,255,0.0);">
                            <div id="rdscrpgitem2" class="rdpcvpg" data-rdpgUrl="" data-prwcornerradius="4"
                            style="height:100%;width:100%;overflow:hidden;border: 1px solid rgba(255,255,255,0.0);">
                            </div>
                     </div>
                     <div class="rdprwpage" data-prwcornerradius="4"
                            style="float:left;height:100%;width:20%;border: 1px solid rgba(255,255,255,0.0);">
                            <div id="rdscrpgitem3" class="rdpcvpg" data-rdpgUrl="" style="height:100%;width:100%;overflow:hidden;border: 1px solid rgba(255,255,255,0.0);">
                            </div>
                     </div>
                     <div class="prwpage" data-prwcornerradius="4"
                            style="float:left;height:100%;width:20%;border: 1px solid rgba(255,255,255,0.0);">
                            <div id="rdscrpgitem4" class="rdpcvpg" data-rdpgUrl="" style="height:100%;width:100%;overflow:hidden;border: 1px solid rgba(255,255,255,0.0);">
                            </div>
                     </div>
                </div>
            </div>
@*            <div id="pagespanelactionsnext" data-prwtype="scrollverticalactions">
                <a class="next browse right" style="z-index:2000;">Next &raquo;</a>
            </div>*@
       @* @Html.Partial("PageContentViewPartial", Nothing)*@
    </div>
            
            </div>
        </div>
                    
     </div>

     <div id="rdnavpanel" 
          data-prwcornerradius="12"
          style="left:65px;right:0;top:0;bottom:0;position:relative;display:none;
                 padding:0;
                 height:100%;width:20%;
                 border: 1px solid hsla(179, 54%, 64%, 0.3);
	             background-color: hsla(89, 100%, 2%, 0.2);">
        @Html.Partial("RDActionsListView", Nothing)
     </div>
     <div id="rdpagespanel" 
          data-prwcornerradius="12"
          style="left:65px;right:0;top:0;bottom:0;position:relative;display:none;
                 padding:0;
                 height:100%;width:20%;
                 border: 1px solid hsla(179, 54%, 64%, 0.3);
	             background-color: hsla(189, 100%, 2%, 0.2);">
         @Html.Partial("SurveyPagesListViewPartial", Nothing)
     </div>
</div>
@section scripts 
    <script src="@Url.Content("~/Scripts/linq.min.js")" type="text/javascript"></script>
    
    
    <script src="@Url.Content("~/Scripts/prweb.rdactionslist.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.rdentheartbeatsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.rdentsurveyview.js")" type="text/javascript"></script>

<script  type="text/javascript"> 
   (function (prweb, $) {
           $.ajaxSetup({
                   cache: false
            });
            // setup default error handler for redirects due to session timeout.
    $(document).ajaxError(function (ev, jqXHR, settings, errorThrown) {
        alert("rdentperceptricsweb.js reports ajax error");
    });
       $('#rdentsurveyview').rdentsurveyview({surveyGuidstring: @(jsurveyGuidstring),rdentmodel: @(jrdentmodel), pagesCount: @(jpagesCount), rdenthearbeatURL: @(jrdenthearbeatURL),nxtPgURL: @(jnxtPgURL), pcmidpgnumbersUrl: @(jpcmidpgnumbersURL)});
   } (this.prweb, jQuery))
</script>
End Section

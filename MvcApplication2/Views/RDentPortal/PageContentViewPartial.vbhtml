@ModelType MvcApplication2.PageContentModel
@Code
    
    Dim xxmodel = Model.PgNumber
    Dim jpgnumber = Html.Raw(Json.Encode(Model.PgNumber))
    Dim pcvsidstring = "pcv" & Model.SDS_ID
    Dim jpcmid = Html.Raw(Json.Encode(Model.SDS_ID))
    Dim selectorstring = "#" & pcvsidstring '"div[data-prwpcvstring=" & pcvsidstring & "]"
    Dim hslctrstring = Html.Raw(selectorstring)
    'Dim myModel = Html.Raw(Json.Encode(xxmodel))
    Dim nextpagenumber = (Model.PgNumber - 1) + 1
    Dim prevpagenumber = Math.Max(0, (Model.PgNumber - 1) - 1)
    Dim jquestID = Html.Raw(Json.Encode(Model.SDS_ID))
    'Dim qoimidlist = Model.QuestOptItemModelColxn.Select(Function(qoim) qoim.RespONSEModel.Key1)
    'Dim jqoimidlist = Html.Raw(Json.Encode(Model.QuestOptItemModelColxn.Select(Function(qoim) qoim.RespONSEModel.Key1)))
    Dim sid = ViewData("SurveyID")
    'Dim resultsUrl = Url.Action("JsonRetrieveResults", "SubscriberMain", New With {.id = sid})
    'Dim jresultsURL = Html.Raw(Json.Encode(resultsUrl))
    'Dim sdsresponsemodelURL = Url.Action("JsonRetrieveSDSResponseModels", "SubscriberMain", New With {.id = sid})
    'Dim jsdsresponsemodelURL = Html.Raw(Json.Encode(sdsresponsemodelURL))
    
    'Dim nxtPgURL = Url.Action("PageContentViewPartial", "SubscriberMain", New With {.id = ViewData("SurveyID"), .pgNumber = nextpagenumber})
    'Dim jnxtPgURL = Html.Raw(Json.Encode(nxtPgURL))
    Dim x = 2
End Code

<div id="@(pcvsidstring)" data-prwpcvsdsid="@(Model.SDS_ID)"
    data-prwpcvstring="@(pcvsidstring)"
    data-prwtype="rdpagecontentview" 
    data-prwcornerradius="4"
    style="height:100%;width:99%;position:relative;margin-left: 1px;
	margin-right: 1px;
	margin-bottom: 1px;	top: 0;
	right: 0;
	left: 0;
	bottom: 0;">
    <div id="@(Model.PermanentGuidString)" data-prwcornerradius="4"
        data-prwpcvsdsid="@(Model.SDS_ID)"
        data-prwtype="rdpagecontentviewcontent"  >
    
@For Each pcelem As MvcApplication2.PageContentElement In Model.PCElementsColxn
    @Html.Partial("PCElementViewPartial", pcelem)
Next
    
    </div>

</div>

<script  type="text/javascript">
   (function (prweb, $) {
       $('@(hslctrstring)').rdentpagecontentview({questID: @(jquestID), pcmid:@(jpcmid), mypgnumber:@(jpgnumber)});
   } (this.prweb, jQuery));
</script>




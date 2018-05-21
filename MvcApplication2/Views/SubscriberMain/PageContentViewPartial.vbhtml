@ModelType MvcApplication2.PageContentModel
@Code
    
    'Dim xxmodel = Model.PgNumber
    Dim jpgnumber = Html.Raw(Json.Encode(Model.PgNumber))
    Dim pcvsidstring = "pcv" & Model.SDS_ID
    Dim jpcmid = Html.Raw(Json.Encode(Model.SDS_ID))
    Dim selectorstring = "#" & pcvsidstring '"div[data-prwpcvstring=" & pcvsidstring & "]"
    Dim hslctrstring = Html.Raw(selectorstring)
    'Dim myModel = Html.Raw(Json.Encode(xxmodel))
    'Dim nextpagenumber = (Model.PgNumber - 1) + 1
    'Dim prevpagenumber = Math.Max(0, (Model.PgNumber - 1) - 1)
    Dim jquestID = Html.Raw(Json.Encode(Model.SDS_ID))
    'Dim qoimidlist = Model.QuestOptItemModelColxn.Select(Function(qoim) qoim.RespONSEModel.Key1)
    'Dim jqoimidlist = Html.Raw(Json.Encode(Model.QuestOptItemModelColxn.Select(Function(qoim) qoim.RespONSEModel.Key1)))
    'Dim sid = ViewData("SurveyID")
    'Dim resultsUrl = Url.Action("JsonRetrieveResults", "SubscriberMain", New With {.id = sid})
    'Dim jresultsURL = Html.Raw(Json.Encode(resultsUrl))
    'Dim sdsresponsemodelURL = Url.Action("JsonRetrieveSDSResponseModels", "SubscriberMain", New With {.id = sid})
    'Dim jsdsresponsemodelURL = Html.Raw(Json.Encode(sdsresponsemodelURL))
    
    'Dim nxtPgURL = Url.Action("PageContentViewPartial", "SubscriberMain", New With {.id = ViewData("SurveyID"), .pgNumber = nextpagenumber})
    'Dim jnxtPgURL = Html.Raw(Json.Encode(nxtPgURL))
    'Dim x = 2
End Code

<div  id="@(pcvsidstring)" class="ppztargetitem"
    data-prwpcvsdsid="@(Model.SDS_ID)"
    data-prwpcvstring="@(pcvsidstring)"
    data-prwtype="pagecontentview">
    <div  id="@(Model.PermanentGuidString)" 
        data-prwpcvsdsid="@(Model.SDS_ID)"
        data-prwtype="pagecontentviewcontent">
    
@For Each pcelem As MvcApplication2.PageContentElement In Model.PCElementsColxn
    @Html.Partial("PCElementViewPartial", pcelem)
Next
    
    </div>

</div>


<script  type="text/javascript">
   (function (prweb, $) {
       $('@(hslctrstring)').pagecontentview({questID: @(jquestID),  pcmid:@(jpcmid), mypgnumber:@(jpgnumber)});
   } (this.prweb, jQuery));
</script>




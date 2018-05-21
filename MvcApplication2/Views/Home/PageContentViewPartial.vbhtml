@ModelType MvcApplication2.PageContentModel
@Code
    
    'Dim xxmodel = Model.PgNumber
    Dim jpgnumber = Html.Raw(Json.Encode(Model.PgNumber))
    Dim pcvsidstring = "pcv" & Model.SDS_ID
    Dim jpcmid = Html.Raw(Json.Encode(Model.SDS_ID))
    Dim selectorstring = "#" & pcvsidstring '"div[data-prwpcvstring=" & pcvsidstring & "]"
    Dim hslctrstring = Html.Raw(selectorstring)
    Dim pagesCount = Model.PagesCount
    Dim jpagesCount = Html.Raw(Json.Encode(Model.PagesCount))
    Dim jquestID = Html.Raw(Json.Encode(Model.SDS_ID))
End Code

<div  id="@(pcvsidstring)" 
    data-prwpcvsdsid="@(Model.SDS_ID)"
    data-prwpcvstring="@(pcvsidstring)"
    data-prwtype="pagecontentview"
    style="position:relative;min-height:235px;">
    <div  id="@(Model.PermanentGuidString)" 
        data-prwpcvsdsid="@(Model.SDS_ID)"
        data-prwtype="pagecontentviewcontent">
    
@For Each pcelem As MvcApplication2.PageContentElement In Model.PCElementsColxn
    @Html.Partial("PCElemViewPartial", pcelem)
Next
    
    </div>

</div>


@*<script  type="text/javascript">
   (function (prweb, $) {
       $('@(hslctrstring)').pagecontentview({questID: @(jquestID),  pcmid:@(jpcmid), mypgnumber:@(jpgnumber)});
   } (this.prweb, jQuery));
</script>*@
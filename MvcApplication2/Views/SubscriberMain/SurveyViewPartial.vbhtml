@ModelType MvcApplication2.PageContentModel
@Code
    Dim surveyiconmodel = Model.SurveyGuidString
    Dim jsurveyGuidstring = Html.Raw(Json.Encode(Model.SurveyGuidString))
    Dim sid = ViewData("SurveyID")
    'Dim jpcmidpgnumbersURL = Html.Raw(Json.Encode(Url.Action("JsonRetrieveSurveyPCMIDPgNumberList", "SubscriberMain", New With {.id = sid})))
    Dim resultsUrl = Url.Action("JsonRetrieveResults", "SubscriberMain", New With {.id = sid})
    Dim jresultsURL = Html.Raw(Json.Encode(resultsUrl))
    Dim sdsresponsemodelURL = Url.Action("JsonRetrieveSDSResponseModels", "SubscriberMain", New With {.id = sid})
    Dim jsdsresponsemodelURL = Html.Raw(Json.Encode(sdsresponsemodelURL))
    Dim pgZeroUrl = Url.Action("PageContentViewPartial", "SubscriberMain", New With {.id = ViewData("SurveyID"), .pgNumber = 0})
    Dim nextpagenumber = (Model.PgNumber - 1) + 1
    Dim prevpagenumber = Math.Max(0, (Model.PgNumber - 1) - 1)
    Dim pagesCount = Model.PagesCount
    Dim jpagesCount = Html.Raw(Json.Encode(pagesCount))
    Dim nxtPgURL = Url.Action("PageContentViewPartial", "SubscriberMain", New With {.id = ViewData("SurveyID"), .pgNumber = nextpagenumber})
    Dim jnxtPgURL = Html.Raw(Json.Encode(nxtPgURL))
    Dim x = 2
End Code

<div id="surveyresultsview" data-prwtype="surveyview"
     data-prwcornerradius="4"
     style="left:1px;right:1px;
            top:1px;bottom:1px;position:absolute;
            background-color:rgba(140,140,140,0.1);">
       <div id="@(Model.SurveyGuidString)" 
            data-prwcornerradius="4"
            style="left:0;right:0;top:0;bottom:0;
                height:100%;width:100%;position:relative;
                background-color:rgba(1,5,10,0.1);"
                data-prwtype="xpagecontentviewholder">
            <div id="pagespanelactions"  class="defaultshadow"
                data-prwtype="pagesscrollactions" 
                data-prwcornerradius="4">
                 <div id="prevsurveyview" style="left:0;top:0;bottom:0;position:absolute;margin-left:1%;display:none;">
                    <label>&laquo; Previous</label></div>
                    <div id="surveycurrentgrplabel" class="defaultshadow"
                         data-prwcornerradius="4"
                         style="position:absolute;left:0;right:0;top:0;bottom:0;width:50%;margin:auto;
                                font-size:0.8em;text-align:center;
                                background-color:rgba(2,2,2,0.2);">
                    </div>
                 <div id="nextsurveyview" style="margin-right:1%;right:0;top:0;bottom:0;position:absolute;"><label>Next &raquo;</label></div>
            </div>
            <div id="animatescrollpanel"    class="scrollablepagespanel"  
                 data-prwcornerradius="4" >
                <div id="pagespanelitemswrap" class="pagespanelitems" 
                     data-prwtype="pageslist"
                     data-prwcornerradius="4">
                     <div class="prwpage" style="float:left;height:100%;width:780px;">
                        <div id="scrpgitem0" class="scrpgitem"
                             data-pgUrl="@(pgZeroUrl)" 
                             style="height:100%;width:100%;">
                            @Html.Partial("PageContentViewPartial", Nothing)
                        </div>
                     </div>
                     <div class="prwpage" style="float:left;height:100%;width:780px;">
                        <div id="scrpgitem1" class="scrpgitem"
                             data-bind="html: sdxnry[1].pgobj" 
                             data-pgUrl="x" style="height:100%;width:100%;">
                        </div>
                     </div>
                     <div class="prwpage" style="float:left;height:100%;width:780px;">
                        <div id="scrpgitem2" class="scrpgitem"
                             data-bind="html: sdxnry[2].pgobj" 
                             data-pgUrl="x" style="height:100%;width:100%;">
                        </div>
                     </div>
                     <div class="prwpage" style="float:left;height:100%;width:780px;">
                        <div id="scrpgitem3" class="scrpgitem"
                             data-bind="html: sdxnry[3].pgobj" 
                             data-pgUrl="x" style="height:100%;width:100%;">
                        </div>
                     </div>
                     <div class="prwpage" style="float:left;height:100%;width:780px;">
                        <div id="scrpgitem4"  class="scrpgitem"                            
                             data-bind="html: sdxnry[4].pgobj" 
                             data-pgUrl="x" style="height:100%;width:100%;">
                        </div>
                     </div>
                </div>
            </div>
    </div>
       @*</li>*@
 @*</ul>*@
</div>

<script  type="text/javascript"> 
   (function (prweb, $) {
       $('#surveyresultsview').surveyview({ surveyGuidstring: @(jsurveyGuidstring), pagesCount: @(jpagesCount), nxtPgURL: @(jnxtPgURL)});
   } (this.prweb, jQuery))
</script>




@*        @Ajax.ActionLink("next", "PageContentViewPartial", "SubscriberMain", New With {.id = sid, .pgNumber = ViewData("NextPageNumber")}, New AjaxOptions With {.HttpMethod = "GET", _
                                                                                   .UpdateTargetId = Model.SurveyGuidString, _
                                                                                   .InsertionMode = InsertionMode.Replace})*@


                                                                                   @*    <div id="rsltsgroupscontainer"
         data-prwcornerradius="4"
         style="display:none;left:0;right:0;top:0;bottom:0;
                height:90%;width:99%;float:left;position:relative;
                padding-bottom: 2px;
                overflow: hidden;
                background-color:rgba(200,200,200,0.1);">Html.Partial("ResultsGroupListPartial", Nothing)</div>*@
@*    <div id="grpdefncontainer"
         data-prwcornerradius="4"
         style="display:none;left:0;right:0;top:0;bottom:0;
                height:90%;width:99%;float:left;position:relative;
                padding-bottom: 2px;
                overflow: hidden;
                background-color:rgba(1,200,1,0.1);">Html.Partial("ResultsGroupDefnPartial", Nothing)</div>*@
@Imports MvcApplication2
@Imports MvcApplication2.ResultsSvcNS
@Imports System.Collections.ObjectModel
@Code
    Dim sid = ViewData("SurveyID")
    Dim jrfgolistURL = Html.Raw(Json.Encode(Url.Action("JsonRetrieveResultsFilters", "SubscriberMain", New With {.id = sid})))
    Dim jsaveRfmURL = Html.Raw(Json.Encode(Url.Action("JsonSaveRFM", "SubscriberMain", New With {.id = sid})))
    Dim jsurveyid = Html.Raw(Json.Encode(sid))
    Dim jpcmidpgnumbersURL = Html.Raw(Json.Encode(Url.Action("JsonRetrieveSurveyPCMIDPgNumberList", "SubscriberMain", New With {.id = sid})))
    Dim rds As New List(Of RDentSet) From {New RDentSet With {.SetID = 0, .RFElemList = New List(Of ResultsFilterElementModel)}}
    Dim jnewrfm = Html.Raw(Json.Encode(New ResultsFilterModel With {.Name = "New Group", .SurveyID = sid, _
                                                                    .RFEM_List = New List(Of ResultsFilterElementModel), _
                                                                    .GroupResultsURL = Url.Action("JsonRetrieveResultsWithFilterGroup", "SubscriberMain", New With {.ID = sid, .rfmid = -1}), _
                                                                    .RDentSetsList = rds}))
    Dim jnewrfe = Html.Raw(Json.Encode(New ResultsFilterElementModel With {.IsPlaceholder = True}))
    Dim jnewrfgo = Html.Raw(Json.Encode(New ResultsFilterGroupObject With {.SurveyID = sid, _
                                                                           .QuestionIDList = New ObservableCollection(Of Integer), _
                                                                           .OptionIDList = New ObservableCollection(Of Integer)}))

    Dim jfilteredgroupresultsURL = Html.Raw(Json.Encode(Url.Action("JsonRetrieveResultsWithFilterGroup", "SubscriberMain", New With {.id = sid}))) ', .RFGOList = toc
    'Dim xxxx = 2
End Code
<div id="rsltgrplistview" 
     style="position:relative;
            padding:0.15em;"
     data-prwtype="rfgolistroot"
     data-prwcornerradius="4">
     <div id="rsltgrplistviewgrplistcontainer"            
           data-prwcornerradius="4"
           style="position:relative;padding:0.5em;background:rgba(250,252,250,1);">
      <div id="rfgoactions" class="touchnoshow" 
           data-prwcornerradius="4"
           style="position:relative;
                  width:98%;background-color: hsla(277, 100%, 6%,0.90);
                  margin-bottom:1px;overflow:hidden;">
            <div class="rsltgrplstprev prwnoselect" 
             style="position:absolute;top:1px;bottom:1px;left:1px;
                    width:20%;font-size:0.7em;"><div>&laquo; Up</div></div>

            <div class="rsltgrplstnext prwnoselect" 
                 style="position:absolute;top:1px;bottom:1px;left:79%;right:1px;
                        width:20%;font-size:0.7em;"><div>Down &raquo;</div></div>
      </div>

      <div id="rsltsgrplistrfgolistview" data-prwtype="rfgolistview" class="rfgolistview"
           data-prwcornerradius="4">
        <div id="rsltsgrplistitemsrfgo" data-bind='foreach: rfgoitems' class="itemsrfgo"
             style="position:relative;padding:0.1em"
             data-prwtype="rfgoitems"
             data-prwcornerradius="4">
             <div data-bind="attr: { 'data-prwgrprsltsurl': GroupResultsURL, 'data-prwrfmid': ID }, 
                             visible: IsDisplayable"
                    data-prwtype="rfgoitemcontainer" class="rfgoitemcontainer defaultshadow"
                    data-prwcornerradius="4" >

                   <div class="defaultshadow"
                        data-prwcornerradius="4"
                        style="background:rgba(251,253,251,1);">
                                    <div  class="prwnoselect"
                                          data-prwcornerradius="4"
                                            style="white-space: nowrap;font-size:0.8em;line-height:1.3em;color:hsla(290, 100%, 5%,1);margin-left:4px;
                                                display: block;
                                                text-overflow: ellipsis;
                                                overflow: hidden;"><div data-bind="text: Name">Edit</div></div>
                                     <div  class="prwnoselect"
                                           data-prwcornerradius="4"
                                            style="white-space: nowrap;font-size:0.8em;line-height:1.3em;color:hsla(290, 100%, 5%,1);margin-left:4px;
                                                display: block;
                                                text-overflow: ellipsis;
                                                overflow: hidden;"><div data-bind="text: MessageOnGroupIcon">Edit</div></div>
                   </div>

        
                             <div  data-bind="visible: IsRFMDirty" class="grplistsavecancelcontainer"
                                    data-prwcornerradius="4"
                                    style="margin-top:1px;margin-bottom:1px;
                                         position:absolute;left:15%;right:61%;top:40%;bottom:1px;">

                                    <div  data-prwcornerradius="4"
                                         style="position:absolute;left:0;right:0;top:1px;bottom:1px;margin:0;
                                                width:99%;">
                                        <div data-bind="visible: IsShowRsltsBtn"
                                             data-prwcornerradius="4"
                                                class="defaultshadow"
                                                style="padding:1px;
                                                position:absolute;left:0;right:0;top:0;bottom:52%;
                                                width:100%;overflow: hidden;">
                                                <div 
                                                     data-prwcornerradius="4" class="prwnoselect grplistsavebtn" 
                                                     style="background:hsl(125, 100%, 24%);
                                                            position:absolute;left:0;right:0;top:0;bottom:0;
                                                            overflow: hidden;">
                                                    <div style="position:absolute;left:0;right:0;top:0;bottom:0;
                                                                height:50%;line-height:130%;text-align:center;font-size:0.7em;
                                                                margin:auto;">Save</div>
                                                </div> 
                                         </div>
                                        <div  data-bind="visible: IsRFMDirty"
                                               class="defaultshadow"
                                               data-prwcornerradius="4"
                                                style="padding:1px;
                                                position:absolute;left:0;right:0;top:52%;bottom:0;
                                                width:100%;overflow: hidden;">
                                                <div 
                                                     data-prwcornerradius="4" class="prwnoselect grplistcancelbtn"
                                                     style="background:hsl(0, 100%, 24%);
                                                            position:absolute;left:0;right:0;top:0;bottom:0;
                                                            overflow: hidden;">
                                                    <div style="position:absolute;left:0;right:0;top:0;bottom:0;
                                                                height:50%;line-height:100%;text-align:center;font-size:0.7em;
                                                                margin:auto;">Discard Changes</div>
                                                </div> 
                                         </div>
                                    </div>
                            </div>                           

                             <div data-prwtype="activategroupbtn" class="defaultshadow prwnoselect activategroupbtn"
                                      data-prwcornerradius="4"
                                      data-bind="attr: { 'data-prwgrprsltsurl': GroupResultsURL, 'data-prwrfmid': ID, 'data-prwrfmguid' : Guid },
                                                visible: IsShowRsltsBtn"
                                      style="position:absolute;left:43%;right:29%;top:40%;bottom:2%;overflow: hidden;
                                             background:hsl(290, 100%, 21%);">
                                             <div style="position:absolute;left:0;right:0;top:35%;bottom:20%;
                                                         line-height:130%;text-align:center;font-size:0.7em;
                                                         margin:auto;">Results</div>
                                 </div>  

                             <div data-prwtype="editgroupbtn" class="defaultshadow prwnoselect editgroupbtn"
                                      data-prwcornerradius="4"
                                      data-bind="attr: { 'data-prwgrprsltsurl': GroupResultsURL, 'data-prwrfmid': ID }, visible: IsEditable"
                                      style="position:absolute;left:74%;right:1%;top:40%;bottom:2%;overflow: hidden;
                                             color:hsla(290, 100%, 5%,1);
                                             background:hsla(277, 100%, 73%,0.6)">
                                             <div style="position:absolute;left:0;right:0;top:35%;bottom:20%;
                                                 line-height:130%;text-align:center;font-size:0.7em;
                                                 margin:auto;">Edit</div>
                                 </div> 
                <div class="rsltsgrplistdeletable"
                     data-prwcornerradius="4"
                     style="position:absolute;left:1%;right:1%;top:40%;bottom:1px;
                            background:rgba(10,1,1,0.8);
                            display:none;">
                     <div data-prwcornerradius="4" class="prwnoselect rsltsgrplistdeletablebtn"
                          style="position:absolute;left:35%;right:35%;top:5%;bottom:5%;
                                 background:rgba(255,1,1,1);
                                 overflow: hidden;">
                          <div style="position:absolute;left:0;right:0;top:0;bottom:20%;
                                      height:50%;line-height:100%;text-align:center;font-size:0.7em;
                                      margin:auto;">Remove</div>
                    </div>
                </div>
             </div>
        </div>
      </div>

      <div data-prwcornerradius="4"
           style="position:relative;margin-top:0.5em;
                  padding:0.35em;
                  background:rgba(220, 220, 220, 1);">
           <div id="addgrpbtn" class="prwnoselect defaultshadow"
                data-prwcornerradius="4" 
                data-prwtype="addgrpbtn"
                style="display:inline-block;width:35%;
                       vertical-align:top;
                       margin-left:auto;
                       margin-right:auto;
                       padding:0.35em;
                       background:hsla(290, 100%, 25%,1);">
                 <div class="prwnoselect"
                      style="height:2em;padding:0.35em;padding-top:0.65em;text-align:center;font-size:0.7em;line-height:1em;">Add Group</div></div>
           <div id="removegrpbtn" class="prwnoselect defaultshadow"
                data-prwcornerradius="4" 
                data-prwtype="removegrpbtn"
                style="display:inline-block;width:35%;
                       vertical-align:top;
                       margin-left:17%;
                       padding:0.35em;
                       background:hsla(290, 100%, 25%,1);">                     
                <div class="prwnoselect"
                     style="height:2em;padding:0.35em;padding-top:0.65em;text-align:center;font-size:0.7em;line-height:1em;">Remove Group</div></div>
      </div>
    </div>
    <div id="rsltsgrplistviewhelpcontainer"
             data-prwcornerradius="4"
         style="position:relative;">
        <div id="rsltsgrplistviewhelppanel"
             data-prwcornerradius="4"
             style="position:relative;top:0.5em;background:rgba(234,235,235,0.2);">
             <div data-prwcornerradius="4"
                class="rsltsgrplistviewhelpitems" 
                style="position:relative;">
            <div id="rsltsgrplistviewhelpa" class="rsltsgrplistviewhelpitem"
                 data-prwcornerradius="4"
                style="color:rgba(20,1,20,1);background:rgba(255,255,255,0.98);
                        font-size:0.7em;line-height:1.2em;padding:0.5em;padding-left:1em;">
            <p>When you want to view results for only particular respondents, use a Group.</p>
            <p>Once you define a group, the Results button will show you statistics for that group only.</p>
            <p>Define as many groups as you like.  With several groups defined, you can quickly compare results between your groups. Differences between groups are frequently the most valuable insights from your research.</p>
            <p>To get started, use the Add Group button. Then use the Edit button to begin selecting respondents.</p>
            </div>
        </div>
        </div>
        <div id="rsltsgrplistviewhelpfooter" class="defaultshadow"
             data-prwcornerradius="4"
             style="position:relative;top:0.95em;padding-left:2em;padding-right:2em;padding-top:0.5em;padding-bottom:0.5em;
                    background:rgba(235,235,235,0.4);">

            @*<div style="font-size:0.7em;width:60%;margin-left:4px;margin-top:2px;display:none;">Respondent Set(s) in this Group</div>*@
                <div id="rsltsgrplistviewhelpfooterbtn" 
                    class="defaultshadow"
                    data-prwcornerradius="4" 
                    style="background:hsl(290, 100%, 24%);
                        position:relative;padding-left:1em;padding-right:1em;padding-top:0.75em;padding-bottom:0.75em;">
                        <div id="rsltsgrplistviewhelfooterbtnlabel" class="prwnoselect"
                                    data-prweditbtnlabel=""
                                    style="text-align:center;font-size:0.7em;line-height:1em;">Hide</div></div>
     </div>
    </div>

</div>
<script type="text/javascript">
    (function (prweb, $) {
        $("#rsltgrplistview").resultsgrouplist({ 
            dataURL: @(jrfgolistURL), 
            saveRfmURL: @(jsaveRfmURL), 
            pcmidpgnumbersUrl: @(jpcmidpgnumbersURL),
            newrfm:@(jnewrfm), 
            newrfe:@(jnewrfe), 
            newrfgo:@(jnewrfgo), 
            surveyID: @(jsurveyid), 
            grprsltsURL: @(jfilteredgroupresultsURL) 
        });
    } (this.prweb, jQuery));

</script>

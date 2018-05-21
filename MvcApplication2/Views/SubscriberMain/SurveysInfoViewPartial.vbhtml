<div id="surveysinfohomeroot"
     data-prwcornerradius="4">
    <div id="surveyplayercontainerwrapper" 
         data-prwcornerradius="4" 
         style="display:none;">@Html.Partial("SurveyPlayerPartial")</div>
    <div id="surveysinfohomecontentouter" 
         data-prwcornerradius="4">
         <div data-prwcornerradius="4" style="position:relative;padding:1em;background:rgb(255,255,251)">
                        <div id="surveysinfoeditdonebtn" class="prweditdonebtn prwbutton defaultshadow"
                             data-prwcornerradius="4"><span data-bind="text: editdonetext">Edit</span></div>
                        <div id="surveysinfobackcancelbtn" class="prwbackcancelbtn prwbutton defaultshadow"
                             data-prwcornerradius="4"><span data-bind="text: backcanceltext">Back</span></div>
         </div>
         <div class="prwnoselect">
            <div id="surveysinfoheadertext" class="viewrootheadertext"><p>Survey Info</p></div>
            <div data-prwcornerradius="4" class="viewrootpreambletext">
                             <p style="text-align: left;">Alter this survey's info here.</p>
                             <p style="text-align: left;">When you have finished, use the Done button to confirm your changes.</p>  
                             <p style="text-align: left;">Use the Cancel button to leave this survey's info unchanged.</p>
            </div>
         </div>
         <div id="surveysinfomessagewrapper" class="viewrootmessagewrapper prwnoselect" data-prwcornerradius="4" >
              <div id="surveysinfomessage" data-prwcornerradius="4" class="viewrootmessage defaultshadow">
                   <span data-bind="text: message">connecting to survey info...</span></div>
         </div>
 
         <div id="surveysinforoot" class="prwnoselect"
              data-prwcornerradius="4">
              <div id="surveysinfocontainer"
                   data-prwcornerradius="4">
                   <div id="surveysinfowrapper" data-prwcornerradius="4" >
                        <div data-prwcornerradius="4" class="publishstatusinfoitem">
                           <div id="prwsivsurveyname" data-prwcornerradius="4">
                                <span style="text-align:center;font-size:0.75em;line-height:1.2em;font-weight:bold;" 
                                      data-bind="text: surveyname">No Survey Selected</span></div>
                        </div>
                        <div id="surveysinfoviewpublishstatuswrapper" data-prwcornerradius="4" 
                             class="publishstatusinfoitem">
                            <div data-prwcornerradius="4">
                                 <span style="text-align:center;font-size:0.75em;line-height:1em;">Publish Status</span></div>
                            <div data-prwcornerradius="4">
                                 <span style="text-align:center;font-size:0.75em;line-height:1.2em;font-weight:bold;"
                                       data-bind="text: surveystatus">No Survey Selected</span></div>
                        </div>
                        <div id="surveyinfoscolxncontainer" class="publishstatusinfoitem"
                             data-bind="foreach: surveyinfodxnry"
                             data-prwcornerradius="4">
                             <div data-prwcornerradius="4" class="settingssectioncontainer defaultshadow">
                                  <div data-prwcornerradius="4" 
                                  class="surveysinfosectionheader"
                                  data-bind="surveyinfosvcxevent: isattached">
                                        <span class="settingssectionname" data-bind="text: SectionTitle">loading...</span>
                                  </div>
                                  <div data-prwcornerradius="4" class="surveyinfosectioncontentwrapper"
                                       data-bind="css:{ settingcontentcollapsed: iscollapsed }">
                                  <div data-prwcornerradius="4" class="surveyinfosectioncontentcontrolbtns"
                                       data-bind="visible: isenabled">
                                    <div class="surveyinfosectioncontentcontrolbtnswrapper">
                                        <div data-prwcornerradius="4" 
                                             class="addsurveyinfobtn surveysinfobtn prwbutton"
                                             data-bind="surveyinfosvcxevent: isattached"><span>Add   </span></div>
                                        <div data-prwcornerradius="4" 
                                             class="removesurveyinfobtn surveysinfobtn prwbutton"
                                             data-bind="surveyinfosvcxevent: isattached"><span>Remove</span></div>
                                    </div>
                                  </div>
                                  <div data-prwcornerradius="4" class="surveyinfosectioncontent"
                                       data-bind="foreach: SurveyInfoItemColxn">
                                       <div class="surveyinfoitemcontent">
                                            <div data-prwcornerradius="4" 
                                                class="surveyinfoitemeditbtn surveysinfobtn prwbutton" 
                                                data-bind="visible: isenabled,
                                                            surveyinfosvcxevent: isattached"><span>Edit</span></div>
                                            <div data-prwcornerradius="4" 
                                                class="surveyinfoitemremovebtn surveysinfobtn prwbutton" 
                                                data-bind="visible: isremoveenabled,
                                                            surveyinfosvcxevent: isattached"><span>Remove</span></div>
                                            <div class="surveyinfoitemwrapper defaultshadow" 
                                                data-prwcornerradius="4"
                                                data-bind="surveyinfosvcxevent: isattached">
                                                <div class="surveyinfoitemwrapperinner"
                                                     data-bind="template: { name: displayTemplate,
                                                                 foreach: visiblelemcolxn}"></div>
                                            </div>
                                        
                                       </div>
                                   </div>
                                  </div>
                             </div>
                             <div data-prwcornerradius="4"></div>
                             </div>
                        <div data-prwcornerradius="4" class="publishstatusinfoitem" >
                            <div data-prwcornerradius="4" >
                                <div id="surveysinfoshowpagesbtn" class="surveysinfobtn prwbutton defaultshadow"
                                  data-prwcornerradius="4">Survey Preview</div>
                            </div>
                   </div>
                   </div>
              </div>
         </div> 
    </div>

</div>
<div id="notecommenthomeroot" style="display:none;">
<div id="notecommenthomecontentouter" data-prwcornerradius="4">
         <div data-prwcornerradius="4" style="position:relative;padding:1em;background:rgb(255,255,251)">
                        <div id="notecommenteditdonebtn" class="prweditdonebtn prwbutton defaultshadow"
                             data-prwcornerradius="4"><span data-bind="text: editdonetext">Done</span></div>
                        <div id="notecommentbackcancelbtn" class="prwbackcancelbtn prwbutton defaultshadow"
                             data-prwcornerradius="4"><span data-bind="text: backcanceltext">Back</span></div>
         </div>
         <div class="prwnoselect">
            <div id="notecommentheadertext" class="viewrootheadertext">
                 <p data-bind="text: viewtitle">Notes and Comments</p></div>
            <div data-prwcornerradius="4" class="viewrootpreambletext">
                             <p style="text-align: left;">When you have finished, use the Done button to confirm your changes.</p>  
                             <p style="text-align: left;">Use the Cancel button to leave this unchanged.</p>
            </div>
         </div>
         <div id="notecommentmessagewrapper" class="viewrootmessagewrapper prwnoselect" data-prwcornerradius="4" >
              <div id="notecommentmessage" data-prwcornerradius="4" class="viewrootmessage defaultshadow">
                   <span data-bind="text: message">connecting to survey info...</span></div>
         </div>
         <div id="notecommentroot" 
              data-prwcornerradius="4"
              class="defaultshadow" style="padding:1em;">
               <div id="notecommentheaderroot" 
                    data-bind="visible: isheadervisible"
                    style="padding:1em;background:rgba(253,253,249,1);">
                    <div data-prwcornerradius="4" class="surveysinfoelement">
                        <div class="surveysinfoelementheader">Date:</div>
                        <div data-prwcornerradius="4" 
                             class="surveysinfoelementcontent">
                            <input type=date 
                                   data-bind="value: currentnc.date"/></div>
                    </div>
                    <div data-prwcornerradius="4" class="surveysinfoelement">   
                        <div class="surveysinfoelementheader">Title:</div>
                        <div data-prwcornerradius="4" class="surveysinfoelementcontent">
                            <input type=text 
                                   data-bind="value: currentnc.title" /></div>
                    </div>
                    <div data-prwcornerradius="4" class="surveysinfoelement">   
                        <div class="surveysinfoelementheader">Author:</div>
                        <div data-prwcornerradius="4" class="surveysinfoelementcontent">
                            <input type=text 
                                   placeholder="author text"
                                   data-bind="value: currentnc.author" /></div>
                    </div>
               </div>

                   <div id="notecommentbodyroot" data-prwcornerradius="4"            
                        style="background:rgba(253,253,249,1);
                                color:hsla(179,100%,5%,1);
                                padding:1em;
                                padding-bottom:2em;
                                text-align:left;
                                font-size:90%;">
                         <div data-prwcornerradius="4"
                              style="position:relative;height:14em;text-align:left;background:rgba(210,210,250,1);">
                              @Html.Partial("TextEntryViewPartial", Nothing)
                        </div>
                   </div>

                   @* <p>Use the Send button above to send your comment. Or use Cancel.</p>*@
         </div>
</div>
</div>
<script type="text/html" id="collapsed">
    <div data-prwcornerradius="4" class="surveysinfobody ellipsis" data-bind="html: $data.Valu"></div>
</script>
<script type="text/html" id="title">
    <div data-prwcornerradius="4" class="surveysinfoelement">
        <div class="surveysinfoelementheader"><span>Title: </span></div>
        <div data-prwcornerradius="4" class="surveysinfoelementcontent"><div class="ellipsis" style="position:relative;padding:0.25em;"><span data-bind="text: $data.Valu">is valu</span></div></div>
    </div>
</script>
<script type="text/html" id="date">
    <div data-prwcornerradius="4" class="surveysinfoelement">
        <div class="surveysinfoelementheader"><span>Date: </span></div>
        <div data-prwcornerradius="4" class="surveysinfoelementcontent surveysinfoelementcontentdate"><div class="ellipsis" style="position:relative;padding:0.25em;"><span data-bind="text: $data.Valu">is valu</span></div></div>
        
    </div>
</script>
<script type="text/html" id="author">
    <div data-prwcornerradius="4" class="surveysinfoelement">
        <div class="surveysinfoelementheader"><span>By: </span></div>
        <div data-prwcornerradius="4" class="surveysinfoelementcontent"><span data-bind="text: $data.Valu">is valu</span></div>
    </div>
</script>
<script type="text/html" id="body">
    <div data-prwcornerradius="4" class="surveysinfobody" data-bind="html: $data.Valu"></div>
    
</script>

@Code
    Dim sid = ViewData("SurveyID")
    Dim chngeSvyStatePkg As New MvcApplication2.AuthoringSvcNS.ChangeSurveyStatePackage With {.SurveyID = sid}
    Dim jchngeSvyStatePkg = Html.Raw(Json.Encode(chngeSvyStatePkg))
    Dim jrdentDxnryURL = Html.Raw(Json.Encode(ViewData("RDentLinkDxnryURL")))
    Dim jchngSurveyStateURL = Html.Raw(Json.Encode(Url.Action("JsonChangeSurveyStatus", "SubscriberMain", New With {.id = sid})))
    Dim jsendRentEmailURL = Html.Raw(Json.Encode(Url.Action("JsonSendRDentLinkEmail", "SubscriberMain", New With {.id = sid})))
End Code

<div id="publishhomeroot" 
     data-prwcornerradius="4">

    <div id="publishhomecontentouter" class="prwnoselect"
         data-prwcornerradius="4">
                     <div data-prwcornerradius="4" style="position:relative;padding:1em;background:rgb(255,255,251)">
                        <div id="publisheditdonebtn" class="prweditdonebtn prwbutton defaultshadow"
                             data-prwcornerradius="4"><span data-bind="text: editdonetext">Edit</span></div>
                        <div id="publishbackcancelbtn" class="prwbackcancelbtn prwbutton defaultshadow"
                             data-prwcornerradius="4"><span data-bind="text: backcanceltext">Back</span></div>
                      </div>
                      <div >
                             <div id="publishheadertext" class="viewrootheadertext"><p>Publish</p></div>
                             <div data-prwcornerradius="4" class="viewrootpreambletext">
                             <p style="text-align: left;">Manage respondent access to this survey here.</p> 
                             <p>This survey will accept new respondents when its publish status is set to Open. When this survey's publish status is set to Closed, 
                              it will prohibit new respondents. Use the Edit button to change this survey's publish status.</p>
                             <p style="text-align: left;">Open and Close this survey as often as you like.</p>
                             <p style="text-align: left;">Use the Done button to confirm your change to this survey's publish status.</p>  
                             <p style="text-align: left;">Use the Cancel button to leave this survey's publish status unchanged.</p>
                             </div>
                       </div>
                        <div id="publishmessagewrapper" class="viewrootmessagewrapper" data-prwcornerradius="4" >
                            <div id="publishmessage" data-prwcornerradius="4" class="viewrootmessage defaultshadow">
                                <span data-bind="text: message">connecting to publish info...</span></div>
                        </div>
        <div id="publishstatusinforoot" 
             data-prwcornerradius="4">
            <div id="publishstatusinfocontainer"  data-prwcornerradius="4" class="defaultshadow">
                 <div id="publishstatusinfowrapper"   data-prwcornerradius="4">
                      <div id="publishtostatuscontainer" data-prwcornerradius="4" class="publishstatusinfoitem"
                            data-bind="visible: ischangeenabled"> 
                           <div  data-prwcornerradius="4" class="publishstatusinfoiteminner  defaultshadow">
                                <div  data-prwcornerradius="4"
                                     style="text-align:center;padding:1.5em;padding-bottom:0.75em;padding-top:0.75em;
                                        font-size:0.75em;line-height:1em;
                                        background:hsla(0, 10%, 92%, 1);">
                                        <div id="publishtostatusbtn" data-prwcornerradius="4" class="prwbutton defaultshadow">Change Publish Status</div>
                                </div>              
                                <div  class="publishsurveyview"
                                     data-prwcornerradius="4"
                                     style="text-align:center;padding:1.5em;padding-top:1em;padding-bottom:1em;
                                            font-size:0.75em;line-height:1.25em;font-weight:bold;
                                            background:rgb(255,255,255);">
                                     <span data-bind="text: availabletostatus">not available</span></div>
                           </div>

                      </div>
                      <div data-prwcornerradius="4" class="publishstatusinfoitem">
                        <div data-prwcornerradius="4" class="publishstatusinfoiteminner  defaultshadow">
                           <div data-prwcornerradius="4" 
                                style="text-align:center;
                                        padding:1.5em;padding-bottom:0.75em;padding-top:0.75em;
                                        font-size:0.75em;line-height:1em;
                                        background:hsla(0, 10%, 92%, 1);">Survey Publish Status</div>
                                <div id="publishcurrentstatus" 
                                     data-prwcornerradius="4"
                                     style="text-align:center;padding:1.5em;padding-top:1em;padding-bottom:1em;
                                            font-size:0.75em;line-height:1.25em;font-weight:bold;
                                            background:rgb(255,255,255);">
                                     <span data-bind="text: surveystatusstring">SurveyStateID</span></div>
                        </div>
                      </div>
                        <div id="publishmsgarea"  class="publishstatusinfoitem"
                             data-prwcornerradius="4" 
                             data-bind="visible: isservermsgenabled"
                             style="text-align:center;padding:0.5em;font-size:0.75em;">
                                    <span data-bind="text: msgfromserver">sample msg from server...</span></div>
                        <div data-prwcornerradius="4" class="publishlinkurl publishstatusinfoitem">
                               <div id="rdentlinksendemailbtn" class="publishsendlinkbtn publishlinkbtn prwbutton"
                                        data-prwcornerradius="4">Email Link</div>
                               <div id="rdentlinkbtn" class="publishshowlinkbtn publishlinkbtn prwbutton"
                                         data-prwcornerradius="4">Show Link</div>
                               <div class="publishlinkurltextwrapper prwnoselect">
                                    <textarea id="rdentlinktext" class="publishlinkurltext prwselectabletext" 
                                              data-bind="text: myrdentlink, visible: islinkvisible"></textarea>
                                </div>
                            

                            
                        </div>
                 </div>
            </div>
        </div>
    </div>
</div>

<script  type="text/javascript"> 
   (function (prweb, $) {
       var initobj = {
        chngeSvyStatePkg: @(jchngeSvyStatePkg), 
        chngSurveyStateURL: @(jchngSurveyStateURL),
        sendRentEmailURL:@(jsendRentEmailURL),
        rdentDxnryURL: @(jrdentDxnryURL)};
       $('#publishhomeroot').publishsurveyview(initobj);
       initobj = null;
       return true;
   } (this.prweb, jQuery))
</script>
<div id="rsltsgrpdefnview" 
     style="position:relative;padding-left:0.35em;padding-right:0.1em;"
     data-prwtype="rgroupdefnroot"
     data-prwcornerradius="4">
     <div id="grpdefncontentroot" data-prwtype="grpdefncontentroot" 
          data-prwcornerradius="4" 
          style="position:relative;
                 padding:0.15em;
                 padding-right:0;
                 background:rgba(243,243,238,1);">
       <div id="grpsrdentsetlistcontainer" 
            data-prwcornerradius="4"
            style="position:relative;
                   padding:0.15em;
                   background:rgba(253,253,250,1);">
          <div id="grpdefnlist" data-prwtype="grpdefnlist"  class="grpdefnlist"
               data-prwcornerradius="4"
               style="position:relative;
                      max-height:16em;
                      overflow:auto;">        
            <div data-bind='foreach: rfelemlist.RDentSetsList' class="itemsgrpdefn"
                 data-prwtype="grpdefngrouplist"
                 data-prwcornerradius="4"
                 style="position:relative;padding:0.25em;">
             <div data-prwtype="grpdefngroupitemcontainer" class="grpdefngroupitemcontainer"
                  data-bind="attr: { 'data-prwsetnum': SetID }"
                  data-prwcornerradius="4" 
                  style="position:relative;
                         padding:0.15em;
                         padding-bottom:0.55em;">
                <div data-prwcornerradius="4" class="defaultshadow"
                     style="position:relative;
                            padding-left:3em;
                            padding-bottom:0.45em;
                            padding-top:0.25em;
                            padding-right:0.25em;
                            background-color:hsla(277, 100%, 73%,0.1);">
                    <div data-prwcornerradius="4" style="position:relative;height:2.5em;padding:0.25em;background-color:hsla(277, 100%, 73%,0.3);">
                    @*<div style="width:40%;position:absolute;top:1px;bottom:1px;left:4px;display:none;">Respondent Set</div>*@
                        <div data-prwtype="xrfelembtn" data-prweditbtnstate="edit"
                         class="xrfelembtn defaultshadow prwnoselect"
                         data-prwcornerradius="4"
                         style="position:relative;
                                padding:0.65em;
                                background:hsla(290, 59%, 37%,1);">
                             <div data-prweditbtnlabel="" class="prwnoselect prweditbtnlabel"
                                    style="position:relative;
                                           text-align:center;font-size:0.8em;line-height:1.3em;">Edit</div>
                        </div>
                    </div>
                    <div data-prwcornerradius="4" class="grpdefnpageslistscollerroot defaultshadow"
                         style="position:relative;height:11em;
                                padding:0.25em;
                                padding-right:0;
                                padding-top:0;
                                overflow:auto;
                                background:rgba(250, 250, 245, 1);">
                        <div data-prwcornerradius="4" 
                             class="prwnoselect grpdefnselectedpageslist"
                             style="position:relative;
                                    padding:0.15em;
                                    padding-right:0;
                                    padding-top:0;background:rgba(255, 255, 251, 1);">
                             @*<div style="display:none;height:5%;font-size:0.7em;padding:2px;margin-left:2px;color:rgb(120,1,120);">Selected Pages</div>*@
                             <div class="rfelemhelpmessage"
                                  style="position:relative;text-align:right;
                                         font-size:0.7em;line-height:1em;
                                         padding:1em;padding-top:0;padding-bottom:0;
                                         color:rgb(120,1,120);"><p data-bind="html: HelpMessage" ></p></div>
                             <div data-prwtype="rfelembtn" class="grpdefnselectedpageitem"
                                  data-bind='foreach: RFElemList' 
                                  data-prwtype="includedpageslist" 
                                  data-prwcornerradius="4"
                                  style="position:relative;">
                                       <div class="defaultshadow"
                                            data-prwcornerradius="12" 
                                            style="margin:5px;
                                                   width:60%;height:3em;margin-left:35%;
                                                   text-align:right;
                                                   border: 1px solid hsla(290, 100%, 61%, 0.4);">
                                                   <div data-prwtype="includedpageicon" 
                                                        data-bind="attr: { 'data-prwpcmid': PCM_ID, 'data-prwpgnum': PgNumber, 'data-prwsetnum': $parent.SetID }"
                                                        data-prwcornerradius="12"
                                                        style="width:99%;height:99%;line-height:1em;
                                                               position:relative;
                                                               background:#ff9900">
                                                        <div data-prwcornerradius="12"
                                                             style="padding-top:0.5em;padding-right:1em;text-align:right;font-size:0.7em;">Page</div>
                                                        <div data-bind="text: $root.toPgNum($data)"
                                                             style="display:none"></div>
                                                             <div data-bind="text: PgNumber"
                                                                  data-prwcornerradius="12"
                                                                  style="padding-top:0.5em;padding-right:1em;
                                                                            text-align:right;font-size:0.7em;">Btn 1</div>
                                                   </div>
                                       </div> 
                             </div> 
                        </div>
                    </div>
                </div>
             </div>
            </div>

          </div>

       </div>
     </div>
     <div id="grpheaderpanel" 
          data-prwcornerradius="4"
          style="display:none;
                 position:relative;
                 padding:0.25em;
                 margin-top:1em;
                 margin-bottom:1em;
                 background:rgba(253,253,250,1);">

          <div  data-bind="text: rfelemlist.MessageOnGroupIcon"
                    style="text-align:center;overflow:hidden;font-size:0.7em;color:hsla(290, 100%, 5%,1);">Size</div>

          <div id="grpdefnsavecancelcontainer"
               data-prwcornerradius="4"
               style="position:relative;
                      width:40%;
                      height:6em;
                      padding:0.25em;
                      margin:auto;">
                                        <div data-bind="visible: rfelemlist.IsRFMDirty"
                                             data-prwcornerradius="4"
                                             class="defaultshadow"  
                                             style="position:absolute;left:1px;right:1px;top:1px;bottom:53%;">
                                             <div id="grpdenfsavebtn" data-bind="with: rfelemlist, visible: rfelemlist.IsShowRsltsBtn"
                                                  data-prwcornerradius="4" class="prwnoselect"
                                                  style="background:hsl(125, 100%, 24%);
                                                         position:absolute;left:0;right:0;top:0;bottom:0;
                                                         overflow:hidden;">
                                                    <div style="position:absolute;left:0;right:0;top:0;bottom:0;
                                                                height:50%;line-height:130%;text-align:center;font-size:0.7em;
                                                                margin:auto;">Save</div>
                                             </div> 
                                         </div>
                                        <div data-bind="visible: rfelemlist.IsRFMDirty"
                                             data-prwcornerradius="4"
                                             class="defaultshadow"   
                                             style="position:absolute;left:1px;right:1px;top:53%;bottom:1px;">
                                             <div id="grpdenfcancelbtn"
                                                  data-prwcornerradius="4" class="prwnoselect"
                                                  style="background:hsl(0, 100%, 24%);
                                                         position:absolute;left:0;right:0;top:0;bottom:0;
                                                         overflow:hidden;">
                                                    <div style="position:absolute;left:0;right:0;top:0;bottom:0;
                                                                height:50%;line-height:130%;text-align:center;font-size:0.7em;
                                                                margin:auto;">Cancel</div>
                                             </div> 
                                         </div>
          </div>

          <div id="previewrsltsbtncontainer"  data-prwcornerradius="4" 
               style="position:relative;
                      width:40%;
                      margin:auto;
                      margin-top:0.5em;
                      margin-bottom:0.5em;
                      height:3em;
                      padding:0.5em;
                      background:rgba(220,220,220,1);">
                  <div id="previewrsltsbtn" class="defaultshadow"
                       data-prwcornerradius="4"
                       style="position:relative;
                              height:1.8em;
                              background:hsl(220, 100%, 28%);
                              padding:0.65em;
                              border-color:transparent;border-width:0.1em;border-style:solid;"> 
                              <div class="prwnoselect"
                                     style="text-align:center;font-size:0.7em;">Results</div></div>
             </div>

     </div>
     <div id="grpdefnheadername" class="defaultshadow"
          data-prwcornerradius="4" 
                     style="position:relative;height:2em;padding-top:0.65em;
                            border:1px solid rgba(255,255,255,1);
                            background:rgba(253,253,250,1);">
                    <input id="grpheadernametxtarea" type="text" 
                           data-prwcornerradius="4"
                           data-bind="value: rfelemlist.Name"
                           style="width:96%;
                                  background:rgba(250,250,250,1);"/>
     </div>
     <div id="rdentsetbtncontainer"
          data-prwcornerradius="4"
          style="display:none;position:relative;margin-top:0.5em;
                 background:rgb(255,255,253);">
                 <div id="addrdentsetbtn" class="defaultshadow"
                      data-prwcornerradius="4"
                      style="position:relative;
                             display:inline-block;
                             vertical-align:top;
                             margin-left:2%;
                             width:36%;height:1.5em;
                             padding:0.25em;
                             padding-top:0.65em;
                             padding-bottom:0.5em;
                             background:hsl(290, 60%, 36%);">
                     <div class="prwnoselect"
                          style="text-align:center;font-size:0.7em;line-height:1em;">Add Respondent Set</div></div>
                 
                 <div id="removerdentsetbtn" class="defaultshadow"
                      data-prwcornerradius="4"
                      style="position:relative;
                             display:inline-block;
                             vertical-align:top;
                             margin-left:1%;
                             height:1.5em;
                             padding:0.25em;
                             padding-top:0.65em;
                             padding-bottom:0.5em;
                             background:hsl(290, 60%, 36%);">
                     <div class="prwnoselect"
                          style="text-align:center;font-size:0.7em;line-height:1em;">Remove Respondent Set</div></div>
                 
     </div>
    <div id="rsltsgrpdefnhelpcontainer"
         data-prwcornerradius="4"
         style="position:relative;
                padding:0.65em;
                padding-right:0;">
        <div id="rsltsgrpdefnhelppanel"
             data-prwcornerradius="4"
             style="position:relative;
                    background:rgba(234,235,235,0.2);">
            <div data-prwcornerradius="4"
                 class="rsltsgrpdefnhelpitems" 
                 style="position:relative;">
         <div id="rsltsgrpdefnhelpbasic" class="defaultshadow prwnoselect rsltsgrpdefnhelpitem" 
                data-prwcornerradius="4"
                style="color:rgba(20,1,20,1);
                       background:rgba(255,255,253,1);
                       font-size:0.7em;line-height:1.2em;
                       padding:0.85em;">
        <p>Select the respondents you want to include in this Group.</p>
        <p>Choose any answer on any page. Choose as many answers and as many pages as you like.</p>
        <p>Respondents will be included in this group only if they selected each answer that you choose.</p>
        <p>To get started, use the Edit button above and begin choosing answers.</p>
        <p>More advanced segmentation options are available if you need them,  just use the Advanced button below.</p>
     </div>
         <div id="rsltsgrpdefnhelpadvanced" class="defaultshadow prwnoselect rsltsgrpdefnhelpitem" 
          data-prwcornerradius="4"
          style="display:none;
                 color:rgba(20,1,20,1);
                 background:rgba(255,255,253,1);
                 font-size:0.7em;line-height:1.2em;
                 padding:0.85em;">
        <p>With Advanced you have more ways to select respondents for your group.</p>
        <p>You still choose any answers you like, just like with basic groups.</p>
        <p>Basic lets you select one set of respondents. Advanced lets you select many sets of respondents.</p>
        <p>The sets are combined to form one overall group of respondents.  If particular respondents happen to be selected in more than one set, the respondents' answers are counted only once.</p>
        <p>To get started, use the Add Respondent Set button.  Then just use the Edit button to choose the answers you want for the new set.</p>
     </div>
        </div>
        </div>

        <div id="grpsrdentsetheader" class="defaultshadow rsltsgrpdefnhelpitem"
             data-prwcornerradius="4"
             style="position:relative;height:2em;
                    padding:0.65em;
                    background:rgba(245,245,243,1);">

            @*<div style="font-size:0.7em;width:60%;margin-left:4px;margin-top:2px;display:none;">Respondent Set(s) in this Group</div>*@
            <div id="rsltgrpdefnadvancedbtn" 
                 class="defaultshadow"
                 data-prwcornerradius="4" 
                 style="position:relative;
                        width:48%;
                        padding:0.65em;
                        margin:auto;
                        background:hsl(290, 100%, 24%);">
                        <div id="rsltgrpdefnadvancedbtnlabel" class="prwnoselect"
                             data-prweditbtnlabel=""
                             style="text-align:center;font-size:0.7em;line-height:1.2em;
                                    margin:auto;">Advanced</div></div>
     </div>
     
     </div>
</div>
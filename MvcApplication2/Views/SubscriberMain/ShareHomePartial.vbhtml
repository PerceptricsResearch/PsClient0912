<div id="sharehomeroot"
         data-prwcornerradius="4">
                <div id="sharehomecontentouter" 
                     data-prwcornerradius="4">
                     <div data-prwcornerradius="4" style="position:relative;padding:1em;background:rgb(255,255,251)">
                        <div id="shareeditdonebtn" class="prweditdonebtn prwbutton defaultshadow"
                             data-prwcornerradius="4"><span data-bind="text: editdonetext">Edit</span></div>
                        <div id="sharebackcancelbtn" class="prwbackcancelbtn prwbutton defaultshadow"
                             data-prwcornerradius="4"><span data-bind="text: backcanceltext">Back</span></div>
                        <div>
                             <div class="viewrootheadertext"><p>Share</p></div>
                             <div data-prwcornerradius="4" class="viewrootpreambletext">
                             <p>Select how you want to share this survey from the list below. Your survey will be available using the link that
                                 appears for each sharing method.</p>
                             <p>Use the Send Email button, or just copy the link and send it to whomever you want.</p>
                             <p>When you want to stop sharing this survey, just un-select the "Share" box. The survey will no longer be available using the link.</p>
                             </div>
                         </div>
                         <div class="viewrootmessagewrapper" data-prwcornerradius="4">
                            <div id="sharelinkmessage" data-prwcornerradius="4" 
                                class="viewrootmessage defaultshadow"><span data-bind="text: message">connecting to share info...please wait.</span></div>
                         </div>
                        
                        <div id="sharesurveylinksroot" class="prwslideouthide">
                            <div id="sharesurveylinkscontainer"
                                 data-prwcornerradius="4"
                                 data-bind="foreach: slinksdxnry() ">
                                <div data-prwcornerradius="4" class="sharelinkcontainer defaultshadow">
                                    <div data-prwcornerradius="4" class="sharelinkheader">
                                        <p class="sharelinkname" data-bind="text: name">loading...</p>
                                        <p class="sharelinkdescription" data-bind="text: description">loading...</p>
                                    </div>
                                    <div data-prwcornerradius="4" class="sharelinkcontent">
                                        <div  class="sharelinkselectwrapper">
                                            <div data-prwcornerradius="4" class="sharelinkselectinnerwrapper defaultshadow">
                                            <div class="sharelinkselecttext"><span>Share </span></div>
                                            <select class="sharelinkselect" data-bind="options: alternativevaluescolxn, value: currentvalue, enable: isenabled"></select>
                                            </div>
                                        </div>
                                        <div class="sharelinkurl" data-bind="visible: isshared">
                                            <div class="sharesendlinkbtn sharelinkbtn prwbutton" data-prwcornerradius="4">Send Link</div>
                                            <div class="shareshowlinkbtn sharelinkbtn prwbutton" data-prwcornerradius="4">Show Link</div>
                                            <div class="sharelinkurltextwrapper prwnoselect">
                                                @*<div class="sharelinkurltext"  
                                                         data-bind="html: linkurl, visible: linkisvisible">no name</div>*@
                                               <textarea class="sharelinkurltext prwselectabletext" 
                                                         data-bind="text: linkurl, visible: linkisvisible">no name</textarea>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            
                        </div>
                        
                     </div>
                </div> 

</div>
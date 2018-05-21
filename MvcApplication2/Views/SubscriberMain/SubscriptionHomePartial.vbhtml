<div id="subscriptionhomeroot"
     data-prwcornerradius="4">
     <div id="subscriptionhomecontentouter" 
          data-prwcornerradius="4">
          <div id="subscriptionhomecontentinner" data-prwcornerradius="4" style="position:relative;padding:1em;background:rgb(255,255,251)">
               <div id="subscriptioneditdonebtn" class="prweditdonebtn prwbutton defaultshadow"
                    data-prwcornerradius="4"><span data-bind="text: editdonetext">Edit</span></div>
               <div id="subscriptionbackcancelbtn" class="prwbackcancelbtn prwbutton defaultshadow"
                    data-prwcornerradius="4"><span data-bind="text: backcanceltext">Back</span></div>
                        <div>
                           <div data-prwcornerradius="4" class="viewrootheadertext"><p>Subscription</p></div>
                           <div data-prwcornerradius="4" class="viewrootpreambletext">
                                <p style="text-align: left;">Select from the available subscription options in the list below.
                                    After you change your subscription level, use the Done button to confirm your changes.</p>  
                                <p style="text-align: left;">Use the Cancel button to leave your subscription unchanged.</p>
                            </div>                   
                         </div>
                        <div id="subscriptionmessagewrapper" class="viewrootmessagewrapper" data-prwcornerradius="4" >
                            <div id="subscriptionmessage" data-prwcornerradius="4" class="viewrootmessage defaultshadow"><span data-bind="text: message"></span></div>
                        </div>
                        <div id="subscriptioninforoot" class="prwslideouthide">
                            <div id="subscriptioninfocontainer"
                                 data-prwcornerradius="4"
                                 data-bind="foreach: subscriptiondxnry ">
                                <div class="subscriptionitemwrapper defaultshadow" data-prwcornerradius="4"
                                     data-bind="css: { subscriptionitemselected: isselected }">
                                    <div class="subscriptionitemheader" data-prwcornerradius="4">
                                        <p class="subscriptionitemheadername" data-bind="html: name">loading...</p>
                                        <p class="subscriptionitemheaderdescription" data-bind="html: description">loading...</p>
                                    </div>
                                    <div data-prwcornerradius="4" class="subscriptionitemdetails"
                                         data-bind="foreach: subscriptionvaluescolxn ">
                                        <div class="subscriptionitemdetailscontent" data-prwcornerradius="4">
                                        <div class="subscriptionitemdetailswrapper" data-prwcornerradius="4">
                                            <div class="subscriptionitemdetailskey" data-bind="html: Key"></div>
                                            <div class="subscriptionitemdetailsvalu" data-bind="html: Valu"></div>
                                        </div>
                                        </div>
                                    </div>
                                    <div class="suscriptionitemglass" ></div>
                                </div>
                            </div>

                        </div>
          </div>
     </div>
</div>
<div id="settingshomeroot"
         data-prwcornerradius="4">
                <div id="settingshomecontentouter" 
                     data-prwcornerradius="4">
                     <div data-prwcornerradius="4" style="position:relative;padding:1em;background:rgb(255,255,251)">
                        <div id="settingseditdonebtn" class="prweditdonebtn prwbutton defaultshadow"
                             data-prwcornerradius="4"><span data-bind="text: editdonetext">Edit</span></div>
                        <div id="settingsbackcancelbtn" class="prwbackcancelbtn prwbutton defaultshadow"
                             data-prwcornerradius="4"><span data-bind="text: backcanceltext">Back</span></div>
                      </div>
                      <div >
                             <div id="settingsheadertext" class="viewrootheadertext"><p>Settings</p></div>
                             <div data-prwcornerradius="4" class="viewrootpreambletext">
                             <p style="text-align: left;">Alter your app settings and preferences here.</p>
                             <p style="text-align: left;">When you have finished, use the Done button to confirm your changes.</p>  
                             <p style="text-align: left;">Use the Cancel button to leave your settings and preferences unchanged.</p>
                             </div>
                       </div>
                        <div id="settingsmessagewrapper" class="viewrootmessagewrapper" data-prwcornerradius="4" >
                            <div id="settingsmessage" data-prwcornerradius="4" class="viewrootmessage defaultshadow">
                                <span data-bind="text: message">connecting to settings info...</span></div>
                        </div>
                        <div id="settingsinforoot" data-prwcornerradius="4" class="prwslideouthide">
                            <div id="settingsinfocontainer" 
                                 data-prwcornerradius="4"
                                 data-bind="foreach: settingsdxnry ">
                                <div data-prwcornerradius="4" class="settingssectioncontainer defaultshadow">
                                    <div data-prwcornerradius="4" class="settingssectionheader">
                                        <span class="settingssectionname" data-bind="text: SectionName">loading...</span>
                                    </div>
                                    <div data-prwcornerradius="4" class="settingssectioncontent"
                                         data-bind="foreach: SettingsItemColxn, css:{ settingcontentcollapsed: iscollapsed } ">
                                        <div class="settingsinfoitemcontent">
                                        <div class="settingsinfoitemwrapper" data-prwcornerradius="4">
                                            <div class="settingsinfoitemname"><span data-bind="text: name">loading...</span></div>
                                            <div class="settingsinfoitemvalue" >
                                                <select data-bind="options: alternativevaluescolxn, value: currentvalue, enable: isenabled"></select>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                 </div>
</div>

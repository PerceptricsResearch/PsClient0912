 <div id="surveypagenavirootcontainer" class="prwnoselect" style="position:relative;height:100%;"
      data-prwcornerradius="4">
    <div style="position:relative;height:100%;">
       <div id="surveypagenaviroot" data-prwcornerradius="4"  style="position:relative;">    
           <div id="surveypagenavicontainerwrapper" data-prwcornerradius="4" class="defaultshadow">
               <div id="surveypagenavicontainer" data-scale="1"
                    class="surveypagenavicontainer"
                    data-prwcornerradius="4">
                   <div id="surveypagenaviscrollable" data-scale="1"
                        class="surveypagenaviscrollable">
                     <div id="surveypagenaviitems"
                          class="surveypagenaviitems"
                          data-bind="foreach: pageslist">
                          <div class="prwpageicon" data-prwcornerradius="4"
                               data-bind="attr: {'data-prwpgnum': $data.pgnumber}">
                              <div class="prwpageiconcontent prwnoselect"
                                     data-prwcornerradius="8"
                                    data-bind="html: 'Page '+ $data.pgnumber,
                                               css: { selectedpageicon: $data.isselected,
                                                      defaultpageicon: $data.isdefault } ">Page 1</div>
                           </div>
                     </div>
                   </div>
                   <div id="surveypagenaviprevnextbtnscontainer" class="prwnoselect"
                        data-prwcornerradius="4">
                        <div id="surveypagenaviprev"
                             class="surveypagenaviprev"
                             data-prwcornerradius="4">Previous</div>
                        <div id="surveypagenavinext"
                             class="surveypagenavinext"
                             data-prwcornerradius="4">Next</div>
                   </div>
               </div>
           </div>
       </div> 
    </div>
 </div>
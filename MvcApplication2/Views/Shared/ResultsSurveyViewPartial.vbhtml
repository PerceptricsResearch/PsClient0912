<div id="resultssurveyviewroot" class="resultssurveypanelresizable" style="position:relative;height:100%;">
 <div id="resultssurveyviewcontainer" style="position:relative;width:100%;height:100%;">
  <div id="resultsplayercontainer"  
         data-prwcornerradius="4" style="position:relative;width:100%;height:100%;">
         <div id="appmessagewrapper" class="viewrootmessagewrapper prwnoselect" data-prwcornerradius="4" >
            <div id="appmessage" data-prwcornerradius="4" class="viewrootmessage defaultshadow">
                <span data-bind="text: message">...loading results...</span></div>
         </div>
   <div data-prwcornerradius="4" style="position:relative;width:100%;height:100%;">
   <div id="resultsplayerroot"
        style="padding-left:1em;padding-right:1em;
                position:relative;height:100%;min-width:18em;max-width:58em;">
    <div class="sixteennine aspectratio"></div>
    <div id="resultsplayersurveycontainerwrapper" style="position:absolute;top:0;bottom:0;right:0;left:0;">
    <div id="resultsplayersurveycontainer" class="defaultshadow"
         data-scale="1"
         data-prwcornerradius="4"
         style="padding:2px;
                background:rgba(245,255,250,0.1);
                position:relative;top:1px;bottom:1px;overflow:auto;height:90%;">
       <div id="resultsplayersurveyscrollable"
            data-scale="1"  
            data-prwcornerradius="4"
            style="overflow:hidden;position:relative;height:100%;
                   background:rgba(180,180,180,0.3);
                   border:1px solid hsla(179,100%,5%,0.2);"><div id="defaultloadingpage">Loading...</div>
         <div id="resultsplayersurveyitems" class="surveyplayersurveyitems"
              data-prwcornerradius="4" 
              style="width:200em;position:relative;">
              
             <div class="surveyplayersurveypage" 
                  data-scale="1"
                  style="display:inline-block;
                         height:100%;
                         vertical-align:top;position:relative;">
                  <div class="sixteennine aspectratio"></div>
                  <div id="resultsplayersurveypage0"  class="surveyplayersurveyitem"
                       data-bind="foreach: { data: sdxnry[0].pgobj().pcelemcolxn(), afterAdd: sdxnry[0].widgetizeAddedElement },
                                  visible: sdxnry[0].isvisible" 
                       data-pgUrl="x"
                       style="position:absolute;top:0;bottom:0;right:0;left:0;">
                       <div data-bind="html: $data.modelcore.html, attr: { 'id': $data.pcelemID } "
                            class="pcelem"
                            style="position:absolute;min-height:1.5em;"></div></div>
             </div>
             <div class="surveyplayersurveypage"
                  data-scale="1"
                  style="display:inline-block;
                         height:100%;
                         vertical-align:top;position:relative;">
                  <div class="sixteennine aspectratio"></div>
                  <div id="resultsplayersurveypage1"  class="surveyplayersurveyitem"
                       data-bind="foreach: { data: sdxnry[1].pgobj().pcelemcolxn(), afterAdd: sdxnry[1].widgetizeAddedElement },
                                  visible: sdxnry[1].isvisible" 
                       data-pgUrl="x"
                       style="position:absolute;top:0;bottom:0;right:0;left:0;">
                       <div data-bind="html: $data.modelcore.html, attr: { 'id': $data.pcelemID } "
                            class="pcelem"
                            style="position:absolute;min-height:1.5em;"></div></div>
             </div>
             <div class="surveyplayersurveypage" 
                  data-scale="1"
                  style="display:inline-block;
                         height:100%;
                         vertical-align:top;position:relative;">
                  <div class="sixteennine aspectratio"></div>
                  <div id="resultsplayersurveypage2"  class="surveyplayersurveyitem"
                       data-bind="foreach: { data: sdxnry[2].pgobj().pcelemcolxn(), afterAdd: sdxnry[2].widgetizeAddedElement },
                                  visible: sdxnry[2].isvisible" 
                       data-pgUrl="x"
                       style="position:absolute;top:0;bottom:0;right:0;left:0;">
                       <div data-bind="html: $data.modelcore.html, attr: { 'id': $data.pcelemID } "
                            class="pcelem"
                            style="position:absolute;min-height:1.5em;"></div></div>
              </div>
         </div>
       </div>
    </div>
    <div id="resultsplayerprevnextbtnscontainer" class="prwnoselect"
             data-prwcornerradius="4" 
             style="position:relative;left:0;right:0;bottom:0;
                    margin-top:1em;
                    height:2em;
                    font-size: 1em;
                    background:rgba(1,40,40,0.8);">
         <div id="surveycurrentgrplabel" class="defaultshadow"
              data-prwcornerradius="4"
              style="position:absolute;left:0;right:0;top:0;bottom:0;width:50%;margin:auto;
                     font-size:0.8em;text-align:center;
                     background-color:rgba(2,2,2,0.2);"></div>
        <div id="resultsplayerprev"
             data-prwcornerradius="4" 
             style="position:absolute;top:1px;bottom:1px;left:1%;right:85%;
                    color:rgb(255,255,255);text-align:center;
                    padding:0.26em;">Previous</div>
        <div id="resultsplayernext"
             data-prwcornerradius="4" 
             style="position:absolute;top:1px;bottom:1px;right:1%;left:85%;
                    color:rgb(255,255,255);text-align:center;
                    padding:0.26em;">Next</div>
        </div>
    </div>
   </div>
   </div>
  </div>
 </div>
</div>
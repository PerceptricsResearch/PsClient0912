<div id="surveyplayercontainer"  
     data-prwcornerradius="4">
   <div style="position:relative;min-height:200px;min-width:280px;">
   <div id="surveyplayerroot"
        style="padding-left:2%;padding-right:2%;margin-top:0em;margin-bottom:0em;position:relative;">
    <div id="surveyplayersurveycontainerwrapper">
    <div id="surveyplayersurveycontainer" class="defaultshadow"
         data-scale="1"
         data-prwcornerradius="4"
         style="padding:2px;
                background:rgba(245,255,250,1);
                position:relative;top:1px;bottom:1px;left:1px;right:1px;">
       <div id="surveyplayersurveyscrollable"
            data-scale="1"  
            data-prwcornerradius="4"
            style="overflow:hidden;position:relative;
                   background:rgba(180,180,180,0.3);
                   border:1px solid hsla(179,100%,5%,0.2);"><div id="defaultloadingpage">Loading...</div>
         <div id="surveyplayersurveyitems" class="surveyplayersurveyitems"
              data-prwcornerradius="4" 
              style="width:500em;position:relative;">
             <div class="surveyplayersurveypage" 
                  data-scale="1"
                  style="display:inline-block;
                         height:100%;min-height:400px;
                         vertical-align:top;font-size:70%;position:relative;">
                  <div id="surveyplayersurveypage0"  class="surveyplayersurveyitem"
                       data-bind="foreach: { data: sdxnry[0].pgobj().pcelemcolxn(), afterAdd: sdxnry[0].widgetizeAddedElement },
                                  visible: sdxnry[0].isvisible" 
                       data-pgUrl="x"
                       style="height:100%;width:100%;position:relative;">
                       <div data-bind="html: $data.modelcore.html, attr: { 'id': $data.pcelemID } "
                            class="pcelem"
                            style="position:absolute;min-height:40px;"></div></div>
             </div>
             <div class="surveyplayersurveypage"
                  data-scale="1"
                  style="display:inline-block;
                         height:100%;min-height:400px;
                         vertical-align:top;font-size:70%;position:relative;">
                  <div id="surveyplayersurveypage1"  class="surveyplayersurveyitem"
                       data-bind="foreach: { data: sdxnry[1].pgobj().pcelemcolxn(), afterAdd: sdxnry[1].widgetizeAddedElement },
                                  visible: sdxnry[1].isvisible" 
                       data-pgUrl="x"
                       style="height:100%;width:100%;position:relative;">
                       <div data-bind="html: $data.modelcore.html, attr: { 'id': $data.pcelemID } "
                            class="pcelem"
                            style="position:absolute;min-height:40px;"></div></div>
             </div>
             <div class="surveyplayersurveypage" 
                  data-scale="1"
                  style="display:inline-block;
                         height:100%;min-height:400px;
                         vertical-align:top;font-size:70%;position:relative;">
                  <div id="surveyplayersurveypage2"  class="surveyplayersurveyitem"
                       data-bind="foreach: { data: sdxnry[2].pgobj().pcelemcolxn(), afterAdd: sdxnry[2].widgetizeAddedElement },
                                  visible: sdxnry[2].isvisible" 
                       data-pgUrl="x"
                       style="height:100%;width:100%;position:relative;">
                       <div data-bind="html: $data.modelcore.html, attr: { 'id': $data.pcelemID } "
                            class="pcelem"
                            style="position:absolute;min-height:40px;"></div></div>
              </div>
         </div>
       </div>
       <div id="surveyplayerprevnextbtnscontainer" class="prwnoselect"
             data-prwcornerradius="4" 
             style="position:relative;left:0px;right:0px;
                    margin-top:0.5em;
                    height:2em;
                    font-size: 0.8em;
                    background:rgba(1,40,40,0.8);">
        <div id="surveyplayerprev"
             data-prwcornerradius="4" 
             style="position:absolute;top:1px;bottom:1px;left:1%;right:85%;
                    color:rgb(255,255,255);text-align:center;
                    padding:0.26em;">Previous</div>
        <div id="surveyplayernext"
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
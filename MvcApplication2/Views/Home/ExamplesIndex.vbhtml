@*<script src="@Url.Content("~/Scripts/prweb.marketingexamplessvc.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/prweb.marketingexamples.js")" type="text/javascript"></script>*@
<div id="marketingexamplescontainer"  
     data-prwcornerradius="4">
   <h4>Examples</h4>
   <div id="marketingexamplesroot">
      <div id="examplesgallerycontainer" class="examplesgallerycontainer"
          data-prwcornerradius="4" 
          style="background:rgba(180,180,180,1);
                 border:1px solid hsla(179,100%,5%,0.2);
                 display:inline-block;
                 width:48%;min-width:200px;
                 vertical-align:top;
                 color:hsla(179,100%,5%,1);">
        <div id="marketingexamplesgallerykonode"
             data-prwcornerradius="4" 
             data-bind='foreach: gallery' class="examplesgalleryitems"
             style="padding-left:0.5em;padding-right:1em;">
             <div class="examplesgalleryitemcontainer"
                  data-prwcornerradius="4"
                  style="background-color:rgba(255,255,255,1);border:1px solid hsla(179,100%,5%,0.2);">
                  <div class="examplesgalleryitem defaultshadow" 
                        data-prwcornerradius="4"
                        style="border:1px solid hsla(79,100%,35%,0.2);">
                                    <div  class="prwnoselect"
                                          data-prwcornerradius="4"
                                            style="white-space: nowrap;font-size:90%;color:hsla(290, 100%, 5%,1);margin-left:0.5em;margin-top:0.5em;
                                                display: block;
                                                text-overflow: ellipsis;
                                                overflow: hidden;"><div data-bind="text: SurveyName">Loading Examples...</div></div>
                                     @*<div  class="prwnoselect"
                                           data-prwcornerradius="4"
                                            style="white-space: nowrap;font-size:80%;color:hsla(290, 100%, 5%,1);margin-left:4px;
                                                display: block;
                                                text-overflow: ellipsis;
                                                overflow: hidden;"><div data-bind="text: URL"></div></div>*@
                   </div>        
             </div>
        </div>
        <div id="galleryprevnextbtnscontainer" class="prwnoselect"
             data-prwcornerradius="4" 
             style="position:relative;left:0px;right:0px;
                    height:1.8em;
                    font-size: 0.8em;
                    background:rgba(1,40,40,0.6);">
        <div id="galleryprev"
             data-prwcornerradius="4" 
             style="position:absolute;top:1px;bottom:1px;left:1%;right:85%;
                    color:rgb(255,255,255);
                    padding:0.2em;">Back</div>
        <div id="gallerynext"
             data-prwcornerradius="4" 
             style="position:absolute;top:1px;bottom:1px;right:1%;left:85%;
                    color:rgb(255,255,255);text-align:right;
                    padding:0.2em;">More</div>
        </div>
     </div>
      <div id="galleryitemdescriptioncontainer" class="defaultshadow"
           data-prwcornerradius="4" 
           style="display:inline-block;
                  width:49%;min-width:200px;
                  vertical-align:top;
                  font-size:90%;
                  color:hsla(179,100%,5%,1);
                  background:rgba(235, 235, 235,0.9);
                  border:1px solid hsla(179,100%,5%,0.2);">
           <div style="padding-left:2em;padding-right:1.5em;">
                <h4>SurveyName goes here...</h4>
                <p>this is a long description of the survey selected on the left.</p>
                <p>It describes how this survey might be used.How many pages it contains.How long it would take a respondent to complete it.</p></div>
     </div>
   </div>
   <div id="surveyplayercontainerwrapper" 
        style="position:relative;
               min-height:280px;min-width:320px;">
         @Html.Partial("SurveyPlayerPartial")
   </div>  
</div>

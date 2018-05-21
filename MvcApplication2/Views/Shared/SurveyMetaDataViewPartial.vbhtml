 
 <div id="prwsmdroot" data-prwtype="smdroot" class="defaultshadow"
      data-prwcornerradius="4">
 
 <div id="smdactions"  data-prwcornerradius="4">
        <div style="text-align:center;position:absolute;left:0;right:0;top:0.5em;">Details</div>
        <div style="display:none;">
            <div class="smdprev" style="position:absolute;top:0;left:5%;right:65%"><div>&laquo; Back</div></div>
            <div class="smdnext" style="position:absolute;top:0;right:5%;left:65%;color:rgb(255,255,255);height:20px;"><div>More &raquo;</div></div>
        </div>
 </div>
<div id="prwsmditemsset" data-prwtype="surveymetadataview" class="scrollablesmd vertical">
   <div id="prwsmdkobindingpoint"  class="itemssmd" 
        data-prwtype="smditems"
        data-prwcornerradius="4">
        <div class="prwsmditemcontainer" data-prwtype="smditemcontainer"
             data-prwcornerradius="4">
             <div class="smdsection" data-prwcornerradius="4">
                <div data-prwcornerradius="4" class="smdsectiontitle">Respondent Details</div>
                <div  class="smdkeyrow"
                      data-prwcornerradius="4"><div>Active Respondents</div></div>
                      <div  class="smdvaluerow"
                            data-prwcornerradius="4"><div data-bind="text: dxnry.ActiveRDentsComputed" ></div></div>
                <div  class="smdkeyrow"
                      data-prwcornerradius="4"><div>Respondents Completing</div></div>
                      <div  class="smdvaluerow"
                            data-prwcornerradius="4"><div data-bind="text: dxnry.RespondentCompletedCount" ></div></div>
                <div  class="smdkeyrow"
                      data-prwcornerradius="4"><div>Last Respondent Completing</div></div>
                      <div  class="smdvaluerow"
                           data-prwcornerradius="4"><div data-bind="text: dxnry.LastRespondentCompletedDate" ></div></div>
                <div  class="smdkeyrow"
                      data-prwcornerradius="4"><div >Respondents Starting</div></div>
                      <div  class="smdvaluerow"
                            data-prwcornerradius="4"><div data-bind="text: dxnry.RespondenStartedtCount" ></div></div>
                <div  class="smdkeyrow"
                      data-prwcornerradius="4"><div >Last Respondent Starting</div></div>
                      <div  class="smdvaluerow"
                           data-prwcornerradius="4"><div data-bind="text: dxnry.LastRespondentStartedDate" ></div></div>
                <div  class="smdkeyrow"
                      data-prwcornerradius="4"><div >First Respondent</div></div>
                      <div  class="smdvaluerow"
                            data-prwcornerradius="4"><div data-bind="text: dxnry.FirstRespondentPostedDate" ></div></div>
            </div>

        </div>
        <div class="prwsmditemcontainer" data-prwtype="smditemcontainer"
             data-prwcornerradius="4">@*data-prwtype=smdignatz*@
             <div class="smdsection" data-prwcornerradius="4">
                <div data-prwcornerradius="4" class="smdsectiontitle"">Publish Details</div>
                <div  class="smdkeyrow"
                      data-prwcornerradius="4"><div >Last Published</div></div>
                      <div  class="smdvaluerow"
                           data-prwcornerradius="4"><div data-bind="text: dxnry.LastPublishedDate" ></div></div>
                <div  class="smdkeyrow"
                      data-prwcornerradius="4"><div >First Published</div></div>
                      <div  class="smdvaluerow"
                            data-prwcornerradius="4"><div data-bind="text: dxnry.FirstPublishedDate" ></div></div>
             </div>
        </div>
        <div class="prwsmditemcontainer" data-prwtype="smditemcontainer"
             data-prwcornerradius="4">@*data-prwtype=smdignatz*@
             <div class="smdsection" data-prwcornerradius="4">
                <div data-prwcornerradius="4" class="smdsectiontitle">Design Details</div>
                <div  class="smdkeyrow"
                      data-prwcornerradius="4"><div >Created</div></div>
                      <div  class="smdvaluerow"
                           data-prwcornerradius="4"><div data-bind="text: dxnry.CreatedDate" ></div></div>
                <div  class="smdkeyrow"
                      data-prwcornerradius="4"><div >Last Modified</div></div>
                      <div  class="smdvaluerow"
                            data-prwcornerradius="4"><div data-bind="text: dxnry.LastModifiedDate" ></div></div>
             </div>
        </div>
   </div>
</div>
</div>


@*<script type="text/javascript">
    (function (prweb, $) {
        $(".scrollablesmd").scrollable({ vertical: true,  mousewheel: true });
        $('div[data-prwtype=smdroot]').surveymetadata({ ignatzmodelx: 'barneyxxxx' });
    } (this.prweb, jQuery));

</script>*@
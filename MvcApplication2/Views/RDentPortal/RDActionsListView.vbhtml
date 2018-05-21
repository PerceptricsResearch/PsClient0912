<div id="rdactionslistpanel" class="defaultshadow"
     data-prwcornerradius="12">
    <div id="rdactionslistpanelactions"  
         data-prwcornerradius="12"
            style="left:0;right:0;top:0;bottom:0;position:relative;padding:2px;
                    width:100%;height:2em;
                    font-size:0.8em;
                    color:White;
                    background-color: hsla(189, 100%, 12%, 1);">
        <div class="prev" style="margin-left:1%;display:inline-block;vertical-align:middle;width:45%;"><div>&laquo; Back</div></div>
        <div class="next" style="margin-right:3%;display:inline-block;vertical-align:middle;width:45%;text-align:right;"><div style="position:relative">More &raquo;</div></div>
    </div>
    <div id="rdactionslistitemscontainer" data-prwcornerradius="12" 
        style=" left:0;right:0;top:2px;bottom:0;position:relative;padding:0;
                width:90%;height:90%;margin:auto;background:rgba(255,255,255,0.3);">
    <div class="rdactionlistbtn" data-bind="visible: restartbtnvisible" >
        <div id="rdactionsbtnrestart" data-prwcornerradius="12" class="rdactionslistitem prwnoselect">Restart</div>
    </div>
    <div class="rdactionlistbtn" data-bind="visible: finishbtnvisible" >
        <div id="rdactionsbtnfinish" data-prwcornerradius="12" class="rdactionslistitem prwnoselect">Finish</div>
    </div>
    <div class="rdactionlistbtn" data-bind="visible: quitbtnvisible" >
        <div id="rdactionsbtnquit" data-prwcornerradius="12" class="rdactionslistitem prwnoselect">Quit</div>
    </div>
    <div class="rdactionlistbtn" data-bind="visible: rdactionsbtnvwrslts" >
        <div id="rdactionsbtnvwrslts" data-prwcornerradius="12" class="rdactionslistitem prwnoselect">View Results</div>
    </div>
    <div class="rdactionlistbtn prwnoselect" data-bind="visible: rdactionsbtnprivacy" >
        <div id="rdactionsbtnprivacy" data-prwebdomain="privacy"
             data-prwcornerradius="12" class="rdactionslistitem prwnoselect dpbtn">Privacy</div>
    </div>
    <div class="rdactionlistbtn prwnoselect" data-bind="visible: rdactionsbtnauthinfo">
        <div id="rdactionsbtnauthinfo" data-prwebdomain="authorinfo"
             data-prwcornerradius="12" class="rdactionslistitem prwnoselect dpbtn">Author Info</div>
    </div>
    <div class="rdactionlistbtn prwnoselect" data-bind="visible: rdactionsbtncomment">
        <div id="rdactionsbtncomment"  data-prwebdomain="comment"
             data-prwcornerradius="12" class="rdactionslistitem prwnoselect dpbtn">Comment</div>
    </div>
    <div class="rdactionlistbtn prwnoselect" data-bind="visible: rdactionsbtnprsch" >
        <div id="rdactionsbtnprsch" data-prwebdomain="perceptrics"
             data-prwcornerradius="12" class="rdactionslistitem prwnoselect dpbtn">Perceptrics Research</div>
    </div>
    </div>
    
    @* @Html.Partial("_SurveyIconListViewPartial")*@
</div>
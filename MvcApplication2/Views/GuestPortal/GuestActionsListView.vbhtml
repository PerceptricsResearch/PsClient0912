<div id="guestactionslistpanel" 
     data-prwcornerradius="4">
 <div class="slideoutcontentpanel">
     <div id="guestactionslistpanelactions"  
         data-prwcornerradius="4"
         style="left:0;top:0;position:relative;
                height:2em;
                font-size:0.8em;
                color:White;
                background-color: hsla(189, 100%, 12%, 1);">
        <div style="text-align:center;position:absolute;left:0;right:0;top:0.5em;">Actions</div>
        <div style="display:none;">
        <div class="prev" style="margin-left:1%;display:inline-block;vertical-align:middle;width:45%;">
        <div>&laquo; Back</div>
        </div>
        <div class="next" style="margin-right:3%;display:inline-block;vertical-align:middle;width:45%;text-align:right;">
        <div style="position:relative">More &raquo;</div>
        </div>
        </div>
    </div>
    <div id="guestactionslistitemscontainer" data-prwcornerradius="4" 
        style=" left:0;top:0;position:relative;
                padding:0.25em;
                background:rgba(254, 255, 253, 0.96);">

    <div class="guestactionlistbtn" data-bind="visible: groupsbtnvisible" >
        <div id="guestactionsbtngroups" data-prwcornerradius="12" class="guestactionslistitem prwnoselect">Groups</div>
    </div>
    <div class="guestactionlistbtn" data-bind="visible: detailsbtnvisible" >
        <div id="guestactionsbtndetails" data-prwcornerradius="12" class="guestactionslistitem prwnoselect">Details</div>
    </div>
@*    <div class="guestactionlistbtn" data-bind="visible: guestactionsbtnvwrslts" >
        <div id="guestactionsbtnvwrslts" data-prwcornerradius="12" class="guestactionslistitem prwnoselect">View Results</div>
    </div>*@
    <div class="guestactionlistbtn" data-bind="visible: guestactionsbtnhelp" >
        <div id="guestactionsbtnhelp" data-prwebdomain="help"
             data-prwcornerradius="12" class="guestactionslistitem prwnoselect dpbtn">Help</div>
    </div>
    <div class="guestactionlistbtn prwnoselect" data-bind="visible: guestactionsbtnprivacy" >
        <div id="guestactionsbtnprivacy" data-prwebdomain="privacy"
             data-prwcornerradius="12" class="guestactionslistitem prwnoselect dpbtn">Privacy</div>
    </div>
    <div class="guestactionlistbtn prwnoselect" data-bind="visible: guestactionsbtnauthinfo">
        <div id="guestactionsbtnauthinfo" data-prwebdomain="authorinfo"
             data-prwcornerradius="12" class="guestactionslistitem prwnoselect dpbtn">Author Info</div>
    </div>
    <div class="guestactionlistbtn prwnoselect" data-bind="visible: guestactionsbtncomment">
        <div id="guestactionsbtncomment"  data-prwebdomain="comment"
             data-prwcornerradius="12" class="guestactionslistitem prwnoselect dpbtn">Comment</div>
    </div>
    <div class="guestactionlistbtn prwnoselect" data-bind="visible: guestactionsbtnprsch" >
        <div id="guestactionsbtnprsch" data-prwebdomain="perceptrics"
             data-prwcornerradius="12" class="guestactionslistitem prwnoselect dpbtn">Perceptrics Research</div>
    </div>
    </div>
 </div>

</div>
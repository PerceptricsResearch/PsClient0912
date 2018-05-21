@*this view is used in the RDentPortal and also the SubscriberHome complex...
it gets a different widget attached to it by "host" views that employ it....
For the bindings to work...it is required that the widget uses a viewmodel that expose a property named "pageslist"..."pageslist" must be a simple array of integers...*@

<div id="survepageslistpanel" 
     data-prwtype="survepageslistpanel"
     data-prwcornerradius="12"
     style="left:0;right:0;top:0;bottom:0;position:relative;padding:0;
            width:99%;height:99%;margin:auto;margin-top:1px;overflow:hidden;
            background-color: hsla(189, 100%, 2%, 0.6)">
    <div id="survepageslistpanelactions" data-prwtype="surveypageslistpanelscrollverticalactions" data-prwcornerradius="12"
            style="left:0;right:0;top:0;bottom:0;position:relative;padding:2px;
            width:100%;height:30px;
            color:White;
            background-color: hsla(189, 100%, 8%, 0.9)">
        <a class="prev" style="margin-left:1%;"><label>&laquo; Back</label></a>
        <a class="next" style="margin-right:3%;float:right"><label style="position:relative">More &raquo;</label></a>
    </div>
    <ul data-prwcornerradius="12"
        data-bind="foreach: pageslist"
        style=" left:0;right:0;top:2px;bottom:0;position:relative;padding:0;
                width:90%;height:90%;margin:auto;overflow:hidden;
                list-style:none;
                background-color: hsla(189, 100%, 18%, 0.0)">
    <li class="prwrdpageicon" data-bind="attr: {'data-prwpgnum': $data}"
    
        style="width:60%;margin-left:29%;margin-bottom:5px;height:40px" >
        <div data-prwcornerradius="12" data-bind="text: 'Page '+ $data"
             style="width:95%;text-align:center;margin:auto;padding:2px;
                    color:White;
                    border: 1px solid hsla(179, 54%, 64%, 0.2);
	                background-color: hsla(189, 100%, 7%, 0.9);">Page 1</div>
    </li>
    </ul>
</div>
<script  type="text/javascript">
    (function (prweb, $) {
        $('#shomepagespanel').surveypageslist();
    } (this.prweb, jQuery))
</script>
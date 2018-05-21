<div id="groupsslideoutpanel" 
     data-prwcornerradius="4"
     style="position:absolute;top:0;bottom:0;left:0;right:0;
            color:White;overflow:hidden;">
    <div class="slideoutcontentpanel" style="position:absolute;top:0;bottom:0;left:0;right:0;">
            <div data-prwcornerradius="4"
                 style="position:relative;
                        height:2em;
                        padding:0.25em;
                        background-color: hsla(290, 100%, 12%, 1);">
                        <div id="backtogroupsbtn" class="prwnoselect"
                            data-prwcornerradius="4"
                             style="background:hsla(290, 100%, 15%,1);
                                    position:absolute;left:4px;right:1px;top:1px;bottom:1px;
                                    width:25%;
                                    display:none;border:1px solid rgba(120,120,120,0.8);
                                    overflow:hidden;">
                                    <div style="position:absolute;left:0;right:0;top:0;bottom:0;
                                                  height:50%;line-height:120%;
                                                  text-align:center;font-size:0.8em;
                                                  margin:auto;">Groups</div>
                                    </div>
                        <div id="grpsslideouttitlebar" class="prwnoselect"
                             style="position:absolute;left:30%;right:1px;top:0;bottom:0;
                                    width:40%;height:2em;padding:0.5em">
                                    <div style="text-align:center;font-size:0.8em;">Groups</div></div>
                        <div id="showgrpshelpbtn" class="prwnoselect"
                             data-prwcornerradius="4"
                             style="display:none;
                                    position:absolute;left:74%;right:1px;top:1px;bottom:1px;
                                    width:25%;height:92%;
                                    border:1px solid rgba(180,120,180,0.8);
                                    background:hsla(290, 100%, 15%,0.2);
                                    overflow:hidden;">
                                    <div style="position:absolute;left:0;right:0;top:0;bottom:0;
                                                  height:50%;line-height:120%;
                                                  text-align:center;font-size:0.8em;
                                                  margin:auto;">Help</div>
                                    </div>

            </div>
            <div id="gspbackplane" style="position:absolute;font-size:0.8em;padding:4em;text-align:center;">Loading...</div>
            <div id="rsltgrpscontainers" 
                 style="position:absolute;top:3em;bottom:0.25em;left:0.25em;right:0.25em;margin:0.25em;
                        overflow:auto;">
                <div id="rsltsgroupscontainer"
                    data-prwcornerradius="4"
                    style="position:relative;
                            padding:0.1em;
                            background-color:rgba(241,243,241,1);"></div>
                <div id="grpdefncontainer"
                    data-prwcornerradius="4"
                    style="display:none;
                            position:relative;
                            padding:0.1em;
                            background-color:rgba(241,243,241,1);">@Html.Partial("ResultsGroupDefnPartial", Nothing)</div> 
            </div>        
    </div>
</div>
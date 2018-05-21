@Code
    ViewData("Title") = "Perceptrics Research Home"
    Dim jlogonurl = Html.Raw(Json.Encode(Url.Action("LogOn", "Account")))
    Dim jlogoffurl = Html.Raw(Json.Encode(Url.Action("LogOff", "Account")))
    Dim jmarketingresourcesUrl = Html.Raw(Json.Encode(Url.Action("JsonRetrieveMarketingResources", "Home")))
    Dim jaccountresourcesUrl = Html.Raw(Json.Encode(Url.Action("JsonRetrieveAccountResources", "Account")))
    'Dim jtinymceurl = Html.Raw(Json.Encode(Url.Content("~/Scripts/tinymce/tiny_mce.js")))
End Code
    <script src="http://cdnjs.cloudflare.com/ajax/libs/linq.js/2.2.0.2/linq.min.js" type="text/javascript"></script>
    @*<script src="@Url.Content("~/Scripts/linq.min.js")" type="text/javascript"></script>*@
    <script src="http://cdnjs.cloudflare.com/ajax/libs/knockout/2.3.0/knockout-min.js" type="text/javascript"></script>
    @*<script src="@Url.Content("~/Scripts/knockout-2.1.0.js")" type="text/javascript"></script>*@
    <script src="@Url.Content("~/Scripts/prweb.debugsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.events.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pubsub.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.status.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.data.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.gestureizer.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.pinchpanzoom.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.scroller.js")" type="text/javascript"></script>

    <script src="@Url.Content("~/Scripts/prweb.observablemodelsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.marketingexamplessvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.marketingexamples.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.marketingsvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.mktmgr.js")" type="text/javascript"></script>
    
    <script src="@Url.Content("~/Scripts/prweb.pcvmodesvc.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.activequestoptset.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.marketinghome.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/HomeIndex.js")" type="text/javascript"></script>

<div id="homeindexcontainer"  
     data-prwcornerradius="4"
     style="min-width:12em;
            position:absolute;top:0em;bottom:0em;left:0;right:0;
            overflow:auto;">
<div data-prwcornerradius="4" class="prwnoselect"
     style="position:relative;overflow:auto;
            font-size:96%;">
                <ul 
                    style="margin-left:1em;padding:0px;
                           list-style:none;color:rgb(1,65,45);">
                    <li data-prwcornerradius="4"
                        style="display:inline-block;margin-bottom:0.4em;margin-left:0px;">
                    <div id="prwebhomebtn" class="prwnoselect" data-prwcornerradius="4"
                    style="margin-right:3em;border:1px solid rgba(1,65,45,0.1);padding:0.25em;">Home</div>
                    </li>
                    <li data-prwcornerradius="4"
                        style="display:inline-block;margin-bottom:0.4em;margin-left:0px;">
                    <div id="prwebsignupbtn" class="prwnoselect" data-prwcornerradius="4"
                    style="display:none;margin-right:3em;border:1px solid rgba(1,65,45,0.1);padding:0.25em;">Sign Up</div>
                    </li>
                    <li data-prwcornerradius="4"
                        style="display:inline-block;margin-bottom:0.4em;margin-left:0px;">
                    <div id="prwebloginbtn" class="prwnoselect" data-prwcornerradius="4" 
                         style="display:none;margin-right:3em;border:1px solid rgba(1,65,45,0.1);padding:0.25em;">Subscriber Login</div>
                    </li>
                    <li data-prwcornerradius="4"
                        style="display:inline-block;margin-bottom:0.4em;margin-left:0px;">
                    <div id="prwebpricingbtn" class="prwnoselect" data-prwcornerradius="4"
                    style="display:none;margin-right:3em;border:1px solid rgba(1,65,45,0.1);padding:0.25em;">Pricing</div>
                    </li>
                    <li data-prwcornerradius="4"
                        style="display:inline-block;margin-bottom:0.4em;margin-left:0px;">
                    <div id="prwebcasestudiewbtn" class="prwnoselect" data-prwcornerradius="4"
                    style="display:none;margin-right:3em;border:1px solid rgba(1,65,45,0.1);padding:0.25em;">Case Studies</div>
                    </li>
                    <li data-prwcornerradius="4"
                        style="display:inline-block;margin-bottom:0.4em;margin-left:0px;">
                    <div id="prwebexamplesbtn" class="prwnoselect" data-prwcornerradius="4"
                    style="display:none;margin-right:3em;border:1px solid rgba(1,65,45,0.1);padding:0.25em;">Examples</div>
                    </li>
@*                    <li data-prwcornerradius="4"
                        style="display:inline-block;margin-bottom:0.4em;margin-left:0px;">
                    <div id="prwebdebugbtn" class="prwnoselect" data-prwcornerradius="4"
                    style="margin-right:3em;border:1px solid rgba(220,220,220,0.1);padding:0.25em;">Debug</div>
                    </li>*@
                </ul>
</div>

<div id="homeindexshadowdiva" class="defaultshadow" 
     style="margin-left:1em;margin-right:1em;width:96%;height:1px;
            background:rgba(1,60,40,0.5);">
</div>

<div id="homeindexcontentarea" 
     data-prwcornerradius="4"
     style="position:relative;padding-left:1em;padding-right:0.5em;padding-bottom:3em;padding-top:0.25em;min-width:18em;">
    <div id="marketinghometoproot" >
            <div  data-prwcornerradius="4"
         style="padding-left:10%;padding-right:10%;">
    <div id="homeindexcontentscrollableareatop"  
         data-prwcornerradius="4"
         style="overflow:hidden;position:relative;
                background:rgba(1,60,40,0.6);">
        <div id="hisatopitems" class="hisatopitemscontainer"
             data-prwcornerradius="4" 
             style="width:500em;">
            <div  class="hisatoppage" 
                  style="display:inline-block;
                         height:100%;min-height:200px;
                         vertical-align:top;">
             <div id="hisatoppage0"  class="hisatopitem" 
                  style="position:relative;">
            <div id="homepage1" class="ppztargetitem"
                      data-prwcornerradius="4"
                      style="margin-left:10%;margin-right:10%;margin-top:1em;">
                 <div id="homepage1contenta" class="prwnoselect defaultshadow"
                      data-prwcornerradius="4"
                      style="background:rgba(255,255,255,1);
                             color:hsla(179,100%,5%,1);
                             border:1px solid hsla(179,100%,5%,0.6);
                             padding:1.5em;padding-left:2em;
                             font-size:1em;">
                            <img src="@Url.Content("~/Content/prlogo7.png")" alt="" class="defaultshadow"
                    data-prwcornerradius="4" 
                    style="float:left;margin-right:1em;height:5em;width:5em;"/>
                    <div style="display:inline;
                                vertical-align:top;">
                               <h3>
                                    @ViewData("Message")
                                </h3>
                                <div style="font-size:1em;">
                                    <p>At Perceptrics Research, we know that great experiences are the foundation of great research.</p>
                                    <p>This market research app helps you create research experiences like never before.</p>
                                    <p>Great research is what Perceptrics Research is all about.</p>
                                    <p>It's easy. It's designed to be.</p>
                                </div>
                    </div>

            </div>
            </div>
            </div>
        </div>
            <div  class="hisatoppage"
                  style="display:inline-block;
                         height:100%;min-height:200px;
                         vertical-align:top;font-size:1em;">
             <div id="hisatoppage1"  class="hisatopitem" 
                  data-bind="html: sdxnry[1].pgobj" 
                  data-pgUrl="x"
                  style="position:relative;">
             </div>
 
        </div>
            <div  class="hisatoppage" 
                  style="display:inline-block;
                         height:100%;min-height:200px;
                         vertical-align:top;font-size:1em;">
                <div id="hisatoppage2"  class="hisatopitem" 
                     data-bind="html: sdxnry[2].pgobj" 
                     data-pgUrl="x"
                     style="position:relative;">
             </div>
        </div>
        </div>
    </div>
    </div>
    <div id="prevnextbtnscontainer" class="prwnoselect"
         data-prwcornerradius="4" 
         style="position:relative;margin-left:1em;margin-right:1em;
                width:96%;height:2em;
                font-size: 1em;
                background:rgba(1,60,40,1);">
        <div id="hisatopprev"
             data-prwcornerradius="4" 
             style="position:absolute;top:1px;bottom:1px;left:1%;right:85%;color:rgb(255,255,255);
                    border:1px solid hsla(179,100%,5%,0.0);padding-left:0.5em;">Previous</div>
        <div id="hisatopnext"
             data-prwcornerradius="4" 
             style="position:absolute;top:1px;bottom:1px;right:1%;left:85%;color:rgb(255,255,255);text-align:right;
                    border:1px solid hsla(179,100%,5%,0.0);padding-right:0.5em;">Next</div>
    </div>
    </div>
    <div id="prwebmktcontainerbottom" class="prwnoselect"  
             style="display:block;
                    color:hsla(179,100%,5%,1);
                    width:95%;
                    margin:1.5em;margin-top:1.25em;
                    font-size:1em;">
<div id="prwebmktcontainerbottomleft"
     data-prwcornerradius="4"  
     style="display:inline-block;
            width:49%;min-width:200px;
            vertical-align:top;
            background:rgb(250, 252, 245);
            border:1px solid hsla(179,100%,5%,0.2);">
    <div 
         style="padding-left:2em;padding-right:1.5em;">
    <h3>Plain White. Really?</h3>
	<p>Package your research with the colors and images associated with your brand. You can brand every page and every question if you like.</p>
    <p>Reach your customers, wherever they are, on their own devices. Your survey is always available to your customers, at their convenience, on their preferred device.</p>
    </div>
	</div>
<div id="prwebmktcontainerbottomright"
     data-prwcornerradius="4"  
     style="display:inline-block;
            width:49%;min-width:200px;
            vertical-align:top;
            background:rgb(250, 252, 245);
            border:1px solid hsla(179,100%,5%,0.2);">
    <div data-prwcornerradius="4"  
         style="padding-left:2em;padding-right:1.5em;">
	<h3>Download Not.</h3>
	<p>When it's time to see your results, responses are available in real time and always accesible.</p>
    <p>Perceptrics displays your data in the same way you designed it.  There are no spreadsheets or pdfs to download.</p>
    <p>Segment your survey results instantly with Perceptrics Research. Whether you or your clients prefer touch or click, desktop or tablet, analyze whenever and however you want. </p>
    </div>
</div>
</div>
</div>
@*<div id="debugcontainer"
     data-prwcornerradius="4"  
     style="display:inline-block;
            width:49%;min-width:200px;
            vertical-align:top;
            color:hsla(179,100%,5%,1);
            font-size:70%;
            border:1px solid hsla(179,100%,5%,0.2);">
    <div id="debugscrollable">
        <div id="debugitemscontainer" data-bind='foreach: dxnry'>
            <div class="debugitem">
                <div class="debugitemcontent" 
                     data-bind="text: Msg"></div>
            </div>
        </div>
    </div>
</div>*@
</div>
       <script type="text/javascript">
           (function (prweb, $) {
               $('#homeindexcontainer').homeindex({ 
                logonurl: @(jlogonurl),
                mktresourceurl: @(jmarketingresourcesUrl),
                acctresourceurl: @(jaccountresourcesUrl), 
                logoffurl: @(jlogoffurl)});
           } (this.prweb, jQuery))
       </script>
    @*{ tinymceurl:@(jtinymceurl) }*@




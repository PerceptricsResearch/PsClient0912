<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge"/><!-- http://msdn.microsoft.com/en-us/library/ms533876(VS.85).aspx -->
    <meta http-equiv="content-type" content="application/xhtml+xml; charset=utf-8" />

    <meta charset="UTF-8"/>
    <meta name="viewport" 
            content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0"/>
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    <title>@ViewData("Title")</title>
    <link rel="shortcut icon" href="@Url.Content("~/Content/prlogo2.ico")" />
    <link href="@Url.Content("~/Content/prlogo7.png")" rel="apple-touch-icon-precomposed"  />
    <link href="@Url.Content("~/Content/Site.css")" rel="stylesheet" type="text/css" />
    <link href="@Url.Content("~/Content/rdentportal.css")" rel="stylesheet" type="text/css" />

    @*<script src="@Url.Content("~/Scripts/jquery-1.7.2.min.js")" type="text/javascript"></script>*@
    <script src="http://code.jquery.com/jquery-1.9.1.min.js")" type="text/javascript"></script>
    <script src="http://code.jquery.com/jquery-migrate-1.1.1.min.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/jquery-ui-1.8.24.custom.min.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/jquery.ba-bbq.min.js")" type="text/javascript"></script>

    <script src="@Url.Content("~/Scripts/prweb.base.js")" type="text/javascript"></script> 
    <script src="@Url.Content("~/Scripts/prweb.flex.js")" type="text/javascript"></script>
        <script type="text/javascript">
            // allowing the server to set the root URL for the site, 
            // which is used by the client code for server requests.
            $(function (prweb) {
                prweb.rootUrl = '@Url.Content("~")';
                prweb.flex.Initialize();
            } (this.prweb = this.prweb || {}));
    </script> 
@*    <script src="@Url.Content("~/Scripts/jquery.unobtrusive-ajax.min.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/prweb.rdentpagecontentview.js")" type="text/javascript"></script>*@
</head>
<body          style="position:absolute;top:0;bottom:0;left:0;right:0;
                height:100%;overflow:hidden;
                background:rgba(0,0,200,0.0)">
    <div data-prwtype="rdheadertoprow" 
         style="position:relative;top:0;bottom:0;left:0;right:0;
                height:5%;min-height:30px;
                overflow:hidden;
                background:rgba(0,0,200,0.0)">
         @*<img src="@Url.Content("~/Content/icon2.png")" alt=""  style="float:left;height:90%;width:40px;min-height:25px"/>*@
         <div id="rdheader" data-prwtype="rdheader" 
                style="height:100%;text-align:left;">
            @If Request.IsAuthenticated Then
                Dim myuser = ""
                If Not IsNothing(TempData("User")) Then
                    myuser = TempData("User")
                ElseIf Not IsNothing(ViewData("User")) Then
                    myuser = ViewData("User")
                End If
                
               @*@<h1 data-title style="display:inline;">Home, <span data-display-name> @myuser</span></h1>*@
            Else
               @<div style="margin-left:1em;font-size:1em;">Perceptrics Research Portal</div>
            End If
        </div>
        <div id="rdnotification" style="float:left;background:rgba(0,200,0,0.01)">Notification</div>
@*        <div  data-prwtype="rdnavbar" 
          data-prwcornerradius="4"
          data-prwlineargradientbrush="navbar"
          style="float:right">
         @If Not Request.IsAuthenticated Then
                
         Else
                    
         End If
        
        @Html.ActionLink("About", "About", "RDentPortal")
          
        </div>*@
    </div>
 


    <div data-prwtype="rdxcontent" 
        style="position:relative;top:0;bottom:0;left:0;right:0;padding:0px;
                height:90%;
                overflow:auto;
                background:rgba(1,78,1,0.0)"
         data-prwcornerradius="4">
         @RenderBody()
    </div>



    <div  data-prwtype="rdpagefooter" class="gradient" 
          style="height:5%;overflow:hidden;font-size:0.5em;text-align:center;"
          data-prwopacity=".9"
          data-prwlineargradientbrush="pagefooter">
        Respondent Portal
        Copyright 2011 Perceptrics Research LLC
        @Date.Now.ToLongTimeString
    </div>


  @If (Request.IsAuthenticated) Then   
    @RenderSection("scripts",false)
 End If


</body>
</html>

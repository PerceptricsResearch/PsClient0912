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
    <link href="@Url.Content("~/Content/guestportal.css")" rel="stylesheet" type="text/css" />
    <link href="@Url.Content("~/Content/redactor.css")" rel="stylesheet" type="text/css" />

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
<body    style="position:absolute;top:0;bottom:0;left:0;right:0;
                height:100%;overflow:hidden;
                background:rgba(254, 255, 252, 1);">
    <div id="guestheadertoprow" >
        <div id="guestheader">
        </div>
    </div>
 
    <div id="guestcontent" 
         style=""
         data-prwcornerradius="4">
         @RenderBody()
    </div>

    <div  data-prwtype="guestpagefooter" class="gradient" 
          style="height:5%;overflow:hidden;font-size:0.5em;text-align:center;">
        Guest Services Portal
        Copyright 2011 Perceptrics Research LLC
        @Date.Now.ToLongTimeString
    </div>


  @If (Request.IsAuthenticated) Then   
    @RenderSection("scripts",false)
 End If


</body>
</html>

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
    
    @If Request.IsAuthenticated Then

            
            @<link href="@Url.Content("~/Content/themes/base/jquery.ui.core.css")" rel="stylesheet" type="text/css" />
            @<link href="@Url.Content("~/Content/themes/base/jquery.ui.resizable.css")" rel="stylesheet" type="text/css" />
            @<link href="@Url.Content("~/Content/themes/base/jquery.ui.selectable.css")" rel="stylesheet" type="text/css" />
            @<link href="@Url.Content("~/Content/themes/base/jquery.ui.theme.css")" rel="stylesheet" type="text/css" />
            @<link href="@Url.Content("~/Content/themes/base/jquery.ui.dialog.css")" rel="stylesheet" type="text/css" />
        @<link href="@Url.Content("~/Content/redactor.css")" rel="stylesheet" type="text/css" />
        @<link href="@Url.Content("~/Content/SubscriberHome.css")" rel="stylesheet" type="text/css" />
    End If

    @*<script src="@Url.Content("~/Scripts/jquery-1.7.2.min.js")" type="text/javascript"></script>*@
    <script src="http://code.jquery.com/jquery-1.9.1.min.js" type="text/javascript"></script>
    <script src="http://code.jquery.com/jquery-migrate-1.1.1.min.js" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/jquery-ui-1.8.24.custom.min.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/jquery.ba-bbq.min.js")" type="text/javascript"></script>
    @If Request.IsAuthenticated Then
        @<script src="@Url.Content("~/Scripts/redactor.js")" type="text/javascript"></script>
       @* @<script src="@Url.Content("~/Scripts/redactor.min.js")" type="text/javascript"></script>*@
    End If

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
</head>
<body style="position:absolute;top:0;bottom:0;left:0;right:0;
                height:100%;overflow:hidden;">
@*    <div id="prweblayoutroot" data-prwtype="layoutroot" class="gradient stretch"
         data-prwlineargradientbrush="navbar" />*@
    <div id="subscribertoprow" >
        <div id="notification" class="prwnoselect"
             data-prwcornerradius="4"></div>
        <div id="header" data-prwtype="header" class="prwnoselect"
             data-url="@Url.RouteUrl("SubscriberMain")">
            @If Request.IsAuthenticated Then
                Dim myuser = ""
                If Not IsNothing(TempData("User")) Then
                    myuser = TempData("User")
                ElseIf Not IsNothing(ViewData("User")) Then
                    myuser = ViewData("User")
                End If
                
               @<h1 id="headertitle" data-title style="display:inline;">Home, <span data-display-name> @myuser</span></h1>
            Else
               
               @<h1 data-title style="display:inline;">Perceptrics Research Home </h1>
            End If
        </div>
    </div>


    <div id="prwebcontentroot" 
         data-prwcornerradius="4">
            @RenderBody()
    </div>

@*    <div  data-prwtype="navbar" class="gradient prwnoselect"
          data-prwcornerradius="4"
          data-prwlineargradientbrush="navbar">
      @If Not Request.IsAuthenticated Then
                        
                       
                        @Html.Partial("_LogOnPartial")  
         Else
              @Html.Partial("_LogOnPartial")      
         End If

          
    </div>*@

    <div  data-prwtype="pagefooter" class="prwnoselect"
          style="background:rgba(240, 242, 235, 1);">
          <div style="font-size:0.7em;">Privacy
        Copyright 2011 Perceptrics Research LLC, arrived:
        @Date.Now.ToLongTimeString</div></div>
    


 @If (Request.IsAuthenticated) Then
    @RenderSection("scripts",false)
 End If


</body>
</html>

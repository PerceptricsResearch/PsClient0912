<!DOCTYPE html>
<html class="no-Ajax">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css" />
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js"></script>
    <title>@ViewData("Title")</title>
</head>
<body>
    <div data-role="page" class="type-home" data-theme="b">
        
            <div id="title">
                <h1>Perceptrics Mobile</h1>
            </div>
            <div id="logindisplay">
                @Html.Partial("_LogOnPartial")
            </div>
@*            <div data-role="navbar" class="ui-navbar ui-navbar-noicons" role="navigation">
			   <ul class="ui-grid-b">
                    <li class="ui-block-a">@Html.ActionLink("Home", "Index", "Home")</li>
                    <li class="ui-block-a">@Html.ActionLink("About", "About", "Home")</li>
                    <li class="ui-block-a">@Html.ActionLink("Active", "Active", "Home")</li>
                </ul>
            </div>*@
       
        <div data-role="content" data-theme="b">
      @RenderBody()
    </div>
        <div data-role="footer" data-theme="b"></div>
    </div>

   <script type="text/javascript">
       $(document).bind("mobileinit", function () {

           $('div[data-role="dialog"]').live("pagecreate", function () {
               if ($(this).attr('data-theme') && $(this).hasClass('ui-body-a')) {
                   theme = $(this).attr('data-theme')
                   $(this).removeClass('ui-body-a').addClass('ui-body-' + theme)
               }
           })

           $(document).ready(function () {
               $(".no-Ajax").click(function (event) {
                   //uncoment to disable the menu's ajax calls
                   // $.mobile.ajaxEnabled = false;


               });
           });
       });
      
 
   </script>


   @RenderSection("scripts",false)
</body>
</html>

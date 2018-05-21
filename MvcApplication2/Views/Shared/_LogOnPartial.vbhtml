

@If Request.IsAuthenticated Then
  
     @Html.ActionLink("Log Off", "LogOff", "Account")  
Else
    @: @Html.ActionLink("Subscriber Login", "LogOn", "Account") 
End If



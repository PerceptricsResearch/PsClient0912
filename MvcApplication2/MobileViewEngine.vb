Imports MvcApplication2.HttpRequestBaseExtensions

Public Class MobileViewEngine
    Inherits RazorViewEngine

    Public Overrides Function FindView(controllerContext As System.Web.Mvc.ControllerContext, _
                                       viewName As String, masterName As String, useCache As Boolean) As System.Web.Mvc.ViewEngineResult
        Dim rslt As ViewEngineResult = Nothing
        Dim request = controllerContext.HttpContext.Request
        If request.IsSupportedMobileDevice AndAlso ApplicationHelper.HasMobileSpecificView Then
            Dim viewPathAndName = ApplicationHelper.MobileViewsDirectoryName & viewName
            rslt = MyBase.FindView(controllerContext, viewPathAndName, masterName, True)
            If IsNothing(rslt) Or IsNothing(rslt.View) Then
                rslt = MyBase.FindView(controllerContext, viewPathAndName, masterName, False)
            End If
        Else
            rslt = MyBase.FindView(controllerContext, viewName, masterName, useCache)
        End If
        Return rslt
    End Function
End Class

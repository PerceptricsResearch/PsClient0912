Public Class UploadableJsonResult
    Inherits JsonResult

    Public Overrides Sub ExecuteResult(context As ControllerContext)
        Dim jr = MyBase.Data
        context.HttpContext.Response.Write("<html><body><textarea id='uploadedjsonresult'  name='uploadedjsonresult'>")
        MyBase.ExecuteResult(context)
        context.HttpContext.Response.Write("</textarea></body></html>")
        context.HttpContext.Response.ContentType = "text/html"
    End Sub

End Class

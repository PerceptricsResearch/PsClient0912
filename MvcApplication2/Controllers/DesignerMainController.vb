Namespace MvcApplication2
    Public Class DesignerMainController
        Inherits System.Web.Mvc.Controller

        '
        ' GET: /DesignerMain

        Function Index() As ActionResult
            Return View()
        End Function



        '
        ' GET: /DesignerMain/Details/5

        'Function Details(ByVal id As Integer) As ActionResult
        '    Return View()
        'End Function

        ''
        '' GET: /DesignerMain/Create

        'Function Create() As ActionResult
        '    Return View()
        'End Function

        ''
        '' POST: /DesignerMain/Create

        '<HttpPost> _
        'Function Create(ByVal collection As FormCollection) As ActionResult
        '    Try
        '        ' TODO: Add insert logic here
        '        Return RedirectToAction("Index")
        '    Catch
        '        Return View()
        '    End Try
        'End Function

        ''
        '' GET: /DesignerMain/Edit/5

        'Function Edit(ByVal id As Integer) As ActionResult
        '    Return View()
        'End Function

        ''
        '' POST: /DesignerMain/Edit/5

        '<HttpPost> _
        'Function Edit(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
        '    Try
        '        ' TODO: Add update logic here

        '        Return RedirectToAction("Index")
        '    Catch
        '        Return View()
        '    End Try
        'End Function

        ''
        '' GET: /DesignerMain/Delete/5

        'Function Delete(ByVal id As Integer) As ActionResult
        '    Return View()
        'End Function

        ''
        '' POST: /DesignerMain/Delete/5

        '<HttpPost> _
        'Function Delete(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
        '    Try
        '        ' TODO: Add delete logic here

        '        Return RedirectToAction("Index")
        '    Catch
        '        Return View()
        '    End Try
        'End Function     
    End Class
End Namespace

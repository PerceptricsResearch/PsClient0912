Imports System.Security.Principal
Imports System.ServiceModel
Imports System.Collections.ObjectModel
Imports System.IO
Imports Excel
Imports System.Data
Imports System.Net

Namespace MvcApplication2
    Public Class MetricsPortalController
        Inherits System.Web.Mvc.Controller

        '
        ' GET: /MetricsPortal

        Function Index() As ActionResult
            Return View()
        End Function

        Function InsufficientPrivileges() As ActionResult
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            Return View()
        End Function

        <RequireHttps()> _
        Function MetricsLogon() As ActionResult
            Dim rsltview As ActionResult = View("InsufficientPrivileges")
            Try
                rsltview = Me.FakeAuthenticate()
            Catch ex As Exception
                Dim x = 2
            End Try
            Return rsltview
        End Function

        <Authorize()> _
        <RequireHttps()> _
        <Authorize()> _
        Function Platform() As ActionResult
            Dim rsltview As ActionResult = View("InsufficientPrivileges")
            Try
                ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
                ViewData("Title") = "Metrics Platform: " & ViewData("User")
                rsltview = View("MetricsPlatformView")
            Catch ex As Exception
                Dim x = 2
            End Try
            Return rsltview
        End Function

        <RequireHttps()> _
        Private Function FakeAuthenticate() As ActionResult
            Dim lom As New LogOnModel With {
                .UserName = "barney@metricsprototype.com", _
                .Password = "bubba"}
            Try
                TempData.Add("User", lom.UserName)
                TempData.Add("LoginResult", True)
                FormsAuthentication.SetAuthCookie(lom.UserName, False)
                Return Me.RedirectToAction("Platform", "MetricsPortal")
            Catch ex As Exception
                TempData("User") = lom.UserName
                TempData("LoginResult") = True
                FormsAuthentication.SetAuthCookie(lom.UserName, False)
                Return Me.RedirectToAction("Platform", "MetricsPortal")

            End Try
            Return View("InsufficientPrivileges")
        End Function

        <HttpPost()> _
        Function UploadDropboxExcelFile(excelFile As String()) As JsonResult
            Dim rslt As UploadableJsonResult = Nothing
            Dim myuri As Uri = Nothing
            Dim contextdoc As ComponentSeriesPackage = Nothing
            Try
                myuri = New Uri(excelFile.FirstOrDefault)
                If Not IsNothing(myuri) Then
                    Dim reader As IExcelDataReader = Nothing
                    Dim wrq As HttpWebRequest = HttpWebRequest.Create(myuri)
                    Dim resp As HttpWebResponse = wrq.GetResponse()
                    wrq = Nothing
                    Dim fstream As Stream = resp.GetResponseStream()
                    Using xms As New MemoryStream
                        fstream.CopyTo(xms)
                        fstream.Dispose()
                        fstream = Nothing
                        xms.Seek(0, SeekOrigin.Begin)
                        reader = ExcelReaderFactory.CreateOpenXmlReader(xms)
                        resp.Close()
                        resp = Nothing
                    End Using

                    If Not IsNothing(reader) Then
                        Dim workbook As DataSet
                        workbook = reader.AsDataSet()
                        Dim sheets = From sheet In workbook.Tables Select sheet.TableName
                        Dim worksheet = workbook.Tables.Item(0)
                        Dim rows = (From r In worksheet.Rows Select r.ItemArray).ToList
                        Dim morerows = rows.Select(Function(r As Object()) r.Where(Function(ri) Not IsDBNull(ri)).Select(Function(xri) xri)).ToList
                        Dim ms = New MetricsSupport
                        contextdoc = ms.MakeContextDocument(morerows)
                        rslt = New UploadableJsonResult With {.Data = New With {.ServerMessage = "Your excel file has been successfully loaded.",
                                                                                .Success = True,
                                                                                .ContextDoc = contextdoc}}
                    Else
                        rslt = New UploadableJsonResult With {.Data = New With {.ServerMessage = "Could not properly read the excel file...",
                                                                                .Success = False,
                                                                                .ContextDoc = contextdoc}}
                    End If
                Else
                    rslt = New UploadableJsonResult With {.Data = New With {.ServerMessage = "Did not receive an excel file...",
                                                            .Success = False,
                                                            .ContextDoc = contextdoc}}
                End If
                Catch ex As Exception
                rslt = New UploadableJsonResult With {.Data = New With {.ServerMessage = "Unable to use the file uploaded...",
                                                                        .Success = False,
                                                                        .ContextDoc = contextdoc}}
            End Try


            Return rslt
        End Function

        <HttpPost()> _
        Function UploadExcelFile(excelFile As HttpPostedFileWrapper) As JsonResult
            Dim rslt As UploadableJsonResult = Nothing
            Dim workbook As DataSet
            Dim contextdoc As ComponentSeriesPackage = Nothing
            Try
                If Not IsNothing(excelFile) Then

                    excelFile.InputStream.Seek(0, SeekOrigin.Begin)
                    Dim reader As IExcelDataReader = ExcelReaderFactory.CreateOpenXmlReader(excelFile.InputStream)
                    workbook = reader.AsDataSet()
                    reader.Dispose()
                    reader = Nothing
                    Dim sheets = From sheet In workbook.Tables Select sheet.TableName
                    Dim worksheet = workbook.Tables.Item(0)
                    Dim rows = (From r In worksheet.Rows Select r.ItemArray).ToList
                    Dim morerows = rows.Select(Function(r As Object()) r.Where(Function(ri) Not IsDBNull(ri)).Select(Function(xri) xri)).ToList
                    Dim ms = New MetricsSupport
                    contextdoc = ms.MakeContextDocument(morerows)
                    Dim hopethisworks = False
                    rslt = New UploadableJsonResult With {.Data = New With {.ServerMessage = "Your excel file has been successfully loaded.",
                                                                            .Success = True,
                                                                            .ContextDoc = contextdoc}}
                Else
                    rslt = New UploadableJsonResult With {.Data = New With {.ServerMessage = "Did not receive an excel file...",
                                                                            .Success = False,
                                                                            .ContextDoc = contextdoc}}
                End If
            Catch ex As Exception
                'gotta do somekind of error dialogue...
                Dim dbgxex = 2
                rslt = New UploadableJsonResult With {.Data = New With {.ServerMessage = "Unable to use the file uploaded...",
                                                                        .Success = False,
                                                                        .ContextDoc = contextdoc}}
            End Try
            Return rslt
        End Function




        <HttpGet()> _
        <Ajax(True)> _
        <ActionName("RealizationDashboardPartial")> _
        Public Function RealizationDashboardPartial_Ajax() As ActionResult
            ViewData("Title") = "Realization Dashboard"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            Return PartialView("RealizationDashboardPartial")
        End Function

        Public Function JsonRetrieveDefaultDataContext() As JsonResult
            Dim rslt As JsonResult = Nothing
            Try
                Dim ms = New MetricsSupport
                Dim testdata = ms.BuilTestSeries()
                rslt = Json(testdata)
            Catch ex As Exception
                Dim x = 2
            End Try

            Return rslt
        End Function


        Public Function GetFiles() As List(Of Object)
            Dim rslt As List(Of Object) = Nothing
            Try

                rslt = New List(Of Object)
                Dim dirinfo As New DirectoryInfo(Server.MapPath("~"))
                Dim dirinfox As New DirectoryInfo(Server.MapPath("/"))
                Dim dirinfoy As New DirectoryInfo(Server.MapPath("~/"))
                Dim dfiles = dirinfox.GetFiles().Union(dirinfoy.GetFiles)
                For Each item In dfiles
                    Dim dn As String = Nothing
                    Dim dfn As String = Nothing
                    Try
                        If Not IsNothing(item.DirectoryName) Then
                            dn = item.DirectoryName
                        End If
                        If Not IsNothing(item.FullName) Then
                            dfn = item.FullName
                        End If
                    Catch ex As Exception
                        Dim xdoink = 2
                    End Try

                    rslt.Add(New With {.x = dn, .y = dfn})
                Next
            Catch ex As Exception
                Dim doink = 2
            End Try
            Return rslt
        End Function


        Public Function JsonRetrieveAvailableContexts() As JsonResult
            Dim rslt As JsonResult = Nothing
            Try

                Dim ms = New MetricsSupport
                Dim testdata = ms.BuildTestContextInfoPackage()
                rslt = Json(testdata)
                'GetFiles()
            Catch ex As Exception
                Dim x = 2
            End Try

            Return rslt
        End Function

        Public Function JsonRetrieveDashboardColxn() As JsonResult
            Dim rslt As JsonResult = Nothing
            Try
                Dim ms = New MetricsSupport
                Dim testdata = ms.BuildTestDashboardPackage()
                Dim defltdatacontexturl = Url.Action("JsonRetrieveDefaultDataContext", "MetricsPortal")
                Dim availcontextsurl = Url.Action("JsonRetrieveAvailableContexts", "MetricsPortal")
                Dim viewurl = Url.Action("RealizationDashboardPartial", "MetricsPortal")
                With testdata.DashboardInfoColxn.First
                    .DefaultDataContextURL = defltdatacontexturl
                    .AvailableContextsURL = availcontextsurl
                    .ViewUrl = viewurl
                End With
                rslt = Json(testdata)
            Catch ex As Exception
                Dim x = 2
            End Try

            Return rslt
        End Function
        '
        ' GET: /MetricsPortal/Details/5

        Function Details(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' GET: /MetricsPortal/Create

        Function Create() As ActionResult
            Return View()
        End Function

        '
        ' POST: /MetricsPortal/Create

        <HttpPost()> _
        Function Create(ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add insert logic here
                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function

        '
        ' GET: /MetricsPortal/Edit/5

        Function Edit(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' POST: /MetricsPortal/Edit/5

        <HttpPost()> _
        Function Edit(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add update logic here

                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function

        '
        ' GET: /MetricsPortal/Delete/5

        Function Delete(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' POST: /MetricsPortal/Delete/5

        <HttpPost()> _
        Function Delete(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
            Try
                ' TODO: Add delete logic here

                Return RedirectToAction("Index")
            Catch
                Return View()
            End Try
        End Function
    End Class
End Namespace

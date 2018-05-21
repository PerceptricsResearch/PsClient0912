Imports System.Collections.ObjectModel

Namespace MvcApplication2
    Public Class SurveyController
        Inherits System.Web.Mvc.Controller

        '
        ' GET: /Survey
        'This returns a Colxn of SurveyIconViews....
        Function Index(id As String) As ActionResult

            If Not IsNothing(id) Then
                'Select Case id
                '    Case Is = "results"
                '        Return View(RetrieveSurveyIconModels) 'put a where.survey type is published open or closed...
                '    Case Else
                '        Return View(RetrieveSurveyIconModels)
                'End Select
            End If
            Return View()
        End Function
        ' Reutrns surveyIconModels...generated from Authoringsvc surveymetadatalist....this is surveys...not the stats about a survey...
        'Private Function RetrieveSurveyIconModels() As IEnumerable(Of SurveyIconModel)
        '    Dim rslt As IEnumerable(Of SurveyIconModel) = Nothing
        '    Dim model As ObservableCollection(Of AuthoringSvcNS.SurveyMetadataPackage) = Nothing
        '    Dim AuthoringSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
        '    Dim scp As New ServerClientProvider
        '    Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
        '    Try
        '        Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
        '        model = AuthSvc.Retrieve_SurveyMetaData_List(scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name))
        '        rslt = model.Select(Function(m) New SurveyIconModel With {.SurveyID = m.TinyRow.SurveyID, _
        '                                                                  .SurveyName = m.TinyRow.SurveyName, _
        '                                                                  .PrwType = "data-prwtype='surveyiconview'", _
        '                                                                  .URL = SurveyPagesUrl(m.TinyRow), _
        '                                                                  .ImageUrl = SurveyImageUrl(m.TinyRow)})
        '    Catch ex As Exception

        '    End Try
        '    scp = Nothing
        '    AuthoringSvc = Nothing
        '    model = Nothing
        '    Me.NormalEmail = Nothing
        '    Return rslt
        'End Function
        Private Function SurveyPagesUrl(_tinyrow As AuthoringSvcNS.Tiny_Survey_Row) As String
            Return "Survey/Details/" & _tinyrow.SurveyID.ToString & "/"
        End Function


        Private Function SurveyImageUrl(_tinyrow As AuthoringSvcNS.Tiny_Survey_Row) As String
            Return "http://192.168.1.107/ImageSvc/image/" & Me.NormalEmail() & "/" & _tinyrow.SurveyID.ToString & "/0"
        End Function

        Private Property NormalEmail() As String
            
        '
        ' GET: /Survey/Details/5

        Function Details(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' GET: /Survey/Create

        Function Create() As ActionResult
            Return View()
        End Function

        '
        ' POST: /Survey/Create

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
        ' GET: /Survey/Edit/5

        Function Edit(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' POST: /Survey/Edit/5

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
        ' GET: /Survey/Delete/5

        Function Delete(ByVal id As Integer) As ActionResult
            Return View()
        End Function

        '
        ' POST: /Survey/Delete/5

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

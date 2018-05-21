Imports System.Security.Principal
Imports System.ServiceModel
Imports System.Collections.ObjectModel
Imports System.IO
Imports MvcApplication2.AuthoringSvcNS

Public Class HomeController
    Inherits System.Web.Mvc.Controller
    Private MarketingEmail = "marketing@perceptricsresearch.com"
    <HttpGet()> _
    Function Index(id As String) As ActionResult
        Try
            Dim lom As New LogOnModel With {.UserName = MarketingEmail, _
                                            .Password = "bubba"}
            Me.LogOn(lom, "")
            Dim tlom As New LogOnModel With {.UserName = HomeController.TemplateIdentityName, _
                                            .Password = "bubba"}
            Me.LogOn(tlom, "")
        Catch ex As Exception
            Dim x = 2
        End Try

        If Request.IsAuthenticated Then
            Return Me.RedirectToRoute("SubscriberMain")
        Else
            ViewData("Message") = "Welcome to Perceptrics Research."
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            If Not IsNothing(id) Then
                ViewData("PartialKey") = id
                For Each ss In ToPrwUrl(id)
                    Dim ssx = Strings.Split(ss, "=")
                    ViewData(ssx(0).Replace("#", String.Empty)) = (ssx(1).Replace("_", "/"))
                Next

            End If

            Return View()
        End If

    End Function
    Private Function ToPrwUrl(_s As String) As IEnumerable(Of String)
        Return Strings.Split(_s, "#").Skip(1).AsEnumerable
    End Function
    Function About() As ActionResult
        ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
        'Dim scp As New ServerClientProvider
        'Dim AuthSvc = scp.AuthorSvcClientNew(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
        'Dim model = AuthSvc.Retrieve_SurveyMetaData_List(scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name))
        'scp = Nothing
        'AuthSvc = Nothing
        Return View()
    End Function
    Function InsufficientPrivileges() As ActionResult
        ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
        Return View()
    End Function

#Region "Logon For RDent Stuff"
    Private Property MyLogInInfo As LogInInfo

    Public Sub LogOn(ByVal model As LogOnModel, ByVal returnUrl As String)
        'If ModelState.IsValid Then
        Dim PwdINT As Integer = PwdHashIntFromPwdText(model.Password, model.UserName)
        Me.MyLogInInfo = New LogInInfo With {.EmailAddress = model.UserName, _
                                                .Password = PwdINT.ToString}
        Try
            'IsBusyService.SetIsBusy(True, "Verifying login credentials...")
            'Dim PwdINT As Integer = PwdHashIntFromPwdText(LogInInfoITem.Password, _loginInfo.EmailAddress)
            '_loginInfo.Password = PwdINT.ToString
            Dim loginsvclient = New LogInSvcNS.LogInSvcClient
            loginsvclient.ClientCredentials.UserName.UserName = Me.MyLogInInfo.EmailAddress
            loginsvclient.ClientCredentials.UserName.Password = Me.MyLogInInfo.Password

            Dim pswdColxn As New ObservableCollection(Of String)
            Dim _pswdtext = "0"
            Dim pkg As New LogInSvcNS.LogInPackage With {.LogIn_Email = Me.MyLogInInfo.EmailAddress, _
                                                         .PasswordHashINT = Me.MyLogInInfo.Password, _
                                                           .PasswordHash = pswdColxn}
            pswdColxn.Add(_pswdtext.GetHashCode.ToString)

            'AddHandler loginsvclient.LogMeInPleaseCompleted, AddressOf LogInSvc_LogMeInPlease_Completed

            'Dim loginresult =
            loginsvclient.LogMeInPleaseAsync(pkg) 'LogMeInPleaseAsync(pkg)
            'If Not IsNothing(loginresult) Then
            '    With loginresult
            '        If .LogIn_IsSuccess Then
            '            'FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe)

            '            TempData.Add("User", model.UserName)
            '            'Return Me.RedirectToAction("RDentSurveyView", New With {.survey = survey, .rdent = rdent})

            '        Else
            '            'ModelState.AddModelError("", "The user name or password provided is incorrect.")
            '        End If
            '    End With
            'Else
            '    'ModelState.AddModelError("", "The user name or password provided is incorrect.")
            'End If
        Catch ex As Security.MessageSecurityException

            'MessageBox.Show("LogInSvc_LogMeInPlease_Completed reports...SEC1" & ex.Message)
        Catch ex As System.Net.WebException
            ModelState.AddModelError("", "The user name or password provided is incorrect." & ex.Message)
            ' MessageBox.Show("LogInSvc_LogMeInPlease_Completed reports...WEB1" & ex.Message)
        Catch ex As CommunicationException
            ModelState.AddModelError("", "The user name or password provided is incorrect." & ex.Message)
            'Me.Close()
            ' MessageBox.Show("LogInSvc_LogMeInPlease_Completed reports...COMM1" & ex.Message) '& vbCrLf & ex.InnerException.Message)
        Catch ex As Exception
            ModelState.AddModelError("", "The user name or password provided is incorrect." & ex.Message)
            ' MessageBox.Show("LogInSvc_LogMeInPlease_Completed reports...1" & ex.Message)
        End Try

        'End If

        ' If we got this far, something failed, redisplay form
        'Return View(model)
    End Sub

    Public Shared Function PwdHashIntFromPwdText(ByVal _PwdText As String, ByVal _emailAddr As String) As Integer
        'Dim x = Integer.Parse(_PwdText)
        'Return Integer.Parse(_PwdText)
        Return PwdHasher.PWD_Pkg.SmartPwdPkg(_PwdText, False, _emailAddr).PwdHashINT
    End Function
#End Region

    'Function HomeIndexPartial(id As String) As PartialViewResult
    '    ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
    '    ViewData("PartialKey") = id
    '    'Dim scp As New ServerClientProvider
    '    'Dim AuthSvc = scp.AuthorSvcClientNew(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
    '    'Dim model = AuthSvc.Retrieve_SurveyMetaData_List(scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name))
    '    'scp = Nothing
    '    'AuthSvc = Nothing
    '    Return PartialView()
    'End Function

    'Public Function ExamplesIndex() As ActionResult
    '    Return View()
    'End Function
    'Public Function CaseStudies() As ActionResult
    '    Return View()
    'End Function

    Public Function JsonRetrieveMarketingResources() As JsonResult
        Return Json(New With {.homepage1 = Me.VwP("MktHomePage2Partial"),
                              .homepage2 = Me.VwP("MktHomePage3Partial"),
                              .examples = Me.VwP("ExamplesIndex"),
                              .about = Me.VwP("About"),
                              .pricing = Me.VwP("Pricing"),
                              .cases = Me.VwP("CaseStudies"),
                              .templatesUrl = Url.Action("JsonRetrieveTemplatesList", "Home")})
    End Function

    Public Function VwP(viewName As String) As String
        Dim rslt As String = ""
        Try
            Using sw As New StringWriter()
                Dim viewResult = ViewEngines.Engines.FindPartialView(Me.ControllerContext, viewName)
                Dim viewContext = New ViewContext(Me.ControllerContext, viewResult.View, Me.ViewData, Me.TempData, sw)
                viewResult.View.Render(viewContext, sw)
                rslt = sw.ToString()
                viewResult = Nothing
                viewContext = Nothing
            End Using
        Catch ex As Exception
            rslt = "<div>Could not retrieve marketing resources from Server...</div>"
        End Try

        Return rslt
    End Function


#Region "Templates Support"


    Public Function JsonRetrieveTemplatesList() As JsonResult
        Dim xlst = Me.RetrieveTemplatesList()
        Dim rslt = New With {.mylist = xlst, _
                             .baseURL = Url.Action("JsonRetrievePageZero", "Home", New With {.id = 0})}
        Return Json(rslt)
    End Function
    Public Function JsonRetrievePCM(id As Integer, pgNumber As Integer) As JsonResult
        Dim rslt As Object = False
        Try
            Dim pjobj = Me.RetrievePCMJsonObject(id, pgNumber)
            rslt = Json(pjobj)
        Catch ex As Exception
            Dim norslt = False
        End Try

        Return rslt
    End Function

    Public Function JsonRetrievePageZero(id As Integer) As JsonResult
        Dim rslt As JsonResult = Nothing
        Try
            Me.MySurveyID = id
            Dim pcm = Me.RetrievePCMJsonObject(id, 0)
            'for testing the pagenumber string in the db...pageitem.pagenumber ...checking sequence when ordered by the pagenumber string...
            'Dim smd = Me.RetrieveSurveyMetaData(id)
            'Dim xpcmidlist As List(Of Srlzd_KVP) = Nothing
            'If Not IsNothing(smd) Then
            '    Dim dummy As Integer
            '    xpcmidlist = smd.Where(Function(kvp) Integer.TryParse(kvp.Key, dummy)).ToList
            'End If
            If Not IsNothing(pcm) Then
                rslt = Json(New With {
                        .pgcount = pcm.PagesCount, _
                        .model = pcm, _
                        .nxtpgurl = Url.Action("JsonRetrievePCM", "Home", New With {.id = id, .pgNumber = 1}), _
                        .questoptset = Me.VwP("DesignerQuestOptSetPartial"),
                        .image = Me.VwP("DesignerImagePartial"),
                        .ignatz = Me.VwP("DesignerIgnatzPartial"),
                        .stylablepage = Me.VwP("DesignerStylablePagePartial")})
            End If
        Catch ex As Exception
            Dim dbgx = 2
        End Try
        Return rslt
    End Function


    Private Const TemplateIdentityName As String = "templates@perceptricsresearch.com"
    Private TemplateLogonModel As String = ""
    Private Property NormalEmail() As String
    Public Function RetrieveTemplatesList() As List(Of SurveyIconModel)
        Dim rslt As List(Of SurveyIconModel) = Nothing
        Using scp As New ServerClientProvider
            Me.NormalEmail = scp.Normalize(HomeController.TemplateIdentityName)
            Try
                Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                Dim model As ObservableCollection(Of AuthoringSvcNS.SurveyMetadataPackage) = Nothing
                If Not IsNothing(AuthSvc) Then
                    model = AuthSvc.Retrieve_SurveyMetaData_List(Me.NormalEmail)
                    If Not IsNothing(model) Then
                        rslt = model.Select(Function(m) New SurveyIconModel With {.SurveyID = m.TinyRow.SurveyID, _
                                                                                  .SurveyGuidString = Guid.NewGuid.ToString("N"), _
                                                                                  .SurveyName = m.TinyRow.SurveyName, _
                                                                                  .PBM = m.TinyRow.PrivilegeBitMask, _
                                                                                  .SurveyStateID = m.TinyRow.SurveyStateID, _
                                                                                  .SurveyType = m.TinyRow.SurveyType}).ToList
                    End If
                    'Else
                    '    FormsAuthentication.SignOut()
                End If
                AuthSvc = Nothing
            Catch ex As Exception
                Dim xdbg = 2
            End Try
        End Using
        Return rslt
    End Function

    Private Property MySurveyID As Integer
#Region "RetrievePCMJsonObject(_surveyID, _pageNumber)"
    Private Function RetrievePCMJsonObject(_surveyID As Integer, _pageNumber As Integer) As PCMJsonObject
        Dim srvrrslt As Page_Package = Nothing
        Dim pcmrslt As PCMJsonObject = Nothing
        'Dim AuthoringSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
        Using scp As New ServerClientProvider
            Me.NormalEmail = scp.Normalize(HomeController.TemplateIdentityName)
            Try
                Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                If Not IsNothing(AuthSvc) Then
                    srvrrslt = AuthSvc.Retrieve_Page(_surveyID, _pageNumber)
                    If Not IsNothing(srvrrslt) Then
                        pcmrslt = BuildPCMJsonObject(srvrrslt)
                        'pcmrslt.SurveyGuidString = "Survey" & _surveyID.ToString
                        'pcmrslt.NormalEmail = Me.NormalEmail.ToString
                        'pcmrslt.Guid.ToString("N")
                        srvrrslt = Nothing
                    End If
                Else
                    FormsAuthentication.SignOut()
                End If
                AuthSvc = Nothing
            Catch ex As Exception
                FormsAuthentication.SignOut()
            End Try
        End Using

        Return pcmrslt
    End Function

    Private Function BuildPCMJsonObject(ByRef _pgpkg As Page_Package) As PCMJsonObject
        Dim rslt As PCMJsonObject = Nothing
        Try
            rslt = System.Web.Helpers.Json.Decode(Of PCMJsonObject)(_pgpkg.PgContentModelPkg._PCM)
            With rslt
                .MyGuidStr = .PermanentGuidString
                .PagesCount = _pgpkg.SurveyPagesCount
                .pcmSdsID = _pgpkg.PgContentModelPkg._PCM_SDSID
                Dim pim = System.Web.Helpers.Json.Decode(Of PIMJsonObject)(_pgpkg.PgItemModelPkg._PIM)
                If Not IsNothing(pim) Then
                    .PageItemModel = pim
                    Dim tguid = Guid.Parse(.PageItemModel.MyGuidStr)
                    .PageItemModel.MyGuidStr = tguid.ToString("N")
                    .PageItemModel.SdsID = _pgpkg.PgItemModelPkg._PIM_SDSID
                    '.PageItemModel.PageNumber = rslt.PgNumber
                Else
                    .PageItemModel = New PIMJsonObject
                    .PageItemModel.SdsID = _pgpkg.PgItemModelPkg._PIM_SDSID
                    .PageItemModel.PageNumber = rslt.PgNumber
                    .PageItemModel.MyGuidStr = Guid.NewGuid.ToString("N")
                End If

                .PCElementsColxn = _pgpkg.PCElement_Pkg_Colxn.Select(Function(pcepkg) System.Web.Helpers.Json.Decode(Of PCElemJsonObject)(pcepkg._PCE)).ToList
                For Each pce In .PCElementsColxn
                    If IsNothing(pce.MyGuidStr) Then
                        Dim newg = Guid.NewGuid
                        Dim newgs = newg.ToString("N")
                        pce.MyGuid = newg
                        pce.MyGuidStr = newgs
                    Else
                        pce.MyGuid = Guid.Parse(pce.MyGuidStr)
                        pce.MyGuidStr = pce.MyGuid.ToString("N")
                    End If
                Next
            End With
        Catch ex As Exception
            Dim dbgx = 2
        End Try
        Return rslt
    End Function
#End Region
    <Ajax(True)> _
<ActionName("PageContentViewPartial")> _
    Function PageContentViewPartial_Ajax(id As Integer, pgNumber As Integer) As ActionResult
        ViewData("Title") = "Subscriber Home"
        ViewData("User") = HomeController.TemplateIdentityName
        ViewData("SurveyID") = id
        Me.MySurveyID = id
        ViewData("PCVData") = "ignatz"
        Return PartialView("PageContentViewPartial", Me.RetrievePageContentModel(id, pgNumber)) 'this guy needs a model i think...so that razor can do some rendering of the PCElems required for this page...
    End Function

#Region "RetrievePageContentModel(_surveyID, _pageNumber)"
    Private Function RetrievePageContentModel(_surveyID As Integer, _pageNumber As Integer) As PageContentModel
        Dim rslt As Page_Package = Nothing
        Dim pcmrslt As PageContentModel = Nothing
        'Dim AuthoringSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
        Using scp As New ServerClientProvider
            Me.NormalEmail = scp.Normalize(HomeController.TemplateIdentityName)
            Try
                Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                If Not IsNothing(AuthSvc) Then
                    rslt = AuthSvc.Retrieve_Page(_surveyID, _pageNumber)
                    'rslt needs to be deserialized into a PageContentModel....that's what needs to be returned to the view...
                    'otherwise it's just a big xmlstring....he's gonna try and deserialize to a namespace.type...just like in RDENTPortal...need to deal with deserializing types from different assemblies...
                    If Not IsNothing(rslt) Then
                        pcmrslt = BuildAPageContentModel(rslt)
                        pcmrslt.SurveyGuidString = "Survey" & _surveyID.ToString
                        pcmrslt.NormalEmail = Me.NormalEmail.ToString
                        'pcmrslt.Guid.ToString("N")
                        rslt = Nothing
                    End If
                Else
                    FormsAuthentication.SignOut()
                End If
                AuthSvc = Nothing
            Catch ex As Exception
                FormsAuthentication.SignOut()
            End Try
        End Using

        Return pcmrslt
    End Function



    Private Function BuildAPageContentModel(ByRef _pgpkg As Page_Package) As PageContentModel
        XMLConverter(Of PageItemModel).Initialize()
        XMLConverter(Of PageContentModel).Initialize()
        XMLConverter(Of PageContentElement).Initialize()
        Try
            Dim pgitem As PageItemModel = Nothing
            pgitem = XMLConverter(Of PageItemModel).QuickObject(_pgpkg.PgItemModelPkg._PIM)
            pgitem.SDS_ID = _pgpkg.PgItemModelPkg._PIM_SDSID
            pgitem.PageNumber = _pgpkg.PgItemModelPkg._PageNumber

            Dim pgCmodel = XMLConverter(Of PageContentModel).QuickObject(_pgpkg.PgContentModelPkg._PCM)
            pgCmodel.SDS_ID = _pgpkg.PgContentModelPkg._PCM_SDSID
            pgCmodel.PgNumber = pgitem.PageNumber
            pgCmodel.PagesCount = _pgpkg.SurveyPagesCount

            pgCmodel.PCElementsColxn.Clear()

            pgCmodel.PCElementsColxn.AddRange(From pce In _pgpkg.PCElement_Pkg_Colxn _
                                              Let npce = XMLConverter(Of PageContentElement).QuickObject(pce._PCE) _
                                              Select New PageContentElement With {.ViewModel = npce.ViewModel, _
                                                                                  .SDS_ID = pce._PCE_SDSID, _
                                                                                  .PCMID = pgCmodel.SDS_ID, _
                                                                                  .HasImage = pce._HasImage, _
                                                                                  .ImageURL = Me.PCElemImageUrl(Me.MySurveyID, pgCmodel.SDS_ID, pce._PCE_SDSID, pce._HasImage), _
                                                                                  .MyGuid = New Guid, _
                                                                                  .DIModel = npce.DIModel, _
                                                                                  .PresenterTypeName = npce.PresenterTypeName, _
                                                                                  .PresenterType = npce.PresenterType, _
                                                                                  .FromDesignerCanvas = npce.FromDesignerCanvas})


            '<<PAGECONTENTMODEL Stuff
            pgCmodel.Guid = Guid.NewGuid
            If pgCmodel.PermanentGuidString = Nothing Then
                pgCmodel.PermanentGuidString = pgCmodel.Guid.ToString()
            End If
            Return pgCmodel
        Catch ex As Exception
            Return Nothing
        End Try

    End Function

    Private Function PCElemImageUrl(_SurveyID As Integer, _PCMID As Integer, _PCElemID As Integer, _hasImage As Boolean) As String
        If _hasImage Then
            Return "http://perceptricsresearch.com/ImageSvc/imagepcelem/" & Me.NormalEmail & "/" & _SurveyID.ToString & "/" & _PCMID.ToString & "/" & _PCElemID.ToString

        Else
            Return Nothing
        End If


    End Function
#End Region
#End Region

End Class

Imports System.Security.Principal
Imports System.ServiceModel
Imports System.Collections.ObjectModel
Imports MvcApplication2.RespProviderSvcNS
Imports System.IO

Public Class RDentPortalController
    Inherits System.Web.Mvc.Controller

    Private IPPADDR As String = "0.0.0.0"

    Function Index(survey As String, rdent As String) As ActionResult
        Dim rsltview As ActionResult = View()
        Try
            Dim lom As New LogOnModel With {
                .UserName = rdent, _
                .Password = rdent}
            rsltview = Me.LogOn(lom, "", survey, rdent)
            ViewData("LogonStatus") = "Success."
        Catch ex As Exception
            ViewData("LogonStatus") = "Logon reports " + ex.Message
        End Try

            'If survey <> "0" AndAlso rdent <> "0" Then
            '    If survey = "23" AndAlso rdent = "bubba" Then
            '        rdent = "b26ed931f50446ebb8cf3058595e4f9725"
            '        survey = 25

            '        Dim lom As New LogOnModel With {.UserName = rdent, _
            '                                        .Password = rdent}
            '        rsltview = Me.LogOn(lom, "", survey, rdent)
            '    ElseIf survey = "22" AndAlso rdent = "bubba" Then
            '        rdent = "ca0465e170b64d0ca9dd012a37003d2022"
            '        Dim lom As New LogOnModel With {.UserName = rdent, _
            '                        .Password = rdent}
            '        rsltview = Me.LogOn(lom, "", survey, rdent)
            '    Else

            '    End If
            'End If
            Return rsltview
    End Function

    <Authorize()> _
    Function RDentPlatformView(survey As String, rdent As String) As ActionResult
        ViewData("Title") = "Your Survey"
        ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
        Dim id As Integer = survey
        ViewData("SurveyID") = id
        ViewData("DomainDxnry") = Me.CreateDomainDxry
        ViewData("LoginResult") = TempData("LoginResult")
        ViewData("RDentModel") = New ResponDENTModel With {
            .ResponseColxn = New ObservableCollection(Of RespProviderSvcNS.ResponseModel), _
            .ID = 1, _
            .SurveyID = id, _
            .CustomField = "", _
            .FirstName = "", _
            .LastName = "", _
            .LogInEmail = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name, _
            .IPAddress = Me.IPPADDR}
        Return View()
    End Function

    Function CreateDomainDxry() As Dictionary(Of String, DomainItem)
        Dim rslt As Dictionary(Of String, DomainItem) = Nothing
        Dim dl = New List(Of DomainItem)({New DomainItem With {.Name = "finish", .DROUrl = Url.Action("DROFinish")}, _
                                          New DomainItem With {.Name = "perceptrics", .DROUrl = Url.Action("DROPerceptrics")}, _
                                          New DomainItem With {.Name = "comment", .DROUrl = Url.Action("DROComment")}, _
                                          New DomainItem With {.Name = "authorinfo", .DROUrl = Url.Action("DROAuthorInfo")}, _
                                          New DomainItem With {.Name = "privacy", .DROUrl = Url.Action("DROPrivacy")}, _
                                          New DomainItem With {.Name = "quit", .DROUrl = Url.Action("DROQuit")}})
        rslt = dl.ToDictionary(Function(x) x.Name)
        Return rslt
    End Function

    <Authorize()> _
    Function RDentSurveyView(survey As String, rdent As String) As ActionResult
        ViewData("Title") = "Your Survey"
        ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
        Dim id As Integer = survey
        ViewData("SurveyID") = id

        ViewData("RDentModel") = New ResponDENTModel With {.ResponseColxn = New ObservableCollection(Of RespProviderSvcNS.ResponseModel), _
                                                           .ID = DateAndTime.Now.ToOADate.ToString, _
                                                           .SurveyID = id, _
                                                           .CustomField = Me.ControllerContext.RequestContext.HttpContext.Request.UserAgent, _
                                                           .FirstName = Me.ControllerContext.RequestContext.HttpContext.Request.UserHostName, _
                                                           .LastName = Me.ControllerContext.RequestContext.HttpContext.Request.Browser.Platform, _
                                                    .LogInEmail = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name, _
                                                    .IPAddress = Me.ControllerContext.RequestContext.HttpContext.Request.UserHostAddress}
        Return View(Me.RetrievePageContentModel(id, 0)) 'Me.RetrievePageContentModel(id, 0)
    End Function

    <Ajax(True)> _
    <ActionName("PageContentViewPartial")> _
    Function PageContentViewPartial_Ajax(id As Integer, pgNumber As Integer) As ActionResult
        ViewData("Title") = "Page Content View Partial"
        ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
        ViewData("SurveyID") = id
        Me.MySurveyID = id
        ViewData("PCVData") = "ignatz"
        Return PartialView("PageContentViewPartial", Me.RetrievePageContentModel(id, pgNumber)) 'this guy needs a model i think...so that razor can do some rendering of the PCElems required for this page...
    End Function


#Region "Logon For RDent Stuff"
    Private Property MyLogInInfo As LogInInfo

    Public Function LogOn(ByVal model As LogOnModel, ByVal returnUrl As String, survey As Integer, rdent As String) As ActionResult
        'If ModelState.IsValid Then
        Dim PwdINT As Integer = PwdHashIntFromPwdText(model.Password, model.UserName)
        Me.MyLogInInfo = New LogInInfo With {.EmailAddress = model.UserName, _
                                                .Password = PwdINT.ToString, _
                                                 .Level = UserLevel.RDent}
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

            Dim loginresult = loginsvclient.LogMeInPlease(pkg) 'LogMeInPleaseAsync(pkg)
            If Not IsNothing(loginresult) Then
                With loginresult
                    If .LogIn_IsSuccess Then
                        FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe)
                        TempData.Add("User", model.UserName)
                        TempData.Add("LoginResult", loginresult)
                        Return Me.RedirectToAction("RDentPlatformView", New With {.survey = survey, .rdent = rdent})
                    Else
                        ModelState.AddModelError("", "The user name or password provided is incorrect.")
                    End If
                End With
            Else
                ModelState.AddModelError("", "The user name or password provided is incorrect.")
            End If
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
        Return View(model)
    End Function

    Public Shared Function PwdHashIntFromPwdText(ByVal _PwdText As String, ByVal _emailAddr As String) As Integer
        'Dim x = Integer.Parse(_PwdText)
        'Return Integer.Parse(_PwdText)
        Return PwdHasher.PWD_Pkg.SmartPwdPkg(_PwdText, False, _emailAddr).PwdHashINT
    End Function
#End Region

    Function About(survey As String, rdent As String) As ActionResult
        If survey <> "0" AndAlso rdent <> "0" Then
            If survey = "23" AndAlso rdent = "bubba" Then
                'Return Me.RedirectToAction("RDentSurveyView", New With {.survey = survey, .rdent = rdent})
            End If
        End If
        Return View()
    End Function

#Region "Domain Resources Methods"
    Public Function DROFinish() As JsonResult
        Dim rslt As JsonResult = Nothing
        Dim drolist = New List(Of DROItem)({New DROItem With {.IsUrl = False, _
                                                              .ResourceItem = Me.VwP("RDentFinishViewPartial")}, _
                                            New DROItem With {.IsUrl = False, _
                                                              .ResourceItem = Me.VwP("RDentFinishViewPartial")}})
        Dim dro As New DomainResourceObject With {.Name = "finish", _
                                                  .ItemCount = drolist.Count, _
                                                  .DROItemList = drolist}
        rslt = Json(dro)
        Return rslt
    End Function
    Public Function DROPerceptrics() As JsonResult
        Dim rslt As JsonResult = Nothing
        Dim drolist = New List(Of DROItem)({New DROItem With {.IsUrl = False, _
                                                              .ResourceItem = Me.VwP("RDentFinishViewPartial")}, _
                                            New DROItem With {.IsUrl = False, _
                                                              .ResourceItem = Me.VwP("RDentFinishViewPartial")}})
        Dim dro As New DomainResourceObject With {.Name = "perceptrics", _
                                                  .ItemCount = drolist.Count, _
                                                  .DROItemList = drolist}
        rslt = Json(dro)
        Return rslt
    End Function
    Public Function DROComment() As JsonResult
        Dim rslt As JsonResult = Nothing
        Dim drolist = New List(Of DROItem)({New DROItem With {.IsUrl = False, _
                                                              .ResourceItem = Me.VwP("RDentCommentViewPartial")}})
        Dim dro As New DomainResourceObject With {.Name = "comment", _
                                                  .ItemCount = drolist.Count, _
                                                  .DROItemList = drolist}
        rslt = Json(dro)
        Return rslt
    End Function
    Public Function DROAuthorInfo() As JsonResult
        Dim rslt As JsonResult = Nothing
        Dim drolist = New List(Of DROItem)({New DROItem With {.IsUrl = False, _
                                                              .ResourceItem = Me.VwP("RDentFinishViewPartial")}, _
                                            New DROItem With {.IsUrl = False, _
                                                              .ResourceItem = Me.VwP("RDentFinishViewPartial")}})
        Dim dro As New DomainResourceObject With {.Name = "authorinfo", _
                                                  .ItemCount = drolist.Count, _
                                                  .DROItemList = drolist}
        rslt = Json(dro)
        Return rslt
    End Function
    Public Function DROPrivacy() As JsonResult
        Dim rslt As JsonResult = Nothing
        Dim drolist = New List(Of DROItem)({New DROItem With {.IsUrl = False, _
                                                              .ResourceItem = Me.VwP("RDentPrivacyViewPartial")}, _
                                            New DROItem With {.IsUrl = False, _
                                                              .ResourceItem = Me.VwP("RDentPrivacySuppViewPartial")}, _
                                            New DROItem With {.IsUrl = False, _
                                                              .ResourceItem = Me.VwP("RDentPrivacySupp2ViewPartial")}})
        Dim dro As New DomainResourceObject With {.Name = "privacy", _
                                                  .ItemCount = drolist.Count, _
                                                  .DROItemList = drolist}
        rslt = Json(dro)
        Return rslt
    End Function
    Public Function DROQuit() As JsonResult
        Dim rslt As JsonResult = Nothing
        Dim drolist = New List(Of DROItem)({New DROItem With {.IsUrl = False, _
                                                              .ResourceItem = Me.VwP("RDentFinishViewPartial")}, _
                                            New DROItem With {.IsUrl = False, _
                                                              .ResourceItem = Me.VwP("RDentFinishViewPartial")}})
        Dim dro As New DomainResourceObject With {.Name = "quit", _
                                                  .ItemCount = drolist.Count, _
                                                  .DROItemList = drolist}
        rslt = Json(dro)
        Return rslt
    End Function
#End Region

#Region "Json Ajax Methods"
    Public Function JsonRetrievePCM(id As Integer, pgNumber As Integer) As JsonResult
        Dim rslt As Object = False
        Try
            Dim pjobj = RetrievePCMJsonObject(id, pgNumber) 
            rslt = Json(pjobj)
        Catch ex As Exception
            Dim norslt = False
        End Try

        Return rslt
    End Function

    Public Function VwP(viewName) As String
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
            rslt = "<div>Could not retrieve designer resources from Server...</div>"
        End Try

        Return rslt
    End Function

    Public Function JsonRetrievePageZero(id As Integer) As JsonResult
        Dim rslt As JsonResult = Nothing
        Try
            Me.MySurveyID = id
            'Dim pcm = Me.RetrievePageContentModel(id, 0)
            'Me.ViewData.Model = pcm
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
                        .nxtpgurl = Url.Action("JsonRetrievePCM", "RDentPortal", New With {.id = id, .pgNumber = 1}), _
                        .questoptset = Me.VwP("RDentQuestOptSetPartial"),
                        .image = Me.VwP("DesignerImagePartial"),
                        .ignatz = Me.VwP("DesignerIgnatzPartial"),
                        .stylablepage = Me.VwP("DesignerStylablePagePartial")})
                Me.RetrievePageBlobCount(id) 'this server method keeps track of rdents starting survey...
            End If
        Catch ex As Exception
            Dim dbgx = 2
        End Try
        Return rslt

    End Function


    Public Function JsonSendResponsePkgToServer(id As Integer, responsePkg As ResponDENTModel) As JsonResult
        Dim rslt As JsonResult = Nothing
        Dim srvrrslt As Object = Nothing
        Using scp As New ServerClientProvider
            Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
            Try
                'Dim xxx = responsePkg.ResponseColxn.FirstOrDefault
                'xxx.

                Dim RespSvc = scp.ResponseSvcClientNew(Me.NormalEmail)
                If Not IsNothing(RespSvc) Then
                    RespSvc.StoreRespondentModelAsync(responsePkg)
                    srvrrslt = New With {.msg = "Thank you. "}
                Else
                    srvrrslt = New With {.msg = "Sorry, we could not reach the response servers."}
                End If
                RespSvc = Nothing
            Catch ex As Exception
                srvrrslt = New With {.msg = "Oops!.. " + ex.Message}
            End Try
        End Using

        rslt = Json(srvrrslt)
        Return rslt
    End Function

    Public Function JsonSendRDentHeartbeat() As JsonResult
        Dim MyIPADDR = Me.ControllerContext.RequestContext.HttpContext.Request.UserHostAddress
        Me.SendRDentHeartbeattoServer(Me.IPPADDR) '(MyIPADDR)
        Return Json(True)
    End Function



#End Region

#Region "RetrievePCMJsonObject(_surveyID, _pageNumber)"
    Private Function RetrievePCMJsonObject(_surveyID As Integer, _pageNumber As Integer) As PCMJsonObject
        Dim srvrrslt As Page_Package = Nothing
        Dim pcmrslt As PCMJsonObject = Nothing
        'Dim AuthoringSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
        Using scp As New ServerClientProvider
            Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
            Try
                Dim RespSvc = scp.ResponseSvcClientNew(Me.NormalEmail)
                If Not IsNothing(RespSvc) Then
                    srvrrslt = RespSvc.Retrieve_Page(_surveyID, _pageNumber)
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
                RespSvc = Nothing
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

#Region "RetrievePageContentModel(_surveyID, _pageNumber)"
    Private Function RetrievePageContentModel(_surveyID As Integer, _pageNumber As Integer) As PageContentModel
        Dim rslt As Page_Package = Nothing
        Dim pcmrslt As PageContentModel = Nothing
        'Dim AuthoringSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
        Using scp As New ServerClientProvider
            Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
            Me.MySurveyID = _surveyID
            Try
                Dim RespSvc = scp.ResponseSvcClientNew(Me.NormalEmail)
                If Not IsNothing(RespSvc) Then
                    rslt = RespSvc.Retrieve_Page(_surveyID, _pageNumber)
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
                RespSvc = Nothing
            Catch ex As Exception
                FormsAuthentication.SignOut()
            End Try
        End Using

        Return pcmrslt
    End Function
    Private Function PCElemImageUrl(_SurveyID As Integer, _PCMID As Integer, _PCElemID As Integer, _hasImage As Boolean) As String
        If _hasImage Then
            Return "http://192.168.1.102/ImageSvc/imagepcelem/" & Me.NormalEmail & "/" & _SurveyID.ToString & "/" & _PCMID.ToString & "/" & _PCElemID.ToString
            'If Not IsNothing(Me.PCElemsWithImagesColxn) Then
            '    Dim hasImage As Integer = Nothing
            '    If Me.PCElemsWithImagesColxn.TryGetValue(_PCElemID, hasImage) Then
            '        Return "http://192.168.1.102/ImageSvc/imagepcelem/" & Me.NormalEmail & "/" & _SurveyID.ToString & "/" & _PCMID.ToString & "/" & _PCElemID.ToString
            '    Else
            '        Return Nothing
            '    End If
            'Else
            '    Return Nothing
            'End If
        Else
            Return Nothing
        End If


    End Function

    Private Property NormalEmail() As String

    Private Property MySurveyID As Integer

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
#End Region

    ''
    '' GET: /RDentPortal/Details/5

    'Function Details(ByVal id As Integer) As ActionResult
    '    Return View()
    'End Function

    ''
    '' GET: /RDentPortal/Create

    'Function Create() As ActionResult
    '    Return View()
    'End Function

    ''
    '' POST: /RDentPortal/Create

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
    '' GET: /RDentPortal/Edit/5

    'Function Edit(ByVal id As Integer) As ActionResult
    '    Return View()
    'End Function

    ''
    '' POST: /RDentPortal/Edit/5

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
    '' GET: /RDentPortal/Delete/5

    'Function Delete(ByVal id As Integer) As ActionResult
    '    Return View()
    'End Function

    ''
    '' POST: /RDentPortal/Delete/5

    '<HttpPost> _
    'Function Delete(ByVal id As Integer, ByVal collection As FormCollection) As ActionResult
    '    Try
    '        ' TODO: Add delete logic here

    '        Return RedirectToAction("Index")
    '    Catch
    '        Return View()
    '    End Try
    'End Function     

    Private Sub RetrievePageBlobCount(sdsid As Integer) 'this server method keeps track of rdents starting survey...
        Using scp As New ServerClientProvider
            Try
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                Dim RespSvc = scp.ResponseSvcClientNew(Me.NormalEmail)
                If Not IsNothing(RespSvc) Then
                    RespSvc.Retrieve_PageBlob_CountAsync(sdsid)
                Else
                    Dim xx = 2
                End If
                RespSvc = Nothing
            Catch ex As Exception
                Dim xxx = 2
            End Try
        End Using
    End Sub

    Private Sub SendRDentHeartbeattoServer(MyIPADDR As String) 'is fireandforget....
        Using scp As New ServerClientProvider
            Try
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                Dim RespSvc = scp.ResponseSvcClientNew(Me.NormalEmail)
                If Not IsNothing(RespSvc) Then
                    RespSvc.SetCacheAsync(MyIPADDR)
                Else
                    FormsAuthentication.SignOut()
                End If
                RespSvc = Nothing
            Catch ex As Exception
                FormsAuthentication.SignOut()
            End Try
        End Using
    End Sub

End Class


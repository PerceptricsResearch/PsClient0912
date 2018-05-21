Imports System.Security.Principal
Imports System.ServiceModel
Imports System.Collections.ObjectModel
Imports System.IO
Imports MvcApplication2.AuthoringSvcNS
Imports MvcApplication2.ResultsSvcNS


Namespace MvcApplication2
    Public Class GuestPortalController
        Inherits System.Web.Mvc.Controller

        '
        ' GET: /GuestPortal

        Function Index(id As String, guest As String, svc As String) As ActionResult
            Dim rsltview As ActionResult = View()
            Try
                'guest = "76e56afb938940b390bdd72a9bbc8248" '"wbartel@interserv.com" 49/76e56afb938940b390bdd72a9bbc8248/Results
                Dim pwd = guest '"76e56afb938940b390bdd72a9bbc8248" '"bubba"
                Dim lom As New LogOnModel With {
                    .UserName = guest, _
                    .Password = pwd}
                rsltview = Me.LogOn(lom, "", Integer.Parse(id), guest, svc)
                ViewData("LogonStatus") = "Success."
            Catch ex As Exception
                ViewData("LogonStatus") = "Logon reports " + ex.Message
            End Try
            Return rsltview
        End Function

        Function InsufficientPrivileges() As ActionResult
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            Return View()
        End Function

        <Authorize()> _
        Function GuestPlatformResultsView(survey As String, rdent As String, svc As String) As ActionResult

            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            'Dim id As Integer = survey
            ViewData("Service") = svc
            ViewData("SurveyID") = Integer.Parse(survey)
            ViewData("DomainDxnry") = Me.CreateDomainDxry
            ViewData("BaseUrlColxn") = Me.MakeResultsBaseUrlColxn
            ViewData("SurveyIconModel") = Me.RetrieveSurveyIconModel(Integer.Parse(survey))
            ViewData("Title") = "Results: " & ViewData("SurveyIconModel").SurveyName
            ViewData("LoginResult") = TempData("LoginResult")
            ViewData("SubscriberEmail") = rdent '"wbartel@interserv.com" 'this requires a change to server methods...logmeon please spifflist, kvp.key subscrloginemain
            Return View()
        End Function
        <Authorize()> _
        Function GuestPlatformReviewerView(survey As String, rdent As String, svc As String) As ActionResult

            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            'Dim id As Integer = survey
            ViewData("Service") = svc
            ViewData("SurveyID") = Integer.Parse(survey)
            ViewData("DomainDxnry") = Me.CreateDomainDxry
            ViewData("BaseUrlColxn") = Me.MakeReviewerBaseUrlColxn
            ViewData("SurveyIconModel") = Me.RetrieveSurveyIconModel(Integer.Parse(survey))
            ViewData("Title") = "Review: " & ViewData("SurveyIconModel").SurveyName
            ViewData("LoginResult") = TempData("LoginResult")
            ViewData("SubscriberEmail") = rdent '"wbartel@interserv.com" 'this requires a change to server methods...logmeon please spifflist, kvp.key subscrloginemain
            Return View()
        End Function

        <HttpGet()> _
        <Ajax(True)> _
        <ActionName("SurveyMetaDataViewPartial")> _
        Function SurveyMetaDataViewPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Guest Portal Results"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Return PartialView("SurveyMetaDataViewPartial") 'View()
        End Function

        <Ajax(True)> _
        <ActionName("GroupsSlideoutViewPartial")> _
        Function GroupsSlideoutViewPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Guest Portal Results"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Return PartialView("GroupsSlideoutViewPartial") 'View()
        End Function

        <Ajax(True)> _
<ActionName("ResultsGroupListPartial")> _
        Function ResultsGroupListPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Guest Portal Results"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Return PartialView("ResultsGroupListPartial") 'View()
        End Function

#Region "Domain Resources Methods"
        Function CreateDomainDxry() As Dictionary(Of String, DomainItem)
            Dim rslt As Dictionary(Of String, DomainItem) = Nothing
            Dim dl = New List(Of DomainItem)({New DomainItem With {.Name = "perceptrics", .DROUrl = Url.Action("DROPerceptrics")}, _
                                              New DomainItem With {.Name = "comment", .DROUrl = Url.Action("DROComment")}, _
                                              New DomainItem With {.Name = "authorinfo", .DROUrl = Url.Action("DROAuthorInfo")}, _
                                              New DomainItem With {.Name = "privacy", .DROUrl = Url.Action("DROPrivacy")}, _
                                              New DomainItem With {.Name = "help", .DROUrl = Url.Action("DROHelp")}})
            rslt = dl.ToDictionary(Function(x) x.Name)
            Return rslt
        End Function

        Public Function DROPerceptrics() As JsonResult
            Dim rslt As JsonResult = Nothing
            Dim drolist = New List(Of DROItem)({New DROItem With {.IsUrl = False, _
                                                                  .ResourceItem = Me.VwP("DROPerceptrics1ViewPartial")}, _
                                                New DROItem With {.IsUrl = False, _
                                                                  .ResourceItem = Me.VwP("DROPerceptrics2ViewPartial")}, _
                                                New DROItem With {.IsUrl = False, _
                                                                  .ResourceItem = Me.VwP("DROPerceptrics3ViewPartial")}, _
                                                New DROItem With {.IsUrl = False, _
                                                                  .ResourceItem = Me.VwP("DROPerceptrics4ViewPartial")}})
            Dim dro As New DomainResourceObject With {.Name = "perceptrics", _
                                                      .ItemCount = drolist.Count, _
                                                      .DROItemList = drolist}
            rslt = Json(dro)
            Return rslt
        End Function
        Public Function DROComment() As JsonResult
            Dim rslt As JsonResult = Nothing
            Dim drolist = New List(Of DROItem)({New DROItem With {.IsUrl = False, _
                                                                  .ResourceItem = Me.VwP("DROCommentViewPartial")}})
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
        Public Function DROHelp() As JsonResult
            Dim rslt As JsonResult = Nothing
            Dim drolist = New List(Of DROItem)({New DROItem With {.IsUrl = False, _
                                                                  .ResourceItem = Me.VwP("DROHelp1ViewPartial")}, _
                                                New DROItem With {.IsUrl = False, _
                                                                  .ResourceItem = Me.VwP("DROHelp2ViewPartial")}})
            Dim dro As New DomainResourceObject With {.Name = "quit", _
                                                      .ItemCount = drolist.Count, _
                                                      .DROItemList = drolist}
            rslt = Json(dro)
            Return rslt
        End Function
#End Region

        Public Function JsonRetrieveResults(id As String) As JsonResult
            Return Json(Me.RetrieveResults(Integer.Parse(id)))
        End Function

        Public Function JsonRetrievePageZero(id As String) As JsonResult
            Dim rslt As JsonResult = Nothing
            Try
                Me.MySurveyID = Integer.Parse(id)
                Dim pcm = Me.RetrievePCMJsonObject(Integer.Parse(id), 0)
                If Not IsNothing(pcm) Then
                    rslt = Json(New With {
                            .pgcount = pcm.PagesCount, _
                            .model = pcm, _
                            .nxtpgurl = Url.Action("JsonRetrievePCM", "SubscriberMain", New With {.id = Integer.Parse(id), .pgNumber = 1}), _
                            .questoptset = Me.VwP("ActiveQuestOptSetPartial"),
                            .image = Me.VwP("DesignerImagePartial"),
                            .ignatz = Me.VwP("DesignerIgnatzPartial"),
                            .stylablepage = Me.VwP("DesignerStylablePagePartial")})
                End If
            Catch ex As Exception
                Dim dbgx = 2
            End Try
            Return rslt

        End Function

#Region "RetrievePCMJsonObject(_surveyID, _pageNumber)"
        Private Function RetrievePCMJsonObject(_surveyID As Integer, _pageNumber As Integer) As PCMJsonObject
            Dim srvrrslt As Page_Package = Nothing
            Dim pcmrslt As PCMJsonObject = Nothing
            'Dim AuthoringSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
            Using scp As New ServerClientProvider
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
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

#Region "Results Support Methods"
#Region "RetrieveResults"
        Private Function RetrieveResults(_surveyID As Integer) As ResultsDxnryObject 'ResultsProviderSummaryObject 'ObservableCollection(Of ResultsProviderSummaryObject)
            Dim rslt As ResultsProviderSummaryObject = Nothing 'ObservableCollection(Of ResultsProviderSummaryObject) = Nothing
            Dim rdorslt As ResultsDxnryObject = Nothing
            Using scp As New ServerClientProvider
                Try
                    Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                    Dim RsltSvc = scp.ResultsSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(RsltSvc) Then
                        rslt = RsltSvc.RetrieveResults(_surveyID).FirstOrDefault
                        If Not IsNothing(rslt) Then
                            rdorslt = New ResultsDxnryObject
                            With rdorslt
                                .RPSO = rslt
                                .RsltsDetailsDxnry = rslt.ResultsDetailsList.GroupBy(Function(rd) rd.QuestID.ToString).ToDictionary(Function(grp) grp.Key, Function(gl) gl.ToList)
                                .RPSO.ResultsDetailsList = Nothing
                            End With
                        Else
                            rdorslt = New ResultsDxnryObject With {.RPSO = New ResultsProviderSummaryObject, _
                                                           .RsltsDetailsDxnry = New Dictionary(Of String, List(Of SmallRsltDetail))}
                        End If
                    Else
                        FormsAuthentication.SignOut()
                    End If

                Catch ex As Exception
                    Dim x = 2
                    rdorslt = New ResultsDxnryObject With {.RPSO = New ResultsProviderSummaryObject, _
                                                           .RsltsDetailsDxnry = New Dictionary(Of String, List(Of SmallRsltDetail))}
                End Try

            End Using
            Return rdorslt 'rslt
        End Function
#End Region

#Region "RetrieveSDSResponseModels"
        Private Function RetrieveSDSResponseModels(_surveyID As Integer) As ObservableCollection(Of SDSResponseModelObject)
            Dim rslt As ObservableCollection(Of SDSResponseModelObject) = Nothing
            Using scp As New ServerClientProvider
                Try
                    Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                    Dim RsltSvc = scp.ResultsSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(RsltSvc) Then
                        rslt = RsltSvc.Retrieve_SDSResponseModels(_surveyID)
                        RsltSvc = Nothing
                    Else
                        FormsAuthentication.SignOut()
                    End If

                Catch ex As Exception
                    Dim x = 2
                End Try

            End Using
            Return rslt
        End Function
#End Region

#Region "RetrieveResultsFilterModels"
        Private Function RetrieveResultsFilterModels(_surveyID As Integer) As ObservableCollection(Of ResultsFilterModel)
            Dim rslt As ObservableCollection(Of ResultsFilterModel) = Nothing
            Using scp As New ServerClientProvider
                Try
                    Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                    Dim RsltSvc = scp.ResultsSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(RsltSvc) Then
                        XMLConverter(Of ResultsFilterModel).Initialize()
                        rslt = New ObservableCollection(Of ResultsFilterModel)
                        'this is a default ResultsFilterModel....for allRdents...hence, its GroupResultsURL is the URL to RetrieveResults...the basic results retrieval
                        Dim allrdentsrfm = New ResultsFilterModel With {.ID = 0, _
                                                                        .Name = "All Respondents", _
                                                                        .IsEditable = False, _
                                                                        .GroupResultsURL = Url.Action("JsonRetrieveResults", "SubscriberMain", New With {.ID = _surveyID})}
                        rslt.Add(allrdentsrfm)
                        Dim rfmobjs = RsltSvc.Retrieve_ResultsFilters(_surveyID)
                        If Not IsNothing(rfmobjs) Then

                            For Each item In rfmobjs
                                Dim rfm = XMLConverter(Of ResultsFilterModel).QuickObject(item.Model)
                                rfm.ID = item.ID
                                rfm.GroupResultsURL = Url.Action("JsonRetrieveResultsWithFilterGroup", "SubscriberMain", New With {.id = _surveyID, .rfmid = rfm.ID})
                                rfm.GroupDefnViewURL = Url.Action("ResultsGroupDefnPartial", "SubscriberMain", New With {.id = _surveyID, .rfmid = rfm.ID})
                                'Dim trsl = rfm.RFEM_List.GroupBy(Function(rfe) rfe.GroupID).ToList '.Select(Function(gr) New RDentSet With {.SetID = gr.Key, .}).ToList
                                'rfm.RDentSetsList = New List(Of RDentSet)
                                'For Each gr In trsl
                                '    Dim rs As New RDentSet With {.SetID = gr.Key, .RFElemList = gr.AsEnumerable.ToList}
                                '    rfm.RDentSetsList.Add(rs)
                                'Next
                                rfm.RDentSetsList = rfm.RFEM_List.GroupBy(Function(rfe) rfe.GroupID).Select(Function(gr) New RDentSet With {.SetID = gr.Key, .RFElemList = gr.AsEnumerable.ToList}).ToList
                                rslt.Add(rfm)
                            Next
                        End If


                        RsltSvc = Nothing
                    Else
                        FormsAuthentication.SignOut()
                    End If

                Catch ex As Exception
                    Dim x = 2
                End Try

            End Using
            Return rslt
        End Function
#End Region
#Region "RetrieveFilterResultswithListofRFGO"
        Private Function RetrieveResultsWithFilterGroup(_surveyID As Integer, _listofRFGO As ObservableCollection(Of ResultsFilterGroupObject)) As ResultsDxnryObject 'ResultsProviderSummaryObject
            Dim rslt As ResultsProviderSummaryObject = Nothing
            Dim rdorslt As ResultsDxnryObject = Nothing
            Using scp As New ServerClientProvider
                Try
                    Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                    Dim RsltSvc = scp.ResultsSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(RsltSvc) Then
                        rslt = RsltSvc.RetrieveFilteredResults_with_ListofResultFilterGroupObject(_surveyID, _listofRFGO).FirstOrDefault
                        rdorslt = New ResultsDxnryObject
                        With rdorslt
                            .RPSO = rslt
                            .RsltsDetailsDxnry = rslt.ResultsDetailsList.GroupBy(Function(rd) rd.QuestID.ToString).ToDictionary(Function(grp) grp.Key, Function(gl) gl.ToList)
                            .RPSO.ResultsDetailsList = Nothing
                        End With
                        RsltSvc = Nothing
                    Else
                        FormsAuthentication.SignOut()
                    End If

                Catch ex As Exception
                    Dim x = 2
                End Try

            End Using
            Return rdorslt 'rslt
        End Function
#End Region

#Region "SaveResultsFilterModel"
        Private Function SaveResultsFilterModel(_surveyID As Integer, _RFM As ResultsFilterModel) As ResultsSvcNS.POCO_ID_Pkg
            Dim rslt As ResultsSvcNS.POCO_ID_Pkg = Nothing
            Using scp As New ServerClientProvider
                Try
                    Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                    Dim RsltSvc = scp.ResultsSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(RsltSvc) Then
                        Dim MyModel As ResultsFilterModel = _RFM
                        If MyModel.ID = 0 Then
                            'this is a new RFM created on the client...give it a new guid, and store that new guid on the client using the pocoidpkg...
                            MyModel.Guid = Guid.NewGuid
                        End If
                        Dim srlzdRFMList As New ObservableCollection(Of ResultsFilterModelObject)
                        Dim rfmodel = XMLConverter(Of ResultsFilterModel).ToXmlString(MyModel)
                        srlzdRFMList.Add(New ResultsFilterModelObject With {.ID = MyModel.ID, _
                                                                            .Guid = MyModel.Guid, _
                                                                            .Model = rfmodel, _
                                                                            .SurveyID = MyModel.SurveyID})
                        rslt = RsltSvc.Save_ResultsFilters(_surveyID, srlzdRFMList).FirstOrDefault
                        'for testing...
                        'rslt = New ResultsSvcNS.POCO_ID_Pkg With {._POCOGuid = MyModel.Guid, _
                        '                                          ._DB_ID = 291, _
                        '                                          ._Survey_ID = MyModel.SurveyID, _
                        '                                          ._Original_ID = MyModel.ID}
                        RsltSvc = Nothing
                    Else
                        FormsAuthentication.SignOut()
                    End If

                Catch ex As Exception
                    Dim x = 2
                End Try

            End Using
            Return rslt
        End Function
#End Region
#End Region

        Public Function JsonRetrieveSurveyMetaData(id As Integer) As JsonResult
            Return Json(Me.RetrieveSurveyMetaData(id))
        End Function
#Region "RetrieveSurveMetaData(_surveyID)"
        Private Function RetrieveSurveyMetaData(_surveyID As Integer) As IEnumerable(Of AuthoringSvcNS.Srlzd_KVP)
            Dim rslt As IEnumerable(Of Srlzd_KVP) = Nothing
            Dim model As SurveyMetadataPackage = Nothing
            'Dim AuthoringSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
            Using scp As New ServerClientProvider
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                Try
                    Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(AuthSvc) Then
                        model = AuthSvc.Retrieve_SurveyMetaData(_surveyID)
                        rslt = model.MetaDataColxn.Select(Function(mi) New Srlzd_KVP With {.Key = mi.Key, .Valu = mi.Valu}).ToList
                        AuthSvc = Nothing
                        If Not IsNothing(model) Then
                            model.Model = Nothing
                            model.TinyRow = Nothing
                            model.MetaDataColxn.Clear()
                            model.MetaDataColxn = Nothing
                            model = Nothing
                        End If
                    Else
                        FormsAuthentication.SignOut()
                    End If
                Catch ex As Exception
                    FormsAuthentication.SignOut()
                End Try
            End Using
            GC.GetTotalMemory(True)
            'Me.NormalEmail = Nothing
            Return rslt
        End Function
#End Region



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

        'this needs authorize and httppost decorators...
        Public Function JsonRetrieveSurveyIconModelList(svc As String) As JsonResult
            Dim rslt As JsonResult = Nothing
            Try
                Dim baseUrlColxn As BaseURLObject = Nothing
                If svc = "Results" Then
                    baseUrlColxn = Me.MakeResultsBaseUrlColxn()
                ElseIf svc = "Review" Then
                    baseUrlColxn = Me.MakeReviewerBaseUrlColxn()
                End If

                Dim simdlColxn As List(Of SurveyIconModel) = Me.RetrieveSurveyIconModels
                rslt = Json(New With {.baseurlcolxn = baseUrlColxn, _
                                      .simcolxn = simdlColxn})
            Catch ex As Exception
                Dim dbgx = 2
            End Try

            Return rslt 'Json(Me.RetrieveSurveyIconModels)
        End Function
        Private Function MakeResultsBaseUrlColxn() As BaseURLObject
            Dim rslt As BaseURLObject = Nothing
            Try
                rslt = New BaseURLObject With {
                                .URL = Url.Action("ResultsSurveyViewPartial", "GuestPortal", New With {.id = 0}), _
                                .PageZeroURL = Url.Action("JsonRetrievePageZero", "GuestPortal", New With {.id = 0}), _
                                .ImageUrl = "http://perceptricsresearch.com/ImageSvc/image/", _
                                .ResultsGrpListViewURL = Url.Action("ResultsGroupListPartial", "GuestPortal", New With {.id = 0}), _
                                .ResultsGrpDefnViewURL = Url.Action("ResultsGroupDefnPartial", "GuestPortal", New With {.id = 0}), _
                                .ResultsModelURL = Url.Action("JsonRetrieveResults", "GuestPortal", New With {.id = 0}), _
                                .PCModelURL = Url.Action("JsonRetrievePCM", "GuestPortal", New With {.id = 0, .pgNumber = 0}), _
                                .MetaDataURL = Url.Action("JsonRetrieveSurveyMetaData", "GuestPortal", New With {.id = 0})}
            Catch ex As Exception
                Dim dbgx = 2
            End Try
            Return rslt
        End Function
        Private Function MakeReviewerBaseUrlColxn() As BaseURLObject
            Dim rslt As BaseURLObject = Nothing
            Try
                rslt = New BaseURLObject With {
                                .URL = Url.Action("ResultsSurveyViewPartial", "GuestPortal", New With {.id = 0}), _
                                .PageZeroURL = Url.Action("JsonRetrievePageZero", "GuestPortal", New With {.id = 0}), _
                                .ImageUrl = "http://perceptricsresearch.com/ImageSvc/image/", _
                                .ResultsGrpListViewURL = Url.Action("ResultsGroupListPartial", "GuestPortal", New With {.id = 0}), _
                                .ResultsGrpDefnViewURL = Url.Action("ResultsGroupDefnPartial", "GuestPortal", New With {.id = 0}), _
                                .ResultsModelURL = Url.Action("JsonRetrieveResults", "GuestPortal", New With {.id = 0}), _
                                .PCModelURL = Url.Action("JsonRetrievePCM", "GuestPortal", New With {.id = 0, .pgNumber = 0}), _
                                .MetaDataURL = Url.Action("JsonRetrieveSurveyMetaData", "GuestPortal", New With {.id = 0})}
            Catch ex As Exception
                Dim dbgx = 2
            End Try
            Return rslt
        End Function

        Private Function RetrieveSurveyIconModel(_surveyID As Integer) As SurveyIconModel
            Dim rslt As SurveyIconModel = Nothing
            Dim m As SurveyMetadataPackage = Nothing
            Using scp As New ServerClientProvider
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                Try
                    Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(AuthSvc) Then
                        m = AuthSvc.Retrieve_SurveyMetaData(_surveyID)
                        If Not IsNothing(m) Then
                            rslt = Me.MakeSurveyIconModel(m)
                        End If
                        AuthSvc = Nothing
                        m = Nothing
                    Else
                        FormsAuthentication.SignOut()
                    End If
                Catch ex As Exception
                    FormsAuthentication.SignOut()
                End Try
            End Using
            GC.GetTotalMemory(True)
            'Me.NormalEmail = Nothing
            Return rslt
        End Function

        Private Function RetrieveSurveyIconModels() As List(Of SurveyIconModel)
            Dim rslt As List(Of SurveyIconModel) = Nothing
            Dim model As ObservableCollection(Of AuthoringSvcNS.SurveyMetadataPackage) = Nothing
            'Dim AuthoringSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
            Using scp As New ServerClientProvider
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                Try
                    Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(AuthSvc) Then
                        model = AuthSvc.Retrieve_SurveyMetaData_List(scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name))
                        If Not IsNothing(model) Then
                            rslt = model.Select(Function(m) Me.MakeSurveyIconModel(m)).ToList
                            model = Nothing
                        End If
                        AuthSvc = Nothing
                    End If
                Catch ex As Exception
                    FormsAuthentication.SignOut()
                End Try
            End Using
            Return rslt
        End Function
        Private Function MakeSurveyIconModel(m As SurveyMetadataPackage) As SurveyIconModel
            Dim rslt As SurveyIconModel = Nothing
            Try
                rslt = New SurveyIconModel With {.SurveyID = m.TinyRow.SurveyID, _
                                                .SurveyGuidString = Guid.NewGuid.ToString("N"), _
                                                .SurveyName = m.TinyRow.SurveyName, _
                                                .PBM = m.TinyRow.PrivilegeBitMask, _
                                                .SurveyStateID = m.TinyRow.SurveyStateID, _
                                                .SurveyType = m.TinyRow.SurveyType, _
                                                .HasActiveRDents = Me.PopulateHasActiveRDents(m.MetaDataColxn), _
                                                .HasNewResults = Me.PopulateHasNewResults(m.MetaDataColxn), _
                                                .ActiveRDentsCount = Me.PopulateActiveRDentsCount(m.MetaDataColxn)} ', _
                '.URL = Url.Action("SurveyViewPartial", "SubscriberMain", New With {.id = m.TinyRow.SurveyID}), _
                '.PageZeroURL = Url.Action("JsonRetrievePageZero", "SubscriberMain", New With {.id = m.TinyRow.SurveyID}), _
                '.ImageUrl = Me.SurveyImageUrl(m.TinyRow), _
                '.ResultsGrpListViewURL = Url.Action("ResultsGroupListPartial", "SubscriberMain", New With {.id = m.TinyRow.SurveyID}), _
                '.ResultsGrpDefnViewURL = Url.Action("ResultsGroupDefnPartial", "SubscriberMain", New With {.id = m.TinyRow.SurveyID}), _
                '.SurveysInfoViewURL = Url.Action("SurveysInfoViewPartial", "SubscriberMain", New With {.id = m.TinyRow.SurveyID}), _
                '.ResultsModelURL = Url.Action("JsonRetrieveResults", "SubscriberMain", New With {.id = m.TinyRow.SurveyID}), _
                '.PCModelURL = Url.Action("JsonRetrievePCM", "SubscriberMain", New With {.id = m.TinyRow.SurveyID, .pgNumber = 0}), _
                '.PublishSurveyURL = Url.Action("PublishViewPartial", "SubscriberMain", New With {.id = m.TinyRow.SurveyID}), _
                '.MetaDataURL = Url.Action("JsonRetrieveSurveyMetaData", "SubscriberMain", New With {.id = m.TinyRow.SurveyID})}
            Catch ex As Exception
                Dim dbgx = 2
            End Try
            Return rslt
        End Function
        Private Function PopulateHasNewResults(_skvpcolxn As ObservableCollection(Of Srlzd_KVP)) As Boolean
            Dim rslt = False
            rslt = _skvpcolxn.Where(Function(kvp) kvp.Key = "HasNewResults" AndAlso kvp.Valu > 0).Any
            Return rslt
        End Function

        Private Function PopulateHasActiveRDents(_skvpcolxn As ObservableCollection(Of Srlzd_KVP)) As Boolean
            Dim rslt As Boolean = False
            rslt = _skvpcolxn.Where(Function(kvp) kvp.Key = "HasActiveRDents" AndAlso kvp.Valu > 0).Any
            Return rslt
        End Function

        Private Function PopulateActiveRDentsCount(_skvpcolxn As ObservableCollection(Of Srlzd_KVP)) As Integer
            Dim rslt As Integer
            rslt = _skvpcolxn.Where(Function(kvp) kvp.Key = "ActiveRDentsComputed" AndAlso kvp.Valu > 0).Select(Function(k) k.Valu).FirstOrDefault
            Return rslt
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


        Public Function JsonSendComment(id As Integer, emailpkg As EmailJsonObject) As JsonResult
            Return Json(Me.SendCommentEmail(id, emailpkg))
        End Function
#Region "Email Support"
        Public Function SendCommentEmail(_surveyid As Integer, emailpkg As EmailJsonObject) As String
            Dim rslt As String = "Comment emailed..."

            Try
                Dim TargetEmailAddress As String = "wbartel@interserv.com" 'testing..'_email
                Dim emo As New EmailOperations
                'Note that the server methods rely on a sql database called emailforms...the test server(leases)...on has two in its datbase...can't use form id more than 2...
                emo.EmailPackage.EmailFormName = [Enum].GetName(GetType(EmailFormNames), EmailFormNames.Comment) 'EmailFormNames.EF11)
                emo.EmailPackage.ToAddress_Normalized = TargetEmailAddress  'or some other email address they enter in if i let them...
                'emo.EmailPackage.ToAddress_Normalized = emailpkg.ToEmail'or some other email address they enter in if i let them...
                emo.EmailPackage.InitiatingNormalizedEmailAddr = emailpkg.InitiatingEmail
                For Each item In emailpkg.MsgColxn
                    emo.EmailPackage.MessageContentColxn.Add(New AuthoringSvcNS.Srlzd_KVP With {.Key = "msg", _
                                                .Valu = item})
                Next

                emo.EmailPackage.MessageContentColxn.Add(New AuthoringSvcNS.Srlzd_KVP With {.Key = "msg", _
                                                                .Valu = "Survey Name: " & emailpkg.SurveyName})

                emo.SendEmail(True)
            Catch ex As Exception
                rslt = "Sorry, we could not send your comment via email...please try again."
            End Try

            Return rslt
        End Function
#End Region



        Private Property NormalEmail() As String

        Private Property MySurveyID As Integer
#Region "Logon For RDent Stuff"
        Private Property MyLogInInfo As LogInInfo

        Public Function LogOn(ByVal model As LogOnModel, ByVal returnUrl As String, survey As Integer, rdent As String, svc As String) As ActionResult
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
                            If .EndpointKeysList.Count > 0 Then
                                FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe)
                                Try
                                    TempData.Add("User", model.UserName)
                                    TempData.Add("LoginResult", loginresult)
                                Catch ex As Exception
                                    TempData("User") = model.UserName
                                    TempData("LoginResult") = loginresult
                                End Try
                                If svc = "Results" Then
                                    Return Me.RedirectToAction("GuestPlatformResultsView", New With {.survey = survey.ToString, .rdent = rdent, .svc = svc})
                                ElseIf svc = "Review" Then
                                    Return Me.RedirectToAction("GuestPlatformReviewerView", New With {.survey = survey.ToString, .rdent = rdent, .svc = svc})
                                End If

                            Else
                                Return RedirectToAction("InsufficientPrivileges", "GuestPortal")
                            End If
                        Else

                            'ModelState.AddModelError("", "The user name or password provided is incorrect.")
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

            ' If we got this far, something failed, redisplay index
            Return View(model)
        End Function

        Public Shared Function PwdHashIntFromPwdText(ByVal _PwdText As String, ByVal _emailAddr As String) As Integer
            'Dim x = Integer.Parse(_PwdText)
            'Return Integer.Parse(_PwdText)
            Return PwdHasher.PWD_Pkg.SmartPwdPkg(_PwdText, False, _emailAddr).PwdHashINT
        End Function
#End Region
    End Class
End Namespace

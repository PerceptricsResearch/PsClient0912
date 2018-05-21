Imports System.Collections.ObjectModel
Imports MvcApplication2.AuthoringSvcNS
Imports MvcApplication2.ResultsSvcNS
Imports System.Windows.Media
Imports System.Windows.Media.Imaging
Imports System.IO

Namespace MvcApplication2
    Public Class SubscriberMainController
        Inherits System.Web.Mvc.Controller

        <HttpPost()> _
        Function UploadImage(imageFile As HttpPostedFileWrapper) As JsonResult
            Dim rslt As UploadableJsonResult = Nothing
            Try
                If Not IsNothing(imageFile) AndAlso Not IsNothing(imageFile.InputStream) Then
                    Dim fileName = Guid.NewGuid().ToString("N")
                    'this should be a function that returns a list of scales to be used with this image...based on its raw size compute scales to get to target sizes..
                    Dim scllist = New List(Of Double)({1.0, 0.5, 0.25, 0.1})
                    Dim sip = New AuthoringSvcNS.SurveyImagesPackage With {.ImageStorePkgList = New ObservableCollection(Of ImageStorePackage)}
                    imageFile.InputStream.Seek(0, SeekOrigin.Begin)
                    Dim bd = BitmapDecoder.Create(imageFile.InputStream, BitmapCreateOptions.None, BitmapCacheOption.None)
                    Dim bdx = bd.Frames.FirstOrDefault
                    If Not IsNothing(bdx) Then
                        For Each scl In scllist
                            Dim ba As Byte() = Nothing
                            Dim fh As Integer = 0
                            Dim fw As Integer = 0
                            Using ms As New MemoryStream
                                Dim enc As New PngBitmapEncoder
                                enc.Frames.Add(BitmapFrame.Create(New TransformedBitmap(bdx, New ScaleTransform(scl, scl, 0, 0))))
                                If Not IsNothing(enc.Frames.FirstOrDefault) Then
                                    With enc.Frames.FirstOrDefault
                                        fh = .PixelHeight
                                        fw = .PixelWidth
                                    End With
                                    enc.Save(ms)
                                    ba = ms.ToArray()
                                End If
                                enc = Nothing
                            End Using
                            If Not IsNothing(ba) Then
                                sip.ImageStorePkgList.Add(New ImageStorePackage With {.ByteArray = ba, _
                                                                                      .ImgFormat = scllist.IndexOf(scl), _
                                                                                      .PermPCMGuidString = fileName, _
                                                                                        .Height = fh, _
                                                                                        .Width = fw, _
                                                                                        .SeqNumber = 0, _
                                                                                        .ImageID = 0, _
                                                                                        .PCElemID = 0, _
                                                                                        .PCMID = 0, _
                                                                                        .SurveyID = 0})
                            End If

                        Next
                        If sip.ImageStorePkgList.Count > 0 Then
                            Using scp As New ServerClientProvider
                                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                                scp.AuthorSvcClientNew(Me.NormalEmail)
                                scp.MyAuthSvc.AddManagerImages(sip)
                            End Using
                            rslt = New UploadableJsonResult With {.Data = New With {.ImagePath = Me.UploadImageUrl(fileName)}} 'should be the thumbnail url...
                        Else
                            'gotta do somekind of error dialogue...
                        End If
                    End If
                    bd = Nothing
                    bdx = Nothing
                    sip.ImageStorePkgList.Clear()
                    sip.ImageStorePkgList = Nothing
                    sip = Nothing
                End If
            Catch ex As Exception
                'gotta do somekind of error dialogue...
                Dim dbgxex = 2
            End Try


            Return rslt
        End Function
        Private Function UploadImageUrl(_filename As String) As String
            Return "http://perceptricsresearch.com/ImageSvc/mgrimgthumb/" & Me.NormalEmail & "/" & _filename
        End Function

        <Authorize()> _
        Function Index() As ActionResult
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            Return View()
        End Function
        <Authorize()> _
        Function SubscriberHome() As ActionResult
            ViewData("Title") = "Subscriber Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            Return View() 'RetrieveSurveyIconModels)
        End Function

        <HttpGet()> _
        <Ajax(True)> _
        <ActionName("DesignerHomePartial")> _
        Function DesignerHomePartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Designer Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            Return PartialView("DesignerHomePartial")
        End Function

        <HttpGet()> _
        <Ajax(True)> _
        <ActionName("DesignerToolBoxSlideoutPartial")> _
        Function DesignerToolBoxSlideoutPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "DesignerToolBoxSlideoutPartial"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            Return PartialView("DesignerToolBoxSlideoutPartial")
        End Function

        <HttpGet()> _
        <Ajax(True)> _
        <ActionName("DesignerPagesListViewPartial")> _
        Function DesignerPagesListViewPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "DesignerPagesListViewPartial"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            Return PartialView("DesignerPagesListViewPartial")
        End Function

        <HttpGet()> _
        <Ajax(True)> _
        <ActionName("SurveyPagesListViewPartial")> _
        Function SurveyPagesListViewPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "SurveyPagesListViewPartial"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            Return PartialView("SurveyPagesListViewPartial")
        End Function

        <HttpGet()> _
        <Ajax(True)> _
        <ActionName("SurveyPageNaviViewPartial")> _
        Function SurveyPageNaviViewPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "SurveyPageNaviViewPartial"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            Return PartialView("SurveyPageNaviViewPartial")
        End Function

        <HttpGet()> _
        <Ajax(True)> _
        <ActionName("SurveyMetaDataViewPartial")> _
        Function SurveyMetaDataViewPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Subscriber Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Return PartialView("SurveyMetaDataViewPartial") 'View()
        End Function

        '<HttpGet()> _
        '<ActionName("SurveyViewPartial")> _
        'Function SurveyViewPartial(id As Integer) As ActionResult
        '    ViewData("Title") = "Subscriber Home"
        '    ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
        '    ViewData("SurveyID") = id
        '    Return PartialView("SurveyViewPartial") 'this guy needs a model i think...so that razor can do some rendering of the PCElems required for this page...
        'End Function

        <HttpGet()> _
        <Ajax(True)> _
        <ActionName("SurveyViewPartial")> _
        Function SurveyViewPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Subscriber Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            ViewData("NextPageNumber") = 0
            ViewData("SurveyData") = "adelade"
            Me.MySurveyID = id
            Return PartialView("SurveyViewPartial", Me.RetrievePageContentModel(id, 0))
        End Function

        '<HttpGet()> _
        '<ActionName("PageContentViewPartial")> _
        'Function PageContentViewPartial(id As Integer, pgNumber As Integer) As ActionResult
        '    ViewData("Title") = "Subscriber Home"
        '    ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
        '    ViewData("SurveyID") = id
        '    Return PartialView("PageContentViewPartial", Me.RetrievePageContentModel(id, pgNumber))
        'End Function

        '<HttpGet()> _
        <Ajax(True)> _
        <ActionName("PageContentViewPartial")> _
        Function PageContentViewPartial_Ajax(id As Integer, pgNumber As Integer) As ActionResult
            ViewData("Title") = "Subscriber Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Me.MySurveyID = id
            ViewData("PCVData") = "ignatz"
            Return PartialView("PageContentViewPartial", Me.RetrievePageContentModel(id, pgNumber)) 'this guy needs a model i think...so that razor can do some rendering of the PCElems required for this page...
        End Function
        <Ajax(True)> _
        <ActionName("GroupsSlideoutViewPartial")> _
        Function GroupsSlideoutViewPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Subscriber Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Return PartialView("GroupsSlideoutViewPartial") 'View()
        End Function

        <Ajax(True)> _
        <ActionName("ResultsGroupListPartial")> _
        Function ResultsGroupListPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Subscriber Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Return PartialView("ResultsGroupListPartial") 'View()
        End Function

        <Ajax(True)> _
        <ActionName("ResultsGroupDefnPartial")> _
        Function ResultsGroupDefnPartial_Ajax(id As Integer) As ActionResult ', rfmid As Integer
            ViewData("Title") = "Subscriber Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            'ViewData("RFMID") = rfmid 'id
            Return PartialView("ResultsGroupDefnPartial") 'View()
        End Function


        <Ajax(True)> _
        <ActionName("PublishViewPartial")> _
        Function PublishViewPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Subscriber Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            ViewData("RDentLinkDxnryURL") = Url.Action("JsonRetrieveRDentLinkDxnry", "SubscriberMain")
            Return PartialView("PublishViewPartial") 'View()
        End Function

        <Ajax(True)> _
        <ActionName("ResultsSurveyViewPartial")> _
        Function ResultsSurveyViewPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Subscriber Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Return PartialView("ResultsSurveyViewPartial") 'View()
        End Function


        <Ajax(True)> _
        <ActionName("SurveysInfoViewPartial")> _
        Function SurveysInfoViewPartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Subscriber Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Return PartialView("SurveysInfoViewPartial") 'View()
        End Function

        <Ajax(True)> _
        <ActionName("ShareHomePartial")> _
        Function ShareHomePartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Subscriber Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Return PartialView("ShareHomePartial") 'View()
        End Function

        <Ajax(True)> _
        <ActionName("SubscriptionHomePartial")> _
        Function SubscriptionHomePartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Subscription Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Return PartialView("SubscriptionHomePartial") 'View()
        End Function
        <Ajax(True)> _
        <ActionName("SettingsHomePartial")> _
        Function SettingsHomePartial_Ajax(id As Integer) As ActionResult
            ViewData("Title") = "Settings Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Return PartialView("SettingsHomePartial") 'View()
        End Function

        <Ajax(True)> _
        <ActionName("PlayerPageContentViewPartial")> _
        Function PlayerPageContentViewPartial_Ajax(id As Integer, pgNumber As Integer) As ActionResult
            ViewData("Title") = "Subscriber Home"
            ViewData("User") = Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
            ViewData("SurveyID") = id
            Me.MySurveyID = id
            ViewData("PCVData") = "ignatz"
            Return PartialView("PlayerPageContentViewPartial", Me.RetrievePageContentModel(id, pgNumber))
        End Function

#Region "JSON STUFF for AJAX Calls to this Controller"
        'this needs authorize and httppost decorators...
        Public Function JsonRetrieveSurveyIconModelList() As JsonResult
            Dim rslt As JsonResult = Nothing
            Try
                Dim baseUrlColxn As BaseURLObject = Me.MakeBaseUrlColxn
                Dim simdlColxn As List(Of SurveyIconModel) = Me.RetrieveSurveyIconModels
                rslt = Json(New With {.baseurlcolxn = baseUrlColxn, _
                                      .simcolxn = simdlColxn})
            Catch ex As Exception
                Dim dbgx = 2
            End Try

            Return rslt 'Json(Me.RetrieveSurveyIconModels)
        End Function

        Public Function JsonRetrieveSurveyPCMIDPgNumberList(id As Integer) As JsonResult
            Dim rslt As List(Of Srlzd_KVP) = Nothing
            Dim smd = Me.RetrieveSurveyMetaData(id)
            If Not IsNothing(smd) Then
                Dim dummy As Integer
                rslt = smd.Where(Function(kvp) Integer.TryParse(kvp.Key, dummy)).ToList
            End If
            Return Json(rslt)
        End Function

        Public Function JsonRetrieveSurveyMetaData(id As Integer) As JsonResult
            Return Json(Me.RetrieveSurveyMetaData(id))
        End Function
        Public Function JsonRetrieveUrlsList() As JsonResult
            Return Json(New With {.renamesurveyurl = Url.Action("JsonRenameSurvey", "SubscriberMain", New With {.id = -1}),
                                  .designerresourcesURL = Url.Action("JsonRetrieveDesignerResources", "SubscriberMain"),
                                  .dsgnrimgmgrguildstrlisturl = Url.Action("JsonRetrieveDesignerImagesMgrGuidStrList", "SubscriberMain", Nothing),
                                  .surveypageslistUrl = Url.Action("SurveyPagesListViewPartial", "SubscriberMain", New With {.id = 8})})
        End Function


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
        Public Function JsonRenameSurvey(id As Integer, SimPkg As SurveyItem_Package) As JsonResult
            Dim rslt As AuthoringSvcNS.POCO_ID_Pkg = Nothing
            Dim fnlrslt As JsonResult = Nothing
            Try
                Dim tmprslt = Me.RenameSurvey(id, SimPkg)
                rslt = tmprslt
            Catch ex As Exception
                Dim norslt = False
            End Try
            Try
                fnlrslt = Json(rslt)
            Catch ex As Exception
                Dim x = 2
            End Try
            Return fnlrslt
        End Function
        Public Function JsonSaveSurveyItem(id As Integer, SimPkg As SurveyItem_Package) As JsonResult
            Dim rslt As Object = Nothing
            Try
                'have to do something with RMKey1's...all pce.qoim.rm.key1 in every page require a unique integer...
                'keep a list of all the rm.Key1 in an jsonobject that gets stored in PCMJsonObject for Page 1...
                'rmkeys are assigned by the prweb.designersavesurveysvc.SavePagePkg....puts a RespONSEModel on each qoim that doesn't have one already...
                'Dim tmprslt = Nothing 'Me.SaveSurveyItemModel(id, SimPkg)
                'this json result also needs to have a new surveyiconmodel row returned...so surveyiconlistsvc reflects this survey
                'presumably, only if surveyrow is new...look at SimPkg...
                Dim pocopkg = Me.SaveSurveyItemModel(id, SimPkg)
                If Not IsNothing(pocopkg) Then
                    If (pocopkg._Original_ID < 0) Then
                        'is a new survey...needs a surveyiconmodel to go back to the client successhandler...
                        Dim siconmodel = Me.RetrieveSurveyIconModel(pocopkg._DB_ID) 'too bad this isn't part of the package coming back from Me.SaveSurveyItemModel...
                        rslt = New With {.poco = pocopkg, _
                                         .surveyiconmodel = siconmodel}
                    Else
                        rslt = New With {.poco = pocopkg, _
                                         .surveyiconmodel = False}
                    End If
                End If
            Catch ex As Exception
                Dim norslt = False
            End Try

            Return Json(rslt)
        End Function
        Public Function JsonSavePCM(id As Integer, PgPkg As PCMJsonObject) As JsonResult
            Dim rslt As JsonResult = Nothing 'ObservableCollection(Of AuthoringSvcNS.POCO_ID_Pkg) = Nothing
            Try
                Dim tmprslt = Me.SavePCM(id, PgPkg)
                If Not IsNothing(tmprslt) Then
                    Dim crslt = tmprslt.Select(Function(x) New With {._DB_ID = x._DB_ID,
                                                 ._Original_ID = x._Original_ID,
                                                 ._POCOGuid = x._POCOGuid.ToString("N"),
                                                 ._Survey_ID = x._Survey_ID})
                    rslt = Json(crslt)
                End If
            Catch ex As Exception
                Dim norslt = False
            End Try

            Return rslt
        End Function

        Public Function JsonRetrieveResults(id As Integer) As JsonResult
            Return Json(Me.RetrieveResults(id))
        End Function

        Public Function JsonRetrieveSDSResponseModels(id As Integer) As JsonResult
            Return Json(Me.RetrieveSDSResponseModels(id))
        End Function

        Public Function JsonRetrieveActiveNewResults() As JsonResult
            Return Json(Me.ActiveandnewResultsHeartbeat())
        End Function

        Public Function JsonRetrieveResultsFilters(id As Integer) As JsonResult
            Dim rslt = New With {.rfmlist = Nothing, .pcmlist = Nothing}
            Try
                Dim rsltfilters = Me.RetrieveResultsFilterModels(id)
                Dim pcmidslist As List(Of Srlzd_KVP) = Nothing
                Dim smd = Me.RetrieveSurveyMetaData(id)
                If Not IsNothing(smd) Then
                    Dim dummy As Integer
                    pcmidslist = smd.Where(Function(kvp) Integer.TryParse(kvp.Key, dummy)).ToList
                End If
                rslt.rfmlist = rsltfilters
                rslt.pcmlist = pcmidslist
                If Not IsNothing(rslt) Then
                    'For Each elm In rslt
                    '    elm.RsltsPieChartBrushColor = Nothing
                    'Next
                End If
            Catch ex As Exception
                Dim dbxg = 2
            End Try


            Return Json(rslt)
        End Function

        Public Function JsonRetrieveResultsWithFilterGroup(id As Integer, RFGOList As ObservableCollection(Of ResultsFilterGroupObject)) As JsonResult
            Dim rslt As ResultsDxnryObject = Nothing
            If Not IsNothing(RFGOList) Then
                Dim okToGo As Boolean = False
                For Each rfgo In RFGOList
                    With rfgo
                        If IsNothing(.QuestionIDList) Then
                            .QuestionIDList = New ObservableCollection(Of Integer)
                        End If
                        If IsNothing(.OptionIDList) Then
                            .OptionIDList = New ObservableCollection(Of Integer)
                        End If
                        If Not IsNothing(.OptionIDList) AndAlso Not IsNothing(.QuestionIDList) Then
                            okToGo = True
                        End If

                    End With
                Next
                If okToGo Then
                    rslt = RetrieveResultsWithFilterGroup(id, RFGOList)
                End If
            End If

            Return Json(rslt)
        End Function

        Public Function JsonSaveRFM(id As Integer, RFM As ResultsFilterModel) As JsonResult
            Dim rslt As ResultsSvcNS.POCO_ID_Pkg = Nothing
            If Not IsNothing(RFM) Then
                rslt = Me.SaveResultsFilterModel(id, RFM)
            Else
                Dim x = 2
            End If

            Return Json(rslt)
        End Function

        Public Function JsonRetrieveRDentLinkDxnry() As JsonResult
            Return Json(Me.RetrieveRespondentLinkDxnry)
        End Function

        Public Function JsonSendRDentLinkEmail(id As Integer, surveyname As String, linktext As String) As JsonResult
            Return Json(Me.SendRDentLinkEmail(id, surveyname, linktext))
        End Function

        Public Function JsonChangeSurveyStatus(id As Integer, changesurveystatepkg As ChangeSurveyStatePackage) As JsonResult
            Return Json(Me.ChangeSurveyStatus(id, changesurveystatepkg))
        End Function
        Public Function JsonRetrieveDesignerImagesMgrGuidStrList() As JsonResult
            Return Json(Me.RetrieveDesignerImagesMgrGuidStrList())
        End Function

        Public Function JsonRetrieveDesignerResources() As JsonResult
            Return Json(New With {.tlbx = Me.VwP("DesignerToolBoxSlideoutPartial"),
                                  .editablecontainer = Me.VwP("EditableContainerPartial"),
                                  .stylesbx = Me.VwP("DesignerStylesSlideoutPartial"),
                                  .imgmgrbx = Me.VwP("DesignerImagesMgrSlideoutPartial"),
                                  .optionsbx = Me.VwP("DesignerOptionsSlideoutPartial"),
                                  .dpl = Me.VwP("DesignerPagesListViewPartial"),
                                  .donebtn = Me.VwP("DesignerDoneBtnPartial"),
                                  .questoptset = Me.VwP("DesignerQuestOptSetPartial"),
                                  .image = Me.VwP("DesignerImagePartial"),
                                  .ignatz = Me.VwP("DesignerIgnatzPartial"),
                                  .stylablepage = Me.VwP("DesignerStylablePagePartial"),
                                  .renamesurveyurl = Url.Action("JsonRenameSurvey", "SubscriberMain", New With {.id = -1}),
                                  .savesurveyurl = Url.Action("JsonSaveSurveyItem", "SubscriberMain", New With {.id = -1}),
                                  .savepageurl = Url.Action("JsonSavePCM", "SubscriberMain", New With {.id = -1})})
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
                            .nxtpgurl = Url.Action("JsonRetrievePCM", "SubscriberMain", New With {.id = id, .pgNumber = 1}), _
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

        Public Function JsonRetrieveSurveyInfos() As JsonResult
            Dim rslt As JsonResult = Nothing
            Dim retrievesurveyinfo As SurveyInfoPackage = Nothing
            If IsNothing(retrievesurveyinfo) Then
                Dim si = New SurveyInfoSupport
                rslt = Json(New With {.surveyinfopkg = si.PopulateDefaultSurveyInfos, _
                                      .saveurl = Url.Action("JsonSaveSurveyInfos", "SubscriberMain", New With {.subscriptionpkg = Nothing})})
                si = Nothing
            End If
            Return rslt
        End Function

        Public Function JsonSaveSurveyInfos(surveyinfopkg As SurveyInfoPackage) As JsonResult
            Dim rslt As JsonResult = Nothing
            If Not IsNothing(surveyinfopkg) Then
                rslt = Json(rslt)
            End If
            Return rslt
        End Function

        Public Function JsonRetrieveSubscriptionInfo() As JsonResult
            Dim rslt As JsonResult = Nothing
            Dim retrievesubscriptioninfos As SubscriptionInfoPackage = Nothing
            'this would try and go get subscription from the database...
            'some wcf method would go get this from the server...
            'if nothing then it would do the create default settings below...
            If IsNothing(retrievesubscriptioninfos) Then
                Dim ss = New SubscriptionSupport
                rslt = Json(New With {.subscriptionpkg = ss.PopulateDefaultSubscriptionInfos, _
                                      .saveurl = Url.Action("JsonSaveSubscriptionInfo", "SubscriberMain", New With {.subscriptionpkg = Nothing})})
                ss = Nothing
            End If
            Return rslt
        End Function
        Public Function JsonSaveSubscriptionInfo(subscriptionpkg As SubscriptionInfoPackage) As JsonResult
            Dim rslt As JsonResult = Nothing
            If Not IsNothing(subscriptionpkg) Then
                rslt = Json(rslt)
            End If
            Return rslt
        End Function

        Public Function JsonRetrieveSettingsInfo() As JsonResult
            Dim rslt As JsonResult = Nothing
            Dim retrievesettings As SaveSettingsPackage = Nothing
            'this would try and go get settings from the database...
            'some wcf method would go get this from the server...
            'if nothing then it would do the create default settings below...
            If IsNothing(retrievesettings) Then
                Dim ss = New SettingsSupport
                rslt = Json(New With {.settingspkg = ss.PopulateDefaultSettings, _
                                      .saveurl = "this will be a url"})
                ss = Nothing
            End If
            Return rslt
        End Function

        Public Function JsonSaveSettingsInfo(settingspkg As SaveSettingsPackage) As JsonResult
            Dim rslt As JsonResult = Nothing
            Return rslt
        End Function


        Public Function JsonRetrieveGLInfo(id As Integer) As JsonResult
            Dim rslt As JsonResult = Nothing
            Try
                Dim gli = Me.RetrieveGuestLoginInfo()
                If Not IsNothing(gli) Then
                    Dim spm = gli.SurveyPrivileges.Where(Function(s) s.SurveyID = id).FirstOrDefault
                    Dim ps = New PrivilegeSupport
                    Dim linkrows = ps.PopulateShareLinkRowColxn_fromPrivBitMask(spm)
                    rslt = Json(New With {
                                .linkspkg = New ShareSurveyLinksPackage With {.LinkRowsColxn = linkrows, _
                                                                              .SPMColxn = gli.SurveyPrivileges}, _
                                .glistring = gli.NormalizedEmailAddress, _
                                .saveurl = Url.Action("JsonSaveSurveyPrivileges", "SubscriberMain", New With {.linkspkg = Nothing})})
                    ps = Nothing
                    spm = Nothing
                    gli = Nothing
                End If
            Catch ex As Exception
                Dim dbgx = 2
            End Try
            Return rslt
        End Function

        Public Function JsonSaveSurveyPrivileges(linkspkg As ShareSurveyLinksPackage) As JsonResult
            Dim rslt As JsonResult = Nothing
            Try
                rslt = Json(Me.UpdateSurveyPrivilegeModels(linkspkg))
            Catch ex As Exception
                rslt = Json(False)
            End Try
            Return rslt
        End Function
#End Region

#Region "WCF Service Call methods..."
#Region "Basic Survey and Pages Support Methods"
#Region "DesignerImagesMgrSupportMethods"
        Private Function RetrieveDesignerImagesMgrGuidStrList() As IEnumerable(Of String)
            Dim rslt As IEnumerable(Of String) = Nothing
            Try
                Using scp As New ServerClientProvider
                    Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                    scp.AuthorSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(scp.MyAuthSvc) Then
                        Dim temprslt = scp.MyAuthSvc.RetrieveManagerGuidStrList(3)
                        If Not IsNothing(temprslt) Then
                            rslt = temprslt.Where(Function(ss) ss <> "").Select(Function(s) Me.UploadImageUrl(s)).AsEnumerable
                        End If
                    End If
                End Using
            Catch ex As Exception
                Dim x = 2
            End Try

            Return rslt
        End Function
#End Region

        Private Function MakeBaseUrlColxn() As BaseURLObject
            Dim rslt As BaseURLObject = Nothing
            Try
                rslt = New BaseURLObject With {
                                .URL = Url.Action("ResultsSurveyViewPartial", "SubscriberMain", New With {.id = 0}), _
                                .PageZeroURL = Url.Action("JsonRetrievePageZero", "SubscriberMain", New With {.id = 0}), _
                                .ImageUrl = "http://perceptricsresearch.com/ImageSvc/image/", _
                                .ResultsGrpListViewURL = Url.Action("ResultsGroupListPartial", "SubscriberMain", New With {.id = 0}), _
                                .ResultsGrpDefnViewURL = Url.Action("ResultsGroupDefnPartial", "SubscriberMain", New With {.id = 0}), _
                                .SurveysInfoViewURL = Url.Action("SurveysInfoViewPartial", "SubscriberMain", New With {.id = 0}), _
                                .ResultsModelURL = Url.Action("JsonRetrieveResults", "SubscriberMain", New With {.id = 0}), _
                                .PCModelURL = Url.Action("JsonRetrievePCM", "SubscriberMain", New With {.id = 0, .pgNumber = 0}), _
                                .PublishSurveyURL = Url.Action("PublishViewPartial", "SubscriberMain", New With {.id = 0}), _
                                .MetaDataURL = Url.Action("JsonRetrieveSurveyMetaData", "SubscriberMain", New With {.id = 0})}
            Catch ex As Exception
                Dim dbgx = 2
            End Try
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
#Region "RetrieveSurveyIconModel(_surveyID)"
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
#End Region
#Region "RetrieveSurveyIconModels"
        ' Reutrns surveyIconModels...generated from Authoringsvc surveymetadatalist....this is surveys...not the stats about a survey...
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

        Private Function SurveyPagesUrl(_tinyrow As AuthoringSvcNS.Tiny_Survey_Row) As String
            Return "Survey/Details/" & _tinyrow.SurveyID.ToString & "/"
        End Function

        Private Function SurveyImageUrl(_tinyrow As AuthoringSvcNS.Tiny_Survey_Row) As String
            Return "http://perceptricsresearch.com/ImageSvc/image/" & Me.NormalEmail & "/" & _tinyrow.SurveyID.ToString & "/0"
        End Function


        Private Property PCElemsWithImagesColxn As Dictionary(Of Integer, Integer)

        Private Function PCElemImageUrl(_SurveyID As Integer, _PCMID As Integer, _PCElemID As Integer, _hasImage As Boolean) As String
            If _hasImage Then
                Return "http://perceptricsresearch.com/ImageSvc/imagepcelem/" & Me.NormalEmail & "/" & _SurveyID.ToString & "/" & _PCMID.ToString & "/" & _PCElemID.ToString
                'If Not IsNothing(Me.PCElemsWithImagesColxn) Then
                '    Dim hasImage As Integer = Nothing
                '    If Me.PCElemsWithImagesColxn.TryGetValue(_PCElemID, hasImage) Then
                '        Return "http://perceptricsresearch.com/ImageSvc/imagepcelem/" & Me.NormalEmail & "/" & _SurveyID.ToString & "/" & _PCMID.ToString & "/" & _PCElemID.ToString
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

        Private Function SurveyMetaDataUrl(_tinyrow As Tiny_Survey_Row) As String

            Return "Survey/Details/" & _tinyrow.SurveyID.ToString & "/"
        End Function

        Private Property NormalEmail() As String

        Private Property MySurveyID As Integer
#End Region

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

#Region "RetrievePageContentModel(_surveyID, _pageNumber)"
        Private Function RetrievePageContentModel(_surveyID As Integer, _pageNumber As Integer) As PageContentModel
            Dim rslt As Page_Package = Nothing
            Dim pcmrslt As PageContentModel = Nothing
            'Dim AuthoringSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
            Using scp As New ServerClientProvider
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
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
#End Region

#Region "RenameSurveySupport"
        Private Function RenameSurvey(_surveyID As Integer, SimPkg As SurveyItem_Package) As AuthoringSvcNS.POCO_ID_Pkg
            Dim rslt As AuthoringSvcNS.POCO_ID_Pkg = Nothing
            Using scp As New ServerClientProvider
                Try
                    Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                    Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(AuthSvc) Then
                        Dim xsimpkg = SimPkg
                        'SimPkg.
                        If Not IsNothing(xsimpkg) Then
                            rslt = AuthSvc.SaveSurveyItemModel(xsimpkg)
                            'Dim xx = AuthSvc.Retrieve_SurveyMetaData(_surveyID)
                            'xx.
                        End If
                        xsimpkg = Nothing
                        AuthSvc = Nothing
                        SimPkg = Nothing
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

#Region "SaveSurveyItemModelSupport"
        Private Function SaveSurveyItemModel(_surveyID As Integer, SimPkg As SurveyItem_Package) As AuthoringSvcNS.POCO_ID_Pkg
            Dim rslt As AuthoringSvcNS.POCO_ID_Pkg = Nothing
            Using scp As New ServerClientProvider
                Try
                    Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                    Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(AuthSvc) Then
                        Dim xsimpkg = SimPkg
                        'SimPkg.
                        If Not IsNothing(xsimpkg) Then
                            rslt = AuthSvc.SaveSurveyItemModel(xsimpkg)
                            'Dim xx = AuthSvc.Retrieve_SurveyMetaData(_surveyID)
                            'xx.
                        End If
                        xsimpkg = Nothing
                        AuthSvc = Nothing
                        SimPkg = Nothing
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
#Region "SaveSurveyPagesSupport"
        Private Function SavePCM(_surveyID As Integer, _pcmjobj As PCMJsonObject) As ObservableCollection(Of AuthoringSvcNS.POCO_ID_Pkg)
            Dim rslt As ObservableCollection(Of AuthoringSvcNS.POCO_ID_Pkg) = Nothing
            Using scp As New ServerClientProvider
                Try
                    Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                    Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(AuthSvc) Then
                        Dim pgpkg = _pcmjobj.ToPagePackage()
                        pgpkg.SurveyPagesCount = _pcmjobj.PagesCount
                        If Not IsNothing(pgpkg) Then
                            rslt = AuthSvc.SavePage(pgpkg)
                        End If
                        'test if i can do anything with the serialized object in the pagepkg...
                        'Dim pcmj = System.Web.Helpers.Json.Decode(Of PCMJsonObject)(pgpkg.PgContentModelPkg._PCM)
                        'Dim pcejcolxn = pgpkg.PCElement_Pkg_Colxn.Select(Function(pcepkg) System.Web.Helpers.Json.Decode(Of PCElemJsonObject)(pcepkg._PCE))

                        pgpkg = Nothing
                        AuthSvc = Nothing
                        _pcmjobj = Nothing
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



#Region "ActiveandnewResultsHeartbeat"
        Private Function ActiveandnewResultsHeartbeat() As Dictionary(Of String, SubscriberHeartBeatPackage)
            Dim rslt As Dictionary(Of String, SubscriberHeartBeatPackage) = Nothing

            'Dim AuthoringSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
            Using scp As New ServerClientProvider
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                Try
                    Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(AuthSvc) Then
                        Dim model As ObservableCollection(Of SurveyMetadataPackage) = Nothing
                        model = AuthSvc.Retrieve_ActiveOrNewResultsSMDList(Me.NormalEmail)

                        If Not IsNothing(model) Then

                            'For Each pkg In model
                            '    Dim newlist = model.Select(Function(c) c.MetaDataColxn.Select(Function(mi) New Srlzd_KVP With {.Key = mi.Key, .Valu = mi.Valu}).ToList)
                            '    Dim newpkg = New SubscriberHeartBeatPackage With {.SurveyID = pkg.TinyRow.SurveyID, _
                            '                                                      .KVPColxn = newlist}
                            'Next
                            'rslt = model.Select(Function(c) c.MetaDataColxn.Select(Function(mi) New Srlzd_KVP With {.Key = mi.Key, .Valu = mi.Valu}).ToList)
                            Dim trslt = model.Select(Function(c) New SubscriberHeartBeatPackage With {.SurveyID = c.TinyRow.SurveyID, _
                                                                                                   .KVPColxn = c.MetaDataColxn.Select(Function(mi) New Srlzd_KVP With {.Key = mi.Key, .Valu = mi.Valu}).ToList})

                            rslt = trslt.ToDictionary(Function(shbp) shbp.SurveyID.ToString)
                            'this could just select the HasNewResults and HasActiveRDents KVP...or the server could just return those...doesn't need to make a long list...
                            'just have the ActiveorNew Method on the WCF Service send one or two kvps...don't do the long list of kvps for smd...subscriber will go get it if he wants it?
                            Dim x = 2

                        End If
                        AuthSvc = Nothing
                    Else
                        FormsAuthentication.SignOut()
                    End If
                Catch ex As Exception
                    FormsAuthentication.SignOut()
                End Try
            End Using
            'GC.GetTotalMemory(True)
            'Me.NormalEmail = Nothing
            Return rslt
        End Function
#End Region
#End Region

#Region "Publishing Support Methods"
        Public Function RetrieveRespondentLinkDxnry() As Dictionary(Of String, RDentLoginObject)
            'The server operation that supports this is substantial...see AuthoringSvc.GuestLogin and SurveyPrivilegeMethods...
            'Consequently, this method should retrieve all RDentLogins for a subscriber...and cache the result on the client...
            'then client methods will select from that list, to support the RDentLink dialogue...
            'This method should also return the results as a Dxnry of SurveyID and RDentEmail...not the entire guesloginobject...
            Dim rslt As Dictionary(Of String, RDentLoginObject) = Nothing
            Dim AuthSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
            Using scp As New ServerClientProvider
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                Try
                    AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                    Dim xm = AuthSvc.Retrieve_GuestLoginInfo_List() 'this could be RDentLoginInfoList...change AuthSvc Interface to support 
                    If Not IsNothing(xm) Then
                        Dim rdentenum As ULong = 8 ' don't need this if use AuthSvc.RDentLoginInfoList...
                        Dim x = xm.Where(Function(gli) (gli.PrivBitMask And rdentenum) > 0 AndAlso gli.SurveyPrivileges.Count > 0) _
                                .Select(Function(glx) New RDentLoginObject With {.SurveyID = glx.SurveyPrivileges.FirstOrDefault.SurveyID, _
                                                                                                                                                                                   .NEMA = glx.NormalizedEmailAddress}).ToDictionary(Function(dobj) dobj.SurveyID)
                        If Not IsNothing(x) Then
                            rslt = x
                        Else
                            rslt = New Dictionary(Of String, RDentLoginObject)
                        End If
                    End If
                Catch ex As Exception
                    FormsAuthentication.SignOut()
                End Try
            End Using
            AuthSvc = Nothing
            Return rslt
        End Function

        Public Function ChangeSurveyStatus(id As Integer, changesurveystatepkg As ChangeSurveyStatePackage) As String
            Dim rslt As String = "Survey Status Started...but not completed."
            Using scp As New ServerClientProvider
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                Try
                    Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(AuthSvc) Then
                        Dim isok = AuthSvc.ChangeSurveyStatus(changesurveystatepkg) 'changesurveystatepkg.TargetState 'testing...'AuthSvc.ChangeSurveyStatus(changesurveystatepkg)
                        If isok < 0 Then 'not ok...targetsurveystate is returned 
                            rslt = "SubscriberMainController.ChangeSurveyStatus was not successful..."
                        Else
                            rslt = "Survey Status Changed"
                        End If
                    Else
                        rslt = "SubscriberMainController could not create AuthorSvcClient with provided email ChangeSurveyStatus "
                    End If
                Catch ex As Exception
                    rslt = "SubscriberMainController encoutered an error in ChangeSurveyStatus " & ex.Message
                End Try
            End Using

            Return rslt
        End Function
#End Region

#Region "Email Support"
        Public Function SendRDentLinkEmail(_surveyid As Integer, _survename As String, _linktext As String) As String
            Dim rslt As String = "Email Sent..."

            Try
                Dim TargetEmailAddress As String = "wbartel@interserv.com" 'testing..'Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name
                Dim emo As New EmailOperations
                'Note that the server methods rely on a sql database called emailforms...the test server(leases)...on has two in its datbase...can't use form id more than 2...
                emo.EmailPackage.EmailFormName = [Enum].GetName(GetType(EmailFormNames), EmailFormNames.PublishedSurvey) 'EmailFormNames.EF11)
                emo.EmailPackage.ToAddress_Normalized = TargetEmailAddress  'or some other email address they enter in if i let them...

                emo.EmailPackage.MessageContentColxn.Add(New AuthoringSvcNS.Srlzd_KVP With {.Key = "msg", _
                                                                .Valu = "Survey Link: " & _linktext})
                emo.EmailPackage.MessageContentColxn.Add(New AuthoringSvcNS.Srlzd_KVP With {.Key = "msg", _
                                                                .Valu = "Survey Name: " & _survename})

                emo.SendEmail(True)
            Catch ex As Exception
                rslt = "Sorry, we could not send you an email...please try again."
            End Try

            Return rslt
        End Function
#End Region

#Region "GuestLoginInfo and Share support methods"

        Private Function UpdateSurveyPrivilegeModels(_linkspkg As ShareSurveyLinksPackage) As Boolean
            Dim rslt As Boolean = False
            Dim ps = New PrivilegeSupport
            Dim spms = ps.PopulatePrivBitMask_fromLinkRowColxn(_linkspkg)
            Using scp As New ServerClientProvider
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                Try
                    Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(AuthSvc) Then
                        Dim upaterslt = AuthSvc.Update_SurveyPrivilegeModels(spms)
                        If Not IsNothing(upaterslt) Then
                            rslt = True
                            upaterslt = Nothing
                        End If
                        AuthSvc = Nothing
                    End If
                Catch ex As Exception
                    Dim dbgx = 2
                End Try
            End Using
            Return rslt
        End Function

        Private Function RetrieveGuestLoginInfo() As GuestLoginInfo
            Dim rslt As GuestLoginInfo = Nothing
            Dim model As ObservableCollection(Of GuestLoginInfo) = Nothing
            'Dim AuthoringSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
            Using scp As New ServerClientProvider
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                Try
                    Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(AuthSvc) Then
                        model = AuthSvc.Retrieve_GuestLoginInfo_List()
                        If Not IsNothing(model) Then
                            rslt = model.Where(Function(m) (m.PrivBitMask And PrivEnum.GuestPortal) > 0).FirstOrDefault
                            If IsNothing(rslt) Then
                                Dim gploginstr = Guid.NewGuid.ToString("N")
                                model = Nothing
                                model = AuthSvc.Add_GuestLoginInfo(gploginstr)
                                model = AuthSvc.Retrieve_GuestLoginInfo_List()
                                If Not IsNothing(model) Then
                                    rslt = model.Where(Function(m) (m.PrivBitMask And PrivEnum.GuestPortal) > 0).FirstOrDefault
                                    model = Nothing
                                End If
                            End If
                            model = Nothing
                        End If
                        AuthSvc = Nothing
                    End If
                Catch ex As Exception
                    Dim dbgx = 2
                End Try
            End Using
            Return rslt
        End Function

        Private Function AddGuesPortalLogin() As GuestLoginInfo
            Dim rslt As GuestLoginInfo = Nothing
            Using scp As New ServerClientProvider
                Me.NormalEmail = scp.Normalize(Me.ControllerContext.RequestContext.HttpContext.User.Identity.Name)
                Try
                    Dim AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
                    If Not IsNothing(AuthSvc) Then
                        Dim gploginstr = Guid.NewGuid.ToString
                        Dim model = AuthSvc.Add_GuestLoginInfo(gploginstr)
                        If Not IsNothing(model) Then
                            rslt = model.Where(Function(m) (m.PrivBitMask And PrivEnum.GuestPortal) > 0).FirstOrDefault
                            model = Nothing
                        End If
                        AuthSvc = Nothing
                    End If
                Catch ex As Exception
                    Dim dbgx = 2
                End Try
            End Using
            Return rslt
        End Function
#End Region

#End Region

#Region "Optimized WCF Service Call Methods"
        'the idea here is to create one ServiceProviderClient...and make calls on this SCP.AuthSvc 
        'previously, independent SCP's are being created with separate calls...creates a delay that is unacceptable.

#End Region
    End Class


End Namespace

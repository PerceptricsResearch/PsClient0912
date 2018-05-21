Imports MvcApplication2.AuthoringSvcNS
Imports System.Collections.ObjectModel
Imports System.Web.Mvc
Imports System.Web.Helpers

Public Class PCMJsonObject
    'this class is a PageContentModel that is JSON serializable...
    'It came about because the PageContentModel and PCElementModel don't serialize well with the default Javascript serializer...
    'this class is designed so that complete PageContentModels(with PCElementColxn) can be passed back and forth as JSON objects..

    Public Sub New()
        'default constructor needed for json serialization...
    End Sub

    Public Sub New(_pcm As PageContentModel, _surveyid As Integer)
        'pass a pcm to be serialized/deserialized to this constructor...
        If Not IsNothing(_pcm) Then
            Me.PopulateProperties(_pcm, _surveyid)
        End If
    End Sub

    Private Sub PopulateProperties(_pcm As PageContentModel, _surveyid As Integer)
        With _pcm
            Me.SurveyID = _surveyid
            Me.PgNumber = .PgNumber
            Me.pcmSdsID = .SDS_ID
            Me.PagesCount = .PagesCount
            Me.PermanentGuidString = .PermanentGuidString
            If Not IsNothing(.PCElementsColxn) Then
                Me.PCElementsColxn = .PCElementsColxn.Select(Function(pce) New PCElemJsonObject(pce))
            End If
        End With

    End Sub

    Public Function ToPCM() As PageContentModel
        Dim rslt As New PageContentModel
        With rslt
            .SDS_ID = Me.pcmSdsID
            .PgNumber = Me.PgNumber
            .PermanentGuidString = Me.PermanentGuidString
            .PCElementsColxn = Me.PCElementsColxn.Select(Function(pcejo) pcejo.ToPCElement).ToList
        End With
        Return rslt
    End Function
    Public Function ToPagePackage() As Page_Package
        Try
            'Dim pcm = Me.ToPCM
            '<PIM> PgItemModelPkg
            'Dim xpcm = pcm
            'Dim pgitemmdl As PageItemModel = Nothing
            'pgitemmdl = New PageItemModel With {.PageNumber = Me.PgNumber, .PageContentModel_SDSID = Me.pcmSdsID}
            ' Dim pn = Me.MySurveyModel.PgContentViewsPColxnView.IndexOf(pcm)
            Dim tguid = Guid.Parse(Me.PageItemModel.MyGuidStr)
            Me.PageItemModel.MyGuidStr = tguid.ToString("N")
            Dim pimPkg As New AuthoringSvcNS.PgItemModel_Package With {._MyGuid = tguid, _
                                                                       ._PageNumber = Me.PageItemModel.PageNumber, _
                                                                       ._PIM = Json.Encode(Me.PageItemModel), _
                                                                       ._PIM_SDSID = Me.PageItemModel.SdsID} '/>
            '<PCElement_Pkg_Colxn
            Dim PcElem_PkgColxn As New ObservableCollection(Of AuthoringSvcNS.PCElement_Package)
            If Not IsNothing(Me.PCElementsColxn) Then
                For Each pcElem In Me.PCElementsColxn '.Where(Function(pce) Not pce.PresenterType.Equals(GetType(StylablePageContentView)))

                    'pcElem.DIModel.BorderVisibility = Windows.Visibility.Collapsed
                    If Not IsNothing(pcElem.MyGuidStr) Then
                        pcElem.MyGuid = Guid.Parse(pcElem.MyGuidStr)
                    End If
                    Dim pcelemPkg As New AuthoringSvcNS.PCElement_Package With {._MyGuid = Guid.Parse(pcElem.MyGuidStr), _
                                                                             ._PCE = Json.Encode(pcElem), _
                                                                             ._PCE_SDSID = pcElem.pcelemSdsID}
                    PcElem_PkgColxn.Add(pcelemPkg)
                Next '/>
            End If
            '<PCM> PageContentModel
            'Me.PgNumber = _PgNumber
            If IsNothing(Me.PermanentGuidString) Then
                Me.PermanentGuidString = Guid.NewGuid.ToString("N")
            End If
            Me.PCElementsColxn = New List(Of PCElemJsonObject) 'so we don't duplicate the PCElements
            Dim pcmPkg As New AuthoringSvcNS.PgContentModel_Package With {._MyGuid = Guid.Parse(Me.PermanentGuidString), _
                                                                          ._PCM = Json.Encode(Me), _
                                                                          ._PCM_SDSID = Me.pcmSdsID} '/>
            '<Page_Package>
            Return New AuthoringSvcNS.Page_Package With {.PCElement_Pkg_Colxn = PcElem_PkgColxn, _
                                                         .PgContentModelPkg = pcmPkg, _
                                                         .PgItemModelPkg = pimPkg, _
                                                         .SurveyID = Me.SurveyID}
        Catch ex As Exception
            'MessageBox.Show("SaveSurveyPlatform.ToPage_Package reports..." & ex.Message)
            Return Nothing
        End Try
    End Function
    Public Function ToPagePackageXML() As Page_Package
        Try
            Dim pcm = Me.ToPCM
            '<PIM> PgItemModelPkg
            Dim xpcm = pcm
            Dim pgitemmdl As PageItemModel = Nothing
            pgitemmdl = New PageItemModel With {.PageNumber = pcm.PgNumber, .PageContentModel_SDSID = pcm.SDS_ID}
            ' Dim pn = Me.MySurveyModel.PgContentViewsPColxnView.IndexOf(pcm)
            Dim pimPkg As New AuthoringSvcNS.PgItemModel_Package With {._MyGuid = pgitemmdl.MyGuid, _
                                                                       ._PageNumber = _PgNumber, _
                                                                       ._PIM = XMLConverter(Of PageItemModel).ToXmlString(pgitemmdl), _
                                                                       ._PIM_SDSID = pgitemmdl.SDS_ID} '/>
            '<PCElement_Pkg_Colxn
            Dim PcElem_PkgColxn As New ObservableCollection(Of AuthoringSvcNS.PCElement_Package)
            For Each pcElem In pcm.PCElementsColxn '.Where(Function(pce) Not pce.PresenterType.Equals(GetType(StylablePageContentView)))

                'pcElem.DIModel.BorderVisibility = Windows.Visibility.Collapsed
                Dim pcelemPkg As New AuthoringSvcNS.PCElement_Package With {._MyGuid = pcElem.MyGuid, _
                                                                         ._PCE = XMLConverter(Of PageContentElement).ToXmlString(pcElem), _
                                                                         ._PCE_SDSID = pcElem.SDS_ID}
                PcElem_PkgColxn.Add(pcelemPkg)
            Next '/>

            '<PCM> PageContentModel
            pcm.PgNumber = _PgNumber
            Dim pcmPkg As New AuthoringSvcNS.PgContentModel_Package With {._MyGuid = pcm.Guid, _
                                                                          ._PCM = XMLConverter(Of PageContentModel).ToXmlString(pcm), _
                                                                          ._PCM_SDSID = pcm.SDS_ID} '/>
            '<Page_Package>
            Return New AuthoringSvcNS.Page_Package With {.PCElement_Pkg_Colxn = PcElem_PkgColxn, _
                                                         .PgContentModelPkg = pcmPkg, _
                                                         .PgItemModelPkg = pimPkg, _
                                                         .SurveyID = Me.SurveyID}
        Catch ex As Exception
            'MessageBox.Show("SaveSurveyPlatform.ToPage_Package reports..." & ex.Message)
            Return Nothing
        End Try
    End Function

    Public Property MyGuidStr As String
    Public Property PgNumber As Integer = 0
    Public Property pcmSdsID As Integer = 0
    Public Property PagesCount As Integer = 0
    Public Property PermanentGuidString = Nothing
    Public Property PCElementsColxn As List(Of PCElemJsonObject) = Nothing
    Public Property SurveyID As Integer = -1
    Public Property DesignerMetaData As DesignerMetaDataObject = Nothing
    Public Property PageItemModel As PIMJsonObject
    Public Property BehaviorsList As List(Of BehaviorItem) = Nothing
End Class
Public Class BehaviorItem
    Public Sub New()

    End Sub

    Public Property ID As String
    Public Property Method As String
    Public Property Context As String
    Public Property ObjectModel As String
End Class
Public Class PIMJsonObject
    Public Sub New()

    End Sub

    Public Property MyGuidStr As String
    Public Property PageNumber As String
    Public Property SdsID As String

End Class
Public Class IPNItem
    Public Property ipn As Integer = 0
    Public Property isDirty As Boolean = False
    Public Property pgItemPgNumberstring As String = 0
    Public Property pgItemSdsId As Integer = -1
    Public Property pcmsdsid As Integer = -1
    Public Property urlpgnum As String = 0
    Public Property pcmcolxnNdx As String = 0
    Public Property isundone As Boolean = False
End Class
Public Class DesignerMetaDataObject
    Public Property LastRMKey1 As Integer = 0
    Public Property IPNColxn As Dictionary(Of String, IPNItem)
End Class

Public Class PCElemJsonObject
    Public Sub New()
        'default constructor needed for json serialization...
    End Sub

    Public Sub New(_pce As PageContentElement)
        'pass a pagecontentelement to be serialized/deserialized to this constructor...
        If Not IsNothing(_pce) Then
            Me.PopulateProperties(_pce)
        End If


    End Sub

    Private Sub PopulateProperties(_pce As PageContentElement)
        With _pce
            Me.pcelemSdsID = .SDS_ID
            Me.PresenterTypeName = .DIModel.ContentType_Name.Split(".").LastOrDefault
            Me.pcmID = .PCMID
            Me.pcelemID = .PCMID
            Me.modelcore = New ModelCoreJson(_pce)
            'populate type specific properties
            Dim pcetype = Me.PresenterTypeName
            Select Case True
                Case pcetype = "StylablePageContentModel"
                    Me.PresenterTypeName = "prwTStylablePageContentModel"
                    Me.modelcore.presenterT = "prwTStylablePageContentModel"

                Case pcetype = "QuestOptionSetModel"
                    Me.PresenterTypeName = "prwTQuestOptionSet"
                    Me.modelcore.presenterT = "prwTQuestOptionSet"
                    Me.QuestOptSetModel = New QOptSetJson(_pce)
                    With CType(_pce.ViewModel, QuestOptionSetModel)
                        If .DesignerItemHeight = 0 Or Double.IsNaN(.DesignerItemHeight) Then
                            Me.modelcore.DesignerItemHeight = Me.modelcore.SizeToPct(85 * .UniGridRows, 768)
                        End If
                        If .DesignerItemWidth = 0 Or Double.IsNaN(.DesignerItemWidth) Then
                            If .UniGridRows > 1 Then
                                Me.modelcore.DesignerItemWidth = Me.modelcore.SizeToPct(307 * .UniGridColumns, 1366)
                            Else
                                Me.modelcore.DesignerItemWidth = Me.modelcore.SizeToPct(398 * .UniGridColumns, 1366)
                            End If
                        End If
                    End With

                Case pcetype = "IgnatzModel"
                    Me.PresenterTypeName = "prwTIgnatz"
                    Me.modelcore.presenterT = "prwTIgnatz"
                Case pcetype = "ImageModel"
                    Me.PresenterTypeName = "prwTImage"
                    Me.modelcore.presenterT = "prwTImage"
                Case Else
                    Dim dbgx = 2
            End Select
        End With

    End Sub

    Public Function ToPCElement() As PageContentElement
        Dim NewPCElem As New PageContentElement
        With NewPCElem
            .ViewModel = Me.CreateViewModel
            .DIModel = New DesignerItemModel With {.ContentType_Name = Me.PresenterTypeName,
                                                   .PCE_SDS_ID = Me.pcelemSdsID,
                                                   .DI_CanvasLeft = Me.modelcore.DI_CanvasLeft,
                                                   .DI_CanvasTop = Me.modelcore.DI_CanvasTop,
                                                   .DI_CanvasZindex = Me.modelcore.DI_CanvasZindex,
                                                   .DesignerItemWidth = Me.modelcore.DesignerItemWidth,
                                                   .DesignerItemHeight = Me.modelcore.DesignerItemHeight,
                                                   .MyContent_PresenterIS_TypeName = Me.modelcore.presenterT}
            .PresenterTypeName = Me.PresenterTypeName
            .SDS_ID = Me.pcelemSdsID
            .PCMID = Me.pcmID
        End With
        Return NewPCElem
    End Function

    Public Function CreateViewModel() As Object
        Dim rslt As Object = Nothing
        Select Case True
            Case (Me.PresenterTypeName = "prwTStylablePageContentModel")
                rslt = New StylablePageContentModel With {.ImageUriString = Me.modelcore.ImageUriString,
                                                          .BackgroundStr = Me.modelcore.BackgroundStr,
                                                          .ForegroundStr = Me.modelcore.ForegroundStr,
                                                          .html = Me.modelcore.html}
                With CType(rslt, StylablePageContentModel)

                End With
            Case (Me.PresenterTypeName = "prwTQuestOptionSet")
                rslt = New QuestOptionSetModel With {.ImageUriString = Me.modelcore.ImageUriString,
                                                     .BackgroundStr = Me.modelcore.BackgroundStr,
                                                     .ForegroundStr = Me.modelcore.ForegroundStr,
                                                     .html = Me.modelcore.html}
                With CType(rslt, QuestOptionSetModel)
                End With
            Case (Me.PresenterTypeName = "prwTIgnatz")
                rslt = New IgnatzModel With {.ImageUriString = Me.modelcore.ImageUriString,
                                             .BackgroundStr = Me.modelcore.BackgroundStr,
                                             .ForegroundStr = Me.modelcore.ForegroundStr,
                                             .html = Me.modelcore.html}
                With CType(rslt, IgnatzModel)
                End With
            Case (Me.PresenterTypeName = "prwTImage")
                rslt = New ImageViewModel With {.ImageUriString = Me.modelcore.ImageUriString,
                                                .BackgroundStr = Me.modelcore.BackgroundStr,
                                                .ForegroundStr = Me.modelcore.ForegroundStr,
                                                .html = Me.modelcore.html}

                With CType(rslt, ImageViewModel)
                End With
        End Select
        If Not IsNothing(rslt) Then

        End If
        Return rslt
    End Function

    Public Property MyGuid As Guid
    Public Property MyGuidStr As String
    Public Property pcelemID As Integer = 0
    Public Property pcelemSdsID As Integer = 0
    'Public Property SdsID As Integer = 0
    Public Property pcmID As Integer = 0
    'Public Property PCMID As Integer = 0
    Public Property PresenterTypeName As String = Nothing
    Public Property QuestOptSetModel As QOptSetJson = Nothing
    Public Property modelcore As ModelCoreJson = Nothing
    Public Property BehaviorsList As List(Of BehaviorItem) = Nothing
End Class

Public Class ModelCoreJson
    Public Sub New()

    End Sub

    Public Sub New(_pce As PageContentElement)
        'pass a pagecontentelement to be serialized/deserialized to this constructor...
        If Not IsNothing(_pce) Then
            Me.PopulateProperties(_pce)
        End If
    End Sub

    Public Sub New(_qoim As QuestOptionItemModel)
        If Not IsNothing(_qoim) Then
            With _qoim
                Me.DesignerItemHeight = .DesignerItemHeight.ToString
                Me.DesignerItemWidth = .DesignerItemWidth.ToString
                Me.DI_CanvasLeft = .DI_CanvasLeft.ToString
                Me.DI_CanvasTop = .DI_CanvasTop
                Me.DI_CanvasZindex = .DI_CanvasZindex
                Me.BackgroundStr = Me.ToBrushEnumerable(4, .ToRGBAColor(.Background))
                Me.ForegroundStr = .ToRGBAColor(.Foreground)
                Me.BorderBrushStr = .ToRGBAColor(.BorderBrush)
                Me.CheckBoxBackgroundStr = Me.ToBrushEnumerable(4, .ToRGBAColor(.CheckBoxBackground))
                Me.CheckBoxForegroundStr = Me.ToBrushEnumerable(5, .ToRGBAColor(.CheckBoxForeground))
                Me.CheckBoxBorderBrushStr = .ToRGBAColor(.CheckBoxBorderBrush)
                Me.CheckBoxSize = .CheckBoxSize.ToString
            End With
        End If
    End Sub

    Public Function SizeToPct(_val As Double, _base As Integer) As String
        Dim rslt = 100.0
        If Not Double.IsNaN(_val) Then
            If _base > 1 Then
                rslt = (_val / _base) * 100
            End If
        End If

        Return rslt.ToString '& "%"
    End Function

    Private Function ToBrushEnumerable(itemcnt, brushstr) As IEnumerable(Of String)
        Dim rslt As New List(Of String)
        For i = 0 To itemcnt - 1
            rslt.Add(brushstr)
        Next
        Return rslt.AsEnumerable
    End Function

    Private Sub PopulateProperties(_pce As PageContentElement)
        With _pce
            Me.presenterT = .DIModel.ContentType_Name
            Me.DesignerItemHeight = Me.SizeToPct(.DIModel.DesignerItemHeight, 768)
            Me.DesignerItemWidth = Me.SizeToPct(.DIModel.DesignerItemWidth, 1366)
            Me.DI_CanvasLeft = Me.SizeToPct(.DIModel.DI_CanvasLeft, 1366)
            Me.DI_CanvasTop = Me.SizeToPct(.DIModel.DI_CanvasTop, 768)
            Me.DI_CanvasZindex = .DIModel.DI_CanvasZindex.ToString
            Me.BackgroundStr = Me.ToBrushEnumerable(4, .ToRGBAColor(.ViewModel.Background))
            Me.ForegroundStr = .ToRGBAColor(.ViewModel.Foreground)
            Me.BorderBrushStr = .ToRGBAColor(.ViewModel.BorderBrush)
            Me.ImageUriString = .ImageURL
        End With
    End Sub
    Public Property presenterT As String = Nothing
    Public Property html As String = Nothing
    Public Property DesignerItemHeight As String
    Public Property DesignerItemWidth As String
    Public Property DI_CanvasTop As String
    Public Property DI_CanvasLeft As String
    Public Property DI_CanvasZindex As String
    Public Property Scale As String
    Public Property Rotation As String
    Public Property BackgroundBrushID As String
    Public Property BackgroundBrushUrl As String
    Public Property BackgroundStr As IEnumerable(Of String)
    Public Property BackgroundOpacity As String
    Public Property BackgroundVisibility As String
    Public Property ForegroundStr As String
    Public Property ImageUriString As String
    Public Property ImageOpacity As String
    Public Property ImageVisibility As String
    Public Property BorderBrushStr As String
    Public Property BorderThickness As String
    Public Property RTBHtml As String
    Public Property CheckBoxBackgroundStr As IEnumerable(Of String)
    Public Property CheckBoxBackgroundOpacity As String
    Public Property CheckBoxForegroundStr As IEnumerable(Of String)
    Public Property CheckBoxBorderBrushStr As String
    Public Property CheckBoxBorderThickness As String
    Public Property CheckBoxSize As String
    Public Property CheckBoxOnOffUrlStr As String
End Class

Public Class QOptSetJson
    Public Sub New()

    End Sub

    Public Sub New(_pce As PageContentElement)
        'pass a pagecontentelement to be serialized/deserialized to this constructor...
        If Not IsNothing(_pce) Then
            Me.PopulateProperties(_pce)
        End If
    End Sub
    Private Function ToBrushEnumerable(itemcnt, brushstr) As IEnumerable(Of String)
        Dim rslt As New List(Of String)
        For i = 0 To itemcnt - 1
            rslt.Add(brushstr)
        Next
        Return rslt.AsEnumerable
    End Function
    Private Sub PopulateProperties(_pce As PageContentElement)
        Dim xpcelemheight = 0
        Dim xpcelemwidth = 0
        If Not Double.IsNaN(_pce.DIModel.DesignerItemHeight) Then
            xpcelemheight = _pce.DIModel.DesignerItemHeight - 2
        End If
        If Not Double.IsNaN(_pce.DIModel.DesignerItemWidth) Then
            xpcelemwidth = _pce.DIModel.DesignerItemWidth - 2
        End If
        If Not IsNothing(_pce.ViewModel) Then
            If TypeOf _pce.ViewModel Is QuestOptionSetModel Then
                With CType(_pce.ViewModel, QuestOptionSetModel)
                    If xpcelemheight = 0 Then
                        xpcelemheight = 85 * .UniGridRows
                    End If
                    If xpcelemwidth = 0 Then
                        If .UniGridRows > 1 Then
                            xpcelemwidth = 307 * .UniGridColumns
                            'layoutmarginwidth = 0
                        Else
                            xpcelemwidth = 398 * .UniGridColumns
                            'layoutmarginwidth = 0
                        End If
                    End If
                    Me.UniGridColumns = .UniGridColumns
                    Me.UniGridRows = .UniGridRows
                    Dim qheight = xpcelemheight / Math.Max(1, .UniGridRows)
                    Dim qwidth = xpcelemwidth / Math.Max(1, .UniGridColumns)
                    For Each qoim In .ItemsObservableColxn
                        If Not qoim.DesignerItemHeight > 0 Or Not qoim.DesignerItemWidth > 0 Then

                            qoim.DesignerItemSize = New System.Windows.Size(qwidth, qheight)
                        End If
                    Next
                    Me.ItemsObservableColxn = .ItemsObservableColxn.Select(Function(qoim) New QOptItemJson(qoim, xpcelemwidth, xpcelemheight))
                End With
            End If
        End If
    End Sub

    Public Property AnswerRequired As Boolean
    Public Property UniGridColumns As String
    Public Property UniGridRows As String
    Public Property ItemsObservableColxn As IEnumerable(Of QOptItemJson)
    Public Property SelectorHeight As String
    Public Property SelectorWidth As String
    Public Property SelectorMarginTopBottom As String
    Public Property SelectorMarginRight As String
    Public Property OptionTextMarginLeft As String
    Public Property OptionTextWidth As String
    Public Property SvgDivClass As String
    Public Property QosprwtID As String
    Public Property BoxBackgroundBrushID As String
    Public Property BoxBackgroundBrushUrl As String
    Public Property RadioBtnOnBrushID As String
    Public Property RadioBtnOffBrushID As String
    Public Property RadioBtnVisible As String
    Public Property BoxVisible As String
    Public Property CheckVisible As String
    Public Property BehaviorsList As List(Of BehaviorItem) = Nothing
    Public Property Subscriptions As Object = Nothing
    Public Property Dispose As Object = Nothing
End Class

Public Class QOptItemJson
    Public Sub New()

    End Sub

    Public Sub New(_qoim As QuestOptionItemModel, xpceW As Double, xpceH As Double)
        If Not IsNothing(_qoim) Then
            Me.PopulateProperties(_qoim, xpceW, xpceH)
        End If
    End Sub

    Private Sub PopulateProperties(qoim As QuestOptionItemModel, xpceW As Double, xpceH As Double)
        Me.modelcore = New ModelCoreJson(qoim)
        Me.modelcore.presenterT = "QOptItem"
        Me.RespONSEModel = qoim.RespONSEModel
        Dim pctwidth = (xpceW / 1366) * 100
        Dim pctheight = (xpceH / 768) * 100
        Dim elemheight = (((qoim.DesignerItemHeight / 768)) * 100)
        Dim elemwidth = (((qoim.DesignerItemWidth / 1366)) * 100)
        Dim borderpcts = Me.ToBorder(elemwidth, elemheight, 4)
        Me.xxborderlr = borderpcts.Width & "%"
        Me.xxbordertb = borderpcts.Height & "%"
        Me.netborderH = (100 - (borderpcts.Height * 2)) & "%"
        Me.netborderW = (100 - (borderpcts.Width * 2)) & "%"
        Me.xxheight = (((qoim.DesignerItemHeight / 768) / (pctheight * 0.01)) * 100) & "%" 'qoim.DesignerItemHeight & "px"
        Me.xxwidth = (((qoim.DesignerItemWidth / 1366) / (pctwidth * 0.01)) * 100) & "%" 'qoim.DesignerItemWidth & "px"
        'Dim xxcheckbxwidth = (((qoim.CheckBoxSize / 1366) / (pctwidth * 0.01)) * 100) & "%" 'qoim.DesignerItemWidth & "px"
        Dim cboxmarginthickness = Me.ToBorder(elemwidth, elemheight, 4) 'has 3px border top and bottom
        Dim optiontextwidth = ((((qoim.DesignerItemWidth - qoim.CheckBoxSize - 21) / qoim.DesignerItemWidth)) * 100)
        Me.xxoptiontextwidth = optiontextwidth & "%"
        Dim checkbxheight = (((qoim.CheckBoxSize) / qoim.DesignerItemHeight) * 0.99) * 100
        Dim checkbxwidth = (((qoim.CheckBoxSize) / qoim.DesignerItemWidth) * 0.99) * 100
        Me.xxcheckbxmargins = ((100 - checkbxheight - cboxmarginthickness.Height) * 0.5) & "%"
        Me.xxcheckbxheight = checkbxheight & "%"
        Me.xxcheckbxwidth = (checkbxwidth) & "%" '((100 - optiontextwidth)) & "%"
        Me.xxcheckbxmarginright = 100 - checkbxwidth & "%"
        Me.xxoptiontextleft = (100 - optiontextwidth) & "%"
    End Sub
    Public Function ToBorder(_width As Double, _height As Double, _thickness As Double) As Windows.Size
        Dim h = (_width / _height) * _thickness
        Dim w = (_height / _width) * _thickness
        Return New Windows.Size(w, h)
    End Function

    Public Property QOptionItemText As String
    Public Property modelcore As ModelCoreJson
    Public Property RespONSEModel As RespONSEModel
    Public Property xxheight As String
    Public Property xxwidth As String
    Public Property netborderH As String
    Public Property netborderW As String
    Public Property xxborderlr As String
    Public Property xxbordertb As String
    Public Property xxcheckbxheight As String
    Public Property xxcheckbxwidth As String
    Public Property xxcheckbxmarginright As String
    Public Property xxcheckbxmargins As String
    Public Property checkboxvisibility As String
    Public Property xxoptiontextleft As String
    Public Property xxoptiontextwidth As String
    Public Property CheckBoxBackgroundStr As String
    Public Property CheckBoxForegroundStr As String
    Public Property CheckBoxBorderBrush As String
    Public Property Dispose As Object = Nothing
End Class
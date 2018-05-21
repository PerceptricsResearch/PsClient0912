Imports System.ComponentModel
Imports System.Collections.ObjectModel
Imports System.Windows.Data
Imports System.Collections.Specialized
Imports System.Xml.Serialization
Imports System.Runtime.Serialization
Imports System.Windows.Controls.Primitives
Imports MvcApplication2.AuthoringSvcNS
Imports System.ServiceModel
Imports MvcApplication2.ResultsSvcNS
Imports System.Windows.Media.Imaging
Imports System.Windows.Media

<XmlInclude(GetType(ResultsFilterModel)), XmlInclude(GetType(ResultsFilterElementModel)), XmlInclude(GetType(ResultsFilterInfoModel)), XmlInclude(GetType(ResultsSvcNS.ResultsFilterGroupObject))> _
Public Class ResultsFilterModel
    Implements IDisposable   'INotifyPropertyChanged,


#Region "PropertyChangedEvent"
    'Public Event PropertyChanged(ByVal sender As Object, ByVal e As PropertyChangedEventArgs) Implements INotifyPropertyChanged.PropertyChanged

    'Protected Sub My_OnPropertyChanged(ByVal propname As String) 'Overrides OnPropertyChanged
    '    RaiseEvent PropertyChanged(Me, New PropertyChangedEventArgs(propname))

    'End Sub
#End Region

    Public Sub RaisMyOnPropertyChanged(ByVal propname As String)
        'My_OnPropertyChanged(propname)
    End Sub

#Region "DeleteThisFilterEvent"
    'Public Event DeleteThisFilterEvent(ByVal sender As Object, ByVal e As EventArgs)
    'Public Sub RaiseDeleteThisFilterEvent()
    '    RaiseEvent DeleteThisFilterEvent(Me, New EventArgs)
    'End Sub
#End Region

    Public Sub New() 'xmlserializer needs a default constructor
        '_RsltsFilterElemPColxnView.GroupDescriptions.Add(New PropertyGroupDescription("GroupID"))
        '_RsltsFilterElemPColxnView.SortDescriptions.Add(New SortDescription("GroupID", ListSortDirection.Ascending))
    End Sub

    'Private MyRFGOColxn As ObservableCollection(Of ResultsSvcNS.ResultsFilterGroupObject)
    'Private Property RFEDxnry As Dictionary(Of String, ResultsFilterElementModel)

    '<XmlIgnore()> _
    'Public Property IsDirty As Boolean = False

    'Public ReadOnly Property IsDirtyRFEColxn As Boolean
    '    Get
    '        If Not IsNothing(Me.RsltsFilterElemColxn) Then
    '            Return Me.RsltsFilterElemColxn.Where(Function(rfe) rfe.IsDirty).Any
    '        Else
    '            Return False
    '        End If
    '    End Get
    'End Property
    'Private RsltsClient As ResultsServiceNS.ResultsSvcClient


    'Public ReadOnly Property HasUsableElements As Boolean
    '    Get
    '        If Not IsNothing(Me.RsltsFilterElemColxn) Then
    '            If Me.RsltsFilterElemColxn.Where(Function(rfe) rfe.IsPlaceholder = False).Count > 0 Then

    '                Return True
    '            Else
    '                Return False
    '            End If
    '        Else
    '            Return False
    '        End If
    '    End Get
    'End Property
    'Public Sub RefreshPieChartBoundProperties()
    '    ' Me.RDentCount = -1
    '    ' Me.PctIncludedDouble = 12
    '    ' My_OnPropertyChanged("PctIncluded")
    '    ' My_OnPropertyChanged("PctIncludedDouble")

    '    If Not IsNothing(Me.RPSO) Then
    '        Me.RDentCount = Me.RPSO.SelectedSurveyRDENTSCount
    '        'Me.PctIncludedDouble = Math.Round(Me.RDentCount / Me.AllRDentsCount, 3) * 100
    '        My_OnPropertyChanged("PctIncluded")
    '        'My_OnPropertyChanged("PctIncludedDouble")
    '        'Me.UpdatePieChartPieces()
    '        'Else
    '        '    Me.RDentCount = 0
    '    End If
    'End Sub
#Region "MakeMeActive"
    'Public Sub MakeMeActive()
    '    Try
    '        ' Me.RDentCount = 4
    '        If Me.FilterButtonsIsEnabled Then
    '            Me.IsActivated = True
    '            If Me.RefreshResults Then
    '                IsBusyService.SetIsBusy(True, "Retrieving results for " & Me.Name)
    '                'have we already built this observablecolxnofRFGO recently...???
    '                MyRFGOColxn = Me.ToObservableColxnofRFGO
    '                Dim rsc = CustomerMainControl.ResultsSvcClientNew 'CustomerMainControl.ResultsSvcClient 'As New ResultsServiceNS.ResultsSvcClient
    '                AddHandler rsc.RetrieveFilteredResults_with_ListofResultFilterGroupObjectCompleted, AddressOf RetrieveFilteredResults_with_ListofResultFilterGroupObjectCompleted
    '                rsc.RetrieveFilteredResults_with_ListofResultFilterGroupObjectAsync(Me.SurveyID, Me.MyRFGOColxn)
    '            Else
    '                ' Me.EnsureRFPieChartRunsSliceSizeAnimation()
    '                ResultsFilterService.ActiveFilterModel(Me.SurveyGuid.ToString) = Me.Guid.ToString
    '                IsBusyService.SetIsBusy(False)

    '            End If
    '        End If
    '    Catch ex As Exception
    '        MessageBox.Show("RFM.MakeMeActive reports... " & ex.Message)
    '    End Try


    'End Sub
#End Region

#Region "Retrieve FilteredResults Completed"
    'Private Sub RenewLoginSuccessful_with_ListofResultFilterGroupObject(ByVal sender As Object, ByVal e As EventArgs)
    '    RemoveHandler CustomerMainControl.RenewedLoginSuccess, AddressOf RenewLoginSuccessful_with_ListofResultFilterGroupObject
    '    IsBusyService.SetIsBusy(False)
    '    IsBusyService.SetIsBusy(True, "Loading Results for group...")
    '    Try
    '        Dim rsc = CustomerMainControl.ResultsSvcClientNew
    '        AddHandler rsc.RetrieveFilteredResults_with_ListofResultFilterGroupObjectCompleted, AddressOf RetrieveFilteredResults_with_ListofResultFilterGroupObjectCompleted
    '        rsc.RetrieveFilteredResults_with_ListofResultFilterGroupObjectAsync(Me.SurveyID, MyRFGOColxn)
    '    Catch ex As Exception
    '        MessageBox.Show("RenewLoginSuccessful_with_ListofResultFilterGroupObject reports..." & ex.Message)
    '    End Try

    'End Sub
    'Private Sub RetrieveFilteredResults_with_ListofResultFilterGroupObjectCompleted(ByVal sender As Object, ByVal e As ResultsSvcNS.RetrieveFilteredResults_with_ListofResultFilterGroupObjectCompletedEventArgs)
    '    Try
    '        If e.Error IsNot Nothing Then
    '            'IsBusyService.SetIsBusy(False)
    '            'Dim rslt = CustomerMainControl.SeemsMySvcEndPtsWereRetracted(e.Error)
    '            'If rslt Then
    '            '    AddHandler CustomerMainControl.RenewedLoginSuccess, AddressOf RenewLoginSuccessful_with_ListofResultFilterGroupObject
    '            'Else
    '            '    RemoveHandler CType(sender, ResultsSvcClient).RetrieveFilteredResults_with_ListofResultFilterGroupObjectCompleted, AddressOf RetrieveFilteredResults_with_ListofResultFilterGroupObjectCompleted
    '            '    IsBusyService.SetIsBusy(False)
    '            '    MessageBox.Show("Sorry, we could not reconnect your session to the cloud....please close your browser/tab and login again.")
    '            'End If
    '        Else

    '            RemoveHandler CType(sender, ResultsSvcClient).RetrieveFilteredResults_with_ListofResultFilterGroupObjectCompleted, AddressOf RetrieveFilteredResults_with_ListofResultFilterGroupObjectCompleted
    '            Me.DisposeRPSO()
    '            Me.RPSO = e.Result.FirstOrDefault

    '            If Not IsNothing(Me.RPSO) Then
    '                Me.RDentCount = Me.RPSO.SelectedSurveyRDENTSCount
    '                My_OnPropertyChanged("PctIncluded")
    '                'Me.UpdatePieChartPieces()
    '            Else
    '                Me.RDentCount = 0
    '            End If


    '            Me.LastQueryTime = Date.Now
    '            Me.RefreshResults = False

    '            'ResultsFilterService.ActiveFilterModel(Me.SurveyGuid.ToString) = Me.Guid.ToString
    '            'IsBusyService.SetIsBusy(False)


    '        End If
    '    Catch ex As Exception
    '        'MessageBox.Show("RFM.RetrieveFilteredResults_with_ListofResultFilterGroupObjectCompleted OuterTry reports..." & ex.Message)
    '        'IsBusyService.SetIsBusy(False)
    '    Finally
    '        'Close the RsltsSvcClient...
    '        'AddHandler CType(sender, ResultsSvcClient).CloseCompleted, AddressOf MyResultsSvcClientCloseHandler
    '        'CType(sender, ResultsSvcClient).CloseAsync()
    '    End Try
    'End Sub
    'Private Sub DisposeRPSO()
    '    If Not IsNothing(Me.RPSO) Then
    '        With Me.RPSO
    '            .AllSurveyRDENTSCount = Nothing
    '            If Not IsNothing(.QuestionRDENTCountColxn) Then
    '                .QuestionRDENTCountColxn.Clear()
    '                .QuestionRDENTCountColxn = Nothing
    '            End If
    '            If Not IsNothing(.ResultsDetailsList) Then
    '                For Each rd In .ResultsDetailsList
    '                    rd.LastCountTimeStamp = Nothing
    '                    rd.RespDentCount = Nothing
    '                    rd.RsltSummID = Nothing
    '                    rd.SDSRespModelID = Nothing
    '                Next
    '                .ResultsDetailsList.Clear()
    '                .ResultsDetailsList = Nothing
    '            End If
    '            .ResultsSummaryAddressKey = Nothing
    '            .ResultsSummarySurveyID = Nothing
    '            .ResultsSummaryID = Nothing
    '            .SelectedSurveyRDENTSCount = Nothing
    '        End With
    '        Me.RPSO = Nothing
    '    End If
    'End Sub

    'Public Sub MyResultsSvcClientCloseHandler(ByVal sender As Object, ByVal e As AsyncCompletedEventArgs)
    '    RemoveHandler CType(sender, ResultsSvcClient).CloseCompleted, AddressOf MyResultsSvcClientCloseHandler
    '    Try

    '        CType(sender, ResultsSvcClient).InnerChannel.Close()
    '        CType(sender, ResultsSvcClient).InnerChannel.Dispose()

    '    Catch ce As CommunicationException
    '        MessageBox.Show("RSandboxMdl.MyResultsSvcClientClose reports.." & ce.Message)
    '    Catch wx As WebException
    '        MessageBox.Show("RSandboxMdl.MyResultsSvcClientClose reports..WebEx..." & wx.Message)
    '    Catch ex As Exception
    '        MessageBox.Show("RSandboxMdl.MyResultsSvcClientClose reports.." & ex.Message)
    '    End Try
    '    GC.GetTotalMemory(True)
    '    'sender = Nothing
    '    'GC.Collect()
    '    'GC.WaitForPendingFinalizers()
    '    'GC.Collect()
    'End Sub
    'Private Sub UpdatePieChartPieces()
    '    'For Each pp In Me.PiePartsObservable
    '    '    pp.Dispose()
    '    'Next
    '    'Me.PiePartsObservable.Clear()
    '    'Me.PiePartsObservable.Add(New PiePart("% Included", Me.RDentCount) With {.DataContext = Me})
    '    'Me.PiePartsObservable.Add(New PiePart("% Not Included", Me.RDentsExcludedCount))
    '    My_OnPropertyChanged("PctIncluded")

    'End Sub
#End Region



#Region "ResultsFilterElementColxn and RFGO methods"
    'Public Sub AddRFElemToColxn(ByVal _rfe As ResultsFilterElementModel)
    '    Me.RFEDxnry = Me.RsltsFilterElemColxn.ToDictionary(Function(rfe) rfe.GroupID.ToString & rfe.PCVGuidString)
    '    Dim foundrfe As ResultsFilterElementModel = Nothing
    '    If Me.RsltsFilterElemColxn.ToDictionary(Function(rfe) rfe.GroupID.ToString & rfe.PCVGuidString).TryGetValue(_rfe.GroupID.ToString & _rfe.PCVGuidString, foundrfe) Then
    '        If Not foundrfe.Equals(_rfe) Then
    '            'MessageBox.Show("This filter row already contains an entry for this question...would you like to replace it?")
    '            Me.RsltsFilterElemColxn.Add(_rfe)
    '            Me.RsltsFilterElemColxn.Remove(foundrfe)
    '            foundrfe.Dispose()
    '            foundrfe = Nothing
    '            'Me.RsltsFilterElemPColxnView.Refresh()
    '        End If
    '    Else
    '        TryFindandRemoveGroupIDPlaceholderRFE(_rfe)
    '        Me.RsltsFilterElemColxn.Add(_rfe)
    '    End If
    '    Me.RefreshResults = True
    '    Me.LastQueryTime = Date.MinValue
    '    Me.RDentCount = Nothing
    '    Me.RPSO = Nothing
    '    ResultsFilterService.ActiveFilterModel(Me.SurveyGuid.ToString) = Nothing
    'End Sub

    'Private Sub TryFindandRemoveGroupIDPlaceholderRFE(ByVal _rfe As ResultsFilterElementModel)
    '    'this method removes a Placeholder_ResultsFilterElement when it is present...
    '    Dim placeholderRFElem = Me.RsltsFilterElemColxn.Where(Function(rfe) rfe.GroupID = _rfe.GroupID AndAlso rfe.IsPlaceholder).FirstOrDefault
    '    If Not IsNothing(placeholderRFElem) Then
    '        Me.RsltsFilterElemColxn.Remove(placeholderRFElem)
    '    End If
    'End Sub

    'Private Sub RFElement_DeleteME_Event_Handler(ByVal sender As Object, ByVal e As EventArgs)
    '    If Me.RsltsFilterElemColxn.Contains(sender) Then
    '        RemoveHandler CType(sender, ResultsFilterElementModel).RFElem_DeleteMe_Event, AddressOf RFElement_DeleteME_Event_Handler
    '        Me.RsltsFilterElemColxn.Remove(sender)

    '        Me.RefreshResults = True
    '        sender = Nothing
    '    End If
    'End Sub

    'Private Sub FilterElementColxn_CollectionChanged(ByVal sender As Object, ByVal e As NotifyCollectionChangedEventArgs) Handles _RsltsFilterElemColxn.CollectionChanged
    '    If e.NewItems IsNot Nothing AndAlso e.NewItems.Count > 0 Then
    '        For Each _rfe As ResultsFilterElementModel In e.NewItems
    '            AddHandler _rfe.RFElem_DeleteMe_Event, AddressOf RFElement_DeleteME_Event_Handler
    '        Next
    '        Me.RefreshResults = True
    '    End If

    '    If Me.RsltsFilterElemColxn.Count > 0 Then
    '        Me.FilterButtonsIsEnabled = True
    '    Else
    '        'also need to do something with RFGO list when the RFElemColxn gets empty...
    '        Me.FilterButtonsIsEnabled = False
    '    End If
    'End Sub

    'Public Function ToObservableColxnofRFGO() As ObservableCollection(Of ResultsSvcNS.ResultsFilterGroupObject)
    '    Dim rfgoColxn As New ObservableCollection(Of ResultsSvcNS.ResultsFilterGroupObject)
    '    For Each rfgo In ToListofRFGO()
    '        rfgoColxn.Add(rfgo)
    '    Next
    '    Return rfgoColxn
    'End Function

    'Public Function ToListofRFGO() As List(Of ResultsSvcNS.ResultsFilterGroupObject)
    '    Dim rfgolist As List(Of ResultsSvcNS.ResultsFilterGroupObject) = Nothing

    '    If Me.RsltsFilterElemPColxnView.Groups IsNot Nothing Then
    '        rfgolist = New List(Of ResultsSvcNS.ResultsFilterGroupObject)
    '        Dim grpndx As Integer = 0
    '        Dim groupsofRFEs = From gr In Me.RsltsFilterElemPColxnView.Groups _
    '                           Where CType(gr, CollectionViewGroup).Items.Count > 0 _
    '                           AndAlso (From rfe As ResultsFilterElementModel In CType(gr, CollectionViewGroup).Items _
    '                                    Where rfe.SelectedOptionIDList.Count > 0 Or rfe.SelectedQuestionIDList.Count > 0).Count > 0 _
    '                           Select gr
    '        For Each rfegroup As CollectionViewGroup In groupsofRFEs
    '            ' build an rfgo from this rfeggroup...
    '            Dim rfgo As New ResultsSvcNS.ResultsFilterGroupObject
    '            rfgo.OptionIDList = New ObservableCollection(Of Integer)
    '            rfgo.QuestionIDList = New ObservableCollection(Of Integer)
    '            rfgo.SurveyID = Me.SurveyID
    '            For Each rfe As ResultsFilterElementModel In rfegroup.Items
    '                If rfe.SelectedOptionIDList.Count = 0 Then 'rfe.SelectedQOptItemModelColxn
    '                    'Dim distinctquestid = From rm In rfe.ResponseModelColxn _
    '                    '                      Select rm.QuestID Distinct
    '                    For Each q In rfe.SelectedQuestionIDList
    '                        rfgo.QuestionIDList.Add(q)
    '                    Next
    '                Else
    '                    For Each iditem In rfe.SelectedOptionIDList 'rfe.SelectedQOptItemModelColxn
    '                        rfgo.OptionIDList.Add(iditem) 'qoim.RespONSEModel.ID)
    '                    Next
    '                End If
    '            Next
    '            rfgolist.Add(rfgo)
    '        Next
    '        groupsofRFEs = Nothing
    '        _RFGOList.Clear()
    '        _RFGOList = Nothing
    '        _RFGOList = rfgolist
    '    Else
    '        rfgolist = Me._RFGOList
    '    End If
    '    Return rfgolist
    'End Function
#End Region

    'Private ReadOnly Property RSM As ResultsSandboxModel
    '    Get
    '        If Application.Current.Resources.Contains("RSM" & Me.SurveyGuid.ToString) Then
    '            If Not IsNothing(Application.Current.Resources("RSM" & Me.SurveyGuid.ToString)) Then
    '                Return CType(Application.Current.Resources("RSM" & Me.SurveyGuid.ToString), RSMApp).RSM
    '            Else
    '                Return Nothing
    '            End If
    '        Else
    '            Return Nothing
    '        End If
    '    End Get
    'End Property

#Region "FromListOfRFGO_PopulateResultsFilterModel"
    'this method "rehydrates" resultsfilterelementmodels...from the rfgolist property below...
    'Public Sub FromListOfRFGO_PopulateResultsFilterModel()

    '    'Me.RsltsFilterElemColxn = New ObservableCollection(Of ResultsFilterElementModel) 'is already new in the constructor...
    '    For Each rfem In Me.RFEM_List.ToArray
    '        Dim rfempcmid = rfem.PCM_ID
    '        Dim pcm = Me.RSM.MySurveyModel.PageContentModelColxn.Where(Function(p) p.SDS_ID = rfempcmid).FirstOrDefault
    '        If pcm IsNot Nothing Then
    '            rfem.PCVGuidString = Me.RSM.MySurveyModel.PageContentModelColxn.Where(Function(p) p.SDS_ID = rfempcmid).First.Guid.ToString
    '            Me.RsltsFilterElemColxn.Add(rfem)
    '        Else
    '            Dim x = 2
    '        End If

    '        Me.RFEM_List.Remove(rfem)
    '    Next
    '    ' GetImgsForRFM()
    '    Me.RFEM_List.Clear()
    '    Me.RFEM_List = Nothing
    '    Me.RsltsFilterElemPColxnView.SortDescriptions.Add(New SortDescription("PgNumber", ListSortDirection.Ascending))

    '    'this takes the questions and optionitems in an RFGO and populates several properties in this class..."rehydrates" the resultfilterelemntscolxn in this model...
    '    'For Each rfgo In Me.RFGOList
    '    '    Dim xrfgo = rfgo
    '    '    Dim ndxofRfgo = Me.RFGOList.IndexOf(rfgo)
    '    '    'find the PageContentModels that host each questId...

    '    '    Dim pcmcolxn As ObservableCollection(Of PageContentModel) = _
    '    '    CustomerMainControl.GetSurveyModel(Me.SurveyGuid.ToString).MyResultsClientModel.PageContentModelColxn
    '    '    'CType(MyAppResource("ResultsSandboxModel" & Me.SurveyGuid.ToString), ResultsSandboxModel).PageContentModelColxn 'PageContentViewsColxn

    '    '    'If RFEM_List IsNot Nothing AndAlso RFEM_List.Count > 0 Then

    '    '    '    For Each rfe In RFEsBelongingToRFGO(rfgo)
    '    '    '        ' rfe.SelectedQOptItemsImageList = New List(Of Imaging.WriteableBitmap)
    '    '    '        rfe.GroupID = ndxofRfgo 'this is where we put the groupID back in the ResultsFilterElement...
    '    '    '        Me.RsltsFilterElemColxn.Add(rfe)
    '    '    '        'rfe.PgImage = pcm.PgImage
    '    '    '        If rfe.SelectedQOItemImageBitArrayList.Count > 1 Then
    '    '    '            MessageBox.Show("This rfe has more than one image in its SelectedQOItemImageBitArrayList")
    '    '    '        End If
    '    '    '        For Each img In rfe.SelectedQOItemImageBitArrayList 'this is a list...doesnot need to be...long time ago, considered storing image of each qoptionitem
    '    '    '            'img.ToWritableBitmap() 'this method also clears the byte array that contains the bitmap pixels...
    '    '    '            Array.Clear(img.WBMP_ByteArray, 0, img.WBMP_ByteArray.Length)
    '    '    '            img.WBMP_ByteArray = Nothing
    '    '    '            'rfe.SelectedQOptItemsImageList.Add(img.MyWBitmap)
    '    '    '        Next

    '    '    '        For Each questid In rfe.SelectedQuestionIDList
    '    '    '            Dim xquestid = questid
    '    '    '            rfe.PgImage = (From pcm In pcmcolxn _
    '    '    '                          Where pcm.SDS_ID = xquestid _
    '    '    '                          Select pcm.PgImage).FirstOrDefault
    '    '    '        Next
    '    '    '        Dim pcmid = rfe.PCM_ID
    '    '    '        Dim pcms = From pcm In pcmcolxn _
    '    '    '                  Where pcm.SDS_ID = pcmid _
    '    '    '                  Select pcm
    '    '    '        For Each pcm In pcms 'this is just one...
    '    '    '            rfe.PCVGuidString = pcm.Guid.ToString
    '    '    '            'Dim xrfelist = rfe.SelectedOptionIDList
    '    '    '            'Dim qoimodels = From qoi In pcm.QuestOptItemModelColxn _
    '    '    '            '                                   Where xrfelist.Contains(qoi.RespONSEModel.ID) _
    '    '    '            '                                   Select qoi
    '    '    '            'For Each qoim In qoimodels
    '    '    '            '    rfe.SelectedQOptItemModelColxn.Add(qoim)

    '    '    '            'Next

    '    '    '        Next
    '    '    '    Next
    '    '    'End If
    '    'Next

    'End Sub

    'this is done this way because RFE's are stored in the DB WITHOUT GroupID....we rehydrate the groups based upon "selectedQuestID/SelectedQuestOptionItemID"
    'Private Function RFEsBelongingToRFGO(ByVal _RFGO As ResultsServiceNS.ResultsFilterGroupObject) As List(Of ResultsFilterElementModel)
    '    Dim rslt As New List(Of ResultsFilterElementModel)
    '    Dim qoptionsonly = From rfe In RFEM_List _
    '               Where _RFGO.OptionIDList.Intersect(rfe.SelectedOptionIDList).Count = rfe.SelectedOptionIDList.Count _
    '               AndAlso rfe.SelectedOptionIDList.Count > 0 _
    '               Select rfe
    '    Dim questionsonly = From rfe In RFEM_List _
    '               Where _RFGO.QuestionIDList.Intersect(rfe.SelectedQuestionIDList).Count = rfe.SelectedQuestionIDList.Count _
    '               AndAlso rfe.SelectedOptionIDList.Count = 0 _
    '               Select rfe
    '    rslt.AddRange(qoptionsonly)
    '    rslt.AddRange(questionsonly)
    '    Return rslt
    'End Function
#End Region

#Region "GetImagesforRFM and RetrieveRFMImagesComplete"
    '    Private Property MyAuthSvcClient As AuthoringSvcClient
    '    Public Sub GetImgsForRFM() 'ByRef _RFM As Integer)
    '        If Me.ID > 0 Then 'id > 0 indicates a model stored on the DB...
    '            'If _RFM.PCElementsColxn.Where(Function(pce) TypeOf pce.ViewModel Is ImageViewModel).Any Then
    '            If IsNothing(Me.MyAuthSvcClient) Then
    '                Me.MyAuthSvcClient = Me.NewAuthSvcClient
    '            End If
    '            ' Dim asc = NewAuthSvcClient()
    '            AddHandler Me.MyAuthSvcClient.RetrieveResultsFilterModelImagesRFMIDCompleted, AddressOf RetrieveImageViewBitmapsComplete
    '            Me.MyAuthSvcClient.RetrieveResultsFilterModelImagesRFMIDAsync(Me.SurveyID, Me.ID)
    '            'End If
    '        End If

    '    End Sub
    '    Private Sub RetrieveImageViewBitmapsComplete(ByVal sender As Object, ByVal e As RetrieveResultsFilterModelImagesRFMIDCompletedEventArgs)
    '        RemoveHandler CType(sender, AuthoringSvcClient).RetrieveResultsFilterModelImagesRFMIDCompleted, AddressOf RetrieveImageViewBitmapsComplete
    '        ' Me.MyAuthSvcClient = Nothing
    '        If e.Result IsNot Nothing Then
    '            If Not IsNothing(e.Result.ImageStorePkgList) Then
    '                For Each img As ImageStorePackage In e.Result.ImageStorePkgList
    '                    Dim imgseqnumber = img.SeqNumber
    '                    If img.SeqNumber = -1 Then
    '                        Try
    '                            Me.InfoModel.SegmentImage = CustomerMainControl.PNGfromPNGByteArray(img.ByteArray)
    '                        Catch ex As Exception
    '                            Dim wb = New Imaging.WriteableBitmap(img.Width, img.Height)
    '                            Buffer.BlockCopy(img.ByteArray, 0, wb.Pixels, 0, img.ByteArray.Length)
    '                            Me.InfoModel.SegmentImage = CustomerMainControl.PNGFromWB(wb)
    '                        End Try
    '                    ElseIf img.SeqNumber > -1 Then
    '                        Dim rfelem = Me.RsltsFilterElemColxn.Where(Function(rfe) rfe.SequenceNumber = imgseqnumber).FirstOrDefault
    '                        If rfelem IsNot Nothing Then
    '                            Try
    '                                rfelem.SelectedRespMdls_Image = CustomerMainControl.PNGfromPNGByteArray(img.ByteArray)
    '                            Catch ex As Exception
    '                                Dim wb = New Imaging.WriteableBitmap(img.Width, img.Height)
    '                                Buffer.BlockCopy(img.ByteArray, 0, wb.Pixels, 0, img.ByteArray.Length)
    '                                rfelem.SelectedRespMdls_Image = CustomerMainControl.PNGFromWB(wb)
    '                            End Try
    '                        Else
    '                            Dim x = 2
    '                        End If
    '                    End If
    '                    img.ImageID = Nothing
    '                    img.ImgFormat = Nothing
    '                    img.PCMID = Nothing
    '                    img.SeqNumber = Nothing
    '                    img.SurveyID = Nothing
    '                    img.Width = Nothing
    '                    img.Height = Nothing
    '                    img.PermPCMGuidString = Nothing
    '                    img.ByteArray = Nothing
    '                    img = Nothing
    '                Next
    '                With e.Result.ImageStorePkgList
    '                    For i = .Count - 1 To 0 Step -1
    '                        .Item(i) = Nothing
    '                        .RemoveAt(i)
    '                    Next
    '                    .Clear()
    '                End With
    '                e.Result.ImageStorePkgList = Nothing
    '            End If

    '        End If
    '        'AddHandler CType(sender, AuthoringSvcClient).CloseCompleted, AddressOf MyAuthSvcCloseHandler
    '        'CType(sender, AuthoringSvcClient).CloseAsync()
    '    End Sub

    '    Public Sub UnloadImagesFromRFElems()
    '        If Me.ID > 0 Then
    '            If Not IsNothing(Me.RsltsFilterElemColxn) Then
    '                For Each rfe In Me.RsltsFilterElemColxn.Where(Function(rfelem) Not IsNothing(rfelem.SelectedRespMdls_Image) AndAlso Not (rfelem.IsDirty))
    '                    rfe.SelectedRespMdls_Image = Nothing
    '                Next
    '            End If
    '        End If
    '    End Sub

    '#Region "NewAuthSvcClient and PageAuthSvcClose, MyAuthSvcClose"
    '    Public Function NewAuthSvcClient() As AuthoringSvcClient
    '        Return CType(Application.Current.Resources("SCP"), ServerClientProvider).AuthorSvcClientNew
    '        ' Return CustomerMainControl.AuthorSvcClientNew
    '    End Function
    '    'Public Sub MyAuthSvcCloseHandler(ByVal sender As Object, ByVal e As EventArgs)
    '    '    RemoveHandler CType(sender, AuthoringSvcClient).CloseCompleted, AddressOf MyAuthSvcCloseHandler
    '    '    Try

    '    '        CType(sender, AuthoringSvcClient).InnerChannel.Close()
    '    '        CType(sender, AuthoringSvcClient).InnerChannel.Dispose()

    '    '    Catch ce As CommunicationException
    '    '        MessageBox.Show("RFM.MyAuthSvcClose reports.." & ce.Message)
    '    '    Catch wx As WebException
    '    '        MessageBox.Show("RFM.MyAuthSvcClose reports..WebEx..." & wx.Message)
    '    '    Catch ex As Exception
    '    '        MessageBox.Show("RFM.MyAuthSvcClose reports.." & ex.Message)
    '    '    End Try
    '    '    'sender = Nothing
    '    '    GC.Collect()
    '    '    GC.WaitForPendingFinalizers()
    '    '    GC.Collect()

    '    'End Sub
    '#End Region
#End Region




#Region "Properties"
    <XmlIgnore()> _
    Public Property IsAddedNew As Boolean = False

    <XmlIgnore()> _
    Public Property IsEditable As Boolean = True

    <XmlIgnore()> _
    Public Property IsActive As Boolean = False

    <XmlIgnore()> _
    Public Property IsDeleted As Boolean = False

    <XmlIgnore()> _
    Public Property IsDisplayable As Boolean = True

    <XmlIgnore()> _
    Public Property Guid() As Guid = Guid.NewGuid

    <XmlIgnore()> _
    Public Property IsRFMDirty As Boolean = False

    <XmlIgnore()> _
    Public Property RDentSetsList As List(Of RDentSet)

    <XmlIgnore()> _
    Public Property MessageOnGroupIcon As String = ""


    <XmlIgnore()> _
    Public Property GroupDefnViewURL As String = "" 'populated by Controller Method RetrieveResultsFilterModels....is the URL used to retrieve the HTML for Defining a ResultsFilterModel...
    <XmlIgnore()> _
    Public Property GroupResultsURL As String = "" 'populated by Controller Method RetrieveResultsFilterModels....is the URL used to retrieve results for this ResultsFilterModel...
    <XmlIgnore()> _
    Public Property IsShowRsltsBtn As Boolean = True
#Region "Serialized/Deserialized Properties...stored on ResultsProviderSvc database"
    'this guy gets serialized...and deserialized...
    Private _RFGOList As New List(Of ResultsSvcNS.ResultsFilterGroupObject)
    Public Property RFGOList() As List(Of ResultsSvcNS.ResultsFilterGroupObject)
        Get
            Return _RFGOList
        End Get
        Set(ByVal value As List(Of ResultsSvcNS.ResultsFilterGroupObject))
            _RFGOList = value
        End Set
    End Property

    Private _InfoModel As New ResultsFilterInfoModel(Me)
    Public Property InfoModel() As ResultsFilterInfoModel
        Get
            Return _InfoModel
        End Get
        Set(ByVal value As ResultsFilterInfoModel)
            _InfoModel = value
            'My_OnPropertyChanged("InfoModel")
        End Set
    End Property

    Private _Name As String
    Public Property Name() As String
        Get
            Return _Name
        End Get
        Set(ByVal value As String)
            _Name = value
            'My_OnPropertyChanged("Name")
        End Set
    End Property

    Private _ID As Integer = 0
    Public Property ID() As Integer
        Get
            Return _ID
        End Get
        Set(ByVal value As Integer)
            _ID = value
        End Set
    End Property

    Private _SurveyID As Integer = 0
    Public Property SurveyID() As Integer
        Get
            Return _SurveyID
        End Get
        Set(ByVal value As Integer)
            _SurveyID = value
        End Set
    End Property

    Private _RFEM_List As List(Of ResultsFilterElementModel)
    Public Property RFEM_List() As List(Of ResultsFilterElementModel)
        Get
            Return _RFEM_List
        End Get
        Set(ByVal value As List(Of ResultsFilterElementModel))
            _RFEM_List = value
        End Set
    End Property

    <XmlIgnore()> _
    Private _RsltPieChartBrushColor As String = "#FFFFD700" 'ColorfromHEx("#FFFFD700")
    <XmlIgnore()> _
    Public Property RsltsPieChartBrushColor() As String
        Get
            Return _RsltPieChartBrushColor
        End Get
        Set(ByVal value As String)
            _RsltPieChartBrushColor = value
            'My_OnPropertyChanged("RsltsPieChartBrushColor")
            'My_OnPropertyChanged("RsltsPieChartBrush")
            'My_OnPropertyChanged("RsltPieChartGradientBrush")
        End Set
    End Property
#End Region

    Private Function ColorfromHEx(ByVal hexaColor As String) As Color
        Return Color.FromArgb( _
            Convert.ToByte(hexaColor.Substring(1, 2), 16), _
            Convert.ToByte(hexaColor.Substring(3, 2), 16), _
            Convert.ToByte(hexaColor.Substring(5, 2), 16), _
            Convert.ToByte(hexaColor.Substring(7, 2), 16))

    End Function


#Region "XmlIgnore properties"
    'ALL XMLIGNORE past here...

    '<XmlIgnore()> _
    'Public Property IsInEditView As Boolean = False


    '<XmlIgnore()> _
    'Private _RsltPieChartGradientBrush As RadialGradientBrush = New RadialGradientBrush(Me.RsltsPieChartBrushColor, Colors.Black) With {.RadiusX = 2.5, _
    '                                                                                                                                    .RadiusY = 2.5, _
    '                                                                                                                                    .SpreadMethod = GradientSpreadMethod.Reflect, _
    '                                                                                                                                    .Opacity = 0.99, _
    '                                                                                                                                    .GradientOrigin = New Point(0.5, 0.5)}
    '<XmlIgnore()> _
    'Public ReadOnly Property RsltPieChartGradientBrush() As RadialGradientBrush
    '    Get
    '        _RsltPieChartGradientBrush.GradientStops(0).Color = Me.RsltsPieChartBrushColor
    '        _RsltPieChartGradientBrush.GradientStops(1).Offset = 0.99
    '        Return _RsltPieChartGradientBrush
    '    End Get
    '    'Set(ByVal value As Brush)
    '    '    _RsltPieChartBrush = value
    '    '    My_OnPropertyChanged("RsltsPieChartBrush")
    '    'End Set
    'End Property


    '<XmlIgnore()> _
    'Private _RsltPieChartBrush As SolidColorBrush = New SolidColorBrush(RsltsPieChartBrushColor)
    '<XmlIgnore()> _
    'Public ReadOnly Property RsltsPieChartBrush() As Brush
    '    Get
    '        _RsltPieChartBrush.Color = Me.RsltsPieChartBrushColor
    '        Return _RsltPieChartBrush
    '    End Get
    '    'Set(ByVal value As Brush)
    '    '    _RsltPieChartBrush = value
    '    '    My_OnPropertyChanged("RsltsPieChartBrush")
    '    'End Set
    'End Property




    '<XmlIgnore()> _
    'Private _IsActivated As Boolean
    '<XmlIgnore()> _
    'Public Property IsActivated() As Boolean
    '    Get
    '        Return _IsActivated
    '    End Get
    '    Set(ByVal value As Boolean)
    '        _IsActivated = value
    '        My_OnPropertyChanged("IsActivated")
    '    End Set
    'End Property

    '<XmlIgnore()> _
    'Private _RefreshResults As Boolean = True
    '<XmlIgnore()> _
    'Public Property RefreshResults() As Boolean
    '    Get
    '        Return _RefreshResults
    '    End Get
    '    Set(ByVal value As Boolean)
    '        _RefreshResults = value
    '    End Set
    'End Property
    '<XmlIgnore()> _
    'Private _SurveyGuid As Guid
    '<XmlIgnore()> _
    'Public Property SurveyGuid() As Guid
    '    Get
    '        Return _SurveyGuid
    '    End Get
    '    Set(ByVal value As Guid)
    '        _SurveyGuid = value
    '    End Set
    'End Property
    '<XmlIgnore()> _
    'Private _Guid As Guid = Guid.NewGuid
    '<XmlIgnore()> _
    'Public Property Guid() As Guid
    '    Get
    '        Return _Guid
    '    End Get
    '    Set(ByVal value As Guid)
    '        _Guid = value
    '    End Set
    'End Property
    '<XmlIgnore()> _
    'Private _RPSO As ResultsSvcNS.ResultsProviderSummaryObject
    '<XmlIgnore()> _
    'Public Property RPSO() As ResultsSvcNS.ResultsProviderSummaryObject
    '    Get
    '        Return _RPSO
    '    End Get
    '    Set(ByVal value As ResultsSvcNS.ResultsProviderSummaryObject)
    '        _RPSO = value
    '        My_OnPropertyChanged("RPSO")
    '    End Set
    'End Property
    '<XmlIgnore()> _
    'Private _PgImages_withStatsColxn As New ObservableCollection(Of PgImageStatsObject)
    '<XmlIgnore()> _
    'Public Property PgImages_withStatsColxn() As ObservableCollection(Of PgImageStatsObject)
    '    Get
    '        Return _PgImages_withStatsColxn
    '    End Get
    '    Set(ByVal value As ObservableCollection(Of PgImageStatsObject))
    '        _PgImages_withStatsColxn = value
    '        My_OnPropertyChanged("PgImages_withStatsColxn")
    '    End Set
    'End Property
    '<XmlIgnore()> _
    'Private WithEvents _RsltsFilterElemColxn As New ObservableCollection(Of ResultsFilterElementModel)
    '<XmlIgnore()> _
    'Public Property RsltsFilterElemColxn() As ObservableCollection(Of ResultsFilterElementModel)
    '    Get
    '        Return _RsltsFilterElemColxn
    '    End Get
    '    Set(ByVal value As ObservableCollection(Of ResultsFilterElementModel))
    '        _RsltsFilterElemColxn = value
    '        My_OnPropertyChanged("RsltsFilterElemColxn")
    '    End Set
    'End Property
    '<XmlIgnore()> _
    'Private _RsltsFilterElemPColxnView As New PagedCollectionView(_RsltsFilterElemColxn)
    '<XmlIgnore()> _
    'Public Property RsltsFilterElemPColxnView() As PagedCollectionView
    '    Get
    '        Return _RsltsFilterElemPColxnView
    '    End Get
    '    Set(ByVal value As PagedCollectionView)
    '        _RsltsFilterElemPColxnView = value
    '        My_OnPropertyChanged("RsltsFilterElemPColxnView")
    '    End Set
    'End Property

    '<XmlIgnore()> _
    'Private _PiePartsObservable As ObservableCollection(Of PiePart)
    '<XmlIgnore()> _
    'Public Property PiePartsObservable As ObservableCollection(Of PiePart)
    '    Get
    '        Return _PiePartsObservable
    '    End Get

    '    Set(ByVal value As ObservableCollection(Of PiePart))
    '        _PiePartsObservable = value
    '        My_OnPropertyChanged("PiePartsObservable")
    '    End Set
    'End Property
    ' Public Event RDentCountChanged(ByVal sender As Object, ByVal e As EventArgs)

    <XmlIgnore()> _
    Private _PctIncludedDouble As Double
    <XmlIgnore()> _
    Public Property PctIncludedDouble As Double
        Get
            Return _PctIncludedDouble
        End Get
        Set(ByVal value As Double)
            _PctIncludedDouble = value
        End Set
    End Property

    <XmlIgnore()> _
    Private _RDentCount As Double
    <XmlIgnore()> _
    Public Property RDentCount() As Double
        Get
            Return _RDentCount
        End Get
        Set(ByVal value As Double)
            _RDentCount = value
            'My_OnPropertyChanged("RDentCount")

            'My_OnPropertyChanged("PieChartTitle")
            'My_OnPropertyChanged("RDentsExcludedCount")
            'My_OnPropertyChanged("PctIncluded")
            'My_OnPropertyChanged("PctIncludedDouble")
            'My_OnPropertyChanged("RsltsPieChartBrush")
            'My_OnPropertyChanged("RsltPieChartGradientBrush")
            'RaiseEvent RDentCountChanged(Me, New EventArgs)
        End Set
    End Property

    <XmlIgnore()> _
    Private _AllRDentsCount As Integer = 0
    <XmlIgnore()> _
    Public Property AllRDentsCount As Integer
        Get
            Return _AllRDentsCount
        End Get
        Set(value As Integer)
            _AllRDentsCount = value
        End Set
    End Property

    '<XmlIgnore()> _
    'Public ReadOnly Property PieChartTitle As String
    '    Get
    '        If Me.AllRDentsCount > 0 Then
    '            Return Strings.FormatPercent(Me.RDentCount / Me.AllRDentsCount, 1) & " of All Respondents are in this Group"
    '        Else
    '            Return "Survey Has Zero Respondents"
    '        End If

    '    End Get
    'End Property

    '<XmlIgnore()> _
    'Public ReadOnly Property RDentsExcludedCount As Double
    '    Get
    '        Dim x = Me.AllRDentsCount - Me.RDentCount
    '        Return x
    '    End Get
    'End Property
    <XmlIgnore()> _
    Private _PctIncluded As String
    <XmlIgnore()> _
    Public Property PctIncluded As String
        Get
            Return _PctIncluded
        End Get
        Set(ByVal value As String)
            _PctIncluded = value
            'My_OnPropertyChanged("PctIncluded")
        End Set
    End Property



    '<XmlIgnore()> _
    'Private _LastQueryTime As DateTime
    '<XmlIgnore()> _
    'Public Property LastQueryTime() As DateTime
    '    Get
    '        Return _LastQueryTime
    '    End Get
    '    Set(ByVal value As DateTime)
    '        _LastQueryTime = value
    '        My_OnPropertyChanged("LastQueryTime")
    '    End Set
    'End Property
    '<XmlIgnore()> _
    'Private _FilterButtonsIsEnabled As Boolean = False
    '<XmlIgnore()> _
    'Public Property FilterButtonsIsEnabled() As Boolean
    '    Get
    '        Return _FilterButtonsIsEnabled
    '    End Get
    '    Set(ByVal value As Boolean)
    '        _FilterButtonsIsEnabled = value
    '        My_OnPropertyChanged("FilterButtonsIsEnabled")
    '    End Set
    'End Property
#End Region
#End Region

#Region "Dispose Stuff"
    Private disposedValue As Boolean = False        ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(ByVal disposing As Boolean)
        If Not Me.disposedValue Then
            If disposing Then
                ' TODO: free other state (managed objects).
                'RemoveHandler Me.DeleteThisFilterEvent, AddressOf RFElement_DeleteME_Event_Handler
                Try
                    'If Not IsNothing(Me.RFEDxnry) Then
                    '    With Me.RFEDxnry
                    '        .Clear()
                    '    End With
                    '    Me.RFEDxnry = Nothing
                    'End If

                    'Me._RsltPieChartBrush = Nothing
                    'Me._RsltPieChartGradientBrush = Nothing
                    'Me.LastQueryTime = Nothing

                    If Not IsNothing(Me.RFGOList) Then
                        With Me.RFGOList
                            For i = .Count - 1 To 0 Step -1
                                If Not IsNothing(.Item(i).OptionIDList) Then
                                    .Item(i).OptionIDList.Clear()
                                    .Item(i).OptionIDList = Nothing
                                End If
                                If Not IsNothing(.Item(i).QuestionIDList) Then
                                    .Item(i).QuestionIDList.Clear()
                                    .Item(i).QuestionIDList = Nothing
                                End If
                                .Item(i).SurveyID = Nothing
                                .Item(i) = Nothing
                                .RemoveAt(i)
                            Next
                            .Clear()
                        End With
                        Me.RFGOList = Nothing
                    End If

                    'If Not IsNothing(Me.RPSO) Then
                    '    With Me.RPSO
                    '        .AllSurveyRDENTSCount = Nothing
                    '        If Not IsNothing(.QuestionRDENTCountColxn) Then
                    '            .QuestionRDENTCountColxn.Clear()
                    '            .QuestionRDENTCountColxn = Nothing
                    '        End If
                    '        If Not IsNothing(.ResultsDetailsList) Then
                    '            For Each rd In .ResultsDetailsList
                    '                rd.LastCountTimeStamp = Nothing
                    '                rd.RespDentCount = Nothing
                    '                rd.RsltSummID = Nothing
                    '                rd.SDSRespModelID = Nothing
                    '            Next
                    '            .ResultsDetailsList.Clear()
                    '            .ResultsDetailsList = Nothing
                    '        End If
                    '        .ResultsSummaryAddressKey = Nothing
                    '        .ResultsSummarySurveyID = Nothing
                    '        .ResultsSummaryID = Nothing
                    '        .SelectedSurveyRDENTSCount = Nothing
                    '    End With
                    '    Me.RPSO = Nothing
                    'End If

                    'If Not IsNothing(Me.PgImages_withStatsColxn) Then
                    '    With Me.PgImages_withStatsColxn
                    '        For i = .Count - 1 To 0 Step -1
                    '            .Item(i).Dispose()
                    '            .Item(i) = Nothing
                    '            .RemoveAt(i)
                    '        Next
                    '        .Clear()
                    '    End With
                    '    Me.PgImages_withStatsColxn = Nothing
                    'End If

                    'If Not IsNothing(Me.MyRFGOColxn) Then
                    '    With Me.MyRFGOColxn
                    '        For i = .Count - 1 To 0 Step -1
                    '            If Not IsNothing(.Item(i).OptionIDList) Then
                    '                .Item(i).OptionIDList.Clear()
                    '                .Item(i).OptionIDList = Nothing
                    '            End If
                    '            If Not IsNothing(.Item(i).QuestionIDList) Then
                    '                .Item(i).QuestionIDList.Clear()
                    '                .Item(i).QuestionIDList = Nothing
                    '            End If

                    '            .Item(i).SurveyID = Nothing
                    '            .Item(i) = Nothing
                    '            .RemoveAt(i)
                    '        Next
                    '        .Clear()
                    '    End With
                    '    Me.MyRFGOColxn = Nothing
                    'End If

                    'RemoveHandler _RsltsFilterElemColxn.CollectionChanged, AddressOf FilterElementColxn_CollectionChanged
                    'If Not IsNothing(Me.RsltsFilterElemPColxnView) Then
                    '    Using Me.RsltsFilterElemPColxnView.DeferRefresh
                    '        Me.RsltsFilterElemPColxnView.GroupDescriptions.Clear()
                    '        Me.RsltsFilterElemPColxnView.SortDescriptions.Clear()
                    '    End Using
                    '    Me.RsltsFilterElemPColxnView = Nothing
                    'End If


                    'If Not IsNothing(Me.RsltsFilterElemColxn) Then
                    '    With Me.RsltsFilterElemColxn
                    '        For i = .Count - 1 To 0 Step -1
                    '            .Item(i).Dispose()
                    '            .Item(i) = Nothing
                    '            .RemoveAt(i)
                    '        Next
                    '        .Clear()
                    '    End With
                    '    Me.RsltsFilterElemColxn = Nothing
                    'End If

                    If Not IsNothing(Me.InfoModel) Then
                        Me.InfoModel.Dispose()
                        Me.InfoModel = Nothing
                    End If

                    Me.Name = Nothing

                    If Not IsNothing(Me.RFEM_List) Then
                        With Me.RFEM_List
                            For i = .Count - 1 To 0 Step -1
                                .Item(i).Dispose()
                                .Item(i) = Nothing
                                .RemoveAt(i)
                            Next
                            .Clear()
                        End With
                        Me.RFEM_List = Nothing
                    End If

                    'Me.Guid = Nothing
                    'Me.SurveyGuid = Nothing

                Catch ex As Exception
                    'MessageBox.Show("ResultsFilterModel.Dispose reports " & ex.Message)
                End Try
            End If

            ' TODO: free your own state (unmanaged objects).
            ' TODO: set large fields to null.

        End If
        Me.disposedValue = True
    End Sub
#End Region
#Region " IDisposable Support "
    ' This code added by Visual Basic to correctly implement the disposable pattern.
    Public Sub Dispose() Implements IDisposable.Dispose
        ' Do not change this code.  Put cleanup code in Dispose(ByVal disposing As Boolean) above.
        Dispose(True)
        GC.SuppressFinalize(Me)
    End Sub
#End Region



End Class

Public Class RDentSet
    Public Property SetID As Integer
    Public Property RFElemList As List(Of ResultsFilterElementModel)
    'these properties support undo/cancel operations on RDentSets...see client resultsgroupdefn.js and prweb.rfmsvc.js...
    Public Property IsModified As Boolean = False
    Public Property IsAddedNew As Boolean = False
    Public Property IsDeleted As Boolean = False
    Public Property HelpMessage As String = "Use the Edit button to select respondents. See the help section below for more."
    Public Property SetName As String
End Class
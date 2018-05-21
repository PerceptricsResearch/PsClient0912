Imports System.ComponentModel
Imports System.Windows.Markup

Imports System.Windows.Controls
Imports System.Windows.Media
Imports System.Xml.Serialization
Imports System.Runtime.Serialization
Imports System.Collections.ObjectModel
Imports System.Windows.Data
Imports System.Windows.Media.Imaging

Public Interface IPageContentModel
    Property PCElementsColxn() As List(Of PageContentElement)
End Interface


<XmlInclude(GetType(ImageViewModel)), XmlInclude(GetType(IgnatzModel)), XmlInclude(GetType(QuestOptionItemModel)), XmlInclude(GetType(QuestOptionSetModel)), XmlInclude(GetType(DesignerItemModel))> _
<DataContract()> _
Public Class PageContentModel

    Implements IPageContentModel, IGuidObject, IDisposable 'IFlowable3DItemModel, INotifyPropertyChanged,


#Region "IFlowable3DItemModel Implementation"
    '<XmlIgnore()> _
    'Private _Flow3DItemModel As Flow3DItemModel
    '<XmlIgnore()> _
    'Public Property Flow3DItemModel As Flow3DItemModel Implements IFlowable3DItemModel.Flow3DItemModel
    '    Get
    '        Return _Flow3DItemModel
    '    End Get
    '    Set(ByVal value As Flow3DItemModel)
    '        _Flow3DItemModel = value
    '        My_OnPropertyChanged("Flow3DItemModel")
    '    End Set
    'End Property
#End Region

    Private SuppressPropertyChanged As Boolean = False
#Region "Property Changed"
    'Public Event PropertyChanged As PropertyChangedEventHandler Implements INotifyPropertyChanged.PropertyChanged

    Protected Sub My_OnPropertyChanged(ByVal propname As String) 'Overrides OnPropertyChanged
        '' If Not Me.SuppressPropertyChanged Then
        'RaiseEvent PropertyChanged(Me, New PropertyChangedEventArgs(propname))
        ''End If

    End Sub
#End Region

    '#Region "StylablePageProperty"
    '    <XmlIgnore()> _
    '    Private _StylablePCVModel As StylablePageContentModel
    '    <XmlIgnore()> _
    '    Public Property StylablePCVModel As StylablePageContentModel
    '        Get
    '            If Not IsNothing(Me.PCElementsColxn) Then
    '                Me._StylablePCVModel = Me.PCElementsColxn.Where(Function(pce) TypeOf pce.ViewModel Is StylablePageContentModel).Select(Function(p) p.ViewModel).FirstOrDefault
    '            End If
    '            Return _StylablePCVModel
    '        End Get
    '        Set(ByVal value As StylablePageContentModel)
    '            _StylablePCVModel = value
    '            My_OnPropertyChanged("StylablePCVModel")
    '        End Set
    '    End Property
    '#End Region

    Public Sub New()

    End Sub

    <XmlIgnore()> _
    Public Property PagesCount As Integer

    <XmlIgnore()> _
    Public Property ResultsComputedRevLevel As Integer = -1

    <XmlIgnore()> _
    Public Property NormalEmail As String

#Region "IsAttachedSurvey Properties"
    <XmlIgnore()> _
    Private _IsAttachedSurveyPCM As Boolean = False
    <XmlIgnore()> _
    Public Property IsAttachedSurveyPCM() As Boolean
        Get
            Return _IsAttachedSurveyPCM
        End Get
        Set(ByVal value As Boolean)
            _IsAttachedSurveyPCM = value
        End Set
    End Property

    <XmlIgnore()> _
    Private _PCMID_AttachedTo As Integer = 0
    <XmlIgnore()> _
    Public Property PCMID_AttachedTo() As Integer
        Get
            Return _PCMID_AttachedTo
        End Get
        Set(ByVal value As Integer)
            _PCMID_AttachedTo = value
        End Set
    End Property

#End Region
    <XmlIgnore()> _
    Public IsPageAuthorDirty As Boolean = False

    <XmlIgnore()> _
    Public IsPageIconRetrieved As Boolean = False

    <XmlIgnore()> _
    Private _PageIconImage As BitmapImage
    <XmlIgnore()> _
    Public Property PageIconImage As BitmapImage
        Get
            Return _PageIconImage
        End Get
        Set(ByVal value As BitmapImage)
            _PageIconImage = value
            My_OnPropertyChanged("PageIconImage")
        End Set
    End Property

    <XmlIgnore()> _
    Public IsImagesRetrieved As Boolean = False


    <XmlIgnore()> _
    Private _PClxnVwIndex As Integer
    <XmlIgnore()> _
    Public Property PClxnVwIndex As Integer
        Get
            Return _PClxnVwIndex
        End Get
        Set(ByVal value As Integer)
            _PClxnVwIndex = value
            My_OnPropertyChanged("PClxnVwIndex")
        End Set
    End Property


    '<XmlIgnore()> _
    Private _pgNumber As Integer = 999
    '<XmlIgnore()> _
    Public Property PgNumber() As Integer
        Get
            Return _pgNumber
        End Get
        Set(ByVal value As Integer)
            _pgNumber = value
            My_OnPropertyChanged("PgNumber")
        End Set
    End Property

#Region "SurveyGuid, Guid and QuestOptItemsColxn Properties"
    <XmlIgnore()> _
    Public HasView As Boolean = False

    <XmlIgnore()> _
    Private _SurveyGuidString As String = Nothing
    <XmlIgnore()> _
    Public Property SurveyGuidString() As String
        Get
            Return _SurveyGuidString
        End Get
        Set(ByVal value As String)
            _SurveyGuidString = value
            My_OnPropertyChanged("SurveyGuid")
        End Set
    End Property

    <XmlIgnore()> _
    Private _Guid As Guid = Guid.NewGuid
    <XmlIgnore()> _
    Public Property Guid() As Guid Implements IGuidObject.MyGuid
        Get
            Return _Guid
        End Get
        Set(ByVal value As Guid)
            _Guid = value
            My_OnPropertyChanged("Guid")
        End Set
    End Property


    <XmlIgnore()> _
    Public ReadOnly Property QuestOptItemModelColxn() As IEnumerable(Of QuestOptionItemModel)
        Get
            'Dim allviewmdls = (From pce In Me.PCElementsColxn _
            '                    Select pce.ViewModel).ToList
            Dim allviewmdls = Me.PCElementsColxn.Where(Function(p) (TypeOf p.ViewModel Is QuestOptionSetModel) Or (TypeOf p.ViewModel Is IResponseModel)).Select(Function(pce) pce.ViewModel)
            Dim qosresident = From vm In allviewmdls.OfType(Of QuestOptionSetModel)(), qoi In vm.ItemsObservableColxn _
                              Select qoi
            Dim freeqoi = From vm In allviewmdls.OfType(Of QuestOptionItemModel)() _
                          Select vm

            Return qosresident.Union(freeqoi).AsEnumerable

        End Get
    End Property

    <XmlIgnore()> _
    Public ReadOnly Property IRespModelColxn() As IEnumerable(Of IResponseModel)
        Get
            Dim allviewmdls = Me.PCElementsColxn.Where(Function(p) (TypeOf p.ViewModel Is QuestOptionSetModel) Or (TypeOf p.ViewModel Is IResponseModel)).Select(Function(pce) pce.ViewModel) ').ToList
            Dim qosresident = From vm In allviewmdls.OfType(Of QuestOptionSetModel)(), qoi In vm.ItemsObservableColxn _
                              Select CType(qoi, IResponseModel)

            Return qosresident.Union(allviewmdls.OfType(Of IResponseModel))
        End Get

    End Property


#End Region


#Region "ResultsClient.ResultsFilter Support Properties"
    <XmlIgnore()> _
    Private _GroupID As Integer
    <XmlIgnore()> _
    Public Property GroupID() As Integer
        Get
            Return _GroupID
        End Get
        Set(ByVal value As Integer)
            _GroupID = value
            My_OnPropertyChanged("GroupID")
        End Set
    End Property

    Public ReadOnly Property HostedQuestionIDList() As List(Of Integer)
        Get
            'Dim rslt As List(Of Integer)
            Return (From qoi In Me.QuestOptItemModelColxn _
                    Where qoi.RespONSEModel IsNot Nothing _
                           Select CType(qoi.RespONSEModel.QuestID, Integer) Distinct).ToList
            'Return rslt
        End Get

    End Property
    Public ReadOnly Property HostedOptionIDList() As List(Of Integer)
        Get
            Return (From qoi In Me.QuestOptItemModelColxn _
                    Where qoi.RespONSEModel IsNot Nothing _
                           Select CType(qoi.RespONSEModel.ID, Integer) Distinct).ToList
        End Get
    End Property

#End Region

#Region "Properties"
    Private _PermanentGuidString As String = Nothing
    <DataMember()> _
    Public Property PermanentGuidString() As String
        Get
            Return _PermanentGuidString
        End Get
        Set(ByVal value As String)
            _PermanentGuidString = value
        End Set
    End Property
    Private _SDS_ID As Integer
    <DataMember()> _
    Public Property SDS_ID() As Integer Implements IGuidObject.MySDS_ID
        Get
            Return _SDS_ID
        End Get
        Set(ByVal value As Integer)
            _SDS_ID = value
        End Set
    End Property

    ''' <summary>
    ''' The Colxn of PageContentElements that appear on a page...as List(of PageContentElement)
    ''' </summary>
    ''' <remarks> </remarks>
    <XmlIgnore()> _
    Private _PCElementsColxnColxn As New List(Of PageContentElement)

    <XmlIgnore()> _
    Public Property PCElementsColxn() As List(Of PageContentElement) Implements IPageContentModel.PCElementsColxn
        Get
            If _PCElementsColxnColxn Is Nothing Then
                _PCElementsColxnColxn = New List(Of PageContentElement) 'required by DataContract.Deserialization...
            End If
            Return _PCElementsColxnColxn
        End Get
        Set(ByVal value As List(Of PageContentElement))
            _PCElementsColxnColxn = value
            My_OnPropertyChanged("PCElementsColxn")
        End Set
    End Property


    Private _HostingControlSize As System.Windows.Size
    Public Property HostingControlSize() As System.Windows.Size
        Get
            Return _HostingControlSize
        End Get
        Set(ByVal value As System.Windows.Size)
            _HostingControlSize = value
            My_OnPropertyChanged("HostingControlSize")
        End Set
    End Property
#End Region


#Region "IDisposable Support"
    Private disposedValue As Boolean ' To detect redundant calls
    Private lock As New Object
    ' IDisposable
    Protected Overridable Sub Dispose(ByVal disposing As Boolean)
        If Not Me.disposedValue Then
            If disposing Then

                Me.SuppressPropertyChanged = True
                ' TODO: dispose managed state (managed objects).
               
                SyncLock (CType(Me.PCElementsColxn, Collections.ICollection).SyncRoot)
                    If Me.PCElementsColxn.Count > 0 Then
                        For i = Me.PCElementsColxn.Count - 1 To 0 Step -1
                            Me.PCElementsColxn(i).Dispose()
                            Me.PCElementsColxn(i) = Nothing
                            Me.PCElementsColxn.RemoveAt(i)
                        Next
                    End If
                    'For Each pce In Me.PCElementsColxn
                    '    pce.Dispose()
                    '    pce = Nothing
                    'Next
                    Me.PCElementsColxn.Clear()
                    Me.PCElementsColxn = Nothing
                End SyncLock
                Me.SDS_ID = Nothing
                Me.PgNumber = Nothing
                Me.PClxnVwIndex = Nothing
                Me.PCMID_AttachedTo = Nothing
                Me.GroupID = Nothing
                Me.ResultsComputedRevLevel = Nothing
                Me.IsImagesRetrieved = Nothing

                Me.SurveyGuidString = Nothing
                Me.PermanentGuidString = Nothing
                Me.Guid = Nothing
                Me.HostingControlSize = Nothing
                ' Me.Flow3DItemModel = Nothing
                Me.PageIconImage = Nothing

                Me.lock = Nothing
            End If

            ' TODO: free unmanaged resources (unmanaged objects) and override Finalize() below.
            ' TODO: set large fields to null.
        End If
        Me.disposedValue = True
    End Sub

    ' TODO: override Finalize() only if Dispose(ByVal disposing As Boolean) above has code to free unmanaged resources.
    'Protected Overrides Sub Finalize()
    '    ' Do not change this code.  Put cleanup code in Dispose(ByVal disposing As Boolean) above.
    '    Dispose(False)
    '    MyBase.Finalize()
    'End Sub

    ' This code added by Visual Basic to correctly implement the disposable pattern.
    Public Sub Dispose() Implements IDisposable.Dispose
        ' Do not change this code.  Put cleanup code in Dispose(ByVal disposing As Boolean) above.
        Dispose(True)
        GC.SuppressFinalize(Me)
    End Sub
#End Region

End Class

Imports System.ComponentModel
Imports System.Collections.ObjectModel
Imports System.Xml.Serialization
Imports System.Windows.Media.Imaging

<XmlInclude(GetType(ResultsFilterElementModel))> _
Public Class ResultsFilterElementModel
    Implements IDisposable 'INotifyPropertyChanged,

    'Public Event PropertyChanged(ByVal sender As Object, ByVal e As PropertyChangedEventArgs) Implements INotifyPropertyChanged.PropertyChanged

    Protected Sub My_OnPropertyChanged(ByVal propname As String)
        'RaiseEvent PropertyChanged(Me, New PropertyChangedEventArgs(propname))

    End Sub

    Public Sub New() 'xmlserializer needs a default constructor

    End Sub

    'Public Event RFElem_DeleteMe_Event(ByVal sender As Object, ByVal e As System.EventArgs)
    'Public Sub DeleteME()
    '    RaiseEvent RFElem_DeleteMe_Event(Me, New EventArgs)
    'End Sub


    '    Get
    '        Return CustomerMainControl.GetPageNumber(Me.PCVGuidString, Me.SurveyGuidString)
    '    End Get
    'End Property

    <XmlIgnore()> _
    Public Property IsPlaceholder As Boolean = False

    <XmlIgnore()> _
    Public Property IsDirty As Boolean = False

#Region "Properties"
    '<XmlIgnore()> _
    'Private _SelectedRespMdls_Image As BitmapImage 'Imaging.WriteableBitmap
    '<XmlIgnore()> _
    'Public Property SelectedRespMdls_Image() As BitmapImage 'Imaging.WriteableBitmap
    '    Get
    '        Return _SelectedRespMdls_Image
    '    End Get
    '    Set(ByVal value As BitmapImage) 'Imaging.WriteableBitmap)
    '        _SelectedRespMdls_Image = value
    '        My_OnPropertyChanged("SelectedRespMdls_Image")
    '    End Set
    'End Property

    <XmlIgnore()> _
    Private _SequenceNumber As Integer
    Public Property SequenceNumber() As Integer
        Get
            Return _SequenceNumber
        End Get
        Set(ByVal value As Integer)
            _SequenceNumber = value
        End Set
    End Property

    <XmlIgnore()> _
    Private _PCM_ID As Integer
    Public Property PCM_ID() As Integer
        Get
            Return _PCM_ID
        End Get
        Set(ByVal value As Integer)
            _PCM_ID = value
        End Set
    End Property

    <XmlIgnore()> _
    Private _GroupID As Integer
    Public Property GroupID() As Integer
        Get
            Return _GroupID
        End Get
        Set(ByVal value As Integer)
            _GroupID = value
            My_OnPropertyChanged("GroupID")
        End Set
    End Property

    <XmlIgnore()> _
    Private _selectedQuestionIDList As New List(Of Integer)
    Public Property SelectedQuestionIDList() As List(Of Integer)
        Get
            Return _selectedQuestionIDList
        End Get
        Set(ByVal value As List(Of Integer))
            _selectedQuestionIDList = value
            My_OnPropertyChanged("SelectedQuestionIDList")
        End Set
    End Property

    <XmlIgnore()> _
    Private _selectedOptionIDList As New List(Of Integer)
    Public Property SelectedOptionIDList() As List(Of Integer)
        Get
            Return _selectedOptionIDList
        End Get
        Set(ByVal value As List(Of Integer))
            _selectedOptionIDList = value
        End Set
    End Property

    '<XmlIgnore()> _
    'Private _PgImage As Imaging.WriteableBitmap
    '<XmlIgnore()> _
    'Public Property PgImage() As Imaging.WriteableBitmap 'this should be readonly using PCMID...surveymodel.getpgimage using pcmid...
    '    Get
    '        Return _PgImage
    '    End Get
    '    Set(ByVal value As Imaging.WriteableBitmap)
    '        _PgImage = value
    '        My_OnPropertyChanged("PgImage")
    '    End Set
    'End Property

    <XmlIgnore()> _
    Private _SurveyGuidString As String
    <XmlIgnore()> _
    Public Property SurveyGuidString() As String
        Get
            Return _SurveyGuidString
        End Get
        Set(ByVal value As String)
            _SurveyGuidString = value
            My_OnPropertyChanged("SurveyGuidString")
        End Set
    End Property

    <XmlIgnore()> _
    Private _PCVGuidString As String
    <XmlIgnore()> _
    Public Property PCVGuidString() As String
        Get
            Return _PCVGuidString
        End Get
        Set(ByVal value As String)
            _PCVGuidString = value
            My_OnPropertyChanged("PCVGuidString")
        End Set
    End Property

    <XmlIgnore()> _
    Private _PgNumber As Integer
    <XmlIgnore()> _
    Public Property PgNumber As Integer
        Get
            Return _PgNumber
        End Get
        Set(ByVal value As Integer)
            _PgNumber = value
            My_OnPropertyChanged("PgNumber")
        End Set
    End Property
#End Region

    Private disposedValue As Boolean = False        ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(ByVal disposing As Boolean)
        If Not Me.disposedValue Then
            If disposing Then
                ' TODO: free other state (managed objects).
                'Me.SelectedRespMdls_Image = Nothing
                Me.SelectedQuestionIDList.Clear()
                Me.SelectedOptionIDList.Clear()
                Me.SurveyGuidString = Nothing
                Me.PCVGuidString = Nothing
                Me.PCM_ID = Nothing
            End If

            ' TODO: free your own state (unmanaged objects).
            ' TODO: set large fields to null.
           
            'Me.GroupID = Nothing
        End If
        Me.disposedValue = True
    End Sub

#Region " IDisposable Support "
    ' This code added by Visual Basic to correctly implement the disposable pattern.
    Public Sub Dispose() Implements IDisposable.Dispose
        ' Do not change this code.  Put cleanup code in Dispose(ByVal disposing As Boolean) above.
        Dispose(True)
        GC.SuppressFinalize(Me)
    End Sub
#End Region

End Class

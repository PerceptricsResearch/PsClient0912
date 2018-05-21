Imports System.ComponentModel
Imports System.Windows.Markup
Imports System.Xml.Serialization
Imports System.Runtime.Serialization

'<Serializable()> _
<DataContract()> _
Public Class PageItemModel
    Implements IGuidObject, IDisposable 'INotifyPropertyChanged,


    'Public Event PropertyChanged(ByVal sender As Object, ByVal e As PropertyChangedEventArgs) Implements INotifyPropertyChanged.PropertyChanged

    Protected Sub My_OnPropertyChanged(ByVal propname As String) 'Overrides OnPropertyChanged
        'RaiseEvent PropertyChanged(Me, New PropertyChangedEventArgs(propname))
    End Sub


    Public Sub New() 'Default constructor required by XMLSerialization

    End Sub

#Region "Properties"
    <XmlIgnore()> _
    Private _MyGuid As Guid = Nothing
    <XmlIgnore()> _
    Public Property MyGuid() As Guid Implements IGuidObject.MyGuid
        Get
            Return _MyGuid
        End Get
        Set(ByVal value As Guid)
            _MyGuid = value
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

    <XmlIgnore()> _
    Private _PageContentModel_Guid As Guid = Nothing
    <XmlIgnore()> _
    Public Property PageContentModel_Guid() As Guid
        Get
            Return _PageContentModel_Guid
        End Get
        Set(ByVal value As Guid)
            _PageContentModel_Guid = value
        End Set
    End Property

    Private _PageContentModel_SDSID As Integer
    Public Property PageContentModel_SDSID() As Integer
        Get
            Return _PageContentModel_SDSID
        End Get
        Set(ByVal value As Integer)
            _PageContentModel_SDSID = value
        End Set
    End Property

    Private _SurveyGuid As Guid
    <XmlIgnore()> _
    Public Property SurveyGuid() As Guid
        Get
            Return _SurveyGuid
        End Get
        Set(ByVal value As Guid)
            _SurveyGuid = value
        End Set
    End Property

    Private _SurveyName As String
    <DataMember()> _
    Public Property SurveyName() As String
        Get
            Return _SurveyName
        End Get
        Set(ByVal value As String)
            _SurveyName = value
            My_OnPropertyChanged("SurveyName")
        End Set
    End Property

    Private _Property1Value As String
    <DataMember()> _
    Public Property Property1Value() As String
        Get
            Return _Property1Value
        End Get
        Set(ByVal value As String)
            _Property1Value = value
            My_OnPropertyChanged("Property1Value")
        End Set
    End Property

    Private _PageNumber As String = "not set yet"
    <DataMember()> _
    Public Property PageNumber() As String
        Get
            Return _PageNumber
        End Get
        Set(ByVal value As String)
            _PageNumber = value
            My_OnPropertyChanged("PageNumber")
        End Set
    End Property

    Private _PageOptions As String = "no options set yet..." ' for now...would be some kind of object...e.g.,REQUIRES AN ANSWER...
    <DataMember()> _
    Public Property PageOptions() As String
        Get
            Return _PageOptions
        End Get
        Set(ByVal value As String)
            _PageOptions = value
            My_OnPropertyChanged("PageOptions")
        End Set
    End Property
#End Region

#Region "IDisposable Support"
    Private disposedValue As Boolean ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(ByVal disposing As Boolean)
        If Not Me.disposedValue Then
            If disposing Then
                ' TODO: dispose managed state (managed objects).
                Me.PageOptions = Nothing
                Me.PageNumber = Nothing
                Me.PageContentModel_Guid = Nothing
                Me.MyGuid = Nothing
                Me.Property1Value = Nothing
                Me.SurveyName = Nothing
                Me.SurveyGuid = Nothing
                Me.SDS_ID = Nothing
                Me.PageContentModel_SDSID = Nothing
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

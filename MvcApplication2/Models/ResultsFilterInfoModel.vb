Imports System.ComponentModel
Imports System.Xml.Serialization
Imports System.IO
Imports System.Windows.Media.Imaging


<XmlInclude(GetType(ResultsFilterInfoModel)), XmlInclude(GetType(Byte()))> _
Public Class ResultsFilterInfoModel
    Implements IDisposable 'INotifyPropertyChanged,

#Region "PropertyChanged"
    'Public Event PropertyChanged(ByVal sender As Object, ByVal e As PropertyChangedEventArgs) Implements INotifyPropertyChanged.PropertyChanged

    'Protected Sub My_OnPropertyChanged(ByVal propname As String) 'Overrides OnPropertyChanged
    '    RaiseEvent PropertyChanged(Me, New PropertyChangedEventArgs(propname))

    'End Sub
#End Region

    Public Sub New() 'xmlserializer needs a default constructor...

    End Sub
    Public Sub New(ByVal _RFModel As ResultsFilterModel)
        '_MyResultsFilterModel = _RFModel
        ''_MyResultsFilterModel.RDentCount

        ''Dim kvp As New KeyValuePair(Of String, Integer)("Part " & i.ToString, i * 20)
        ''AllRDentsPieSeries.Add(kvp)

    End Sub

    '<XmlIgnore()> _
    'Private _AllRDentsPieSeries As New List(Of KeyValuePair(Of String, Integer))
    '<XmlIgnore()> _
    'Public Property AllRDentsPieSeries() As List(Of KeyValuePair(Of String, Integer))
    '    Get
    '        Return _AllRDentsPieSeries
    '    End Get
    '    Set(ByVal value As List(Of KeyValuePair(Of String, Integer)))
    '        _AllRDentsPieSeries = value
    '        My_OnPropertyChanged("AllRDentsPieSeries")
    '    End Set
    'End Property


    '<XmlIgnore()> _
    'Private _MyResultsFilterModel As ResultsFilterModel
    '<XmlIgnore()> _
    'Public ReadOnly Property MyResultsFilterModel() As ResultsFilterModel
    '    Get
    '        Return _MyResultsFilterModel
    '    End Get
    'End Property

    Private _Description As String = "Enter description here..."
    Public Property Description() As String
        Get
            Return _Description
        End Get
        Set(ByVal value As String)
            _Description = value
            'My_OnPropertyChanged("Description")
        End Set
    End Property

    '<XmlIgnore()> _
    'Private _SegmentImage As BitmapImage 'Imaging.WriteableBitmap
    '<XmlIgnore()> _
    'Public Property SegmentImage() As BitmapImage 'Imaging.WriteableBitmap
    '    Get
    '        'If _SegmentImage Is Nothing Then
    '        '    If _SegmentImageByteArray IsNot Nothing Then
    '        '        _SegmentImage = Convert_Bytearray_toMediaImageingBitmapImage(_SegmentImageByteArray)
    '        '        '_BitmapImageforBinding.CreateOptions = Imaging.BitmapCreateOptions.IgnoreImageCache
    '        '    End If
    '        'End If
    '        Return _SegmentImage
    '    End Get
    '    Set(ByVal value As BitmapImage) 'Imaging.WriteableBitmap)
    '        _SegmentImage = value
    '        My_OnPropertyChanged("SegmentImage")
    '    End Set
    'End Property

    'Private _SegmentImageByteArray As Byte()
    'Public Property SegmentImageByteArray() As Byte()
    '    Get
    '        Return _SegmentImageByteArray
    '    End Get
    '    Set(ByVal value As Byte())
    '        _SegmentImageByteArray = value
    '    End Set
    'End Property
    'Private Shared Function Convert_Bytearray_toMediaImageingBitmapImage(ByVal byteArrayIn() As Byte) As System.Windows.Media.Imaging.BitmapImage
    '    Dim rslt As System.Windows.Media.Imaging.BitmapImage = Nothing
    '    Using ms = New MemoryStream(byteArrayIn)
    '        ms.Position = 0
    '        rslt = New System.Windows.Media.Imaging.BitmapImage
    '        rslt.SetSource(ms) 'Silverlight has this setsource method on bitmapimage...wpf doesn't
    '    End Using
    '    rslt.CreateOptions = Imaging.BitmapCreateOptions.None
    '    Return rslt
    'End Function

#Region "IDisposable Support"
    Private disposedValue As Boolean ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(ByVal disposing As Boolean)
        If Not Me.disposedValue Then
            If disposing Then
                ' TODO: dispose managed state (managed objects).
                '_AllRDentsPieSeries.Clear()
                '_AllRDentsPieSeries = Nothing
                'Me.SegmentImage = Nothing
                Me.Description = Nothing
                '_MyResultsFilterModel = Nothing

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

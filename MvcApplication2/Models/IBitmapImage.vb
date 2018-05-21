Imports System.Windows.Media.Imaging

Public Interface IBitmapImage
    Property ImgCacheObject As ImageCacheObject
    Property MyBitmapImagePNG As BitmapImage
    Property ImageUriString As String
    Property ImageOpacity As Double
End Interface
Public Class ImageCacheObject
    Implements IDisposable 'INotifyPropertyChanged,


#Region "PropertyChanged"
    'Public Event PropertyChanged(ByVal sender As Object, ByVal e As System.ComponentModel.PropertyChangedEventArgs) Implements INotifyPropertyChanged.PropertyChanged
    Protected Sub My_OnPropertyChanged(ByVal propname As String) 'Overrides OnPropertyChanged

        'RaiseEvent PropertyChanged(Me, New PropertyChangedEventArgs(propname))

    End Sub
#End Region

    Public Property PCMID As Integer
    Private _Image As BitmapImage
    Public Property Image As BitmapImage
        Get
            Return _Image
        End Get
        Set(ByVal value As BitmapImage)
            _Image = value
            My_OnPropertyChanged("Image")

        End Set
    End Property
    Public Property IsImageDirty As Boolean = False
    Public Property IsImageResolved As Boolean = False
    Public Property SurveyID As Integer

#Region "IDisposable Support"
    Private disposedValue As Boolean ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(ByVal disposing As Boolean)
        If Not Me.disposedValue Then
            If disposing Then
                ' TODO: dispose managed state (managed objects).
                Me.PCMID = Nothing
                Me.Image = Nothing
                Me.IsImageDirty = False
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
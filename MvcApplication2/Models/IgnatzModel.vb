Imports System.Xml.Serialization
Imports System.Runtime.Serialization
Imports System.ComponentModel
Imports System.Windows.Media.Imaging

<XmlInclude(GetType(IgnatzModel)), XmlInclude(GetType(ModelCore(Of IgnatzModel)))> _
<DataContract()> _
Public Class IgnatzModel
    Inherits ModelCore(Of IgnatzModel) 'implements Inotify....
    Implements IPresenterIS, IDisposable, IBitmapImage

    Public Sub New()
        'Me.Model = Me 'this sets the Model property on the ModelCore(of T) base class
    End Sub

#Region "IPresenterIS Implementation"
    'Public Function ToPageContentElement() As PageContentElement Implements IPresenterIS.ToPageContentElement 'this would get added to PageContentModel.PCEColxn
    '    Dim rslt As PageContentElement = Nothing
    '    rslt = New PageContentElement(Me)
    '    Return rslt
    'End Function

    <XmlIgnore()> _
    Public ReadOnly Property MyPresenterIS() As Type Implements IPresenterIS.MyPresenterIS
        Get
            Return GetType(IgnatzView)
        End Get

    End Property

    <XmlIgnore()> _
    Public Overloads Property IsDesignerItemHosted As Boolean Implements IPresenterIS.IsDesignerItemHosted
        Get
            Return MyBase.IsDesignerItemHosted
        End Get
        Set(ByVal value As Boolean)
            MyBase.IsDesignerItemHosted = value
        End Set
    End Property
    Public Overloads Property DesignerItemHeight() As Double Implements IPresenterIS.DesignerItemHeight
        Get
            Return MyBase.DesignerItemHeight
        End Get
        Set(ByVal value As Double)
            MyBase.DesignerItemHeight = value
            My_OnPropertyChanged("DesignerItemHeight")
        End Set
    End Property

    Public Overloads Property DesignerItemWidth() As Double Implements IPresenterIS.DesignerItemWidth
        Get
            Return MyBase.DesignerItemWidth
        End Get
        Set(ByVal value As Double)
            MyBase.DesignerItemWidth = value
            My_OnPropertyChanged("DesignerItemWidth")
        End Set
    End Property
    Public Overloads Property DI_CanvasLeft() As Double Implements IPresenterIS.DI_CanvasLeft
        Get
            Return MyBase.DI_CanvasLeft
        End Get
        Set(ByVal value As Double)
            MyBase.DI_CanvasLeft = value
            My_OnPropertyChanged("DI_CanvasLeft")
        End Set
    End Property
    Public Overloads Property DI_CanvasTop() As Double Implements IPresenterIS.DI_CanvasTop
        Get
            Return MyBase.DI_CanvasTop
        End Get
        Set(ByVal value As Double)
            MyBase.DI_CanvasTop = value
            My_OnPropertyChanged("DI_CanvasTop")
        End Set
    End Property
    Public Overloads Property DI_CanvasZindex() As Integer Implements IPresenterIS.DI_CanvasZindex
        Get
            Return MyBase.DI_CanvasZindex
        End Get
        Set(ByVal value As Integer)
            MyBase.DI_CanvasZindex = value
            My_OnPropertyChanged("DI_CanvasZindex")
        End Set
    End Property
    Public Overloads Property PlaneX As Double Implements IPresenterIS.PlaneX
        Get
            Return MyBase.PlaneX
        End Get
        Set(ByVal value As Double)
            MyBase.PlaneX = value
        End Set
    End Property
    Public Overloads Property PlaneY As Double Implements IPresenterIS.PlaneY
        Get
            Return MyBase.PlaneY
        End Get
        Set(ByVal value As Double)
            MyBase.PlaneY = value
        End Set
    End Property
    Public Overloads Property PlaneZ As Double Implements IPresenterIS.PlaneZ
        Get
            Return MyBase.PlaneZ
        End Get
        Set(ByVal value As Double)
            MyBase.PlaneZ = value
        End Set
    End Property
#End Region

#Region "IBitmapImage Implementation"
    <XmlIgnore()> _
    Private _ImgCacheObject As ImageCacheObject
    <XmlIgnore()> _
    Public Property ImgCacheObject As ImageCacheObject Implements IBitmapImage.ImgCacheObject
        Get
            Return _ImgCacheObject
        End Get
        Set(ByVal value As ImageCacheObject)
            _ImgCacheObject = value
            My_OnPropertyChanged("ImgCacheObject")
        End Set
    End Property
    Private _ImageUriString As String = Nothing
    Public Property ImageUriString As String Implements IBitmapImage.ImageUriString
        Get
            Return _ImageUriString
        End Get
        Set(ByVal value As String)
            _ImageUriString = value
            My_OnPropertyChanged("ImageUriString")
            My_OnPropertyChanged("MyBitmapImagePNG")
        End Set
    End Property

    <XmlIgnore()> _
    Private _MyBitmapImagePNG As BitmapImage
    <XmlIgnore()> _
    Public Property MyBitmapImagePNG As BitmapImage Implements IBitmapImage.MyBitmapImagePNG
        Get
            If Not IsNothing(Me.ImageUriString) Then
                Try
                    Return New BitmapImage(New Uri(Me.ImageUriString, UriKind.Absolute))
                Catch ex As Exception
                    'MessageBox.Show("IgnatzModel.Web Address for Image is not valid....")
                    Return _MyBitmapImagePNG
                End Try
            Else
                Return _MyBitmapImagePNG
            End If

        End Get
        Set(ByVal value As BitmapImage)
            _MyBitmapImagePNG = value
            My_OnPropertyChanged("MyBitmapImagePNG")
        End Set
    End Property

    Private _ImageOpacity As Double = 1.0
    Public Property ImageOpacity() As Double Implements IBitmapImage.ImageOpacity
        Get
            Return _ImageOpacity
        End Get
        Set(ByVal value As Double)
            _ImageOpacity = value
            'Background.Opacity = value
            My_OnPropertyChanged("ImageOpacity")
            'My_OnPropertyChanged("Background")
        End Set
    End Property
#End Region
#Region "Model Properties"
  
    Private _IgnatzDemoString As String = "Text here "
    <DataMember()> _
    Public Property IgnatzDemoString() As String
        Get
            Return _IgnatzDemoString
        End Get
        Set(ByVal value As String)
            _IgnatzDemoString = value
            MyBase.My_OnPropertyChanged("IgnatzDemoString")
        End Set
    End Property
    Private _Text As String = "Text here"
    <DataMember()> _
    Public Property Text() As String
        Get
            Return _Text
        End Get
        Set(ByVal value As String)
            _Text = value
            My_OnPropertyChanged("Text")
        End Set
    End Property
#End Region

    Private disposedValue As Boolean = False        ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(ByVal disposing As Boolean)
        If Not Me.disposedValue Then
            If disposing Then
                ' TODO: free other state (managed objects).
                Me.ImgCacheObject = Nothing
                Me.DerivedClassDisposing = True
                Me.MyBitmapImagePNG = Nothing
                Me.ImageOpacity = Nothing
                Me.ImageUriString = Nothing
                Me.Text = Nothing
                Me.IgnatzDemoString = Nothing
                'MyBase.RTBXaml = Nothing
                'MyBase.RTB_Background = Nothing
                'MyBase.Background = Nothing
                'MyBase.BorderBrush = Nothing
                'MyBase.CheckBoxBackground = Nothing
                'MyBase.CheckBoxBorderBrush = Nothing
                'MyBase.CheckBoxForeground = Nothing
                ''MyBase.CheckBoxMiddle = Nothing
                'MyBase.Foreground = Nothing
                'MyBase.Ignatz = Nothing
                'MyBase.FontName = Nothing
                MyBase.CoreDispose()
            End If

            ' TODO: free your own state (unmanaged objects).
            ' TODO: set large fields to null.

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
Public Class IgnatzView

End Class
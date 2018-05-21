Imports System.ComponentModel
Imports System.Runtime.Serialization
Imports System.Xml.Serialization
Imports System.IO
Imports System.Windows.Media.Imaging


<XmlInclude(GetType(ImageViewModel))> _
Public Class ImageViewModel
    Inherits ModelCore(Of ImageViewModel) 'ModelCore(Of T) takes care of Implements INotifyPropertyChanged.PropertyChanged
    Implements IPresenterIS, IDisposable, IBitmapImage ', IFlowable3DItemModel

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

    'Default Constructor Required by XMLSerializer...
    Public Sub New()

    End Sub

    'Public Overloads ReadOnly Property FontSize() As Double
    '    Get
    '        Return Nothing
    '    End Get
    'End Property

    'Public Overloads ReadOnly Property Foreground() As Brush
    '    Get
    '        Return MyBase.Foreground
    '    End Get
    'End Property
#Region "IPresenterIS Implementation"
    'Public Function ToPageContentElement() As PageContentElement Implements IPresenterIS.ToPageContentElement 'this would get added to PageContentModel.PCEColxn
    '    Dim rslt As PageContentElement = Nothing
    '    rslt = New PageContentElement(Me)
    '    Return rslt
    'End Function

    <XmlIgnore()> _
    Public ReadOnly Property MyPresenterIS() As Type Implements IPresenterIS.MyPresenterIS
        Get
            Return GetType(ImageView)
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
            Return _MyBitmapImagePNG
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

#Region "Properties"
    '<XmlIgnore()> _
    'Private _WBitMapForBinding As Imaging.WriteableBitmap
    '<XmlIgnore()> _
    'Public Property WBitMapForBinding() As Imaging.WriteableBitmap
    '    Get
    '        'If _WBitMapForBinding Is Nothing Then
    '        '    If _ICP IsNot Nothing AndAlso _ICP.ByteArraysColxn.Count > 0 Then
    '        '        _WBitMapForBinding = New WBInfoJet(_ICP.ByteArraysColxn(0)).SizedWritableBitmap(ResizeStuff.ImageConfig.Best)

    '        '        _ICP.ByteArraysColxn(0) = Nothing
    '        '        _ICP.ByteArraysColxn.Clear()
    '        '        Me.ICP = Nothing
    '        '        _ICP = Nothing

    '        '    End If
    '        'End If
    '        Return _WBitMapForBinding
    '    End Get
    '    Set(ByVal value As Imaging.WriteableBitmap)
    '        _WBitMapForBinding = value
    '        My_OnPropertyChanged("WBitMapForBinding")
    '    End Set
    'End Property



    <XmlIgnore()> _
    Private _ImageSourceFileName As String = ""
    <XmlIgnore()> _
    Public Property ImageSourceFileName() As String
        Get
            Return _ImageSourceFileName
        End Get
        Set(ByVal value As String)
            _ImageSourceFileName = value
            My_OnPropertyChanged("ImageSourceFileName")
        End Set
    End Property

#End Region

#Region "Dispose Stuff"
    Private disposedValue As Boolean = False        ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(ByVal disposing As Boolean)
        If Not Me.disposedValue Then
            If disposing Then
                ' TODO: free other state (managed objects).
                'If Not IsNothing(Me.ImgCacheObject) Then
                '    Me.ImgCacheObject.Dispose()
                '    Me.ImgCacheObject = Nothing
                'End If 'GetDisposed when the surveypageimagesCache.List is Disposed...
                Me.ImgCacheObject = Nothing
                Me.MyBitmapImagePNG = Nothing
                Me.ImageOpacity = Nothing
                'Me.WBitMapForBinding = Nothing
                'Me._WBitMapForBinding = Nothing
                Me.ImageSourceFileName = Nothing
                Me.ImageUriString = Nothing
                Me.DerivedClassDisposing = True
               
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
#End Region
End Class
Public Class ImageView

End Class
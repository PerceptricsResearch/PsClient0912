Imports System.Xml.Serialization
Imports System.ComponentModel
Imports System.Windows.Media.Imaging
Imports System.Collections.ObjectModel
Imports System.Windows.Media
Imports System.Windows

<XmlInclude(GetType(QuestOptionItemModel)), XmlInclude(GetType(ModelCore(Of QuestOptionItemModel)))> _
Public Class QuestOptionItemModel
    Inherits ModelCore(Of QuestOptionItemModel) 'implements Inotify....
    Implements IPresenterIS, IResponseModel, IDisposable, IBitmapImage


#Region "PieChart Support"
    Function PieSlicePath(ByVal cx As Integer, cy As Integer, r As Integer, startAngle As Double, endAngle As Double) As String
        Dim rad = Math.PI / 180
        Dim x1 = cx + r * Math.Cos(-startAngle * rad),
            x2 = cx + r * Math.Cos(-endAngle * rad),
            y1 = cy + r * Math.Sin(-startAngle * rad),
            y2 = cy + r * Math.Sin(-endAngle * rad)
        Dim isLargArc As Integer = 0
        If ((endAngle - startAngle) < -180.0) Then
            isLargArc = 1
        End If

        Return ("M" & " " & cx & " " & cy & " " & "L" & " " & x1 & " " & y1 & " " & "A" & " " & r & " " & r & " " & 0 & " " & isLargArc.ToString & " " & 1 & " " & x2 & " " & y2 & " " & "Z")
    End Function

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
                    'MessageBox.Show("QuestOptionItemModel.Web Address for Image is not valid....")
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

#Region "IPresenterIS implementation"
    Public ReadOnly Property MyPresenterIS() As System.Type Implements IPresenterIS.MyPresenterIS
        Get
            Return GetType(QuestOptionItemView)
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
        End Set
    End Property

    Public Overloads Property DesignerItemWidth() As Double Implements IPresenterIS.DesignerItemWidth
        Get
            Return MyBase.DesignerItemWidth
        End Get
        Set(ByVal value As Double)
            MyBase.DesignerItemWidth = value
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

    Public Sub New()
        'Me.Model = Me 'this sets the Model property on the ModelCore(of T) base class
    End Sub
    Public Enum SelectorConfigSetting As Integer
        DefaultConfiguration
        RadioButton
        NoSelector
    End Enum
    <XmlIgnore()> _
    Public Property IsInResultsView As Boolean


    Private _RsltPieChartGradientBrush As RadialGradientBrush = New RadialGradientBrush(Me.RsltsPieChartBrushColor, Colors.Black) With {.RadiusX = 2.5, _
                                                                                                                                       .RadiusY = 2.5, _
                                                                                                                                       .SpreadMethod = GradientSpreadMethod.Reflect, _
                                                                                                                                       .Opacity = 0.99, _
                                                                                                                                       .GradientOrigin = New Point(0.5, 0.5)}
    <XmlIgnore()> _
    Public ReadOnly Property RsltPieChartGradientBrush() As RadialGradientBrush
        Get

            If Not IsNothing(Me.RsltsPieChartBrushColor) Then
                _RsltPieChartGradientBrush.GradientStops(0).Color = Me.RsltsPieChartBrushColor
                _RsltPieChartGradientBrush.GradientStops(1).Offset = 0.99
            End If

            Return _RsltPieChartGradientBrush
        End Get
        'Set(ByVal value As Brush)
        '    _RsltPieChartBrush = value
        '    My_OnPropertyChanged("RsltsPieChartBrush")
        'End Set
    End Property
    <XmlIgnore()> _
    Private _RsltPieChartBrush As Brush = New SolidColorBrush(RsltsPieChartBrushColor)
    <XmlIgnore()> _
    Public Property RsltsPieChartBrush() As Brush
        Get

            _RsltPieChartBrush = Nothing
            If Not IsNothing(Me.RsltsPieChartBrushColor) Then
                _RsltPieChartBrush = New SolidColorBrush(RsltsPieChartBrushColor)
            End If
            Return _RsltPieChartBrush
        End Get
        Set(ByVal value As Brush)
            _RsltPieChartBrush = value
            My_OnPropertyChanged("RsltsPieChartBrush")
        End Set
    End Property
    <XmlIgnore()> _
    Private _RsltPieChartBrushColor As Color = ColorfromHEx("#FFFFD700")
    <XmlIgnore()> _
    Public Property RsltsPieChartBrushColor() As Color
        Get

            Return _RsltPieChartBrushColor
        End Get
        Set(ByVal value As Color)
            _RsltPieChartBrushColor = value
            My_OnPropertyChanged("RsltsPieChartBrushColor")
            My_OnPropertyChanged("RsltsPieChartBrush")
            My_OnPropertyChanged("RsltPieChartGradientBrush")
        End Set
    End Property

    Public Function ColorfromHEx(ByVal hexaColor As String) As Color
        Return Color.FromArgb( _
            Convert.ToByte(hexaColor.Substring(1, 2), 16), _
            Convert.ToByte(hexaColor.Substring(3, 2), 16), _
            Convert.ToByte(hexaColor.Substring(5, 2), 16), _
            Convert.ToByte(hexaColor.Substring(7, 2), 16))

    End Function
#Region "Model Properties"
    Private _RadioBtnGroup As String = ""
    Public Property RadioBtnGroup As String
        Get
            Return _RadioBtnGroup
        End Get
        Set(ByVal value As String)
            _RadioBtnGroup = value
            MyBase.My_OnPropertyChanged("RadioBtnGroup")
        End Set
    End Property

    Private _RadioBtnConfig As Visibility = Visibility.Collapsed
    Public Property RadioBtnConfig As Visibility
        Get
            Return _RadioBtnConfig
        End Get
        Set(ByVal value As Visibility)
            _RadioBtnConfig = value
            MyBase.My_OnPropertyChanged("RadioBtnConfig")
        End Set
    End Property
    Private _ChkBxConfig As Visibility = Visibility.Visible
    Public Property ChkBxConfig As Visibility
        Get
            Return _ChkBxConfig
        End Get
        Set(ByVal value As Visibility)
            _ChkBxConfig = value
            MyBase.My_OnPropertyChanged("ChkBxConfig")
        End Set
    End Property




    <XmlIgnore()> _
    Private _IsChecked As Boolean = False
    <XmlIgnore()> _
    Public Property IsChecked() As Boolean
        Get
            Return _IsChecked
        End Get
        Set(ByVal value As Boolean)
            _IsChecked = value
        End Set
    End Property


    ' Public Property SDS_ID_IRM As Integer = 0 Implements IResponseModel.SDS_ID_IRM

    Private _ReSPONSEModel As New RespONSEModel 'as respONSEModel = nothing
    Public Property RespONSEModel() As RespONSEModel Implements IResponseModel.RespONSEModel
        Get
            Return _ReSPONSEModel
        End Get
        Set(ByVal value As RespONSEModel)
            _ReSPONSEModel = value
            My_OnPropertyChanged("RespONSEModel")
        End Set
    End Property

    Private _SelectorConfiguration As SelectorConfigSetting = SelectorConfigSetting.DefaultConfiguration
    Public Property SelectorConfiguration() As SelectorConfigSetting
        Get
            Return _SelectorConfiguration
        End Get
        Set(ByVal value As SelectorConfigSetting)
            _SelectorConfiguration = value
            My_OnPropertyChanged("SelectorConfiguration")
        End Set
    End Property
    <XmlIgnore()> _
    Private _OptionItemObject As Object = Nothing 'will be some kind of PCE...so I know it is serialiazable
    <XmlIgnore()> _
    Public Property OptionItemObject() As Object 'default is a textbox
        Get
            Return _OptionItemObject
        End Get
        Set(ByVal value As Object)
            _OptionItemObject = value
            My_OnPropertyChanged("OptionItemObject")
        End Set
    End Property



    Private _QOptionItemText As String = "Option Text"
    Public Property QOptionItemText() As String
        Get
            Return _QOptionItemText
        End Get
        Set(ByVal value As String)
            _QOptionItemText = value
            MyBase.My_OnPropertyChanged("QOptionItemText")
        End Set
    End Property

    <XmlIgnore()> _
    Private _IgnatzDemoString As String = ""
    <XmlIgnore()> _
    Public Property IgnatzDemoString() As String
        Get
            Return _IgnatzDemoString
        End Get
        Set(ByVal value As String)
            _IgnatzDemoString = value
            MyBase.My_OnPropertyChanged("IgnatzDemoString")
        End Set
    End Property

#End Region



#Region " IDisposable Support "
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
                ' MyBase.RTBXaml = Nothing
                If Not IsNothing(Me.RespONSEModel) Then
                    ' Me.RespONSEModel.Dispose()
                    Me.RespONSEModel = Nothing
                End If
                Me.RadioBtnGroup = Nothing
                Me.RsltsPieChartBrushColor = Nothing
                Me._RsltPieChartGradientBrush = Nothing
                Me.RsltsPieChartBrush = Nothing
                Me.IgnatzDemoString = Nothing
                Me.QOptionItemText = Nothing
                Me.IsChecked = Nothing
                Me.IsDesignerItemHosted = Nothing
                Me.IsInResultsView = Nothing
                ' MyBase.RTBXaml = Nothing
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
    ' This code added by Visual Basic to correctly implement the disposable pattern.
    Public Sub Dispose() Implements IDisposable.Dispose
        ' Do not change this code.  Put cleanup code in Dispose(ByVal disposing As Boolean) above.
        Dispose(True)
        GC.SuppressFinalize(Me)
    End Sub
#End Region

End Class

Public Class QuestOptionItemView

End Class

Public Interface IResponseModel
    Property RespONSEModel() As RespONSEModel
    ' Property SDS_ID_IRM As Integer
End Interface


<XmlInclude(GetType(RespONSEModel))> _
Public Class RespONSEModel
    Implements IDisposable 'INotifyPropertyChanged,

    'Public Event PropertyChanged As PropertyChangedEventHandler Implements INotifyPropertyChanged.PropertyChanged
    ' Private SuppressPropertyChanged As Boolean = False
    Protected Sub My_OnPropertyChanged(ByVal propname As String) 'Overrides OnPropertyChanged
        ' If Not Me.SuppressPropertyChanged Then
        'If Not Me.disposedValue Then
        '    RaiseEvent PropertyChanged(Me, New PropertyChangedEventArgs(propname))
        'End If
        'End If



    End Sub
    Public Sub New()
        Me._RCnt = 0.0
        Me._NotSelectedRCnt = 0.0
        PopulatePiePiecesColxn() 'new gets called by author.Publish.....
    End Sub
    ''' <summary>
    ''' The DB.ID of the QuestOptionItemModel(or generically the IResponseModel) that is associated with this ResponseModel...
    ''' </summary>
    ''' <value></value>
    ''' <returns></returns>
    ''' <remarks>This is not populated when a survey is saved. Consumers of ResponseModel instances must populate this...</remarks>
    <XmlIgnore()>
    Public Property SDS_ID As Integer = 0

    <XmlIgnore()> _
    Public Property RsltsBrushColor As Color = Nothing

    <XmlIgnore()> _
    Public HasPiePieces As Boolean = False
    Public Sub PopulatePiePiecesColxn()
        'Me.ClearPiePiecesColxn()
        'Me.PiePiecesKVPColxn.Add(New PiePart("% Selected", Me._RCnt))
        'Me.PiePiecesKVPColxn.Add(New PiePart("% Not Selected", Me._NotSelectedRCnt)) '100 - instance.RespModel.PctOf_AllSurveyRDENTS))
        Me.HasPiePieces = True
    End Sub
    Public Sub ClearPiePiecesColxn()
        'For Each pp In Me.PiePiecesKVPColxn
        '    pp.DataContext = Nothing
        '    pp.Dispose()
        'Next
        'Me.PiePiecesKVPColxn.Clear()
        Me.HasPiePieces = False
    End Sub

#Region "Basic Properties"
    Private _ID As Integer 'String
    Public Property ID() As Integer 'String
        Get
            Return _ID
        End Get
        Set(ByVal value As Integer) 'String)
            _ID = value
        End Set
    End Property

    Private _QuestID As String
    Public Property QuestID() As String
        Get
            Return _QuestID
        End Get
        Set(ByVal value As String)
            _QuestID = value
        End Set
    End Property

    Private _Key1 As String
    Public Property Key1() As String
        Get
            Return _Key1
        End Get
        Set(ByVal value As String)
            _Key1 = value
        End Set
    End Property

    Private _Key2 As String
    Public Property Key2() As String
        Get
            Return _Key2
        End Get
        Set(ByVal value As String)
            _Key2 = value
        End Set
    End Property

    Private _Key3 As String
    Public Property Key3() As String
        Get
            Return _Key3
        End Get
        Set(ByVal value As String)
            _Key3 = value
        End Set
    End Property
#End Region

    '<XmlIgnore()> _
    'Private _PiePiecesKVPColxn As New ObservableCollection(Of PiePart)
    '<XmlIgnore()> _
    'Public Property PiePiecesKVPColxn() As ObservableCollection(Of PiePart)
    '    Get
    '        Return _PiePiecesKVPColxn
    '    End Get
    '    Set(ByVal value As ObservableCollection(Of PiePart))
    '        _PiePiecesKVPColxn = value
    '        My_OnPropertyChanged("PiePiecesKVPColxn")
    '    End Set
    'End Property


#Region "Statistics Properties"
    <XmlIgnore()> _
    Private _RCnt As String = Nothing
    <XmlIgnore()> _
    Public Property RCnt() As String
        Get
            Return _RCnt
        End Get
        Set(ByVal value As String)
            _RCnt = value
            'If Me.HasPiePieces Then
            '    Me.PiePiecesKVPColxn(0).Value = value
            'Else
            '    Me.PopulatePiePiecesColxn()
            '    Me.PiePiecesKVPColxn(0).Value = value
            'End If

            My_OnPropertyChanged("RCnt")
        End Set
    End Property
    <XmlIgnore()> _
    Private _NotSelectedRCnt As String = Nothing
    <XmlIgnore()> _
    Public Property NotSelectedRCnt() As String
        Get
            Return _NotSelectedRCnt
        End Get
        Set(ByVal value As String)
            _NotSelectedRCnt = value
            'If Me.HasPiePieces Then
            '    Me.PiePiecesKVPColxn(1).Value = value
            'Else
            '    Dim x = 2
            'End If

            My_OnPropertyChanged("NotSelectedRCnt")
        End Set
    End Property

    <XmlIgnore()> _
    Private _PctOf_AllSurveyRDENTS As Double
    <XmlIgnore()> _
    Public Property PctOf_AllSurveyRDENTS() As Double
        Get
            Return _PctOf_AllSurveyRDENTS
        End Get
        Set(ByVal value As Double)
            _PctOf_AllSurveyRDENTS = value
            My_OnPropertyChanged("PctOf_AllSurveyRDENTS")
        End Set
    End Property

    <XmlIgnore()> _
    Private _RCnt_AllSurveyRDENTS_AnsweringThisQuestion As Double
    <XmlIgnore()> _
    Public Property RCnt_AllSurveyRDENTS_AnsweringThisQuestion() As Double
        Get
            Return _RCnt_AllSurveyRDENTS_AnsweringThisQuestion
        End Get
        Set(ByVal value As Double)
            _RCnt_AllSurveyRDENTS_AnsweringThisQuestion = value
            My_OnPropertyChanged("RCnt_AllSurveyRDENTS_AnsweringThisQuestion")
        End Set
    End Property

    <XmlIgnore()> _
    Private _PctOf_AllSurveyRDENTS_AnsweringThisQuestion As Double
    <XmlIgnore()> _
    Public Property PctOf_AllSurveyRDENTS_AnsweringThisQuestion() As Double
        Get
            Return _PctOf_AllSurveyRDENTS_AnsweringThisQuestion
        End Get
        Set(ByVal value As Double)
            _PctOf_AllSurveyRDENTS_AnsweringThisQuestion = value
            My_OnPropertyChanged("PctOf_AllSurveyRDENTS_AnsweringThisQuestion")
        End Set
    End Property
#End Region

#Region "IDisposable Support"
    Private disposedValue As Boolean ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(ByVal disposing As Boolean)
        If Not Me.disposedValue Then
            If disposing Then
                ' Me.SuppressPropertyChanged = True
                ' TODO: dispose managed state (managed objects).
                Me.HasPiePieces = Nothing
                Me.ID = Nothing
                Me.Key1 = Nothing
                Me.Key2 = Nothing
                Me.Key3 = Nothing
                Me.NotSelectedRCnt = Nothing
                Me.PctOf_AllSurveyRDENTS = Nothing
                Me.PctOf_AllSurveyRDENTS_AnsweringThisQuestion = Nothing
                Me.QuestID = Nothing
                Me.RCnt = Nothing
                Me.RCnt_AllSurveyRDENTS_AnsweringThisQuestion = Nothing
                ' Me.SuppressPropertyChanged = Nothing
                'For Each pp In Me.PiePiecesKVPColxn
                '    pp.Dispose()
                'Next
                'Me.PiePiecesKVPColxn.Clear()
                'Me.PiePiecesKVPColxn = Nothing
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




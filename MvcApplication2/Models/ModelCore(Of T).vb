Imports System.Xml.Serialization
Imports System.ComponentModel
Imports System.Runtime.Serialization
Imports System.Windows.Media
Imports System.Windows

Public Interface IModel(Of T)
    'Property Model() As Object
    Property Background() As Brush
    Property Foreground() As Brush
    Property FontSize() As Double
    Property Opacity() As Double
    Property CheckBoxBackground() As Brush
    Property CheckBoxBorderBrush() As Brush
    'Event Configuration_Changed(ByVal sender As Object, ByVal e As RoutedEventArgs)
End Interface

<XmlInclude(GetType(ModelCore(Of IgnatzModel))), XmlInclude(GetType(SolidColorBrush)), XmlInclude(GetType(MatrixTransform))> _
Public Class ModelCore(Of T)
    Implements IModel(Of T) ', INotifyPropertyChanged


    'Inherits DependencyObject



    <XmlIgnore()> _
    Public Property DerivedClassDisposing As Boolean = False

    Public Sub CoreDispose()
        Me.IsDesignerItemHosted = Nothing
        Me.ResultsVisibility = Nothing

        Me.DesignerItemSize = Nothing
        Me.DI_CanvasLeft = Nothing
        Me.DI_CanvasTop = Nothing
        Me.DI_CanvasZindex = Nothing
        Me._FontFamily = Nothing
        Me.FontName = Nothing
        'Me.FontSize = Nothing
        Me.Ignatz = Nothing
        Me.Opacity = Nothing
        Me.PlaneX = Nothing
        Me.PlaneY = Nothing
        Me.PlaneZ = Nothing
        Me.RTB_Background = Nothing
        Me.RTB_FontStyle = Nothing
        Me.RTB_FontWeight = Nothing
        Me.RTB_TextAlignment = Nothing
        Me.RTBXaml = Nothing
        Me.Background = Nothing
        Me.Foreground = Nothing
        Me.BackgroundBrushColor = Nothing
        Me.BorderBrushColor = Nothing
        Me.BorderBrush = Nothing
        Me.ForegroundBrushColor = Nothing
        Me.CheckBoxSize = Nothing
        Me.BorderThickness = Nothing
        Me.CheckBoxBackground = Nothing
        Me.CheckBoxBorderBrush = Nothing
        Me.CheckBoxForeground = Nothing
        Me.CheckBoxSize = Nothing
        Me.DerivedClassDisposing = Nothing
        ' Me.Finalize()
    End Sub

    'Public Event PropertyChanged As PropertyChangedEventHandler Implements INotifyPropertyChanged.PropertyChanged

    Protected Sub My_OnPropertyChanged(ByVal propname As String) 'Overrides OnPropertyChanged

        'RaiseEvent PropertyChanged(Me, New PropertyChangedEventArgs(propname))
       

    End Sub

    <XmlIgnore()> _
    Public Property IsDesignerItemHosted As Boolean 'this gets bound to IsEnabled on PageContentElements in DesignerItems...
    <XmlIgnore()> _
    Public ReadOnly Property DesignerItemVisibility As Windows.Visibility
        Get
            If IsDesignerItemHosted Then
                Return Windows.Visibility.Visible
            Else
                Return Windows.Visibility.Collapsed
            End If
        End Get
    End Property

    'Public Event Configuration_Changed(ByVal sender As Object, ByVal e As RoutedEventArgs) Implements IModel(Of T).Configuration_Changed

    <XmlIgnore()> _
    Private _ResultsVisibility As Visibility = Visibility.Collapsed
    <XmlIgnore()> _
    Public Property ResultsVisibility() As Visibility
        Get
            Return _ResultsVisibility
        End Get
        Set(ByVal value As Visibility)
            _ResultsVisibility = value
            My_OnPropertyChanged("ResultsVisibility")
        End Set
    End Property

    '<XmlIgnore()> _
    'Private _Model As Object
    '<XmlIgnore()> _
    'Public Property Model() As Object Implements IModel(Of T).Model
    '    Get
    '        Return _Model
    '    End Get
    '    Set(ByVal value As Object)
    '        _Model = value
    '    End Set
    'End Property

#Region "Canvas attached properties, Size and other TBD stuff"
    Public Property DesignerItemHeight() As Double
        Get
            If DesignerItemSize.Height = 0 Then
                Return Double.NaN
            Else
                Return DesignerItemSize.Height
            End If
        End Get
        Set(ByVal value As Double)
            _DesignerItemSize.Height = value
            My_OnPropertyChanged("DesignerItemHeight")
        End Set
    End Property

    Public Property DesignerItemWidth() As Double
        Get
            If DesignerItemSize.Width = 0 Then
                Return Double.NaN
            Else
                Return DesignerItemSize.Width
            End If

        End Get
        Set(ByVal value As Double)
            _DesignerItemSize.Width = value
            My_OnPropertyChanged("DesignerItemWidth")
        End Set
    End Property

    Private _DesignerItemSize As System.Windows.Size '= New System.Windows.Size(1.0, 1.0)
    <DataMember()> _
    Public Property DesignerItemSize() As System.Windows.Size
        Get
            Return _DesignerItemSize
        End Get
        Set(ByVal value As System.Windows.Size)
            _DesignerItemSize = value
            My_OnPropertyChanged("DesignerItemSize")
        End Set
    End Property


    Private _DI_CanvasTop As Double
    <DataMember()> _
    Public Property DI_CanvasTop() As Double
        Get
            Return _DI_CanvasTop
        End Get
        Set(ByVal value As Double)
            _DI_CanvasTop = value
            My_OnPropertyChanged("DI_CanvasTop")
        End Set

    End Property
    Private _DI_CanvasLeft As Double
    <DataMember()> _
    Public Property DI_CanvasLeft() As Double
        Get
            Return _DI_CanvasLeft
        End Get
        Set(ByVal value As Double)
            _DI_CanvasLeft = value
            My_OnPropertyChanged("DI_CanvasLeft")
        End Set
    End Property

    Private _DI_CanvasZindex As Integer
    <DataMember()> _
    Public Property DI_CanvasZindex() As Integer
        Get
            Return _DI_CanvasZindex
        End Get
        Set(ByVal value As Integer)
            _DI_CanvasZindex = value
            My_OnPropertyChanged("DI_CanvasZindex")
        End Set
    End Property


    Private _ignatz As String = Nothing
    <DataMember()> _
    Public Property Ignatz() As String
        Get
            Return _ignatz
        End Get
        Set(ByVal value As String)
            _ignatz = value
        End Set
    End Property

#Region "ThreeD Properties"
    Private _PlaneX As Double = 0
    <DataMember()> _
    Public Property PlaneX As Double
        Get
            Return _PlaneX
        End Get
        Set(ByVal value As Double)
            _PlaneX = value
            My_OnPropertyChanged("PlaneX")
        End Set
    End Property
    Private _PlaneY As Double = 0
    <DataMember()> _
    Public Property PlaneY As Double
        Get
            Return _PlaneY
        End Get
        Set(ByVal value As Double)
            _PlaneY = value
            My_OnPropertyChanged("PlaneY")
        End Set
    End Property
    Private _PlaneZ As Double = 0
    <DataMember()> _
    Public Property PlaneZ As Double
        Get
            Return _PlaneZ
        End Get
        Set(ByVal value As Double)
            _PlaneZ = value
            My_OnPropertyChanged("PlaneZ")
        End Set
    End Property
#End Region
#End Region

#Region "Style Related Properties"
    'want these to be serializable...Brushes aren't...so want colors in the model 
    'need to chek on what fontsize and fore
    'ANOTHER IDEA: use Styles....put duplicates in SL port versions OR
    '              maybe serialize to xaml string....deserialize in SL with XamlReader to a Style object?
    'Private Sub createStyle()
    '    ''if i replace a style, all the other style attributes go away....
    '    'Dim s As New Style
    '    'Dim scb As New SolidColorBrush(Colors.Yellow)
    '    'Dim tb As New TextBox
    '    ''tb.Foreground is a brush
    '    ''scb.Color is a color
    '    's.Setters.Add(New Setter(TextBox.ForegroundProperty, scb))
    'End Sub

    Private _rgbaColor As String
    Public Property rgbaColor As String
        Get
            Return _rgbaColor
        End Get
        Set(value As String)
            _rgbaColor = value
        End Set
    End Property
    Public Function ToRGBAColor(_brush As Brush) As String
        Dim rslt As String = Nothing
        If IsNothing(_brush) Then
            _brush = New SolidColorBrush(ColorfromHEx("#33FFFFFF"))
        End If
        If Not IsNothing(_brush) Then
            With CType(_brush, SolidColorBrush)
                
                Dim op = Math.Min(.Color.ScA, .Opacity)
                With .Color
                    rslt = "rgba(" & .R.ToString & ", " & .G.ToString & ", " & .B.ToString & ", " & op.ToString & ")"
                End With
            End With

        End If
        Return rslt
    End Function

    Private _Opacity As Double = 1.0
    Public Property Opacity() As Double Implements IModel(Of T).Opacity
        Get
            Return _Opacity
        End Get
        Set(ByVal value As Double)
            _Opacity = value
            'Background.Opacity = value
            My_OnPropertyChanged("Opacity")
            'My_OnPropertyChanged("Background")
        End Set
    End Property


    'binding in xaml will be to a brush....
    'either need to bind the brush.color to this property or have a brush property for the binding
    'and then when color
    Public Property html As String = Nothing
    Public Property BackgroundStr As String
    Public Property ForegroundStr As String

    Private _BackgroundBrushColor As Color = ColorfromHEx("#33FFFFFF")
    Public Property BackgroundBrushColor() As Color
        Get
            Return _BackgroundBrushColor
        End Get
        Set(ByVal value As Color)
            _BackgroundBrushColor = value
            My_OnPropertyChanged("BackgroundBrushColor")
        End Set
    End Property

    Private _Background As Brush = New SolidColorBrush(_BackgroundBrushColor)
    '<XmlIgnore()> _

    Public Property Background() As Brush Implements IModel(Of T).Background
        Get
            Return _Background
        End Get
        Set(ByVal value As Brush)
            _Background = value
            My_OnPropertyChanged("Background")
        End Set
    End Property

    Private _ForegroundBrushColor As Color = Colors.Black
    Public Property ForegroundBrushColor() As Color
        Get
            Return _ForegroundBrushColor
        End Get
        Set(ByVal value As Color)
            _ForegroundBrushColor = value
            My_OnPropertyChanged("ForegroundBrushColor")
        End Set
    End Property

    Private _Foreground As Brush = New SolidColorBrush(_ForegroundBrushColor)
    '<XmlIgnore()> _
    Public Property Foreground() As Brush Implements IModel(Of T).Foreground
        Get
            Return _Foreground
        End Get
        Set(ByVal value As Brush)
            _Foreground = value
            My_OnPropertyChanged("Foreground")
        End Set
    End Property

    Private _FontName As String = "Arial"
    Public Property FontName() As String
        Get
            Return _FontName
        End Get
        Set(ByVal value As String)
            _FontName = value
            If Not IsNothing(value) Then
                _FontFamily = New FontFamily(value)
                My_OnPropertyChanged("FontName")
                My_OnPropertyChanged("FontFamily")
                My_OnPropertyChanged("FontSize")
            Else
                _FontFamily = Nothing
            End If

        End Set
    End Property

    <XmlIgnore()> _
    Private _FontFamily As New FontFamily(Me.FontName)
    <XmlIgnore()> _
    Public ReadOnly Property FontFamily() As FontFamily
        Get
            Return _FontFamily
        End Get
        'Set(ByVal value As FontFamily)
        '    _FontFamily = value
        '    My_OnPropertyChanged("FontFamily")
        'End Set
    End Property

    Private _FontSize As Double = 36
    Public Overridable Property FontSize() As Double Implements IModel(Of T).FontSize
        Get
            Return _FontSize
        End Get
        Set(ByVal value As Double)
            _FontSize = value
            My_OnPropertyChanged("FontSize")
        End Set
    End Property

    Private _BorderBrushColor As Color = ColorfromHEx("#AAFFFFFF")
    Public Property BorderBrushColor() As Color
        Get
            Return _BorderBrushColor
        End Get
        Set(ByVal value As Color)
            _BorderBrushColor = value
            My_OnPropertyChanged("BorderBrushColor")
        End Set
    End Property

    Private _BorderBrush As Brush = New SolidColorBrush(_BorderBrushColor)
    '<XmlIgnore()> _
    Public Property BorderBrush() As Brush
        Get
            Return _BorderBrush
        End Get
        Set(ByVal value As Brush)
            _BorderBrush = value
            My_OnPropertyChanged("BorderBrush")
        End Set
    End Property

    Private _BorderThickness As Thickness = New Thickness(3.0)
    Public Property BorderThickness() As Thickness
        Get
            Return _BorderThickness
        End Get
        Set(ByVal value As Thickness)
            _BorderThickness = value
            My_OnPropertyChanged("BorderThickness")
        End Set
    End Property
#End Region

#Region "CheckBox Properties"
    Private _CheckBoxBackground As Brush = New SolidColorBrush(Colors.White)
    Public Property CheckBoxBackground() As Brush Implements IModel(Of T).CheckBoxBackground
        Get
            Return _CheckBoxBackground
        End Get
        Set(ByVal value As Brush)
            _CheckBoxBackground = value

            My_OnPropertyChanged("CheckBoxBackground")
            'My_OnPropertyChanged("CheckBoxMiddle")
        End Set
    End Property

    Private _CheckBoxForeground As Brush = New SolidColorBrush(Colors.Black)
    Public Property CheckBoxForeground() As Brush
        Get
            Return _CheckBoxForeground
        End Get
        Set(ByVal value As Brush)
            _CheckBoxForeground = value
            My_OnPropertyChanged("CheckBoxForeground")

        End Set
    End Property

    Private _CheckBoxBorderBrush As Brush = New SolidColorBrush(Colors.DarkGray)
    Public Property CheckBoxBorderBrush() As Brush Implements IModel(Of T).CheckBoxBorderBrush
        Get
            Return _CheckBoxBorderBrush
        End Get
        Set(ByVal value As Brush)
            _CheckBoxBorderBrush = value
            My_OnPropertyChanged("CheckBoxBorderBrush")
        End Set
    End Property

    'Private _CheckBoxMiddle As LinearGradientBrush = New LinearGradientBrush
    'Public Property CheckBoxMiddle() As LinearGradientBrush
    '    Get
    '        If _CheckBoxMiddle IsNot Nothing AndAlso _CheckBoxMiddle.GradientStops.Count = 4 Then
    '            For Each gs In _CheckBoxMiddle.GradientStops
    '                gs.Color = CType(CheckBoxBackground, SolidColorBrush).Color
    '            Next
    '            _CheckBoxMiddle.Opacity = CType(CheckBoxBackground, SolidColorBrush).Opacity
    '        End If
    '        Return _CheckBoxMiddle
    '    End Get
    '    Set(ByVal value As LinearGradientBrush)
    '        If value IsNot Nothing AndAlso value.GradientStops.Count = 4 Then
    '            Me._CheckBoxMiddle = value
    '            My_OnPropertyChanged("CheckBoxMiddle")
    '        End If

    '    End Set
    'End Property

    Private _CheckBoxSize As Double = 68
    Public Property CheckBoxSize() As Double
        Get
            Return _CheckBoxSize
        End Get
        Set(ByVal value As Double)
            _CheckBoxSize = value
            My_OnPropertyChanged("CheckBoxSize")
        End Set
    End Property

#End Region

#Region "RTB Properties"
    Private _RTB_Background As Brush = New SolidColorBrush(Colors.Transparent)
    Public Property RTB_Background() As Brush
        Get
            Return _RTB_Background
        End Get
        Set(ByVal value As Brush)
            _RTB_Background = value
            My_OnPropertyChanged("RTB_Background")
        End Set
    End Property
    Private _RTB_FontStyle As FontStyle = FontStyles.Normal
    Public Property RTB_FontStyle() As FontStyle
        Get
            Return _RTB_FontStyle
        End Get
        Set(ByVal value As FontStyle)
            _RTB_FontStyle = value
            My_OnPropertyChanged("RTB_FontStyle")
        End Set
    End Property

    Private _RTB_FontWeight As FontWeight = FontWeights.Normal
    Public Property RTB_FontWeight() As FontWeight
        Get
            Return _RTB_FontWeight
        End Get
        Set(ByVal value As FontWeight)
            _RTB_FontWeight = value
            My_OnPropertyChanged("RTB_FontWeight")
        End Set
    End Property

    Private _RTB_TextAlignment As TextAlignment = TextAlignment.Left
    Public Property RTB_TextAlignment() As TextAlignment
        Get
            Return _RTB_TextAlignment
        End Get
        Set(ByVal value As TextAlignment)
            _RTB_TextAlignment = value
            My_OnPropertyChanged("RTB_TextAlignment")
        End Set
    End Property

    Private _RTBXaml As String
    Public Property RTBXaml As String
        Get
            My_OnPropertyChanged("RTB_TextAlignment")
            Return _RTBXaml
        End Get
        Set(ByVal value As String)
            My_OnPropertyChanged("RTB_TextAlignment")
            _RTBXaml = value
            My_OnPropertyChanged("RTBXaml")
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
End Class

Imports System.ComponentModel
Imports System.Xml.Serialization
Imports System.Runtime.Serialization
Imports System.Windows

<DataContract()> _
Public Class DesignerItemModel
    Implements IDisposable 'INotifyPropertyChanged,
    '
    'Imports System.Windows
    ', ISerializable, IDeserializationCallback

    'Public Event PropertyChanged As PropertyChangedEventHandler Implements INotifyPropertyChanged.PropertyChanged
    Private SupressPropertyChanged As Boolean = False
    Protected Sub My_OnPropertyChanged(ByVal propname As String) 'Overrides OnPropertyChanged
        '' If Not Me.SupressPropertyChanged Then
        'RaiseEvent PropertyChanged(Me, New PropertyChangedEventArgs(propname))
        ''  End If

    End Sub
    '<XmlIgnore()> _
    'Public Property MyCanvas As DesignerCanvas = Nothing
    '<XmlIgnore()> _
    ' Public Property SelectOnLoad As Boolean = False 'set by the PAste handler in Authoringcontrol....


    '#Region "ThreeD Properties"
    '    Private _PlaneX As Double = 0
    '    Public Property PlaneX As Double
    '        Get
    '            Return _PlaneX
    '        End Get
    '        Set(ByVal value As Double)
    '            _PlaneX = value
    '            My_OnPropertyChanged("PlaneX")
    '        End Set
    '    End Property
    '    Private _PlaneY As Double = 0
    '    Public Property PlaneY As Double
    '        Get
    '            Return _PlaneY
    '        End Get
    '        Set(ByVal value As Double)
    '            _PlaneY = value
    '            My_OnPropertyChanged("PlaneY")
    '        End Set
    '    End Property
    '    Private _PlaneZ As Double = 0
    '    Public Property PlaneZ As Double
    '        Get
    '            Return _PlaneZ
    '        End Get
    '        Set(ByVal value As Double)
    '            _PlaneZ = value
    '            My_OnPropertyChanged("PlaneZ")
    '        End Set
    '    End Property
    '#End Region

    'Default Constructor Required for XMLSerializer...
    Public Sub New()

    End Sub

    Private _PCE_SDS_ID As Integer
    <DataMember()> _
    Public Property PCE_SDS_ID() As Integer
        Get
            Return _PCE_SDS_ID
        End Get
        Set(ByVal value As Integer)
            _PCE_SDS_ID = value
        End Set
    End Property

    '<XmlIgnore()> _
    'Private _BorderVisibility As System.Windows.Visibility = Visibility.Collapsed
    '<XmlIgnore()> _
    'Public Property BorderVisibility() As Visibility
    '    Get
    '        Return _BorderVisibility
    '    End Get
    '    Set(ByVal value As Visibility)
    '        _BorderVisibility = value
    '        My_OnPropertyChanged("BorderVisibility")
    '    End Set
    'End Property

#Region "ContentProperties"
    <XmlIgnore()> _
    Private _MyContent_PresenterIS As Type
    <XmlIgnore()> _
    Public Property MyContent_PresenterIS() As Type
        Get
            Return _MyContent_PresenterIS
        End Get
        Set(ByVal value As Type)
            _MyContent_PresenterIS = value
            'If value IsNot Nothing Then
            '    _MyContent_PresenterIS_TypeName = value.AssemblyQualifiedName
            'End If
        End Set
    End Property
    <XmlIgnore()> _
    Private _MyContent_PresenterIS_TypeName As String
    <DataMember()> _
    Public Property MyContent_PresenterIS_TypeName() As String
        Get
            Return _MyContent_PresenterIS_TypeName
        End Get
        Set(ByVal value As String)
            _MyContent_PresenterIS_TypeName = value
        End Set
    End Property

    <XmlIgnore()> _
    Private _MyPresenterIS As Type
    <XmlIgnore()> _
    Public Property MyPresenterIS() As Type
        Get
            Return _MyPresenterIS
        End Get
        Set(ByVal value As Type)
            _MyPresenterIS = value
        End Set
    End Property


    <XmlIgnore()> _
    Private _Content As Object = Nothing
    ''' <summary>
    ''' DesignerItem's Hosted Content.Model..., e.g, ImageView.Model,...gets the Model for a View hosted in DesignerItem's "DI_ContentRegion" 
    ''' </summary>
    ''' <value></value>
    ''' <returns></returns>
    ''' <remarks></remarks>
    <XmlIgnore()> _
    Public Property Content() As Object
        Get
            Return _Content
        End Get
        Set(ByVal value As Object)
            _Content = value
            My_OnPropertyChanged("Content")
        End Set
    End Property
    <XmlIgnore()> _
    Private _ContentType As Type = Nothing 'GetType(String)
    <XmlIgnore()> _
    Public Property ContentType() As Type
        Get
            Return _ContentType
        End Get
        Set(ByVal value As Type)
            _ContentType = value
            'If value IsNot Nothing Then
            '    _ContentType_Name = value.AssemblyQualifiedName
            'End If

            My_OnPropertyChanged("ContentType")
        End Set
    End Property

    Private _ContentType_Name As String
    <DataMember()> _
    Public Property ContentType_Name() As String
        Get
            Return _ContentType_Name
        End Get
        Set(ByVal value As String)
            _ContentType_Name = value
            'If _ContentType.Equals(GetType(String)) AndAlso Not IsNothing(value) Then
            '    Dim myresolver As New Resolver
            '    ' Dim x = myresolver.ResolveTypeNametoTypeName(_ContentType_Name)
            '    _ContentType = Type.GetType(myresolver.ResolveTypeNametoTypeName(_ContentType_Name), True, True)
            '    ' _ContentType = Type.GetType(x, True, True)
            '    ' x = Nothing
            '    myresolver = Nothing
            '    '_ContentType = Type.GetType(_ContentType_Name, True, True)
            'End If
        End Set
    End Property
#End Region

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
        End Set
    End Property

    Private _DesignerItemSize As Size '= New System.Windows.Size(1.0, 1.0)
    <DataMember()> _
    Public Property DesignerItemSize() As Size
        Get
            Return _DesignerItemSize
        End Get
        Set(ByVal value As Size)
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

    <XmlIgnore()> _
    Private _ignatz As String = ""
    Public Property Ignatz() As String
        Get
            Return _ignatz
        End Get
        Set(ByVal value As String)
            _ignatz = value
        End Set
    End Property
#End Region

#Region "IDisposable Support"
    Private disposedValue As Boolean ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(ByVal disposing As Boolean)
        ' Me.SupressPropertyChanged = True
        If Not Me.disposedValue Then
            If disposing Then
                ' TODO: dispose managed state (managed objects).
                'If Not IsNothing(Me.Content) Then
                '    CType(Me.Content, IDisposable).Dispose()
                Me.Content = Nothing
                'End If


                Me.ContentType_Name = Nothing
                Me.ContentType = Nothing
                MyContent_PresenterIS_TypeName = Nothing
                Me.MyPresenterIS = Nothing
                Me.DesignerItemSize = Nothing
                Me.Ignatz = Nothing
                'Me.MyCanvas = Nothing
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

#Region "IDesignerItemStylable, IDesignerREsolvable and IPresenterIS DEFINITIONS"
Public Interface IDesignerItemStylable
    'ReadOnly Property MyProperties() As Dictionary(Of String, PropertyInfo)
    Sub Subscribe_to_DesignerItemStylingEvent()
    Sub UnSubscribe_to_DesignerItemStylingEvent()
End Interface

Public Interface IDesignerResolvable
    ''' <summary>
    ''' This property does everything that MyModel does in xxxView...just a way to ensure type safety for xxxxView - usercontrols that become content in
    ''' DesignerItems...ie, instantiated from their Models...
    ''' </summary>
    ''' <value></value>
    ''' <returns></returns>
    ''' <remarks>Put a property in the xxxxView...MyModelResolvable as IPresenterIS...implements IDesignerResolvable.MyModel_Resolvable...return _MyModel</remarks>
    Property MyModel_Resolvable() As IPresenterIS
    ReadOnly Property ShortName As String
End Interface

Public Interface IPresenterIS
    ReadOnly Property MyPresenterIS() As Type
    'put a property in the xxxxviewModel....named MyPresenterIS as type implements IPresenterIS.MyPresenterIs....property needs to Return GetType(xxxxView)

    Property IsDesignerItemHosted As Boolean
    Property DesignerItemHeight() As Double
    Property DesignerItemWidth() As Double
    Property DI_CanvasLeft() As Double
    Property DI_CanvasTop() As Double
    Property DI_CanvasZindex() As Integer
    Property PlaneX As Double
    Property PlaneY As Double
    Property PlaneZ As Double
End Interface
#End Region

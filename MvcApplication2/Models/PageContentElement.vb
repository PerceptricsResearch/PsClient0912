Imports System.Windows.Controls
Imports System.Windows
Imports System.Xml
Imports System.Runtime.Serialization
Imports System.Windows.Media
Imports System.Xml.Serialization

Public Interface IPageContentElement

End Interface
#Region "IGuidObject"
Public Interface IGuidObject
    Property MySDS_ID() As Integer
    Property MyGuid() As Guid
End Interface
#End Region

''' <summary>
''' Represents an element on a Page.  
''' </summary>
''' <remarks>This is a subset of the same class in PerceptricsEnterprise Designer...just the "Rehydrate" methods are here</remarks>

<DataContract()> _
<XmlInclude(GetType(ImageViewModel)), XmlInclude(GetType(StylablePageContentModel)), XmlInclude(GetType(SurveyNavigationModel)), XmlInclude(GetType(SolidColorBrush)), XmlInclude(GetType(MatrixTransform)), _
 XmlInclude(GetType(IgnatzModel)), XmlInclude(GetType(QuestOptionItemModel)), XmlInclude(GetType(QuestOptionSetModel)), XmlInclude(GetType(DesignerItemModel))> _
<KnownType(GetType(ImageViewModel)), KnownType(GetType(StylablePageContentModel)), KnownType(GetType(SurveyNavigationModel)), KnownType(GetType(IgnatzModel)), KnownType(GetType(SolidColorBrush)), KnownType(GetType(MatrixTransform)), KnownType(GetType(DesignerItemModel))> _
Public Class PageContentElement
    Implements IPageContentElement, IGuidObject, IDisposable

    Public Shared Property RN As New Random
    Public Shared Function ToPct(_val As Double) As String
        Return _val & "%"
    End Function

    <XmlIgnore()> _
    Public Property HasImage As Boolean = False

    <XmlIgnore()> _
    Public Property ImageURL() As String = Nothing

    <XmlIgnore()> _
    Public Property PCMID As Integer


    Public Function ToBorder(_width As Double, _height As Double, _thickness As Double) As Size
        Dim h = (_width / _height) * _thickness
        Dim w = (_height / _width) * _thickness
        Return New Size(w, h)
    End Function

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
    Private Function ColorfromHEx(ByVal hexaColor As String) As Color
        Return Color.FromArgb( _
            Convert.ToByte(hexaColor.Substring(1, 2), 16), _
            Convert.ToByte(hexaColor.Substring(3, 2), 16), _
            Convert.ToByte(hexaColor.Substring(5, 2), 16), _
            Convert.ToByte(hexaColor.Substring(7, 2), 16))

    End Function

#Region "Instance Members "
    <XmlIgnore()> _
    Private _FromDesignerCanvas As Boolean = False
    <XmlIgnore()> _
    Public Property FromDesignerCanvas() As Boolean
        Get
            Return _FromDesignerCanvas
        End Get
        Set(ByVal value As Boolean)
            _FromDesignerCanvas = value
        End Set
    End Property

#Region "New and IPresenterIs New Overload"
    Public Sub New()

    End Sub
    Public Sub New(ByRef _ViewModel As IPresenterIS)
        Me.PresenterType = _ViewModel.MyPresenterIS
        Me.PresenterTypeName = _ViewModel.MyPresenterIS.AssemblyQualifiedName
        Me.ViewModel = _ViewModel
    End Sub
#End Region



#Region "Properties"
    <XmlIgnore()> _
    Private _MyGuid As Guid
    <XmlIgnore()> _
    Public Property MyGuid() As Guid Implements IGuidObject.MyGuid
        Get
            Return _MyGuid
        End Get
        Set(ByVal value As Guid)
            _MyGuid = value
        End Set
    End Property
    <XmlIgnore()> _
    Private _SDS_ID As Integer
    <DataMember()> _
    Public Property SDS_ID() As Integer Implements IGuidObject.MySDS_ID
        Get
            Return _SDS_ID
        End Get
        Set(ByVal value As Integer)
            _SDS_ID = value
            'If Not IsNothing(Me.ViewModel) Then
            '    If TypeOf Me.ViewModel Is IResponseModel Then
            '        With CType(Me.ViewModel, IResponseModel)
            '            .SDS_ID_IRM = value
            '            If Not IsNothing(.RespONSEModel) Then
            '                .RespONSEModel.SDS_ID = value
            '            End If
            '        End With
            '    End If

            'End If
        End Set
    End Property
    <XmlIgnore()> _
    Private _PresenterType As Type
    <XmlIgnore()> _
    Public Property PresenterType()
        Get
            Return _PresenterType
        End Get
        Set(ByVal value)
            _PresenterType = value
            If value IsNot Nothing Then
                _PresenterTypeName = _PresenterType.AssemblyQualifiedName
            End If

        End Set
    End Property
    <XmlIgnore()> _
    Private _PresenterTypeName As String
    <DataMember()> _
    Public Property PresenterTypeName() As String
        Get
            Return _PresenterTypeName
        End Get
        Set(ByVal value As String)
            _PresenterTypeName = value
            'If _PresenterType Is Nothing Then
            '    _PresenterType = Type.GetType(_PresenterTypeName, True, True)
            'End If
        End Set
    End Property


    ''' <summary>
    ''' This is the Model for a PageContentElement....not the model for a DesignerItem that may host a PCE...
    ''' </summary>
    ''' <remarks>This has the substantive content, images, text, of the particular content....</remarks>
    <XmlIgnore()> _
    Private _ViewModel  'as long as everything that gets put in here is serializable, this should be serializable...
    <DataMember()> _
    Public Property ViewModel()
        Get
            Return _ViewModel
        End Get
        Set(ByVal value)
            _ViewModel = value
            'If Not IsNothing(Me._ViewModel) Then
            '    If TypeOf (Me._ViewModel) Is IResponseModel Then
            '        With CType(Me._ViewModel, IResponseModel)
            '            .SDS_ID_IRM = Me.SDS_ID
            '            If Not IsNothing(.RespONSEModel) Then
            '                .RespONSEModel.SDS_ID = Me.SDS_ID
            '            End If
            '        End With
            '    End If
            'End If
        End Set
    End Property

    ''' <summary>
    ''' This is the Model for a DesignerItem....hold Canvas.Left,TOP,Zindex...and other stuff that could be done
    ''' </summary>
    ''' <remarks>On OpenPageItemView, this is the "hosting" wrapper for all elements of PageConent. This Property should not be Persisted to Server...</remarks>
    <XmlIgnore()> _
    Private _DIModel As DesignerItemModel
    <DataMember()> _
    Public Property DIModel() As DesignerItemModel
        Get
            Return _DIModel
        End Get
        Set(ByVal value As DesignerItemModel)
            _DIModel = value
        End Set
    End Property

    'Private _Transform_from_Parent As Transform
    'Public Property Transform_from_Parent() As Transform
    '    Get
    '        Return _Transform_from_Parent
    '    End Get
    '    Set(ByVal value As Transform)
    '        _Transform_from_Parent = value
    '    End Set
    'End Property
#End Region
#End Region

#Region "IDisposable Support"
    Private disposedValue As Boolean ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(ByVal disposing As Boolean)
        If Not Me.disposedValue Then
            If disposing Then
                ' TODO: dispose managed state (managed objects).

                Me.PresenterTypeName = Nothing
                Me.PresenterType = Nothing
                Me.DIModel.Dispose()
                Me.DIModel = Nothing
                Me.MyGuid = Nothing
                CType(Me.ViewModel, IDisposable).Dispose()
                Me.ViewModel = Nothing
                Me.SDS_ID = Nothing
                Me.FromDesignerCanvas = Nothing
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


#Region "Resolver CLASS DEFINITION...THIS ALLOWED classes with different namespaces to be used across different projects...will go away in production"
Public Class Resolver
    'Public Property Name_and_Type_Dxnry As Dictionary(Of String, Type)
    Public Function Resolve(ByVal _typename As String) As Object
        Dim rslt As Object = Nothing
        _typename = _typename.Replace("SurveyModule", "TestLoginSvc")
        If Not _typename.Contains("View") Then
            _typename = _typename.Replace("Presenter", "View")
        Else
            _typename = _typename.Replace("Presenter", "")
        End If
        Dim shorttypename = Strings.Split(_typename, ".").ElementAt(1)
        Dim finaltypename = Strings.Split(shorttypename, ",").First
        Dim assmbly = Me.GetType.Assembly
        Dim asstypes = assmbly.GetTypes
        Dim q = From ty In asstypes _
                Where ty.Name.Contains(finaltypename) _
                Select ty
        If q.Any Then
            rslt = Activator.CreateInstance(q.First)
        Else
            Dim x = 2
        End If
        Return rslt
    End Function
    Public Function ResolveTypeNametoTypeName(ByVal _typename As String) As String
        Dim rslt As String = Nothing
        _typename = _typename.Replace("SurveyModule", "TestLoginSvc")
        If Not _typename.Contains("View") Then
            _typename = _typename.Replace("Presenter", "View")
        Else
            _typename = _typename.Replace("Presenter", "")
        End If
        Dim shorttypename = Strings.Split(_typename, ".").ElementAt(1)
        Dim finaltypename = Strings.Split(shorttypename, ",").First
        'Dim assmbly = Me.GetType.Assembly
        'Dim z = Me.GetType.Assembly.GetTypes
        'Dim asstypes = assmbly.GetTypes
        'Dim q = From ty In asstypes _
        '        Where ty.Name.Contains(finaltypename) _
        '        Select ty
        Dim q = From ty In Me.GetType.Assembly.GetTypes _
                Where ty.Name.Contains(finaltypename) _
                Select ty.AssemblyQualifiedName
        rslt = q.FirstOrDefault
        'If q.Any Then
        '    rslt = q.First.AssemblyQualifiedName

        'Else
        '    Dim x = 2
        'End If
        q = Nothing
        shorttypename = Nothing
        finaltypename = Nothing
        _typename = Nothing
        Return rslt
    End Function

    Public Sub Register(ByVal _typename As String, ByVal _Type As Type)

    End Sub
End Class
#End Region
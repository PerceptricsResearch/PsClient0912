Imports System.Xml.Serialization
Imports System.Collections.ObjectModel
Imports System.ComponentModel
Imports System.Windows.Media.Imaging

<XmlInclude(GetType(QuestOptionSetModel)), XmlInclude(GetType(ModelCore(Of QuestOptionSetModel)))> _
Public Class QuestOptionSetModel
    Inherits ModelCore(Of QuestOptionSetModel) 'implements Inotify....
    Implements IPresenterIS, IDisposable, IBitmapImage


    Public Sub New()
        ' Me.Model = Me 'this sets the Model property on the ModelCore(of T) base class
    End Sub
    Public Enum ConfigurationSetting As Integer
        DefaultConfiguration
        SliderLeft
        SliderBottom
        DropDownList
        MutuallyExclusiveSelectOneOnly
    End Enum
    'Private DefaultQOIMWidth As Integer = 150
    'Private Function ToRazor() As Boolean
    '    If Double.IsInfinity(Me.DesignerItemWidth) Or Double.IsInfinity(Me.DesignerItemHeight) Then
    '        Dim cnt = Me.ItemsObservableColxn.Count
    '        Me.DesignerItemWidth = Math.Ceiling(cnt / Me.UniGridRows) * Me.DefaultQOIMWidth
    '        Me.DesignerItemHeight = 
    '    End If
    '    For Each qoim In Me.ItemsObservableColxn

    '    Next
    '    Return True
    'End Function

#Region "Add QuestOptItem handler and methods"
    <XmlIgnore()> _
    Public Property IamSubscribed_AddQptItem = False
#Region "Add/Remove Question Stuff"
    Public Sub SubscribeTo_AddQuestOptionItem()
        If Not IamSubscribed_AddQptItem Then
            IamSubscribed_AddQptItem = True
            'AddHandler StylingService.QuestOptionSetCommandEvent, AddressOf QuestOptionSetCommand_EventHandler
        End If
    End Sub

    Public Sub UNSubscribeTo_AddQuestOptionItem()
        If IamSubscribed_AddQptItem Then
            IamSubscribed_AddQptItem = False
            'RemoveHandler StylingService.QuestOptionSetCommandEvent, AddressOf QuestOptionSetCommand_EventHandler
        End If
    End Sub
    'Public Sub QuestOptionSetCommand_EventHandler(ByVal sender As Object, ByVal _cmdargs As QuestOptionSetCommandArgs)
    '    'If _cmdargs.Command = QuestOptionSetCommandArgs.QOptSetCommandEnum.AddQOptItem Then

    '    '    'this puts the new QuestOptionItem.Model in this QuestOptionSet's.Model
    '    '    Dim addedmodel = New QuestOptionItemModel
    '    '    'this copies the styling from the this QuestOptionSetModel to this new member of its itemsobservable..
    '    '    PropertyHelper.CopyCorresponding(Me, addedmodel)
    '    '    'this makes sure the addedmodel sizes itself...
    '    '    addedmodel.DesignerItemHeight = Double.NaN
    '    '    addedmodel.DesignerItemWidth = Double.NaN

    '    '    'Me.Items.Add(addedmodel)
    '    '    Me.ItemsObservableColxn.Add(addedmodel)
    '    '    'ElseIf _cmdargs.Command = QuestOptionSetCommandArgs.QOptSetCommandEnum.RemoveRow Then
    '    '    '    Me.UniGridRows = Math.Max(Me.UniGridRows - 1, 1)
    '    '    'ElseIf _cmdargs.Command = QuestOptionSetCommandArgs.QOptSetCommandEnum.RemoveColumn Then
    '    '    '    Me.UniGridColumns = Math.Max(Me.UniGridColumns - 1, 1)
    '    'End If

    'End Sub

#Region "Delete Stuff"
    'Private Sub DeleteQuestOptItem(ByVal sender As Object, ByVal e As RoutedEventArgs)
    '    'Dim qoptItemView = CType(sender, QuestOptionItemView)
    '    'Me.Items.Remove(qoptItemView.MyModel)
    '    'If Me.LayoutConfiguration <> QuestOptionSetModel.ConfigurationSetting.DropDownList Then
    '    '    Me.ItemsObservableColxn.Remove(qoptItemView)
    '    '    AdjustUnigridForDelete()
    '    'Else
    '    '    Me.ComboBox.Items.Remove(qoptItemView)
    '    '    qoptItemView = Nothing
    '    'End If

    'End Sub
    Private Sub AdjustUnigridForDelete()
        Dim rows = Me.UniGridRows
        Dim colms = Me.UniGridColumns
        If colms = 1 Then
            If rows > 1 Then
                Me.UniGridRows += -1
            End If
        ElseIf rows = 1 Then
            If colms > 1 Then
                Me.UniGridColumns += -1
            End If
        ElseIf rows > 1 AndAlso colms > 1 Then
            Dim count = Me.Items.Count
            Dim rowsbycolms = rows * colms
            Dim moditems = count Mod colms
            If moditems = 0 Then
                Me.UniGridRows += -1
            End If


        End If
    End Sub
#End Region
#End Region
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
    Private _MyBitmapImagePNG As BitmapImage = Nothing
    <XmlIgnore()> _
    Public Property MyBitmapImagePNG As BitmapImage Implements IBitmapImage.MyBitmapImagePNG
        Get
            If Not IsNothing(Me.ImageUriString) Then
                Try
                    Return New BitmapImage(New Uri(Me.ImageUriString, UriKind.Absolute))
                Catch ex As Exception
                    'MessageBox.Show("SuveyNavigationControl.Web Address for Image is not valid....")
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

#Region "IPresenterIS Implementation"
    'Public Function ToPageContentElement() As PageContentElement Implements IPresenterIS.ToPageContentElement 'this would get added to PageContentModel.PCEColxn
    '    Dim rslt As PageContentElement = Nothing
    '    rslt = New PageContentElement(Me)
    '    Return rslt
    'End Function

    <XmlIgnore()> _
    Public ReadOnly Property MyPresenterIS() As Type Implements IPresenterIS.MyPresenterIS
        Get
            Return GetType(QuestOptionSetView) 'this is a stub at the bottom of this class definition...
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

#Region "Model Properties"
    Private _RequireAnswer As Boolean = False
    Public Property RequireAnswer As Boolean
        Get
            Return _RequireAnswer
        End Get
        Set(ByVal value As Boolean)
            _RequireAnswer = value
            MyBase.My_OnPropertyChanged("RequireAnswer")
        End Set
    End Property



    Private _ItemsObservableColxn As New ObservableCollection(Of QuestOptionItemModel)
    Public Property ItemsObservableColxn() As ObservableCollection(Of QuestOptionItemModel)
        Get
            Return _ItemsObservableColxn
        End Get
        Set(ByVal value As ObservableCollection(Of QuestOptionItemModel))
            _ItemsObservableColxn = value
            My_OnPropertyChanged("ItemsObservableColxn")
        End Set
    End Property

    Private _Items As New List(Of QuestOptionItemModel)
    Public Property Items() As List(Of QuestOptionItemModel) 'can't be readonly XMLserializer won't deserialize to it...
        Get
            Return _Items
        End Get
        Set(ByVal value As List(Of QuestOptionItemModel))
            _Items = value
            My_OnPropertyChanged("Items")
        End Set
    End Property

    Private _LayoutConfiguration As ConfigurationSetting = ConfigurationSetting.DefaultConfiguration
    Public Property LayoutConfiguration() As ConfigurationSetting
        Get
            Return _LayoutConfiguration
        End Get
        Set(ByVal value As ConfigurationSetting)
            _LayoutConfiguration = value
            MyBase.My_OnPropertyChanged("LayoutConfiguration")
        End Set
    End Property

    Private _UniGridColumns As Integer = 1
    Public Property UniGridColumns() As Integer
        Get
            Return _UniGridColumns
        End Get
        Set(ByVal value As Integer)
            _UniGridColumns = value
            MyBase.My_OnPropertyChanged("UniGridColumns")
        End Set
    End Property

    Private _UniGridRows As Integer = 3
    Public Property UniGridRows() As Integer
        Get
            Return _UniGridRows
        End Get
        Set(ByVal value As Integer)
            _UniGridRows = value
            MyBase.My_OnPropertyChanged("UniGridRows")
        End Set
    End Property

    Private _IgnatzDemoString As String = ""
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
                Me.MyBitmapImagePNG = Nothing
                Me.ImageOpacity = Nothing
                Me.ImageUriString = Nothing
                Me.DerivedClassDisposing = True
                If Not IsNothing(Me.Items) Then
                    Me.Items.Clear()
                    Me.Items = Nothing
                End If
                If Not IsNothing(Me.ItemsObservableColxn) Then
                    SyncLock (CType(Me.ItemsObservableColxn, Collections.ICollection).SyncRoot)
                        'For Each qoim In Me.ItemsObservableColxn
                        '    qoim.Dispose()
                        '    ' qoim = Nothing
                        'Next
                        Me.ItemsObservableColxn.Clear()

                    End SyncLock
                    Me.ItemsObservableColxn = Nothing
                End If

                Me.UniGridColumns = Nothing
                Me.UniGridRows = Nothing
                Me.RequireAnswer = Nothing
                Me.ResultsVisibility = Nothing
                Me.IsDesignerItemHosted = Nothing
                Me.IamSubscribed_AddQptItem = Nothing
                Me.LayoutConfiguration = Nothing
                ' Me.Items = Nothing
                'MyBase.RTBXaml = Nothing
                'MyBase.RTB_Background = Nothing
                'MyBase.Background = Nothing
                'MyBase.BorderBrush = Nothing
                'MyBase.CheckBoxBackground = Nothing
                'MyBase.CheckBoxBorderBrush = Nothing
                'MyBase.CheckBoxForeground = Nothing
                'MyBase.CheckBoxMiddle = Nothing
                'MyBase.Foreground = Nothing

                Me.IgnatzDemoString = Nothing
                MyBase.Ignatz = Nothing
                MyBase.FontName = Nothing
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
Public Class QuestOptionSetView

End Class
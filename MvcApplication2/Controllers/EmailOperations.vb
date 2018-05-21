Imports System.Collections.ObjectModel
Imports MvcApplication2.AuthoringSvcNS
Imports System.ServiceModel

Public Class EmailOperations

    Public Sub New()
        'this default constructor is necessary for SendEmailRDentLink in SubscriberController...
        'Note that the server methods rely on a sql database called emailforms...the test server(leases)...on has two in its datbase...can't use form id more than 2...
    End Sub

    Public Sub New(_emailaddress As String)
        If Not IsNothing(_emailaddress) Then
            EmailPackage.InitiatingNormalizedEmailAddr = _emailaddress
            Dim kvp = New AuthoringSvcNS.Srlzd_KVP With {.Key = "msg", _
                                                   .Valu = "Sent From Perceptrics Subscriber: " & EmailPackage.InitiatingNormalizedEmailAddr}
            Me.EmailPackage.MessageContentColxn.Add(kvp)
        End If
    End Sub
    Private Property ShowConfirmation As Boolean = True
    Private MarketingEmail = "marketing@perceptricsresearch.com"
    Private Property NormalEmail() As String
    Public Property MsgColxn As New ObservableCollection(Of AuthoringSvcNS.Srlzd_KVP)
    'these are default properties...
    Public Property EmailPackage As AuthoringSvcNS.SendEmail_Package = New AuthoringSvcNS.SendEmail_Package With {.EmailFormName = EmailFormNames.Comment, _
                                                                              .InitiatingNormalizedEmailAddr = "Prospect", _
                                                                              .MessageContentColxn = MsgColxn, _
                                                                              .ToAddress_Normalized = "admin@perceptricsresearch.com"}

    Public Function SendEmail(ByVal _ShowConfirm As Boolean) As Boolean
        Dim rslt As Boolean = True
        Me.ShowConfirmation = _ShowConfirm
        Dim AuthSvc As AuthoringSvcNS.AuthoringSvcClient = Nothing
        Dim scp As New ServerClientProvider
        Me.NormalEmail = scp.Normalize(Me.MarketingEmail)
        Try
            AuthSvc = scp.AuthorSvcClientNew(Me.NormalEmail)
            AuthSvc.SendEmailPleaseAsync(EmailPackage)
        Catch ex As Exception
            rslt = False
        End Try
        scp = Nothing
        AuthSvc = Nothing
        Return rslt
    End Function

    'Private Sub SendEmailCompletedHandler(ByVal sender As Object, ByVal e As AuthoringSvcNS.SendEmailPleaseCompletedEventArgs)
    '    RemoveHandler CType(sender, AuthoringSvcNS.AuthoringSvcClient).SendEmailPleaseCompleted, AddressOf SendEmailCompletedHandler
    '    AddHandler CType(sender, AuthoringSvcClient).CloseCompleted, AddressOf MyAuthSvcCloseHandler
    '    CType(sender, AuthoringSvcClient).CloseAsync()
    '    If ShowConfirmation Then
    '        RaiseEvent MessageSent_Event(Me, New RoutedEventArgs)
    '    End If
    'End Sub
    'Private Sub MyAuthSvcCloseHandler(ByVal sender As Object, ByVal e As EventArgs)
    '    RemoveHandler CType(sender, AuthoringSvcClient).CloseCompleted, AddressOf MyAuthSvcCloseHandler
    '    Try
    '        CType(sender, AuthoringSvcClient).InnerChannel.Close()
    '        CType(sender, AuthoringSvcClient).InnerChannel.Dispose()
    '    Catch ce As CommunicationException
    '        MessageBox.Show("AuthSvcClose reports.." & ce.Message)
    '    Catch wx As WebException
    '        MessageBox.Show("AuthSvcClose reports..WebEx..." & wx.Message)
    '    Catch ex As Exception
    '        MessageBox.Show("AuthSvcClose reports.." & ex.Message)
    '    Finally
    '        GC.GetTotalMemory(True)
    '    End Try
    '    'sender = Nothing


    'End Sub

End Class
Public Enum EmailFormNames
    Comment = 0
    NewSubscriber = 1
    PublishedSurvey = 2
    UnPublishedSurvey = 3
    ChangedPassword = 4
    AddedGuestLogin = 5
    RemovedGuestLogin = 6
    CancelledSubscription = 7
    UpgradedSubscription = 8
    DownGradedSubscription = 9
    ConfirmPassword = 10
    EF11 = 11 'send survey link via email
    EF12 = 12
    EF13 = 13
    EF14 = 14
    EF15 = 15
End Enum
Public Class EmailJsonObject
    Public Property ToEmail As String
    Public Property SurveyName As String
    Public Property InitiatingEmail As String
    Public Property MsgColxn As List(Of String)
End Class
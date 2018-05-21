Imports MvcApplication2.AuthoringSvcNS
Imports MvcApplication2.ResultsSvcNS
Imports MvcApplication2.RespProviderSvcNS
Imports System.Collections.ObjectModel

Public Class ServerClientProvider
    Implements IDisposable

    Public Property PBM As ULong = 0
    Public Property AggregatedPBM As ULong = 0

    Public Property IsNewSubscriber As Boolean = False

    Public Property MyLogInInfo As LogInInfo
    Public Property MyLogInResult As LogInSvcNS.LogInResult

    Public Function RetrieveAuthSvcURLString(_suffix As String) As String
        Dim rslt As String = "" 'Uri = Nothing
        rslt = "https://perceptricsresearch.com/hm/AuthoringSvcNS.AuthoringSvc/" & Me.Normalize(_suffix)
        'New Uri("https://leases/hm/AuthoringSvcNS.AuthoringSvc/" & Me.Normalize(_suffix), UriKind.Absolute)
        Return rslt
    End Function
    Public Function RetrieveRsltsSvcURLString(_suffix As String) As String
        Dim rslt As String = "" 'Uri = Nothing
        rslt = "https://perceptricsresearch.com/hm/RsltsProviderSvcLibr.ResultsSvc/" & Me.Normalize(_suffix)
        'New Uri("https://leases/hm/ResultsSvcNS.ResultsSvc/" & Me.Normalize(_suffix), UriKind.Absolute)
        Return rslt
    End Function
    Public Function RetrieveResponseSvcURLString(_suffix As String) As String
        Dim rslt As String = "" 'Uri = Nothing
        rslt = "https://perceptricsresearch.com/hm/RespProviderSvcLibr.RespProviderSvc/" & Me.Normalize(_suffix)
        'New Uri("https://leases/hm/RespProviderSvcLibr.RespProviderSvc/" & Me.Normalize(_suffix), UriKind.Absolute)
        Return rslt
    End Function
    Public Function Normalize(ByVal _emaddr As String) As String
        Dim rslt As String = Nothing
        If Not String.IsNullOrEmpty(_emaddr) Then
            Dim replaces = From c In _emaddr.ToLower.ToCharArray _
                           Where Not Char.IsLetterOrDigit(c) Or Char.IsPunctuation(c) Or Char.IsSymbol(c) _
                           Select c

            Dim rsltstring As String = _emaddr
            For Each c In replaces
                'Dim x = Char.ToString(c)
                rsltstring = Strings.Replace(rsltstring, Char.ToString(c), "_")
            Next
            If rsltstring.Length > 50 Then
                rslt = Left(rsltstring.ToLower, 50)
            Else
                rslt = Left(rsltstring.ToLower, rsltstring.Length)
            End If
        End If
        Return rslt
    End Function

#Region "SetUpAuthSvcClient"
    'Private ReadOnly Property MyAuthorSvcClient() As AuthoringSvcClient
    '    Get

    '        If MyAppResource("MyAuthorSvcClient") IsNot Nothing Then
    '            'ChangeValueInMyAppResources("MyAuthorSvcClient", Nothing)
    '            'SetUpAuthorSvcClient()
    '            Return CType(MyAppResource("MyAuthorSvcClient"), AuthoringSvcClient)
    '        Else
    '            ChangeValueInMyAppResources("MyAuthorSvcClient", Nothing)
    '            SetUpAuthorSvcClient()
    '            Return Nothing
    '        End If
    '    End Get
    'End Property

    Public MyRemoteAddress As String = ""
    Public MyEndpointConfigName As String = "CustomBinding_IAuthoringSvc"
    Public MyBaseAddress As String = "AuthoringSvc/" '"https://leases:8005/hm/AuthoringSvcNS.AuthoringSvc/"
    Private LogInResult As LogInSvcNS.LogInResult

    'Public Shared Sub ReleaseAuthorSvcClient()
    '    DefaultInstance.ChangeValueInMyAppResources("MyAuthorSvcClient", Nothing)
    'End Sub

    Public Function ResetMyAuthSvc(_suffix As String) As AuthoringSvcClient
        Me.MyAuthSvc = Nothing
        Return AuthorSvcClientNew(_suffix)
    End Function
    Public Property MyAuthSvc As AuthoringSvcClient
    Public Function AuthorSvcClientNew(_suffix As String) As AuthoringSvcClient
        Try
            'If IsNothing(Me.MyAuthSvc) Then 'use the same one....
            '    If MyLogInResult IsNot Nothing Then
            '        'Dim LogInResult As LogInSvcNS.LogInResult = DefaultInstance.MyAppResource("MyLoginResult") 'Application.Current.Resources.Item("MyLoginResult")
            '        If MyRemoteAddress = "" Then
            MyRemoteAddress = Me.RetrieveAuthSvcURLString(_suffix) 'BuildSvcAddress(MyBaseAddress, MyLogInResult.EndpointKeysList)
            '        End If
            '        If MyRemoteAddress IsNot Nothing Then
            '            Try
            '                ' Me.MyAuthSvc = Nothing
            '                ' If IsNothing(Me.MyAuthSvc) Then
            Me.MyAuthSvc = New AuthoringSvcClient(MyEndpointConfigName, MyRemoteAddress)
            Me.MyAuthSvc.ClientCredentials.UserName.UserName = Normalize(_suffix) 'MyLogInInfo.EmailAddress
            '                'Me.MyAuthSvc.ClientCredentials.UserName.Password = MyLogInInfo.Password
            '                'wr = New WeakReference(New AuthoringSvcClient(MyEndpointConfigName, MyRemoteAddress))
            '                'CType(wr.Target, AuthoringSvcClient).ClientCredentials.UserName.UserName = MyLogInInfo.EmailAddress
            '                'CType(wr.Target, AuthoringSvcClient).ClientCredentials.UserName.Password = MyLogInInfo.Password
            '                'rslt = New AuthoringSvcClient(MyEndpointConfigName, MyRemoteAddress)
            '                'rslt.ClientCredentials.UserName.UserName = MyLogInInfo.EmailAddress
            '                'rslt.ClientCredentials.UserName.Password = MyLogInInfo.Password
            '                ' End If

            '            Catch ex As Exception
            '                ' MessageBox.Show("ServerClientProvider.AuthorSvcClientNew reports... " & ex.Message)
            '            End Try
            '            'rslt = True
            '        Else
            '            ' MessageBox.Show("ServerClientProvider.AuthorSvcClientNew reports MyRemoteAddress is nothing")
            '        End If
            '    Else
            '        ' MessageBox.Show("ServerClientProvider.AuthorSvcClientNew reports Application.Resources(MyLoginResult) is nothing")
            '    End If
            'End If
        Catch ex As Exception
            Dim x = 2
        End Try


        Return Me.MyAuthSvc 'CType(wr.Target, AuthoringSvcClient)
    End Function

    Public Function SetUpAuthorSvcClient() As Boolean
        Dim rslt As Boolean = False
        If MyLogInResult IsNot Nothing Then
            'LogInResult = MyAppResource("MyLoginResult") 'Application.Current.Resources.Item("MyLoginResult")
            MyRemoteAddress = BuildSvcAddress(MyBaseAddress, MyLogInResult.EndpointKeysList)
            If MyRemoteAddress IsNot Nothing Then
                Try
                    'MyAuthorSvcClient = New AuthoringSvcClient(MyEndpointConfigName, MyRemoteAddress)
                    'ChangeValueInMyAppResources("MyAuthorSvcClient", New AuthoringSvcClient(MyEndpointConfigName, MyRemoteAddress))
                    'ChangeValueInMyAppResources("AuthorSvcEndPtConfigName", MyEndpointConfigName)
                    'ChangeValueInMyAppResources("AuthorSvcRemoteAddress", MyRemoteAddress)
                    'Application.Current.Resources.Add("MyAuthorSvcClient", New AuthoringSvcClient(MyEndpointConfigName, MyRemoteAddress))

                    rslt = True
                Catch ex As Exception
                    ' MessageBox.Show("ServerClientProvider.SetupAuthorSvcClient reports... " & ex.Message)
                End Try
                'rslt = True
            Else
                '  MessageBox.Show("ServerClientProvider reports MyRemoteAddress is nothing")
            End If
        Else
            'MessageBox.Show("ServerClientProvider reports Application.Resources(MyLoginResult) is nothing")
        End If
        Return rslt
    End Function
    Private Function BuildSvcAddress(ByVal _SvcBaseAddress As String, ByVal _EndPtKeysList As ObservableCollection(Of LogInSvcNS.EndPtPackage)) As String
        Dim rslt As String = Nothing
        If _EndPtKeysList IsNot Nothing Then
            Try
                Dim q = From ept In _EndPtKeysList _
                        Where ept.BaseAddress.Contains(_SvcBaseAddress) _
                        Select ept.Address
                q.DefaultIfEmpty(Nothing)
                rslt = q.SingleOrDefault
            Catch ex As Exception
                ' MessageBox.Show("ServerClientProvider.BuildSvcAddress reports _SvcBaseAddress is not unique in LogInResult.EndPtKeysList")
            End Try
        End If
        Return rslt
    End Function
#End Region

#Region "ResultsProviderSvcNS  SetUpResultsSvcClient"
    Public Property MyRsltsSvc As ResultsSvcClient
    Public Function ResultsSvcClientNew(_suffix As String) As ResultsSvcClient
        Try
            Results_MyRemoteAddress = Me.RetrieveRsltsSvcURLString(_suffix)
            Me.MyRsltsSvc = New ResultsSvcClient(Results_MyEndpointConfigName, Results_MyRemoteAddress)
            Me.MyRsltsSvc.ClientCredentials.UserName.UserName = Normalize(_suffix)
        Catch ex As Exception
            Dim x = 2
        End Try
        ' Dim rslt As ResultsSvcClient = Nothing
        'If IsNothing(Me.MyRsltsSvc) Then
        '    If MyLogInResult IsNot Nothing Then
        '        Results_MyRemoteAddress = BuildSvcAddress(Results_MyBaseAddress, MyLogInResult.EndpointKeysList)
        '        If Results_MyRemoteAddress IsNot Nothing Then
        '            Try
        '                Me.MyRsltsSvc = New ResultsSvcClient(Results_MyEndpointConfigName, Results_MyRemoteAddress)
        '                Me.MyRsltsSvc.ClientCredentials.UserName.UserName = MyLogInInfo.EmailAddress
        '                Me.MyRsltsSvc.ClientCredentials.UserName.Password = MyLogInInfo.Password
        '            Catch ex As Exception
        '                ' MessageBox.Show("ServerClientProvider.ResultsSvcClientNew reports... " & ex.Message)
        '            End Try
        '            'rslt = True
        '        Else
        '            ' MessageBox.Show("ServerClientProvider.ResultsSvcClientNew reports Results_MyRemoteAddress is nothing")
        '        End If
        '    Else
        '        '  MessageBox.Show("ServerClientProvider.ResultsSvcClientNew reports MyLoginResult is nothing")
        '    End If
        'End If

        Return Me.MyRsltsSvc
    End Function

    'Private ReadOnly Property MyResultsSvcClient() As ResultsSvcClient
    '    Get
    '        Return ResultsSvcClientNew()
    '    End Get
    'End Property

    Public Results_MyRemoteAddress As String = ""
    Public Results_MyEndpointConfigName As String = "CustomBinding_IResultsSvc"
    Public Results_MyBaseAddress As String = "ResultsSvc/" '"http://leases:8005/hm/RsltsProviderSvcLibr.ResultsSvc/"
    Public Function SetUpResultsSvcClient() As Boolean
        Dim rslt As Boolean = False
        If MyLogInResult IsNot Nothing Then
            Results_MyRemoteAddress = BuildSvcAddress(Results_MyBaseAddress, MyLogInResult.EndpointKeysList)
            If Results_MyRemoteAddress IsNot Nothing Then
                Try
                    rslt = True
                Catch ex As Exception
                    ' MessageBox.Show("ServerClientProvider.SetupResultsSvcClient reports... " & ex.Message)
                End Try
            Else
                'MessageBox.Show("ServerClientProvider reports Results_MyRemoteAddress is nothing")
            End If
        Else
            '   MessageBox.Show("ServerClientProvider.SetUpResultsSvcClient reports Application.Resources(MyLoginResult) is nothing")
        End If
        Return rslt
    End Function
#End Region

#Region "ResponseProviderSvcNS  SetUpResponseSvcClient"
    Public Property MyResponseSvc As RespProviderSvcClient
    Public Function ResponseSvcClientNew(_suffix As String) As RespProviderSvcClient
        Try
            Response_MyRemoteAddress = Me.RetrieveResponseSvcURLString(_suffix)
            Me.MyResponseSvc = New RespProviderSvcClient(Response_MyEndpointConfigName, Response_MyRemoteAddress)
            Me.MyResponseSvc.ClientCredentials.UserName.UserName = Normalize(_suffix)
        Catch ex As Exception
            Dim x = 2
        End Try
        Return Me.MyResponseSvc
    End Function

    'Private ReadOnly Property MyResultsSvcClient() As ResultsSvcClient
    '    Get
    '        Return ResultsSvcClientNew()
    '    End Get
    'End Property

    Public Response_MyRemoteAddress As String = ""
    Public Response_MyEndpointConfigName As String = "CustomBinding_IRespProviderSvc"
    Public Response_MyBaseAddress As String = "RespProviderSvc/" '"http://leases:8005/hm/RsltsProviderSvcLibr.ResultsSvc/"
    Public Function SetUpResponseSvcClient() As Boolean
        Dim rslt As Boolean = False
        If MyLogInResult IsNot Nothing Then
            Response_MyRemoteAddress = BuildSvcAddress(Response_MyBaseAddress, MyLogInResult.EndpointKeysList)
            If Response_MyRemoteAddress IsNot Nothing Then
                Try
                    rslt = True
                Catch ex As Exception
                    ' MessageBox.Show("ServerClientProvider.SetupResultsSvcClient reports... " & ex.Message)
                End Try
            Else
                'MessageBox.Show("ServerClientProvider reports Results_MyRemoteAddress is nothing")
            End If
        Else
            '   MessageBox.Show("ServerClientProvider.SetUpResultsSvcClient reports Application.Resources(MyLoginResult) is nothing")
        End If
        Return rslt
    End Function
#End Region

#Region "IDisposable Support"
    Private disposedValue As Boolean ' To detect redundant calls

    ' IDisposable
    Protected Overridable Sub Dispose(disposing As Boolean)
        If Not Me.disposedValue Then
            If disposing Then
                Me.MyLogInInfo = Nothing
                Me.MyLogInResult = Nothing
                Me.LogInResult = Nothing
                Me.MyAuthSvc = Nothing
                Me.PBM = Nothing
                Me.AggregatedPBM = Nothing
                Me.MyRsltsSvc = Nothing
                Me.MyResponseSvc = Nothing
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

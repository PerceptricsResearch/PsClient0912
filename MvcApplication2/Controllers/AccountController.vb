Imports System.Diagnostics.CodeAnalysis
Imports System.Security.Principal
Imports System.Web.Routing
Imports System.ServiceModel
Imports System.Collections.ObjectModel
Imports System.IO

Public Class AccountController
    Inherits System.Web.Mvc.Controller

    '
    ' GET: /Account/LogOn
    <RequireHttps()> _
    Public Function LogOn() As ActionResult
        Return View()
    End Function

    '
    ' POST: /Account/LogOn
    Private Property MyLogInInfo As LogInInfo

    <HttpPost()> _
    Public Function LogOn(ByVal model As LogOnModel, ByVal returnUrl As String) As ActionResult
        If ModelState.IsValid Then
            Dim PwdINT As Integer = PwdHashIntFromPwdText(model.Password, model.UserName)
            Me.MyLogInInfo = New LogInInfo With {.EmailAddress = model.UserName, _
                                                    .Password = PwdINT.ToString}
            Try
                'IsBusyService.SetIsBusy(True, "Verifying login credentials...")
                'Dim PwdINT As Integer = PwdHashIntFromPwdText(LogInInfoITem.Password, _loginInfo.EmailAddress)
                '_loginInfo.Password = PwdINT.ToString
                Dim loginsvclient = New LogInSvcNS.LogInSvcClient
                loginsvclient.ClientCredentials.UserName.UserName = Me.MyLogInInfo.EmailAddress
                loginsvclient.ClientCredentials.UserName.Password = Me.MyLogInInfo.Password

                Dim pswdColxn As New ObservableCollection(Of String)
                Dim _pswdtext = "0"
                Dim pkg As New LogInSvcNS.LogInPackage With {.LogIn_Email = Me.MyLogInInfo.EmailAddress, _
                                                             .PasswordHashINT = Me.MyLogInInfo.Password, _
                                                               .PasswordHash = pswdColxn}
                pswdColxn.Add(_pswdtext.GetHashCode.ToString)

                'AddHandler loginsvclient.LogMeInPleaseCompleted, AddressOf LogInSvc_LogMeInPlease_Completed

                Dim loginresult = loginsvclient.LogMeInPlease(pkg) 'LogMeInPleaseAsync(pkg)
                If Not IsNothing(loginresult) Then
                    With loginresult
                        If .LogIn_IsSuccess Then
                            If .EndpointKeysList.Count > 0 Then
                                Dim udata As String = "0"
                                Dim pbmkvp = .SpiffList.LastOrDefault
                                If Not IsNothing(pbmkvp) Then
                                    If pbmkvp.Key = "PBM" Then
                                        udata = pbmkvp.Valu
                                    End If
                                End If
                                Dim ps = New PrivilegeSupport
                                If ps.IsSubscriber(udata) Then
                                    'Dim tk = New FormsAuthenticationTicket(1, _
                                    '                        model.UserName, _
                                    '                        DateTime.Now, _
                                    '                        DateTime.Now.AddMinutes(30), _
                                    '                        model.RememberMe, _
                                    '                        udata, _
                                    '                        FormsAuthentication.FormsCookiePath)
                                    FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe)
                                    TempData.Add("User", model.UserName)
                                    Return Me.RedirectToRoute("SubscriberMain")
                                Else
                                    Return RedirectToAction("InsufficientPrivileges", "Home")
                                End If
                            Else
                                Return RedirectToAction("InsufficientPrivileges", "Home")
                            End If
                        Else
                            ModelState.AddModelError("", "The user name or password provided is incorrect.")
                        End If
                    End With
                Else
                    ModelState.AddModelError("", "The user name or password provided is incorrect.")
                End If
            Catch ex As Security.MessageSecurityException

                'MessageBox.Show("LogInSvc_LogMeInPlease_Completed reports...SEC1" & ex.Message)
            Catch ex As System.Net.WebException
                ModelState.AddModelError("", "The user name or password provided is incorrect." & ex.Message)
                ' MessageBox.Show("LogInSvc_LogMeInPlease_Completed reports...WEB1" & ex.Message)
            Catch ex As CommunicationException
                ModelState.AddModelError("", "The user name or password provided is incorrect." & ex.Message)
                'Me.Close()
                ' MessageBox.Show("LogInSvc_LogMeInPlease_Completed reports...COMM1" & ex.Message) '& vbCrLf & ex.InnerException.Message)
            Catch ex As Exception
                ModelState.AddModelError("", "The user name or password provided is incorrect." & ex.Message)
                ' MessageBox.Show("LogInSvc_LogMeInPlease_Completed reports...1" & ex.Message)
            End Try

        End If

        ' If we got this far, something failed, redisplay form
        Return View(model)
    End Function

    Public Shared Function PwdHashIntFromPwdText(ByVal _PwdText As String, ByVal _emailAddr As String) As Integer
        'Dim x = Integer.Parse(_PwdText)
        'Return Integer.Parse(_PwdText)
        Return PwdHasher.PWD_Pkg.SmartPwdPkg(_PwdText, False, _emailAddr).PwdHashINT
    End Function
    '
    ' GET: /Account/LogOff

    Public Function LogOff() As ActionResult
        Try
            Dim xxx = Me.ControllerContext
            Dim hc = Me.HttpContext
            If Not IsNothing(hc) Then
                Dim x = 2
            End If
            Dim cp = FormsAuthentication.FormsCookiePath
            Dim cn = FormsAuthentication.FormsCookieName
            Dim cx = FormsAuthentication.CookieDomain
            FormsAuthentication.SignOut()
            Dim loginsvclient As New LogInSvcNS.LogInSvcClient

            loginsvclient.ClientCredentials.UserName.UserName = hc.User.Identity.Name
            'loginsvclient.ClientCredentials.UserName.Password = MyLogInInfo.Password 'PwdHashIntFromPwdText(mylogininfo.Password)
            'Dim loginrslt = CType(Application.Current.Resources("SCP"), ServerClientProvider).MyLogInResult 'CustomerMainControl.MyLogInResult 'CType(MyAppResource("MyLoginResult"), LogInSvcNS.LogInResult)
            'If MyLogInInfo IsNot Nothing Then 'AndAlso loginrslt IsNot Nothing Then
            Dim pkg As New LogInSvcNS.LogOutPackage With {.LogIn_Email = hc.User.Identity.Name, _
                                               .LogIn_Result = New LogInSvcNS.LogInResult}
            'AddHandler loginsvclient.LogMeOutPleaseCompleted, AddressOf LogInSvc_LogMeOutPlease_Completed
            Dim rslt = loginsvclient.LogMeOutPlease(pkg) 'Async(pkg)
            'Else
            '    MessageBox.Show("mylogininfo and loginrslt are nothing...")
            'End If
            loginsvclient = Nothing
        Catch ex As Exception

        End Try
        Return RedirectToAction("Index", "Home")
    End Function

    '
    ' GET: /Account/Register

    Public Function Register() As ActionResult
        Return View()
    End Function

    '
    ' POST: /Account/Register

    <HttpPost()> _
    Public Function Register(ByVal model As RegisterModel) As ActionResult
        If ModelState.IsValid Then
            ' Attempt to register the user
            Dim createStatus As MembershipCreateStatus
            Membership.CreateUser(model.UserName, model.Password, model.Email, Nothing, Nothing, True, Nothing, createStatus)

            If createStatus = MembershipCreateStatus.Success Then
                FormsAuthentication.SetAuthCookie(model.UserName, False)
                Return RedirectToAction("Index", "Home")
            Else
                ModelState.AddModelError("", ErrorCodeToString(createStatus))
            End If
        End If

        ' If we got this far, something failed, redisplay form
        Return View(model)
    End Function

    '
    ' GET: /Account/ChangePassword

    <Authorize()> _
    Public Function ChangePassword() As ActionResult
        Return View()
    End Function

    '
    ' POST: /Account/ChangePassword

    <Authorize()> _
    <HttpPost()> _
    Public Function ChangePassword(ByVal model As ChangePasswordModel) As ActionResult
        If ModelState.IsValid Then
            ' ChangePassword will throw an exception rather
            ' than return false in certain failure scenarios.
            Dim changePasswordSucceeded As Boolean

            Try
                Dim currentUser As MembershipUser = Membership.GetUser(User.Identity.Name, True)
                changePasswordSucceeded = currentUser.ChangePassword(model.OldPassword, model.NewPassword)
            Catch ex As Exception
                changePasswordSucceeded = False
            End Try

            If changePasswordSucceeded Then
                Return RedirectToAction("ChangePasswordSuccess")
            Else
                ModelState.AddModelError("", "The current password is incorrect or the new password is invalid.")
            End If
        End If

        ' If we got this far, something failed, redisplay form
        Return View(model)
    End Function

    '
    ' GET: /Account/ChangePasswordSuccess

    Public Function ChangePasswordSuccess() As ActionResult
        Return View()
    End Function

#Region "Status Code"
    Public Function ErrorCodeToString(ByVal createStatus As MembershipCreateStatus) As String
        ' See http://go.microsoft.com/fwlink/?LinkID=177550 for
        ' a full list of status codes.
        Select Case createStatus
            Case MembershipCreateStatus.DuplicateUserName
                Return "User name already exists. Please enter a different user name."

            Case MembershipCreateStatus.DuplicateEmail
                Return "A user name for that e-mail address already exists. Please enter a different e-mail address."

            Case MembershipCreateStatus.InvalidPassword
                Return "The password provided is invalid. Please enter a valid password value."

            Case MembershipCreateStatus.InvalidEmail
                Return "The e-mail address provided is invalid. Please check the value and try again."

            Case MembershipCreateStatus.InvalidAnswer
                Return "The password retrieval answer provided is invalid. Please check the value and try again."

            Case MembershipCreateStatus.InvalidQuestion
                Return "The password retrieval question provided is invalid. Please check the value and try again."

            Case MembershipCreateStatus.InvalidUserName
                Return "The user name provided is invalid. Please check the value and try again."

            Case MembershipCreateStatus.ProviderError
                Return "The authentication provider returned an error. Please verify your entry and try again. If the problem persists, please contact your system administrator."

            Case MembershipCreateStatus.UserRejected
                Return "The user creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator."

            Case Else
                Return "An unknown error occurred. Please verify your entry and try again. If the problem persists, please contact your system administrator."
        End Select
    End Function
#End Region

    Public Function JsonRetrieveAccountResources() As JsonResult
        Return Json(New With {.signup = Me.VwP("Register"),
                              .passwdchng = Me.VwP("ChangePassword"),
                              .logon = Me.VwP("LogOn")})
    End Function

    Public Function VwP(viewName) As String
        Dim rslt As String = ""
        Try
            Using sw As New StringWriter()
                Dim viewResult = ViewEngines.Engines.FindPartialView(Me.ControllerContext, viewName)
                Dim viewContext = New ViewContext(Me.ControllerContext, viewResult.View, Me.ViewData, Me.TempData, sw)
                viewResult.View.Render(viewContext, sw)
                rslt = sw.ToString()
                viewResult = Nothing
                viewContext = Nothing
            End Using
        Catch ex As Exception
            rslt = "<div>Could not retrieve account resources from Server...</div>"
        End Try

        Return rslt
    End Function
End Class

Public Class LogInInfo
    Private _EmailAddress As String
    Public Property EmailAddress() As String
        Get
            Return _EmailAddress
        End Get
        Set(ByVal value As String)
            'Validator.ValidateProperty(value, New ValidationContext(Me, Nothing, Nothing) With {.MemberName = "EmailAddress"})
            'Validate(_value:=value, _propertyName:="EmailAddress")
            _EmailAddress = value
            'MyOnPropertyChanged("EmailAddress")
        End Set
    End Property

    Private _Password As String
    '<Required(), Display(Name:="Password", Description:="Your password")> _
    Public Property Password() As String
        Get
            Return _Password
        End Get
        Set(ByVal value As String)
            'Validator.ValidateProperty(value, New ValidationContext(Me, Nothing, Nothing) With {.MemberName = "Password"})
            _Password = value
            'MyOnPropertyChanged("Password")
        End Set
    End Property
    Public Property Level As Integer = 1
End Class
Public Enum UserLevel As Integer
    Subscriber = 1
    ResultsViewer = 2
    Administrator = 3
    RDent = 4
End Enum

'<HttpPost()> _
'Public Function LogOn(ByVal model As LogOnModel, ByVal returnUrl As String) As ActionResult

'    If ModelState.IsValid Then
'        If Membership.ValidateUser(model.UserName, model.Password) Then
'            FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe)
'            If Url.IsLocalUrl(returnUrl) AndAlso returnUrl.Length > 1 AndAlso returnUrl.StartsWith("/") _
'               AndAlso Not returnUrl.StartsWith("//") AndAlso Not returnUrl.StartsWith("/\\") Then
'                Return Redirect(returnUrl)
'            Else
'                Return RedirectToAction("Index", "Home")
'            End If
'        Else
'            ModelState.AddModelError("", "The user name or password provided is incorrect.")
'        End If
'    End If

'    ' If we got this far, something failed, redisplay form
'    Return View(model)
'End Function

'<HttpPost()> _
'Public Function Register(ByVal model As RegisterModel) As ActionResult
'    If ModelState.IsValid Then
'        ' Attempt to register the user
'        Dim createStatus As MembershipCreateStatus
'        Membership.CreateUser(model.UserName, model.Password, model.Email, Nothing, Nothing, True, Nothing, createStatus)

'        If createStatus = MembershipCreateStatus.Success Then
'            FormsAuthentication.SetAuthCookie(model.UserName, False)
'            Return RedirectToAction("Index", "Home")
'        Else
'            ModelState.AddModelError("", ErrorCodeToString(createStatus))
'        End If
'    End If

'    ' If we got this far, something failed, redisplay form
'    Return View(model)
'End Function
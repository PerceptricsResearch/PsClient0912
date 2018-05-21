Imports System.Runtime.CompilerServices
Imports System.Web
Public Class ApplicationHelper

    Public Shared ReadOnly Property HasMobileSpecificView
        Get
            Dim configCheck As Boolean
            Boolean.TryParse(ConfigurationManager.AppSettings("HasMobileSpecificViews"), configCheck)
            Return configCheck
        End Get
        'Set(value)

        'End Set
    End Property


    Public Shared ReadOnly Property MobileViewsDirectoryName As String
        Get
            Dim directoryName = ConfigurationManager.AppSettings("MobileViewsDirectoryName")
            Dim rslt = Nothing
            If Not String.IsNullOrEmpty(directoryName) Then
                rslt = directoryName & "/"
            Else
                rslt = String.Empty
            End If
            Return rslt

        End Get
    End Property

End Class
Module HttpRequestBaseExtensions
    <Extension()>
    Public Function IsSupportedMobileDevice(request As HttpRequestBase) As Boolean

        Dim isMobile As Boolean = request.Browser.IsMobileDevice
        Dim userAgent As String = request.UserAgent.ToLowerInvariant
        isMobile = isMobile And (userAgent.Contains("iphone") Or _
            userAgent.Contains("blackberry") Or _
            userAgent.Contains("mobile") Or _
            userAgent.Contains("windows ce") Or _
            userAgent.Contains("opera mini") Or _
            userAgent.Contains("palm") Or _
            userAgent.Contains("fennec") Or _
            userAgent.Contains("adobeair") Or _
            userAgent.Contains("ripple"))
        If userAgent.Contains("iphone") Or _
            userAgent.Contains("ipad") Then
            isMobile = False
        End If
        Return isMobile

    End Function
End Module

Public Class PRW_TypeDescriptor
    Public Property PRWType As String
    Public Property ModelUriString As String
End Class
'Public Module SrlzdCSHExtenstion
'    <Extension()> _
'    Public Function ImageLink(sCSH As AdministratorSvc.Slzble_CustomSvcHostModel) As String

'        With sCSH
'            Return "http://192.168.1.107/ImageSvc/image/" & .EndPtSuffix & "/" & .LastSurveyID & "/0"
'        End With

'    End Function
'End Module

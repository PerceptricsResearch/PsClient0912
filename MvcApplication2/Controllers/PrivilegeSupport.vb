Imports System.Collections.ObjectModel

Public Class PrivilegeSupport
    Public Property MySPM As AuthoringSvcNS.SurveyPrivilegeModel

    Public Function IsSubscriber(pbm As String) As Boolean
        Dim rslt As Boolean = False
        Try
            Dim xpbm As ULong = 0
            xpbm = ULong.Parse(pbm)
            If (xpbm And PrivEnum.GuestPortal) > 0 Then

            Else
                rslt = True
            End If
        Catch ex As Exception
            Dim dbgs = 2
        End Try

        Return rslt
    End Function

    Public Function PopulateShareLinkRowColxn_fromPrivBitMask(_spm As AuthoringSvcNS.SurveyPrivilegeModel) As List(Of ShareLinkRow)
        Dim rslt As New List(Of ShareLinkRow)
        Me.MySPM = _spm
        Dim rsltsrow = New ShareLinkRow With {
            .SurveyID = Me.MySPM.SurveyID, _
            .LinkName = "Results", _
            .LinkDescription = "Share the results of this survey.", _
            .IsShared = False}

        If (MySPM.PrivBitMask And PrivEnum.RsltsViewer) Or (MySPM.PrivBitMask And PrivEnum.RsltsViewerAny) > 0 Then
            rsltsrow.IsShared = True
        Else
            rsltsrow.IsShared = False
        End If
        Dim reviewrow = New ShareLinkRow With {
            .SurveyID = Me.MySPM.SurveyID, _
            .LinkName = "Review", _
            .LinkDescription = "Share this survey for review.", _
            .IsShared = False}

        If (MySPM.PrivBitMask And PrivEnum.AuthorReadOnly) > 0 Or ((MySPM.PrivBitMask And PrivEnum.ReadAny) > 0 AndAlso (MySPM.PrivBitMask And PrivEnum.WriteAny) = 0) Then
            reviewrow.IsShared = True
        Else
            reviewrow.IsShared = False
        End If
        rslt.Add(reviewrow)
        rslt.Add(rsltsrow)
        '' Dim nl = Me.MySPM.PrivEnumNameList
        'If Me.MySPM.PrivBitMask > 0 Then
        '    Me.None_chkbx.IsChecked = False
        'Else
        '    Me.None_chkbx.IsChecked = True
        'End If

        ''If nl.Contains(" WriteAny") Then
        ''    Me.ModifySurvey_chkbx.IsChecked = True
        ''End If

        'If (MySPM.PrivBitMask And PrivEnum.AuthorWrite) Or (MySPM.PrivBitMask And PrivEnum.WriteAny) > 0 Then
        '    Me.ModifySurvey_chkbx.IsChecked = True
        'Else
        '    Me.ModifySurvey_chkbx.IsChecked = False
        'End If


        ''Dim flag1 As Integer = 1
        'If (MySPM.PrivBitMask And PrivEnum.AuthorReadOnly) > 0 Or ((MySPM.PrivBitMask And PrivEnum.ReadAny) > 0 AndAlso (MySPM.PrivBitMask And PrivEnum.WriteAny) = 0) Then
        '    Me.AuthorViewOnly_chkbx.IsChecked = True
        'Else
        '    Me.AuthorViewOnly_chkbx.IsChecked = False
        'End If
        Return rslt
    End Function

    Public Function PopulatePrivBitMask_fromLinkRowColxn(_linkspkg As ShareSurveyLinksPackage) As ObservableCollection(Of AuthoringSvcNS.SurveyPrivilegeModel)
        Dim rslt As ObservableCollection(Of AuthoringSvcNS.SurveyPrivilegeModel) = _linkspkg.SPMColxn
        Dim privTotal As ULong = 0
        Dim sid = _linkspkg.LinkRowsColxn.FirstOrDefault.SurveyID
        Me.MySPM = _linkspkg.SPMColxn.Where(Function(spm) spm.SurveyID = sid).FirstOrDefault
        privTotal = Me.MySPM.PrivBitMask
        Dim isanyshared = False
        For Each lr As ShareLinkRow In _linkspkg.LinkRowsColxn
            Select Case (True)
                Case lr.LinkName = "Results"
                    If (MySPM.PrivBitMask And PrivEnum.RsltsViewer) > 0 Then
                        If Not lr.IsShared Then
                            privTotal = privTotal - PrivEnum.RsltsViewer
                        End If
                    Else
                        If lr.IsShared Then
                            isanyshared = True
                            privTotal = privTotal + PrivEnum.RsltsViewer
                        End If
                    End If

                Case lr.LinkName = "Review"
                    If (MySPM.PrivBitMask And PrivEnum.AuthorReadOnly) > 0 Then
                        If Not lr.IsShared Then
                            privTotal = privTotal - PrivEnum.AuthorReadOnly
                        End If
                    Else
                        If lr.IsShared Then
                            isanyshared = True
                        End If
                    End If
            End Select
        Next
        If (MySPM.PrivBitMask And PrivEnum.AuthorReadOnly) > 0 Then
            If Not isanyshared Then
                privTotal = privTotal - PrivEnum.AuthorReadOnly
            End If
        Else
            If isanyshared Then
                privTotal = privTotal + PrivEnum.AuthorReadOnly
            End If
        End If
        Me.MySPM.PrivBitMask = privTotal
        Return rslt
    End Function
End Class
Public Class ShareLinkRow
    Public Property SurveyID As Integer
    Public Property LinkName As String
    Public Property LinkDescription As String
    Public Property IsShared As Boolean = False
End Class
Public Class ShareSurveyLinksPackage
    Public Property LinkRowsColxn As List(Of ShareLinkRow)
    Public Property SPMColxn As ObservableCollection(Of AuthoringSvcNS.SurveyPrivilegeModel)
End Class

<Flags()> _
Public Enum PrivEnum
    AuthorReadOnly = 1
    AuthorWrite = 2
    RsltsViewer = 4
    Respondent = 8
    RDisp = 16
    RPost = 32
    PublishSurvey = 64
    LoginAdministrator = 128
    ReadAny = 256
    WriteAny = 512
    RsltsViewerAny = 1024
    Create = 2048
    DeleteAny = 4096
    PerceptricsAdministrator = 8192
    GuestPortal = 16384
End Enum
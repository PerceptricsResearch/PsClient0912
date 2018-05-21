Public Class SettingsSupport

    Private Function CreateSettingsItemsDefaults(_section) As List(Of SettingsItem)
        Dim rslt As New List(Of SettingsItem)
        Select Case True
            Case _section = "General"
                rslt.Add(New SettingsItem With {.SettingName = "Ignatz", _
                                                .SettingDescription = "brief ignatz description", _
                                                .SelectorType = "List", _
                                                .SettingValue = "here", _
                                                .CurValueNdx = 0, _
                                                .AlternativeValuesColxn = {"here", "there", "everywhere"}.ToList})
                rslt.Add(New SettingsItem With {.SettingName = "Horatz", _
                                .SettingDescription = "brief horatz", _
                                .SelectorType = "List", _
                                .SettingValue = "always", _
                                .CurValueNdx = 2, _
                                .AlternativeValuesColxn = {"once", "twice", "always"}.ToList})
                rslt.Add(New SettingsItem With {.SettingName = "Jonatz", _
                .SettingDescription = "briefly jonatz", _
                .SelectorType = "Switch", _
                .SettingValue = "On", _
                .CurValueNdx = 1, _
                .AlternativeValuesColxn = {"Off", "On"}.ToList})
        End Select
        Return rslt
    End Function


    Public Function PopulateDefaultSettings() As SaveSettingsPackage
        Dim rslt As New SaveSettingsPackage
        rslt.SettingsSectionColxn = New List(Of SettingsSection)
        With rslt.SettingsSectionColxn
            .Add(New SettingsSection With {.SectionName = "General", _
                                           .SettingsItemColxn = Me.CreateSettingsItemsDefaults("General")})
            .Add(New SettingsSection With {.SectionName = "Design", _
                                           .SettingsItemColxn = New List(Of SettingsItem)})
            .Add(New SettingsSection With {.SectionName = "Results", _
                                            .SettingsItemColxn = New List(Of SettingsItem)})
            .Add(New SettingsSection With {.SectionName = "Publish", _
                                           .SettingsItemColxn = New List(Of SettingsItem)})
            .Add(New SettingsSection With {.SectionName = "Guests", _
                                           .SettingsItemColxn = New List(Of SettingsItem)})
        End With

        Return rslt
    End Function


End Class
Public Class SettingsSection
    Public Property SectionName As String
    Public Property SettingsItemColxn As List(Of SettingsItem)
End Class
Public Class SettingsItem
    Public Property SettingName As String
    Public Property SettingDescription As String
    Public Property SettingValue As String
    Public Property AlternativeValuesColxn As List(Of String)
    Public Property CurValueNdx As Integer
    Public Property SelectorType As String
    Public Property IsEditable As Boolean
End Class
Public Class SaveSettingsPackage
    Public Property SettingsSectionColxn As List(Of SettingsSection)
    Public Property ModifiedDateTime As String
End Class
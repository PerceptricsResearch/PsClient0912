Imports MvcApplication2.AuthoringSvcNS
Public Class SurveyInfoSupport
    Public Function NoteNew() As SurveyInfoItem
        Dim rslt As SurveyInfoItem = Nothing
        rslt = New SurveyInfoItem With {.InfoName = "note", _
                                        .ElementsColxn = {New Srlzd_KVP With {.Key = "date", _
                                                                              .Valu = DateTime.Today.ToString}, _
                                                          New Srlzd_KVP With {.Key = "title", _
                                                                              .Valu = "New Note"}, _
                                                          New Srlzd_KVP With {.Key = "body", _
                                                                              .Valu = "<p></p>"}}.ToList}
        Return rslt
    End Function

    Public Function CommentNew() As SurveyInfoItem
        Dim rslt As SurveyInfoItem = Nothing
        rslt = New SurveyInfoItem With {.InfoName = "comment", _
                                        .ElementsColxn = {New Srlzd_KVP With {.Key = "date", _
                                                                              .Valu = DateTime.Today.ToString}, _
                                                          New Srlzd_KVP With {.Key = "title", _
                                                                              .Valu = "New Comment"}, _
                                                          New Srlzd_KVP With {.Key = "author", _
                                                                              .Valu = ""}, _
                                                          New Srlzd_KVP With {.Key = "body", _
                                                                              .Valu = "<p></p>"}}.ToList}
        Return rslt
    End Function

    Public Function PopulateDefaultSurveyInfos() As SurveyInfoPackage
        Dim rslt As New SurveyInfoPackage
        rslt.SurveyInfoSectionColxn = New List(Of SurveyInfoSection)
        With rslt.SurveyInfoSectionColxn
            .Add(New SurveyInfoSection With {.SectionTitle = "Description", _
                                             .SurveyInfoItemColxn = {New SurveyInfoItem With {.InfoName = "description", _
                                                                     .ElementsColxn = {New Srlzd_KVP With {.Key = "body", _
                                                                                                          .Valu = "<p>this is some note body</p>"}}.ToList}}.ToList})
            .Add(New SurveyInfoSection With {.SectionTitle = "Notes", _
                                             .DefaultSurveyInfoItem = NoteNew(), _
                                             .SurveyInfoItemColxn = {New SurveyInfoItem With {.InfoName = "note", _
                                                                      .ElementsColxn = {New Srlzd_KVP With {.Key = "date", _
                                                                                                           .Valu = DateTime.Today.ToString}, _
                                                                                       New Srlzd_KVP With {.Key = "title", _
                                                                                                           .Valu = "I am note title "}, _
                                                                                       New Srlzd_KVP With {.Key = "body", _
                                                                                                           .Valu = "<p>this is some note body</p>"}}.ToList}, _
                                                                     New SurveyInfoItem With {.InfoName = "note", _
                                                                      .ElementsColxn = {New Srlzd_KVP With {.Key = "date", _
                                                                                                           .Valu = DateTime.Today.ToString}, _
                                                                                       New Srlzd_KVP With {.Key = "title", _
                                                                                                           .Valu = "I am note title "}, _
                                                                                       New Srlzd_KVP With {.Key = "body", _
                                                                                                           .Valu = "<p>this is some note body</p>"}}.ToList}, _
                                                                     New SurveyInfoItem With {.InfoName = "note", _
                                                                      .ElementsColxn = {New Srlzd_KVP With {.Key = "date", _
                                                                                                           .Valu = DateTime.Today.ToString}, _
                                                                                       New Srlzd_KVP With {.Key = "title", _
                                                                                                           .Valu = "I am note title "}, _
                                                                                       New Srlzd_KVP With {.Key = "body", _
                                                                                                           .Valu = "<p>this is some note body</p>"}}.ToList}}.ToList})

            .Add(New SurveyInfoSection With {.SectionTitle = "Comments", _
                                             .DefaultSurveyInfoItem = CommentNew(), _
                                             .SurveyInfoItemColxn = {New SurveyInfoItem With {.InfoName = "comment", _
                                                                      .ElementsColxn = {New Srlzd_KVP With {.Key = "date", _
                                                                                                           .Valu = DateTime.Today.ToString}, _
                                                                                       New Srlzd_KVP With {.Key = "title", _
                                                                                                           .Valu = "I am comment title "}, _
                                                                                       New Srlzd_KVP With {.Key = "author", _
                                                                                                           .Valu = "I am comment author "}, _
                                                                                       New Srlzd_KVP With {.Key = "body", _
                                                                                                           .Valu = "<p>this is some note body</p>"}}.ToList}, _
                                                                     New SurveyInfoItem With {.InfoName = "comment", _
                                                                      .ElementsColxn = {New Srlzd_KVP With {.Key = "date", _
                                                                                                           .Valu = DateTime.Today.ToString}, _
                                                                                       New Srlzd_KVP With {.Key = "title", _
                                                                                                           .Valu = "I am comment title "}, _
                                                                                       New Srlzd_KVP With {.Key = "author", _
                                                                                                           .Valu = "I am comment author "}, _
                                                                                       New Srlzd_KVP With {.Key = "body", _
                                                                                                           .Valu = "<p>this is some note body</p>"}}.ToList}, _
                                                                     New SurveyInfoItem With {.InfoName = "comment", _
                                                                      .ElementsColxn = {New Srlzd_KVP With {.Key = "date", _
                                                                                                           .Valu = "July 5 2013"}, _
                                                                                       New Srlzd_KVP With {.Key = "title", _
                                                                                                           .Valu = "I am comment title "}, _
                                                                                       New Srlzd_KVP With {.Key = "author", _
                                                                                                           .Valu = "I am comment author "}, _
                                                                                       New Srlzd_KVP With {.Key = "body", _
                                                                                                           .Valu = "<p>this is some note body</p>"}}.ToList}}.ToList})

        End With
        Return rslt
    End Function
End Class
Public Class SurveyInfoPackage
    Public Property SurveyInfoSectionColxn As List(Of SurveyInfoSection)
    Public Property ModifiedDateTime As String
End Class
Public Class SurveyInfoItem
    Public Property ID As String = Guid.NewGuid.ToString("N")
    Public Property InfoName As String
    Public Property IsEditable As Boolean
    Public Property ElementsColxn As List(Of Srlzd_KVP)
End Class
Public Class SurveyInfoSection
    Public Property SectionTitle As String
    Public Property SectionDescription As String
    Public Property SurveyInfoItemColxn As List(Of SurveyInfoItem)
    Public Property DefaultSurveyInfoItem As SurveyInfoItem
End Class
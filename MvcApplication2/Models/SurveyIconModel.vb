Imports MvcApplication2.AuthoringSvcNS

Public Class SurveyIconModel
    Public Property SurveyGuidString As String
    Public Property SurveyName As String
    Public Property SurveyID As Integer
    Public Property PBM As ULong
    Public Property SurveyStateID As Integer
    Public Property SurveyType As Integer
    'Public Property URL As String
    'Public Property PageZeroURL As String
    'Public Property PrwType As String
    'Public Property ImageUrl As String
    'Public Property MetaDataURL As String
    'Public Property PCModelURL As String
    'Public Property ResultsModelURL As String
    'Public Property ResultsGrpListViewURL As String
    'Public Property ResultsGrpDefnViewURL As String
    'Public Property PublishSurveyURL As String
    'Public Property SurveysInfoViewURL As String
    Public Property HasNewResults As Boolean
    Public Property HasActiveRDents As Boolean
    Public Property ActiveRDentsCount As Integer
    Public Property HasSMDMarks As Boolean
End Class
Public Class BaseURLObject
    Public Property URL As String
    Public Property PageZeroURL As String
    Public Property PrwType As String
    Public Property ImageUrl As String
    Public Property MetaDataURL As String
    Public Property PCModelURL As String
    Public Property ResultsModelURL As String
    Public Property ResultsGrpListViewURL As String
    Public Property ResultsGrpDefnViewURL As String
    Public Property PublishSurveyURL As String
    Public Property SurveysInfoViewURL As String
End Class
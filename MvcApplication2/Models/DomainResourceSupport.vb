Public Class DomainResourceSupport

End Class
Public Class DomainItem
    Public Property Name As String
    Public Property ItemCount As Integer
    Public Property CurrentPageNum As Integer = -1
    Public Property DROUrl As String
    Public Property DRO As New Object
End Class
Public Class DomainResourceObject
    Public Property Name As String
    Public Property ItemCount As Integer
    Public Property DROItemList As List(Of DROItem)
End Class
Public Class DROItem
    Public Property IsUrl As Boolean = False
    Public Property ResourceItem As String 'could be html(VwP("someview")) or a Url(Url.Action("someview"))
End Class
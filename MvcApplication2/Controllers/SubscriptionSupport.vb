Imports MvcApplication2.AuthoringSvcNS
Public Class SubscriptionSupport
    Public Function PopulateDefaultSubscriptionInfos() As SubscriptionInfoPackage
        Dim rslt As New SubscriptionInfoPackage
        rslt.SubscriptionItemsColxn = New List(Of SubscriptionItem)
        Dim basicsubscription = New SubscriptionItem With {.SubscriptionName = "Basic", _
                                            .SubscriptionDescription = "The simplest and least expensive. Perfect for small survey populations.", _
                                            .FeaturesColxn = {"Survey Templates", "Web Publishing", "Real time Results"}.ToList, _
                                            .SubscriptionValuesColxn = {New Srlzd_KVP With {.Key = "Surveys", .Valu = "3"}, _
                                                                        New Srlzd_KVP With {.Key = "Population", .Valu = "100"}, _
                                                                        New Srlzd_KVP With {.Key = "Price", .Valu = "$20 per month"}}.ToList}
        basicsubscription.IsCurrentSubscription = True
        rslt.CurrentSubscription = basicsubscription
        rslt.SubscriptionItemsColxn.Add(basicsubscription)
        rslt.SubscriptionItemsColxn.Add(New SubscriptionItem With {.SubscriptionName = "Researcher", _
                                    .SubscriptionDescription = "Basic plus useful features, more surveys and larger survey populations.", _
                                    .FeaturesColxn = {"Advanced Results Features", "Results Sharing", "Advanced Design Templates"}.ToList, _
                                    .SubscriptionValuesColxn = {New Srlzd_KVP With {.Key = "Surveys", .Valu = "6"}, _
                                                                        New Srlzd_KVP With {.Key = "Population", .Valu = "250"}, _
                                                                        New Srlzd_KVP With {.Key = "Price", .Valu = "$50 per month"}}.ToList})
        rslt.SubscriptionItemsColxn.Add(New SubscriptionItem With {.SubscriptionName = "Professional", _
                            .SubscriptionDescription = "Advanced features, mores surveys, and larger populations.", _
                            .FeaturesColxn = {"Reviewer Comments", "Advanced Survey Content", "Statistical Metrics"}.ToList, _
                            .SubscriptionValuesColxn = {New Srlzd_KVP With {.Key = "Surveys", .Valu = "9"}, _
                                                                        New Srlzd_KVP With {.Key = "Population", .Valu = "1000"}, _
                                                                        New Srlzd_KVP With {.Key = "Price", .Valu = "$100 per month"}}.ToList})
        Return rslt
    End Function
End Class
Public Class SubscriptionItem
    Public Property SubscriptionName As String
    Public Property SubscriptionDescription As String
    Public Property IsCurrentSubscription As Boolean
    Public Property SubscriptionValuesColxn As List(Of Srlzd_KVP)
    Public Property FeaturesColxn As List(Of String)
    Public Property IsEditable As Boolean
End Class

Public Class SubscriptionInfoPackage
    Public Property SubscriptionItemsColxn As List(Of SubscriptionItem)
    Public Property CurrentSubscription As SubscriptionItem
    Public Property ModifiedDateTime As String
End Class
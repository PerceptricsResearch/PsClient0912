' Note: For instructions on enabling IIS6 or IIS7 classic mode, 
' visit http://go.microsoft.com/?LinkId=9394802

Public Class MvcApplication
    Inherits System.Web.HttpApplication

    Shared Sub RegisterGlobalFilters(ByVal filters As GlobalFilterCollection)
        filters.Add(New HandleErrorAttribute())
    End Sub

    Shared Sub RegisterRoutes(ByVal routes As RouteCollection)
        routes.IgnoreRoute("{resource}.axd/{*pathInfo}")

        routes.MapRoute( _
            "SubscriberMain", _
            "SubscriberMain", _
            New With {.controller = "SubscriberMain", .action = "SubscriberHome"})

        'routes.MapRoute( _
        '    "RDentPortal", _
        '    "RDentPortal", _
        '    New With {.controller = "RDentPortal", .action = "Index"})

        routes.MapRoute( _
            "RDentPortal", _
            "RDentPortal/{action}/{survey}/{rdent}", _
            New With {.controller = "RDentPortal", .action = "Index", .survey = "0", .rdent = "0"})

        routes.MapRoute( _
            "GuestPortal", _
            "GuestPortal/{action}/{id}/{guest}/{svc}", _
            New With {.controller = "GuestPortal", .action = "Index", .id = UrlParameter.Optional, .guest = UrlParameter.Optional, .svc = UrlParameter.Optional})
        '"GuestPortal/{action}/{survey}/{guest}", _
        'New With {.controller = "GuestPortal", .action = "Index", .survey = "0", .guest = "0"})

        routes.MapRoute( _
            "MetricsPortal", _
            "MetricsPortal/{action}/{id}/{guest}/{svc}", _
            New With {.controller = "MetricsPortal", .action = "Index", .id = UrlParameter.Optional, .guest = UrlParameter.Optional, .svc = UrlParameter.Optional})


        ' MapRoute takes the following parameters, in order:
        ' (1) Route name
        ' (2) URL with parameters
        ' (3) Parameter defaults
        routes.MapRoute( _
            "Default", _
            "{controller}/{action}/{id}", _
            New With {.controller = "Home", .action = "Index", .id = UrlParameter.Optional} _
        )
    End Sub

    Sub Application_Start()
        ViewEngines.Engines.Add(New MobileViewEngine)
        AreaRegistration.RegisterAllAreas()

        RegisterGlobalFilters(GlobalFilters.Filters)
        RegisterRoutes(RouteTable.Routes)
    End Sub
End Class

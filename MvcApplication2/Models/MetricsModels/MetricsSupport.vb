

Public Class MetricsSupport
    Public Function MakeContextDocument(excelrows As List(Of IEnumerable(Of Object))) As ComponentSeriesPackage
        Dim rslt As ComponentSeriesPackage = Nothing
        Try
            Dim segmentinfocolxn = Me.RetrieveSegmentInfoColxn()
            Dim optiondxnry = segmentinfocolxn.Select(Function(si) si.OptionColxn).SelectMany(Function(x) x.Select(Function(xs) xs)).ToDictionary(Function(oi) oi.Name)
            Dim metricinfodxnry = Me.RetrieveMetricInfoColxn.ToDictionary(Function(m) m.Name)
            Dim excelcomponentrows = excelrows.Where(Function(r) r.First.ToString = "Component").ToList
            Dim componentdxnry = Me.RetrieveComponentInfoColxn(excelcomponentrows).ToDictionary(Function(ci) ci.Name)
            'Dim contextinfo = Me.MakeContextDocument(excelrows.ToList)
            'Dim exdxnry = excelrows.ToDictionary(Function(r) r.First.ToString)
            Dim mvindx = 0
            Dim hindx = 0
            Dim csicolxn = New List(Of ComponentSeriesItem)
            For Each xkvp In componentdxnry
                Dim kvp = xkvp
                Dim csi = New ComponentSeriesItem With {.ComponentInfoID = kvp.Value.ID,
                                                        .Name = kvp.Key,
                                                        .HorizonItemColxn = New List(Of HorizonItem)}
                Dim excompkvps = excelrows.Where(Function(r) r.First.ToString = kvp.Key) 'gets all rows for a component...
                For i = 0 To 23 '24 periods..need to get from excel row Periods
                    hindx += 1
                    Dim hi As New HorizonItem With {.ComponentInfoID = csi.ComponentInfoID,
                                                    .Period = i,
                                                    .ID = hindx,
                                                    .MetricValueColxn = New List(Of MetricValueItem),
                                                    .SegmentID = 99}
                    For Each mi In xkvp.Value.MetricInfoColxn
                        Dim xmi = mi
                        'exmetric row is an array of period values...first two positions are component name and metricinfo name
                        'this query selects by metricinfo.name...is at ndx 1 in the zero based row array...
                        Dim exmetricrow = excompkvps.Where(Function(er) er.Select(Function(eri) eri).ElementAt(1) = xmi.Name).FirstOrDefault
                        If Not IsNothing(exmetricrow) Then
                            mvindx += 1
                            Dim pvalue = 0
                            pvalue = exmetricrow.ElementAtOrDefault(i + 2)
                            If IsNothing(pvalue) Then
                                pvalue = 0
                            End If
                            hi.MetricValueColxn.Add(New MetricValueItem(mvindx, xmi.ID, pvalue))
                        End If
                    Next
                    'only want to add this if there is a different set of values...right now it always adds one...
                    csi.HorizonItemColxn.Add(hi)
                Next
                csicolxn.Add(csi)
            Next
            rslt = Me.BuilTestSeries()
            rslt.ComponentSeriesDxnry = csicolxn.ToDictionary(Function(cs) cs.ComponentInfoID.ToString)
            rslt.ContextInfo.Description = "I came from an excel upload..."
        Catch ex As Exception
            Dim nogo = 2
        End Try
        Return rslt
    End Function
    Public Function MakeContextInfo(excelrows As List(Of IEnumerable(Of Object))) As ContextInfoItem
        Dim rslt As New ContextInfoItem
        Dim cntxtlabels = New List(Of String)() From {"Date", "Description", "MgmtContext", "OrgContext", "FiscalContext"}
        Dim excelcontextrows = excelrows.Where(Function(r) cntxtlabels.Contains(r.First.ToString))
        Dim segmentinfocolxn = Me.RetrieveSegmentInfoColxn()
        Dim optiondxnry = segmentinfocolxn.Select(Function(si) si.OptionColxn).SelectMany(Function(x) x.Select(Function(xs) xs)).ToDictionary(Function(oi) oi.ID)
        Dim ssi1 = New List(Of SelectedSegmentItem) From _
                   {
                    New SelectedSegmentItem With {.ID = 1, .SegmentInfoID = 1, .SegmentOptionID = 1,
                                           .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                           .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue}, _
                    New SelectedSegmentItem With {.ID = 2, .SegmentInfoID = 2, .SegmentOptionID = 5,
                                           .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                           .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue}, _
                    New SelectedSegmentItem With {.ID = 3, .SegmentInfoID = 3, .SegmentOptionID = 13,
                                           .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                           .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue}
                    }
        Dim cii = New ContextInfoItem With _
                  {.ID = 1,
                   .AsOfDate = Date.Today.ToString,
                   .Description = "This is a description you entered when you saved this",
                   .ContextEnumValues = ssi1.Select(Function(s) s.EnumValue).ToList,
                    .ContextNamesColxn = ssi1.Select(Function(s) s.Name).ToList,
                    .ContextSelection = ssi1.Select(Function(s) s.EnumValue).Sum
                    }

        Return rslt
    End Function
    Public Function RetrieveMetricInfoColxn() As List(Of MetricInfoItem)
        Dim rslt As List(Of MetricInfoItem) = Nothing
        rslt = New List(Of MetricInfoItem) From _
    {
        New MetricInfoItem(1, "Count"),
        New MetricInfoItem(2, "Cost"),
        New MetricInfoItem(3, "Deployable Hours"),
        New MetricInfoItem(4, "Standard Billing Rate"),
        New MetricInfoItem(5, "Standard Utilization Pct"),
        New MetricInfoItem(6, "Realized Rate"),
        New MetricInfoItem(7, "Deployable Capacity"),
        New MetricInfoItem(8, "Incurred Hours"),
        New MetricInfoItem(9, "Implied Cost"),
        New MetricInfoItem(10, "Incurred Billing Value"),
        New MetricInfoItem(11, "Implied Revenue")
    }
        Return rslt
    End Function
    Public Function RetrieveComponentInfoColxn(excomprows As List(Of IEnumerable(Of Object))) As List(Of ComponentInfoItem)
        Dim rslt As List(Of ComponentInfoItem) = Nothing
        Dim miis = New List(Of MetricInfoItem) From _
    {
        New MetricInfoItem(1, "Count"),
        New MetricInfoItem(2, "Cost"),
        New MetricInfoItem(3, "Deployable Hours"),
        New MetricInfoItem(4, "Standard Billing Rate"),
        New MetricInfoItem(5, "Standard Utilization Pct")
    }

        Dim miis2 = New List(Of MetricInfoItem) From _
            {
                New MetricInfoItem(6, "Realized Rate"),
                New MetricInfoItem(7, "Deployable Capacity"),
                New MetricInfoItem(8, "Incurred Hours"),
                New MetricInfoItem(9, "Implied Cost"),
                New MetricInfoItem(10, "Incurred Billing Value"),
                New MetricInfoItem(11, "Implied Revenue")
            }
        If (Not IsNothing(excomprows)) Then
            rslt = New List(Of ComponentInfoItem)
            Dim cindx = 0
            For Each exrow In excomprows.Take(6)
                cindx += 1
                Dim excompname = exrow.ElementAt(1)
                rslt.Add(New ComponentInfoItem With {.ID = cindx, .Name = excompname, .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                        .MetricInfoColxn = miis})
            Next
            rslt.Add(New ComponentInfoItem With {.ID = 7, .Name = "Realization", .DomainInfoID = 2, .PeriodZeroDate = "01/01/2013", _
                                        .MetricInfoColxn = miis2})
        Else
            rslt = New List(Of ComponentInfoItem) From _
        {
            New ComponentInfoItem With {.ID = 1, .Name = "Partners", .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                        .MetricInfoColxn = miis},
            New ComponentInfoItem With {.ID = 2, .Name = "Sr. Managers", .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                        .MetricInfoColxn = miis},
            New ComponentInfoItem With {.ID = 3, .Name = "Managers", .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                        .MetricInfoColxn = miis},
            New ComponentInfoItem With {.ID = 4, .Name = "Seniors", .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                        .MetricInfoColxn = miis},
            New ComponentInfoItem With {.ID = 5, .Name = "Staff", .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                        .MetricInfoColxn = miis}, _
            New ComponentInfoItem With {.ID = 6, .Name = "Admin", .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                        .MetricInfoColxn = miis}, _
            New ComponentInfoItem With {.ID = 7, .Name = "Realization", .DomainInfoID = 2, .PeriodZeroDate = "01/01/2013", _
                                        .MetricInfoColxn = miis2}
        }
        End If

        Return rslt
    End Function
    Public Function RetrieveSegmentInfoColxn() As List(Of SegmentInfoItem)
        Dim rslt As List(Of SegmentInfoItem) = Nothing
        Dim soc1 = New List(Of SegmentOptionItem) From _
    {
        New SegmentOptionItem With {.ID = 1, .Name = "Simulation", .EnumValue = Math.Pow(2, 0)}, _
        New SegmentOptionItem With {.ID = 2, .Name = "Budget", .EnumValue = Math.Pow(2, 1)}, _
        New SegmentOptionItem With {.ID = 3, .Name = "Forecast", .EnumValue = Math.Pow(2, 2)}, _
        New SegmentOptionItem With {.ID = 4, .Name = "Actual", .EnumValue = Math.Pow(2, 3)}
    }
        Dim soc2 = New List(Of SegmentOptionItem) From _
            {
                New SegmentOptionItem With {.ID = 5, .Name = "Enterprise", .EnumValue = Math.Pow(2, 4)}, _
                New SegmentOptionItem With {.ID = 6, .Name = "Architecture", .EnumValue = Math.Pow(2, 5)}, _
                New SegmentOptionItem With {.ID = 7, .Name = "Engineering", .EnumValue = Math.Pow(2, 6)}, _
                New SegmentOptionItem With {.ID = 8, .Name = "Planning", .EnumValue = Math.Pow(2, 7)}, _
                New SegmentOptionItem With {.ID = 9, .Name = "Indy", .EnumValue = Math.Pow(2, 8)}, _
                New SegmentOptionItem With {.ID = 10, .Name = "St. Louis", .EnumValue = Math.Pow(2, 9)}, _
                New SegmentOptionItem With {.ID = 11, .Name = "Chicago", .EnumValue = Math.Pow(2, 10)}, _
                New SegmentOptionItem With {.ID = 12, .Name = "Austin", .EnumValue = Math.Pow(2, 11)}
            }
        Dim soc3 = New List(Of SegmentOptionItem) From _
            {
                New SegmentOptionItem With {.ID = 13, .Name = "FY13", .EnumValue = Math.Pow(2, 12)}, _
                New SegmentOptionItem With {.ID = 14, .Name = "FY14", .EnumValue = Math.Pow(2, 13)}, _
                New SegmentOptionItem With {.ID = 15, .Name = "FY15", .EnumValue = Math.Pow(2, 14)}, _
                New SegmentOptionItem With {.ID = 16, .Name = "FY13-15", .EnumValue = Math.Pow(2, 15)}
            }
        'Dim soc4 = New List(Of SegmentOptionItem) From _
        '    {
        '        New SegmentOptionItem With {.ID = 17, .Name = "Current"}, _
        '        New SegmentOptionItem With {.ID = 18, .Name = "Draft"}, _
        '        New SegmentOptionItem With {.ID = 19, .Name = "Sandbox"}
        '    }
        rslt = New List(Of SegmentInfoItem) From _
            {
                New SegmentInfoItem With {.ID = 1, .Name = "Management Context", .OptionColxn = soc1},
                New SegmentInfoItem With {.ID = 2, .Name = "Organization Context", .OptionColxn = soc2},
                New SegmentInfoItem With {.ID = 3, .Name = "Fiscal Context", .OptionColxn = soc3}
            }
        Return rslt
    End Function
    Public Function BuilTestSeries() As ComponentSeriesPackage
        ' creates Metric values associated with a list of componentinfo.metricsinfo
        Dim rslt As ComponentSeriesPackage = Nothing
        Try

            Dim mvis = New List(Of MetricValueItem) From _
                {
                    New MetricValueItem(1, 1, "2"),
                    New MetricValueItem(2, 2, "4"),
                    New MetricValueItem(3, 3, "8")
                }
            Dim csicolxn = New List(Of ComponentSeriesItem) From _
                {
                    New ComponentSeriesItem With {.ID = 1, .Name = "Partners", .ComponentInfoID = 1, _
                                                  .HorizonItemColxn = New List(Of HorizonItem) From _
                                {
                                    New HorizonItem With {.ID = 1, .ComponentInfoID = 1, .Period = 0, _
                                                          .MetricValueColxn = New List(Of MetricValueItem) From _
                                        {
                                            New MetricValueItem(1, 1, "10"),
                                            New MetricValueItem(2, 2, "1200000"),
                                            New MetricValueItem(3, 3, "6000"),
                                            New MetricValueItem(4, 4, "250"),
                                            New MetricValueItem(5, 5, "70")
                                        }
                                    },
                                    New HorizonItem With {.ID = 7, .ComponentInfoID = 1, .Period = 6, _
                                                          .MetricValueColxn = New List(Of MetricValueItem) From _
                                        {
                                            New MetricValueItem(31, 1, "8"),
                                            New MetricValueItem(32, 2, "960000"),
                                            New MetricValueItem(33, 3, "4800"),
                                            New MetricValueItem(34, 4, "250"),
                                            New MetricValueItem(35, 5, "70")
                                        }
                                    },
                                    New HorizonItem With {.ID = 8, .ComponentInfoID = 1, .Period = 20, _
                                                          .MetricValueColxn = New List(Of MetricValueItem) From _
                                        {
                                            New MetricValueItem(36, 1, "9"),
                                            New MetricValueItem(37, 2, "1070000"),
                                            New MetricValueItem(38, 3, "5400"),
                                            New MetricValueItem(39, 4, "250"),
                                            New MetricValueItem(40, 5, "70")
                                        }
                                    }
                                }
                    },
                    New ComponentSeriesItem With {.ID = 2, .Name = "Sr. Managers", .ComponentInfoID = 2, _
                                                  .HorizonItemColxn = New List(Of HorizonItem) From _
                                {
                                    New HorizonItem With {.ID = 2, .ComponentInfoID = 2, .Period = 0, _
                                                          .MetricValueColxn = New List(Of MetricValueItem) From _
                                        {
                                            New MetricValueItem(6, 1, "20"),
                                            New MetricValueItem(7, 2, "2000000"),
                                            New MetricValueItem(8, 3, "24000"),
                                            New MetricValueItem(9, 4, "180"),
                                            New MetricValueItem(10, 5, "90")
                                        }
                                    }
                                }
                    },
                    New ComponentSeriesItem With {.ID = 3, .Name = "Managers", .ComponentInfoID = 3, _
                                                  .HorizonItemColxn = New List(Of HorizonItem) From _
                                {
                                    New HorizonItem With {.ID = 3, .ComponentInfoID = 3, .Period = 0, _
                                                          .MetricValueColxn = New List(Of MetricValueItem) From _
                                        {
                                            New MetricValueItem(11, 1, "40"),
                                            New MetricValueItem(12, 2, "3200000"),
                                            New MetricValueItem(13, 3, "56000"),
                                            New MetricValueItem(14, 4, "120"),
                                            New MetricValueItem(15, 5, "90")
                                        }
                                }
                             }
                    },
                    New ComponentSeriesItem With {.ID = 4, .Name = "Seniors", .ComponentInfoID = 4, _
                                                  .HorizonItemColxn = New List(Of HorizonItem) From _
                                {
                                    New HorizonItem With {.ID = 4, .ComponentInfoID = 4, .Period = 0, _
                                                          .MetricValueColxn = New List(Of MetricValueItem) From _
                                        {
                                            New MetricValueItem(16, 1, "25"),
                                            New MetricValueItem(17, 2, "1250000"),
                                            New MetricValueItem(18, 3, "50000"),
                                            New MetricValueItem(19, 4, "80"),
                                            New MetricValueItem(20, 5, "90")
                                        }
                                    }
                                }
                    },
                    New ComponentSeriesItem With {.ID = 5, .Name = "Staff", .ComponentInfoID = 5, _
                                                  .HorizonItemColxn = New List(Of HorizonItem) From _
                                {
                                    New HorizonItem With {.ID = 5, .ComponentInfoID = 5, .Period = 0, _
                                                          .MetricValueColxn = New List(Of MetricValueItem) From _
                                        {
                                            New MetricValueItem(21, 1, "20"),
                                            New MetricValueItem(22, 2, "800000"),
                                            New MetricValueItem(23, 3, "40000"),
                                            New MetricValueItem(24, 4, "50"),
                                            New MetricValueItem(25, 5, "90")
                                        }
                                    }
                                }
                    },
                    New ComponentSeriesItem With {.ID = 6, .Name = "Admin", .ComponentInfoID = 6, _
                                                  .HorizonItemColxn = New List(Of HorizonItem) From _
                                {
                                    New HorizonItem With {.ID = 6, .ComponentInfoID = 6, .Period = 0, _
                                                          .MetricValueColxn = New List(Of MetricValueItem) From _
                                        {
                                            New MetricValueItem(21, 1, "20"),
                                            New MetricValueItem(22, 2, "400000"),
                                            New MetricValueItem(23, 3, "40000"),
                                            New MetricValueItem(24, 4, "50"),
                                            New MetricValueItem(25, 5, "90")
                                        }
                                    }
                                }
                    },
                    New ComponentSeriesItem With {.ID = 7, .Name = "Realization", .ComponentInfoID = 7, _
                                                  .HorizonItemColxn = New List(Of HorizonItem) From _
                                {
                                    New HorizonItem With {.ID = 6, .ComponentInfoID = 7, .Period = 0, _
                                                          .MetricValueColxn = New List(Of MetricValueItem) From _
                                        {
                                            New MetricValueItem(26, 6, "112"),
                                            New MetricValueItem(27, 7, "176000"),
                                            New MetricValueItem(28, 8, "142000"),
                                            New MetricValueItem(29, 9, "8450000"),
                                            New MetricValueItem(30, 10, "1872000"),
                                            New MetricValueItem(31, 11, "15827000")
                                        }
                                    },
                                    New HorizonItem With {.ID = 9, .ComponentInfoID = 7, .Period = 6, _
                                                          .MetricValueColxn = New List(Of MetricValueItem) From _
                                        {
                                            New MetricValueItem(41, 6, "110"),
                                            New MetricValueItem(42, 7, "176000"),
                                            New MetricValueItem(43, 8, "142000"),
                                            New MetricValueItem(44, 9, "6050000"),
                                            New MetricValueItem(45, 10, "1872000"),
                                            New MetricValueItem(46, 11, "15827000")
                                        }
                                    },
                                    New HorizonItem With {.ID = 10, .ComponentInfoID = 7, .Period = 20, _
                                                          .MetricValueColxn = New List(Of MetricValueItem) From _
                                        {
                                            New MetricValueItem(47, 6, "111"),
                                            New MetricValueItem(48, 7, "176000"),
                                            New MetricValueItem(49, 8, "142000"),
                                            New MetricValueItem(50, 9, "7250000"),
                                            New MetricValueItem(51, 10, "1872000"),
                                            New MetricValueItem(52, 11, "15827000")
                                        }
                                    }
                                }
                    }
                }
            Dim segmentinfocolxn = Me.RetrieveSegmentInfoColxn()
            Dim optiondxnry = segmentinfocolxn.Select(Function(si) si.OptionColxn).SelectMany(Function(x) x.Select(Function(xs) xs)).ToDictionary(Function(oi) oi.ID)
            Dim ssi1 = New List(Of SelectedSegmentItem) From _
                       {
                        New SelectedSegmentItem With {.ID = 1, .SegmentInfoID = 1, .SegmentOptionID = 1,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue}, _
                        New SelectedSegmentItem With {.ID = 2, .SegmentInfoID = 2, .SegmentOptionID = 5,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue}, _
                        New SelectedSegmentItem With {.ID = 3, .SegmentInfoID = 3, .SegmentOptionID = 13,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue}
                        }
            Dim cii = New ContextInfoItem With _
                      {.ID = 1,
                       .AsOfDate = Date.Today.ToString,
                       .Description = "This is a description you entered when you saved this",
                       .ContextEnumValues = ssi1.Select(Function(s) s.EnumValue).ToList,
                        .ContextNamesColxn = ssi1.Select(Function(s) s.Name).ToList,
                        .ContextSelection = ssi1.Select(Function(s) s.EnumValue).Sum
                        }
            rslt = New ComponentSeriesPackage With _
                   {.ComponentSeriesDxnry = csicolxn.ToDictionary(Function(csi) csi.ComponentInfoID.ToString), _
                    .ContextInfo = cii}
        Catch ex As Exception
            Dim x = 2
        End Try
        Return rslt
    End Function
    Public Function BuildTestDashboardPackage() As DashboardInfoColxnPackage
        Dim rslt As DashboardInfoColxnPackage = Nothing
        Try
            Dim miis = New List(Of MetricInfoItem) From _
                {
                    New MetricInfoItem(1, "Count"),
                    New MetricInfoItem(2, "Cost"),
                    New MetricInfoItem(3, "Deployable Hours"),
                    New MetricInfoItem(4, "Standard Billing Rate"),
                    New MetricInfoItem(5, "Standard Utilization Pct")
                }
            Dim cic1 = New List(Of ComponentInfoItem) From _
                {
                    New ComponentInfoItem With {.ID = 1, .Name = "Partners", .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                                .MetricInfoColxn = miis},
                    New ComponentInfoItem With {.ID = 2, .Name = "Sr. Managers", .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                                .MetricInfoColxn = miis},
                    New ComponentInfoItem With {.ID = 3, .Name = "Managers", .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                                .MetricInfoColxn = miis},
                    New ComponentInfoItem With {.ID = 4, .Name = "Seniors", .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                                .MetricInfoColxn = miis},
                    New ComponentInfoItem With {.ID = 5, .Name = "Staff", .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                                .MetricInfoColxn = miis}, _
                    New ComponentInfoItem With {.ID = 6, .Name = "Admin", .DomainInfoID = 1, .PeriodZeroDate = "01/01/2013", _
                                    .MetricInfoColxn = miis}
                }
            Dim miis2 = New List(Of MetricInfoItem) From _
                {
                    New MetricInfoItem(6, "Realized Rate"),
                    New MetricInfoItem(7, "Deployable Capacity"),
                    New MetricInfoItem(8, "Incurred Hours"),
                    New MetricInfoItem(9, "Implied Cost"),
                    New MetricInfoItem(10, "Incurred Billing Value"),
                    New MetricInfoItem(11, "Implied Revenue")
                }
            Dim cic2 = New List(Of ComponentInfoItem) From _
                {
                    New ComponentInfoItem With {.ID = 7, .Name = "Realization", .DomainInfoID = 2, .PeriodZeroDate = "01/01/2013", _
                                                .MetricInfoColxn = miis2}
                }

            Dim dmilist1 = New List(Of DomainMetricItem) From _
                {
                    New DomainMetricItem With {.ID = 1, .MetricInfo = New MetricInfoItem(20, "Total Count"), .Method = "sum", _
                                                 .IncludedMetricInfoColxn = New Dictionary(Of String, MetricInfoItem) From _
                                                                                {{"1", Nothing}}
                                 }, _
                    New DomainMetricItem With {.ID = 2, .MetricInfo = New MetricInfoItem(21, "Total Cost"), .Method = "sum", _
                                     .IncludedMetricInfoColxn = New Dictionary(Of String, MetricInfoItem) From _
                                                                                {{"2", Nothing}}}, _
                    New DomainMetricItem With {.ID = 3, _
                                                .IsVisible = False, _
                                               .MetricInfo = New MetricInfoItem(23, "Max Count"), .Method = "max", _
                                     .IncludedMetricInfoColxn = New Dictionary(Of String, MetricInfoItem) From _
                                                                                {{"1", Nothing}}}, _
                    New DomainMetricItem With {.ID = 4, .MetricInfo = New MetricInfoItem(23, "Deployable Hours"), .Method = "sum", _
                                     .IncludedMetricInfoColxn = New Dictionary(Of String, MetricInfoItem) From _
                                                                                {{"3", Nothing}}}
                }

            Dim dii1 = New DomainInfoItem With {.ID = 1, .DomainName = "Staffing Model", .DashboardInfoID = 1, .DomainMetricColxn = dmilist1, _
                                                .ComponentInfoColxn = cic1}
            Dim dii2 = New DomainInfoItem With {.ID = 2, .DomainName = "Realization Model", .DashboardInfoID = 1, .ComponentInfoColxn = cic2}
            Dim dic2 = New List(Of DomainInfoItem) From {dii1}
            Dim dic3 = New List(Of DomainInfoItem) From {dii2}
            Dim dic1 = New List(Of DomainInfoItem) From {dii1, dii2}

            ',
            'New SegmentInfoItem With {.ID = 4, .Name = "Version Context", .OptionColxn = soc4}
            Dim sicolxn = Me.RetrieveSegmentInfoColxn()
            Dim sodxnry As Dictionary(Of String, String)
            sodxnry = sicolxn.Select(Function(si) si.OptionColxn).SelectMany(Function(x) x.Select(Function(xs) New With {.ev = xs.EnumValue, .nm = xs.Name})).ToDictionary(Function(xxs) xxs.ev.ToString, Function(xxs) xxs.nm)
            Dim dbis = New List(Of DashboardInfoItem) From _
                {
                    New DashboardInfoItem With {.ID = 1, _
                                                .Guid = Guid.NewGuid.ToString("N"), _
                                                .Name = "Realization and Staffing",
                                                .PeriodInfo = New PeriodInfoItem,
                                                .DomainInfoColxn = dic1,
                                                .SegmentInfoColxn = sicolxn, _
                                                .SegmentOptionDxnry = sodxnry, _
                                                .DefaultDataContextURL = Nothing},
                    New DashboardInfoItem With {.ID = 2, _
                                                .Guid = Guid.NewGuid.ToString("N"), _
                                                .Name = "Staffing Only", .DomainInfoColxn = Nothing, .SegmentInfoColxn = Nothing},
                    New DashboardInfoItem With {.ID = 3, _
                                                .Guid = Guid.NewGuid.ToString("N"), _
                                                .Name = "Realization Only", .DomainInfoColxn = Nothing, .SegmentInfoColxn = Nothing}
                }
            rslt = New DashboardInfoColxnPackage With {.DashboardInfoColxn = dbis}
        Catch ex As Exception
            Dim x = 2
        End Try
        Return rslt
    End Function
    Public Function BuildTestContextInfoPackage() As ContextInfoPackage
        Dim rslt As ContextInfoPackage = Nothing
        Try
            Dim segmentinfocolxn = Me.RetrieveSegmentInfoColxn()
            Dim optiondxnry = segmentinfocolxn.Select(Function(si) si.OptionColxn).SelectMany(Function(x) x.Select(Function(xs) xs)).ToDictionary(Function(oi) oi.ID)


            Dim ssi1 = New List(Of SelectedSegmentItem) From _
                {New SelectedSegmentItem With {.ID = 1,
                                               .SegmentInfoID = 1,
                                               .SegmentOptionID = 1,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue},
                 New SelectedSegmentItem With {.ID = 1,
                                               .SegmentInfoID = 2,
                                               .SegmentOptionID = 5,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue},
                 New SelectedSegmentItem With {.ID = 1,
                                               .SegmentInfoID = 3,
                                               .SegmentOptionID = 13,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue}
                    }
            Dim ssi2 = New List(Of SelectedSegmentItem) From _
                    {New SelectedSegmentItem With {.ID = 1,
                                   .SegmentInfoID = 1,
                                   .SegmentOptionID = 2,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue},
                        New SelectedSegmentItem With {.ID = 1,
                                   .SegmentInfoID = 2,
                                   .SegmentOptionID = 5,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue},
                         New SelectedSegmentItem With {.ID = 1,
                                   .SegmentInfoID = 3,
                                   .SegmentOptionID = 13,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue}
                    }
            Dim ssi3 = New List(Of SelectedSegmentItem) From _
                    {New SelectedSegmentItem With {.ID = 1,
                       .SegmentInfoID = 1,
                       .SegmentOptionID = 3,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue},
                    New SelectedSegmentItem With {.ID = 1,
                       .SegmentInfoID = 2,
                       .SegmentOptionID = 5,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue},
                    New SelectedSegmentItem With {.ID = 1,
                       .SegmentInfoID = 3,
                       .SegmentOptionID = 13,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue}
                    }
            Dim ssi4 = New List(Of SelectedSegmentItem) From _
                    {New SelectedSegmentItem With {.ID = 1,
                        .SegmentInfoID = 1,
                        .SegmentOptionID = 4,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue},
                    New SelectedSegmentItem With {.ID = 1,
                         .SegmentInfoID = 2,
                            .SegmentOptionID = 5,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue},
                    New SelectedSegmentItem With {.ID = 1,
                            .SegmentInfoID = 3,
                        .SegmentOptionID = 13,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue}
                    }
            Dim ssi5 = New List(Of SelectedSegmentItem) From _
        {New SelectedSegmentItem With {.ID = 1,
            .SegmentInfoID = 1,
            .SegmentOptionID = 3,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue},
        New SelectedSegmentItem With {.ID = 1,
             .SegmentInfoID = 2,
                .SegmentOptionID = 6,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue},
        New SelectedSegmentItem With {.ID = 1,
                .SegmentInfoID = 3,
            .SegmentOptionID = 13,
                                               .Name = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.Name,
                                               .EnumValue = optiondxnry.Where(Function(kvp) kvp.Key = .SegmentOptionID).FirstOrDefault.Value.EnumValue}
        }

            Dim cic As New List(Of ContextInfoItem) From _
                {New ContextInfoItem() With {.AsOfDate = Date.Today.ToString,
                                            .ID = 1,
                                           .Description = "This is a description you entered when you saved this",
                                            .ContextEnumValues = ssi1.Select(Function(s) s.EnumValue).ToList,
                                             .ContextNamesColxn = ssi1.Select(Function(s) s.Name).ToList,
                                             .ContextSelection = ssi1.Select(Function(s) s.EnumValue).Sum},
                 New ContextInfoItem() With {.AsOfDate = Date.Today.ToString,
                                            .ID = 2,
                                           .Description = "This is a description you entered when you saved this",
                                            .ContextEnumValues = ssi2.Select(Function(s) s.EnumValue).ToList,
                                             .ContextNamesColxn = ssi2.Select(Function(s) s.Name).ToList,
                                             .ContextSelection = ssi2.Select(Function(s) s.EnumValue).Sum},
                 New ContextInfoItem() With {.AsOfDate = Date.Today.ToString,
                                            .ID = 3,
                                           .Description = "This is a description you entered when you saved this",
                                            .ContextEnumValues = ssi3.Select(Function(s) s.EnumValue).ToList,
                                             .ContextNamesColxn = ssi3.Select(Function(s) s.Name).ToList,
                                             .ContextSelection = ssi3.Select(Function(s) s.EnumValue).Sum},
                 New ContextInfoItem() With {.AsOfDate = Date.Today.ToString,
                                            .ID = 4,
                                           .Description = "This is a description you entered when you saved this",
                                            .ContextEnumValues = ssi4.Select(Function(s) s.EnumValue).ToList,
                                             .ContextNamesColxn = ssi4.Select(Function(s) s.Name).ToList,
                                             .ContextSelection = ssi4.Select(Function(s) s.EnumValue).Sum},
                 New ContextInfoItem() With {.AsOfDate = Date.Today.ToString,
                                            .ID = 5,
                                           .Description = "This is a description you entered when you saved this",
                                            .ContextEnumValues = ssi5.Select(Function(s) s.EnumValue).ToList,
                                             .ContextNamesColxn = ssi5.Select(Function(s) s.Name).ToList,
                                             .ContextSelection = ssi5.Select(Function(s) s.EnumValue).Sum},
                                 New ContextInfoItem() With {.AsOfDate = Date.Today.ToString,
                                            .ID = 6,
                                           .Description = "New Document",
                                            .ContextEnumValues = New List(Of Integer) From {0, 0, 0},
                                             .ContextNamesColxn = New List(Of String) From {"", "", ""},
                                             .ContextSelection = 0}
                }
            Dim cip As New ContextInfoPackage With {.ContextInfoColxn = cic,
                                                    .ContextSelection = Nothing}
            rslt = cip
        Catch ex As Exception

        End Try

        Return rslt
    End Function
End Class
Public Class ComponentSeriesPackage
    Public Property ComponentSeriesDxnry As Dictionary(Of String, ComponentSeriesItem)
    Public Property ContextInfo As ContextInfoItem
End Class
Public Class DashboardInfoColxnPackage
    Public Property DashboardInfoColxn As List(Of DashboardInfoItem)

End Class
Public Class MetricInfoItem

    Sub New(p1 As Integer, p2 As String)
        ' TODO: Complete member initialization 
        Me.ID = p1
        Me.Name = p2
        Me.MetricValueItem = New MetricValueItem(0, p1, 0)
    End Sub

    Public Property ID As Integer
    Public Property Name As String
    Public Property MetricValueItem As MetricValueItem
End Class
Public Class MetricValueItem

    Sub New(p1 As Integer, p2 As Integer, p3 As String)
        Me.ID = p1
        Me.MetricInfoID = p2
        Me.Value = p3
    End Sub

    Public Property ID As Integer
    Public Property MetricInfoID As Integer
    Public Property Value As String

End Class
Public Class HorizonItem
    Public Property ID As Integer
    Public Property SegmentID As Integer
    Public Property ComponentInfoID As Integer
    Public Property Period As Integer
    Public Property MetricValueColxn As List(Of MetricValueItem)
    Public Property IsEdit As Boolean = False
End Class
Public Class ComponentSeriesItem
    Public Property ID As Integer
    Public Property Name As String
    Public Property ComponentInfoID As Integer
    Public Property HorizonItemColxn As List(Of HorizonItem)
End Class
Public Class ComponentInfoItem
    Public Property ID As Integer
    Public Property DomainInfoID As Integer
    Public Property Name As String
    Public Property PeriodInterval As Integer = 52
    Public Property PeriodZeroDate As String
    Public Property HorizonItemColxn As List(Of HorizonItem)
    Public Property MetricInfoColxn As List(Of MetricInfoItem)
    Public Property IsAggregate As Boolean = False
    Public Property AggregateIDColxn As List(Of Integer) 'this list identifies the componentinfos included in the scope of the AggregateMethod
    Public Property AggregateMethod As String 'this identifies a method in a viewmodel
End Class
Public Class DomainMetricItem
    Public Property ID As Integer
    Public Property MetricInfo As MetricInfoItem
    Public Property IsVisible As Boolean = True
    Public Property IncludedMetricInfoColxn As Dictionary(Of String, MetricInfoItem)
    Public Property Method As String = "sum"
End Class
Public Class DomainInfoItem
    Public Property ID As Integer
    Public Property DomainName As String
    Public Property DashboardInfoID As Integer
    Public Property ViewUrl As String
    Public Property DomainMetricColxn As List(Of DomainMetricItem)
    Public Property ComponentInfoColxn As List(Of ComponentInfoItem)
End Class
Public Class SegmentOptionItem
    Public Property ID As Integer
    Public Property Name As String
    Public Property EnumValue As Integer
    Public Property IsSelected As Boolean = False
    Public Property BrushStr As String = "url(#mcrboffbrush)"
End Class
Public Class SegmentInfoItem
    Public Property ID As Integer
    Public Property Name As String
    Public Property SelectedBrushStr As String = "url(#mcrbonbrush)"
    Public Property DefaultBrushStr As String = "url(#mcrboffbrush)"
    Public Property OptionColxn As List(Of SegmentOptionItem)
End Class
Public Class SelectedSegmentItem
    Public Property ID As Integer
    Public Property SegmentInfoID As Integer
    Public Property SegmentOptionID As Integer
    Public Property Name As String
    Public Property EnumValue As Integer
End Class
Public Class ContextInfoItem
    Public Property ID As Integer
    Public Property Description As String
    Public Property ContextSelection As Integer
    Public Property ContextEnumValues As List(Of Integer)
    Public Property ContextNamesColxn As List(Of String)
    Public Property AsOfDate As String
    Public Function ToContextSelection() As Object
        Dim rslt As Object = Nothing
        Return rslt
    End Function
End Class
Public Class ContextSelectionItem

End Class
Public Class ContextInfoPackage
    Public Property ContextSelection As List(Of ContextSelectionItem)
    Public Property ContextInfoColxn As List(Of ContextInfoItem)
End Class
Public Class PeriodInfoItem
    Public Property DefaultPeriod As Integer = 24
    Public Property PeriodsCount As Integer = 24
    Public Property PeriodInterval As String = "Month"
    Public Property PeriodZeroDate As String = "01/01/2013"
    Public Property PeriodLastDate As String = "12/31/2013"
End Class
Public Class DashboardInfoItem
    Public Property ID As Integer
    Public Property Guid As String
    Public Property Name As String
    Public Property PeriodInfo As PeriodInfoItem
    Public Property DomainInfoColxn As List(Of DomainInfoItem)
    Public Property SegmentInfoColxn As List(Of SegmentInfoItem)
    Public Property SegmentOptionDxnry As Dictionary(Of String, String)
    Public Property DefaultDataContextURL As String
    Public Property AvailableContextsURL As String
    Public Property ViewUrl As String
End Class
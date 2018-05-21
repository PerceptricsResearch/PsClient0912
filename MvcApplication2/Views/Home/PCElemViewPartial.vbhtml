@ModelType MvcApplication2.PageContentElement
@Imports MvcApplication2    
@Code
    'all this layout stuff should go in the model code....is a like a poor man's html helper....and could be passed to javascript if i wanted....
    'this is really a SilverlightPageContentElement.ViewObject.ToHTMLView function...
    
    Dim checkboxvisibility = "hidden"
    'Dim x = Me.Culture
    'Dim xscale As Double = 0.7
    'Dim yscale As Double = 0.7
    Dim vwmodelname = Model.ViewModel.GetType.Name
    Dim pclemsdsid = Model.SDS_ID
    Dim pclemguidstr = Model.MyGuid.ToString
    Dim pcelembackground = Model.ToRGBAColor(Model.ViewModel.Background)
    
    Dim xpcelemheight = 0
    Dim xpcelemwidth = 0
    Dim pcelemDILeft = Model.DIModel.DI_CanvasLeft
    Dim pcelemDITop = Model.DIModel.DI_CanvasTop
    Dim pcelemDIZindex = Model.DIModel.DI_CanvasZindex
    If Not Double.IsNaN(Model.DIModel.DesignerItemHeight) Then
        xpcelemheight = Model.DIModel.DesignerItemHeight - 2
    End If
    If Not Double.IsNaN(Model.DIModel.DesignerItemWidth) Then
        xpcelemwidth = Model.DIModel.DesignerItemWidth - 2
    End If
    
    If TypeOf Model.ViewModel Is MvcApplication2.QuestOptionSetModel Then
        With CType(Model.ViewModel, MvcApplication2.QuestOptionSetModel)
            Dim itemscount = .ItemsObservableColxn.Count
            'Dim layoutmarginwidth = 0
            If xpcelemheight = 0 Then
                xpcelemheight = 85 * .UniGridRows
            End If
            If xpcelemwidth = 0 Then
                If .UniGridRows > 1 Then
                    xpcelemwidth = 307 * .UniGridColumns
                    'layoutmarginwidth = 0
                Else
                    xpcelemwidth = 398 * .UniGridColumns
                    'layoutmarginwidth = 0
                End If
            End If
            Dim itemsperrow = .UniGridColumns
            Dim qheight = xpcelemheight / Math.Max(1, .UniGridRows)
            Dim qwidth = xpcelemwidth / Math.Max(1, .UniGridColumns) '- layoutmarginwidth
            For Each qoim In .ItemsObservableColxn
                If Not qoim.DesignerItemHeight > 0 Or Not qoim.DesignerItemWidth > 0 Then
                    
                    qoim.DesignerItemSize = New System.Windows.Size(qwidth, qheight)
                    qoim.RespONSEModel.RCnt = MvcApplication2.PageContentElement.RN.Next(1, 100)
                End If
            Next
        End With
    Else

    End If
    'Dim pcelemheight = xpcelemheight & "px"
    'Dim pcelemwidth = xpcelemwidth & "px"
    
    Dim pctwidth = (xpcelemwidth / 1366) * 100
    Dim pctheight = (xpcelemheight / 768) * 100
    Dim pctleft = (pcelemDILeft / 1366) * 100
    Dim pcttop = (pcelemDITop / 768) * 100
    
    Dim spctwidth = PageContentElement.ToPct(pctwidth)
    Dim spctheight = PageContentElement.ToPct(pctheight)
    Dim spctleft = PageContentElement.ToPct(pctleft)
    Dim spcttop = PageContentElement.ToPct(pcttop)
    
    Dim dioffset = pcelemDILeft.ToString & " " & pcelemDITop.ToString
    Dim xdioffsetleft = Html.Raw(Json.Encode(pcelemDILeft))
    Dim xdioffsettop = Html.Raw(Json.Encode(pcelemDITop))
    Dim xdioffset = Html.Raw(Json.Encode(dioffset))
    Dim xheight = Html.Raw(Json.Encode(xpcelemheight))
    Dim xwidth = Html.Raw(Json.Encode(xpcelemwidth))
    
    
    
End Code

<div style="position:absolute;height:@(spctheight);width:@(spctwidth);background-color:@(pcelembackground);
            left:@(spctleft);right:0;top:@(spcttop);bottom:0;display: inline;border: 1px solid rgba(255,255,255,0.3);"
    data-prwtype="ignorepcelementview" 
    data-prwpcelemtype="@vwmodelname"
    data-prwpcelemguidstring="@pclemguidstr"
    data-prwpcelmsdsid="@pclemsdsid"
    data-prwcornerradius="4">

    <div style="width: 100%; height: 100%; left: 0; right: 0; top: 0; bottom: 0;padding: 0;
        display:inline;position: absolute; background-color: rgba(229,1,220,0.0);opacity:0.7;" 
        data-prwcornerradius="4">
    @If Not IsNothing(Model.ImageURL) Then
        @<img  style="width: 100%; height: 100%; vertical-align:middle;position:absolute;"  src="@(Model.ImageURL)" alt="" />
    End If
        </div>
    @If TypeOf Model.ViewModel Is MvcApplication2.QuestOptionSetModel Then
        With CType(Model.ViewModel, MvcApplication2.QuestOptionSetModel)
            'If .UniGridRows > 1 Then
             @*@<ul style="width:@(pcelemwidth);
                        height:@(pcelemheight);*@
                @<ul style="height:100%;width:100%;
                     display: inline;
                     padding:0;
                     position:relative;
                        left:0;right:0;
                        top:0;bottom:0;
                        list-style:none;
                        background-color:rgba(1,1,255,0.0);">

                    @For Each qoim In .ItemsObservableColxn
                    Dim elemheight = (((qoim.DesignerItemHeight / 768)) * 100)
                    Dim elemwidth = (((qoim.DesignerItemWidth / 1366)) * 100)
                    Dim borderpcts = Model.ToBorder(elemwidth, elemheight, 4)
                    Dim xxborderlr = borderpcts.Width & "%"
                    Dim xxbordertb = borderpcts.Height & "%"
                    Dim netborderH = (100 - (borderpcts.Height * 2)) & "%"
                    Dim netborderW = (100 - (borderpcts.Width * 2)) & "%"
                    Dim xxheight = (((qoim.DesignerItemHeight / 768) / (pctheight * 0.01)) * 100) & "%" 'qoim.DesignerItemHeight & "px"
                    Dim xxwidth = (((qoim.DesignerItemWidth / 1366) / (pctwidth * 0.01)) * 100) & "%" 'qoim.DesignerItemWidth & "px"
                    'Dim xxcheckbxwidth = (((qoim.CheckBoxSize / 1366) / (pctwidth * 0.01)) * 100) & "%" 'qoim.DesignerItemWidth & "px"
                    Dim cboxmarginthickness = Model.ToBorder(elemwidth, elemheight, 4) 'has 3px border top and bottom
                    Dim optiontextwidth = ((((qoim.DesignerItemWidth - qoim.CheckBoxSize - 21) / qoim.DesignerItemWidth)) * 100)
                    Dim xxoptiontextwidth = optiontextwidth & "%"
                    Dim checkbxheight = (((qoim.CheckBoxSize) / qoim.DesignerItemHeight) * 0.99) * 100
                    Dim checkbxwidth = (((qoim.CheckBoxSize) / qoim.DesignerItemWidth) * 0.99) * 100
                    Dim xxcheckbxmargins = ((100 - checkbxheight - cboxmarginthickness.Height) * 0.5) & "%"
                    Dim xxcheckbxheight = checkbxheight & "%"
                    Dim xxcheckbxwidth = (checkbxwidth) & "%" '((100 - optiontextwidth)) & "%"
                    Dim xxcheckbxmarginright = 100 - checkbxwidth & "%"
                    Dim xxoptiontextleft = (100 - optiontextwidth) & "%"
                    'Dim z = 2
                    @<li data-prwtype="vertQOIVw" style="float:left;padding:0;
                                                        left:0;right:0;top:0;bottom:0;
                                                        height:@(xxheight);width:@(xxwidth);">

                        <div style="left:@(xxborderlr);right:@(xxborderlr);top:@(xxbordertb);bottom:@(xxbordertb);
                                    height:@(netborderH);width:@(netborderW);position:relative;
                                    padding:0;margin:0;
                                    overflow: hidden;text-overflow: ellipsis;
                                    background-color:rgba(255,255,255,0.2);border: 1px solid rgba(255,255,255,0.3);"
                                    data-prwcornerradius="4">



                           <div style="visibility:@checkboxvisibility;height:@(xxcheckbxheight);width:@(xxcheckbxwidth);left:0;right:@(xxcheckbxmarginright);top:@(xxcheckbxmargins);bottom:@(xxcheckbxmargins);position:absolute;
                                        background-color:rgba(250,250,250,0.9);border: 3px solid rgba(114,114,114,0.99);"
                                        data-prwcornerradius="4">
                                <div style="left:0;right:0;top:0;bottom:0;
                                            margin:6%;
                                            position:absolute;
                                            background-color:rgba(255,255,255,0.8)"
                                            data-prwcornerradius="4">
                                    <div style="left:0;right:0;top:0;bottom:0;
                                                margin:2%;
                                                position:absolute;
                                                background-color:rgba(250,250,250,0.2)"
                                                data-prwcornerradius="4">
                                        <div style="left:0;right:0;top:0;bottom:0;
                                                    margin:8%;
                                                    position:absolute;
                                                    background-color:rgba(255,255,255,0.3)"
                                                    data-prwcornerradius="4">
                                            <div style="left:0;right:0;top:0;bottom:0;
                                                        margin:10%;
                                                        position:absolute;
                                                        background-color:rgba(255,255,255,0.99)"></div>
                            </div></div></div>
                            @*@Html.Partial("ResultsItemViewPartial", qoim)*@
                            </div>
                         
                           <div  style="display:table;margin-left:@(xxoptiontextleft);overflow: hidden;text-overflow: ellipsis;
                                         width:@(xxoptiontextwidth);height:100%;left:0;right:0;top:0;bottom:0;
                                         background-color:rgba(229,1,220,0.0);"
                                         data-prwcornerradius="4">
                                <p style="display:table-cell;vertical-align:middle;
                                     background-color:rgba(1,255,1,0.0);">@(qoim.QOptionItemText)</p>
                                  
                           </div> 
                           @Html.Partial("ResultsItemViewPartial", qoim)
                        </div> 
                        
                    </li>
                    Next
                </ul>


        End With
    End If

    </div>
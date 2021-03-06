﻿@ModelType MvcApplication2.QuestOptionItemModel
@code
    Dim myguid = Guid.NewGuid.ToString("N")
    Dim xmyguid = "#" & myguid 'Html.Raw(Json.Encode(myguid))
    Dim animguid = Guid.NewGuid.ToString("N")
    Dim hrefanimguid = "#" & animguid
    Dim fillguid = Guid.NewGuid.ToString("N")
    Dim fillguidref = "url(#" & fillguid & ")"
    Dim backguid = Guid.NewGuid.ToString("N")
    Dim backguidref = "url(#" & backguid & ")"
    'Dim xycenter = Html.Raw(Json.Encode((Model.DesignerItemHeight) * 0.5))
    'Dim xxcenter = Html.Raw(Json.Encode((Model.DesignerItemHeight * 0.5)))
    'Dim xycenter = Html.Raw(Json.Encode(20))
    'Dim xxcenter = Html.Raw(Json.Encode(20))
    'Dim xxradius = Html.Raw(Json.Encode((Model.DesignerItemHeight * 0.12)))
    'Dim rightmargin = (Model.DesignerItemWidth - Model.DesignerItemHeight) & "px"
    'Dim checkbxheight = (((Model.CheckBoxSize) / Model.DesignerItemHeight) * 1) * 100
    Dim checkbxwidth = (((Model.CheckBoxSize) / Model.DesignerItemWidth) * 1.2) * 100
    'Dim xxcheckbxheight = checkbxheight & "%"
    Dim xxcheckbxwidth = (checkbxwidth) & "%"
    Dim selectedpct As Integer = Model.RespONSEModel.RCnt
    Dim unselectedpct = 100 - selectedpct
    Dim selpctstring = selectedpct & "%"
    Dim angle As Double = 90
    Dim angleplus = ((360 * unselectedpct / 100.1))
    'Dim piepathUnSelected = Model.PieSlicePath(20, 20, 10, angle, angle + angleplus) '90 + unselectedpct
    'angle += angleplus
    
    Dim sangleplus = ((360 * (selectedpct + 25) / 100.1))
    'Dim bangleplus = ((360 * 25 / 100))
    'Dim piepathSelected = Model.PieSlicePath(20, 20, 10, (angle + angleplus), (angleplus + sangleplus)) '90 + unselectedpct
    Dim piepathSelected = Model.PieSlicePath(20, 20, 10,(angleplus + sangleplus),(90 + angleplus)) '90 + unselectedpct
    'Dim xSelPct = Html.Raw(Json.Encode(selectedpct))
    'Dim xUnSelPct = Html.Raw(Json.Encode(unselectedpct))
    'Dim xpiepathselected = Html.Raw(Json.Encode(piepathSelected))
    'Dim xhrefanimguid = Html.Raw(Json.Encode(hrefanimguid))
End Code

  <div id="@(myguid)" data-prwtype="qoimrsltsitem" class="defaultshadow"
                style="padding:0; 
                        height:100%;width:@(xxcheckbxwidth);
                        position:absolute;
                        left:0;right:0;top:0;bottom:0;          
                border: .5px solid rgba(255,255,255,0.3);
                background-color: rgba(1,1,1,0.1);"
                data-prwcornerradius="4">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.2" 
     baseProfile="tiny" viewBox = "9 9 22 22" 
        style="left:0;right:0;top:0;bottom:0; 
        position: relative;" width="100%" height="100%"  >
      <defs>
      <linearGradient id="@(backguid)" gradientTransform="matrix(1 0 0 1 0 0)" x1="0" y1="1" x2="0" y2="0">
        <stop stop-color="#221122" offset="0%"/>
        <stop stop-color="#555555" offset="45%"/>
        <stop stop-color="#222222" offset="100%"/></linearGradient>
      <linearGradient id="@(fillguid)" gradientTransform="matrix(1 0 0 1 0 0)" x1="0" y1="1" x2="0" y2="0">
        <stop stop-color="#ffCC00" offset="0%"/>
        <stop stop-color="#FFFF11" offset="50%"/>
        <stop stop-color="#FFFF11" offset="95%"/>
        <stop stop-color="#FFDD00" offset="100%"/></linearGradient>
      </defs>
@*      <path style="opacity: 0.7; fill-opacity: 0.7;" 
            opacity="0.7" fill="url(#090-_0065ff-_2f69bf)" 
            fill-opacity="0.7" stroke="#444444" stroke-width=".8" 
            d="@piepathUnSelected"></path>*@
@*  <circle  display="none" r="9.72092" cy="20.20271" cx="20.06081" stroke-opacity="0.01"  stroke-dasharray="null" stroke-width="0" stroke="#000000" fill="#7fff00"/>
  <circle display="none"  r="6.10193" cy="20.25339" cx="20.08615" stroke-opacity="0.01"  stroke-dasharray="null" stroke-width="0" stroke="#000000" fill="#0000ff"/>
  <circle display="none" r="1.49067" cy="18.47945" cx="19.14849" stroke-opacity="0.01"  stroke-dasharray="null" stroke-width="0" stroke="#000000" fill="#ff00ff"/>*@
        <path  display="none" d="m10.48801,11.5865c0,-0.48289 0.37936,-0.88869 0.8308,-0.88869l17.50134,0c0.45144,0 0.8308,0.40579 0.8308,0.88869l0,17.24106c0,0.48289 -0.37936,0.88869 -0.8308,0.88869l-17.50134,0c-0.45144,0 -0.8308,-0.40579 -0.8308,-0.88869l0,-17.24106z"
               stroke-linecap="round" stroke-linejoin="round" 
               stroke="#ff0000" fill-opacity="0.14" fill="#0000ff"/>
        <circle cx="20" cy="20" r="9.9" stroke="#444444" 
                stroke-width=".1"  
            opacity="0.7" fill="@(backguidref)" />
 
     <path id="@(animguid)" data-prwpathrmkey1="@(Model.RespONSEModel.Key1)" data-prwqoimid="@(Model.RespONSEModel.SDS_ID)" data-prwrmid="@(Model.RespONSEModel.ID)"
            opacity="1" fill="@(fillguidref)" 
            fill-opacity="1" stroke="#FFFF44" stroke-width="0.1" 
            d="@(piepathSelected)">
           @* <animate  attributeName="d" attributeType="XML"  begin="2s" dur="3s"   fill="freeze" calcMode="discrete"/>*@
     </path>
@*     <g font-size="5">
        <text x="9" y="25" fill="red">I love SVG</text>
     </g>*@
    </svg>
    <div data-prwdivrmkey1="@(Model.RespONSEModel.Key1)" 
        style="padding:0;
        top:2px;left:2px;
        position:absolute;
        color: rgb(255,255,1);
        background-color: rgba(1,1,1,0.4);
        font-size:80%"
        data-prwcornerradius="4">@selpctstring</div>       
 </div>

 @*NotSymbolElements*@
@*<circle fill-opacity="0.02" id="svg_39" r="8.38472" cy="20.26266" cx="20.05889" 
     stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke="#f70c43" fill="#7f0000"/>
   <path stroke-width="2" id="svg_41" d="m25.32862,13.69959l-10.93909,12.54942l10.93909,-12.54942z" 
   fill-opacity="0.02" stroke-linecap="null" stroke-linejoin="null" 
   stroke-dasharray="null" stroke="#f70c43" fill="#7f0000"/>*@


@* <script type="text/javascript">
     (function (prweb, $) {
        $('@(xmyguid)').resultsitempiechart({selectedPathstring: @(xpiepathselected), myanimguid: @(xhrefanimguid)});
     } (this.prweb, jQuery));
 </script>*@


 
@*         var values = [@(xUnSelPct),@(xSelPct)],
        labels = [.6,.146];
        Raphael(@(xmyguid)).pieChart(@(xxcenter), @(xycenter), @(xxradius), values, labels, "#222");*@

       @* M 20 20 L 20.01 10.01 A 10 10 0 0 1 20.01 10.01 Z*@

 @*"m 20 20 L 20 9.8 A 10.2 10.2 0 0 0 15.6571 29.2292 Z"*@
 @*"m 20 20 L 15.6571 29.2292 A 10.2 10.2 0 1 0 20 9.8 Z"*@
 @*M20 20 L 20 10 A 10 10 0 0 0 19.3720948047069 10.0197327157173 z*@
 @*M20 20 L 20.0784605499496 10.0003078076322 A 10 10 0 0 1 20.0627686718094 10.0001969972484 Z*@
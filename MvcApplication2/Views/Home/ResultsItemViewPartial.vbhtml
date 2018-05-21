@ModelType MvcApplication2.QuestOptionItemModel
@code
    Dim myguid = Guid.NewGuid.ToString("N")
    Dim xmyguid = "#" & myguid 'Html.Raw(Json.Encode(myguid))
    Dim animguid = Guid.NewGuid.ToString("N")
    Dim hrefanimguid = "#" & animguid
    Dim fillguid = Guid.NewGuid.ToString("N")
    Dim fillguidref = "url(#" & fillguid & ")"
    Dim backguid = Guid.NewGuid.ToString("N")
    Dim backguidref = "url(#" & backguid & ")"

    Dim checkbxwidth = (((Model.CheckBoxSize) / Model.DesignerItemWidth) * 1.2) * 100

    Dim xxcheckbxwidth = (checkbxwidth) & "%"
    Dim selectedpct As Integer = Model.RespONSEModel.RCnt
    Dim unselectedpct = 100 - selectedpct
    Dim selpctstring = selectedpct & "%"
    Dim angle As Double = 90
    Dim angleplus = ((360 * unselectedpct / 100.1))

    
    Dim sangleplus = ((360 * (selectedpct + 25) / 100.1))

    Dim piepathSelected = Model.PieSlicePath(20, 20, 10,(angleplus + sangleplus),(90 + angleplus)) '90 + unselectedpct

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
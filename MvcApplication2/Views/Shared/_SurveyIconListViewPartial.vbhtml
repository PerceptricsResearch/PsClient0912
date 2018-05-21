
<div id="siconlistview" class="scrollablesiconlist vertical defaultshadow"
     data-prwtype="surveyiconlist"
     data-prwcornerradius="4">
  
    <div id="surveyiconlistitems" data-bind='foreach: myrows' class="surveyiconlistitems"
        data-prwcornerradius="4">
        <div data-prwtype="siconlistitem" class="siconlistitem defaultshadow"
            style="overflow:hidden"
            data-prwcornerradius="4">
            <div 
                style="height:87px;overflow:hidden"
                data-prwcornerradius="4"
                data-prwtype="surveyiconview"  
                data-action="none">
               @* <img data-prwcornerradius="4" data-bind="attr: { src: ImageUrl}" alt="" height="50px" style="position:relative;margin:2px;background:rgba(1,80,80,0.5);"/>*@
                <div data-prwcornerradius="4"
                     style="float:right;position:relative;right:44%;top:0;bottom:0;text-align:center;margin:2px;
                            width:22%;height:50%;font-size:50%;">
                     <div  data-bind="visible: HasActiveRDents"
                            data-prwcornerradius="4" 
                            style="position:relative;text-align:center;padding:3%;left:0;right:0;
                                    width:90%;height:40%;font-size:50%;margin:auto;
                                    background:rgba(25,200,0,1);
                                    border:1px solid rgba(25,255,0.1)">Active</div>@*data-bind="visible: HasNewResults"*@@*data-bind="visible: HasActiveRDents"*@
                     <div   data-bind="visible: HasNewResults"
                            data-prwcornerradius="4" 
                            style="position:relative;text-align:center;padding:3%;left:0;right:0;
                                    width:90%;height:40%;font-size:50%;margin:auto;
                                    background:rgba(80,2,120,1);
                                    border:1px solid rgba(255,2,255,0.1)">New Results</div>
                </div>

                <div 
                    data-prwcornerradius="4" class="defaultshadow viewpagesbtn"
                    style="margin:0.1em;position:relative;padding:1em;
                            padding-left:0.5em;
                            padding-right:8px;
                            color:White;
                            font-size: 80%;
                            border: .5px solid hsla(179, 54%, 64%, 0.3);
                            background:rgba(245,245,245,1)">
                    <label data-bind="text: SurveyName" data-prwcornerradius="4"  class="defaultshadow"
                            style="white-space: nowrap;padding:0.2em;
                                    display: block;
                                    text-overflow: ellipsis;
                                    overflow: hidden;background:rgba(1,80,80,1)"></label>
                </div>


          </div>
@*            <div data-bind="attr: { 'data-surveyurl': URL, 'data-rsltsurl': ResultsModelURL, 'data-surveyname': SurveyName, 'data-publishsurveyurl': PublishSurveyURL }"
                 data-prwtype="viewpagesbtn" 
                 style="position:relative;width:55%;height:85px;margin-top:-85px;background-color:rgba(1,1,1,0.01);"></div>*@
        </div>
    </div>


</div>

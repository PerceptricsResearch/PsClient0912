@ModelType  MvcApplication2.SurveyIconModel
    
    <div id="@Model.SurveyID" data-prwtype="surveyiconview" data-url="@Model.URL" data-action="none">
    <img  src="@Model.ImageUrl" alt="" height="50px"/>
    @Model.PrwType
    @Model.URL
    @Model.SurveyID
    @Model.SurveyName
    </div>


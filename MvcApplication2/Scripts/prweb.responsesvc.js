/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.responsesvc = (function () {
        var that = {};


        //        that.MsgAreaDefaultPage = "<div>Welcome. Thanks for participating.</div>";

        that.MessageAreaVmx = {};
        that.populateMsgAreaVmx = function () {
            var vmx = {
                pageentry: ko.observable(prweb.domaincontentsvc.NewDRObservablePage("x", "0")),
                msgareavisible: ko.observable(true),
                simpletext: ko.observable(),
                subscriptions: {},
                Dispose: null
            };
            vmx.Dispose = function () {

            };
            vmx.pageentry().html("<div>Welcome. Thanks for participating in our research.</div>");
            that.MessageAreaVmx = vmx;
        };

        that.SetMsgAreaSimpleText = function (newtext) {
            that.MessageAreaVmx.pageentry().html("<div>" + newtext + "</div>");
        };

        that.ButtonBarVmx = {};

        that.populateButtonBarVmx = function () {
            var vmx = {
                finishbtnvisible: ko.observable(false),
                pagesbtnvisible: ko.observable(false),
                quitbtnvisible: ko.observable(true),
                subscriptions: {},
                Dispose: null
            };
            vmx.Dispose = function () {

            };
            that.ButtonBarVmx = vmx;
        };

        that.ActionListVmx = {};
        that.populateActionListVmx = function () {
            var vmx = {
                restartbtnvisible: ko.observable(false),
                finishbtnvisible: ko.observable(false),
                quitbtnvisible: ko.observable(true),
                rdactionsbtnvwrslts: ko.observable(false),
                rdactionsbtnprivacy: ko.observable(true),
                rdactionsbtnauthinfo: ko.observable(true),
                rdactionsbtncomment: ko.observable(true),
                rdactionsbtnprsch: ko.observable(false),
                subscriptions: {},
                Dispose: null
            };
            vmx.Dispose = function () {

            };
            that.ActionListVmx = vmx;
        };

        that.PageCount = 1;
        that.pageslistViewModelx = ko.observable();
        that.populatepageslistVMx = function () {
            var newvm = {
                pageslist: null,
                usethis: null
            };
            newvm.pageslist = Enumerable.RangeTo(1, that.PageCount).ToArray();
            that.pageslistViewModelx(newvm);
        };


        that.SurveyCompleteAction = function () {
            try {
                prweb.rdentsurveyplayersvc.AddFinishPage();
                that.ButtonBarVmx.finishbtnvisible(true);
            }
            catch (ex) {
                alert("prweb.responsesvc.SurveyCompleteAction reports error..." + ex.Message);
            }

        };

        that.CompleteBehaviorsList = {
            //this list is populated from BehaviorsList on each page,or pclem...
            //behaviors can be different types...
            //complete behaviors point to a function that returns boolean...
            //each object that has a complete behavior in its BehaviorsList will "Register" the behavior here...
            //registration is just adding the corresponding behior to this list...
            //the EvaluateCompleteBehaviors method below 
            //
        };

        that.EvaluateCompleteBehaviors = function () {
            //this will iterate over a list of functions that return boolean
            //it stops iterating when one returns false...
            //returns false if it encounters a false result while iterating...
            var rslt = true
            try {
                if (that.CompleteBehaviorsList) {
                    for (var n in that.CompleteBehaviorsList) {
                        if (rslt) {
                            rslt = that.CompleteBehaviorsList[n]();
                        }
                    }
                }
            }
            catch (ex) {
                alert("prweb.responsesvc.EvaluateCompleteBehaviors reports error..." + ex.Message);
            }
            return rslt;
        };

        that.EvaluateSurveyComplete = function () {
            try {
                if (!that.IsAlreadySent) {
                    var atlastpage = prweb.rdentsurveyplayersvc.IsAtLastPage();
                    var iscomplete = that.EvaluateCompleteBehaviors();
                    if (prweb.rdentsurveyplayersvc.IsAtLastPage()) {
                        that.SetMsgAreaSimpleText("Press Finish to send your responses.");
                        that.SurveyCompleteAction();
                    }
                }
            }
            catch (ex) {
                alert("prweb.responsesvc.EvaluateSurveyComplete reports error..." + ex.Message);
            }
        };

        that.RDentModel = {};

        that.IsAlreadySent = false;

        that.ConfirmResponseColxnSent = function (confirmdata) {
            that.IsAlreadySent = true;
            that.ButtonBarVmx.finishbtnvisible(false);
            that.ButtonBarVmx.quitbtnvisible(false);
            that.ActionListVmx.restartbtnvisible(false);
            that.ActionListVmx.quitbtnvisible(false);
            prweb.rdentsurveyplayersvc.ShowFinishPage();
            return;
        };

        that.PrepareResponsePackage = function () {
            var rms = Enumerable.From(that.RDentModelDxnry).Select(function (r) { return r.Value; }).ToArray();
            that.RDentModel.ResponseColxn = rms;
            return that.RDentModel;
        };

        that.sendRDentModelUrl = false;

        that.SendErrorHandler = function (e) {
            that.SetMsgAreaSimpleText("Sorry, unable to send your responses...");
        };

        that.SendRDentModelToServer = function () {
            //this will  do an ajax call...to responseSvc.StoreRespondentModelAsync(json.stringify(RDentModel))
            //            alert("Thanks...your survey is complete...")
            that.SetMsgAreaSimpleText("Sending your responses...");
            try {
                var myurl = that.sendRDentModelUrl;
                var dataToSend = {
                    responsePkg: that.PrepareResponsePackage()
                };
                //                var testDtSndStringify = JSON.stringify(dataToSend);
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        cache: false,
                        data: JSON.stringify(dataToSend),
                        dataType: 'json',
                        contentType: 'application/json',
                        success: that.ConfirmResponseColxnSent,
                        error: that.SendErrorHandler
                    });
                }
                dataToSend = null;
                myurl = null;
            }
            catch (ex) {
                alert("prweb.responsesvc.SendRDentModelToServer reports error..." + ex.Message);
                that.SetMsgAreaSimpleText("Unable to send your responses..." + ex.Message);
            }
        };

        that.RDentModelDxnry = {}; //new Array();

        that.RemoveRMKey = function (rsponsemodel) {
            if (rsponsemodel.Key1.toString() in that.RDentModelDxnry) {
                var rm = rsponsemodel;
                delete that.RDentModelDxnry[rm.Key1.toString()];
            }
        };

        //is true when responsemodel is added to ResponseColxn...false when responsemodel removed from ResponseColxn (really added/removed from dxnry...)
        that.EvaluateResponseModel = function (rsponsemodel) {
            var rslt = false;
            var removeRM = function (rm) {
                delete that.RDentModelDxnry[rm.Key1.toString()];
            };
            var addRM = function (rm) {
                that.RDentModelDxnry[rm.Key1.toString()] = rm;
                rslt = true
            };
            if (that.RDentModelDxnry) {
                if (rsponsemodel.Key1.toString() in that.RDentModelDxnry) {
                    removeRM(rsponsemodel);
                }
                else {
                    addRM(rsponsemodel);
                    rslt = true;
                }
                var xdbg = 2;
            }
            return rslt;
        };

        that.IsChecked = function (rsponsemodel) {
            return (rsponsemodel.Key1.toString() in that.RDentModelDxnry);
        };

        that.checkedpathcheckbox = "m16.87726,25.20772l9.81974,-13.38821l3.87712,-1.34433c-4.50958,4.03466 -7.90801,8.51384 -13.38482,19.80573c-2.74747,-4.55849 -2.99637,-4.11011 -7.17336,-8.56704l3.93182,0.1319l2.92949,3.36194l0.00001,0z";
        that.notcheckedpathcheckbox = "m0,0";
        that.checkedpathradiobutton = "";
        that.notcheckedpathradiobutton = "";

        that.IsCheckedCheckBoxToPath = function (ischecked) {
            if (ischecked) {
                return that.checkedpathcheckbox;
            }
            else {
                return that.notcheckedpathcheckbox;
            }
        };

        that.IsCheckedRadioButtonToPath = function (ischecked) {
            if (ischecked) {
                return that.checkedpathradiobutton;
            }
            else {
                return that.notcheckedpathradiobutton;
            }
        };


        //anybody that wants to do finish behavior...has to call this...
        //rdentmanager has a finishbtn click handler...
        //so does the actions navpanel ...in rdactionslist.
        that.FinishBtnClickAction = function () {
            //this can only be called when the finish btn has been displayed...so all of the stuff that needs to happen, was validated before you got here..
            try {
                that.ButtonBarVmx.finishbtnvisible(false);
                that.SendRDentModelToServer();
            }
            catch (ex) {
                alert("prweb.responsesvc.FinishBtnClickAction reports error..." + ex.Message);
            }
        };

        that.QuitBtnClickAction = function () {
            that.ButtonBarVmx.finishbtnvisible(false);
            that.ButtonBarVmx.quitbtnvisible(false);
            that.ActionListVmx.quitbtnvisible(false);
            that.ActionListVmx.restartbtnvisible(true);
        };

        that.HeartBeatURL = false;
        that.LastHeartBeatTime = false;
        that.SendRDentHeartBeat = function (myurl) {
            try {
                prweb.dataManager.sendRequest({
                    url: myurl,
                    success: function (pagezerodata) {
                        try {
                            that.LastHeartBeatTime = new Date().getTime();
                        }
                        catch (ex) {
                            alert("prweb.responsesvc.SendRDentHeartBeat.successhandler reports " + ex.Message);
                        }
                    },
                    error: function (e) {
                        alert("prweb.responsesvc.SendRDentHeartBeat.sendRequest reports error..." + e.toString());
                    }
                });
            }
            catch (ex) {
                alert("prweb.responsesvc.SendRDentHeartBeat reports " + ex.Message);
            }
        };

        that.CompleteSetUpofRDentPlatform = function () {
            //this sets up a widget...that does all the stuff for handlers etc...
            // presumably, could do a dynamic script call here...
            // load all of the supporting scripts...and in the callback, do this widget setup...
            $("#prwbuttonbar").rdentmanager();
        };


        that.PlatformInitialize = function (dmdobj) {
            that.CompleteSetUpofRDentPlatform();
            that.SendRDentHeartBeat(that.HeartBeatURL);
        };


        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
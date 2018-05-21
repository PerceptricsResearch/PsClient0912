/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {
    prweb.dialoguemanager = (function () {
        var that = {};

        that.RequiredDialogues = $({});

        that.ReqDlgLength = function () {
            var rslt = 0;
            rslt = that.RequiredDialogues.queue("mydialogs").length;
            //            for (var k in that.RequiredDialogues) {
            //                rslt++;
            //            };
            return rslt;
        };

        that.ReqisterRequiredDialogue = function (dlgname) {
            try {
                switch (true) {
                    case (dlgname == "designerclosesave"):
                        that.RequiredDialogues.queue("mydialogs", that.ShowDesignerCloseSaveDlg);
                        break;
                    case (dlgname == "designersavesurvey"):
                        that.RequiredDialogues.queue("mydialogs", that.ShowDesignerSaveSurveyDlg);
                        break;
                    case (dlgname == "savesurveybusy"):
                        that.RequiredDialogues.queue("mydialogs", that.ShowDesignerSaveSurveyBusyDlg);
                        break;
                    case (dlgname == "savesurveycomplete"):
                        that.RequiredDialogues.queue("mydialogs", that.ShowDesignerSaveSurveyCompleteDlg);
                        break;
                }

                //                var ql = that.ReqDlgLength();
                //                var dbgx = 2
            }
            catch (ex) {
                alert("prweb.dialoguemanager.RegisterRequiredDialogue reports error..");
            }
        };

        that.DesignerSaveOnlyHandler = function () {
            that.RequiredDialogues.clearQueue("mydialogs");
            that.ReqisterRequiredDialogue("designersavesurvey");
            prweb.designersvc.SubscribeToDialogueManagerComplete();
            that.ShowRequiredDialogues();
        };

        that.UnRegisterRequiredDialogue = function (dlgname) {
            var myq = that.RequiredDialogues.queue("mydialogs");
            var dbgx = 2;
            //            if (that.RequiredDialogues[dlgname]) {
            //                that.RequiredDialogues[dlgname] = null;
            //                delete that.RequiredDialogues[dlgname];
            //            }
        };

        that.IsDlgRequired = function () {
            var rslt = false;
            //            if (prweb.designersvc) {
            if (that.ReqDlgLength() > 0) {
                rslt = true;
            }
            //            }
            return rslt;
        };

        that.DialogueResult = false;

        that.PublishSaveDialogueComplete = function (dlgrslt) {
            //            that.DialogueResult = dlgrslt;
            that.ReqisterRequiredDialogue("savesurveycomplete");
            $("#designerdialoguecontainer").dialog("close"); // this closes the saving survey busy dialogue and DialogueCompleteHandler
        };

        that.DialogueCompleteHandler = function (event, ui) {
            // make this a general unbind...event.target.id is the selectortext...
            $("#designerdialoguecontainer").unbind("dialogclose");
            $("#designerdialoguecontainer").dialog("destroy");
            // this will add subsequent dialogues and show them...when multiple dialogs are possible...
            switch (true) {
                case (that.DialogueResult == "designersave"):
                    that.ReqisterRequiredDialogue("designersavesurvey");
                    break;
                case (that.DialogueResult == "savesurvey"):
                    that.ReqisterRequiredDialogue("savesurveybusy");
                    prweb.designersavesurveysvc.SaveSurvey();
                    break;
            }
            if (that.IsDlgRequired()) {
                that.ShowRequiredDialogues();
            }
            else {
                prweb.pubsub.publish(prweb.events.dialoguemanager.dialoguecomplete, that.DialogueResult);
            }
        };

        that.ShowDesignerCloseSaveDlg = function (e) {
            that.DialogueResult = "cancel";
            prweb.designersvc.SubscribeToDialogueManagerComplete();
            $("#designerdialoguecontainer").html("<div style='overflow:hidden;font-size:10px;'>There are unsaved changes...</div>").dialog({
                modal: true,
                title: "<div style='overflow:hidden;font-size:10px;'>Unsaved Changes</div>",
                zIndex: 3000,
                buttons: {
                    "Discard Changes": function () {
                        that.DialogueResult = "discardchanges";
                        $(this).dialog("close");
                    },
                    "Cancel": function () {
                        that.DialogueResult = "cancel";
                        $(this).dialog("close");
                    },
                    "Save": function () {
                        that.DialogueResult = "designersave";
                        $(this).dialog("close");
                    }

                }
            });
            $("#designerdialoguecontainer").bind("dialogclose", that.DialogueCompleteHandler);
        };

        that.ShowDesignerSaveSurveyDlg = function () {
            that.DialogueResult = "cancel";
            $("#designerdialoguecontainer").html('<div id="xxsnbox"><input id="xtbx" type="text" name="surveyname" value="Enter Survey Name" style="position:relative;"/></div>').dialog({
                modal: true,
                title: "<div style='overflow:hidden;font-size:10px;'>Save Survey</div>",
                zIndex: 3000,
                buttons: {
                    "Save Survey": function () {
                        that.DialogueResult = "savesurvey";
                        prweb.designersavesurveysvc.SurveyNameResult = $("#xtbx").val();
                        $(this).dialog("close");
                    },
                    "Cancel": function () {
                        that.DialogueResult = "cancel";
                        $(this).dialog("close");
                    }
                },
                open: function () {
                    prweb.designersavesurveysvc.SurveyNameResult = false;
                    $("#xxsnbox").css("z-index", "6010");
                    var sn = $("#headertitle").text();
                    $("#xtbx").val(sn).css("z-index", "6011").focus().css("background", "rgba(20,255,255,0.6)");
                    //                        $("#tbx").val(sn);
                }
            });
            $("#designerdialoguecontainer").bind("dialogclose", that.DialogueCompleteHandler);
        };

        that.ShowDesignerSaveSurveyBusyDlg = function () {
            that.DialogueResult = "savesurveybusy";
            $("#designerdialoguecontainer").html("<div style='overflow:hidden;font-size:10px;'>Please wait while this survey is completely saved.</div>").dialog({
                modal: true,
                title: "<div style='overflow:hidden;font-size:10px;'>Saving Survey...</div>",
                zIndex: 3000,
                closeOnEscape: false,
                open: function (event, ui) {
                    //hide the little x close button in the title bar...
                    $(".ui-dialog-titlebar-close").hide();
                }
            });
            $("#designerdialoguecontainer").bind("dialogclose", that.DialogueCompleteHandler);
        };

        that.ShowDesignerSaveSurveyCompleteDlg = function () {
            that.DialogueResult = "savesurveycomplete";
            $("#designerdialoguecontainer").html("<div style='overflow:hidden;font-size:10px;'>Save Survey is complete...</div>").dialog({
                modal: true,
                title: "<div style='overflow:hidden;font-size:10px;'>Save Complete</div>",
                zIndex: 3000,
                buttons: {
                    "Ok": function () {
                        $(this).dialog("close");
                    }
                },
                open: function (event, ui) {
                    //hide the little x close button in the title bar...
                    $(".ui-dialog-titlebar-close").hide();
                }
            });
            $("#designerdialoguecontainer").bind("dialogclose", that.DialogueCompleteHandler);
        };

        that.ShowRequiredDialogues = function () {
            //use requiredDialogues list...
            var rslt = that.IsDlgRequired();
            if (rslt) {
                that.RequiredDialogues.dequeue("mydialogs");
            }
            return rslt;
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
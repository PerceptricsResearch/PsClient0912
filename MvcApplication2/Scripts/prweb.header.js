(function (prweb, $) {

    $.widget('prweb.header', {
        options: {
            title: '',
            mytitle: null,
            renameSurveyUrl: null,
            displayName: ''

        },

        _create: function () {
            //            alert('in header _create');
            //            this._adjustNavigation();
            this.mytitle = $("#headertitle").addClass("prwnoselect"); //this.element.find('[data-title]');
            prweb.pubsub.subscribe(prweb.events.appsvc.appcontextchanged, this._surveyOpenedHandler, this);
            prweb.pubsub.subscribe(prweb.events.appsvc.surveycontextchanged, this._surveyOpenedHandler, this);
            this._populateEditSupport();
            //            this.editsupport.renameSurveyUrl = prweb.appsvc.renamesurveyurl;
        },

        mytitle: null,
        haseditclickhandler: false,

        _surveyOpenedHandler: function (e) {
            try {
                switch (true) {
                    case (!e.newcontext || isNaN(e.newcontext)):
                        this.mytitle.html(prweb.appsvc.CurrentAppContext + " Home");
                        this._removeeditclickhandler();
                        break;
                    case (e.newcontext > -1):
                        this.mytitle.html(prweb.surveymodelsvc.SurveyName());
                        this._addeditclickhandler();
                        break;
                    case (e.newcontext == -1):
                        this.mytitle.html("New Survey");
//                        this._addeditclickhandler();
                        break;
                }
            }
            catch (ex) {
                alert("prweb.header.surveyopenendhandler reports error...");
            }
        },

        editsupport: null,

        _populateEditSupport: function () {
            this.editsupport = (function () {
                var that = {};

                that.editclickhandler = function () {
                    that.ShowEditDialogue();
                };

                that.SurveyNameResult = null;

                that.DialogueResult = null;

                that.DialogueCompleteHandler = function () {
                    $("#designerdialoguecontainer").unbind("dialogclose");
                    $("#designerdialoguecontainer").dialog("destroy");
                    switch (true) {
                        case (that.DialogueResult == "save"):
                            {
                                that.RenameSurvey(prweb.appsvc.CurrentSurveyContext, that.SurveyNameResult);
                                break;
                            }
                        case (that.DialogueResult == "cancel"):
                            {

                                break;
                            }
                    };
                };
                that.RenameSurveyComplete = function (pocoidpkg) {
                    $("#headertitle").html(that.SurveyNameResult);
                    prweb.surveymodelsvc.SurveyName(that.SurveyNameResult);
                    //update all the places with a new survey id...uuuugh....
                };
                that.ErrorHandler = function () {
                    alert("prweb.header.RenameSurvey.sendRequest.errorcallback reports error...");
                };

                //                that.renameSurveyUrl = prweb.appsvc.renamesurveyurl;

                that.RenameSurvey = function () {
                    var simpkg = {
                        MyGuid: prweb.surveymodelsvc.SurveyGuidString(),
                        SIM: null,
                        SIM_SDSID: prweb.appsvc.CurrentSurveyContext,
                        SurveyName: that.SurveyNameResult
                    };
                    try {
                        var myurl = prweb.appsvc.renamesurveyurl;
                        //                var xpgpkg = that.NewPagePkg(nxtpgnum);
                        var dataToSend = {
                            SimPkg: simpkg
                        };
                        //                        dataToSend.PgPkg = xpgpkg;
                        //                        var testDtSndStringify = JSON.stringify(dataToSend);
                        prweb.dataManager.sendRequest({
                            url: myurl,
                            cache: false,
                            data: JSON.stringify(dataToSend),
                            dataType: 'json',
                            contentType: 'application/json',
                            success: that.RenameSurveyComplete,
                            error: that.ErrorHandler
                        });
                        dataToSend = null;
                        myurl = null;
                        nxtpgnum = null;
                        //                        that.RenameSurveyComplete();//just for testing...
                    }
                    catch (ex) {
                        alert("prweb.header.RenameSurvey.sendRequest reports error..." + ex.Message);
                    }
                };

                that.ShowEditDialogue = function () {
                    that.DialogueResult = "cancel";
                    $("#designerdialoguecontainer").html('<div id="xsnbox"><input id="tbx" type="text" name="hsurveyname" value="Enter Survey Name"/></div>').dialog({
                        title: "Edit Survey Name",
                        zIndex: 3000,
                        buttons: {
                            "Cancel": function () {
                                that.DialogueResult = "cancel";
                                $(this).dialog("close");
                            },
                            "Save": function () {
                                that.DialogueResult = "save";
                                that.SurveyNameResult = $("#tbx").val();
                                $(this).dialog("close");
                            }

                        },
                        open: function () {
                            $("#xsnbox").css("z-index", "6010");
                            var sn = $("#headertitle").text();
                            $("#tbx").val(sn).css("z-index", "6011").focus().css("background", "rgba(20,255,255,0.8)");
                            //                        $("#tbx").val(sn);
                        }
                    });
                    $("#designerdialoguecontainer").bind("dialogclose", that.DialogueCompleteHandler);
                };

                return that;
            } ());
        },




        _addeditclickhandler: function () {
            if (!this.haseditclickhandler) {
                this.mytitle.bind("click", this.editsupport.editclickhandler);
                this.haseditclickhandler = true;
            }
        },

        _removeeditclickhandler: function () {
            if (this.haseditclickhandler) {
                this.mytitle.unbind("click", this.editsupport.editclickhandler);
                this.haseditclickhandler = false;
            }
        },



        dispose: function () {
            try {

            }
            catch (e) {
                alert("prweb.appcntxtviewmgr.dispose reports error");
            }
            finally {
            }
        },

        destroy: function () {
            this.dispose();

            $.Widget.prototype.destroy.call(this);
        }
    });
} (this.prweb, jQuery));
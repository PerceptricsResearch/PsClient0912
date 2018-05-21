/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />
(function (prweb, $) {
    prweb.subscriptionsvc = (function () {
        var that = {};

        that.subscriptionhomeUrl = false;
        that.SubscriptionInfoDxnry = [];

        that.GroupIsSelectedBehavior = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SubscriptionInfoDxnry.length; i++) {
                    var settingentry = that.SubscriptionInfoDxnry[i];
                    if (settingentry.isselected()) {
                        settingentry.isselected(false);
                        rslt = true;
                    }
                    settingentry = null;
                };
            }
            catch (ex) {
                alert("prweb.subscriptionsvc.GroupIsSelectedBehavior reports " + ex.Message);
            }
            return rslt;
        };

        //#region EvaluateDirtysubscription
        that.EvaluateDirtySubscription = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SubscriptionInfoDxnry.length; i++) {
                    var settingentry = that.SubscriptionInfoDxnry[i];
                    rslt = (rslt || (settingentry.isselected() != settingentry.originalisselected));
                    settingentry = null;
                };
            }
            catch (ex) {
                alert("prweb.subscriptionsvc.EvaluateDirtysubscription reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion

        //#region InitializesubscriptionInfoDxnry and settingentry methods
        that.InitializesubscriptionInfoDxnry = function (subscriptionitemcolxn) {
            var makesubscriptionrow = function (srow) {
                try {
                    var settingentry = {
                        name: srow.SubscriptionName,
                        description: srow.SubscriptionDescription,
                        isselected: ko.observable(srow.IsCurrentSubscription),
                        originalisselected: srow.IsCurrentSubscription,
                        subscriptionvaluescolxn: srow.SubscriptionValuesColxn,
                        iseditable: srow.IsEditable,
                        isenabled: false,
                        methods: {
                            updatedatatosend: null,
                            oncurrentvaluechange: null,
                            dispose: null
                        },
                        subscription: null
                    };
                    settingentry.methods.updatedatatosend = function (newval) {
                        try {
                            var subscriptionname = settingentry.name;
                            var row = Enumerable.From(that.dataToSend.subscriptionpkg.SubscriptionItemsColxn).Where(function (si) { return si.SubscriptionName == subscriptionname }).FirstOrDefault();
                            if (row) {
                                row.IsCurrentSubscription = newval;
                                if (newval) {
                                    that.dataToSend.subscriptionpkg.CurrentSubscription = row;
                                }
                            }
                            row = null;
                        }
                        catch (ex) {
                            alert("prweb.subscriptionsvc.settingentry.methods.updatedatatosend reports " + ex.Message);
                        }
                    };
                    settingentry.methods.onisselectedchange = function (newval) {
                        try {
                            settingentry.methods.updatedatatosend(newval);
                            that.Vmx.isdirty(that.EvaluateDirtySubscription());
                        }
                        catch (ex) {
                            alert("prweb.subscriptionsvc.oncurrentvaluechange reports " + ex.Message);
                        }

                        return;
                    };
                    settingentry.methods.dispose = function () {
                        settingentry.subscription.dispose();
                        settingentry.subscription = null;
                        return;
                    };
                    settingentry.subscription = settingentry.isselected.subscribe(settingentry.methods.onisselectedchange);

                    that.SubscriptionInfoDxnry.push(settingentry);
                }
                catch (ex) {
                    alert("prweb.subscriptionsvc.InitializesubscriptionInfoDxnry.makesubscriptionrow reports " + ex.Message);
                }
                return true;
            };
            var rslt = false;
            try {
                Enumerable.From(subscriptionitemcolxn).ForEach(function (item) { return makesubscriptionrow(item) });
                rslt = true;
            }
            catch (ex) {
                alert("prweb.subscriptionsvc.InitializesubscriptionInfoDxnry reports " + ex.Message);
            }
            return rslt;
        };
        //#endregion


        //#region Vmx and DisposeVmx

        that.Vmx = {
            subscriptiondxnry: null,
            currentsubscription: null,
            isdirty: ko.observable(false),
            isdirtysubscription: null,
            editdonetext: ko.observable("Edit"),
            backcanceltext: ko.observable("Back"),
            message: ko.observable(""),
            methods: {
                populate: function () {
                    try {
                        that.Vmx.isdirty(false);
                        that.Vmx.editdonetext("Edit");
                        that.Vmx.backcanceltext("Back");
                        that.Vmx.subscriptiondxnry = that.SubscriptionInfoDxnry; // (that.subscriptionInfoDxnry);
                        that.Vmx.methods.subscribeisdirty();
                        that.Vmx.message("Use the Edit button to change your subscription.");
                    }
                    catch (ex) {
                        alert("prweb.subscriptionsvc.Vmx.populate  reports " + ex.Message);
                    }
                    return;
                },
                onisdirtychanged: function (newval) {
                    try {
                        if (newval) {
                            that.Vmx.message("Use the Done button to save your subscription.");
                            that.Vmx.editdonetext("Done");
                            that.Vmx.backcanceltext("Cancel");
                        }
                        else {
                            that.Vmx.message("Select your subscription.");
                            that.Vmx.editdonetext("Edit");
                            that.Vmx.backcanceltext("Back");
                        }
                    }
                    catch (ex) {
                        alert("prweb.subscriptionsvc.Vmx.onisdirtychanged  reports " + ex.Message);
                    }
                    return;
                },
                subscribeisdirty: function () {
                    try {
                        that.Vmx.isdirtysubscription = that.Vmx.isdirty.subscribe(that.Vmx.methods.onisdirtychanged);
                    }
                    catch (ex) {
                        alert("prweb.subscriptionsvc.Vmx.subscribeisdirty  reports " + ex.Message);
                    }
                    return;
                },
                dispose: function () {
                    try {
                        that.Vmx.isdirtysubscription.dispose();
                        that.Vmx.isdirtysubscription = null;
                        that.Vmx.isdirty(false);
                        ko.cleanNode($("#subscriptionhomecontentouter")[0]);
                        that.Vmx.subscriptiondxnry = null;
                    }
                    catch (ex) {
                        alert("prweb.subscriptionsvc.Vmx.dispose  reports " + ex.Message);
                    }
                    return;
                }
            }
        };

        that.DisposeVmx = function () {
            try {
                that.Vmx.methods.dispose();
            }
            catch (ex) {
                alert("prweb.subscriptionsvc.Vmx.DisposeVmx  reports " + ex.Message);
            }
        };
        //#endregion


        //#region RetrieveSurveyLinks and CreateUrl
        that.retrievesubscriptioninfoUrl = false;

        that.RetrieveSubscriptionColxn = function () {
            try {
                var myurl = that.retrievesubscriptioninfoUrl;
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        success: function (subscriptiondata) {
                            try {
                                //the subscriptiondata object is an anonymous type created in subscribermaincontroller.JsonRetrievesubscriptionInfo
                                that.dataToSend.subscriptionpkg = subscriptiondata.subscriptionpkg;
                                that.SubscriptionInfoDxnry = [];
                                that.InitializesubscriptionInfoDxnry(subscriptiondata.subscriptionpkg.SubscriptionItemsColxn);
                                $("#subscriptioninforoot").removeClass("prwslideouthide");
                                that.Vmx.methods.populate();
                                that.Vmx.currentsubscription = subscriptiondata.subscriptionpkg.CurrentSubscription
                                var konode = $("#subscriptionhomecontentouter");
                                ko.applyBindings(that.Vmx, konode[0]);
                                konode = null;
                                that.SaveUrl = subscriptiondata.saveurl;
                                that.PopulateDataBoundButtonHandlers();
                                if (prweb.IsTouch) {
                                    $("#subscriptionhomecontentinner").css('-webkit-transform', ' translate3d(0,0,0)');
                                }
                                subscriptiondata = null;

                            }
                            catch (ex) {
                                alert("prweb.subscriptionsvc.RetrievesubscriptionColxn.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            alert("prweb.subscriptionsvc.RetrievesubscriptionColxn.sendRequest reports error..." + e.toString());
                        }
                    });
                }
                else {
                    alert("prweb.subscriptionsvc.RetrievesubscriptionColxn reports retrieve url is false.");
                }
            }
            catch (ex) {
                alert("prweb.subscriptionsvc.RetrievesubscriptionColxn  reports " + ex.Message);
            }
            return;
        };
        //#endregion

        //#region SaveSubscription and SavesubscriptionCompleteHandler
        that.SaveSubscriptionCompleteHandler = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SubscriptionInfoDxnry.length; i++) {
                    var settingentry = that.SubscriptionInfoDxnry[i];
                    var newval = settingentry.isselected();
                    settingentry.originalisselected = newval;
                    settingentry = null;
                    newval = null;
                };
                that.Vmx.isdirty(that.EvaluateDirtySubscription());
                that.Vmx.message("Your subscription option has been changed.");
                rslt = true;
            }
            catch (ex) {
                alert("prweb.subscriptionsvc.SavesubscriptionCompleteHandler reports " + ex.Message);
            }
            return rslt;
        };

        that.SaveUrl = false;
        that.dataToSend = {
            subscriptionpkg: false
        };
        that.SaveSubscription = function () {
            try {
                that.Vmx.message("Saving your subscription change. Please wait...");
                var myurl = that.SaveUrl;
                if (myurl) {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        data: JSON.stringify(that.dataToSend),
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (saveresponse) {
                            try {
                                //this needs to clear the sendRequest data cache for the retrieveGLIUrl...
                                //this needs to do some stuff to make isdirty false...
                                that.SaveSubscriptionCompleteHandler();
                            }
                            catch (ex) {
                                alert("prweb.subscriptionsvc.Savesubscription.successhandler reports " + ex.Message);
                            }
                            return;
                        },
                        error: function (e) {
                            that.Vmx.message("Unable able to complete your subscription change.");
                            alert("prweb.subscriptionsvc.Savesubscription.sendRequest reports error..." + e.error().toString());
                            that.Vmx.message("Unable able to complete your subscription change. Please try again.");
                        }
                    });
                }
                else {
                    alert("prweb.subscriptionsvc.Savesubscription reports SaveUrl is false.");
                }

            }
            catch (ex) {
                alert("prweb.subscriptionsvc.Savesubscription  reports " + ex.Message);
            }
            return;
        };
        //#endregion


        //#region EditDone and BackCancel ButtonActions
        that.EnableCheckboxes = function (newval) {
            var rslt = false;
            try {
                for (var i = 0; i < that.SubscriptionInfoDxnry.length; i++) {
                    var settingentry = that.SubscriptionInfoDxnry[i];
                    settingentry.isenabled = newval;
                    settingentry = null;
                };
                if (newval) {
                    that.Vmx.message("Select your subscription.");
                }
                else {
                    that.Vmx.message("Use the Edit button to change your subscription.");
                }

            }
            catch (ex) {
                alert("prweb.subscriptionsvcsvc.EnableCheckboxes reports " + ex.Message);
            }
            return rslt;
        };

        that.RestoreOriginalValues = function () {
            var rslt = false;
            try {
                for (var i = 0; i < that.SubscriptionInfoDxnry.length; i++) {
                    var settingentry = that.SubscriptionInfoDxnry[i];
                    if (settingentry.isselected() != settingentry.originalisselected) {
                        settingentry.isselected(settingentry.originalisselected);
                    };
                    settingentry = null;
                };
            }
            catch (ex) {
                alert("prweb.subscriptionsvc.RestoreOriginalValues reports " + ex.Message);
            }
            return rslt;
        };

        that.BackCancelButtonAction = function () {
            try {
                if (that.Vmx.isdirty()) {
                    that.RestoreOriginalValues();
                    that.EnableCheckboxes(false);
                }
                else {
                    //this should navigate to  appcntxtsubscriptionview...
                    //subscriberplatform is subscribed to this event...surveyContextChangedHandler puts the appcntxtviewmanager back in homecenterpanel...
                    var e = { newcontext: false };
                    prweb.pubsub.publish(prweb.events.appsvc.surveycontextchanged, e);
                }
            }
            catch (ex) {
                alert("prweb.subscriptionsvc.BackCancelButtonAction reports " + ex.Message);
            }
            return;
        };

        that.EditDoneButtonAction = function () {
            try {
                if (that.Vmx.isdirty()) {
                    that.EnableCheckboxes(false);
                    that.SaveSubscription();
                }
                else {
                    //do the edit action...enable checkboxes click...
                    that.EnableCheckboxes(true);
                }
            }
            catch (ex) {
                alert("prweb.subscriptionsvc.EditDoneButtonAction reports " + ex.Message);
            }
            return;
        };
        //#endregion


        //#region SelectSubscriptionButtonAction and PopulateDataBoundButtonHandlers
        that.SelectSubscriptionButtonAction = function (kodata) {
            if (kodata) {
                //                var curval = kodata.isselected();
                //                if (!curval) {
                that.GroupIsSelectedBehavior();
                kodata.isselected(true);
                //                }
                //                curval = null;

                kodata = null;
            }
            return;
        };

        that.PopulateDataBoundButtonHandlers = function () {
            try {
                $("#subscriptionhomeroot").data("subscriptionview").populateDataBoundButtonHandlers();
            }
            catch (ex) {
                alert("prweb.subscriptionsvc.PopulateDataBoundButtonHandlers reports " + ex.Message);
            }
            return;
        };
        //#endregion

        that.DisposeSubscriptionInfoDxnry = function () {
            try {
                for (var i = 0; i < that.SubscriptionInfoDxnry.length; i++) {
                    that.SubscriptionInfoDxnry[i].methods.dispose();
                    that.SubscriptionInfoDxnry[i] = null;
                };
                that.SubscriptionInfoDxnry = null;
            }
            catch (ex) {
                alert("prweb.sharesurveysvc.DisposeSubscriptionInfoDxnry reports " + ex.Message);
            }
        };


        that.Shutdown = function () {
            that.DisposeSubscriptionInfoDxnry();
            that.DisposeVmx();
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));
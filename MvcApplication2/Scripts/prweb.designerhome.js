/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.designerhome', {
        options: {
            surveycontext: null,
            tlbxhtml: null,
            dpageslisthtml: null,
            dsgnrimgmgrguildstrlisturl: null,
            myDOMNode: null
        },

        _create: function () {
            var pdinit = prweb.designersvc.InitializeDesignerSvc();
            pdinit = null;
            var dm = $("#designercanvasouter"); // can't have overlapping bindings...
            //            var pdvmx = prweb.designersvc.Vmx;
            ko.applyBindings(prweb.designersvc.Vmx, dm[0]); // this is where designeritemcolxn will be bound...
            dm = null;
            var konode = $("#designeritemeditorhomecontainer");
            ko.applyBindings(prweb.designeritemeditorsvc.Vmx, konode[0]);
            konode = null;
            if (prweb.IsTouch) {
                //                $("#designerhomeviewcontainer").pinchpanzoom({
                //                    ppztargetslctor: "#designercanvasouter",
                //                    maxscale: 1.5
                //                });
            }
            var svycntxt = this.options.surveycontext;
            this._retrieveDesignerObjects(svycntxt); //populates toolbox etc with html...is asynch method...

        },


        //        ChangeSurveyContext: function (e) {
        //            prweb.designersvc.ChangeSurveyContext(e); //might just go to PopulatesurveyModelContext...
        //            // want to do change survey dialogue...if designer is dirty..ask to save or cancel changes...do survey save etc...
        //            prweb.designersvc.PopulateSurveyModelContext(e.newcontext);
        //        },

        _retrieveDesignerObjects: function (scntxt) {
            var pd = prweb.designersvc.designerresourcesUrl;
            var pdmsrobj,
                myurl = null;
            if (pd) {
                myurl = pd;
                //i want this guy to go to the dataManager dataCache for this html...
                //so, use the sendRequest facility...
                //            var self = this;
                pd = null;
                //                prweb.dataManager.sendRequest;
                //                pdmsrobj = ;
                try {
                    prweb.dataManager.sendRequest({
                        url: myurl,
                        success: function (designerrsourcesjson) {
                            try {
                                //tlbx: has html for tlbx, //dpl: has html for designerpageslist etc...
                                //put the html into the containers.html();???? here???
                                prweb.appsvc.renamesurveyurl = designerrsourcesjson.renamesurveyurl;
                                prweb.designersavesurveysvc.saveSurveyUrl = designerrsourcesjson.savesurveyurl;
                                prweb.designersavesurveysvc.savePageUrl = designerrsourcesjson.savepageurl;
                                prweb.designersvc.donebtn = designerrsourcesjson.donebtn;
                                prweb.designerpcelementsvc.editablecontainer = designerrsourcesjson.editablecontainer;
                                prweb.designerpcelementsvc.ignatzT = designerrsourcesjson.ignatz;
                                prweb.designerpcelementsvc.imageT = designerrsourcesjson.image;
                                prweb.designerpcelementsvc.questoptsetT = designerrsourcesjson.questoptset;
                                prweb.designerpcelementsvc.stylablepageT = designerrsourcesjson.stylablepage;
                                $("#designtoolscontainer").html(designerrsourcesjson.tlbx);
                                $("#designertoolboxslideoutpanel").designtoolbox();
                                $("#designstylescontainer").html(designerrsourcesjson.stylesbx);
                                $("#designerstylesslideoutpanel").designstyles();
                                $("#designoptionscontainer").html(designerrsourcesjson.optionsbx)
                                $("#designeroptionsslideoutpanel").designoptions();
                                $("#shomepagespanel").html(designerrsourcesjson.dpl);
                                $("#designerpageslistpanel").designerpageslist();
                                $("#designimagesmgrcontainer").html(designerrsourcesjson.imgmgrbx);
                                $("#dsgnrimagesmgrpanel").designimagesmgr();
                                prweb.redactorplugins.Install();
                                designerrsourcesjson = null;
                                pd = null;
                                myurl = null;
                                if (scntxt) {
                                    prweb.designersvc.ChangeSurveyContext(scntxt);
                                }
                                scntxt = null;
                                prweb.appmessagesvc.Initialize();
                                prweb.appmessagesvc.PopulateViewMessage("Use the toolbox to add survey parts to this page.");
                            }
                            catch (ex) {
                                alert("prweb.designersvc.RetrieveDesignerObjectshtml.successHandler reports ... " + ex.toString());
                            }

                            return true;
                        },
                        error: function (ex) {
                            alert("prweb.designersvc.RetrieveDesignerObjectshtml sendRequest reports ... " + ex.toString());
                            myurl = null;
                            ex = null;
                        }
                    });
                }
                catch (e) {
                    alert("prweb.designerhome.sendRequest error...");
                    e = null;
                }
                finally {
                    return true;
                    //                    pdmsrobj = null;
                    //                    pdm = null;
                }

            }
            //            pdmsrobj = null;
            pd = null;
            return true;
        },


        _dispose: function () {
            try {
                //                $("#designercanvasouter").off("swipe");
                prweb.gestureizer.DesignDispose();
                $("#designertoolboxslideoutpanel").data("designtoolbox").dispose();
                $("#designertoolboxslideoutpanel").html("").remove();
                $("#designtoolscontainer").addClass("prwslideouthide");
                $("#designerstylesslideoutpanel").data("designstyles").dispose();
                $("#designerstylesslideoutpanel").html("").remove();
                $("#designeroptionsslideoutpanel").data("designoptions").dispose();
                $("#designeroptionsslideoutpanel").html("").remove();
                $("#dsgnrimagesmgrpanel").data("designimagesmgr").dispose();
                $("#dsgnrimagesmgrpanel").html("").remove();
                var dmn = $("#designerhomeviewcontainer");
                ko.cleanNode(dmn[0]);
                //                dmn.unbind().empty();
                dmn.remove();
                dmn = null;
                ko.cleanNode($("#designeritemeditorhomecontainer")[0]);

                $("#designerpageslistpanel").data("designerpageslist").dispose();
                $("#designerpageslistpanel").html("").remove();
                prweb.designersvc.ShutdownDesignerSvc();
            }
            catch (e) {
                alert("prweb.designerhome.dispose reports error");
            }
            return;
        },

        destroy: function () {
            //            prweb.pubsub.unsubscribe(prweb.events.subscriberplatform.smddetailsbtnclick, this._moveToVisualStateSMDDetailsBtnClick, this);
            //            var ds = this._dispose;
            //            ds();
            //            ds = null;
            this._dispose();

            $.Widget.prototype.destroy.call(this);

            //            this.element = null;
        }
    });
} (this.prweb, jQuery));
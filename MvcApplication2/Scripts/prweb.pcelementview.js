(function (prweb, $) {

    var shortAnimationLength = 600,
        longAnimationLength = 800;

    $.widget('prweb.pcelementview', {
        options: {
            id: 0,
            myoffset: '0 0',
            myoffsetleft: 0,
            myoffsettop: 0,
            myxheight: 0,
            myxwidth: 0,
            attsDxnry: null,
            subscribe: {},
            publish: {},
            title: '',
            displayName: '',
            surveyID: -1,
            dataUrl: null,
            melayoutElement: null,
            myParent: null,
            viewModelx: {},
            hasAppliedBindings: false,
            sendRequest: {}
        },




        _create: function () {
//            var self = this,
//                offleft,
//                offtop,
//                scalefactorheight = 0.5,
//                scalefactorwidth = 0.5;
//            //            this._setOption('id', this.element.data('surveyid'));
//            //            this.options.surveyID = this.element.data('surveyid');
//            self.options.melayoutElement = this.element;
//            self.options.myParent = this.element.parent('div')[0];
//            //            this.options.dataUrl = this.element.data('surveymetadatamodelurl');
//            this._setOption('sendRequest', prweb.dataManager.sendRequest);
//            //            scalefactorwidth = ((self.options.myParent.clientWidth / 1366) * 0.95);
//            //            scalefactorheight = ((self.options.myParent.clientHeight / 768) * 0.95);
//            //            self.options.melayoutElement.height((self.options.myxheight * scalefactorheight));
//            //            self.options.melayoutElement.width((self.options.myxwidth * scalefactorwidth));

//            //            offleft = (parseInt(self.options.myoffsetleft) * scalefactorwidth);
//            //            offtop = (parseInt(self.options.myoffsettop) * scalefactorheight);
//            //            self.options.myoffset = offleft + " " + offtop;
//            //            self._doSizeandposition();

//            //            self.options.melayoutElement.effect('scale', { percent: 80 }, 800);

//            //            this._retrieveSurveyMetaDataModel();
//            //            this._adjustNavigation();
        },

//        _doSizeandposition: function () {
//            var self = this;
//            self.options.melayoutElement.position({
//                my: "left top",
//                at: "left top",
//                of: self.options.myParent,
//                offset: self.options.myoffset,
//                collision: "none"
//            });
//        },

//        _retrieveSurveyMetaDataModel: function () {
//            var that = this;
//            this.options.sendRequest({
//                url: this._createRequestUrl(),
//                success: function (data) {
//                    if (that.options.hasAppliedBindings) {
//                        that._myUpdatemodel(data);
//                    }

//                    if (!that.options.hasAppliedBindings) {
//                        that._myApplybindings(data);
//                        //                        that.options.publish(prweb.events.status, {
//                        //                            type: 'saving',
//                        //                            message: 'SurveyMetaDataView applyBinding...',
//                        //                            duration: 8000
//                        //                        });
//                    }

//                },
//                error: function () {
//                    alert('SurveyMetaDataView retrieve surveymetadatamodel error...');
//                }
//            });
//        },

//        _createRequestUrl: function () {
//            return this.options.dataUrl;
//        },
//        _myUpdatemodel: function (data) {
//            ko.mapping.fromJS(data, {}, this.options.viewModelx.stats);
//        },

//        _myApplybindings: function (data) {
//            this.options.viewModelx.stats = ko.mapping.fromJS(data);
//            ko.applyBindings(this.options.viewModelx, this.options.myDOMNode);
//            this.options.hasAppliedBindings = true;
//        },

//        // Take over link navigation in the widget to enable a
//        // single page interface.  This will keep all links point to the dashboard
//        // with the proper url hash set for the action.
//        _adjustNavigation: function () {
//            var that = this;

//            this.element.find('[data-action]').each(function () {
//                var $this = $(this),
//                    action = $this.data('action'),
//                    surveyiconId = that.options.id,
//                    state = $.bbq.getState() || {},
//                    newUrlBase = prweb.getBaseUrl();

//                state.id = surveyiconId;
//                switch (action) {
//                    case 'survey-metadataview-selected':
//                        state.layout = 'survey-metadataview';
//                        break;
//                    case 'xxx':
//                        state.layout = 'survey-metadataview';
//                        break;
//                };
//                $this.attr('href', $.param.fragment(newUrlBase, state));
//            });
//        },

        destroy: function () {
//            this.options.sendRequest = null;
//            this.options.myParent = null;
//            this.options.melayoutElement = null;
//            this.element.empty();

            this.element[0].removeNode(true);
            this.element[0].innerHTML="";
            $.Widget.prototype.destroy.call(this);

        }
    });
} (this.prweb, jQuery));
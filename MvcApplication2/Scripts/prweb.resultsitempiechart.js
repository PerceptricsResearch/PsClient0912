/* File Created: January 19, 2012 */
(function (prweb, $) {

    var shortAnimationLength = 600,
        longAnimationLength = 800;

    $.widget('prweb.resultsitempiechart', {
        options: {
            id: 0,
            selectedPathstring: null,
            myanimguid: null,
            myselectedPathnode: null,
            subscribe: null,
            publish: null,
            title: '',
            displayName: '',
            surveyID: -1,
            dataUrl: null,
            myDOMNode: null,
            viewModelx: null,
            hasAppliedBindings: false,
            sendRequest: null
        },




        _create: function () {
//            this.options.myAnimpathnode = this.element.find('path');
//            var myanimelem = this.element.find('animate');
//            myanimelem.attr({ to: this.options.selectedPathstring });
//                        this.options.myAnimpathnode.animate({ d: this.options.selectedPathstring }, { duration: 1000, easing: 'easeInQuad' });
//            this.options.myAnimpathnode.animate({ d: this.options.selectedPathstring }, 1500, "easeInQuad");
            //            this.options.myAnimpathnode.attr('d', this.options.selectedPathstring);
//            this.options.myDOMNode = this.element.children('div')[0];
            //            this.options.dataUrl = this.element.data('surveymetadatamodelurl');
            //            this._setOption('sendRequest', prweb.dataManager.sendRequest);
//            this.options.sendRequest = prweb.dataManager.sendRequest;
            //            var self = this;
            //            self.element.height("50%");
            //            self.element.width("50%");
            //            self.element.effect('scale', { percent: 80 }, 100);
            //            this._retrieveSurveyMetaDataModel();
            //            this._adjustNavigation();
//            this.options.myAnimpathnode.attr('d', this.options.selectedPathstring);
        },


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
//            this.options.myDOMNode = null;
            this.element.unbind().empty();
//            this.element;
//            this.element.remove();
            //            this.element[0].removeNode(true);
//            this.element[0].innerHTML = "";
            $.Widget.prototype.destroy.call(this);

        }
    });
} (this.prweb, jQuery));
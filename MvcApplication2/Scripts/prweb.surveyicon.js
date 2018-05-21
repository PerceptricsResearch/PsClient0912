(function (prweb, $) {

    var shortAnimationLength = 600,
        longAnimationLength = 800;

    $.widget('prweb.surveyicon', {
        options: {
            id: 0,
            collapsed: false
        },

        _create: function () {
            this._setOption('id', this.element.data('surveyid'));
//            this._adjustNavigation();
        },

        // Take over link navigation in the widget to enable a
        // single page interface.  This will keep all links point to the dashboard
        // with the proper url hash set for the action.
        _adjustNavigation: function () {
            var that = this;

            this.element.find('[data-action]').each(function () {
                var $this = $(this),
                    action = $this.data('action'),
                    surveyiconId = that.options.id,
                    state = $.bbq.getState() || {},
                    newUrlBase = prweb.getBaseUrl();

                state.id = surveyiconId;
                switch (action) {
                    case 'survey-metadataview-selected':
                        state.layout = 'survey-metadataview';
                        break;
                    case 'xxx':
                        state.layout = 'survey-metadataview';
                        break;
                };
                $this.attr('href', $.param.fragment(newUrlBase, state));
            });
        }
    });
} (this.prweb, jQuery));
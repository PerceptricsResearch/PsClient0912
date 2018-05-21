(function (prweb, $) {

    prweb.events = {

        status: 'status',

        designersvc: {
            designeritemcontextchanged: 'dsgnrsvc_designeritemcontextchanged'
        },

        designereditable: {
            unselecteditable: 'dsgnredit_unselecteditable',
            hasfocus: 'dsgnredit_hasfocus',
            textselected: 'dsgnredit_textselected'
        },

        dialoguemanager: {
            dialoguecomplete: 'dlgmgr_dialoguecomplete'
        },

        imagesmgrsvc: {
            selectedimgurlchanged: 'ims_selectedimgurlchanged'
        },

        subscriberheartbeatsvc: {
            somethingnew: 'shbt_somethingnew'
        },

        appsvc: {
            appsvcinitialized: 'app_appsvcinitialized',
            appcontextchanged: 'app_appcontextchanged',
            appcontextpublish: 'app_appcontextpublish',
            surveycontextchanged: 'app_surveycontextchanged'
        },

        groupsslider: {
            openanimationcomplete: 'gs_animationcomplete'},

        subscriberplatform: {
            appcontextchanged: 'sp_appcontextchanged',
            appcontextpublish: 'sp_appcontextpublish',
            actionsbtnclick: 'sp_actionsbtnclick',
            surveysbtnclick: 'sp_surveysbtnclick',
            surveyopened: 'sp_surveyopened',
            surveyclosed: 'sp_surveyclosed',
            pagesbtnclick: 'sp_pagesbtnclick',
            publishsurveyiconclick: 'sp_publishsurveyiconclick',
            scrolltopage: 'sp_scrolltopage',
            pageslistpagecountchanged: 'sp_pageslistpagecountchanged',
            pagelistpageiconselected: 'sp_pagelistpageiconselected',
            surveycurrentpagechanged: 'sp_surveycurrentpagechanged',
            rsltsgroupsbtnclick: 'sp_rsltsgroupsbtnclick',
            smddetailsbtnclick: 'sp_smddetailsbtnclick',
            prwdesigntoolsbtn: 'sp_prwdesigntoolsbtn',
            prwdesignstylesbtn: 'sp_prwdesignstylesbtn',
            prwdesignimagesmgrbtn: 'sp_prwdesignimagesmgrbtn',
            rsltssurveyselected: 'sp_rsltssurveyselected',
            pcvmodechange: 'sp_pcvmodechange',
            grpoptionselectorschange: 'sp_grpoptionselectorschange',
            grpdefnpageiconselected: 'sp_grpdefnpageiconselected',
            grpdefnselected: 'sp_grpdefnselected',
            rsltsfilteremelementschanged: 'sp_rsltsfilteremelementschanged',
            grprsltsselected: 'sp_grprsltsselected'

        },

        publishsvc: {
            datacontextchanged: 'pb_datacontextchanged'
        },

        rdentplatform: {
            scrolltopage: 'rd_scrolltopage',
            surveycurrentpagechanged: 'rd_surveycurrentpagechanged',
            pagesbtnclick: 'rd_pagesbtnclick',
            actionsbtnclick: 'rd_actionsbtnclick'
        },

        //these are events that subscrnavpanel will publish and VSM will subscribe to...
        subscrnavpanel: {
            home: 'home',
            navtileselected: 'navtileselected'
        },

        // these are events that vsm will publish and various VisualWidgets will subscribe to...
        vsm: {
            subscrnavpanel: {
                thincolumnleft: 'thincolumnleft',
                docktoolbarleft: 'snp_docktoolbarleft',
                actionsbtnclick: 'snp_actionsbtnclick',
                surveysbtnclick: 'snp_surveysbtnclick',
                subscriberhome: 'home'
            },
            surveyiconlistpanel: {
                surveysbtnclick: 'silp_surveysbtnclick',
                designhome: 'designhome',
                publishhome: 'publishhome',
                resultshome: 'resultshome',
                surveyshome: 'surveyshome',
                sharehome: 'sharehome',
                subscriptionhome: 'subscriptionhome',
                subscriberhome: 'subscriberhome'
            }
        },

        vehicle: {
            details: {
                selected: 'details/selected'
            },
            fillups: {
                selected: 'fillups/selected'
            },
            reminders: {
                selected: 'reminders/selected',
                fulfilled: 'reminders/fulfilled'
            },
            add: {
                selected: 'add/selected'
            },
            deleted: 'delete/succeeded'
        },

        dashboard: {
            selected: 'dashboard/selected'
        },
        charts: {
            selected: 'charts/selected'
        }

    };

} (this.prweb = this.prweb || {}, jQuery));
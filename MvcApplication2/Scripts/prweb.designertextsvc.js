/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.6.4-vsdoc.js" />
(function (prweb, $) {
    prweb.designertextsvc = (function () {
        var that = {};
        that.SelectionContent = null;
        that.CurrentSelection = false;

        that.ExecuteCommandSelectionRequired = function (cmd, ui, val) {
            var rslt = false;
            var teditor = that.TMCEeditor();
            if (teditor) {
                teditor.focus();
                if (that.CurrentSelection) {
                    teditor.selection.moveToBookmark(that.CurrentSelection);
                    rslt = teditor.execCommand(cmd, ui, val);
                }
                if (teditor.selection.getContent()) {
                    that.CurrentSelection = teditor.selection.getBookmark();
                }
                else {
                    that.CurrentSelection = false;
                }
            }
            teditor = null;
            return rslt;
        };
        that.ExecuteFontName = function (newval) {
            return that.ExecuteCommandSelectionRequired("fontname", false, newval);
        };

        that.ExecuteFontSize = function (newval) {
            return that.ExecuteCommandSelectionRequired("fontsize", false, newval);
        };
        that.ExecuteItalic = function () {
            var teditor = that.TMCEeditor();
            if (teditor) {

                if (that.CurrentSelection) {
                    teditor.focus();
                    teditor.selection.moveToBookmark(that.CurrentSelection);
                    teditor.execCommand("italic", false, null);
                }
                if (teditor.selection.getContent()) {
                    that.CurrentSelection = teditor.selection.getBookmark();
                }
                else {
                    that.CurrentSelection = false;
                }
            }
            teditor = null;
            return true;
        };
        that.ExecuteBold = function () {
            var teditor = that.TMCEeditor();
            if (teditor) {
                teditor.focus();
                if (that.CurrentSelection) {
                    teditor.selection.moveToBookmark(that.CurrentSelection);
                    teditor.execCommand("bold", false, null);
                }
                if (teditor.selection.getContent()) {
                    that.CurrentSelection = teditor.selection.getBookmark();
                }
                else {
                    that.CurrentSelection = false;
                }
            }
            teditor = null;
            return true;
        };
        that.ExecuteColor = function () {
            var teditor = that.TMCEeditor();
            if (teditor) {
                teditor.focus();


                if (that.CurrentSelection) {
                    //                    teditor.focus();
                    teditor.selection.moveToBookmark(that.CurrentSelection);
                    var newcolor = prweb.colorssvc.NewColor();

                    try {
                        teditor.execCommand("forecolor", false, newcolor);
                    }
                    catch (ex) {
                        var dbg2 = 2;
                    }
                }
                if (teditor.selection.getContent()) {
                    //                    teditor.focus();
                    that.CurrentSelection = teditor.selection.getBookmark(1);
                }
                else {
                    //                    teditor.focus();
                    that.CurrentSelection = false;
                }
            }
            teditor = null;
            return true;
        };
        that.ExecuteUnderline = function () {
            return that.ExecuteCommandSelectionRequired("underline", false, null);
        };
        that.ExecuteJustifyLeft = function () {
            return that.ExecuteCommandSelectionRequired("justifyleft", false, null);
        };
        that.ExecuteJustifyRight = function () {
            return that.ExecuteCommandSelectionRequired("justifyright", false, null);
        };
        that.ExecuteJustifyCenter = function () {
            return that.ExecuteCommandSelectionRequired("justifycenter", false, null);
        };
        that.ExecuteJustifyFull = function () {
            return that.ExecuteCommandSelectionRequired("justifyfull", false, null);
        };

        that.myisTinyMceInit = false;
        that.jtmce = false;
        that.TMCEeditor = function () {
            var rslt = false;
            try {
                if (tinymce != undefined) {
                    rslt = tinymce.activeEditor;
                }
            }
            catch (ex) {
                //no tinymce yet...
                ex = null;
            }
            return rslt;
        };

        that.tinymceurl = false;
        that.MyTextSelector = null;

        that.NewTextSelector = function (useelem) {
            that.MyTextSelector = new TextSelector(useelem);
            return that.MyTextSelector;
        };

        that.CurrentEditable = false;

        that.ApplyEditableChanges = function () {
            try {
                if (prweb.designeritemeditorsvc.editableselector) {
                    var myta = $("#" + prweb.designeritemeditorsvc.editableselector);
                    var html = null;
                    if (myta.length == 1) {
                        html = myta.getCode();
                        redtblewidget = prweb.designertextsvc.CurrentEditable.data("designereditable");
                        if (redtblewidget) {
                            redtblewidget.populateEditedHtml(html);
//                            redtblewidget._turnmyselectedlightsoff(-2);
//                            prweb.designersvc.editablecontent = false;
//                            prweb.designersvc.editablecontainerpgnum = 0;
//                            prweb.designersvc.editableselector = false;
                        }
                        else {
                            alert("prweb.designertextsvc.ApplyEditableChanges reports redtblewidget is false...");
                        }
                    }
                }
            }
            catch (ex) {
                alert("designertextsvc.ApplyEditableChanges reports " + ex.Message);
            }
            return;
        };

        that.GetRidofCurrentEditable = function () {
            var editablewidget = null;
            var turnoffguy = null;
            var redtblewidget = false;
            try {
                if (prweb.designeritemeditorsvc.editableselector) {
                    that.ApplyEditableChanges();
                    that.CurrentEditable = false;
                    that.CurrentSelection = false;
                    prweb.designeritemeditorsvc.editablecontent = false;
                    prweb.designeritemeditorsvc.editablecontainerpgnum = 0;
                    prweb.designeritemeditorsvc.editableselector = false;
                }
                if (that.CurrentEditable) {
                    alert("prweb.designertextsvc.getridofCurrentEditable reports CurrentEditable but not designersvc.editableselector..");
                    editablewidget = that.CurrentEditable.data("designereditable");
                    if (editablewidget) {
                        turnoffguy = editablewidget._turnmyselectedlightsoff(-2);
                        //                        prweb.designersvc.RemoveEditableContainer();
                        turnoffguy = null;
                        editablewidget = null;
                    }
                    that.CurrentEditable = null;
                    that.CurrentSelection = false;
                }
            }
            catch (ex) {
                alert("prweb.designertextsvc.GetRidofCurrentEditable reports error " + ex.Message);
            }
            finally {
                editablewidget = null;
                turnoffguy = null;
                that.CurrentEditable = false;
                that.CurrentSelection = false;
                return true;
            }

        };

        that.SelectionOnNewEditor = false;
        that.OrginalElemStyle = false;
        //        that.NewEditor = function (uselem) {
        //            try {
        ////                that.GetRidofCurrentEditable();
        //                that.CurrentSelection = false;
        ////                that.CurrentEditable = uselem;
        //                that.SelectionOnNewEditor = false;
        //                that.MyTextSelector = null;

        //                if (document.selection) {
        //                    //                document.execCommand('bold', false, null);
        //                    var range = document.selection.createRange();
        //                    if (range) {
        //                        //                    range.execCommand("bold", null, false);
        //                        var stored_range = range.duplicate();
        //                        stored_range.moveToElementText(uselem[0]);
        //                        stored_range.setEndPoint('EndToEnd', range);
        //                        var start = stored_range.text.length - range.text.length;
        //                        var end = start + range.text.length;
        //                        that.SelectionOnNewEditor = { start: start, end: end, length: range.text.length };
        //                        stored_range = null;
        //                        start = null;
        //                        end = null;
        //                    }
        //                    range = null;
        //                }
        //                uselem = null;
        //            }
        //            catch (e) { alert("prweb.designertextsvc.NewEditor reports error " + e.Message); }
        //            finally {
        //                uselem = null;
        //                return true;
        //            }
        //        };

        that.Shutdown = function () {
            try {
                that.GetRidofCurrentEditable();
                that.CurrentEditable = null;
                that.CurrentSelection = null;
                that.SelectionOnNewEditor = null;
                that.OrginalElemStyle = null;
                //                if (tinymce) {
                //                    tinymce.settings = null;
                //                }

                //                delete $.fn.tinymce;

                //                tinymce.;
                //                tinymce.destroy();
            }
            catch (e) { alert("prweb.designertextsvc.Shutdown reports error " + e.Message); }
            finally {
                return true;
            }
        };

        return that;
    } ());
} (this.prweb = this.prweb || {}, jQuery));

//function TextSelector(elem) {
//    if (elem instanceof jQuery) {
//        elem = elem[0];
//    }
//    this.parent = elem;

//    this.get = function () {
//        if (typeof elem.selectionStart !== 'undefined') {
//            return {
//                start: elem.selectionStart,
//                end: elem.selectionEnd,
//                length: elem.selectionEnd - elem.selectionStart
//            };
//        }
//        var range = document.selection.createRange();
//        var stored_range = range.duplicate();
//        stored_range.moveToElementText(elem);
//        stored_range.setEndPoint('EndToEnd', range);
//        var start = stored_range.text.length - range.text.length;
//        var end = start + range.text.length;
//        return { start: start, end: end, length: range.text.length };
//    };

//    this.replace = function (newText) {
//        if (typeof elem.selectionStart !== 'undefined') {
//            elem.value = elem.value.substr(0, elem.selectionStart) + newText + elem.value.substr(elem.selectionEnd);
//            return this;
//        }
//        elem.focus();
//        document.selection.createRange().text = newText;
//        return this;
//    };

//    this.select = function (start, end) {
//        if (typeof start.start !== 'undefined') {
//            end = start.end;
//            start = start.start;
//        }
//        if (typeof elem.setSelectionRange !== 'undefined') {
//            elem.focus();
//            elem.setSelectionRange(start, end);
//        }
//        else if (typeof elem.createTextRange !== 'undefined') {
//            var range = elem.createTextRange();
//            range.collapse(true);
//            range.moveEnd('character', end);
//            range.moveStart('character', start);
//            range.select();
//        }
//        return this;
//    };

//    this.isSelected = function () {
//        return this.get().length !== 0;
//    };

//    this.text = function () {
//        if (typeof document.selection !== 'undefined') {
//            return document.selection.createRange().text;
//        }
//        return elem.value.substr(elem.selectionStart, elem.selectionEnd - elem.selectionStart);
//    };

//    this._stored = null;
//    this.store = function () {
//        this._stored = this.get();
//    };

//    this.load = function () {
//        this.select(this._stored);
//    };
//}; //end of TextSelector

//tinyMCE.init({
//    mode: "none",
//    theme: function (editor, target) {
//        // Generate UI        
//        var editorContainer = $(target)//.after('<div style="border: 1px solid gray"></div>').next();
//                                                                      .after(
//                                                                            '<div style="border: 1px solid gray;">' +
//                                                                                '<div style="border: 1px solid red;">' +
//                                                                                    '<button data-mce-command="bold">B</button>' +
//                                                                                    '<button data-mce-command="italic">I</button>' +
//                                                                                '</div>' +
//                                                                                '<div style="border-top: 1px solid gray"></div>' +
//                                                                            '</div>'
//                                                                        ).next();
//        //                         Bind events for each button        
//        $("button", editorContainer).button().click(function (e) {
//            e.preventDefault();
//            e.stopPropagation();
//            // Execute editor command based on data parameters  
//            var whatthisvalue = $(this).attr('data-mce-value');
//            editor.execCommand(
//                                                                            $(this).attr('data-mce-command'),
//                                                                            false,
//                                                                            $(this).attr('data-mce-value')
//                                                                        );
//        });
//        // Set editor container with to target width        
//        editorContainer.css('width', $(target).width());

//        that.TMCEeditor = editor;
//        // Return editor and iframe containers        
//        return {
//            editorContainer: editorContainer[0],
//            iframeContainer: editorContainer.last()[0],

//            // (Optional) Calculate iframe height: target height - toolbar height            
//            iframeHeight: $(target).height() - editorContainer.first().outerHeight() - 1
//        };
//    }
//});
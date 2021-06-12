import ace from 'ace-builds/src-noconflict/ace';
import "ace-builds/webpack-resolver";
import theme from 'ace-builds/src-noconflict/theme-textmate';
import "./stop-mode/stop-mode.js";

window.theme_textmate = theme;

var editor = ace.edit("editor");
editor.getSession().setMode("ace/mode/stop-mode");
editor.setTheme(window.theme_textmate);

// Load saved content
if(localStorage){
    var stopfileKey = "my.stop";
    var value = localStorage.getItem(stopfileKey);
    if ((value != undefined) && (typeof value == "string")) {
        editor.getSession().setValue(value);
    }
    editor.getSession().on('change', function(delta) {
        localStorage.setItem(
            stopfileKey,
            editor.getSession()
        );
    });
}
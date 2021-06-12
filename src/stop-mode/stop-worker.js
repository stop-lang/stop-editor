import './worker-base.js';
import {Stop} from "stop";

ace.define('ace/worker/stop-worker',["require","exports","module","ace/lib/oop","ace/worker/mirror"], function(requireLocal, exports, module) {
    "use strict";

    var oop = ace.require("ace/lib/oop");
    var Mirror = ace.require("ace/worker/mirror").Mirror;

    var StopWorker = function(sender) {
        Mirror.call(this, sender);
        this.setTimeout(200);
        this.$dialect = null;
    };

    oop.inherits(StopWorker, Mirror);

    var validate = function(input) {
        var annotations = [];

        try {
            new Stop(input);
        }catch(exception){
            if (exception.annotations){
                annotations = exception.annotations;
            }else if (exception.message){
                annotations.push({
                    row: 0,
                    column: 0,
                    text: exception.message,
                    type: "error"
                });
            }
        }

        return {annotations: annotations};
    };

    (function() {

        this.onCreate = function(){
            var value = this.doc.getValue();
            var validateObj = validate(value);
            this.sender.emit("annotate", validateObj.annotations);
        };
        
        this.onUpdate = function() {
            var value = this.doc.getValue();
            var validateObj = validate(value);
            this.sender.emit("annotate", validateObj.annotations);
        };

    }).call(StopWorker.prototype);

    exports.StopWorker = StopWorker;

    return exports;
});

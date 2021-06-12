ace.define('ace/mode/stop-mode',["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/text_highlight_rules", "ace/mode/doc_comment_highlight_rules", "ace/worker/worker_client" ], function(require, exports, module) {
    var oop = require("ace/lib/oop");
    var TextMode = require("ace/mode/text").Mode;
    var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

    var StopHighlightRules = function() {
        var keywordMapper = this.createKeywordMapper({
            "keyword.control": "throws",
            "keyword.operator": "->|<-|>>",
            "keyword.other": "start|stop|async|include|optional|queue",
            "storage.type": "enum|double|float|int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|bool|string|bytes|timestamp",
            "constant.language": "timeout"
  }, "identifier");
        this.$rules = {
            "start": [
                {
                    token : "comment", // comments are not allowed, but who cares?
                    regex : "\\/\\/.*$"
                }, 
                {
                    token : "comment.start", // comments are not allowed, but who cares?
                    regex : "\\/\\*",
                    next  : "comment"
                },
                { token : "string",  regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]' },
                { token : "constant.numeric", regex : "0[xX][0-9a-fA-F]+\\b" },
                { token : "constant.numeric", regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b" },
                { token : "keyword.operator", regex : "!|%|\\\\|/|\\*|\\-|\\+|~=|==|<>|!=|<=|>=|=|<|>|&&|\\|\\|" },
                { token : "punctuation.operator", regex : "\\?|\\:|\\,|\\;|\\." },
                { token : "paren.lparen", regex : "[[({]" },
                { token : "paren.rparen", regex : "[\\])}]" },
                { token : "text", regex : "\\s+" },
                { token : "constant", regex : "[A-Z][A-Z]+\\b"  },
                { token : "variable", regex : "[A-Z][a-zA-Z0-9_$]*\\b"  },
                { token: keywordMapper, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" }
                
            ],
            "comment" : [
                {
                    token : "comment.end", // comments are not allowed, but who cares?
                    regex : "\\*\\/",
                    next  : "start"
                }, {
                    defaultToken: "comment"
                }
            ]
        };
    };
    oop.inherits(StopHighlightRules, TextHighlightRules);

    var StopMode = function() {
        this.HighlightRules = StopHighlightRules;
    };
    oop.inherits(StopMode, TextMode);

    (function() {
        this.$id = "ace/mode/stop-mode";
        var WorkerClient = require("ace/worker/worker_client").WorkerClient;
        this.createWorker = function(session) {
            this.$worker = new WorkerClient(["ace"], "ace/worker/stop-worker", "StopWorker", "./worker.bundle.js");
            this.$worker.attachToDocument(session.getDocument());

            this.$worker.on("errors", function(e) {
                session.setAnnotations(e.data);
            });
        
            this.$worker.on("annotate", function(e) {
                session.setAnnotations(e.data);
            });
        
            this.$worker.on("terminate", function() {
                session.clearAnnotations();
            });
        
            return this.$worker;
        };
    }).call(StopMode.prototype);

    exports.Mode = StopMode;
});
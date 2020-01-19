ace.define("ace/mode/antswordjwt_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
  "use strict";
  var r = e("../lib/oop"),
    i = e("./text_highlight_rules").TextHighlightRules,
    s = function () {
      this.$rules = {
        start: [{
          token: "variable",
          regex: /^[0-9a-zA-Z_=]+/
        }, {
          token: "paren.lparen",
          regex: /\./,
          next: "payload"
        }],
        payload: [{
          token: "storage.type",
          regex: /[0-9a-zA-Z_=]+/
        }, {
          token: "paren.rparen",
          regex: /\./,
          next: "sig"
        }],
        sig: [{
          token: "support.function",
          regex: /[0-9a-zA-Z_=]+/
        }]
      }
    };
  r.inherits(s, i), t.AntSwordJWTHighlightRules = s
}), ace.define("ace/mode/antswordjwt", ["require", "exports", "module", "ace/mode/text", "ace/mode/antswordjwt_highlight_rules", "ace/lib/oop"], function (e, t, n) {
  "use strict";
  var r = e("./text").Mode,
    i = e("./antswordjwt_highlight_rules").AntSwordJWTHighlightRules,
    s = e("../lib/oop"),
    o = function () {
      this.HighlightRules = i
    };
  s.inherits(o, r),
    function () {
      this.$id = "ace/mode/antswordjwt"
    }.call(o.prototype), t.Mode = o
});
(function () {
  ace.require(["ace/mode/antswordjwt"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
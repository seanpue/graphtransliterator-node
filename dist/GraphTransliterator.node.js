!(function(e) {
  var t = {};
  function s(n) {
    if (t[n]) return t[n].exports;
    var r = (t[n] = { i: n, l: !1, exports: {} });
    return e[n].call(r.exports, r, r.exports, s), (r.l = !0), r.exports;
  }

  (s.m = e),
    (s.c = t),
    (s.d = function(e, t, n) {
      s.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
    }),
    (s.r = function(e) {
      typeof Symbol !== "undefined" &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (s.t = function(e, t) {
      if ((1 & t && (e = s(e)), 8 & t)) return e;
      if (4 & t && typeof e === "object" && e && e.__esModule) return e;
      var n = Object.create(null);
      if (
        (s.r(n),
        Object.defineProperty(n, "default", { enumerable: !0, value: e }),
        2 & t && typeof e !== "string")
      )
        for (var r in e)
          s.d(
            n,
            r,
            function(t) {
              return e[t];
            }.bind(null, r)
          );
      return n;
    }),
    (s.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };

      return s.d(t, "a", t), t;
    }),
    (s.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (s.p = ""),
    s((s.s = 0));
})([
  function(e, t, s) {
    "use strict";
    class n extends Error {}
    class r extends n {
      constructor(e) {
        super(e), (this.name = "NoMatchingTransliterationRuleError");
      }
    }
    class i extends n {
      constructor(e) {
        super(e), (this.name = "UnrecognizableInputTokenError");
      }
    }
    class o {
      constructor(e) {
        (this.tokens = e.tokens),
          (this.rules = e.rules),
          (this.whitespace = e.whitespace),
          (this.onmatchRules = e.onmatch_rules),
          (this.onmatchRulesLookup = e.onmatch_rules_lookup),
          (this.metadata = e.metadata),
          (this.tokensByClass = e.tokens_by_class),
          (this.graph = e.graph),
          (this.tokenizerPattern = e.tokenizer_pattern),
          (this.ignoreErrors = e.ignore_errors),
          (this.checkAmbiguity = e.check_ambiguity),
          (this.version = e.version),
          (this.coverage = e.coverage),
          (this.tokenizer = RegExp(this.tokenizerPattern, "g")),
          (this.lastRuleKeys = []),
          (this.lastInputDetails = []),
          (this.lastInputTokens = []),
          (this.lastRuleKeys = []),
          (this.lastHasErrors = !1);
      }

      get lastMatchedRules() {
        return this.lastRuleKeys.map(e => this.rules[e]);
      }

      get lastMatchedRuleTokens() {
        return this.lastRuleKeys.map(e => this.rules[e].tokens);
      }

      isWhitespace(e) {
        return this.tokens[e].includes(this.whitespace.token_class);
      }

      static fromDict(e) {
        return new o(e);
      }

      tokenize(e) {
        let t = this.tokenizer;
        t.lastIndex = 0;
        for (
          var s = [{ token: this.whitespace.default }], n = !0;
          t.lastIndex < e.length;

        ) {
          var r = t.lastIndex;
          let i = t.exec(e);
          if (i === null)
            s.push({
              matched: !1,
              startIndex: r,
              endIndex: e.length,
              string: e.substring(r, e.length),
              token: this.whitespace.default
            }),
              (t.lastIndex = e.length);
          else {
            i.index > r &&
              s.push({
                matched: !1,
                startIndex: r,
                endIndex: i.index,
                string: e.substring(r, i.index),
                token: this.whitespace.default
              });
            let o = i[0];
            if (this.whitespace.consolidate)
              if (this.isWhitespace(o)) {
                if (((o = this.whitespace.default), n)) {
                  let e = s[s.length - 1].string;
                  s[s.length - 1].string = e ? e + i[0] : i[0];
                  continue;
                }

                n = !0;
              } else n = !1;
            s.push({
              matched: !0,
              startIndex: i.index,
              endIndex: t.lastIndex,
              string: i[0],
              token: o
            });
          }
        }

        if (
          this.whitespace.consolidate &&
          s.length > 1 &&
          !0 === s[s.length - 1].matched &&
          this.isWhitespace(s[s.length - 1].token)
        ) {
          let e = s.pop();
          s.push({ token: this.whitespace.default, string: e.string });
        } else s.push({ token: this.whitespace.default });
        return s;
      }

      matchConstraints(e, t, s, n) {
        let r = e.constraints;
        if (void 0 === r) return !0;
        for (let [e, i] of Object.entries(r))
          if (e === "prev_tokens") {
            let e = s;
            if (
              ((e -= t.rule.tokens.length),
              (e -= i.length),
              !this.matchTokens(e, i, n, !0, !1, !1))
            )
              return !1;
          } else if (e === "next_tokens") {
            let e = s;
            if (!this.matchTokens(e, i, n, !1, !0, !1)) return !1;
          } else if (e === "prev_classes") {
            let e = s;
            e -= t.rule.tokens.length;
            let o = r.prev_tokens;
            if (
              (o && (e -= o.length),
              (e -= i.length),
              !this.matchTokens(e, i, n, !0, !1, !0))
            )
              return !1;
          } else if (e === "next_classes") {
            let e = s;
            let t = r.next_tokens;
            if ((t && (e += t.length), !this.matchTokens(e, i, n, !1, !0, !0)))
              return !1;
          }

        return !0;
      }

      matchTokens(e, t, s, n, r, i) {
        if (n && e < 0) return !1;
        if (r && e + t.length > s.length) return !1;
        for (let n = 0; n < t.length; n++)
          if (i) {
            let r = this.tokens[s[e + n]];
            if (!(r && r.indexOf(t[n]) >= 0)) return !1;
          } else if (s[e + n] !== t[n]) return !1;
        return !0;
      }

      matchAt(e, t, s = !1) {
        let n = this.graph;
        let r = n.node;
        let i = n.edge;
        var o = [];
        var l = [];
        function a(e, s) {
          let n = [];
          let i = r[e].ordered_children;
          if (i)
            if (((n = i[t[s]]), n))
              n.slice()
                .reverse()
                .forEach(function(t) {
                  l.unshift([t, e, s]);
                });
            else {
              let t = i.__rules__;
              t &&
                t
                  .slice()
                  .reverse()
                  .forEach(function(t) {
                    l.unshift([t, e, s]);
                  });
            }
        }

        for (a(0, e); l.length > 0; ) {
          let [e, n, h] = l.shift();
          let u = r[e];
          let c = i[n][e];
          if (u.accepting && this.matchConstraints(c, u, h, t)) {
            if (s) {
              o.push(u.rule_key);
              continue;
            }

            return u.rule_key;
          }

          h < t.length - 1 && (h += 1), a(e, h);
        }

        if (s) return o;
      }

      matchAllAt(e, t) {
        return this.matchAt(e, t, !0);
      }

      transliterate(e) {
        let t = this.tokenize(e);
        let s = Boolean(t.find(e => !1 === e.matched));
        if (s) {
          let s =
            "Unrecognized tokens: " +
            t
              .filter(e => !1 === e.matched)
              .map(e => '"' + e.string + '" at pos ' + e.startIndex)
              .join(", ") +
            ' of "' +
            e +
            '"';
          if (!this.ignoreErrors) throw new i(s);
          console.log(s);
        }

        let n = t.map(e => e.token);
        (this.lastInputDetails = t),
          (this.lastInputTokens = n),
          (this.lastRuleKeys = []),
          (this.lastHasErrors = s);
        let o = 1;
        let l = "";
        for (; o < n.length - 1; ) {
          let s = this.matchAt(o, n);
          if (!s) {
            let s =
              "No matching transliteration rule at pos " +
              t[o].startIndex +
              ' of "' +
              e +
              '"';
            if (this.ignoreErrors) {
              console.log(s), (o += 1);
              continue;
            }

            throw new r(s);
          }

          this.lastRuleKeys.push(s);
          let i = this.rules[s];
          let h = i.tokens;
          if (this.onmatchRules) {
            let e;
            let t = n[o - 1];
            let s = n[o];
            let r = this.onmatchRulesLookup[s];
            if ((r && (e = r[t]), e))
              for (var a = 0; a < e.length; a++) {
                let t = e[a];
                let s = this.onmatchRules[t];
                if (
                  this.matchTokens(
                    o - s.prev_classes.length,
                    s.prev_classes,
                    n,
                    !0,
                    !1,
                    !0
                  ) &&
                  this.matchTokens(o, s.next_classes, n, !1, !0, !0)
                ) {
                  l += s.production;
                  break;
                }
              }
          }

          (l += i.production), (o += h.length);
        }

        return l;
      }
    }
    e.exports = {
      GraphTransliterator: o,
      GraphTransliteratorError: n,
      NoMatchingTransliterationRuleError: r,
      UnrecognizableInputTokenError: i
    };
  }
]);

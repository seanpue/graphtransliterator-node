const assert = require("assert");
const graphtransliterator = require("../index.js");
const GraphTransliterator = graphtransliterator.GraphTransliterator;
const NoMatchingTransliterationRuleError =
  graphtransliterator.NoMatchingTransliterationRuleError;
const UnrecognizableInputTokenError =
  graphtransliterator.UnrecognizableInputTokenError;

var testJSON = require("./test_config.json");

/* Errors */

describe("testJSON", () => {
  it("has necessary settings.", () => {
    assert(testJSON.tokens);
    assert(testJSON.rules);
    assert(testJSON.onmatch_rules);
    assert(testJSON.whitespace);
  });
});

describe("graphtransliterator", () => {
  it("exists", () => {
    assert(graphtransliterator);
  });
  var gt = GraphTransliterator.fromDict(testJSON);
  it("can make a GraphTransliterator with tokens", () => {
    assert(gt.tokens.a.length === 1);
    assert(gt.tokens.a[0] === "class_a");
  });
  it("can detect whitespace", () => {
    gt.isWhitespace(" ");
    assert(gt.isWhitespace(" "));
  });
  it("can tokenize", () => {
    assert.deepEqual(gt.tokenize("abcZ"), [
      { token: " " },
      { matched: true, startIndex: 0, endIndex: 1, string: "a", token: "a" },
      { matched: true, startIndex: 1, endIndex: 2, string: "b", token: "b" },
      { matched: true, startIndex: 2, endIndex: 3, string: "c", token: "c" },
      { matched: false, startIndex: 3, endIndex: 4, string: "Z", token: " " },
      { token: " " }
    ]);
    assert.deepEqual(gt.tokenize("Zabc"), [
      { token: " " },
      { matched: false, startIndex: 0, endIndex: 1, string: "Z", token: " " },
      { matched: true, startIndex: 1, endIndex: 2, string: "a", token: "a" },
      { matched: true, startIndex: 2, endIndex: 3, string: "b", token: "b" },
      { matched: true, startIndex: 3, endIndex: 4, string: "c", token: "c" },
      { token: " " }
    ]);
    assert.deepEqual(gt.tokenize("aZZbc"), [
      { token: " " },
      { matched: true, startIndex: 0, endIndex: 1, string: "a", token: "a" },
      { matched: false, startIndex: 1, endIndex: 3, string: "ZZ", token: " " },
      { matched: true, startIndex: 3, endIndex: 4, string: "b", token: "b" },
      { matched: true, startIndex: 4, endIndex: 5, string: "c", token: "c" },
      { token: " " }
    ]);
    assert.deepEqual(gt.tokenize("  a  "), [
      { token: " ", string: "  " },
      { matched: true, startIndex: 2, endIndex: 3, string: "a", token: "a" },
      { token: " ", string: "  " }
    ]);
  });
  it("can matchAt", () => {
    var tokenDetails = gt.tokenize("ab");
    var tokens = tokenDetails.map(el => el.token);
    assert(gt.matchAt(1, tokens) >= 0);
    // Test match_all
    tokenDetails = gt.tokenize("dd"); // Should be dd and d
    tokens = tokenDetails.map(el => el.token);
    assert(gt.matchAt(1, tokens, true).length === 2);
    assert(gt.matchAllAt(1, tokens).length === 2);
  });
  it("can throw errors", () => {
    gt.ignoreErrors = false;
    assert.throws(function() {
      gt.transliterate("7a");
    }, UnrecognizableInputTokenError);
    assert.throws(function() {
      gt.transliterate("cAa");
    }, NoMatchingTransliterationRuleError);
    gt.ignoreErrors = true;
    assert(gt.transliterate("7a"));
    assert(gt.transliterate("cAa"));
  });
  it("can tranliterate", () => {
    // Rules with single token
    assert(gt.transliterate("a") === "A");
    // Rules with multiple tokens
    assert(gt.transliterate("aa") === "AA");
    // Rules with multiple tokens (for rule_key)
    assert(gt.transliterate("cc") === "C*2");
    // Rules with multiple tokens overlapping end of tokens
    assert(gt.transliterate("c") === "C");
    // Rules with prev class
    assert(gt.transliterate("ca") === "CA");
    // Rules with prev class and prev token
    assert(gt.transliterate("dca") === "D(BEFORE_C_AND_CLASS_A)CA");
    // Rules with prev class and prev tokens
    assert(gt.transliterate("cbba") === "CBBA(AFTER_B_B)");
    // Rules with next class
    assert(gt.transliterate("ac") === "A(BEFORE_CLASS_C)C");
    // Rules with next class and next tokens
    assert(gt.transliterate("acb") === "A(BEFORE_CLASS_C)CB");
    assert(gt.transliterate("ab") === "A,B");
    // Rules that only have constraints on first element
    assert(gt.transliterate("Aa") === "A(ONLY_A_CONSTRAINED_RULE)");
    // Test whitespace consolidation
    assert(gt.transliterate(" a") === "A");
    // Test whitespace consolidation following
    assert(gt.transliterate("a ") === "A");
    // Rules with longer onmatch rules
    assert(gt.transliterate("abab") === "A,B!A,B");
    // Test last_matched_input_tokens
    assert.deepEqual(gt.lastInputTokens, [" ", "a", "b", "a", "b", " "]);
    // Test last_matched_tokens
    assert(gt.lastInputDetails[1].string === "a");
    assert(gt.lastInputDetails.length === 6);

    assert.deepEqual(gt.lastMatchedRuleTokens, [["a"], ["b"], ["a"], ["b"]]);
    // Test last_matched_rules
    assert(gt.lastMatchedRules.length === 4);
    // Test last_has_errors
    assert(gt.lastHasErrors === false);
    gt.transliterate("Xab");
    assert(gt.lastHasErrors === true);
  });
  it("can make a tokenizer pattern", () => {
    let x = new GraphTransliterator({
      tokens: testJSON.tokens,
      rules: testJSON.rules,
      whitespace: testJSON.whitespace
    });
    assert(x.tokenizerPattern.startsWith("(Aa|a|b"));
  });
  it("can make tokensByClass", () => {
    let x = new GraphTransliterator({
      tokens: testJSON.tokens,
      rules: testJSON.rules,
      whitespace: testJSON.whitespace
    });
    assert.deepEqual(gt.tokensByClass, x.tokensByClass);
  });
  it("can make a graph", () => {
    let x = {
      tokens: testJSON.tokens,
      rules: testJSON.rules,
      whitespace: testJSON.whitespace
    };
    let gt = new GraphTransliterator(x);
    console.log(gt.tokensByClass);
  });
});

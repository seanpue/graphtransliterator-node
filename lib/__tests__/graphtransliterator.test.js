/* eslint-disable camelcase */

const assert = require("assert");
const {
  GraphTransliterator,
  NoMatchingTransliterationRuleError,
  UnrecognizableInputTokenError
} = require("../index.js");
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
    assert(x.tokenizerPattern.startsWith("(Aa|"));
    assert(x.tokenizerPattern.endsWith("d)"));
  });
  it("can make tokensByClass", () => {
    let x = new GraphTransliterator({
      tokens: testJSON.tokens,
      rules: testJSON.rules,
      whitespace: testJSON.whitespace
    });
    assert(x.tokensByClass);
  });

  it("can make a graph, onmatchRulesLookup", () => {
    let x = {
      tokens: testJSON.tokens,
      rules: testJSON.rules,
      whitespace: testJSON.whitespace,
      onmatch_rules: testJSON.onmatch_rules
    };
    let gt = new GraphTransliterator(x);
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
    gt.ignoreErrors = true;
    gt.transliterate("Xab");
    assert(gt.lastHasErrors === true);
  });
});
it("can decompress a graph, compression level 1", () => {
  let compressedSettings = {
    graphtransliterator_version: "1.0.7",
    compressed_settings: [
      ["consonant", "whitespace", "vowel"],
      [" ", "a", "b"],
      [[1], [2], [0]],
      [
        ["!B!", [0], [1], [2], [1], [0], -5],
        ["A", 0, 0, [1], 0, 0, -1],
        ["B", 0, 0, [2], 0, 0, -1],
        [" ", 0, 0, [0], 0, 0, -1]
      ],
      [" ", "whitespace", 0],
      [[[2], [2], ","]],
      {
        name: "example",
        version: "1.0.0",
        description: "An Example Bundled Transliterator",
        url:
          "https://github.com/seanpue/graphtransliterator/tree/master/transliterator/sample",
        author: "Author McAuthorson",
        author_email: "author_mcauthorson@msu.edu",
        license: "MIT License",
        keywords: ["example"],
        project_urls: {
          Documentation:
            "https://github.com/seanpue/graphtransliterator/tree/master/graphtransliterator/transliterators/example",
          Source:
            "https://github.com/seanpue/graphtransliterator/tree/graphtransliterator/transliterators/example",
          Tracker: "https://github.com/seanpue/graphtransliterator/issues"
        }
      },
      [
        ["Start", "rule", "token"],
        [
          [0, 0, { "2": [1], "1": [3], "0": [6] }],
          [2, 0, 2, { "-1": [2, 5] }],
          [1, 1, 0],
          [2, 0, 1, { "-1": [4] }],
          [1, 1, 1],
          [1, 1, 2],
          [2, 0, 0, { "-1": [7] }],
          [1, 1, 3]
        ],
        {
          "0": { "1": [0, -5, 2], "3": [0, -1, 1], "6": [0, -1, 0] },
          "1": { "2": [[[0], [1], [1], [0]], -5, -1], "5": [0, -1, -1] },
          "3": { "4": [0, -1, -1] },
          "6": { "7": [0, -1, -1] }
        }
      ]
    ]
  };
  let newGT = new GraphTransliterator(compressedSettings);
  assert(newGT);
  assert(newGT.transliterate("a") === "A");
  assert(newGT.transliterate("aa") === "A,A");
  assert(newGT.transliterate("ab") === "AB");
});
it("can decompress a graph, compression level 2", () => {
  let compressedSettings = {
    graphtransliterator_version: "1.0.7",
    compressed_settings: [
      ["whitespace", "vowel", "consonant"],
      [" ", "a", "b"],
      [[0], [1], [2]],
      [
        ["!B!", [2], [1], [2], [1], [2], -5],
        ["A", 0, 0, [1], 0, 0, -1],
        ["B", 0, 0, [2], 0, 0, -1],
        [" ", 0, 0, [0], 0, 0, -1]
      ],
      [" ", "whitespace", 0],
      [[[1], [1], ","]],
      {
        name: "example",
        version: "1.0.0",
        description: "An Example Bundled Transliterator",
        url:
          "https://github.com/seanpue/graphtransliterator/tree/master/transliterator/sample",
        author: "Author McAuthorson",
        author_email: "author_mcauthorson@msu.edu",
        license: "MIT License",
        keywords: ["example"],
        project_urls: {
          Documentation:
            "https://github.com/seanpue/graphtransliterator/tree/master/graphtransliterator/transliterators/example",
          Source:
            "https://github.com/seanpue/graphtransliterator/tree/graphtransliterator/transliterators/example",
          Tracker: "https://github.com/seanpue/graphtransliterator/issues"
        }
      },
      null
    ]
  };
  let newGT = new GraphTransliterator(compressedSettings);
  assert(newGT);
  assert(newGT.transliterate("a") === "A");
  assert(newGT.transliterate("aa") === "A,A");
  assert(newGT.transliterate("ab") === "AB");
});

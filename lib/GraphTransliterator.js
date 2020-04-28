/* eslint-disable camelcase, max-depth, max-params */

"use strict";
const { DirectedGraph } = require("./graphs");
const { decompressSettings } = require("./compress");
const {
  NoMatchingTransliterationRuleError,
  UnrecognizableInputTokenError
} = require("./errors");

/* Graph-based transliteration tool. */
class GraphTransliterator {
  /**
   * Create a GraphTransliterator.
   * @constructor
   * @param {object} settings
   */
  constructor(settings) {
    /* Add version check here, when necessary. */
    let version = settings.graphtransliterator_version;
    let compressedSettings = settings.compressed_settings;
    if (compressedSettings) {
      settings = decompressSettings(compressedSettings);
      settings.graphtransliterator_version = version;
    }

    this.tokens = settings.tokens;
    this.rules = settings.rules;
    this.tokensByClass =
      settings.tokens_by_class || tokensByClassOf(this.tokens);
    this.tokenizerPattern =
      settings.tokenizer_pattern || tokenizerPatternFrom(this.tokens);
    this.whitespace = settings.whitespace;
    this.onmatchRules = settings.onmatch_rules;
    this.onmatchRulesLookup =
      settings.onmatch_rules_lookup ||
      onmatchRulesLookupOf(this.tokens, this.onmatchRules);
    this.metadata = settings.metadata || {};
    this.graph = settings.graph || graphFrom(this.rules);
    this.ignoreErrors = settings.ignore_errors; /* Somewhat implemented */
    // this.checkAmbiguity = settings.check_ambiguity; /* Not implemented */
    this.version = settings.version;
    this.coverage = settings.coverage;

    this.tokenizer = RegExp(this.tokenizerPattern, "g"); // Use global */
    this.lastRuleKeys = []; // Last matched rules
    this.lastInputDetails = []; // Details of last rules
    this.lastInputTokens = [];
    this.lastRuleKeys = []; // Matched rule keys are saved here
    this.lastHasErrors = false; // True or false
  }

  /**
   * Get the last rules matched.
   * @return {Array}
   */
  get lastMatchedRules() {
    return this.lastRuleKeys.map(el => this.rules[el]);
  }

  /**
   * Get the last tokens matched.
   * @return {Array}
   */
  get lastMatchedRuleTokens() {
    return this.lastRuleKeys.map(el => this.rules[el].tokens);
  }

  /**
   * Check if a token is whitespace.
   * @return {boolean}
   */
  isWhitespace(token) {
    return this.tokens[token].includes(this.whitespace.token_class);
  }

  /**
   * Create a GraphTransliterator from settings.
   * (From Python implementation, can be removed.)
   * @param {object} dictSettings - Compressed on decompressed settings.
   * @returns {GraphTransliterator}
   */
  static fromDict(dictSettings) {
    var settings = dictSettings;
    return new GraphTransliterator(settings);
  }

  /**
   * Tokenize input string.
   * @param {string} input - Input string
   * @return {Array} - match details
   */
  tokenize(input) {
    let tokenizer = this.tokenizer;
    tokenizer.lastIndex = 0;
    var matchDetails = [{ token: this.whitespace.default }];
    var prevWhitespace = true;
    while (tokenizer.lastIndex < input.length) {
      // Save last index incase there is no match
      var lastIndex = tokenizer.lastIndex;
      let match = tokenizer.exec(input);

      // If no match at end of input string,
      // add unmatched

      if (match === null) {
        matchDetails.push({
          matched: false,
          startIndex: lastIndex,
          endIndex: input.length,
          string: input.substring(lastIndex, input.length),
          token: this.whitespace.default // For pattern matching, treat as whitespace
        });
        tokenizer.lastIndex = input.length;
      } else {
        // If token matched but not at last index,
        // add intermediary unmatched

        if (match.index > lastIndex) {
          matchDetails.push({
            matched: false,
            startIndex: lastIndex,
            endIndex: match.index,
            string: input.substring(lastIndex, match.index),
            token: this.whitespace.default
          });
          // Move last index to start of matched token
        }

        // Set token to matched
        let token = match[0];

        // If whitespace is consolidated, replace token with default token
        // and append it to the string of the previous whitespace token details.
        // If it's at the start, add it to the otherwise blank initial whitespace
        // as its string.

        if (this.whitespace.consolidate) {
          if (this.isWhitespace(token)) {
            token = this.whitespace.default;
            if (prevWhitespace) {
              // Add initial whitespace to initial whitespace token details string,
              // which otherwise will not be defined.
              let prevString = matchDetails[matchDetails.length - 1].string;
              matchDetails[matchDetails.length - 1].string = prevString
                ? prevString + match[0]
                : match[0];
              continue;
            } else {
              prevWhitespace = true;
            }
          } else {
            prevWhitespace = false;
          }
        }

        // Add matched token or default whitespace, if consolidate
        matchDetails.push({
          matched: true,
          startIndex: match.index,
          endIndex: tokenizer.lastIndex,
          string: match[0],
          token: token
        });
      }
    }

    /* Pop final whitespace (if matched) and add to string of final whitespace */

    if (
      this.whitespace.consolidate &&
      matchDetails.length > 1 &&
      matchDetails[matchDetails.length - 1].matched === true &&
      this.isWhitespace(matchDetails[matchDetails.length - 1].token)
    ) {
      let x = matchDetails.pop();
      matchDetails.push({ token: this.whitespace.default, string: x.string });
    } else {
      // Add final whitespace
      matchDetails.push({ token: this.whitespace.default });
    }

    return matchDetails;
  }

  /**
   * Check if constraints on target edge from current node
   * are met at tokenIdx of tokens.
   * @param {object} targetEdge
   * @param {object} currNode
   * @param {number} tokenIdx
   * @param {number} tokens
   * @private
   */
  matchConstraints(targetEdge, currNode, tokenIdx, tokens) {
    let constraints = targetEdge.constraints;
    if (constraints === undefined) {
      return true;
    }

    for (let [cType, constraintValues] of Object.entries(constraints)) {
      if (cType === "prev_tokens") {
        let numTokens = this.rules[currNode.rule_key].tokens.length;

        // Presume for rule (a) a, with input "aa"
        // ' ', a, a, ' '  start (token_i=3)
        //             ^
        //         ^       -1 subtract num_tokens
        //      ^          - len(c_value)
        let startAt = tokenIdx;
        startAt -= numTokens;
        startAt -= constraintValues.length;
        if (
          !this.matchTokens(
            startAt,
            constraintValues,
            tokens,
            true,
            false,
            false
          )
        ) {
          return false;
        }
      } else if (cType === "next_tokens") {
        // Presume for rule a (a), with input "aa"
        // ' ', a, a, ' '  start (token_i=2)
        //         ^
        let startAt = tokenIdx;

        if (
          !this.matchTokens(
            startAt,
            constraintValues,
            tokens,
            false,
            true,
            false
          )
        ) {
          return false;
        }
      } else if (cType === "prev_classes") {
        let numTokens = this.rules[currNode.rule_key].tokens.length;
        // Presume for rule (a <class_a>) a, with input "aaa"
        // ' ', a, a, a, ' '
        //                ^     start (token_i=4)
        //            ^         -num_tokens
        //         ^            -len(prev_tokens)
        //  ^                   -len(prev_classes)
        let startAt = tokenIdx;
        startAt -= numTokens;
        let prevTokens = constraints.prev_tokens;
        if (prevTokens) {
          startAt -= prevTokens.length;
        }

        startAt -= constraintValues.length;
        if (
          !this.matchTokens(
            startAt,
            constraintValues,
            tokens,
            true,
            false,
            true
          )
        ) {
          return false;
        }
      } else if (cType === "next_classes") {
        // Presume for rule a (a <class_a>), with input "aaa"
        // ' ', a, a, a, ' '
        //         ^          start (token_i=2)
        //            ^       + len of next_tokens (a)
        let startAt = tokenIdx;
        let nextTokens = constraints.next_tokens;
        if (nextTokens) {
          startAt += nextTokens.length;
        }

        if (
          !this.matchTokens(
            startAt,
            constraintValues,
            tokens,
            false,
            true,
            true
          )
        ) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Check if tokens match according to constraint values at a particular index,
   * optionally checking previous and next tokens and by token class, with
   * boundary checks.
   *
   * @param {number} startIdx
   * @param {Array} constraintValues
   * @param {Array} tokens
   * @param {boolean} checkPrev
   * @param {boolean} checkNext
   * @param {boolean} byClass
   * @private
   */
  matchTokens(
    startIdx,
    constraintValues,
    tokens,
    checkPrev,
    checkNext,
    byClass
  ) {
    if (checkPrev && startIdx < 0) {
      return false;
    }

    if (checkNext && startIdx + constraintValues.length > tokens.length) {
      return false;
    }

    for (let i = 0; i < constraintValues.length; i++) {
      if (byClass) {
        let tokenClasses = this.tokens[tokens[startIdx + i]];
        if (!(tokenClasses && tokenClasses.indexOf(constraintValues[i]) >= 0)) {
          return false;
        }
      } else if (tokens[startIdx + i] !== constraintValues[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Match best (least costly) transliteration rule at a given index in the input 
   * tokens and return the index to  that rule. Optionally, return all rules that match.

   * @param {number} tokenIdx - Location in `tokens` at which to begin
   * @param {Array} tokens List of strings of tokens
   * @param matchAll {boolean} 
   *     If true, return the index of all rules matching at the given index. The default is false.
   * @return (undefined|number|Array) - Index of rule matched or list of rules matched
   */
  matchAt(tokenIdx, tokens, matchAll = false) {
    let graph = this.graph;
    let node = graph.node;
    let edge = graph.edge;
    var matches = [];

    var stack = [];

    function appendChildren(nodeKey, tokenIdx) { // eslint-disable-line
      let children = [];
      let orderedChildren = node[nodeKey].ordered_children;
      if (orderedChildren) {
        children = orderedChildren[tokens[tokenIdx]];
        if (children) {
          // Reordered high to low for stack
          children
            .slice()
            .reverse()
            .forEach(function(childKey) {
              stack.unshift([childKey, nodeKey, tokenIdx]);
            });
        } else {
          let rulesKeys = orderedChildren.__rules__;
          if (rulesKeys) {
            rulesKeys
              .slice()
              .reverse()
              .forEach(function(ruleKey) {
                stack.unshift([ruleKey, nodeKey, tokenIdx]);
              });
          }
        }
      }
    }

    appendChildren(0, tokenIdx); // Append all children of root node
    while (stack.length > 0) {
      let [nodeKey, parentKey, tokenIdx] = stack.shift();
      let currNode = node[nodeKey];
      let incidentEdge = edge[parentKey][nodeKey];
      if (
        currNode.accepting &&
        this.matchConstraints(incidentEdge, currNode, tokenIdx, tokens)
      ) {
        if (matchAll) {
          matches.push(currNode.rule_key);
          continue;
        } else {
          return currNode.rule_key;
        }
      } else {
        if (tokenIdx < tokens.length - 1) {
          tokenIdx += 1;
        }

        appendChildren(nodeKey, tokenIdx);
      }
    }

    if (matchAll) {
      return matches;
    }
  }

  /**
   * Match all tokens at a particular index.
   * @param {number} tokenIdx
   * @param {Array} tokens
   * @return {undefined|Array} List of rule indexes
   */
  matchAllAt(tokenIdx, tokens) {
    return this.matchAt(tokenIdx, tokens, true);
  }

  /**
   * Transliterate an input string into an output string.
   *
   * Whitespace will be temporarily appended to start and end of input string.
   * @param {string} input
   * @return {string} Transliterated input string.
   * @throws {UnrecognizableInputTokenError}
   */
  transliterate(input) {
    let tokenDetails = this.tokenize(input);
    let hasErrors = Boolean(tokenDetails.find(el => el.matched === false));
    if (hasErrors) {
      let errors = tokenDetails.filter(el => el.matched === false);
      let errorMsg =
        "Unrecognized tokens: " +
        errors
          .map(el => '"' + el.string + '" at pos ' + el.startIndex)
          .join(", ") +
        ' of "' +
        input +
        '"';
      if (this.ignoreErrors) {
        console.log(errorMsg);
      } else {
        throw new UnrecognizableInputTokenError(errorMsg);
      }
    }

    let tokens = tokenDetails.map(el => el.token);

    this.lastInputDetails = tokenDetails;
    this.lastInputTokens = tokens;
    this.lastRuleKeys = []; // Matched rule keys are saved here
    this.lastHasErrors = hasErrors; // True or false

    // Adjust for initial whitespace
    let tokenIdx = 1;
    let output = "";

    while (tokenIdx < tokens.length - 1) {
      let ruleKey = this.matchAt(tokenIdx, tokens);
      if (ruleKey === undefined) {
        let errorMsg =
          "No matching transliteration rule at pos " +
          tokenDetails[tokenIdx].startIndex +
          ' of "' +
          input +
          '"';

        if (this.ignoreErrors) {
          console.log(errorMsg); /* Could also log error here */
          tokenIdx += 1;
          continue;
        } else {
          throw new NoMatchingTransliterationRuleError(errorMsg);
        }
      }

      this.lastRuleKeys.push(ruleKey);
      let rule = this.rules[ruleKey];
      let tokensMatched = rule.tokens;
      if (this.onmatchRules) {
        let currMatchRules;
        let prevT = tokens[tokenIdx - 1];
        let currT = tokens[tokenIdx];
        let currTRules = this.onmatchRulesLookup[currT];
        if (currTRules) {
          currMatchRules = currTRules[prevT];
        }

        if (currMatchRules) {
          for (var i = 0; i < currMatchRules.length; i++) {
            let onmatchIdx = currMatchRules[i];
            let onmatch = this.onmatchRules[onmatchIdx];
            // <class_a> <class_a> + <class_b>
            // a a b
            //     ^
            // ^      - len(onmatch.prev_rules)
            if (
              this.matchTokens(
                tokenIdx - onmatch.prev_classes.length,
                onmatch.prev_classes, // Checks last value
                tokens,
                true,
                false,
                true
              ) &&
              this.matchTokens(
                tokenIdx,
                onmatch.next_classes, // Checks first value
                tokens,
                false,
                true,
                true
              )
            ) {
              output += onmatch.production;
              break; // Only match best onmatch rule
            }
          }
        }
      }

      output += rule.production;
      tokenIdx += tokensMatched.length;
    }

    return output;
  }
}

/**
 * Generate a graph from rules.
 * @param {Array} rules
 * @return {DirectedGraph}
 * @private
 */

function graphFrom(rules) {
  let graph = new DirectedGraph();
  graph.addNode({ type: "Start" });
  var parentKey = 0;
  rules.forEach((rule, ruleKey) => {
    parentKey = 0;
    rule.tokens.forEach(token => {
      var parentNode = graph.node[parentKey];
      var tokenChildren = parentNode.token_children || {};
      var tokenNodeKey = tokenChildren[token];
      if (!(tokenNodeKey >= 0)) {
        tokenNodeKey = graph.addNode({ type: "token", token: token })[0];
        graph.addEdge(parentKey, tokenNodeKey, { token: token });
        tokenChildren[token] = tokenNodeKey;
        parentNode.token_children = tokenChildren;
      }

      var currEdge = graph.edge[parentKey][tokenNodeKey];
      var currCost = currEdge.cost || 1;
      if (currCost > rule.cost) {
        currEdge.cost = rule.cost;
      }

      parentKey = tokenNodeKey;
    });
    var ruleNodeKey = graph.addNode({
      type: "rule",
      rule_key: ruleKey,
      accepting: true
    })[0];
    var parentNode = graph.node[parentKey];
    var ruleChildren = parentNode.rule_children || [];
    ruleChildren.push(ruleNodeKey);
    parentNode.rule_children = ruleChildren.sort(
      (a, b) =>
        rules[graph.node[a].rule_key].cost - rules[graph.node[b].rule_key].cost
    );
    var edgeToRule = graph.addEdge(parentKey, ruleNodeKey, { cost: rule.cost });

    var hasConstraints =
      rule.prev_classes ||
      rule.prev_tokens ||
      rule.next_tokens ||
      rule.next_classes;

    if (hasConstraints) {
      let constraints = {};
      if (rule.prev_classes) constraints.prev_classes = rule.prev_classes;
      if (rule.prev_tokens) constraints.prev_tokens = rule.prev_tokens;
      if (rule.next_tokens) constraints.next_tokens = rule.next_tokens;
      if (rule.next_classes) constraints.next_classes = rule.next_classes;
      edgeToRule.constraints = constraints;
    }
  });
  graph.node.forEach((node, nodeKey) => {
    let orderedChildren = {};
    let ruleChildrenKeys = node.rule_children;
    // Add rule childgren to ordered_children dict under '__rules__''
    if (ruleChildrenKeys !== undefined) {
      orderedChildren.__rules__ = ruleChildrenKeys.sort(
        (a, b) =>
          rules[graph.node[a].rule_key].cost -
          rules[graph.node[b].rule_key].cost
      );
      delete node.rule_children;
    }

    let tokenChildren = node.token_children;

    // Add token children to orderedChildren by token
    if (tokenChildren) {
      for (let [token, tokenKey] of Object.entries(tokenChildren)) {
        orderedChildren[token] = [tokenKey];

        // Add rule children there as well
        if (ruleChildrenKeys !== undefined) {
          orderedChildren[token].push(...ruleChildrenKeys);
        }

        // Sort both by cost
        orderedChildren[token].sort(
          (a, b) => graph.edge[nodeKey][a].cost - graph.edge[nodeKey][b].cost
        );
      }

      delete node.token_children;
    }

    node.ordered_children = orderedChildren;
  });
  return graph;
}

function tokensByClassOf(tokens) {
  let output = {};
  for (let [token, tokenClasses] of Object.entries(tokens)) {
    tokenClasses.forEach(function(tokenClass) {
      if (!(tokenClass in output)) output[tokenClass] = new Set();
      output[tokenClass].add(token);
    });
  }

  return output;
}

/*
    """ Creates a dict lookup from current to previous token.

    Returns
    -------
    dict of {str: dict of {str: list of int}}
        Dictionary keyed by current token to previous token containing a list of
        :class:`OnMatchRule` in order that would apply
    """
*/

function onmatchRulesLookupOf(tokens, onmatchRules) {
  if (onmatchRules === undefined) {
    return undefined;
  }

  var onmatchLookup = {};
  onmatchRules.forEach((rule, ruleKey) => {
    for (let [tokenKey, tokenClasses] of Object.entries(tokens)) {
      // If the onmatch rule's next is of that class
      if (tokenClasses.indexOf(rule.next_classes[0]) >= 0) {
        // Iterate through all tokens again
        for (let [prevTokenKey, prevTokenClasses] of Object.entries(tokens)) {
          // If second token is of class of onmatch rule's last prev
          // add the rule to curr -> prev
          if (
            prevTokenClasses.indexOf(
              rule.prev_classes[rule.prev_classes.length - 1]
            ) >= 0
          ) {
            if (!(tokenKey in onmatchLookup)) {
              onmatchLookup[tokenKey] = {};
            }

            let currToken = onmatchLookup[tokenKey];
            if (!(prevTokenKey in currToken)) {
              currToken[prevTokenKey] = [];
            }

            let ruleList = currToken[prevTokenKey];
            ruleList.push(ruleKey);
          }
        }
      }
    }
  });
  return onmatchLookup;
}

function tokenizerPatternFrom(tokens) {
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  let x = Object.keys(tokens).sort(function(a, b) {
    return b.length - a.length || a.localeCompare(b);
  });

  let escapedTokens = x.map(escapeRegExp);
  let output = "(" + escapedTokens.join("|") + ")";
  return output;
}

module.exports = {
  GraphTransliterator
};

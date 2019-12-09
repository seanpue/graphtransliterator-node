/* eslint-disable max-params, max-depth */

"use strict";
class GraphTransliteratorError extends Error {
  /* Not sure if this is best practice in Javascript but will use for now. */
}

class NoMatchingTransliterationRuleError extends GraphTransliteratorError {
  constructor(args) {
    super(args);
    this.name = "NoMatchingTransliterationRuleError";
  }
}

class UnrecognizableInputTokenError extends GraphTransliteratorError {
  constructor(args) {
    super(args);
    this.name = "UnrecognizableInputTokenError";
  }
}

class GraphTransliterator {
  /**
   * Graph-based transliteration tool.
   * @constructor
   * @param {object} tokens
   *   Mapping of tokens to array of token classes.
   * @param {object} rules
   *   Contains production, prev_classes, prev_tokens, tokens, next_tokens, next_classes
   * @return (object)
   */
  constructor(settings) {
    this.tokens = settings.tokens;
    this.rules = settings.rules;
    this.whitespace = settings.whitespace;
    this.onmatchRules = settings.onmatch_rules;
    this.onmatchRulesLookup = settings.onmatch_rules_lookup;
    this.metadata = settings.metadata;
    this.tokensByClass = settings.tokens_by_class;
    this.graph = settings.graph;
    this.tokenizerPattern = settings.tokenizer_pattern;
    this.ignoreErrors = settings.ignore_errors; /* Not implemented */
    this.checkAmbiguity = settings.check_ambiguity; /* Not implemented */
    this.version = settings.version;
    this.coverage = settings.coverage;
    this.tokenizer = RegExp(this.tokenizerPattern, "g"); // Use global */
    this.lastRuleKeys = []; // Last matched rules
    this.lastInputDetails = []; // Details of last rules
    this.lastInputTokens = [];
    this.lastRuleKeys = []; // Matched rule keys are saved here
    this.lastHasErrors = false; // True or false
    /* Add version check here */
  }

  get lastMatchedRules() {
    return this.lastRuleKeys.map(el => this.rules[el]);
  }

  get lastMatchedRuleTokens() {
    return this.lastRuleKeys.map(el => this.rules[el].tokens);
  }

  isWhitespace(token) {
    return this.tokens[token].includes(this.whitespace.token_class);
  }

  static fromDict(dictSettings) {
    /* Could fix nulls here if JSON condensed */
    var settings = dictSettings;
    return new GraphTransliterator(settings);
  }

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

  matchConstraints(targetEdge, currNode, tokenIdx, tokens) {
    let constraints = targetEdge.constraints;
    if (constraints === undefined) {
      return true;
    }

    for (let [cType, cValue] of Object.entries(constraints)) {
      if (cType === "prev_tokens") {
        let numTokens = currNode.rule.tokens.length;

        // Presume for rule (a) a, with input "aa"
        // ' ', a, a, ' '  start (token_i=3)
        //             ^
        //         ^       -1 subtract num_tokens
        //      ^          - len(c_value)
        let startAt = tokenIdx;
        startAt -= numTokens;
        startAt -= cValue.length;
        if (!this.matchTokens(startAt, cValue, tokens, true, false, false)) {
          return false;
        }
      } else if (cType === "next_tokens") {
        // Presume for rule a (a), with input "aa"
        // ' ', a, a, ' '  start (token_i=2)
        //         ^
        let startAt = tokenIdx;

        if (!this.matchTokens(startAt, cValue, tokens, false, true, false)) {
          return false;
        }
      } else if (cType === "prev_classes") {
        let numTokens = currNode.rule.tokens.length;
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

        startAt -= cValue.length;
        if (!this.matchTokens(startAt, cValue, tokens, true, false, true)) {
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

        if (!this.matchTokens(startAt, cValue, tokens, false, true, true)) {
          return false;
        }
      }
    }

    return true;
  }

  matchTokens(startIdx, cValue, tokens, checkPrev, checkNext, byClass) {
    if (checkPrev && startIdx < 0) {
      return false;
    }

    if (checkNext && startIdx + cValue.length > tokens.length) {
      return false;
    }

    for (let i = 0; i < cValue.length; i++) {
      if (byClass) {
        let tokenClasses = this.tokens[tokens[startIdx + i]];
        if (!(tokenClasses && tokenClasses.indexOf(cValue[i]) >= 0)) {
          return false;
        }
      } else if (tokens[startIdx + i] !== cValue[i]) {
        return false;
      }
    }

    return true;
  }

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

  matchAllAt(tokenIdx, tokens) {
    return this.matchAt(tokenIdx, tokens, true);
  }

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
      if (!ruleKey) {
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

module.exports = {
  GraphTransliterator,
  GraphTransliteratorError,
  NoMatchingTransliterationRuleError,
  UnrecognizableInputTokenError
};

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/GraphTransliterator.js":
/*!************************************!*\
  !*** ./lib/GraphTransliterator.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* eslint-disable camelcase, max-depth, max-params */\n\n\nconst { DirectedGraph } = __webpack_require__(/*! ./graphs */ \"./lib/graphs.js\");\nconst { decompressSettings } = __webpack_require__(/*! ./compress */ \"./lib/compress.js\");\nconst {\n  NoMatchingTransliterationRuleError,\n  UnrecognizableInputTokenError\n} = __webpack_require__(/*! ./errors */ \"./lib/errors.js\");\n\n/* Graph-based transliteration tool. */\nclass GraphTransliterator {\n  /**\n   * Create a GraphTransliterator.\n   * @constructor\n   * @param {Object} settings\n   */\n  constructor(settings) {\n    /* Add version check here, when necessary. */\n    let version = settings.graphtransliterator_version;\n    let compressedSettings = settings.compressed_settings;\n    if (compressedSettings) {\n      settings = decompressSettings(compressedSettings);\n      settings.graphtransliterator_version = version;\n    }\n\n    this.tokens = settings.tokens;\n    this.rules = settings.rules;\n    this.tokensByClass =\n      settings.tokens_by_class || tokensByClassOf(this.tokens);\n    this.tokenizerPattern =\n      settings.tokenizer_pattern || tokenizerPatternFrom(this.tokens);\n    this.whitespace = settings.whitespace;\n    this.onmatchRules = settings.onmatch_rules;\n    this.onmatchRulesLookup =\n      settings.onmatch_rules_lookup ||\n      onmatchRulesLookupOf(this.tokens, this.onmatchRules);\n    this.metadata = settings.metadata || {};\n    this.graph = settings.graph || graphFrom(this.rules);\n    this.ignoreErrors = settings.ignore_errors; /* Somewhat implemented */\n    // this.checkAmbiguity = settings.check_ambiguity; /* Not implemented */\n    this.version = settings.version;\n    this.coverage = settings.coverage;\n\n    this.tokenizer = RegExp(this.tokenizerPattern, \"g\"); // Use global */\n    this.lastRuleKeys = []; // Last matched rules\n    this.lastInputDetails = []; // Details of last rules\n    this.lastInputTokens = [];\n    this.lastRuleKeys = []; // Matched rule keys are saved here\n    this.lastHasErrors = false; // True or false\n  }\n\n  /**\n   * Get the last rules matched.\n   * @return {Array}\n   */\n  get lastMatchedRules() {\n    return this.lastRuleKeys.map(el => this.rules[el]);\n  }\n\n  /**\n   * Get the last tokens matched.\n   * @return {Array}\n   */\n  get lastMatchedRuleTokens() {\n    return this.lastRuleKeys.map(el => this.rules[el].tokens);\n  }\n\n  /**\n   * Check if a token is whitespace.\n   * @return {boolean}\n   */\n  isWhitespace(token) {\n    return this.tokens[token].includes(this.whitespace.token_class);\n  }\n\n  /**\n   * Create a GraphTransliterator from settings.\n   * (From Python implementation, can be removed.)\n   * @param {object} dictSettings - Compressed on decompressed settings.\n   * @returns {GraphTransliterator}\n   */\n  static fromDict(dictSettings) {\n    var settings = dictSettings;\n    return new GraphTransliterator(settings);\n  }\n\n  /**\n   * Tokenize input string.\n   * @param {string} input - Input string\n   * @return {Array} - match details\n   */\n  tokenize(input) {\n    let tokenizer = this.tokenizer;\n    tokenizer.lastIndex = 0;\n    var matchDetails = [{ token: this.whitespace.default }];\n    var prevWhitespace = true;\n    while (tokenizer.lastIndex < input.length) {\n      // Save last index incase there is no match\n      var lastIndex = tokenizer.lastIndex;\n      let match = tokenizer.exec(input);\n\n      // If no match at end of input string,\n      // add unmatched\n\n      if (match === null) {\n        matchDetails.push({\n          matched: false,\n          startIndex: lastIndex,\n          endIndex: input.length,\n          string: input.substring(lastIndex, input.length),\n          token: this.whitespace.default // For pattern matching, treat as whitespace\n        });\n        tokenizer.lastIndex = input.length;\n      } else {\n        // If token matched but not at last index,\n        // add intermediary unmatched\n\n        if (match.index > lastIndex) {\n          matchDetails.push({\n            matched: false,\n            startIndex: lastIndex,\n            endIndex: match.index,\n            string: input.substring(lastIndex, match.index),\n            token: this.whitespace.default\n          });\n          // Move last index to start of matched token\n        }\n\n        // Set token to matched\n        let token = match[0];\n\n        // If whitespace is consolidated, replace token with default token\n        // and append it to the string of the previous whitespace token details.\n        // If it's at the start, add it to the otherwise blank initial whitespace\n        // as its string.\n\n        if (this.whitespace.consolidate) {\n          if (this.isWhitespace(token)) {\n            token = this.whitespace.default;\n            if (prevWhitespace) {\n              // Add initial whitespace to initial whitespace token details string,\n              // which otherwise will not be defined.\n              let prevString = matchDetails[matchDetails.length - 1].string;\n              matchDetails[matchDetails.length - 1].string = prevString\n                ? prevString + match[0]\n                : match[0];\n              continue;\n            } else {\n              prevWhitespace = true;\n            }\n          } else {\n            prevWhitespace = false;\n          }\n        }\n\n        // Add matched token or default whitespace, if consolidate\n        matchDetails.push({\n          matched: true,\n          startIndex: match.index,\n          endIndex: tokenizer.lastIndex,\n          string: match[0],\n          token: token\n        });\n      }\n    }\n\n    /* Pop final whitespace (if matched) and add to string of final whitespace */\n\n    if (\n      this.whitespace.consolidate &&\n      matchDetails.length > 1 &&\n      matchDetails[matchDetails.length - 1].matched === true &&\n      this.isWhitespace(matchDetails[matchDetails.length - 1].token)\n    ) {\n      let x = matchDetails.pop();\n      matchDetails.push({ token: this.whitespace.default, string: x.string });\n    } else {\n      // Add final whitespace\n      matchDetails.push({ token: this.whitespace.default });\n    }\n\n    return matchDetails;\n  }\n\n  /**\n   * Check if constraints on target edge from current node\n   * are met at tokenIdx of tokens.\n   * @param {object} targetEdge\n   * @param {object} currNode\n   * @param {number} tokenIdx\n   * @param {number} tokens\n   * @private\n   */\n  matchConstraints(targetEdge, currNode, tokenIdx, tokens) {\n    let constraints = targetEdge.constraints;\n    if (constraints === undefined) {\n      return true;\n    }\n\n    for (let [cType, constraintValues] of Object.entries(constraints)) {\n      if (cType === \"prev_tokens\") {\n        let numTokens = this.rules[currNode.rule_key].tokens.length;\n\n        // Presume for rule (a) a, with input \"aa\"\n        // ' ', a, a, ' '  start (token_i=3)\n        //             ^\n        //         ^       -1 subtract num_tokens\n        //      ^          - len(c_value)\n        let startAt = tokenIdx;\n        startAt -= numTokens;\n        startAt -= constraintValues.length;\n        if (\n          !this.matchTokens(\n            startAt,\n            constraintValues,\n            tokens,\n            true,\n            false,\n            false\n          )\n        ) {\n          return false;\n        }\n      } else if (cType === \"next_tokens\") {\n        // Presume for rule a (a), with input \"aa\"\n        // ' ', a, a, ' '  start (token_i=2)\n        //         ^\n        let startAt = tokenIdx;\n\n        if (\n          !this.matchTokens(\n            startAt,\n            constraintValues,\n            tokens,\n            false,\n            true,\n            false\n          )\n        ) {\n          return false;\n        }\n      } else if (cType === \"prev_classes\") {\n        let numTokens = this.rules[currNode.rule_key].tokens.length;\n        // Presume for rule (a <class_a>) a, with input \"aaa\"\n        // ' ', a, a, a, ' '\n        //                ^     start (token_i=4)\n        //            ^         -num_tokens\n        //         ^            -len(prev_tokens)\n        //  ^                   -len(prev_classes)\n        let startAt = tokenIdx;\n        startAt -= numTokens;\n        let prevTokens = constraints.prev_tokens;\n        if (prevTokens) {\n          startAt -= prevTokens.length;\n        }\n\n        startAt -= constraintValues.length;\n        if (\n          !this.matchTokens(\n            startAt,\n            constraintValues,\n            tokens,\n            true,\n            false,\n            true\n          )\n        ) {\n          return false;\n        }\n      } else if (cType === \"next_classes\") {\n        // Presume for rule a (a <class_a>), with input \"aaa\"\n        // ' ', a, a, a, ' '\n        //         ^          start (token_i=2)\n        //            ^       + len of next_tokens (a)\n        let startAt = tokenIdx;\n        let nextTokens = constraints.next_tokens;\n        if (nextTokens) {\n          startAt += nextTokens.length;\n        }\n\n        if (\n          !this.matchTokens(\n            startAt,\n            constraintValues,\n            tokens,\n            false,\n            true,\n            true\n          )\n        ) {\n          return false;\n        }\n      }\n    }\n\n    return true;\n  }\n\n  /**\n   * Check if tokens match according to constraint values at a particular index,\n   * optionally checking previous and next tokens and by token class, with\n   * boundary checks.\n   *\n   * @param {number} startIdx\n   * @param {Array} constraintValues\n   * @param {Array} tokens\n   * @param {boolean} checkPrev\n   * @param {boolean} checkNext\n   * @param {boolean} byClass\n   * @private\n   */\n  matchTokens(\n    startIdx,\n    constraintValues,\n    tokens,\n    checkPrev,\n    checkNext,\n    byClass\n  ) {\n    if (checkPrev && startIdx < 0) {\n      return false;\n    }\n\n    if (checkNext && startIdx + constraintValues.length > tokens.length) {\n      return false;\n    }\n\n    for (let i = 0; i < constraintValues.length; i++) {\n      if (byClass) {\n        let tokenClasses = this.tokens[tokens[startIdx + i]];\n        if (!(tokenClasses && tokenClasses.indexOf(constraintValues[i]) >= 0)) {\n          return false;\n        }\n      } else if (tokens[startIdx + i] !== constraintValues[i]) {\n        return false;\n      }\n    }\n\n    return true;\n  }\n\n  /**\n   * Match best (least costly) transliteration rule at a given index in the input \n   * tokens and return the index to  that rule. Optionally, return all rules that match.\n\n   * @param {number} tokenIdx - Location in `tokens` at which to begin\n   * @param {Array} tokens List of strings of tokens\n   * @param matchAll {boolean} \n   *     If true, return the index of all rules matching at the given index. The default is false.\n   * @return (undefined|number|Array) - Index of rule matched or list of rules matched\n   */\n  matchAt(tokenIdx, tokens, matchAll = false) {\n    let graph = this.graph;\n    let node = graph.node;\n    let edge = graph.edge;\n    var matches = [];\n\n    var stack = [];\n\n    function appendChildren(nodeKey, tokenIdx) { // eslint-disable-line\n      let children = [];\n      let orderedChildren = node[nodeKey].ordered_children;\n      if (orderedChildren) {\n        children = orderedChildren[tokens[tokenIdx]];\n        if (children) {\n          // Reordered high to low for stack\n          children\n            .slice()\n            .reverse()\n            .forEach(function(childKey) {\n              stack.unshift([childKey, nodeKey, tokenIdx]);\n            });\n        } else {\n          let rulesKeys = orderedChildren.__rules__;\n          if (rulesKeys) {\n            rulesKeys\n              .slice()\n              .reverse()\n              .forEach(function(ruleKey) {\n                stack.unshift([ruleKey, nodeKey, tokenIdx]);\n              });\n          }\n        }\n      }\n    }\n\n    appendChildren(0, tokenIdx); // Append all children of root node\n    while (stack.length > 0) {\n      let [nodeKey, parentKey, tokenIdx] = stack.shift();\n      let currNode = node[nodeKey];\n      let incidentEdge = edge[parentKey][nodeKey];\n      if (\n        currNode.accepting &&\n        this.matchConstraints(incidentEdge, currNode, tokenIdx, tokens)\n      ) {\n        if (matchAll) {\n          matches.push(currNode.rule_key);\n          continue;\n        } else {\n          return currNode.rule_key;\n        }\n      } else {\n        if (tokenIdx < tokens.length - 1) {\n          tokenIdx += 1;\n        }\n\n        appendChildren(nodeKey, tokenIdx);\n      }\n    }\n\n    if (matchAll) {\n      return matches;\n    }\n  }\n\n  /**\n   * Match all tokens at a particular index.\n   * @param {number} tokenIdx\n   * @param {Array} tokens\n   * @return {undefined|Array} List of rule indexes\n   */\n  matchAllAt(tokenIdx, tokens) {\n    return this.matchAt(tokenIdx, tokens, true);\n  }\n\n  /**\n   * Transliterate an input string into an output string.\n   *\n   * Whitespace will be temporarily appended to start and end of input string.\n   * @param {string} input\n   * @return {string} Transliterated input string.\n   * @throws {UnrecognizableInputTokenError}\n   */\n  transliterate(input) {\n    let tokenDetails = this.tokenize(input);\n    let hasErrors = Boolean(tokenDetails.find(el => el.matched === false));\n    if (hasErrors) {\n      let errors = tokenDetails.filter(el => el.matched === false);\n      let errorMsg =\n        \"Unrecognized tokens: \" +\n        errors\n          .map(el => '\"' + el.string + '\" at pos ' + el.startIndex)\n          .join(\", \") +\n        ' of \"' +\n        input +\n        '\"';\n      if (this.ignoreErrors) {\n        console.log(errorMsg);\n      } else {\n        throw new UnrecognizableInputTokenError(errorMsg);\n      }\n    }\n\n    let tokens = tokenDetails.map(el => el.token);\n\n    this.lastInputDetails = tokenDetails;\n    this.lastInputTokens = tokens;\n    this.lastRuleKeys = []; // Matched rule keys are saved here\n    this.lastHasErrors = hasErrors; // True or false\n\n    // Adjust for initial whitespace\n    let tokenIdx = 1;\n    let output = \"\";\n\n    while (tokenIdx < tokens.length - 1) {\n      let ruleKey = this.matchAt(tokenIdx, tokens);\n      if (ruleKey === undefined) {\n        let errorMsg =\n          \"No matching transliteration rule at pos \" +\n          tokenDetails[tokenIdx].startIndex +\n          ' of \"' +\n          input +\n          '\"';\n\n        if (this.ignoreErrors) {\n          console.log(errorMsg); /* Could also log error here */\n          tokenIdx += 1;\n          continue;\n        } else {\n          throw new NoMatchingTransliterationRuleError(errorMsg);\n        }\n      }\n\n      this.lastRuleKeys.push(ruleKey);\n      let rule = this.rules[ruleKey];\n      let tokensMatched = rule.tokens;\n      if (this.onmatchRules) {\n        let currMatchRules;\n        let prevT = tokens[tokenIdx - 1];\n        let currT = tokens[tokenIdx];\n        let currTRules = this.onmatchRulesLookup[currT];\n        if (currTRules) {\n          currMatchRules = currTRules[prevT];\n        }\n\n        if (currMatchRules) {\n          for (var i = 0; i < currMatchRules.length; i++) {\n            let onmatchIdx = currMatchRules[i];\n            let onmatch = this.onmatchRules[onmatchIdx];\n            // <class_a> <class_a> + <class_b>\n            // a a b\n            //     ^\n            // ^      - len(onmatch.prev_rules)\n            if (\n              this.matchTokens(\n                tokenIdx - onmatch.prev_classes.length,\n                onmatch.prev_classes, // Checks last value\n                tokens,\n                true,\n                false,\n                true\n              ) &&\n              this.matchTokens(\n                tokenIdx,\n                onmatch.next_classes, // Checks first value\n                tokens,\n                false,\n                true,\n                true\n              )\n            ) {\n              output += onmatch.production;\n              break; // Only match best onmatch rule\n            }\n          }\n        }\n      }\n\n      output += rule.production;\n      tokenIdx += tokensMatched.length;\n    }\n\n    return output;\n  }\n}\n\n/**\n * Generate a graph from rules.\n * @param {Array} rules\n * @return {DirectedGraph}\n * @private\n */\n\nfunction graphFrom(rules) {\n  let graph = new DirectedGraph();\n  graph.addNode({ type: \"Start\" });\n  var parentKey = 0;\n  rules.forEach((rule, ruleKey) => {\n    parentKey = 0;\n    rule.tokens.forEach(token => {\n      var parentNode = graph.node[parentKey];\n      var tokenChildren = parentNode.token_children || {};\n      var tokenNodeKey = tokenChildren[token];\n      if (!(tokenNodeKey >= 0)) {\n        tokenNodeKey = graph.addNode({ type: \"token\", token: token })[0];\n        graph.addEdge(parentKey, tokenNodeKey, { token: token });\n        tokenChildren[token] = tokenNodeKey;\n        parentNode.token_children = tokenChildren;\n      }\n\n      var currEdge = graph.edge[parentKey][tokenNodeKey];\n      var currCost = currEdge.cost || 1;\n      if (currCost > rule.cost) {\n        currEdge.cost = rule.cost;\n      }\n\n      parentKey = tokenNodeKey;\n    });\n    var ruleNodeKey = graph.addNode({\n      type: \"rule\",\n      rule_key: ruleKey,\n      accepting: true\n    })[0];\n    var parentNode = graph.node[parentKey];\n    var ruleChildren = parentNode.rule_children || [];\n    ruleChildren.push(ruleNodeKey);\n    parentNode.rule_children = ruleChildren.sort(\n      (a, b) =>\n        rules[graph.node[a].rule_key].cost - rules[graph.node[b].rule_key].cost\n    );\n    var edgeToRule = graph.addEdge(parentKey, ruleNodeKey, { cost: rule.cost });\n\n    var hasConstraints =\n      rule.prev_classes ||\n      rule.prev_tokens ||\n      rule.next_tokens ||\n      rule.next_classes;\n\n    if (hasConstraints) {\n      let constraints = {};\n      if (rule.prev_classes) constraints.prev_classes = rule.prev_classes;\n      if (rule.prev_tokens) constraints.prev_tokens = rule.prev_tokens;\n      if (rule.next_tokens) constraints.next_tokens = rule.next_tokens;\n      if (rule.next_classes) constraints.next_classes = rule.next_classes;\n      edgeToRule.constraints = constraints;\n    }\n  });\n  graph.node.forEach((node, nodeKey) => {\n    let orderedChildren = {};\n    let ruleChildrenKeys = node.rule_children;\n    // Add rule childgren to ordered_children dict under '__rules__''\n    if (ruleChildrenKeys !== undefined) {\n      orderedChildren.__rules__ = ruleChildrenKeys.sort(\n        (a, b) =>\n          rules[graph.node[a].rule_key].cost -\n          rules[graph.node[b].rule_key].cost\n      );\n      delete node.rule_children;\n    }\n\n    let tokenChildren = node.token_children;\n\n    // Add token children to orderedChildren by token\n    if (tokenChildren) {\n      for (let [token, tokenKey] of Object.entries(tokenChildren)) {\n        orderedChildren[token] = [tokenKey];\n\n        // Add rule children there as well\n        if (ruleChildrenKeys !== undefined) {\n          orderedChildren[token].push(...ruleChildrenKeys);\n        }\n\n        // Sort both by cost\n        orderedChildren[token].sort(\n          (a, b) => graph.edge[nodeKey][a].cost - graph.edge[nodeKey][b].cost\n        );\n      }\n\n      delete node.token_children;\n    }\n\n    node.ordered_children = orderedChildren;\n  });\n  return graph;\n}\n\nfunction tokensByClassOf(tokens) {\n  let output = {};\n  for (let [token, tokenClasses] of Object.entries(tokens)) {\n    tokenClasses.forEach(function(tokenClass) {\n      if (!(tokenClass in output)) output[tokenClass] = new Set();\n      output[tokenClass].add(token);\n    });\n  }\n\n  return output;\n}\n\n/*\n    \"\"\" Creates a dict lookup from current to previous token.\n\n    Returns\n    -------\n    dict of {str: dict of {str: list of int}}\n        Dictionary keyed by current token to previous token containing a list of\n        :class:`OnMatchRule` in order that would apply\n    \"\"\"\n*/\n\nfunction onmatchRulesLookupOf(tokens, onmatchRules) {\n  if (onmatchRules === undefined) {\n    return undefined;\n  }\n\n  var onmatchLookup = {};\n  onmatchRules.forEach((rule, ruleKey) => {\n    for (let [tokenKey, tokenClasses] of Object.entries(tokens)) {\n      // If the onmatch rule's next is of that class\n      if (tokenClasses.indexOf(rule.next_classes[0]) >= 0) {\n        // Iterate through all tokens again\n        for (let [prevTokenKey, prevTokenClasses] of Object.entries(tokens)) {\n          // If second token is of class of onmatch rule's last prev\n          // add the rule to curr -> prev\n          if (\n            prevTokenClasses.indexOf(\n              rule.prev_classes[rule.prev_classes.length - 1]\n            ) >= 0\n          ) {\n            if (!(tokenKey in onmatchLookup)) {\n              onmatchLookup[tokenKey] = {};\n            }\n\n            let currToken = onmatchLookup[tokenKey];\n            if (!(prevTokenKey in currToken)) {\n              currToken[prevTokenKey] = [];\n            }\n\n            let ruleList = currToken[prevTokenKey];\n            ruleList.push(ruleKey);\n          }\n        }\n      }\n    }\n  });\n  return onmatchLookup;\n}\n\nfunction tokenizerPatternFrom(tokens) {\n  function escapeRegExp(string) {\n    return string.replace(/[.*+?^${}()|[\\]\\\\]/g, \"\\\\$&\");\n  }\n\n  let x = Object.keys(tokens).sort(function(a, b) {\n    return b.length - a.length || a.localeCompare(b);\n  });\n\n  let escapedTokens = x.map(escapeRegExp);\n  let output = \"(\" + escapedTokens.join(\"|\") + \")\";\n  return output;\n}\n\nmodule.exports = {\n  GraphTransliterator\n};\n\n\n//# sourceURL=webpack:///./lib/GraphTransliterator.js?");

/***/ }),

/***/ "./lib/compress.js":
/*!*************************!*\
  !*** ./lib/compress.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* eslint-disable camelcase */\n\n/**\n * Decompress settings.\n *\n * @param {object} compressedSettings\n * @private\n */\nfunction decompressSettings(compressedSettings) {\n  function decompressedCost(x) {\n    // \"\"\"x will be negative.\"\"\"\n    return Math.log2(1 + 1 / (1 - x));\n  }\n\n  function decompressNode(_node) {\n    function decompressedOrderedChildren(index) {\n      let x = _node[index];\n      let out = {};\n      for (let [k, v] of Object.entries(x)) {\n        k = parseInt(k, 10);\n        if (k === -1) {\n          out.__rules__ = v;\n        } else {\n          out[tokenFromId[k]] = v;\n        }\n      }\n\n      return out;\n    }\n\n    let nodeType = nodeTypeFromId[_node[0]];\n    let accepting = _node[1] === 1 || false;\n    let newNode = {};\n    if (nodeType === \"Start\") {\n      newNode = {\n        type: nodeType,\n        accepting: accepting,\n        ordered_children: decompressedOrderedChildren(2)\n      };\n    } else if (nodeType === \"rule\") {\n      newNode = { type: nodeType, accepting: accepting, rule_key: _node[2] };\n    } else if (nodeType === \"token\") {\n      newNode = {\n        type: nodeType,\n        accepting: accepting,\n        token: tokenFromId[_node[2]],\n        ordered_children: decompressedOrderedChildren(3)\n      };\n    }\n\n    return stripEmpty(newNode);\n  }\n\n  function stripEmpty(obj) {\n    /* Operates directly on object */\n    /* this may no longer be necessary due to new compression? */\n    /* Object.keys(obj).forEach(key => {\n      if (obj[key] === null) {\n        delete obj[key];\n      } else if (obj[key] === {}) {\n        delete obj[key];\n      }\n    }); */\n    return obj;\n  }\n\n  function decompressEdgeData(data) {\n    let [_constraints, _cost, _token] = data;\n\n    let out = {};\n\n    function classFromIdsOf(index) {\n      let v = _constraints[index];\n      // If (v === 0) return undefined;\n      return v.map(el => classFromId[el]);\n    }\n\n    function tokenFromIdsOf(index) {\n      let v = _constraints[index];\n      //   Z if (v === 0) return undefined;\n      return v.map(el => tokenFromId[el]);\n    }\n\n    if (_constraints) {\n      // Filter out unused values\n      out.constraints = stripEmpty({\n        prev_classes: classFromIdsOf(0),\n        prev_tokens: classFromIdsOf(1),\n        next_tokens: tokenFromIdsOf(2),\n        next_classes: classFromIdsOf(3)\n      });\n    }\n\n    out.cost = decompressedCost(_cost);\n\n    if (_token !== -1)\n      //  -1 indicates no token\n      out.token = tokenFromId[_token];\n\n    return out;\n  }\n\n  let [\n    classList,\n    tokenList,\n    _tokens, // _ indicates compression\n    _rules,\n    _whitespace,\n    _onmatchRules,\n    metadata,\n    _graph\n  ] = compressedSettings;\n\n  // _tokenList = _token_list; /* Previous cast to list */\n  let tokenFromId = tokenList; // {i: _ for i, _ in enumerate(_token_list)};\n  let classFromId = classList; // {i: _ for i, _ in enumerate(classList)}\n  let tokens = Object.assign(\n    {},\n    ...Object.entries(_tokens).map(([k, v]) => ({\n      [tokenFromId[k]]: v.map(el => classFromId[el])\n    }))\n  );\n  let rules = _rules.map(r => {\n    return {\n      production: r[0],\n      prev_classes: r[1] ? r[1].map(el => classFromId[el]) : [],\n      prev_tokens: r[2] ? r[2].map(el => tokenFromId[el]) : [],\n      tokens: r[3].map(el => tokenFromId[el]),\n      next_tokens: r[4] ? r[4].map(el => tokenFromId[el]) : [],\n      next_classes: r[5] ? r[5].map(el => classFromId[el]) : [],\n      cost: decompressedCost(r[6])\n    };\n  });\n  let whitespace = {\n    default: _whitespace[0],\n    token_class: _whitespace[1],\n    consolidate: _whitespace[2]\n  };\n  let onmatchRules = _onmatchRules\n    ? _onmatchRules.map(r => {\n        return {\n          prev_classes: r[0].map(el => classFromId[el]),\n          next_classes: r[1].map(el => classFromId[el]),\n          production: r[2]\n        };\n      })\n    : undefined;\n  let graph;\n  let nodeTypeFromId;\n  if (_graph) {\n    let [_nodetypeList, _nodes, _edges] = _graph;\n    nodeTypeFromId = _nodetypeList; // {i: _ for i, _ in enumerate(_nodetype_list)}\n    let node = _nodes.map(el => decompressNode(el));\n    let edge = Object.assign(\n      {},\n      ...Object.entries(_edges).map(([k, v]) => ({\n        [k]: Object.assign(\n          {},\n          ...Object.entries(v).map(([tail, _edgeData]) => ({\n            [tail]: decompressEdgeData(_edgeData)\n          }))\n        )\n      }))\n    );\n    graph = { node: node, edge: edge };\n  }\n\n  return {\n    tokens: tokens,\n    rules: rules,\n    whitespace: whitespace,\n    onmatch_rules: onmatchRules,\n    graph: graph,\n    metadata: metadata\n  };\n}\n\nmodule.exports = { decompressSettings };\n\n\n//# sourceURL=webpack:///./lib/compress.js?");

/***/ }),

/***/ "./lib/errors.js":
/*!***********************!*\
  !*** ./lib/errors.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/** Base Graph Transliterator error.\n *  @class GraphTransliteratorError\n *  @extends Error\n **/\nclass GraphTransliteratorError extends Error {}\n\n/** Graph Transliterator no matching transliteration rule error.\n *  @class NoMatchingTransliterationRuleError\n *  @extends GraphTransliteratorError\n */\nclass NoMatchingTransliterationRuleError extends GraphTransliteratorError {\n  constructor(args) {\n    super(args);\n    this.name = \"NoMatchingTransliterationRuleError\";\n  }\n}\n\n/** Graph Transliterator unrecognizable token error.\n *  @class UnrecognizableInputTokenError\n *  @extends GraphTransliteratorError\n */\nclass UnrecognizableInputTokenError extends GraphTransliteratorError {\n  constructor(args) {\n    super(args);\n    this.name = \"UnrecognizableInputTokenError\";\n  }\n}\n\nmodule.exports = {\n  GraphTransliteratorError,\n  NoMatchingTransliterationRuleError,\n  UnrecognizableInputTokenError\n};\n\n\n//# sourceURL=webpack:///./lib/errors.js?");

/***/ }),

/***/ "./lib/graphs.js":
/*!***********************!*\
  !*** ./lib/graphs.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* eslint guard-for-in: \"off\" */\n/* eslint-disable camelcase */\n\n\n\nclass DirectedGraph {\n  /**\n   * Graph data structure used in Graph Transliterator.\n   * @constructor\n   * @param {object} edge\n   *   Mapping from head to tail of edge, holding edge data\n   * @param {Array} node\n   *   Array of node attributes\n   * @param {Array} edge_list\n   *   Array of head and tail of each edge\n   *\n   * @class DirectedGraph\n   */\n  constructor(node, edge, edgeList) {\n    this.node = node ? node : [];\n    this.edge = edge ? edge : {};\n    this.edge_list = edgeList || [];\n\n    if (edge && !edgeList) {\n      for (const headKey in edge) {\n        for (const edgeKey in edge[headKey]) {\n          this.edge_list.push([parseInt(headKey, 10), parseInt(edgeKey, 10)]);\n        }\n      }\n    }\n  }\n\n  /**\n   *\n   * @param {object} nodeData - Attributes for node\n   * @returns {Array.<number, number>} - Index of new node\n   */\n  addNode(nodeData) {\n    if (!nodeData) {\n      nodeData = [];\n    }\n\n    let nodeKey = this.node.length;\n    this.node.push(nodeData);\n    return [nodeKey, this.node[nodeKey]];\n  }\n\n  /**\n   * Add new edge.\n   *\n   * @param {number} head - Index of head of edge\n   * @param {number} tail - Index of tail of edge\n   * @param {Object} edgeData - Attributes of edge\n   * @returns {Object} - Reference to new edge\n   */\n  addEdge(head, tail, edgeData) {\n    if (!edgeData) {\n      edgeData = {};\n    }\n\n    if (!(head in this.edge)) {\n      this.edge[head] = {};\n    }\n\n    this.edge[head][tail] = edgeData;\n    this.edge_list.push([head, tail]);\n    return this.edge[head][tail];\n  }\n}\n\nmodule.exports = { DirectedGraph };\n\n\n//# sourceURL=webpack:///./lib/graphs.js?");

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconst { DirectedGraph } = __webpack_require__(/*! ./graphs */ \"./lib/graphs.js\");\nconst { GraphTransliterator } = __webpack_require__(/*! ./GraphTransliterator */ \"./lib/GraphTransliterator.js\");\nconst {\n  GraphTransliteratorError,\n  NoMatchingTransliterationRuleError,\n  UnrecognizableInputTokenError\n} = __webpack_require__(/*! ./errors.js */ \"./lib/errors.js\");\nconst transliterators = __webpack_require__(/*! ./transliterators/ */ \"./lib/transliterators/index.js\");\nmodule.exports = {\n  DirectedGraph,\n  GraphTransliterator,\n  GraphTransliteratorError,\n  NoMatchingTransliterationRuleError,\n  UnrecognizableInputTokenError,\n  transliterators\n};\n\n\n//# sourceURL=webpack:///./lib/index.js?");

/***/ }),

/***/ "./lib/transliterators sync recursive":
/*!**********************************!*\
  !*** ./lib/transliterators sync ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function webpackEmptyContext(req) {\n\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\te.code = 'MODULE_NOT_FOUND';\n\tthrow e;\n}\nwebpackEmptyContext.keys = function() { return []; };\nwebpackEmptyContext.resolve = webpackEmptyContext;\nmodule.exports = webpackEmptyContext;\nwebpackEmptyContext.id = \"./lib/transliterators sync recursive\";\n\n//# sourceURL=webpack:///./lib/transliterators_sync?");

/***/ }),

/***/ "./lib/transliterators/bundled.js":
/*!****************************************!*\
  !*** ./lib/transliterators/bundled.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { GraphTransliterator } = __webpack_require__(/*! ../GraphTransliterator */ \"./lib/GraphTransliterator.js\");\n\n/**\n * Bundled Transliterator\n *\n * Includes field testsFileName\n *\n * @class BundledTransliterator\n * @extends GraphTransliterator\n */\n// const ${className}Settings = require(\"./${className}.json\");\n// const ${className}Tests = require(\"./${className}_tests.json\");\n\nclass Bundled extends GraphTransliterator {\n  constructor(settings, tests) {\n    super(settings);\n    this.settings = settings;\n    this.tests = tests;\n  }\n}\n\nmodule.exports = { Bundled };\n\n\n//# sourceURL=webpack:///./lib/transliterators/bundled.js?");

/***/ }),

/***/ "./lib/transliterators/index.js":
/*!**************************************!*\
  !*** ./lib/transliterators/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__dirname) {/**\n * Graph Transliterator's bundled transliterators\n *\n * @module transliterators\n *\n */\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst { Bundled } = __webpack_require__(/*! ./bundled.js */ \"./lib/transliterators/bundled.js\");\nmodule.exports = {\n  Bundled,\n  Example: __webpack_require__(\"./lib/transliterators sync recursive\")(path.join(__dirname, \"Example\")),\n  ITRANSDevanagariToUnicode: __webpack_require__(\"./lib/transliterators sync recursive\")(path.join(\n    __dirname,\n    \"ITRANSDevanagariToUnicode\"\n  ))\n};\n\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./lib/transliterators/index.js?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ })

/******/ });
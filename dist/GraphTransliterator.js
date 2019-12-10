var graphtransliterator = /******/ (function(modules) {
  // WebpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)

    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {}
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // Expose the modules object (__webpack_modules__)

  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // Expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // Define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      });
      /******/
    }
    /******/
  }; // Define __esModule on exports

  /******/
  /******/ /******/ __webpack_require__.r = function(exports) {
    /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: "Module"
      });
      /******/
    }

    /******/ Object.defineProperty(exports, "__esModule", { value: true });
    /******/
  }; // Create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require

  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
    value,
    mode
  ) {
    /******/ if (mode & 1) value = __webpack_require__(value);
    /******/ if (mode & 8) return value;
    /******/ if (
      mode & 4 &&
      typeof value === "object" &&
      value &&
      value.__esModule
    )
      return value;
    /******/ var ns = Object.create(null);
    /******/ __webpack_require__.r(ns);
    /******/ Object.defineProperty(ns, "default", {
      enumerable: true,
      value: value
    });
    /******/ if (mode & 2 && typeof value !== "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key];
          }.bind(null, key)
        );
    /******/ return ns;
    /******/
  }; // GetDefaultExport function for compatibility with non-harmony modules

  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module.default;
          }
        : /******/ function getModuleExports() {
            return module;
          };

    /******/ __webpack_require__.d(getter, "a", getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call

  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__

  /******/
  /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return __webpack_require__(
    (__webpack_require__.s = "./lib/GraphTransliterator.js")
  );
  /******/
})(
  /************************************************************************/
  /******/ {
    /***/ "./lib/GraphTransliterator.js":
      /*! ************************************!*\
  !*** ./lib/GraphTransliterator.js ***!
  \************************************/
      /*! no static exports found */
      /***/ function(module, exports, __webpack_require__) {
        "use strict";
        eval(
          '/* eslint-disable max-params, max-depth */\n\n\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }\n\nfunction _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }\n\nfunction isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }\n\nfunction _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nvar GraphTransliteratorError =\n/*#__PURE__*/\nfunction (_Error) {\n  _inherits(GraphTransliteratorError, _Error);\n\n  function GraphTransliteratorError() {\n    _classCallCheck(this, GraphTransliteratorError);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(GraphTransliteratorError).apply(this, arguments));\n  }\n\n  return GraphTransliteratorError;\n}(_wrapNativeSuper(Error));\n\nvar NoMatchingTransliterationRuleError =\n/*#__PURE__*/\nfunction (_GraphTransliteratorE) {\n  _inherits(NoMatchingTransliterationRuleError, _GraphTransliteratorE);\n\n  function NoMatchingTransliterationRuleError(args) {\n    var _this;\n\n    _classCallCheck(this, NoMatchingTransliterationRuleError);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(NoMatchingTransliterationRuleError).call(this, args));\n    _this.name = "NoMatchingTransliterationRuleError";\n    return _this;\n  }\n\n  return NoMatchingTransliterationRuleError;\n}(GraphTransliteratorError);\n\nvar UnrecognizableInputTokenError =\n/*#__PURE__*/\nfunction (_GraphTransliteratorE2) {\n  _inherits(UnrecognizableInputTokenError, _GraphTransliteratorE2);\n\n  function UnrecognizableInputTokenError(args) {\n    var _this2;\n\n    _classCallCheck(this, UnrecognizableInputTokenError);\n\n    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(UnrecognizableInputTokenError).call(this, args));\n    _this2.name = "UnrecognizableInputTokenError";\n    return _this2;\n  }\n\n  return UnrecognizableInputTokenError;\n}(GraphTransliteratorError);\n\nvar GraphTransliterator =\n/*#__PURE__*/\nfunction () {\n  /**\n   * Graph-based transliteration tool.\n   * @constructor\n   * @param {object} tokens\n   *   Mapping of tokens to array of token classes.\n   * @param {object} rules\n   *   Contains production, prev_classes, prev_tokens, tokens, next_tokens, next_classes\n   * @return (object)\n   */\n  function GraphTransliterator(settings) {\n    _classCallCheck(this, GraphTransliterator);\n\n    this.tokens = settings.tokens;\n    this.rules = settings.rules;\n    this.whitespace = settings.whitespace;\n    this.onmatchRules = settings.onmatch_rules;\n    this.onmatchRulesLookup = settings.onmatch_rules_lookup;\n    this.metadata = settings.metadata;\n    this.tokensByClass = settings.tokens_by_class;\n    this.graph = settings.graph;\n    this.tokenizerPattern = settings.tokenizer_pattern;\n    this.ignoreErrors = settings.ignore_errors;\n    /* Not implemented */\n\n    this.checkAmbiguity = settings.check_ambiguity;\n    /* Not implemented */\n\n    this.version = settings.version;\n    this.coverage = settings.coverage;\n    this.tokenizer = RegExp(this.tokenizerPattern, "g"); // Use global */\n\n    this.lastRuleKeys = []; // Last matched rules\n\n    this.lastInputDetails = []; // Details of last rules\n\n    this.lastInputTokens = [];\n    this.lastRuleKeys = []; // Matched rule keys are saved here\n\n    this.lastHasErrors = false; // True or false\n\n    /* Add version check here */\n  }\n\n  _createClass(GraphTransliterator, [{\n    key: "isWhitespace",\n    value: function isWhitespace(token) {\n      return this.tokens[token].includes(this.whitespace.token_class);\n    }\n  }, {\n    key: "tokenize",\n    value: function tokenize(input) {\n      var tokenizer = this.tokenizer;\n      tokenizer.lastIndex = 0;\n      var matchDetails = [{\n        token: this.whitespace["default"]\n      }];\n      var prevWhitespace = true;\n\n      while (tokenizer.lastIndex < input.length) {\n        // Save last index incase there is no match\n        var lastIndex = tokenizer.lastIndex;\n        var match = tokenizer.exec(input); // If no match at end of input string,\n        // add unmatched\n\n        if (match === null) {\n          matchDetails.push({\n            matched: false,\n            startIndex: lastIndex,\n            endIndex: input.length,\n            string: input.substring(lastIndex, input.length),\n            token: this.whitespace["default"] // For pattern matching, treat as whitespace\n\n          });\n          tokenizer.lastIndex = input.length;\n        } else {\n          // If token matched but not at last index,\n          // add intermediary unmatched\n          if (match.index > lastIndex) {\n            matchDetails.push({\n              matched: false,\n              startIndex: lastIndex,\n              endIndex: match.index,\n              string: input.substring(lastIndex, match.index),\n              token: this.whitespace["default"]\n            }); // Move last index to start of matched token\n          } // Set token to matched\n\n\n          var token = match[0]; // If whitespace is consolidated, replace token with default token\n          // and append it to the string of the previous whitespace token details.\n          // If it\'s at the start, add it to the otherwise blank initial whitespace\n          // as its string.\n\n          if (this.whitespace.consolidate) {\n            if (this.isWhitespace(token)) {\n              token = this.whitespace["default"];\n\n              if (prevWhitespace) {\n                // Add initial whitespace to initial whitespace token details string,\n                // which otherwise will not be defined.\n                var prevString = matchDetails[matchDetails.length - 1].string;\n                matchDetails[matchDetails.length - 1].string = prevString ? prevString + match[0] : match[0];\n                continue;\n              } else {\n                prevWhitespace = true;\n              }\n            } else {\n              prevWhitespace = false;\n            }\n          } // Add matched token or default whitespace, if consolidate\n\n\n          matchDetails.push({\n            matched: true,\n            startIndex: match.index,\n            endIndex: tokenizer.lastIndex,\n            string: match[0],\n            token: token\n          });\n        }\n      }\n      /* Pop final whitespace (if matched) and add to string of final whitespace */\n\n\n      if (this.whitespace.consolidate && matchDetails.length > 1 && matchDetails[matchDetails.length - 1].matched === true && this.isWhitespace(matchDetails[matchDetails.length - 1].token)) {\n        var x = matchDetails.pop();\n        matchDetails.push({\n          token: this.whitespace["default"],\n          string: x.string\n        });\n      } else {\n        // Add final whitespace\n        matchDetails.push({\n          token: this.whitespace["default"]\n        });\n      }\n\n      return matchDetails;\n    }\n  }, {\n    key: "matchConstraints",\n    value: function matchConstraints(targetEdge, currNode, tokenIdx, tokens) {\n      var constraints = targetEdge.constraints;\n\n      if (constraints === undefined) {\n        return true;\n      }\n\n      for (var _i = 0, _Object$entries = Object.entries(constraints); _i < _Object$entries.length; _i++) {\n        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),\n            cType = _Object$entries$_i[0],\n            cValue = _Object$entries$_i[1];\n\n        if (cType === "prev_tokens") {\n          var numTokens = currNode.rule.tokens.length; // Presume for rule (a) a, with input "aa"\n          // \' \', a, a, \' \'  start (token_i=3)\n          //             ^\n          //         ^       -1 subtract num_tokens\n          //      ^          - len(c_value)\n\n          var startAt = tokenIdx;\n          startAt -= numTokens;\n          startAt -= cValue.length;\n\n          if (!this.matchTokens(startAt, cValue, tokens, true, false, false)) {\n            return false;\n          }\n        } else if (cType === "next_tokens") {\n          // Presume for rule a (a), with input "aa"\n          // \' \', a, a, \' \'  start (token_i=2)\n          //         ^\n          var _startAt = tokenIdx;\n\n          if (!this.matchTokens(_startAt, cValue, tokens, false, true, false)) {\n            return false;\n          }\n        } else if (cType === "prev_classes") {\n          var _numTokens = currNode.rule.tokens.length; // Presume for rule (a <class_a>) a, with input "aaa"\n          // \' \', a, a, a, \' \'\n          //                ^     start (token_i=4)\n          //            ^         -num_tokens\n          //         ^            -len(prev_tokens)\n          //  ^                   -len(prev_classes)\n\n          var _startAt2 = tokenIdx;\n          _startAt2 -= _numTokens;\n          var prevTokens = constraints.prev_tokens;\n\n          if (prevTokens) {\n            _startAt2 -= prevTokens.length;\n          }\n\n          _startAt2 -= cValue.length;\n\n          if (!this.matchTokens(_startAt2, cValue, tokens, true, false, true)) {\n            return false;\n          }\n        } else if (cType === "next_classes") {\n          // Presume for rule a (a <class_a>), with input "aaa"\n          // \' \', a, a, a, \' \'\n          //         ^          start (token_i=2)\n          //            ^       + len of next_tokens (a)\n          var _startAt3 = tokenIdx;\n          var nextTokens = constraints.next_tokens;\n\n          if (nextTokens) {\n            _startAt3 += nextTokens.length;\n          }\n\n          if (!this.matchTokens(_startAt3, cValue, tokens, false, true, true)) {\n            return false;\n          }\n        }\n      }\n\n      return true;\n    }\n  }, {\n    key: "matchTokens",\n    value: function matchTokens(startIdx, cValue, tokens, checkPrev, checkNext, byClass) {\n      if (checkPrev && startIdx < 0) {\n        return false;\n      }\n\n      if (checkNext && startIdx + cValue.length > tokens.length) {\n        return false;\n      }\n\n      for (var i = 0; i < cValue.length; i++) {\n        if (byClass) {\n          var tokenClasses = this.tokens[tokens[startIdx + i]];\n\n          if (!(tokenClasses && tokenClasses.indexOf(cValue[i]) >= 0)) {\n            return false;\n          }\n        } else if (tokens[startIdx + i] !== cValue[i]) {\n          return false;\n        }\n      }\n\n      return true;\n    }\n  }, {\n    key: "matchAt",\n    value: function matchAt(tokenIdx, tokens) {\n      var matchAll = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n      var graph = this.graph;\n      var node = graph.node;\n      var edge = graph.edge;\n      var matches = [];\n      var stack = [];\n\n      function appendChildren(nodeKey, tokenIdx) {\n        // eslint-disable-line\n        var children = [];\n        var orderedChildren = node[nodeKey].ordered_children;\n\n        if (orderedChildren) {\n          children = orderedChildren[tokens[tokenIdx]];\n\n          if (children) {\n            // Reordered high to low for stack\n            children.slice().reverse().forEach(function (childKey) {\n              stack.unshift([childKey, nodeKey, tokenIdx]);\n            });\n          } else {\n            var rulesKeys = orderedChildren.__rules__;\n\n            if (rulesKeys) {\n              rulesKeys.slice().reverse().forEach(function (ruleKey) {\n                stack.unshift([ruleKey, nodeKey, tokenIdx]);\n              });\n            }\n          }\n        }\n      }\n\n      appendChildren(0, tokenIdx); // Append all children of root node\n\n      while (stack.length > 0) {\n        var _stack$shift = stack.shift(),\n            _stack$shift2 = _slicedToArray(_stack$shift, 3),\n            nodeKey = _stack$shift2[0],\n            parentKey = _stack$shift2[1],\n            _tokenIdx = _stack$shift2[2];\n\n        var currNode = node[nodeKey];\n        var incidentEdge = edge[parentKey][nodeKey];\n\n        if (currNode.accepting && this.matchConstraints(incidentEdge, currNode, _tokenIdx, tokens)) {\n          if (matchAll) {\n            matches.push(currNode.rule_key);\n            continue;\n          } else {\n            return currNode.rule_key;\n          }\n        } else {\n          if (_tokenIdx < tokens.length - 1) {\n            _tokenIdx += 1;\n          }\n\n          appendChildren(nodeKey, _tokenIdx);\n        }\n      }\n\n      if (matchAll) {\n        return matches;\n      }\n    }\n  }, {\n    key: "matchAllAt",\n    value: function matchAllAt(tokenIdx, tokens) {\n      return this.matchAt(tokenIdx, tokens, true);\n    }\n  }, {\n    key: "transliterate",\n    value: function transliterate(input) {\n      var tokenDetails = this.tokenize(input);\n      var hasErrors = Boolean(tokenDetails.find(function (el) {\n        return el.matched === false;\n      }));\n\n      if (hasErrors) {\n        var errors = tokenDetails.filter(function (el) {\n          return el.matched === false;\n        });\n        var errorMsg = "Unrecognized tokens: " + errors.map(function (el) {\n          return \'"\' + el.string + \'" at pos \' + el.startIndex;\n        }).join(", ") + \' of "\' + input + \'"\';\n\n        if (this.ignoreErrors) {\n          console.log(errorMsg);\n        } else {\n          throw new UnrecognizableInputTokenError(errorMsg);\n        }\n      }\n\n      var tokens = tokenDetails.map(function (el) {\n        return el.token;\n      });\n      this.lastInputDetails = tokenDetails;\n      this.lastInputTokens = tokens;\n      this.lastRuleKeys = []; // Matched rule keys are saved here\n\n      this.lastHasErrors = hasErrors; // True or false\n      // Adjust for initial whitespace\n\n      var tokenIdx = 1;\n      var output = "";\n\n      while (tokenIdx < tokens.length - 1) {\n        var ruleKey = this.matchAt(tokenIdx, tokens);\n\n        if (!ruleKey) {\n          var _errorMsg = "No matching transliteration rule at pos " + tokenDetails[tokenIdx].startIndex + \' of "\' + input + \'"\';\n\n          if (this.ignoreErrors) {\n            console.log(_errorMsg);\n            /* Could also log error here */\n\n            tokenIdx += 1;\n            continue;\n          } else {\n            throw new NoMatchingTransliterationRuleError(_errorMsg);\n          }\n        }\n\n        this.lastRuleKeys.push(ruleKey);\n        var rule = this.rules[ruleKey];\n        var tokensMatched = rule.tokens;\n\n        if (this.onmatchRules) {\n          var currMatchRules = void 0;\n          var prevT = tokens[tokenIdx - 1];\n          var currT = tokens[tokenIdx];\n          var currTRules = this.onmatchRulesLookup[currT];\n\n          if (currTRules) {\n            currMatchRules = currTRules[prevT];\n          }\n\n          if (currMatchRules) {\n            for (var i = 0; i < currMatchRules.length; i++) {\n              var onmatchIdx = currMatchRules[i];\n              var onmatch = this.onmatchRules[onmatchIdx]; // <class_a> <class_a> + <class_b>\n              // a a b\n              //     ^\n              // ^      - len(onmatch.prev_rules)\n\n              if (this.matchTokens(tokenIdx - onmatch.prev_classes.length, onmatch.prev_classes, // Checks last value\n              tokens, true, false, true) && this.matchTokens(tokenIdx, onmatch.next_classes, // Checks first value\n              tokens, false, true, true)) {\n                output += onmatch.production;\n                break; // Only match best onmatch rule\n              }\n            }\n          }\n        }\n\n        output += rule.production;\n        tokenIdx += tokensMatched.length;\n      }\n\n      return output;\n    }\n  }, {\n    key: "lastMatchedRules",\n    get: function get() {\n      var _this3 = this;\n\n      return this.lastRuleKeys.map(function (el) {\n        return _this3.rules[el];\n      });\n    }\n  }, {\n    key: "lastMatchedRuleTokens",\n    get: function get() {\n      var _this4 = this;\n\n      return this.lastRuleKeys.map(function (el) {\n        return _this4.rules[el].tokens;\n      });\n    }\n  }], [{\n    key: "fromDict",\n    value: function fromDict(dictSettings) {\n      /* Could fix nulls here if JSON condensed */\n      var settings = dictSettings;\n      return new GraphTransliterator(settings);\n    }\n  }]);\n\n  return GraphTransliterator;\n}();\n\nmodule.exports = {\n  GraphTransliterator: GraphTransliterator,\n  GraphTransliteratorError: GraphTransliteratorError,\n  NoMatchingTransliterationRuleError: NoMatchingTransliterationRuleError,\n  UnrecognizableInputTokenError: UnrecognizableInputTokenError\n};\n\n//# sourceURL=webpack://graphtransliterator/./lib/GraphTransliterator.js?'
        );

        /***/
      }

    /******/
  }
);

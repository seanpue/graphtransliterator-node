/* eslint-disable no-unused-vars */
"use strict";

/** Base Graph Transliterator error.
 *  @class GraphTransliteratorError
 *  @extends Error
 **/
class GraphTransliteratorError extends Error {}

/** Graph Transliterator no matching transliteration rule error.
 *  @class NoMatchingTransliterationRuleError
 *  @extends GraphTransliteratorError
 */
class NoMatchingTransliterationRuleError extends GraphTransliteratorError {
  constructor(args) {
    super(args);
    this.name = "NoMatchingTransliterationRuleError";
  }
}

/** Graph Transliterator unrecognizable token error.
 *  @class UnrecognizableInputTokenError
 *  @extends GraphTransliteratorError
 */
class UnrecognizableInputTokenError extends GraphTransliteratorError {
  constructor(args) {
    super(args);
    this.name = "UnrecognizableInputTokenError";
  }
}

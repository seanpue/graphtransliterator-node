/**
 * A graph-based transliteration tool
 * @module graphtransliterator
 */

"use strict";
const { DirectedGraph } = require("./graphs.js");

const { GraphTransliterator } = require("GraphTransliterator");

const {
  GraphTransliteratorError,
  NoMatchingTransliterationRuleError,
  UnrecognizableInputTokenError
} = require("./errors.js");

const { transliterators } = require("./transliterators");

module.exports = {
  DirectedGraph,
  GraphTransliterator,
  GraphTransliteratorError,
  NoMatchingTransliterationRuleError,
  UnrecognizableInputTokenError,
  transliterators
};
/* Const { ExampleTransliterator } = require("./transliterators/Example");
module.exports.ExampleTransliterator = ExampleTransliterator;
module.exports.transliterators = require("transliterators"); */

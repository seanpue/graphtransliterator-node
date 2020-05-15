/**
 * Graph Transliterator's bundled transliterators
 *
 * @module transliterators
 *
 */
const { Bundled } = require("./bundled.js");
module.exports = {
  Bundled,
  Example: require("./Example"),
  ITRANSDevanagariToUnicode: require("./ITRANSDevanagariToUnicode")
};

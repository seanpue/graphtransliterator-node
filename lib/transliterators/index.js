/**
 * Graph Transliterator's bundled transliterators
 *
 * @module transliterators
 *
 */
const path = require("path");

const { Bundled } = require("./bundled.js");
module.exports = {
  Bundled,
  Example: require(path.join(__dirname, "Example")),
  ITRANSDevanagariToUnicode: require(path.join(
    __dirname,
    "ITRANSDevanagariToUnicode"
  ))
};

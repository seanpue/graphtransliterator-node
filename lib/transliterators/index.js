/**
 * Graph Transliterator's bundled transliterators
 *
 * @module transliterators
 *
 */

const { Bundled } = require("./bundled.js");
/**
 * Example transliterator
 * @class transliteratorsExample
 * @extends BundledTransliterator
 */
module.exports.Example = () => new Bundled("./Example/Example.json");

/**
 * ITRANSDevanagariToUnicode transliterator
 * @class transliteratorsITRANSDevanagariToUnicode
 * @extends BundledTransliterator
 */
module.exports.ITRANSDevanagariToUnicode = () =>
  new Bundled("./ITRANSDevanagariToUnicode/ITRANSDevanagariToUnicode.json");

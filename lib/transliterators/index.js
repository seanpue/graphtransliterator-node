/**
 * Graph Transliterator's bundled transliterators
 *
 * @module transliterators
 *
 */

const { Bundled } = require("./bundled.js");

/**
 * Example transliterator
 * @class transliterators/Example
 * @extends BundledTransliterator
 */
module.exports.Example = () => new Bundled("./Example/Example.json");
/**
 * ITRANSDevanagariToUnicode transliterator
 * @class transliterators/ITRANSDevanagariToUnicode
 * @extends BundledTransliterator
 */
module.exports.ITRANSDevanagariToUnicode = () =>
  new Bundled("./ITRANSDevanagariToUnicode/ITRANSDevanagariToUnicode.json");

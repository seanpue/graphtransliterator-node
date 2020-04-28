/**
 * A graph-based transliteration tool transliterators
 *
 * @module transliterators
 */

const { Bundled } = require("./bundled.js");

module.exports = {
  /**
   * Example transliterator
   * @class transliterators/Example
   * @extends BundledTransliterator
   */
  Example: () => new Bundled("./Example/Example.json")
};

/**
 * ITRANSDevanagariToUnicode transliterator
 * @class transliterators/ITRANSDevanagariToUnicode
 * @extends BundledTransliterator
 */
module.exports.ITRANSDevanagariToUnicode = () =>
  new Bundled("./ITRANSDevanagariToUnicode/ITRANSDevanagariToUnicode.json");

//  ExampleTransliterator: require("./ExampleTransliterator"),
// ITRANSDevanagariToUnicodeTransliterator: require("./ITRANSDevanagariToUnicode")
// };

/* const fs = require("fs");
fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(file => file.isDirectory())
  .forEach(function(subdir) {
    let classn = subdir.name;
    module.exports[classn] = require(`./${classn}/${classn}.js`);
  });
*/

const { Bundled } = require("../bundled.js");

/**
 * ITRANSDevanagariToUnicode transliterator
 *
 * @class transliterators/ITRANSDevanagariToUnicode
 * @extends Bundled
 */

const ITRANSDevanagariToUnicodeSettings = require("./ITRANSDevanagariToUnicode.json");
const ITRANSDevanagariToUnicodeTests = require("./ITRANSDevanagariToUnicode_tests.json");
const ITRANSDevanagariToUnicode = new Bundled(
  ITRANSDevanagariToUnicodeSettings,
  ITRANSDevanagariToUnicodeTests
);

module.exports = ITRANSDevanagariToUnicode;

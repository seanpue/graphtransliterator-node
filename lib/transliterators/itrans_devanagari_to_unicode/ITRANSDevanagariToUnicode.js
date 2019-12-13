const ITRANSDevanagariToUnicodeSettings = require("./itrans_devanagari_to_unicode.json");
const GraphTransliterator = require("../../GraphTransliterator.js").default
  .GraphTransliterator;
const ITRANSDevanagariToUnicodeTransliterator = GraphTransliterator.fromDict(
  ITRANSDevanagariToUnicodeSettings
);
module.exports = ITRANSDevanagariToUnicodeTransliterator;

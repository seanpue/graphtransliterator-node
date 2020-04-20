const ITRANSDevanagariToUnicodeSettings = require("./ITRANSDevanagariToUnicode.json");
const { GraphTransliterator } = require("../../GraphTransliterator");
const ITRANSDevanagariToUnicodeTransliterator = GraphTransliterator.fromDict(
  ITRANSDevanagariToUnicodeSettings
);
module.exports = ITRANSDevanagariToUnicodeTransliterator;

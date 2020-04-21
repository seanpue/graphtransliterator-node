const ITRANSDevanagariToUnicodeSettings = require("./ITRANSDevanagariToUnicode.json");
const { GraphTransliterator } = require("../../GraphTransliterator.js");
const ITRANSDevanagariToUnicodeTransliterator = GraphTransliterator.fromDict(
  ITRANSDevanagariToUnicodeSettings
);
module.exports = ITRANSDevanagariToUnicodeTransliterator;

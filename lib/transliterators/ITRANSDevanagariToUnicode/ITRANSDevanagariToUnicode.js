const { GraphTransliterator } = require("../../GraphTransliterator.js");
const ITRANSDevanagariToUnicodeSettings = require("./ITRANSDevanagariToUnicode.json");
const ITRANSDevanagariToUnicodeTransliterator = GraphTransliterator.fromDict(
  ITRANSDevanagariToUnicodeSettings
);
module.exports = ITRANSDevanagariToUnicodeTransliterator;

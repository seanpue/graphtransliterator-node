const ExampleSettings = require("./Example.json");
const { GraphTransliterator } = require("../../GraphTransliterator.js");
const ExampleTransliterator = GraphTransliterator.fromDict(ExampleSettings);
module.exports = ExampleTransliterator;

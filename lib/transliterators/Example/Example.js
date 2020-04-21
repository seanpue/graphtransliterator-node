const { GraphTransliterator } = require("../../GraphTransliterator.js");
const ExampleSettings = require("./Example.json");
const ExampleTransliterator = GraphTransliterator.fromDict(ExampleSettings);
module.exports = ExampleTransliterator;

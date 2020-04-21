const ExampleSettings = require("Example.json");
const { GraphTransliterator } = require("../../GraphTransliterator");
const ExampleTransliterator = GraphTransliterator.fromDict(ExampleSettings);
module.exports = ExampleTransliterator;

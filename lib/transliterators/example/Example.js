const ExampleSettings = require("./example.json");
const GraphTransliterator = require("../../GraphTransliterator.js").default
  .GraphTransliterator;
const ExampleTransliterator = GraphTransliterator.fromDict(ExampleSettings);
module.exports = ExampleTransliterator;

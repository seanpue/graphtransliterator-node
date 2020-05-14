const { Bundled } = require("../bundled.js");

/**
 * Example transliterator
 *
 * @class transliterators/Example
 * @extends Bundled
 */

const ExampleSettings = require("./Example.json");
const ExampleTests = require("./Example_tests.json");
const Example = new Bundled(ExampleSettings, ExampleTests);

module.exports = Example;

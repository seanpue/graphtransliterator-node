const { GraphTransliterator } = require("../GraphTransliterator");

/**
 * Bundled Transliterator
 *
 * Includes field testsFileName
 *
 * @class BundledTransliterator
 * @extends GraphTransliterator
 */
// const ${className}Settings = require("./${className}.json");
// const ${className}Tests = require("./${className}_tests.json");

class Bundled extends GraphTransliterator {
  constructor(settings, tests) {
    super(settings);
    this.settings = settings;
    this.tests = tests;
  }
}

module.exports = { Bundled };

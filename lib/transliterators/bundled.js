const { GraphTransliterator } = require("../GraphTransliterator");

/**
 * Bundled Transliterator
 * @class BundledTransliterator
 * @extends GraphTransliterator
 */
class Bundled extends GraphTransliterator {
  constructor(filen) {
    let settings = require(filen);
    super(settings);
  }
}

module.exports = { Bundled };

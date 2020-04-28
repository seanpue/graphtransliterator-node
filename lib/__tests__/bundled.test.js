const assert = require("assert");

const { Bundled } = require("../transliterators/bundled");

describe("Bundled", () => {
  it("can be created.", () => {
    let transliterator = new Bundled("../transliterators/Example/Example.json");
    assert(transliterator);
  });
});
